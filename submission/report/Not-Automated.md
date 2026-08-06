# Test case không automate được

*(CLAUDE.md R7 / đề HW04 mục 6:85 - "Document any test cases you could not automate and explain why")*

Ghi ngay khi quyết định bỏ qua / `test.skip` / không viết được. Lý do phải là lý do **kỹ thuật cụ thể**, không phải "không kịp thời gian".

**Kết quả: không có test case nào.** Toàn bộ 50 test case của 3 feature đều automate được và đều chạy đủ trên chromium, firefox, webkit.

| # | Feature | Test case | Lý do không automate được | Đã kiểm thủ công? |
|---|---|---|---|---|
| - | - | *(không có)* | - | - |

## Vì sao đạt được 100%

Cả ba feature đều thao tác trên dữ liệu mà bộ test tự tạo và tự kiểm soát:

| Feature | Dữ liệu cần | Cách bộ test kiểm soát |
|---|---|---|
| FR-01 Đăng ký | Tài khoản mới | Tạo qua `POST /api/register` với email sinh theo timestamp |
| FR-09 Mã giảm giá | Tài khoản + giỏ hàng + mã | Tài khoản mới mỗi test (`tests/fixtures/account.ts`); mã lấy từ seed; giỏ hàng thêm bằng click |
| FR-14 Danh mục | Danh mục | Tự thêm rồi tự xóa trong cùng một test |

Không trường hợp nào phụ thuộc email thật, cổng thanh toán thật, CAPTCHA, hay xác nhận của con người - đó mới là những thứ thường buộc phải kiểm thủ công.

## Hai hạn chế đã lường trước và xử lý được

| Hạn chế | Cách xử lý |
|---|---|
| Giỏ hàng nằm trong `CartContext`, không sống qua reload | Điều hướng tới trang thanh toán hoàn toàn bằng click, không dùng `page.goto` |
| Bảng `coupon_usage` tích lũy, làm test phụ thuộc thứ tự chạy | Mỗi test tạo tài khoản riêng; `globalSetup` reset DB trước mỗi lượt chạy |
