import { defineConfig, devices } from '@playwright/test';

/**
 * HW04 — Automation Testing (EShop)
 * SV: Lý Quốc Thạnh — 23127262
 *
 * Chạy MỘT feature trên MỘT browser cho mỗi lượt, xuất ra thư mục report riêng (CLAUDE.md R5):
 *   FEATURE=fr14-category npm run test:chromium
 * Playwright HTML reporter ghi đè outputFolder mỗi lần chạy → không tách thư mục là mất report cũ.
 */

const STUDENT_ID = '23127262';
const RUN_AT = new Date().toISOString();
const FEATURE = process.env.FEATURE ?? 'all';
const BROWSER = process.env.BROWSER ?? 'all';

// reports/<feature>-<browser>-<ISO timestamp>/  — dấu ':' trong ISO không hợp lệ trên một số FS
const REPORT_DIR = `reports/${FEATURE}-${BROWSER}-${RUN_AT.replace(/[:.]/g, '-')}`;

export default defineConfig({
  testDir: './tests',
  testMatch: FEATURE === 'all' ? '**/*.spec.ts' : `**/${FEATURE}/*.spec.ts`,

  globalSetup: './tests/fixtures/global-setup.ts',

  fullyParallel: false,   // SUT dùng chung một SQLite, chạy song song sẽ đua dữ liệu
  workers: 1,
  retries: 0,             // KHÔNG retry: test fail vì bug thật là kết quả cần giữ nguyên (R8)
  timeout: 30_000,

  // Hiện ở tab "Metadata" của HTML report — bằng chứng tác giả theo §6:83 và §11:131
  metadata: {
    'Run by': STUDENT_ID,
    'Student': 'Ly Quoc Thanh',
    'Run at (ISO)': RUN_AT,
    'Feature': FEATURE,
    'Browser': BROWSER,
    'SUT': 'EShop — https://github.com/ttbhanh/eshop-sut',
  },

  reporter: [
    ['list'],
    ['html', {
      open: 'never',
      outputFolder: REPORT_DIR,
      title: `Run by: ${STUDENT_ID} — ${FEATURE} — ${BROWSER} — ${RUN_AT}`,
    }],
  ],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

export const URLS = {
  web: 'http://localhost:5173',
  admin: 'http://localhost:5174',
  api: 'http://localhost:3000/api',
};
