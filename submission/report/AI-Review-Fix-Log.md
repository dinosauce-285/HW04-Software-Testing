# Nhật ký Review & Fix script do AI sinh

*(CLAUDE.md R4 / đề HW04 §6:84 - "Report what the AI got wrong or missed... and explain **why** it missed them")*

Ghi **ngay tại thời điểm sửa**. Cột "Vì sao AI trượt" không dựng lại được sau, đừng để trống rồi bổ sung cuối bài.

Phân loại lý do: `prompt` (prompt của mình chưa đủ ngữ cảnh) / `model` (giới hạn của mô hình) / `feature` (đặc thù của SUT mà không đọc code thì không thể biết).

| # | Ngày | Feature | File:dòng | AI sinh ra gì | Sai chỗ nào | Mình sửa thành | Vì sao AI trượt | Loại |
|---|---|---|---|---|---|---|---|---|
| 5 | 04/08 | FR-09 | `CheckoutPage.ts:38` | Sau khi bấm Sign In, chờ `expect(getByRole('link', { name: 'Giỏ hàng' })).toBeVisible()` để xác nhận đã đăng nhập | **Assertion không kiểm chứng được gì.** `App.jsx:23` hiển thị link "Giỏ hàng" ở **cả hai** trạng thái đăng nhập và chưa đăng nhập. Khi login hỏng, hàm vẫn trả về bình thường, lỗi mới nổ ở tận trang Cart dưới dạng *"element(s) not found"* cho tiêu đề "Xác Nhận Đơn Hàng" - thông báo lỗi trỏ sai chỗ hoàn toàn, mất nhiều thời gian truy ngược | Chờ nút **"Thoát"** - chỉ dấu chỉ tồn tại khi đã đăng nhập (`App.jsx:28`) | Chọn chỉ dấu theo cảm tính "trang có giỏ hàng nghĩa là đã vào được", không đối chiếu điều kiện hiển thị trong mã nguồn. Phải đọc nhánh `{user ? ... : ...}` mới biết | `feature` |
| 4 | 04/08 | FR-09 | `apply-coupon-ui.spec.ts` / `apply-coupon-api.spec.ts` | Mọi test dùng chung tài khoản seed `test@eshop.com` | **Test phụ thuộc thứ tự chạy.** Giới hạn `max_uses_per_user` lưu tích lũy trong bảng `coupon_usage`. File API chạy trước (thứ tự alphabet) tiêu hết lượt dùng của `SAVE10` và `VIP100`, khiến TC02, TC03, TC10 ở file UI fail với *"đã đạt giới hạn"* - **fail sai lý do**, che mất bug B01 thật sự nằm phía sau | Thêm `tests/fixtures/account.ts`: mỗi test tự tạo tài khoản mới qua API rồi đăng nhập bằng tài khoản đó | Mặc định ngầm rằng test độc lập nhau. Không thể suy ra nếu không biết `coupon_usage` là bảng tích lũy và không bị `globalSetup` xoá giữa các test | `feature` |
| 3 | 04/08 | FR-01 | `register-validation.spec.ts:44` / `register-account.spec.ts:83` | Kiểm "dữ liệu không hợp lệ thì phải ở lại trang đăng ký" bằng `await expect(page).toHaveURL(/\/register$/)` | **Race condition -> negative test luôn pass giả.** `toHaveURL` pass ngay ở lần poll đầu tiên, mà lần đó luôn diễn ra **trước khi** `navigate('/login')` của React kịp chạy. Nên assertion đúng cả khi đăng ký đã thành công. Che mất 3 bug: TC08 (mật khẩu có dấu cách được chấp nhận), TC09 và TC10 (email sai định dạng được chấp nhận) | Chờ trạng thái ổn định trước: `const registered = await reg.isRegistered()` (chờ điều hướng tối đa 3s, trả `boolean`), rồi `expect(registered).toBe(false)`. Chỉ assert URL **sau khi** đã chắc chắn không có điều hướng | Đúng loại "flaky waits" mà đề §6:84 nêu tên. Nguy hiểm vì test **xanh** - không có tín hiệu nào báo sai. Chỉ lộ ra khi TC16 tình cờ fail ở assertion kế tiếp và mình lần ngược lại | `model` |
| 2 | 04/08 | *(hạ tầng)* | lệnh chạy suite | Chạy bằng `npx playwright test --project=chromium --reporter=line` - config đã khai báo `reporter: [['list'], ['html', {...}]]` | **Cờ `--reporter` ở dòng lệnh đè toàn bộ danh sách reporter trong config** -> 3 lượt chạy đầu báo "4 passed" bình thường nhưng **không sinh HTML report nào**. Nếu không kiểm `ls reports/` thì đến lúc đóng gói mới phát hiện mất sạch bằng chứng của §6:83 | Bỏ cờ `--reporter`, để config tự quyết định | Lệnh chạy trông hợp lý và không hề báo lỗi - thất bại hoàn toàn im lặng. Đây là tương tác giữa CLI và config, không phải kiến thức về SUT | `model` |
| 1 | 04/08 | FR-14 | `add-category.spec.ts:52` | `await expect(admin.rowsNamed(name.trim())).toHaveCount(1)` để kiểm tra hệ thống có cắt khoảng trắng thừa ở tên danh mục hay không | **Assertion yếu - pass sai lý do.** `getByRole('cell', { name })` so khớp theo *accessible name*, mà chuẩn này **chuẩn hóa khoảng trắng**. Tên lưu trong DB là `'  Sách và Văn phòng phẩm  '` (còn nguyên khoảng trắng) nhưng assertion vẫn pass -> che mất defect | So trên text nguyên văn: thêm `AdminCategoryPage.rawNames()` dùng `allTextContents()` không trim, rồi `expect(await admin.rawNames()).toContain(expected)` | Assertion "trông đúng" và **pass** nên không có tín hiệu nào báo sai. Phải biết trước cơ chế accessible name của Playwright mới nghi ngờ được. Đây là loại lỗi nguy hiểm nhất: test xanh nhưng không kiểm gì cả | `model` |

---

## Đã ghi nhận từ giai đoạn khảo sát (04/08/2026)

Bốn lỗi dưới đây do **chính mình** mắc khi viết `survey/survey.spec.ts` bằng cách suy đoán từ tên UI - đúng loại lỗi mà AI sẽ mắc khi sinh script. Giữ lại làm ví dụ đối chứng.

| # | Suy đoán | Thực tế | Loại |
|---|---|---|---|
| S1 | Nút đăng nhập là `Đăng nhập` (UI toàn tiếng Việt) | Web dùng `Sign In`, admin dùng `Login` | `feature` |
| S2 | Ô mật khẩu trang Login khớp `input[type=password]` | Trang Login để `type="text"` - chính là một bug | `feature` |
| S3 | `.bg-gray-50` trỏ duy nhất tới khối mã giảm giá | Khớp 2 phần tử -> strict mode violation | `feature` |
| S4 | Thêm giỏ xong `page.goto('/checkout')` là giữ được giỏ | `CartContext` chỉ nằm trong state, reload là mất | `feature` |

**Bài học đưa vào prompt sau này:** phải cung cấp cho AI đoạn mã JSX thật của màn hình, không chỉ mô tả chức năng. Cả 4 lỗi đều thuộc loại `feature` - không đọc source thì không mô hình ngôn ngữ nào đoán đúng được.
