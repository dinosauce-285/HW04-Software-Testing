import { test, expect, request } from '@playwright/test';
import { AdminCategoryPage } from '../pages/AdminCategoryPage';
import { readCsv } from '../fixtures/csv';

/**
 * FR-14 — Quản lý danh mục · phần XÓA và PHÂN QUYỀN (TC10–TC14)
 *
 * Assertion pattern bổ sung ở file này:
 *   P4 — mã trạng thái HTTP   expect(response.status()).toBe()
 *   P5 — hộp thoại trình duyệt  page.on('dialog')
 */

const API = 'http://localhost:3000/api';
const cases = readCsv<{ tc_id: string; loai: string; mo_ta: string; target: string; expect_status: string; ref_bug: string }>(
  'fr14-delete-category.csv',
);
const tc = (id: string) => cases.find(c => c.tc_id === id)!;

async function tokenFor(email: string, password: string) {
  const api = await request.newContext();
  const res = await api.post(`${API}/login`, { data: { email, password } });
  return (await res.json()).token as string;
}

test.describe('FR-14 Quản lý danh mục — Xóa và phân quyền', () => {
  test(`TC10 [positive] ${tc('TC10').mo_ta}`, async ({ page }) => {
    const admin = new AdminCategoryPage(page);
    await admin.login();
    await admin.openCategoryTab();

    const name = `Danh mục tạm ${Date.now()}`;
    await admin.addCategory(name);
    await expect(admin.rowsNamed(name)).toHaveCount(1);

    page.once('dialog', d => d.accept());
    await admin.deleteRowNamed(name);

    // P1 — dòng phải biến mất khỏi bảng
    await expect(admin.rowsNamed(name)).toHaveCount(0);
  });

  test(`TC11 [negative] ${tc('TC11').mo_ta}`, async () => {
    const api = await request.newContext();
    const token = await tokenFor('admin@eshop.com', 'Admin123!');

    const products = await (await api.get(`${API}/products`)).json();
    const inUse = products.find((p: any) => p.category_id)?.category_id;
    expect(inUse, 'cần ít nhất một sản phẩm đang thuộc một danh mục').toBeTruthy();

    const res = await api.delete(`${API}/categories/${inUse}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // P4 — phải bị từ chối vì ràng buộc toàn vẹn dữ liệu
    expect(res.status(),
      `TC11: xóa danh mục #${inUse} đang có sản phẩm vẫn thành công — bug ${tc('TC11').ref_bug}`,
    ).toBe(Number(tc('TC11').expect_status));

    // P1 — sản phẩm không được trở thành mồ côi
    const after = await (await api.get(`${API}/products`)).json();
    const orphan = after.filter((p: any) => p.category_id === inUse);
    expect(orphan.length).toBeGreaterThan(0);
  });

  test(`TC12 [edge] ${tc('TC12').mo_ta}`, async ({ page }) => {
    const admin = new AdminCategoryPage(page);
    await admin.login();
    await admin.openCategoryTab();

    const name = `Danh mục xác nhận ${Date.now()}`;
    await admin.addCategory(name);
    await expect(admin.rowsNamed(name)).toHaveCount(1);

    // P5 — bấm Xóa phải bật hộp thoại xác nhận; ở đây bấm Hủy
    let dialogShown = false;
    page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });

    await admin.deleteRowNamed(name);
    await page.waitForTimeout(500);

    expect(dialogShown,
      `TC12: xóa ngay lập tức, không có bước xác nhận — bug ${tc('TC12').ref_bug}`,
    ).toBe(true);

    // P1 — vì đã Hủy nên danh mục phải còn nguyên
    await expect(admin.rowsNamed(name)).toHaveCount(1);
  });

  test(`TC13 [edge] ${tc('TC13').mo_ta}`, async () => {
    const api = await request.newContext();
    const token = await tokenFor('admin@eshop.com', 'Admin123!');

    const res = await api.delete(`${API}/categories/999999`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // P4 — ID không tồn tại phải trả 404, không phải 200
    expect(res.status()).toBe(Number(tc('TC13').expect_status));
  });

  test(`TC14 [edge] ${tc('TC14').mo_ta}`, async () => {
    const api = await request.newContext();
    const userToken = await tokenFor('test@eshop.com', 'Test1234!');

    const created = await api.post(`${API}/categories`, {
      data: { name: `User thường tạo ${Date.now()}` },
      headers: { Authorization: `Bearer ${userToken}` },
    });

    // P4 — chỉ admin mới được quản lý danh mục
    expect(created.status(),
      `TC14: user thường tạo được danh mục — bug ${tc('TC14').ref_bug}`,
    ).toBe(Number(tc('TC14').expect_status));
  });
});
