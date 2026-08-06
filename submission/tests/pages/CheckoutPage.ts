import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object - trang Xác Nhận Đơn Hàng / áp mã giảm giá (FR-09).
 *
 * Selector đọc từ sut/frontend-web/src/pages/{Login,Cart,Checkout}.jsx.
 * Bẫy đã ghi nhận (survey/Survey-Report.md mục 5):
 *   - Nút đăng nhập có nhãn "Sign In", và ô mật khẩu trang Login là type="text"
 *     -> KHÔNG định vị được bằng input[type=password].
 *   - Giỏ hàng nằm trong CartContext (chỉ ở bộ nhớ), reload là mất
 *     -> phải đi từ trang chủ sang checkout bằng CLICK, không được page.goto('/checkout').
 *   - Trang checkout có 2 phần tử khớp '.bg-gray-50' -> phải dùng 'div.p-4.bg-gray-50'.
 */
export class CheckoutPage {
  readonly page: Page;
  readonly totalInput: Locator;
  readonly couponInput: Locator;
  readonly applyButton: Locator;
  readonly couponPanel: Locator;
  readonly grandTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalInput = page.locator('input[type=number]');
    this.couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
    this.applyButton = page.getByRole('button', { name: 'Áp dụng' });
    this.couponPanel = page.locator('div.p-4.bg-gray-50');
    this.grandTotal = page.getByText('Tổng thanh toán:', { exact: false });
  }

  async login(email = 'test@eshop.com', password = 'Test1234!') {
    await this.page.goto('http://localhost:5173/login');
    const inputs = this.page.locator('form input');
    await inputs.nth(0).fill(email);
    await inputs.nth(1).fill(password); // ô mật khẩu là type="text", không phải password
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    // Phải chờ chỉ dấu CHỈ xuất hiện khi đã đăng nhập.
    // Không dùng link "Giỏ hàng": App.jsx:23 hiển thị nó ở cả hai trạng thái nên nó không
    // kiểm chứng được gì, và khi login hỏng thì lỗi mới nổ ở tận trang Cart.
    await expect(this.page.getByRole('button', { name: 'Thoát' })).toBeVisible();
  }

  /** Đi từ trang chủ tới checkout hoàn toàn bằng click - giỏ hàng không sống qua reload. */
  async goToCheckoutWithOneProduct() {
    await this.page.goto('http://localhost:5173/');
    await this.page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
    await this.page.getByRole('link', { name: 'Giỏ hàng' }).click();
    await this.page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
    await expect(this.page.getByRole('heading', { name: 'Xác Nhận Đơn Hàng' })).toBeVisible();
  }

  async setTotal(amount: number | string) {
    await this.totalInput.fill(String(amount));
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    if (await this.applyButton.isDisabled()) return;      // mã rỗng -> nút bị khoá
    await this.applyButton.click();
    // Chờ phản hồi hiện ra (thành công hoặc lỗi) thay vì chờ thời gian cố định
    await this.couponPanel
      .locator('.text-green-700, .text-red-600')
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => { /* không phản hồi cũng là một kết quả — để test tự khẳng định */ });
  }

  /** Số tiền tiết kiệm hiển thị, đơn vị đồng. null nếu không áp được mã. */
  async discountAmount(): Promise<number | null> {
    const el = this.couponPanel.getByText('Tiết kiệm:', { exact: false });
    if (!(await el.count())) return null;
    return this.parseMoney(await el.innerText());
  }

  /** Thành tiền sau giảm giá hiển thị trong khối mã giảm giá. */
  async finalAmount(): Promise<number | null> {
    const el = this.couponPanel.getByText('Thành tiền:', { exact: false });
    if (!(await el.count())) return null;
    return this.parseMoney(await el.innerText());
  }

  async errorMessage(): Promise<string | null> {
    const el = this.couponPanel.locator('.text-red-600');
    return (await el.count()) ? (await el.innerText()).trim() : null;
  }

  async isApplied(): Promise<boolean> {
    return (await this.couponPanel.locator('.text-green-700').count()) > 0;
  }

  /** "Tiết kiệm: -4,500,000  VND" -> -4500000. Giữ nguyên dấu âm để lộ được bug B01. */
  private parseMoney(text: string): number {
    const m = text.match(/-?[\d.,]+/g)?.pop() ?? '0';
    const sign = /-\s*[\d.,]+\s*₫/.test(text) || text.includes('-') ? -1 : 1;
    return sign * Number(m.replace(/[.,]/g, '').replace('-', ''));
  }
}
