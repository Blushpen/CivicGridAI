import { describe, it, expect } from 'vitest';
import { validateReport, ReportInput } from '../services/reportValidator';

describe('reportValidator', () => {
  it('valid report passes', () => {
    const res = validateReport({ category: 'Pothole', description: 'Big pothole', latitude: 12.97, longitude: 77.59 });
    expect(res.valid).toBe(true);
  });

  it('empty description fails', () => {
    const res = validateReport({ category: 'Pothole', description: '', latitude: 12.97, longitude: 77.59 });
    expect(res.valid).toBe(false);
    expect(res.errors.join(' ')).toContain('Description is required');
  });

  it('missing category fails', () => {
    const res = validateReport({ description: 'desc', latitude: 12.97, longitude: 77.59 } as ReportInput);
    expect(res.valid).toBe(false);
    expect(res.errors.join(' ')).toContain('Category is required');
  });

  it('invalid category fails', () => {
    const res = validateReport({ category: 'InvalidCategory', description: 'desc', latitude: 12.97, longitude: 77.59 } as ReportInput);
    expect(res.valid).toBe(false);
    expect(res.errors.join(' ')).toContain('Invalid category');
  });

  it('missing location fails', () => {
    const res = validateReport({ category: 'Pothole', description: 'desc' } as ReportInput);
    expect(res.valid).toBe(false);
    expect(res.errors.join(' ')).toContain('Location is required');
  });

  it('invalid location types fail', () => {
    const res = validateReport({ category: 'Pothole', description: 'desc', latitude: NaN as unknown as number, longitude: 'x' as unknown as number } as ReportInput);
    expect(res.valid).toBe(false);
    expect(res.errors.join(' ')).toContain('Location is required');
  });
});
