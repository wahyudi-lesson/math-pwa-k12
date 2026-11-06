// src/content/__tests__/curriculum.test.ts
import { describe, it, expect } from 'vitest';
import { ALL_CHALLENGES, CURRICULA_METADATA } from '../index';

describe('Integritas Data Kurikulum', () => {
  it('harus memuat seluruh metadata kurikulum utama (Cambridge dan IB)', () => {
    expect(CURRICULA_METADATA.cambridge).toBeDefined();
    expect(CURRICULA_METADATA.ib).toBeDefined();
    expect(CURRICULA_METADATA.cambridge.stages.length).toBeGreaterThan(0);
    expect(CURRICULA_METADATA.ib.stages.length).toBeGreaterThan(0);
  });

  it('setiap tantangan harus memiliki ID unik dan format yang valid', () => {
    const ids = ALL_CHALLENGES.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('setiap tantangan harus menyertakan teks instruksi visual dan TTS', () => {
    ALL_CHALLENGES.forEach((c) => {
      expect(c.instruction.text.trim().length).toBeGreaterThan(0);
      expect(c.instruction.speechText ? c.instruction.speechText.trim().length : 1).toBeGreaterThan(0);
      expect(['id-ID', 'en-GB', 'en-US']).toContain(c.instruction.lang || 'id-ID');
    });
  });

  it('aturan validasi nilai harus bernilai positif', () => {
    ALL_CHALLENGES.forEach((c) => {
      if (c.validation.targetTotal !== undefined) {
        expect(c.validation.targetTotal).toBeGreaterThan(0);
      }
      if (c.validation.minPiecesAllowed !== undefined) {
        expect(c.validation.minPiecesAllowed).toBeGreaterThan(0);
      }
    });
  });
});
