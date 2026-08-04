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

/** CSV không biểu diễn được chuỗi 500 ký tự → dùng placeholder rồi giãn ra ở đây. */
export function expand(value: string): string {
  if (value === '__LONG_500__') return 'X'.repeat(500);
  return value;
}

export const isTrue = (v: string) => v?.trim().toLowerCase() === 'true';
