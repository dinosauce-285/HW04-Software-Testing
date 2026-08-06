import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { readCsv, expand, isTrue } from '../fixtures/csv';

/**
 * FR-01 - Đăng ký tài khoản / validate qua GIAO DIỆN (TC01-TC12)
 *
 * Đặc tả dùng làm chuẩn là chính dòng gợi ý hiển thị ngay dưới ô mật khẩu của SUT:
 *   "Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."
 * Assertion viết theo đặc tả đó, KHÔNG theo regex đang cài (CLAUDE.md R8).
 *
 * Assertion pattern:
 *   P1 - điều hướng      expect(page).toHaveURL()
 *   P2 - nội dung text   expect(locator).toContainText()
 *   P3 - hiển thị        expect(locator).toBeVisible() / not.toBeVisible()
 */

type Case = {
  tc_id: string; loai: string; mo_ta: string;
  ho_ten: string; email: string; mat_khau: string; expect_accepted: string; ref_bug: string;
};

const passwordCases = readCsv<Case>('fr01-password.csv');
const emailCases = readCsv<Case>('fr01-email.csv');

function runCases(title: string, cases: Case[]) {
  test.describe(title, () => {
    for (const c of cases) {
      test(`${c.tc_id} [${c.loai}] ${c.mo_ta}`, async ({ page }) => {
        const reg = new RegisterPage(page);
        await reg.goto();

        // Gợi ý hiển thị cho người dùng chính là đặc tả mà test bám vào
        await expect(reg.passwordHint).toContainText('ký tự đặc biệt');

        await reg.fill(c.ho_ten, expand(c.email, c.tc_id), c.mat_khau);
        await reg.submit();

        // Chờ tới trạng thái ổn định TRƯỚC khi khẳng định điều gì.
        // Không được dùng expect(page).toHaveURL(/\/register$/) để kiểm "phải ở lại trang":
        // matcher này pass ngay ở lần poll đầu, trước khi navigate() kịp chạy -> negative luôn pass giả.
        const registered = await reg.isRegistered();

        if (isTrue(c.expect_accepted)) {
          expect(registered,
            `${c.tc_id}: mật khẩu "${c.mat_khau}" đúng đặc tả nhưng bị từ chối — bug ${c.ref_bug}`,
          ).toBe(true);

          // P1 - điều hướng sang trang đăng nhập
          await expect(page).toHaveURL(/\/login$/);

          // P3 - không được hiện khung lỗi
          await expect(reg.errorBox).not.toBeVisible();
        } else {
          expect(registered,
            `${c.tc_id}: dữ liệu không hợp lệ ("${c.mat_khau || c.email}") vẫn đăng ký được${c.ref_bug ? ' — bug ' + c.ref_bug : ''}`,
          ).toBe(false);

          // P1 - vẫn ở trang đăng ký (kiểm sau khi đã chắc chắn không có điều hướng)
          await expect(page).toHaveURL(/\/register$/);
        }
      });
    }
  });
}

runCases('FR-01 Đăng ký — Quy tắc mật khẩu', passwordCases);
runCases('FR-01 Đăng ký — Định dạng email và trường bắt buộc', emailCases);
