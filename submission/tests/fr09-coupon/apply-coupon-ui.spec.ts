import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { readCsv, isTrue } from '../fixtures/csv';
import { createAccount } from '../fixtures/account';

/**
 * FR-09 — Mã giảm giá · áp mã qua GIAO DIỆN (TC01–TC12)
 *
 * Đặc tả dùng làm chuẩn (từ dữ liệu seed trong sut/backend/database.js):
 *   SAVE10  percent 10   — đơn tối thiểu 300.000₫, còn hạn, 1 lượt/người
 *   BIGBUY  fixed  50.000₫ — đơn tối thiểu 500.000₫, còn hạn, 1 lượt/người
 *   VIP100  fixed 100.000₫ — đơn tối thiểu 300.000₫, còn hạn, 2 lượt/người
 *   EXPIRED percent 20   — đã hết hạn 01/01/2020
 * Mã loại percent phải giảm `tổng × giá_trị / 100`, và điều kiện tối thiểu là `>=`.
 *
 * Assertion pattern:
 *   P1 — giá trị số học   expect(number).toBe()
 *   P2 — nội dung text     expect(string).toContain()
 *   P3 — trạng thái        expect(boolean).toBe() / expect(locator).toBeDisabled()
 */

type Case = {
  tc_id: string; loai: string; mo_ta: string; ma_giam_gia: string; tong_tien: string;
  expect_applied: string; expect_discount: string; expect_final: string; ref_bug: string;
};

const cases = readCsv<Case>('fr09-coupon-ui.csv');

test.describe('FR-09 Mã giảm giá — Áp mã trên trang thanh toán', () => {
  for (const c of cases) {
    test(`${c.tc_id} [${c.loai}] ${c.mo_ta}`, async ({ page }) => {
      const acc = await createAccount();
      const co = new CheckoutPage(page);
      await co.login(acc.email, acc.password);
      await co.goToCheckoutWithOneProduct();
      await co.setTotal(c.tong_tien);
      await co.applyCoupon(c.ma_giam_gia);

      const applied = await co.isApplied();

      if (isTrue(c.expect_applied)) {
        // P3 — mã hợp lệ phải được chấp nhận
        expect(applied,
          `${c.tc_id}: mã "${c.ma_giam_gia.trim()}" hợp lệ nhưng không áp được — ${await co.errorMessage()}`,
        ).toBe(true);

        // P1 — số tiền giảm phải đúng công thức
        expect(await co.discountAmount(),
          `${c.tc_id}: số tiền giảm sai${c.ref_bug ? ' — bug ' + c.ref_bug : ''}`,
        ).toBe(Number(c.expect_discount));

        // P1 — thành tiền phải bằng tổng trừ đi số tiền giảm
        expect(await co.finalAmount(),
          `${c.tc_id}: thành tiền sai${c.ref_bug ? ' — bug ' + c.ref_bug : ''}`,
        ).toBe(Number(c.expect_final));
      } else {
        // P3 — mã không hợp lệ phải bị từ chối
        expect(applied,
          `${c.tc_id}: mã "${c.ma_giam_gia.trim()}" lẽ ra phải bị từ chối${c.ref_bug ? ' — bug ' + c.ref_bug : ''}`,
        ).toBe(false);

        // P2 — và phải cho người dùng biết lý do
        const err = await co.errorMessage();
        const disabled = await co.applyButton.isDisabled();
        expect(err !== null || disabled,
          `${c.tc_id}: không có thông báo lỗi cũng không khoá nút Áp dụng`,
        ).toBe(true);
      }
    });
  }

  test('TC12b [edge] Đổi tổng tiền sau khi áp mã thì kết quả giảm giá phải bị huỷ', async ({ page }) => {
    const acc = await createAccount();
    const co = new CheckoutPage(page);
    await co.login(acc.email, acc.password);
    await co.goToCheckoutWithOneProduct();
    await co.setTotal(600000);
    await co.applyCoupon('BIGBUY');
    expect(await co.isApplied()).toBe(true);

    await co.setTotal(700000);

    // P3 — kết quả cũ không được giữ lại vì nó tính trên tổng tiền đã lỗi thời
    expect(await co.isApplied(),
      'TC12b: kết quả giảm giá cũ vẫn hiển thị sau khi đổi tổng tiền',
    ).toBe(false);
  });
});
