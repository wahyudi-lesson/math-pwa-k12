// src/content/__tests__/curriculum.test.ts
import { describe, it, expect } from 'vitest';
import { ALL_CHALLENGES, CURRICULA_METADATA } from '../index';

describe('Integritas Data Kurikulum', () => {
  it('harus memuat metadata kurikulum Cambridge dan IB', () => {
    expect(CURRICULA_METADATA).toBeDefined();
    expect(CURRICULA_METADATA.cambridge).toBeDefined();
    expect(CURRICULA_METADATA.ib).toBeDefined();
    expect(CURRICULA_METADATA.cambridge.stages.length).toBeGreaterThan(0);
    expect(CURRICULA_METADATA.ib.stages.length).toBeGreaterThan(0);
  });

  it('setiap tantangan harus memiliki ID unik', () => {
    expect(ALL_CHALLENGES).toBeDefined();
    expect(Array.isArray(ALL_CHALLENGES)).toBe(true);
    const ids = ALL_CHALLENGES.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('setiap tantangan harus memiliki teks instruksi dan target yang valid', () => {
    ALL_CHALLENGES.forEach((c) => {
      expect(c.instruction.text.length).toBeGreaterThan(0);
      if (c.validation.targetTotal !== undefined) {
        expect(c.validation.targetTotal).toBeGreaterThan(0);
      }
    });
  });
});
