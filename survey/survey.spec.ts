import { test, expect, request } from '@playwright/test';

const WEB = 'http://localhost:5173';
const ADMIN = 'http://localhost:5174';
const API = 'http://localhost:3000/api';

/** Khảo sát thực tế 3 feature đã chọn — KHÔNG phải bộ test nộp bài.
 *  Mục đích: xác minh hành vi thật để không viết script dựa trên phỏng đoán (CLAUDE.md R10). */

const found: string[] = [];
const note = (id: string, msg: string) => { found.push(`${id} :: ${msg}`); console.log(`\n### ${id}\n${msg}`); };

test.afterAll(() => {
  console.log('\n\n===== TỔNG HỢP KHẢO SÁT =====');
  found.forEach(f => console.log('- ' + f));
});

// ────────────────────────────────────────── FR-01 Đăng ký
test.describe('FR-01 Đăng ký tài khoản', () => {
  test('khảo sát form + validation', async ({ page }) => {
    await page.goto(`${WEB}/register`);

    const email = page.locator('input').nth(1);
    note('FR01-A', `type của ô Email = "${await email.getAttribute('type')}" (kỳ vọng "email")`);
    note('FR01-B', `Số ô input trên form = ${await page.locator('input').count()} — có ô xác nhận mật khẩu không?`);

    // Mật khẩu đúng như hint mô tả: có ký tự đặc biệt
    await page.locator('input').nth(0).fill('Nguyen Van A');
    await email.fill(`probe${Date.now()}@x.com`);
    await page.locator('input[type=password]').fill('Test1234!');
    await page.getByRole('button', { name: 'Đăng Ký' }).click();
    const err1 = await page.locator('.bg-red-100').textContent().catch(() => null);
    note('FR01-C', `Mật khẩu "Test1234!" (đúng hint: có ký tự đặc biệt) → ${err1 ? 'BỊ TỪ CHỐI: ' + err1.trim() : 'được chấp nhận, URL=' + page.url()}`);
    await page.screenshot({ path: 'survey/shots/fr01-special-char.png', fullPage: true });

    // Mật khẩu có dấu cách, không có ký tự đặc biệt
    await page.goto(`${WEB}/register`);
    await page.locator('input').nth(0).fill('Nguyen Van B');
    await page.locator('input').nth(1).fill(`probe${Date.now()}b@x.com`);
    await page.locator('input[type=password]').fill('Test 1234');
    await page.getByRole('button', { name: 'Đăng Ký' }).click();
    await page.waitForTimeout(800);
    note('FR01-D', `Mật khẩu "Test 1234" (có DẤU CÁCH, không ký tự đặc biệt) → URL sau submit = ${page.url()}`);
    await page.screenshot({ path: 'survey/shots/fr01-space-pass.png', fullPage: true });
  });

  test('email trùng và email sai định dạng (qua API)', async () => {
    const api = await request.newContext();
    const dup = `dup${Date.now()}@x.com`;
    const r1 = await api.post(`${API}/register`, { data: { name: 'A', email: dup, password: 'Test 1234' } });
    const r2 = await api.post(`${API}/register`, { data: { name: 'B', email: dup, password: 'Test 1234' } });
    note('FR01-E', `Đăng ký trùng email: lần 1 = ${r1.status()}, lần 2 = ${r2.status()} (kỳ vọng lần 2 phải lỗi)`);

    const bad = await api.post(`${API}/register`, { data: { name: 'C', email: 'khong-phai-email', password: '1' } });
    note('FR01-F', `Email "khong-phai-email" + mật khẩu "1" qua API → ${bad.status()} ${await bad.text()}`);

    const login = await api.post(`${API}/login`, { data: { email: dup, password: 'Test 1234' } });
    const body = await login.json();
    note('FR01-G', `Response login có trả về trường password không? → ${JSON.stringify(body.user?.password)}`);
  });
});

// ────────────────────────────────────────── FR-09 Mã giảm giá
test.describe('FR-09 Mã giảm giá', () => {
  test('khảo sát UI checkout', async ({ page }) => {
    await page.goto(`${WEB}/login`);
    await page.locator('input').nth(0).fill('test@eshop.com');
    await page.locator('input').nth(1).fill('Test1234!'); // ô mật khẩu login là type=text, không phải password
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(1000);
    note('FR09-A', `Đăng nhập test@eshop.com → URL = ${page.url()}`);

    await page.goto(WEB);
    await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
    await page.goto(`${WEB}/checkout`);
    await page.waitForTimeout(500);

    const totalInput = page.locator('input[type=number]');
    const before = await totalInput.inputValue();
    note('FR09-B', `Ô "Tổng tiền thanh toán" là input[type=number] có sửa được — giá trị hiện tại = ${before}`);

    // Đặt tổng = 500000 rồi áp SAVE10 (percent 10%)
    await totalInput.fill('500000');
    await page.getByPlaceholder('Nhập mã giảm giá...').fill('SAVE10');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await page.waitForTimeout(800);
    const box = await page.locator('div.p-4.bg-gray-50').textContent();
    note('FR09-C', `Tổng 500.000₫ + SAVE10 (giảm 10%) → ${box?.replace(/\s+/g, ' ').trim()}`);
    await page.screenshot({ path: 'survey/shots/fr09-save10.png', fullPage: true });

    // Biên: tổng đúng bằng min_order_amount của BIGBUY (500.000)
    await page.getByPlaceholder('Nhập mã giảm giá...').fill('BIGBUY');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await page.waitForTimeout(800);
    note('FR09-D', `Tổng = 500.000₫ đúng bằng min_order_amount của BIGBUY → ${(await page.locator('div.p-4.bg-gray-50').textContent())?.replace(/\s+/g, ' ').trim()}`);

    // Trên biên 1 đồng
    await totalInput.fill('500001');
    await page.getByPlaceholder('Nhập mã giảm giá...').fill('BIGBUY');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await page.waitForTimeout(800);
    note('FR09-E', `Tổng = 500.001₫ (hơn biên 1₫) → ${(await page.locator('div.p-4.bg-gray-50').textContent())?.replace(/\s+/g, ' ').trim()}`);

    // Mã hết hạn
    await totalInput.fill('500000');
    await page.getByPlaceholder('Nhập mã giảm giá...').fill('EXPIRED');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await page.waitForTimeout(800);
    note('FR09-F', `Mã EXPIRED → ${(await page.locator('div.p-4.bg-gray-50').textContent())?.replace(/\s+/g, ' ').trim()}`);
  });

  test('giới hạn lượt dùng và endpoint công khai (qua API)', async () => {
    const api = await request.newContext();
    const noAuth = await api.post(`${API}/apply-coupon`, { data: { code: 'VIP100', total_amount: 400000 } });
    note('FR09-G', `POST /apply-coupon KHÔNG kèm token → ${noAuth.status()} ${await noAuth.text()}`);

    const login = await api.post(`${API}/login`, { data: { email: 'test@eshop.com', password: 'Test1234!' } });
    const { token, user } = await login.json();
    for (let i = 1; i <= 3; i++) {
      const r = await api.post(`${API}/apply-coupon`, { data: { code: 'SAVE10', total_amount: 400000, user_id: user.id } });
      await api.post(`${API}/coupon-usage`, { data: { coupon_id: 1 }, headers: { Authorization: `Bearer ${token}` } });
      note('FR09-H' + i, `SAVE10 lần ${i} với user_id=${user.id} (max_uses_per_user=1) → ${r.status()} ${(await r.text()).slice(0, 120)}`);
    }
    const bypass = await api.post(`${API}/apply-coupon`, { data: { code: 'SAVE10', total_amount: 400000, user_id: null } });
    note('FR09-I', `SAVE10 nhưng gửi user_id=null → ${bypass.status()} ${(await bypass.text()).slice(0, 120)}`);
  });
});

// ────────────────────────────────────────── FR-14 Quản lý danh mục
test.describe('FR-14 Quản lý danh mục', () => {
  test('khảo sát tab Danh mục', async ({ page }) => {
    await page.goto(ADMIN);
    await page.locator('input').nth(0).fill('admin@eshop.com');
    await page.locator('input[type=password]').fill('Admin123!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(1200);
    await page.getByText('Danh mục', { exact: true }).click();
    await page.waitForTimeout(500);

    const rowsBefore = await page.locator('tbody tr').count();
    note('FR14-A', `Vào tab Danh mục — số dòng hiện có = ${rowsBefore}. Cột "Hành động" có nút nào: ${await page.locator('tbody tr').first().locator('button').allInnerTexts()}`);
    await page.screenshot({ path: 'survey/shots/fr14-list.png', fullPage: true });

    // Thêm tên rỗng
    await page.getByRole('button', { name: 'Thêm mới' }).click();
    await page.waitForTimeout(700);
    note('FR14-B', `Bấm "Thêm mới" với ô tên RỖNG → số dòng = ${await page.locator('tbody tr').count()} (trước đó ${rowsBefore})`);

    // Thêm trùng tên có sẵn
    const nameInput = page.getByPlaceholder('Tên danh mục mới');
    await nameInput.fill('Laptop');
    await page.getByRole('button', { name: 'Thêm mới' }).click();
    await page.waitForTimeout(700);
    const laptopCount = await page.locator('tbody tr', { hasText: 'Laptop' }).count();
    note('FR14-C', `Thêm danh mục trùng tên "Laptop" → số dòng tên Laptop = ${laptopCount}`);

    // XSS
    await nameInput.fill('<img src=x onerror=alert(1)>');
    await page.getByRole('button', { name: 'Thêm mới' }).click();
    await page.waitForTimeout(700);
    note('FR14-D', `Thêm tên "<img src=x onerror=alert(1)>" → tổng số dòng = ${await page.locator('tbody tr').count()}`);

    // Tên rất dài
    await nameInput.fill('X'.repeat(500));
    await page.getByRole('button', { name: 'Thêm mới' }).click();
    await page.waitForTimeout(700);
    note('FR14-E', `Thêm tên dài 500 ký tự → tổng số dòng = ${await page.locator('tbody tr').count()}`);
    await page.screenshot({ path: 'survey/shots/fr14-after-adds.png', fullPage: true });

    // Xóa: có hộp thoại xác nhận không?
    let dialogSeen = false;
    page.on('dialog', d => { dialogSeen = true; d.dismiss(); });
    const n = await page.locator('tbody tr').count();
    await page.locator('tbody tr').last().getByRole('button', { name: 'Xóa' }).click();
    await page.waitForTimeout(800);
    note('FR14-F', `Bấm "Xóa" → có hộp thoại xác nhận? ${dialogSeen} · số dòng ${n} → ${await page.locator('tbody tr').count()}`);
  });

  test('xóa danh mục đang có sản phẩm + phân quyền (qua API)', async () => {
    const api = await request.newContext();
    const admin = await (await api.post(`${API}/login`, { data: { email: 'admin@eshop.com', password: 'Admin123!' } })).json();
    const userRes = await (await api.post(`${API}/login`, { data: { email: 'test@eshop.com', password: 'Test1234!' } })).json();

    const prodsBefore = await (await api.get(`${API}/products?category_id=1`)).json();
    note('FR14-G', `Danh mục #1 "Điện thoại" đang có ${Array.isArray(prodsBefore) ? prodsBefore.length : '?'} sản phẩm`);

    const del = await api.delete(`${API}/categories/1`, { headers: { Authorization: `Bearer ${admin.token}` } });
    note('FR14-H', `Xóa danh mục #1 dù đang có sản phẩm → ${del.status()} ${await del.text()}`);
    const orphan = await (await api.get(`${API}/products`)).json();
    note('FR14-I', `Sau khi xóa, số sản phẩm còn tham chiếu category_id=1 = ${orphan.filter?.((p: any) => p.category_id === 1).length}`);

    const asUser = await api.post(`${API}/categories`, {
      data: { name: 'TAO-BOI-USER-THUONG' },
      headers: { Authorization: `Bearer ${userRes.token}` },
    });
    note('FR14-J', `Tài khoản USER THƯỜNG gọi POST /api/categories → ${asUser.status()} ${await asUser.text()}`);
  });
});
