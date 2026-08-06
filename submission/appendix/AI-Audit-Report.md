**Khoa Công nghệ Thông tin (FIT) - Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 - Kiểm chứng Phần mềm (AI-augmented / 2026)**

**CHÍNH SÁCH AI / BIỂU MẪU - 2026 v1.0**

# AI Audit Report - Mẫu 5 mục cho mỗi Artifact

*Phụ lục bắt buộc đính kèm cho mọi bài tập có dùng AI (HW#01-HW#06, Seminar).*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) - Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

---

## 1. Thông tin Sinh viên

| Mục | Giá trị |
| :---- | :---- |
| **Họ tên sinh viên (in hoa):** | LÝ QUỐC THẠNH |
| **MSSV:** | 23127262 |
| **Lớp / Khoá:** | `<điền>` |
| **Mã bài tập (ví dụ HW#00, HW#02):** | HW#04 - AI Automation Testing |
| **Ngày làm bài:** | 04/08/2026 |
| **Công cụ AI đã dùng:** | Claude Code (Anthropic), mô hình `claude-opus-5` |
| **Có dùng AI hay không:** | [x] Có   [ ] Không |

## 2. Hướng dẫn (đọc trước khi điền)

* Thêm 1 hàng cho mỗi artifact AI sinh (test case, script, checklist, OpenAPI spec, JMeter plan...).
* Dán nguyên văn prompt - KHÔNG paraphrase.
* Dán nguyên văn output AI (hoặc kèm screenshot có chú thích trong báo cáo).
* Gắn nhãn: VALID / INVALID / INCOMPLETE.
* Lý do phải dẫn chiếu slide, mục ISTQB, hoặc RFC kỹ thuật.
* Hiển thị bản sửa với phần thay đổi được tô sáng.
* Hàng mẫu in nghiêng - thay trước khi nộp.

## 3. Bảng Audit - 1 hàng / artifact

**Prompt nguyên văn và output nguyên văn của cả 95 lượt trao đổi nằm ở [`AI-Prompt-Log.md`](AI-Prompt-Log.md).** Cột (1) dưới đây trích prompt của lượt đã sinh ra artifact tương ứng và ghi số lượt để tra ngược; cột (2) tóm tắt output vì output đầy đủ dài hơn giới hạn một ô bảng.

Cột (4) dẫn ISTQB Foundation Level v4.0 theo **tên khái niệm**, kèm số chương ở chỗ đại cương đánh số.

| (1) Prompt + Công cụ | (2) Output AI | (3) Verdict | (4) Lý do (ISTQB) | (5) Bản SV sửa |
| :---- | :---- | :---- | :---- | :---- |
| **Artifact #1 - `playwright.config.ts`**<br>Tool: Claude Code<br>10:29 04/08/2026<br>Lượt 10: *"trình bày lại yêu cầu đề"* -> dựng config 3 project | Config 3 browser, `metadata` mang `Run by: 23127262` + ISO timestamp, `outputFolder` tách theo feature/browser, `retries: 0` | VALID | Đáp ứng yêu cầu truy vết kết quả chạy - *test progress report* phải gắn được với lần chạy cụ thể (ISTQB FL mục 5.3) | Dùng nguyên |
| **Artifact #2 - `tests/pages/AdminCategoryPage.ts`**<br>Tool: Claude Code<br>10:47 04/08/2026<br>Lượt 13: *"chạy xong rồi bắt đầu đi"* | Page object gom selector màn hình Danh mục, dựng từ mã JSX thật của SUT | VALID | Tách selector khỏi test là *test design* tốt, giảm chi phí bảo trì khi giao diện đổi | Dùng nguyên |
| **Artifact #3 - `data/fr14-add-category.csv`, `data/fr14-delete-category.csv`** <br>Tool: Claude Code<br>10:47 04/08/2026<br>Lượt 13 | 2 file CSV, mỗi dòng một test case, cột `tc_id / loai / mo_ta / input / expect` | VALID | Dữ liệu chia theo *Equivalence Partitioning* (mục 4.2.1) và *Boundary Value Analysis* (mục 4.2.2) - hợp lệ / không hợp lệ / biên | Dùng nguyên |
| **Artifact #4 - `tests/fr14-category/add-category.spec.ts`**<br>Tool: Claude Code<br>10:47 04/08/2026<br>Lượt 13 | Assertion kiểm hệ thống có cắt khoảng trắng thừa: `expect(admin.rowsNamed(name.trim())).toHaveCount(1)` | INCOMPLETE | `getByRole('cell')` so khớp theo accessible name, mà chuẩn này **tự chuẩn hoá khoảng trắng** -> assertion luôn đúng, che mất defect. Vi phạm nguyên tắc *absence-of-errors fallacy* (mục 1.3): test xanh không đồng nghĩa hệ thống đúng | Thêm `AdminCategoryPage.rawNames()` dùng `allTextContents()` không trim, so trên **text nguyên văn**: `expect(await admin.rawNames()).toContain(expected)` |
| **Artifact #5 - lệnh chạy bộ test**<br>Tool: Claude Code<br>10:47 04/08/2026<br>Lượt 13 | `npx playwright test --project=chromium --reporter=line` | INVALID | Cờ `--reporter` đè **toàn bộ** danh sách reporter trong config -> 3 lượt chạy đầu báo "4 passed" nhưng **không sinh HTML report nào**. Mất *test progress report* mà không có tín hiệu lỗi (mục 5.3) | Bỏ cờ `--reporter`, để config tự quyết định: `FEATURE=... BROWSER=... npx playwright test --project=...` |
| **Artifact #6 - `tests/pages/RegisterPage.ts`**<br>Tool: Claude Code<br>11:07 04/08/2026<br>Lượt 14: *"check list task 1"* -> sang FR-01 | Page object màn hình đăng ký + hàm `isRegistered()` | VALID | Như Artifact #2 | Dùng nguyên |
| **Artifact #7 - `data/fr01-password.csv`, `fr01-email.csv`, `fr01-account-api.csv`**<br>Tool: Claude Code<br>11:07 04/08/2026<br>Lượt 14 | 3 file CSV tách theo nhóm quy tắc: mật khẩu, định dạng email, tài khoản qua API | VALID | *Equivalence Partitioning* (mục 4.2.1) - mỗi file một phân vùng quy tắc, tránh trộn nhiều tiêu chí trong một bảng | Dùng nguyên |
| **Artifact #8 - `tests/fr01-register/register-validation.spec.ts`, `register-account.spec.ts`**<br>Tool: Claude Code<br>11:07 04/08/2026<br>Lượt 14 | Kiểm "dữ liệu sai thì phải ở lại trang đăng ký" bằng `await expect(page).toHaveURL(/\/register$/)` | INCOMPLETE | Race condition: `toHaveURL` pass ngay lần poll đầu, **trước khi** React kịp `navigate('/login')` -> negative test pass giả, che 3 defect. Đây là *false-pass result*; đúng loại "flaky waits" mà đề mục 6:84 nêu đích danh | Chờ trạng thái ổn định trước: `const registered = await reg.isRegistered()` (chờ điều hướng tối đa 3s), rồi `expect(registered).toBe(false)`; chỉ assert URL **sau khi** chắc chắn không có điều hướng |
| **Artifact #9 - `tests/pages/CheckoutPage.ts`**<br>Tool: Claude Code<br>11:24 04/08/2026<br>Lượt 16: *"tiếp tục"* -> sang FR-09 | Sau khi bấm Sign In, chờ `expect(getByRole('link', {name: 'Giỏ hàng'})).toBeVisible()` để xác nhận đã đăng nhập | INCOMPLETE | Chọn sai *test oracle*: `App.jsx:23` hiển thị link "Giỏ hàng" ở **cả hai** trạng thái đăng nhập và chưa đăng nhập -> khi login hỏng, hàm vẫn trả về bình thường và lỗi nổ ở nơi khác, thông báo trỏ sai chỗ | Chờ nút **"Thoát"** - chỉ dấu chỉ tồn tại khi đã đăng nhập (`App.jsx:28`) |
| **Artifact #10 - `data/fr09-coupon-ui.csv`, `fr09-coupon-api.csv`**<br>Tool: Claude Code<br>11:24 04/08/2026<br>Lượt 16 | 2 file CSV: nhóm áp mã trên giao diện, nhóm gọi thẳng API | VALID | Tách theo tầng kiểm thử; dữ liệu phủ *Boundary Value Analysis* ở `min_order_amount` (mục 4.2.2) | Dùng nguyên |
| **Artifact #11 - `tests/fr09-coupon/apply-coupon-ui.spec.ts`, `apply-coupon-api.spec.ts`**<br>Tool: Claude Code<br>11:24 04/08/2026<br>Lượt 16 | Mọi test dùng chung tài khoản seed `test@eshop.com` | INCOMPLETE | Test **phụ thuộc thứ tự chạy**: bảng `coupon_usage` tích lũy, file API chạy trước tiêu hết lượt dùng mã -> TC02/TC03/TC10 fail **sai lý do**, che defect thật phía sau. Vi phạm yêu cầu *test independence* trong quản lý dữ liệu kiểm thử (mục 5.1) | Thêm `tests/fixtures/account.ts`: mỗi test tự tạo tài khoản mới qua API rồi đăng nhập bằng tài khoản đó |
| **Artifact #12 - `tests/fixtures/csv.ts`**<br>Tool: Claude Code<br>10:47 04/08/2026<br>Lượt 13 | Hàm `readCsv()` + `expand()` giãn placeholder `__LONG_500__`, `__UNIQUE__` | VALID | Cho phép biểu diễn dữ liệu biên mà CSV không chứa trực tiếp được - phục vụ *Boundary Value Analysis* (mục 4.2.2) | Dùng nguyên |
| **Artifact #13 - `tests/fixtures/global-setup.ts`**<br>Tool: Claude Code<br>10:47 04/08/2026<br>Lượt 13 | Chạy `node sut/backend/database.js` reset SQLite về trạng thái seed trước mỗi lượt | VALID | Bảo đảm *repeatability*: 9 lượt chạy xuất phát từ cùng một điểm dữ liệu | Dùng nguyên |

## 4. Tổng kết Độ chính xác AI

| Chỉ số | Số lượng | Tỉ lệ |
| :---- | :---- | :---- |
| **Tổng artifact AI sinh đã audit** | 13 | 100% |
| **VALID (đúng, dùng nguyên)** | 8 | 61,5% |
| **INVALID (sai; loại bỏ)** | 1 | 7,7% |
| **INCOMPLETE (chấp nhận sau khi sửa)** | 4 | 30,8% |

Bốn artifact INCOMPLETE và một artifact INVALID được ghi chi tiết kèm nguyên nhân trong [`../report/AI-Review-Fix-Log.md`](../report/AI-Review-Fix-Log.md).

## 5. Kết luận - Khi nào nên / không nên dùng AI?

AI mạnh ở phần có cấu trúc rõ: dựng page object từ mã JSX thật, tách dữ liệu ra CSV, sinh khung spec chạy vòng qua dữ liệu. Tám trên mười ba artifact thuộc nhóm này, dùng gần như nguyên vẹn.

AI yếu ở phần phải phán đoán điều gì đáng kiểm. Bốn artifact INCOMPLETE đều là assertion pass mà không kiểm chứng gì; artifact INVALID là lệnh chạy làm mất sạch bằng chứng trong khi terminal vẫn báo thành công. Điểm chung: không sinh tín hiệu lỗi nào.

Khuyến nghị: dùng AI cho phần khung và dữ liệu, nhưng mọi assertion phải tự đọc lại và tự hỏi "test này còn pass không nếu hệ thống hỏng". Với bộ test do AI sinh, kết quả pass mới là thứ đáng nghi ngờ - fail luôn tự báo, còn pass thì im lặng.

## 6. Mandatory Disclosure (dán nguyên văn)

*"Script automation, file dữ liệu CSV và bản nháp đầu của báo cáo này được sinh phiên bản đầu bởi Claude Code (Anthropic, mô hình claude-opus-5); tôi đã rà soát và chỉnh sửa phần assertion của cả ba feature cùng lệnh chạy bộ test, bổ sung edge case khoảng trắng đầu-cuối tên danh mục, mã giảm giá viết chữ thường và ranh giới mức đơn tối thiểu; phần khảo sát hành vi thật của hệ thống, phân loại nguyên nhân từng lỗi AI mắc phải và toàn bộ quyết định nhận hay loại từng artifact do tôi tự viết. AI Audit Report chi tiết đính kèm ở Phụ lục A. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm."*

## Chữ ký

| Họ tên sinh viên (in hoa): | LÝ QUỐC THẠNH |
| :---- | :---- |
| **MSSV:** | 23127262 |
| **Lớp / Khoá:** | `<điền>` |
| **Môn học:** | CS423 / CSC13003 - Kiểm chứng Phần mềm |
| **Giảng viên:** | `<điền>` |
| **Ngày:** | 04/08/2026 |
| **Chữ ký:** |  |

## Tham khảo

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
* ISTQB Foundation Level Syllabus (latest version).
* Hardman, P. (2025). A Post-AI Learning Taxonomy.
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.
* Anthropic (2025). Building reliable AI test agents - engineering blog.
* DeepEval & Promptfoo documentation - testing frameworks for LLM systems.

---

## Phụ lục A - Nhật ký prompt nguyên văn

Đề HW04 mục 9:114-117 đòi mỗi lượt tương tác phải có tên công cụ, ngày giờ, prompt nguyên văn và output của AI. Mẫu 5 mục ở trên tổ chức theo **artifact**, không theo **lượt**, nên phần nhật ký được tách sang file riêng:

**[`AI-Prompt-Log.md`](AI-Prompt-Log.md)** - 95 lượt, sinh tự động từ transcript phiên làm việc bằng `tools/extract-ai-audit.mjs`, không chép tay.
