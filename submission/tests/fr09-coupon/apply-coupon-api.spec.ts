import { test, expect, request, APIRequestContext } from '@playwright/test';
import { readCsv } from '../fixtures/csv';
import { createAccount } from '../fixtures/account';

/**
 * FR-09 — Mã giảm giá · phân quyền, giới hạn lượt dùng, toàn vẹn số tiền (TC13–TC18)
 *
 * Assertion pattern bổ sung:
 *   P4 — mã trạng thái HTTP   expect(res.status()).toBe()
 *   P5 — bất biến nghiệp vụ   final_amount phải nằm trong [0, tổng tiền]
 */

const API = 'http://localhost:3000/api';
const cases = readCsv<{
  tc_id: string; loai: string; mo_ta: string;
  ma_giam_gia: string; tong_tien: string; expect_status: string; ref_bug: string;
}>('fr09-coupon-api.csv');
const tc = (id: string) => cases.find(c => c.tc_id === id)!;

/** Áp mã rồi ghi nhận lượt dùng, mô phỏng đúng luồng của trang Checkout. */
async function applyAndRecord(api: APIRequestContext, token: string, userId: number | null, code: string, total: number) {
  const res = await api.post(`${API}/apply-coupon`, {
    data: { code, total_amount: total, user_id: userId },
  });
  if (res.ok()) {
    const body = await res.json();
    await api.post(`${API}/coupon-usage`, {
      data: { coupon_id: body.coupon_id },
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return res;
}

test.describe('FR-09 Mã giảm giá — Phân quyền và giới hạn lượt dùng', () => {
  test(`TC13 [negative] ${tc('TC13').mo_ta}`, async () => {
    const c = tc('TC13');
    const api = await request.newContext();

    const res = await api.post(`${API}/apply-coupon`, {
      data: { code: c.ma_giam_gia, total_amount: Number(c.tong_tien) },
    });

    // P4 — endpoint không được để công khai
    expect(res.status(),
      `TC13: áp mã được mà không cần đăng nhập — bug ${c.ref_bug}`,
    ).toBe(Number(c.expect_status));
  });

  test(`TC14 [negative] ${tc('TC14').mo_ta}`, async () => {
    const c = tc('TC14');
    const api = await request.newContext();
    const acc = await createAccount(api);

    const first = await applyAndRecord(api, acc.token, acc.id, c.ma_giam_gia, Number(c.tong_tien));
    expect(first.status(), 'lượt dùng đầu tiên phải thành công').toBe(200);

    const second = await applyAndRecord(api, acc.token, acc.id, c.ma_giam_gia, Number(c.tong_tien));

    // P4 — SAVE10 chỉ cho 1 lượt mỗi người
    expect(second.status()).toBe(Number(c.expect_status));
  });

  test(`TC15 [edge] ${tc('TC15').mo_ta}`, async () => {
    const c = tc('TC15');
    const api = await request.newContext();
    const acc = await createAccount(api);

    await applyAndRecord(api, acc.token, acc.id, c.ma_giam_gia, Number(c.tong_tien));

    // Client cố tình bỏ user_id để né nhánh kiểm tra giới hạn
    const bypass = await api.post(`${API}/apply-coupon`, {
      data: { code: c.ma_giam_gia, total_amount: Number(c.tong_tien), user_id: null },
    });

    // P4 — server phải lấy danh tính từ token, không tin user_id do client gửi
    expect(bypass.status(),
      `TC15: bỏ user_id là né được giới hạn lượt dùng — bug ${c.ref_bug}`,
    ).toBe(Number(c.expect_status));
  });

  test(`TC16 [negative] ${tc('TC16').mo_ta}`, async () => {
    const c = tc('TC16');
    const api = await request.newContext();
    const acc = await createAccount(api);

    for (let i = 1; i <= 2; i++) {
      const r = await applyAndRecord(api, acc.token, acc.id, c.ma_giam_gia, Number(c.tong_tien));
      expect(r.status(), `lượt dùng thứ ${i} của VIP100 phải thành công`).toBe(200);
    }
    const third = await applyAndRecord(api, acc.token, acc.id, c.ma_giam_gia, Number(c.tong_tien));

    // P4 — VIP100 cho tối đa 2 lượt mỗi người
    expect(third.status()).toBe(Number(c.expect_status));
  });

  test(`TC17 [edge] ${tc('TC17').mo_ta}`, async () => {
    const c = tc('TC17');
    const api = await request.newContext();
    const acc = await createAccount(api);

    // Đặt hàng với tổng tiền 1.000₫ trong khi giỏ hàng thật đắt hơn nhiều
    const res = await api.post(`${API}/checkout`, {
      data: { items: [{ id: 1, name: 'iPhone 15', price: 25000000, quantity: 1 }], total_amount: Number(c.tong_tien) },
      headers: { Authorization: `Bearer ${acc.token}` },
    });

    // P4 — server phải tự tính lại tổng tiền từ giỏ hàng, không tin số client gửi
    expect(res.status(),
      `TC17: server nhận tổng tiền ${c.tong_tien}₫ do client tự đặt — bug ${c.ref_bug}`,
    ).toBe(Number(c.expect_status));
  });

  test(`TC18 [edge] ${tc('TC18').mo_ta}`, async () => {
    const c = tc('TC18');
    const api = await request.newContext();

    const res = await api.post(`${API}/apply-coupon`, {
      data: { code: c.ma_giam_gia, total_amount: Number(c.tong_tien) },
    });

    // P4 — tổng tiền âm là dữ liệu không hợp lệ
    expect(res.status()).toBe(Number(c.expect_status));

    // P5 — bất biến: nếu vẫn trả về kết quả thì thành tiền không được âm
    if (res.ok()) {
      const body = await res.json();
      expect(body.final_amount, 'TC18: thành tiền âm').toBeGreaterThanOrEqual(0);
    }
  });
});
