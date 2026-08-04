import { parse } from 'csv-parse/sync';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Đọc test data từ file .csv trong data/.
 * Đề HW04 §6:82 — "hardcoded inline arrays or objects in the script are not accepted".
 */
export function readCsv<T = Record<string, string>>(fileName: string): T[] {
  const file = path.resolve(__dirname, '../../data', fileName);
  const raw = fs.readFileSync(file, 'utf8');
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: false, // giữ nguyên khoảng trắng — TC04 và TC08 kiểm chính khoảng trắng
  }) as T[];
}

/**
 * Giãn placeholder trong CSV thành giá trị thật.
 *   __LONG_500__ — chuỗi 500 ký tự, CSV không biểu diễn trực tiếp được
 *   __UNIQUE__   — email duy nhất cho mỗi lần chạy, tránh đụng dữ liệu giữa các lượt
 */
export function expand(value: string, seed = ''): string {
  if (value === '__LONG_500__') return 'X'.repeat(500);
  if (value === '__UNIQUE__') return `hw04.${seed}.${Date.now()}@test.local`;
  return value;
}

export const isTrue = (v: string) => v?.trim().toLowerCase() === 'true';
