import { test, expect } from '@playwright/test';
import fs from 'node:fs';

/**
 * Chụp lại trang GitHub Issues và một số issue tiêu biểu.
 * Phục vụ đề §14:155 — "Bug report, with screenshots of the bugs on the GitHub Issues page".
 * Chạy: FEATURE=tools npx playwright test --project=chromium -g "issues"
 */

const OUT = 'deliverables/evidence/issues';
const REPO = 'https://github.com/dinosauce-285/HW04-Software-Testing';

test.beforeAll(() => fs.mkdirSync(OUT, { recursive: true }));
test.use({ viewport: { width: 1440, height: 1000 } });

test('issues — danh sách toàn bộ 18 bug', async ({ page }) => {
  await page.goto(`${REPO}/issues`, { waitUntil: 'domcontentloaded' });
  // Chờ đủ 18 dòng issue hiện ra thay vì bám vào nhãn "18 Open" — GitHub đổi giao diện thường xuyên
  await expect(page.locator('a[href*="/issues/"]').filter({ hasText: /\[FR-\d+\]/ }))
    .toHaveCount(18, { timeout: 20000 });
  await page.screenshot({ path: `${OUT}/00-danh-sach-issues.png`, fullPage: true });
});

// Ba bug nghiêm trọng nhất, mỗi feature một cái
const featured = [
  { n: 6, slug: 'B01-ma-giam-gia-sai-cong-thuc' },
  { n: 16, slug: 'C06-user-thuong-quan-ly-danh-muc' },
  { n: 1, slug: 'A01-regex-mat-khau-mau-thuan' },
];

for (const f of featured) {
  test(`issues — chi tiết issue #${f.n}`, async ({ page }) => {
    await page.goto(`${REPO}/issues/${f.n}`, { waitUntil: 'domcontentloaded' });
    // Chờ ảnh bằng chứng trong issue tải xong, để ảnh chụp có cả screenshot bug
    const img = page.locator('img[src*="raw.githubusercontent.com"]').first();
    await img.waitFor({ state: 'visible', timeout: 20000 });
    await expect(img).toHaveJSProperty('complete', true);
    await page.screenshot({ path: `${OUT}/${f.n}-${f.slug}.png`, fullPage: true });
  });
}
