# Khảo sát SUT trước khi viết automation — HW04

**Ngày:** 2026-08-04 · **Người thực hiện:** Lý Quốc Thạnh (23127262)
**Mục đích:** xác minh hành vi thật của 3 feature đã chọn trước khi cho AI sinh script, theo `CLAUDE.md` R10 — không viết test dựa trên phỏng đoán.
**Công cụ:** Playwright 1.x (chromium) + gọi API trực tiếp. Script khảo sát: `survey/survey.spec.ts`.

## 0. Môi trường

| Thành phần | URL | Ghi chú |
|---|---|---|
| Backend API | `http://localhost:3000` | `node server.js`, SQLite `backend/database.sqlite` |
| Frontend Web | `http://localhost:5173` | Vite + React |
| Frontend Admin | `http://localhost:5174` | Vite + React |
| Reset dữ liệu | `node backend/database.js` | seed lại toàn bộ |

**Tài khoản** (lấy từ `backend/database.js`, **không** theo `setup_guide.md`):

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | `admin@eshop.com` | `Admin123!` |
| User | `test@eshop.com` | `Test1234!` |

> ⚠️ `setup_guide.md` ghi mật khẩu admin là `admin123` — **sai**, đăng nhập trả `401 Invalid email or password`. Mật khẩu thật là `Admin123!`.

## 1. Kết luận: 3 feature có đủ điều kiện làm bài không?

| Yêu cầu | FR-01 Đăng ký | FR-09 Mã giảm giá | FR-14 Danh mục |
|---|---|---|---|
| ≥ 12 test case | ✅ đủ (ước ~16) | ✅ đủ (ước ~18) | ✅ đủ (ước ~14) |
| Data-driven (`.csv`/`.json`) | ✅ bộ mật khẩu/email | ✅ bộ mã × tổng tiền | ✅ bộ tên danh mục |
| ≥ 3 assertion pattern | ✅ | ✅ | ✅ |
| Chạy 3 browser | ✅ chromium · firefox · chrome | ✅ | ✅ |
| Có bug thật để báo cáo | ✅ 6 | ✅ 6 | ✅ 7 |

**Đủ điều kiện cả ba.** Riêng FR-14 UI chỉ có Thêm/Xóa (không có Sửa) nên phải bù số lượng test case bằng validation và phân quyền — đã kiểm chứng là có đủ.

### Ghi chú về browser
`chromium` và `firefox` chạy tốt. **`webkit` không khởi động được** — thiếu thư viện hệ thống:
```
libevent-2.1-7t64 libflite1 libavif16 libmanette-0.2-0 gstreamer1.0-libav
```
Hai hướng xử lý, chọn một:
- `sudo npx playwright install-deps` → dùng bộ **chromium / firefox / webkit** (đúng phương án 1 của đề §6:83).
- Hoặc cài Microsoft Edge → dùng bộ **chrome / edge / firefox** (phương án 2 của đề).

Hiện `google-chrome` đã có sẵn trên máy nên phương án 2 khả thi ngay. **Không nên** dùng bộ `chromium + chrome + firefox` vì chromium và chrome cùng engine, TA có thể không tính là 3 browser khác nhau.

## 2. Phát hiện — FR-01 Đăng ký tài khoản

| ID | Phát hiện | Bằng chứng |
|---|---|---|
| A01 | **Regex mật khẩu mâu thuẫn với chính hint của nó.** Hint ghi "phải có ký tự đặc biệt", nhưng regex `(?=.*\s)[A-Za-z\d\s]{8,}` lại **đòi khoảng trắng** và **cấm ký tự đặc biệt**. | `Test1234!` → *"Mật khẩu quá yếu!"*; `Test 1234` → đăng ký **thành công**, chuyển sang `/login` |
| A02 | Ô Email là `type="text"`, không phải `type="email"` → không có validate định dạng phía trình duyệt | `Register.jsx:48` |
| A03 | API nhận email sai định dạng | `POST /api/register {"email":"khong-phai-email","password":"1"}` → `200 User registered successfully` |
| A04 | **Đăng ký trùng email được chấp nhận** — cột `users.email` không có ràng buộc `UNIQUE` | cùng email gọi 2 lần → `200` và `200` |
| A05 | Không có ô xác nhận mật khẩu (form chỉ 3 input) | đếm `input` = 3 |
| A06 | **Mật khẩu lưu plaintext và bị trả về trong response đăng nhập** | `POST /api/login` → `user.password: "Test 1234"` |

Backend `POST /api/register` (`server.js:20-30`) **không validate gì cả** — mọi ràng buộc chỉ nằm ở frontend, gọi thẳng API là bỏ qua hết.

## 3. Phát hiện — FR-09 Mã giảm giá

| ID | Phát hiện | Bằng chứng |
|---|---|---|
| B01 | **Công thức giảm giá phần trăm sai nghiêm trọng.** `discount = floor(total × (1 − discount_value))`, với `discount_value = 10` cho `SAVE10` → `discount = −9 × total`. Đơn hàng **đắt lên gấp 10 lần**. | Tổng 500.000₫ + `SAVE10` → *"Tiết kiệm: **-4,500,000 ₫** · Thành tiền: **5,000,000 ₫**"* |
| B02 | **Lỗi biên**: điều kiện dùng `total_amount > min_order_amount` thay vì `>=` | Tổng **500.000₫** đúng bằng mức tối thiểu của `BIGBUY` → *"chưa đủ giá trị tối thiểu"*; tổng **500.001₫** → áp được |
| B03 | `POST /api/apply-coupon` **không yêu cầu token** — ai cũng gọi được | không kèm `Authorization` → `200` |
| B04 | **Bỏ qua được giới hạn lượt dùng**: `user_id` lấy từ body do client gửi, gửi `null` là nhánh kiểm tra bị bỏ qua hoàn toàn | `user_id=2` lần 2 → `400 đã đạt giới hạn`; đổi thành `user_id=null` → `200` |
| B05 | **Tổng tiền thanh toán là `input[type=number]` sửa được tự do** ngay trên trang Checkout | `Checkout.jsx:93-102`; sửa 0 → 500.000 thành công |
| B06 | Lượt dùng mã ghi bằng một API call **riêng sau** checkout → chặn call đó là dùng lại mã vô hạn | `Checkout.jsx:54-59` |

`EXPIRED` và mã không tồn tại xử lý **đúng** — dùng làm test case positive/negative đối chứng.

## 4. Phát hiện — FR-14 Quản lý danh mục

| ID | Phát hiện | Bằng chứng |
|---|---|---|
| C01 | **Thêm danh mục với tên rỗng được chấp nhận** | bấm "Thêm mới" khi ô trống → số dòng 3 → 4 |
| C02 | **Trùng tên được chấp nhận** — `categories.name` không `UNIQUE`, không `NOT NULL` | thêm "Laptop" → có 2 dòng "Laptop" |
| C03 | Không lọc payload XSS, không giới hạn độ dài | thêm `<img src=x onerror=alert(1)>` và tên 500 ký tự → đều vào DB |
| C04 | **Xóa không có hộp thoại xác nhận** — bấm là mất ngay | không bắt được `dialog`, số dòng 7 → 6 |
| C05 | **Xóa danh mục đang chứa sản phẩm vẫn thành công**, để lại sản phẩm mồ côi | danh mục #1 có 5 sản phẩm → `DELETE` trả `200`, sản phẩm vẫn trỏ `category_id=1` |
| C06 | **Lỗi phân quyền**: `authenticateToken` (`server.js:100-110`) **không kiểm tra role** → tài khoản user thường tạo/xóa được danh mục | token của `test@eshop.com` gọi `POST /api/categories` → `200 Category created` |
| C07 | API có `PUT /api/categories/:id` nhưng UI không có nút Sửa — chức năng tồn tại mà không truy cập được qua giao diện | `server.js:257` vs `App.jsx:294-335` |

## 5. Ảnh hưởng tới thiết kế script

1. **Giỏ hàng không lưu qua reload** — `CartContext` chỉ giữ trong state. Không được dùng `page.goto('/checkout')` sau khi thêm giỏ; phải điều hướng bằng click liên tục trong cùng một trang.
2. **Nút đăng nhập là tiếng Anh**: web dùng `Sign In`, admin dùng `Login` — dù toàn bộ UI còn lại là tiếng Việt. AI rất dễ đoán nhầm thành "Đăng nhập".
3. **Ô mật khẩu trang Login là `type="text"`** → selector `input[type=password]` **không dùng được** ở trang này (dùng được ở trang Register).
4. **Trang Checkout có 2 phần tử khớp `.bg-gray-50`** → phải dùng selector hẹp hơn (`div.p-4.bg-gray-50`), nếu không sẽ dính strict mode violation.
5. **Test làm bẩn dữ liệu** — `coupon_usage` tích lũy, danh mục rác tồn lại. Cần reset DB (`node backend/database.js`) trong `globalSetup` để chạy lặp cho ra kết quả ổn định.

## 6. Ảnh chụp

`survey/shots/` — `fr01-special-char.png` · `fr01-space-pass.png` · `fr09-save10.png` · `fr14-list.png` · `fr14-after-adds.png`
