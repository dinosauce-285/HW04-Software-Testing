import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object — màn hình "Quản lý Danh mục" của Web Admin (FR-14).
 *
 * Mọi selector ở đây được đọc trực tiếp từ sut/frontend-admin/src/App.jsx, KHÔNG suy đoán
 * từ tên chức năng. Ba cái bẫy đã ghi nhận trong survey/Survey-Report.md §5:
 *   - Nút đăng nhập admin có nhãn "Login" (tiếng Anh), không phải "Đăng nhập".
 *   - Ô email của form đăng nhập không có type, chỉ có placeholder "Email".
 *   - Bảng danh mục không có nút Sửa — UI chỉ có Thêm và Xóa (App.jsx:294-335).
 */
export class AdminCategoryPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly addButton: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder('Tên danh mục mới');
    this.addButton = page.getByRole('button', { name: 'Thêm mới' });
    this.rows = page.locator('tbody tr');
  }

  async login(email = 'admin@eshop.com', password = 'Admin123!') {
    await this.page.goto('http://localhost:5174/');
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await expect(this.page.getByRole('heading', { name: 'EShop Admin' })).toBeVisible();
  }

  async openCategoryTab() {
    await this.page.getByText('Danh mục', { exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Quản lý Danh mục' })).toBeVisible();
  }

  /** Điền tên rồi bấm "Thêm mới". Không assert — để test tự quyết định kỳ vọng. */
  async addCategory(name: string) {
    await this.nameInput.fill(name);
    await this.addButton.click();
    await this.page.waitForResponse(
      r => r.url().includes('/api/categories') && r.request().method() === 'GET',
      { timeout: 5000 },
    ).catch(() => { /* form không gọi API khi bị chặn phía client — đó cũng là một kết quả hợp lệ */ });
  }

  /** Số dòng hiện có trong bảng danh mục. */
  async count(): Promise<number> {
    return this.rows.count();
  }

  /** Các dòng có ô "Tên Danh Mục" khớp chính xác chuỗi truyền vào. */
  rowsNamed(name: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('cell', { name, exact: true }) });
  }

  async deleteRowNamed(name: string) {
    await this.rowsNamed(name).first().getByRole('button', { name: 'Xóa' }).click();
  }

  /** Danh sách tên danh mục đang hiển thị, đã cắt khoảng trắng — dùng để kiểm tra sự tồn tại. */
  async listNames(): Promise<string[]> {
    return (await this.rawNames()).map(t => t.trim());
  }

  /**
   * Danh sách tên NGUYÊN VĂN, không cắt khoảng trắng.
   * Bắt buộc dùng khi kiểm tra việc trim: getByRole('cell', {name}) chuẩn hóa khoảng trắng
   * theo chuẩn accessible name nên sẽ khớp cả khi hệ thống KHÔNG trim → assertion pass sai lý do.
   */
  async rawNames(): Promise<string[]> {
    return this.rows.locator('td:nth-child(2)').allTextContents();
  }
}
