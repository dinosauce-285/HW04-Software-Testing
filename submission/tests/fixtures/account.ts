import { APIRequestContext, request } from '@playwright/test';

const API = 'http://localhost:3000/api';

/**
 * Tạo một tài khoản MỚI cho mỗi test.
 *
 * Vì sao cần: giới hạn `max_uses_per_user` của mã giảm giá được tính theo user và lưu tích lũy
 * trong bảng coupon_usage. Nếu mọi test đều dùng chung tài khoản seed test@eshop.com thì test
 * chạy trước sẽ tiêu hết lượt dùng, test chạy sau fail vì "đã đạt giới hạn" - fail sai lý do,
 * và kết quả phụ thuộc thứ tự chạy.
 *
 * Mật khẩu dùng "Test 1234" vì đó là dạng mật khẩu mà SUT hiện chấp nhận (bug A01) - ở đây
 * chỉ cần đăng nhập được để tới màn hình thanh toán, không phải để kiểm thử quy tắc mật khẩu.
 */
export type Account = { email: string; password: string; token: string; id: number };

export async function createAccount(api?: APIRequestContext): Promise<Account> {
  const ctx = api ?? (await request.newContext());
  const email = `hw04.fr09.${Date.now()}.${Math.floor(process.hrtime()[1] / 1000)}@test.local`;
  const password = 'Test 1234';

  await ctx.post(`${API}/register`, { data: { name: 'Người mua thử', email, password } });
  const res = await ctx.post(`${API}/login`, { data: { email, password } });
  const body = await res.json();

  return { email, password, token: body.token, id: body.user.id };
}
