// src/lib/storage.ts
import { StudentTopicProgress, CurriculumTrack } from '../types/math';

const DB_NAME = 'MathVerseDB';
const DB_VERSION = 1;
const STORE_NAME = 'student_progress';

/**
 * Membuka koneksi IndexedDB dengan penanganan skema dan indeks.
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB tidak didukung pada lingkungan ini.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'challengeId' });

        // Indeks untuk memfilter progres berdasarkan kurikulum, jenjang, atau status selesai
        store.createIndex('curriculum', 'curriculum', { unique: false });
        store.createIndex('stage', 'stage', { unique: false });
        store.createIndex('completed', 'completed', { unique: false });
        store.createIndex('curriculum_stage', ['curriculum', 'stage'], { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      console.warn('Koneksi IndexedDB terblokir oleh tab/jendela lain.');
    };
  });
};

/**
 * Menyimpan atau memperbarui riwayat progres tantangan siswa.
 */
export const saveProgress = async (progress: StudentTopicProgress): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const request = store.put(progress);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
};

/**
 * Mengambil satu data progres berdasarkan ID tantangan.
 */
export const getProgressById = async (challengeId: string): Promise<StudentTopicProgress | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const request = store.get(challengeId);

    request.onsuccess = () => {
      resolve((request.result as StudentTopicProgress) || null);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
};

/**
 * Mengambil seluruh data progres siswa dalam bentuk kamus (Record<challengeId, StudentTopicProgress>).
 */
export const getAllProgress = async (): Promise<Record<string, StudentTopicProgress>> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      const records: Record<string, StudentTopicProgress> = {};
      const results = request.result as StudentTopicProgress[];

      results.forEach((item) => {
        records[item.challengeId] = item;
      });

      resolve(records);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
};

/**
 * Mengambil daftar progres berdasarkan kurikulum tertentu (Cambridge / IB).
 */
export const getProgressByCurriculum = async (
  curriculum: CurriculumTrack
): Promise<StudentTopicProgress[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('curriculum');

    const request = index.getAll(IDBKeyRange.only(curriculum));

    request.onsuccess = () => {
      resolve(request.result as StudentTopicProgress[]);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
};

/**
 * Mengambil daftar progres berdasarkan kurikulum dan jenjang spesifik (misal: Cambridge + Stage 1).
 */
export const getProgressByStage = async (
  curriculum: CurriculumTrack,
  stage: string
): Promise<StudentTopicProgress[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('curriculum_stage');

    const request = index.getAll(IDBKeyRange.only([curriculum, stage]));

    request.onsuccess = () => {
      resolve(request.result as StudentTopicProgress[]);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
};

/**
 * Menghapus seluruh riwayat progres (reset total data belajar lokal).
 */
export const clearAllProgress = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
};

/**
 * Mengekspor seluruh riwayat progres ke dalam string JSON terenkapsulasi (fitur backup/guru).
 */
export const exportProgressJSON = async (): Promise<string> => {
  const allRecords = await getAllProgress();
  return JSON.stringify(
    {
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      data: allRecords,
    },
    null,
    2
  );
};

/**
 * Mengimpor riwayat progres dari string format JSON ke dalam IndexedDB.
 */
export const importProgressJSON = async (jsonString: string): Promise<boolean> => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.data || typeof parsed.data !== 'object') {
      throw new Error('Format berkas progres tidak valid.');
    }

    const items = Object.values(parsed.data) as StudentTopicProgress[];
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      items.forEach((item) => {
        if (item.challengeId) {
          store.put(item);
        }
      });

      tx.oncomplete = () => {
        db.close();
        resolve(true);
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error('Gagal mengimpor data progres:', error);
    return false;
  }
};
