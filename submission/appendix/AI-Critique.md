# AI Critique

*(Bắt buộc / đề HW04 mục 10 - 200-300 chữ)*

**Sinh viên:** Lý Quốc Thạnh - `23127262`

---

Trong bài này AI sinh gần như toàn bộ script, nhưng năm lỗi tôi phải sửa cho thấy một thiên lệch rõ: AI tối ưu cho việc **script chạy được**, không phải cho việc **script kiểm đúng thứ cần kiểm**. Bốn trong năm lỗi đều khiến test xanh mà không kiểm chứng gì. Nó dùng `getByRole('cell')` để kiểm việc cắt khoảng trắng, trong khi chuẩn accessible name tự chuẩn hoá khoảng trắng nên assertion luôn đúng. Nó dùng `toHaveURL('/register')` để kiểm "phải ở lại trang", mà matcher này pass ngay lần poll đầu, trước khi trang kịp điều hướng - che mất ba bug. Nó chờ link "Giỏ hàng" để xác nhận đã đăng nhập, trong khi link đó hiển thị ở cả hai trạng thái.

AI không tự phát hiện được vì hai lý do. Nhóm thứ nhất thuộc đặc thù hệ thống: không mô hình nào đoán được bảng `coupon_usage` tích lũy qua các test, hay điều kiện hiển thị của một thẻ trong mã JSX nó chưa từng đọc. Nhóm thứ hai thuộc cơ chế ngầm của công cụ: cờ dòng lệnh đè cấu hình file, matcher polling, chuẩn accessible name. Cả hai nhóm đều không sinh tín hiệu phản hồi - test pass thì không có gì báo lỗi.

Nguyên tắc tôi rút ra: với bộ test do AI sinh, **kết quả pass mới là thứ đáng nghi ngờ**, vì fail luôn tự báo còn pass thì im lặng. Cách kiểm hiệu quả nhất là hỏi ngược từng test đang xanh: nó có còn pass không nếu hệ thống hỏng? Chính câu hỏi đó đã lôi ra hai lỗi nặng nhất. Chia nhỏ prompt theo từng bước là điều kiện cần, nhưng chưa đủ để thay cho việc con người tự đọc lại từng assertion.
