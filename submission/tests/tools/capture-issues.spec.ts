import { test, expect } from '@playwright/test';
import fs from 'node:fs';

/**
 * Chụp lại trang GitHub Issues và một số issue tiêu biểu.
 * Phục vụ đề mục 14:155 - "Bug report, with screenshots of the bugs on the GitHub Issues page".
 * Chạy: FEATURE=tools npx playwright test --project=chromium -g "issues"
 */

const OUT = 'submission/evidence/issues';
const REPO = 'https://github.com/dinosauce-285/HW04-Software-Testing';

test.beforeAll(() => fs.mkdirSync(OUT, { recursive: true }));
test.use({ viewport: { width: 1440, height: 1000 } });

test('issues — danh sách toàn bộ 18 bug', async ({ page }) => {
  await page.goto(`${REPO}/issues`, { waitUntil: 'domcontentloaded' });
  // Chờ đủ 18 dòng issue hiện ra thay vì bám vào nhãn "18 Open" - GitHub đổi giao diện thường xuyên
  await expect(page.locator('a[href*="/issues/"]').filter({ hasText: /\[FR-\d+\]/ }))
    .toHaveCount(18, { timeout: 20000 });
  await page.screenshot({ path: `${OUT}/00-danh-sach-issues.png`, fullPage: true });
});

// Toàn bộ 18 issue - đề mục 14:155 đòi ảnh của các bug trên trang GitHub Issues
const issues: Array<[number, string]> = [
  [1, 'A01'],
  [2, 'A02'],
  [3, 'A03'],
  [4, 'A04'],
  [5, 'A06'],
  [6, 'B01'],
  [7, 'B02'],
  [8, 'B03'],
  [9, 'B04'],
  [10, 'B05'],
  [11, 'C01'],
  [12, 'C02'],
  [13, 'C03'],
  [14, 'C04'],
  [15, 'C05'],
  [16, 'C06'],
  [17, 'C08'],
  [18, 'C09'],
];

for (const [n, bug] of issues) {
  test(`issues - chi tiet issue #${n} (${bug})`, async ({ page }) => {
    await page.goto(`${REPO}/issues/${n}`, { waitUntil: 'domcontentloaded' });
    // Chờ ảnh bằng chứng trong issue tải xong, để ảnh chụp có cả screenshot bug
    const img = page.locator('img[src*="raw.githubusercontent.com"]').first();
    await img.waitFor({ state: 'visible', timeout: 20000 });
    await expect(img).toHaveJSProperty('complete', true);
    await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${bug}.png`, fullPage: true });
  });
}
