import { test, expect, request } from '@playwright/test';
import { AdminCategoryPage } from '../pages/AdminCategoryPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { createAccount } from '../fixtures/account';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Công cụ chụp bằng chứng cho GitHub Issues — KHÔNG phải test case của bài làm.
 * Chạy: FEATURE=tools npx playwright test --project=chromium
 *
 * Bug tái hiện được trên giao diện → chụp trực tiếp trên trình duyệt.
 * Bug chỉ ở tầng API → chụp phần test fail tương ứng trong HTML report.
 */

const OUT = 'submission/evidence/bugs';
const API = 'http://localhost:3000/api';

test.beforeAll(() => fs.mkdirSync(OUT, { recursive: true }));

// ══════════════════════════════ FR-01 Đăng ký ══════════════════════════════

test('A01 — regex mật khẩu mâu thuẫn với chính gợi ý hiển thị', async ({ page }) => {
  const reg = new RegisterPage(page);
  await reg.goto();
  await reg.fill('Nguyen Van A', `a01.${Date.now()}@test.local`, 'Test1234!');
  await reg.submit();
  await expect(reg.errorBox).toBeVisible();
  await page.screenshot({ path: `${OUT}/A01-mat-khau-mau-thuan.png`, fullPage: true });
});

test('A02 — ô Email là type=text, chấp nhận chuỗi không phải email', async ({ page }) => {
  const reg = new RegisterPage(page);
  await reg.goto();
  await reg.fill('Nguyen Van I', 'khongcoa.com', 'Test 1234');
  await page.screenshot({ path: `${OUT}/A02-email-khong-hop-le.png`, fullPage: true });
  await reg.submit();
  await expect(page).toHaveURL(/\/login$/); // được chấp nhận
});

test('A04 — đăng ký trùng email vẫn thành công', async ({ page }) => {
  const email = `a04.${Date.now()}@test.local`;
  const api = await request.newContext();
  await api.post(`${API}/register`, { data: { name: 'Lần 1', email, password: 'Test 1234' } });

  const reg = new RegisterPage(page);
  await reg.goto();
  await reg.fill('Lần 2 trùng email', email, 'Test 1234');
  await page.screenshot({ path: `${OUT}/A04-trung-email.png`, fullPage: true });
  await reg.submit();
  await expect(page).toHaveURL(/\/login$/); // lẽ ra phải bị từ chối
});

// ══════════════════════════════ FR-09 Mã giảm giá ══════════════════════════════

test('B01 — mã giảm 10% làm đơn hàng đắt lên gấp 10 lần', async ({ page }) => {
  const acc = await createAccount();
  const co = new CheckoutPage(page);
  await co.login(acc.email, acc.password);
  await co.goToCheckoutWithOneProduct();
  await co.setTotal(500000);
  await co.applyCoupon('SAVE10');
  await expect(co.couponPanel.getByText('Tiết kiệm:')).toBeVisible();
  await page.screenshot({ path: `${OUT}/B01-giam-gia-phan-tram-sai.png`, fullPage: true });
});

test('B02 — đơn đúng bằng mức tối thiểu bị từ chối', async ({ page }) => {
  const acc = await createAccount();
  const co = new CheckoutPage(page);
  await co.login(acc.email, acc.password);
  await co.goToCheckoutWithOneProduct();
  await co.setTotal(500000);
  await co.applyCoupon('BIGBUY');
  await expect(co.couponPanel.locator('.text-red-600')).toBeVisible();
  await page.screenshot({ path: `${OUT}/B02-loi-bien-muc-toi-thieu.png`, fullPage: true });
});

test('B05 — tổng tiền thanh toán là ô nhập sửa được tự do', async ({ page }) => {
  const acc = await createAccount();
  const co = new CheckoutPage(page);
  await co.login(acc.email, acc.password);
  await co.goToCheckoutWithOneProduct();
  await co.setTotal(1000);
  await page.screenshot({ path: `${OUT}/B05-tong-tien-sua-duoc.png`, fullPage: true });
});

// ══════════════════════════════ FR-14 Quản lý danh mục ══════════════════════════════

test('C01 C02 C03 C08 — danh mục rỗng, trùng tên, XSS, tên dài, không trim', async ({ page }) => {
  const admin = new AdminCategoryPage(page);
  await admin.login();
  await admin.openCategoryTab();

  for (const name of ['', '   ', 'Laptop', '<img src=x onerror=alert(1)>', '  Sách và Văn phòng phẩm  ', "'; DROP TABLE categories;--"]) {
    await admin.addCategory(name);
  }
  await page.screenshot({ path: `${OUT}/C01-C02-C03-C08-danh-muc-khong-validate.png`, fullPage: true });
});

test('C04 — xóa danh mục không có hộp thoại xác nhận', async ({ page }) => {
  const admin = new AdminCategoryPage(page);
  await admin.login();
  await admin.openCategoryTab();

  const name = `Xoa ngay ${Date.now()}`;
  await admin.addCategory(name);
  await expect(admin.rowsNamed(name)).toHaveCount(1);

  let dialogShown = false;
  page.on('dialog', d => { dialogShown = true; d.dismiss(); });
  await admin.deleteRowNamed(name);
  await expect(admin.rowsNamed(name)).toHaveCount(0);

  expect(dialogShown).toBe(false); // biến mất mà không hỏi gì
  await page.screenshot({ path: `${OUT}/C04-xoa-khong-xac-nhan.png`, fullPage: true });
});

// ══════════ Bug tầng API — chụp phần test fail trong HTML report ══════════

const apiBugs = [
  { id: 'A03', tc: 'TC14', feature: 'fr01-register' },
  { id: 'A06', tc: 'TC15', feature: 'fr01-register' },
  { id: 'B03', tc: 'TC13', feature: 'fr09-coupon' },
  { id: 'B04', tc: 'TC15', feature: 'fr09-coupon' },
  { id: 'B05api', tc: 'TC17', feature: 'fr09-coupon' },
  { id: 'C05', tc: 'TC11', feature: 'fr14-category' },
  { id: 'C06', tc: 'TC14', feature: 'fr14-category' },
  { id: 'C09', tc: 'TC13', feature: 'fr14-category' },
];

for (const b of apiBugs) {
  test(`${b.id} — chụp kết quả fail của ${b.tc} trong HTML report`, async ({ page }) => {
    const dir = fs.readdirSync('reports').find(d => d.startsWith(`${b.feature}-chromium-`));
    expect(dir, `không tìm thấy report của ${b.feature}`).toBeTruthy();

    await page.goto('file://' + path.resolve('reports', dir!, 'index.html'));
    await page.getByText(`${b.tc} [`, { exact: false }).first().click();
    await expect(page.getByText('Error:', { exact: false }).first()).toBeVisible();
    await page.screenshot({ path: `${OUT}/${b.id}-${b.tc}-report.png`, fullPage: true });
  });
}
