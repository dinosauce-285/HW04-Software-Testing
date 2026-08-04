import { execFileSync } from 'node:child_process';
import path from 'node:path';

/**
 * Reset SQLite của SUT về trạng thái seed trước mỗi lượt chạy.
 * Cần thiết vì: coupon_usage tích lũy giữa các lần chạy (test giới hạn lượt dùng mã sẽ
 * fail sai), và danh mục rác do FR-14 tạo ra làm lệch các assertion đếm dòng.
 */
export default function globalSetup() {
  const backend = path.resolve(__dirname, '../../sut/backend');
  execFileSync('node', ['database.js'], { cwd: backend, stdio: 'pipe' });
  console.log('[global-setup] Đã reset dữ liệu SUT về trạng thái seed');
}
