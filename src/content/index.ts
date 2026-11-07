// src/content/index.ts
import { Challenge, CurriculumTrack, Topic, CurriculumMetadata } from '../types/math';
import { CAMBRIDGE_EARLY_YEARS } from './cambridge/early-years';
import { CAMBRIDGE_STAGE_1_TOPICS } from './cambridge/stage-1';

// ============================================================================
// 1. CAMBRIDGE EARLY YEARS (K-LEVEL) - DUA TOPIK @ 10 LEVEL
// ============================================================================

export const CAMBRIDGE_EARLY_YEARS_TOPICS: Topic[] = [
  // Topik 1: Pengenalan Bilangan 1–10 (10 Level dari berkas cambridge/early-years.ts)
  {
    id: 'cam-ey-topic-basics',
    title: 'Topik 1: Pengenalan Bilangan 1–10',
    description: 'Membilang visual, subitizing, paritas, dan kuantitas kepingan 1 hingga 10.',
    challenges: CAMBRIDGE_EARLY_YEARS,
  },

  // Topik 2: Pasangan Bilangan Menuju 10 (10 Level Mandiri)
  {
    id: 'cam-ey-topic-bonds',
    title: 'Topik 2: Ikatan Bilangan (Number Bonds)',
    description: 'Menemukan pasangan dekomposisi dua kepingan untuk membentuk nilai target.',
    challenges: [
      {
        id: 'cam-ey-t2-lv01',
        moduleCode: 'CAM-EY-BND-01',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'concrete',
        title: 'Misi 1: Pasangan Bilangan 3',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat total 3!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat total tiga!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Padukan keping 2 (biru muda) dan keping 1 (oranye).',
          speechText: 'Padukan keping dua biru muda dan keping satu oranye.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 3, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2],
      },
      {
        id: 'cam-ey-t2-lv02',
        moduleCode: 'CAM-EY-BND-02',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'concrete',
        title: 'Misi 2: Pasangan Bilangan 4',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat angka 4!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat angka empat!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan keping 3 dan 1, atau gunakan dua keping 2.',
          speechText: 'Pasangkan keping tiga dan satu, atau gunakan dua keping dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 4, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3],
      },
      {
        id: 'cam-ey-t2-lv03',
        moduleCode: 'CAM-EY-BND-03',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'concrete',
        title: 'Misi 3: Pasangan Bilangan 5',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat jumlah 5!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat jumlah lima!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan keping 4 dan 1, atau keping 3 dan 2.',
          speechText: 'Pasangkan keping empat dan satu, atau keping tiga dan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 5, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4],
      },
      {
        id: 'cam-ey-t2-lv04',
        moduleCode: 'CAM-EY-BND-04',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'concrete',
        title: 'Misi 4: Pasangan Bilangan 6',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk menyusun nilai 6!',
          speechText: 'Gunakan tepat dua keping Numicon untuk menyusun nilai enam!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Padukan keping 5 dan 1, 4 dan 2, atau dua keping 3.',
          speechText: 'Padukan keping lima dan satu, empat dan dua, atau dua keping tiga.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 6, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 5],
      },
      {
        id: 'cam-ey-t2-lv05',
        moduleCode: 'CAM-EY-BND-05',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'pictorial',
        title: 'Misi 5: Pasangan Bilangan 7',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk mencapai jumlah 7!',
          speechText: 'Gunakan tepat dua keping Numicon untuk mencapai jumlah tujuh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Kombinasikan keping 6 dan 1, 5 dan 2, atau 4 dan 3.',
          speechText: 'Kombinasikan keping enam dan satu, lima dan dua, atau empat dan tiga.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 7, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 5, 6],
      },
      {
        id: 'cam-ey-t2-lv06',
        moduleCode: 'CAM-EY-BND-06',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'pictorial',
        title: 'Misi 6: Pasangan Bilangan 8',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat nilai 8!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat nilai delapan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan keping 7 dan 1, 6 dan 2, 5 dan 3, atau dua keping 4.',
          speechText: 'Pasangkan keping tujuh dan satu, enam dan dua, lima dan tiga, atau dua keping empat.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 8, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        id: 'cam-ey-t2-lv07',
        moduleCode: 'CAM-EY-BND-07',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'pictorial',
        title: 'Misi 7: Pasangan Bilangan 9',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk menghasilkan total 9!',
          speechText: 'Gunakan tepat dua keping Numicon untuk menghasilkan total sembilan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gabungkan keping 8 dan 1, 7 dan 2, 6 dan 3, atau 5 dan 4.',
          speechText: 'Gabungkan keping delapan dan satu, tujuh dan dua, enam dan tiga, atau lima dan empat.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 9, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        id: 'cam-ey-t2-lv08',
        moduleCode: 'CAM-EY-BND-08',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'abstract',
        title: 'Misi 8: Pasangan Bilangan 10',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat angka 10!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat angka sepuluh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan keping 7 dengan 3, keping 6 dengan 4, atau keping 8 dengan 2.',
          speechText: 'Pasangkan keping tujuh dengan tiga, keping enam dengan empat, atau keping delapan dengan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 10, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 6, 7, 8, 9],
      },
      {
        id: 'cam-ey-t2-lv09',
        moduleCode: 'CAM-EY-BND-09',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'abstract',
        title: 'Misi 9: Kembar Sepuluh (Doubles 5)',
        instruction: {
          text: 'Gunakan 2 keping kembar bernilai sama untuk membentuk angka 10!',
          speechText: 'Gunakan dua keping kembar bernilai sama untuk membentuk angka sepuluh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan dua keping merah bernilai 5.',
          speechText: 'Gunakan dua keping merah bernilai lima.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 10, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [3, 4, 5, 6],
      },
      {
        id: 'cam-ey-t2-lv10',
        moduleCode: 'CAM-EY-BND-10',
        curriculum: 'cambridge',
        stage: 'Early Years',
        topicId: 'cam-ey-topic-bonds',
        phase: 'abstract',
        title: 'Misi 10: Dekomposisi 3 Keping Menuju 10',
        instruction: {
          text: 'Gunakan tepat 3 keping Numicon untuk membentuk total 10!',
          speechText: 'Gunakan tepat tiga keping Numicon untuk membentuk total sepuluh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Contohnya gabungan keping 5, 3, dan 2, atau keping 4, 4, dan 2.',
          speechText: 'Contohnya gabungan keping lima, tiga, dan dua, atau keping empat, empat, dan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 10, minPiecesAllowed: 3, maxPiecesAllowed: 3 },
        availableTrayPieces: [1, 2, 3, 4, 5],
      },
    ],
  },
];

// ============================================================================
// 2. IB EARLY YEARS (OXFORD PYP KINDERGARTEN) - DUA TOPIK @ 10 LEVEL
// ============================================================================

export const IB_EARLY_YEARS_TOPICS: Topic[] = [
  // Topik 1: Unit 1 - Number & Place Value (1–10)
  {
    id: 'ib-ey-topic-placevalue',
    title: 'Topik 1: Number & Place Value (1–10)',
    description: 'Eksplorasi kuantitas konkret, subitizing, dan membilang visual 1 hingga 10.',
    challenges: [
      {
        id: 'ib-ey-t1-lv01',
        moduleCode: 'IB-EY-U1-01',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'concrete',
        title: 'Misi 1: Mengenal Angka 1',
        instruction: {
          text: 'Tarik kepingan bernilai 1 ke atas papan kanvas!',
          speechText: 'Tarik kepingan bernilai satu ke atas papan kanvas!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pilih keping oranye dengan tepat 1 lubang.',
          speechText: 'Pilih keping oranye dengan tepat satu lubang.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 1, maxPiecesAllowed: 1 },
        availableTrayPieces: [1, 2, 3],
      },
      {
        id: 'ib-ey-t1-lv02',
        moduleCode: 'IB-EY-U1-02',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'concrete',
        title: 'Misi 2: Pasangan Bilangan 2',
        instruction: {
          text: 'Susun kepingan hingga menghasilkan total 2 lubang!',
          speechText: 'Susun kepingan hingga menghasilkan total dua lubang!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping 2 biru muda, atau dua keping 1.',
          speechText: 'Gunakan keping dua biru muda, atau dua keping satu.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 2 },
        availableTrayPieces: [1, 2, 3],
      },
      {
        id: 'ib-ey-t1-lv03',
        moduleCode: 'IB-EY-U1-03',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'concrete',
        title: 'Misi 3: Eksplorasi Kuantitas 3',
        instruction: {
          text: 'Tarik kepingan hingga total di papan tepat bernilai 3!',
          speechText: 'Tarik kepingan hingga total di papan tepat bernilai tiga!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Ambil keping kuning 3, atau gabungan keping 2 dan 1.',
          speechText: 'Ambil keping kuning tiga, atau gabungan keping dua dan satu.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 3 },
        availableTrayPieces: [1, 2, 3],
      },
      {
        id: 'ib-ey-t1-lv04',
        moduleCode: 'IB-EY-U1-04',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'concrete',
        title: 'Misi 4: Membentuk Angka 4',
        instruction: {
          text: 'Buatlah total 4 lubang di atas papan bermain!',
          speechText: 'Buatlah total empat lubang di atas papan bermain!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping hijau muda 4, atau dua keping 2.',
          speechText: 'Gunakan keping hijau muda empat, atau dua keping dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 4 },
        availableTrayPieces: [1, 2, 3, 4],
      },
      {
        id: 'ib-ey-t1-lv05',
        moduleCode: 'IB-EY-U1-05',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'concrete',
        title: 'Misi 5: Patokan Lima (Five-Frame)',
        instruction: {
          text: 'Tarik kepingan ke papan sampai tepat bernilai 5!',
          speechText: 'Tarik kepingan ke papan sampai tepat bernilai lima!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Ambil keping merah 5, atau gabungkan keping 3 dan 2.',
          speechText: 'Ambil keping merah lima, atau gabungkan keping tiga dan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 5 },
        availableTrayPieces: [1, 2, 3, 4, 5],
      },
      {
        id: 'ib-ey-t1-lv06',
        moduleCode: 'IB-EY-U1-06',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'pictorial',
        title: 'Misi 6: Mengenal Kuantitas 6',
        instruction: {
          text: 'Susun kepingan hingga mencapai nilai 6 lubang!',
          speechText: 'Susun kepingan hingga mencapai nilai enam lubang!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pilih keping cyan 6, atau satukan dua keping 3.',
          speechText: 'Pilih keping cyan enam, atau satukan dua keping tiga.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 6 },
        availableTrayPieces: [1, 2, 3, 4, 5, 6],
      },
      {
        id: 'ib-ey-t1-lv07',
        moduleCode: 'IB-EY-U1-07',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'pictorial',
        title: 'Misi 7: Mengenal Kuantitas 7',
        instruction: {
          text: 'Susun kepingan hingga total lubang bernilai 7!',
          speechText: 'Susun kepingan hingga total lubang bernilai tujuh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping merah muda 7, atau padukan keping 5 dan 2.',
          speechText: 'Gunakan keping merah muda tujuh, atau padukan keping lima dan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 7 },
        availableTrayPieces: [1, 2, 3, 4, 5, 7],
      },
      {
        id: 'ib-ey-t1-lv08',
        moduleCode: 'IB-EY-U1-08',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'pictorial',
        title: 'Misi 8: Mengenal Kuantitas 8',
        instruction: {
          text: 'Bentuk nilai 8 di papan menggunakan kepingan Numicon!',
          speechText: 'Bentuk nilai delapan di papan menggunakan kepingan Numicon!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping hijau tua 8, atau padukan dua keping 4.',
          speechText: 'Gunakan keping hijau tua delapan, atau padukan dua keping empat.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 8 },
        availableTrayPieces: [2, 3, 4, 5, 6, 8],
      },
      {
        id: 'ib-ey-t1-lv09',
        moduleCode: 'IB-EY-U1-09',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'abstract',
        title: 'Misi 9: Mengenal Kuantitas 9',
        instruction: {
          text: 'Susun kepingan hingga mencapai total nilai 9!',
          speechText: 'Susun kepingan hingga mencapai total nilai sembilan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Ambil keping ungu 9, atau gabungkan keping 5 dan 4.',
          speechText: 'Ambil keping ungu sembilan, atau gabungkan keping lima dan empat.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 9 },
        availableTrayPieces: [1, 2, 3, 4, 5, 9],
      },
      {
        id: 'ib-ey-t1-lv10',
        moduleCode: 'IB-EY-U1-10',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-placevalue',
        phase: 'abstract',
        title: 'Misi 10: Bingkai Penuh 10 (Ten-Frame)',
        instruction: {
          text: 'Tarik kepingan hingga memenuhi jumlah 10 lubang!',
          speechText: 'Tarik kepingan hingga memenuhi jumlah sepuluh lubang!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping 10 biru tua langsung, atau gabungkan dua keping 5.',
          speechText: 'Gunakan keping sepuluh biru tua langsung, atau gabungkan dua keping lima.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 10 },
        availableTrayPieces: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ],
  },

  // Topik 2: Unit 1 - Adding to 10 & Number Bonds
  {
    id: 'ib-ey-topic-bonds',
    title: 'Topik 2: Adding to 10 & Number Bonds',
    description: 'Inkuiri relasi penjumlahan, pasangan bilangan, dan dekomposisi keping.',
    challenges: [
      {
        id: 'ib-ey-t2-lv01',
        moduleCode: 'IB-EY-BND-01',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'concrete',
        title: 'Misi 1: Pasangan Bilangan 4',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat angka 4!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat angka empat!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan keping 3 dan 1, atau gunakan dua keping 2.',
          speechText: 'Pasangkan keping tiga dan satu, atau gunakan dua keping dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 4, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3],
      },
      {
        id: 'ib-ey-t2-lv02',
        moduleCode: 'IB-EY-BND-02',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'concrete',
        title: 'Misi 2: Pasangan Bilangan 5',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat jumlah 5!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat jumlah lima!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan keping 4 dengan 1, atau keping 3 dengan 2.',
          speechText: 'Pasangkan keping empat dengan satu, atau keping tiga dengan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 5, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4],
      },
      {
        id: 'ib-ey-t2-lv03',
        moduleCode: 'IB-EY-BND-03',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'concrete',
        title: 'Misi 3: Pasangan Bilangan 6',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk menyusun nilai 6!',
          speechText: 'Gunakan tepat dua keping Numicon untuk menyusun nilai enam!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Padukan keping 5 dengan 1, 4 dengan 2, atau dua keping 3.',
          speechText: 'Padukan keping lima dengan satu, empat dengan dua, atau dua keping tiga.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 6, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 5],
      },
      {
        id: 'ib-ey-t2-lv04',
        moduleCode: 'IB-EY-BND-04',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'pictorial',
        title: 'Misi 4: Pasangan Bilangan 7',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk mencapai jumlah 7!',
          speechText: 'Gunakan tepat dua keping Numicon untuk mencapai jumlah tujuh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Coba kombinasikan keping 6 dan 1, 5 dan 2, atau 4 dan 3.',
          speechText: 'Coba kombinasikan keping enam dan satu, lima dan dua, atau empat dan tiga.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 7, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 5, 6],
      },
      {
        id: 'ib-ey-t2-lv05',
        moduleCode: 'IB-EY-BND-05',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'pictorial',
        title: 'Misi 5: Pasangan Bilangan 8',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk membuat nilai 8!',
          speechText: 'Gunakan tepat dua keping Numicon untuk membuat nilai delapan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan 7 dan 1, 6 dan 2, 5 dan 3, atau dua keping 4.',
          speechText: 'Pasangkan tujuh dan satu, enam dan dua, lima dan tiga, atau dua keping empat.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 8, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 5, 6, 7],
      },
      {
        id: 'ib-ey-t2-lv06',
        moduleCode: 'IB-EY-BND-06',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'pictorial',
        title: 'Misi 6: Pasangan Bilangan 9',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon untuk menghasilkan total 9!',
          speechText: 'Gunakan tepat dua keping Numicon untuk menghasilkan total sembilan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gabungkan keping 8 dan 1, 7 dan 2, 6 dan 3, atau 5 dan 4.',
          speechText: 'Gabungkan keping delapan dan satu, tujuh dan dua, enam dan tiga, atau lima dan empat.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 9, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        id: 'ib-ey-t2-lv07',
        moduleCode: 'IB-EY-BND-07',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'abstract',
        title: 'Misi 7: Pasangan Bilangan 10 (Bagian 1)',
        instruction: {
          text: 'Gunakan tepat 2 keping untuk melengkapi angka 10!',
          speechText: 'Gunakan tepat dua keping untuk melengkapi angka sepuluh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan keping 9 dan 1, atau 8 dan 2.',
          speechText: 'Pasangkan keping sembilan dan satu, atau delapan dan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 10, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [1, 2, 8, 9],
      },
      {
        id: 'ib-ey-t2-lv08',
        moduleCode: 'IB-EY-BND-08',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'abstract',
        title: 'Misi 8: Pasangan Bilangan 10 (Bagian 2)',
        instruction: {
          text: 'Gunakan tepat 2 keping Numicon lain untuk membuat angka 10!',
          speechText: 'Gunakan tepat dua keping Numicon lain untuk membuat angka sepuluh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Pasangkan keping 7 dengan 3, atau keping 6 dengan 4.',
          speechText: 'Pasangkan keping tujuh dengan tiga, atau keping enam dengan empat.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 10, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [3, 4, 6, 7],
      },
      {
        id: 'ib-ey-t2-lv09',
        moduleCode: 'IB-EY-BND-09',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'abstract',
        title: 'Misi 9: Kembar Pasangan 10 (Doubles)',
        instruction: {
          text: 'Gunakan 2 keping kembar bernilai sama untuk membentuk 10!',
          speechText: 'Gunakan dua keping kembar bernilai sama untuk membentuk sepuluh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan dua keping merah bernilai 5.',
          speechText: 'Gunakan dua keping merah bernilai lima.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 10, minPiecesAllowed: 2, maxPiecesAllowed: 2 },
        availableTrayPieces: [3, 4, 5, 6],
      },
      {
        id: 'ib-ey-t2-lv10',
        moduleCode: 'IB-EY-BND-10',
        curriculum: 'ib',
        stage: 'Early Years',
        topicId: 'ib-ey-topic-bonds',
        phase: 'abstract',
        title: 'Misi 10: Trio Dekomposisi Menuju 10',
        instruction: {
          text: 'Gunakan tepat 3 keping Numicon untuk membuat total 10!',
          speechText: 'Gunakan tepat tiga keping Numicon untuk membuat total sepuluh!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Contohnya gabungan keping 5, 3, dan 2, atau keping 4, 4, dan 2.',
          speechText: 'Contohnya gabungan keping lima, tiga, dan dua, atau keping empat, empat, dan dua.',
          lang: 'id-ID',
        },
        validation: { type: 'exact-sum', targetTotal: 10, minPiecesAllowed: 3, maxPiecesAllowed: 3 },
        availableTrayPieces: [1, 2, 3, 4, 5],
      },
    ],
  },
];

// ============================================================================
// 3. IB PYP 1 (3 LEVEL)
// ============================================================================

export const IB_PYP_1_TOPICS: Topic[] = [
  {
    id: 'ib-pyp1-topic-parity',
    title: 'Topik 1: Eksplorasi Ganjil & Genap',
    description: 'Menemukan pola bilangan berpasangan (genap) dan berpuncak ganjil.',
    challenges: [
      {
        id: 'ib-pyp1-01',
        moduleCode: 'IB-PYP1-PARITY',
        curriculum: 'ib',
        stage: 'PYP 1',
        topicId: 'ib-pyp1-topic-parity',
        phase: 'pictorial',
        title: 'Misi 1: Pasukan Bilangan Genap 8',
        instruction: {
          text: 'Gunakan hanya keping bilangan GENAP (tepi rata tanpa tonjolan) hingga totalnya 8!',
          speechText: 'Gunakan hanya keping bilangan genap yang tepinya rata tanpa tonjolan hingga totalnya delapan!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan keping genap seperti 2, 4, 6, atau 8. Pastikan tidak ada keping ganjil.',
          speechText: 'Gunakan keping genap seperti dua, empat, enam, atau delapan. Pastikan tidak ada keping ganjil.',
          lang: 'id-ID',
        },
        validation: {
          type: 'parity-check',
          targetTotal: 8,
          requiredParity: 'even',
        },
        availableTrayPieces: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      {
        id: 'ib-pyp1-02',
        moduleCode: 'IB-PYP1-ODD-01',
        curriculum: 'ib',
        stage: 'PYP 1',
        topicId: 'ib-pyp1-topic-parity',
        phase: 'pictorial',
        title: 'Misi 2: Pasukan Bilangan Ganjil 7',
        instruction: {
          text: 'Susun total nilai 7 hanya menggunakan keping bilangan GANJIL!',
          speechText: 'Susun total nilai tujuh hanya menggunakan keping bilangan ganjil!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Keping ganjil memiliki satu lubang menonjol di atas: 1, 3, 5, atau 7.',
          speechText: 'Keping ganjil memiliki satu lubang menonjol di atas: satu, tiga, lima, atau tujuh.',
          lang: 'id-ID',
        },
        validation: {
          type: 'parity-check',
          targetTotal: 7,
          requiredParity: 'odd',
        },
        availableTrayPieces: [1, 3, 5, 7],
      },
      {
        id: 'ib-pyp1-03',
        moduleCode: 'IB-PYP1-REL-10',
        curriculum: 'ib',
        stage: 'PYP 1',
        topicId: 'ib-pyp1-topic-parity',
        phase: 'abstract',
        title: 'Misi 3: Dekomposisi Kembar Bilangan 10',
        instruction: {
          text: 'Buktikan bahwa 10 dapat dipecah menjadi 2 keping bernilai sama (Double)!',
          speechText: 'Buktikan bahwa sepuluh dapat dipecah menjadi dua keping bernilai sama!',
          lang: 'id-ID',
        },
        hint: {
          text: 'Gunakan dua keping kembar bernilai 5 (merah).',
          speechText: 'Gunakan dua keping kembar bernilai lima merah.',
          lang: 'id-ID',
        },
        validation: {
          type: 'exact-sum',
          targetTotal: 10,
          minPiecesAllowed: 2,
          maxPiecesAllowed: 2,
        },
        availableTrayPieces: [2, 3, 4, 5, 6, 7],
      },
    ],
  },
];

// ============================================================================
// 4. METADATA KURIKULUM & PENGELOMPOKAN TAHAPAN
// ============================================================================

export const CURRICULA_METADATA: Record<CurriculumTrack, CurriculumMetadata> = {
  cambridge: {
    id: 'cambridge',
    name: 'Cambridge International',
    badge: 'Cambridge Primary & Early Years',
    description: 'Pendekatan bertahap terstruktur dari keterampilan dasar hingga aplikasi pemecahan masalah.',
    stages: [
      {
        id: 'Early Years',
        name: 'Cambridge Early Years (K-Level)',
        curriculum: 'cambridge',
        topics: CAMBRIDGE_EARLY_YEARS_TOPICS,
      },
      {
        id: 'Stage 1',
        name: 'Primary Stage 1',
        curriculum: 'cambridge',
        topics: CAMBRIDGE_STAGE_1_TOPICS,
      },
    ],
  },
  ib: {
    id: 'ib',
    name: 'International Baccalaureate',
    badge: 'IB Primary Years Programme (PYP)',
    description: 'Inquiry-based learning berbasis eksplorasi konsep dan pola keterhubungan.',
    stages: [
      {
        id: 'Early Years',
        name: 'IB Early Years (K-Level)',
        curriculum: 'ib',
        topics: IB_EARLY_YEARS_TOPICS,
      },
      {
        id: 'PYP 1',
        name: 'IB PYP Phase 1',
        curriculum: 'ib',
        topics: IB_PYP_1_TOPICS,
      },
    ],
  },
};

// ============================================================================
// 5. GABUNGAN SELURUH TANTANGAN (UNTUK TESTING & VALIDASI SISTEM)
// ============================================================================

export const ALL_CHALLENGES: Challenge[] = [
  ...CAMBRIDGE_EARLY_YEARS_TOPICS.flatMap((t) => t.challenges),
  ...CAMBRIDGE_STAGE_1_TOPICS.flatMap((t) => t.challenges),
  ...IB_EARLY_YEARS_TOPICS.flatMap((t) => t.challenges),
  ...IB_PYP_1_TOPICS.flatMap((t) => t.challenges),
];

// ============================================================================
// 6. HELPER FUNCTIONS
// ============================================================================

export const getTopicsByStage = (curriculum: CurriculumTrack, stageId: string): Topic[] => {
  const stage = CURRICULA_METADATA[curriculum]?.stages.find(
    (s) => s.id.toLowerCase() === stageId.toLowerCase()
  );
  return stage ? stage.topics : [];
};

export const getChallengesByStage = (
  curriculum: CurriculumTrack,
  stageId: string
): Challenge[] => {
  const topics = getTopicsByStage(curriculum, stageId);
  return topics.flatMap((t) => t.challenges);
};

export const getChallengeById = (id: string): Challenge | undefined => {
  return ALL_CHALLENGES.find((c) => c.id === id);
};
