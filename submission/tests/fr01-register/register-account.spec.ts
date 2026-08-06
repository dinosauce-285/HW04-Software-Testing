import { test, expect, request } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { readCsv, expand } from '../fixtures/csv';

/**
 * FR-01 - Đăng ký tài khoản / trùng lặp và bảo mật (TC13-TC16)
 *
 * Assertion pattern bổ sung:
 *   P4 - mã trạng thái HTTP  expect(res.status()).toBe()
 *   P5 - cấu trúc dữ liệu    expect(object).not.toHaveProperty()
 */

const API = 'http://localhost:3000/api';
const cases = readCsv<{
  tc_id: string; loai: string; mo_ta: string;
  ho_ten: string; email: string; mat_khau: string; expect_status: string; ref_bug: string;
}>('fr01-account-api.csv');
const tc = (id: string) => cases.find(c => c.tc_id === id)!;

test.describe('FR-01 Đăng ký — Trùng lặp và bảo mật', () => {
  test(`TC13 [negative] ${tc('TC13').mo_ta}`, async () => {
    const c = tc('TC13');
    const api = await request.newContext();
    const email = expand(c.email, c.tc_id);

    const first = await api.post(`${API}/register`, {
      data: { name: c.ho_ten, email, password: c.mat_khau },
    });
    expect(first.status(), 'lần đăng ký đầu tiên phải thành công').toBe(200);

    const second = await api.post(`${API}/register`, {
      data: { name: c.ho_ten, email, password: c.mat_khau },
    });

    // P4 - email đã tồn tại thì phải bị từ chối
    expect(second.status(),
      `TC13: đăng ký lại cùng email "${email}" vẫn thành công — bug ${c.ref_bug}`,
    ).toBe(Number(c.expect_status));
  });

  test(`TC14 [negative] ${tc('TC14').mo_ta}`, async () => {
    const c = tc('TC14');
    const api = await request.newContext();

    const res = await api.post(`${API}/register`, {
      data: { name: c.ho_ten, email: c.email, password: c.mat_khau },
    });

    // P4 - backend phải tự validate, không phó mặc cho frontend
    expect(res.status(),
      `TC14: API nhận email "${c.email}" và mật khẩu "${c.mat_khau}" — bug ${c.ref_bug}`,
    ).toBe(Number(c.expect_status));
  });

  test(`TC15 [edge] ${tc('TC15').mo_ta}`, async () => {
    const c = tc('TC15');
    const api = await request.newContext();
    const email = expand(c.email, c.tc_id);

    await api.post(`${API}/register`, { data: { name: c.ho_ten, email, password: c.mat_khau } });
    const login = await api.post(`${API}/login`, { data: { email, password: c.mat_khau } });
    const body = await login.json();

    // P5 - response không được chứa mật khẩu dưới bất kỳ dạng nào
    expect(body.user,
      `TC15: response đăng nhập trả về mật khẩu plaintext — bug ${c.ref_bug}`,
    ).not.toHaveProperty('password');
  });

  test(`TC16 [edge] ${tc('TC16').mo_ta}`, async ({ page }) => {
    const c = tc('TC16');
    const api = await request.newContext();
    const email = expand(c.email, c.tc_id);

    // Tạo sẵn tài khoản qua API để thử đăng ký lại bằng giao diện
    await api.post(`${API}/register`, { data: { name: c.ho_ten, email, password: c.mat_khau } });

    const reg = new RegisterPage(page);
    await reg.goto();
    await reg.fill(c.ho_ten, email, c.mat_khau);
    await reg.submit();

    // Chờ trạng thái ổn định trước khi khẳng định - xem ghi chú ở register-validation.spec.ts
    const registered = await reg.isRegistered();

    expect(registered,
      `TC16: giao diện cho đăng ký trùng email "${email}" — bug ${c.ref_bug}`,
    ).toBe(false);

    // P1 + P3 - ở lại trang đăng ký và hiện thông báo lỗi cho người dùng
    await expect(page).toHaveURL(/\/register$/);
    await expect(reg.errorBox).toBeVisible();
  });
});
