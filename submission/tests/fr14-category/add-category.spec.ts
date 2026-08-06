import { test, expect } from '@playwright/test';
import { AdminCategoryPage } from '../pages/AdminCategoryPage';
import { readCsv, expand, isTrue } from '../fixtures/csv';

/**
 * FR-14 - Quản lý danh mục / phần THÊM (TC01-TC09)
 *
 * Assertion viết theo ĐẶC TẢ ĐÚNG, không theo hành vi hiện tại của SUT (CLAUDE.md R8).
 * Các test có cột ref_bug được kỳ vọng sẽ FAIL - chính cái fail đó là bằng chứng bug
 * (đề mục 6:85 - "wherever a failing assertion reveals a genuine defect, a bug report").
 *
 * Assertion pattern dùng trong file này:
 *   P1 - đếm phần tử       expect(locator).toHaveCount()
 *   P2 - nội dung text      expect(locator).toContainText() / toHaveText()
 *   P3 - trạng thái hiển thị expect(locator).toBeVisible()
 */

type AddCase = {
  tc_id: string; loai: string; mo_ta: string;
  input_name: string; expect_created: string; expect_message: string; ref_bug: string;
};

const cases = readCsv<AddCase>('fr14-add-category.csv');

test.describe('FR-14 Quản lý danh mục — Thêm danh mục', () => {
  for (const c of cases) {
    test(`${c.tc_id} [${c.loai}] ${c.mo_ta}`, async ({ page }) => {
      const name = expand(c.input_name);
      const shouldCreate = isTrue(c.expect_created);

      const admin = new AdminCategoryPage(page);
      await admin.login();
      await admin.openCategoryTab();

      const before = await admin.count();
      await admin.addCategory(name);

      if (shouldCreate) {
        // P1 - bảng phải có thêm đúng 1 dòng
        await expect(admin.rows).toHaveCount(before + 1);

        // P2 - tên lưu lại phải là tên đã cắt khoảng trắng thừa (TC08).
        // So trên text NGUYÊN VĂN, không dùng getByRole('cell') vì nó chuẩn hóa khoảng trắng
        // và sẽ pass ngay cả khi hệ thống không trim.
        const expected = name.trim();
        expect(await admin.rawNames(),
          `${c.tc_id}: tên lưu vào hệ thống chưa được cắt khoảng trắng thừa`,
        ).toContain(expected);

        // P3 - ô nhập phải được xóa trắng sau khi thêm thành công
        await expect(admin.nameInput).toHaveValue('');
      } else {
        // P1 - dữ liệu không hợp lệ thì số dòng phải giữ nguyên
        await expect(admin.rows,
          `${c.tc_id}: tên không hợp lệ ("${c.input_name.slice(0, 40)}") vẫn bị tạo — bug ${c.ref_bug}`,
        ).toHaveCount(before);

        // P2 - phải hiện thông báo lỗi cho người dùng
        if (c.expect_message) {
          await expect(page.getByText(c.expect_message, { exact: false })).toBeVisible();
        }
      }
    });
  }

  test('TC09b [edge] Danh sách vẫn đọc được sau payload SQL injection', async ({ page }) => {
    const admin = new AdminCategoryPage(page);
    await admin.login();
    await admin.openCategoryTab();

    await admin.addCategory("'; DROP TABLE categories;--");
    await page.reload();
    await admin.openCategoryTab();

    // P1 - bảng categories phải còn nguyên, 3 danh mục seed vẫn hiển thị
    const names = await admin.listNames();
    expect(names).toEqual(expect.arrayContaining(['Điện thoại', 'Laptop', 'Phụ kiện']));
  });
});
