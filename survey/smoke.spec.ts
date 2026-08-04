import { test, expect } from '@playwright/test';

test('smoke: mở được trang chủ EShop', async ({ page }, testInfo) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('link', { name: 'EShop' })).toBeVisible();
  console.log(`OK ${testInfo.project.name} — ${await page.title()}`);
});
