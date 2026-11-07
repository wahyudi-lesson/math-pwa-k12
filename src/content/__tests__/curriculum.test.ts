// src/content/__tests__/curriculum.test.ts
import { describe, it, expect } from 'vitest';
import { ALL_CHALLENGES, CURRICULA_METADATA } from '../index';

describe('Integritas Data Kurikulum', () => {
  it('harus memuat metadata kurikulum Cambridge dan IB', () => {
    expect(CURRICULA_METADATA.cambridge).toBeDefined();
    expect(CURRICULA_METADATA.ib).toBeDefined();
  });

  it('setiap tantangan harus memiliki ID unik', () => {
    const ids = ALL_CHALLENGES.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
