import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object — trang Đăng ký của Frontend Web (FR-01).
 *
 * Selector đọc từ sut/frontend-web/src/pages/Register.jsx.
 * Bẫy đã ghi nhận (survey/Survey-Report.md §5):
 *   - Ô Email là type="text", KHÔNG phải type="email" → không định vị bằng input[type=email] được.
 *   - Form không có label liên kết với input (chỉ có <label> rời), nên getByLabel không dùng được;
 *     phải định vị theo thứ tự input trong form.
 *   - Đăng ký thành công thì điều hướng sang /login, không hiện thông báo thành công.
 */
export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorBox: Locator;
  readonly passwordHint: Locator;

  constructor(page: Page) {
    this.page = page;
    const inputs = page.locator('form input');
    this.nameInput = inputs.nth(0);
    this.emailInput = inputs.nth(1);
    this.passwordInput = page.locator('input[type=password]');
    this.submitButton = page.getByRole('button', { name: 'Đăng Ký' });
    this.errorBox = page.locator('.bg-red-100');
    this.passwordHint = page.getByText('Yêu cầu:', { exact: false });
  }

  async goto() {
    await this.page.goto('http://localhost:5173/register');
    await expect(this.page.getByRole('heading', { name: 'Đăng Ký Tài Khoản' })).toBeVisible();
  }

  async fill(name: string, email: string, password: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  /** Đăng ký thành công = điều hướng sang /login. */
  async isRegistered(): Promise<boolean> {
    try {
      await this.page.waitForURL('**/login', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}
