# Bug Report — EShop

*(CLAUDE.md R6 · đề HW04 §6:85 — bug phải có mặt ở **cả** file này **và** GitHub Issues, mỗi issue kèm screenshot)*

**Quy tắc:** số dòng trong bảng dưới phải **khớp** số issue trên https://github.com/dinosauce-285/HW04-Software-Testing/issues

Mức nghiêm trọng: `Critical` · `Major` · `Minor` · `Trivial`

| # | ID | Feature | Tiêu đề | Mức | Test case phát hiện | Screenshot | GitHub Issue |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

---

## Ứng viên từ giai đoạn khảo sát (04/08/2026)

⚠️ Đã kiểm chứng thủ công qua `survey/survey.spec.ts` nhưng **chưa** có test case automation tương ứng và **chưa** tạo GitHub Issue. Chỉ đưa lên bảng chính khi đã có assertion fail thật chỉ vào nó.

Chi tiết và bằng chứng: `survey/Survey-Report.md §2–§4`.

| Mã | Feature | Tóm tắt | Mức đề xuất |
|---|---|---|---|
| A01 | FR-01 | Regex mật khẩu đòi khoảng trắng và cấm ký tự đặc biệt, ngược với hint hiển thị ngay dưới ô nhập | Critical |
| A02 | FR-01 | Ô Email là `type="text"`, không validate định dạng | Minor |
| A03 | FR-01 | API nhận email sai định dạng và mật khẩu 1 ký tự | Major |
| A04 | FR-01 | Đăng ký trùng email được chấp nhận (`users.email` không UNIQUE) | Critical |
| A05 | FR-01 | Không có ô xác nhận mật khẩu | Minor |
| A06 | FR-01 | Mật khẩu lưu plaintext và trả về trong response đăng nhập | Critical |
| B01 | FR-09 | Công thức giảm giá phần trăm sai — đơn 500.000₫ áp mã "giảm 10%" thành 5.000.000₫ | Critical |
| B02 | FR-09 | Lỗi biên `>` thay vì `>=` ở `min_order_amount` | Major |
| B03 | FR-09 | `POST /api/apply-coupon` không yêu cầu token | Major |
| B04 | FR-09 | Gửi `user_id=null` là bỏ qua giới hạn lượt dùng | Critical |
| B05 | FR-09 | Tổng tiền thanh toán là input sửa được tự do ở trang Checkout | Critical |
| B06 | FR-09 | Lượt dùng mã ghi bằng API call riêng sau checkout, chặn được | Major |
| C01 | FR-14 | Thêm danh mục tên rỗng được chấp nhận | Major |
| C02 | FR-14 | Thêm danh mục trùng tên được chấp nhận | Major |
| C03 | FR-14 | Không lọc XSS, không giới hạn độ dài tên | Major |
| C04 | FR-14 | Xóa không có hộp thoại xác nhận | Minor |
| C05 | FR-14 | Xóa danh mục đang chứa sản phẩm, để lại sản phẩm mồ côi | Critical |
| C06 | FR-14 | User thường tạo/xóa được danh mục — `authenticateToken` không kiểm role | Critical |
| C07 | FR-14 | API có `PUT /api/categories/:id` nhưng UI không có nút Sửa | Minor |
| C08 | FR-14 | Tên danh mục không được cắt khoảng trắng thừa hai đầu — lưu `'  Sách và Văn phòng phẩm  '` nguyên văn. *Phát hiện thêm khi viết TC08, không có trong khảo sát ban đầu* | Minor |
| C09 | FR-14 | `DELETE /api/categories/:id` với ID không tồn tại trả `200 Category deleted` thay vì `404`. *Phát hiện thêm khi viết TC13* | Minor |

**Ngoài phạm vi 3 feature** (ghi nhận nhưng không đưa vào bug report chính): ô mật khẩu trang Login là `type="text"`; `setup_guide.md` ghi sai mật khẩu admin; doanh thu ở dashboard admin nhân đôi đơn `delivered`.
