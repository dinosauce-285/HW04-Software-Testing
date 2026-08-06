# Báo cáo chính - HW04 Automation Testing

**Sinh viên:** Lý Quốc Thạnh - `23127262`
**Môn:** Kiểm thử phần mềm 2026 / **Bài:** HW04 - Automation Testing
**SUT:** EShop (https://github.com/ttbhanh/eshop-sut) / **Framework:** Playwright + Playwright HTML reporter
**Repo bài làm:** https://github.com/dinosauce-285/HW04-Software-Testing
**Ngày thực hiện:** 04/08/2026

---

## 1. Feature đã chọn

Ba feature kế thừa từ HW02, mỗi pool một feature theo yêu cầu mục 5 của đề. Feature Pool D (FR-07 Giỏ hàng Mobile) không dùng vì HW04 chỉ automate web frontend.

| Pool | FR | Tên | Màn hình | Vì sao đủ độ khó |
|---|---|---|---|---|
| A | FR-01 | Đăng ký tài khoản | Web `/register` | Form nhiều trường, quy tắc mật khẩu phức tạp, validate hai tầng (client và server) |
| B | FR-09 | Mã giảm giá | Web `/checkout` | Có tính toán số học, điều kiện biên, giới hạn lượt dùng theo người dùng, phụ thuộc trạng thái đăng nhập và giỏ hàng |
| C | FR-14 | Quản lý danh mục | Admin, tab *Danh mục* | CRUD có phân quyền và ràng buộc toàn vẹn dữ liệu với bảng sản phẩm |

### Sai lệch giữa đề bài và hệ thống thực tế

Đề gọi FR-14 là *"Category management (CRUD)"* (mục 4:59) nhưng giao diện Web Admin **chỉ có Thêm và Xóa, không có Sửa**. Backend vẫn có endpoint `PUT /api/categories/:id` (`server.js:257`) nhưng không màn hình nào gọi tới. Vì vậy bộ test của FR-14 không có nhóm Update; số lượng test case được bù bằng các trường hợp validate, phân quyền và ràng buộc dữ liệu - vẫn đạt 15 test case, vượt ngưỡng 12 của đề.

---

## 2. Môi trường và cách chạy lại

### Khởi động SUT

```bash
cd sut/backend        && npm install && node database.js && node server.js   # API   :3000
cd sut/frontend-web   && npm install && npm run dev                          # Web   :5173
cd sut/frontend-admin && npm install && npm run dev                          # Admin :5174
```

**Tài khoản:** admin `admin@eshop.com` / `Admin123!` / user `test@eshop.com` / `Test1234!`

> `sut/setup_guide.md` ghi mật khẩu admin là `admin123` - **sai**, đăng nhập trả 401. Giá trị đúng nằm trong `sut/backend/database.js:92`.

### Chạy bộ test

Mỗi lượt chạy là **một feature trên một browser**, xuất ra một thư mục report riêng:

```bash
for f in fr01-register fr09-coupon fr14-category; do
  for b in chromium firefox webkit; do
    FEATURE=$f BROWSER=$b npx playwright test --project=$b
  done
done
```

Tổng cộng **9 lượt chạy -> 9 HTML report** trong `submission/html-reports/<feature>-<browser>-<ISO timestamp>/`.

> **Lưu ý quan trọng:** không được thêm cờ `--reporter` vào dòng lệnh - cờ này đè toàn bộ danh sách reporter khai báo trong `playwright.config.ts`, khiến lượt chạy **không sinh report nào** mà terminal vẫn báo thành công. Xem mục 7, lỗi #2.

Mỗi report mang nhãn `Run by: 23127262` kèm ISO timestamp ở tiêu đề và trong tab Metadata, nhúng qua trường `metadata` và `title` của config - **không sửa tay file HTML**.

`globalSetup` chạy `node sut/backend/database.js` trước mỗi lượt để đưa dữ liệu về trạng thái seed, đảm bảo 9 lượt chạy xuất phát từ cùng một điểm.

---

## 3. Quy trình dùng AI theo từng bước

Đề yêu cầu *"drive an AI tool - step by step, not with a single generic prompt"* (mục 6:81). Với **mỗi** feature, quy trình được chia thành 6 bước riêng biệt, mỗi bước là một lượt trao đổi độc lập với AI:

| Bước | Nội dung | Sản phẩm |
|---|---|---|
| 1 | Từ đặc tả và hành vi quan sát được -> liệt kê test case theo kỹ thuật phân vùng tương đương và giá trị biên | Danh sách test case |
| 2 | Từ test case -> rút ra bộ dữ liệu, tách thành cột | `data/*.csv` |
| 3 | Từ **mã nguồn JSX thật** của màn hình -> dựng page object, gom selector | `tests/pages/*.ts` |
| 4 | Dựng khung spec chạy vòng qua dữ liệu CSV | `*.spec.ts` |
| 5 | Thêm assertion cho từng nhóm test case | Assertion |
| 6 | Chạy, đọc kết quả, phân loại fail, sửa script | Bộ test ổn định |

Toàn bộ prompt và output của các bước này được ghi trong `../appendix/AI-Audit-Report.md`.

### Bước khảo sát trước khi sinh script

Trước bước 1, hệ thống được khảo sát trực tiếp bằng một script Playwright riêng (`survey/survey.spec.ts`), kết quả ghi ở `survey/Survey-Report.md`. Việc này xuất phát từ một nhận định: AI không thể biết hành vi thật của hệ thống mà nó chưa từng thấy mã nguồn.

Nhận định đó được kiểm chứng ngay trong lần khảo sát đầu tiên - 4 selector suy đoán từ tên chức năng đều sai:

| Suy đoán | Thực tế |
|---|---|
| Nút đăng nhập nhãn `Đăng nhập` | Web dùng `Sign In`, Admin dùng `Login` |
| Ô mật khẩu trang Login khớp `input[type=password]` | Trang Login khai `type="text"` |
| `.bg-gray-50` trỏ duy nhất tới khối mã giảm giá | Khớp 2 phần tử -> strict mode violation |
| Thêm giỏ xong `page.goto('/checkout')` giữ được giỏ | `CartContext` chỉ nằm trong bộ nhớ, reload là mất |

Vì vậy **bước 3 luôn cung cấp mã JSX thật cho AI**, không mô tả chức năng bằng lời.

### Nguyên tắc viết assertion

Assertion viết theo **đặc tả đúng**, không theo hành vi hiện tại của SUT. Ví dụ: đơn 500.000  VND áp mã giảm 10% thì test kỳ vọng 450.000  VND, dù hệ thống đang trả 5.000.000  VND. Test sẽ fail, và **chính cái fail đó là bằng chứng bug** - đúng tinh thần mục 6:85: *"wherever a failing assertion reveals a genuine defect, a bug report"*.

Hệ quả: mỗi test fail phải được phân loại rõ là **fail do bug thật** hay **fail do script sai**. Không được lặng lẽ sửa assertion cho pass.

---

## 4. FR-01 - Đăng ký tài khoản

### 4.1 Test case - 16

| Nhóm | Test case |
|---|---|
| Quy tắc mật khẩu (8) | TC01 đủ hoa-thường-số-ký tự đặc biệt / TC02 đúng 8 ký tự (biên dưới) / TC03 7 ký tự (dưới biên) / TC04 thiếu chữ hoa / TC05 thiếu chữ thường / TC06 thiếu số / TC07 thiếu ký tự đặc biệt / TC08 dùng dấu cách thay ký tự đặc biệt |
| Email và trường bắt buộc (4) | TC09 email thiếu `@` / TC10 email thiếu tên miền / TC11 bỏ trống họ tên / TC12 bỏ trống email |
| Trùng lặp và bảo mật (4) | TC13 đăng ký trùng email / TC14 API không validate / TC15 mật khẩu plaintext / TC16 trùng email qua giao diện |

Phân bố: 3 positive / 8 negative / 5 edge.

### 4.2 Dữ liệu - 3 file CSV

`data/fr01-password.csv` / `data/fr01-email.csv` / `data/fr01-account-api.csv`

Cột `expect_accepted` và `expect_status` mã hóa kỳ vọng; cột `ref_bug` liên kết tới mã bug. Placeholder `__UNIQUE__` được giãn thành email duy nhất theo timestamp tại thời điểm chạy - nếu để email cố định trong CSV thì lần chạy thứ hai sẽ đụng dữ liệu của lần chạy trước.

### 4.3 Chuẩn dùng để viết assertion

Đặc tả được lấy từ **chính dòng gợi ý hiển thị dưới ô mật khẩu** của SUT:

> *"Yêu cầu: Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt."*

Test còn kiểm luôn sự tồn tại của dòng gợi ý này (`expect(passwordHint).toContainText('ký tự đặc biệt')`), để nếu SUT sửa đặc tả thì bộ test cũng biết.

### 4.4 Assertion pattern - 5 loại

`toHaveURL` (điều hướng) / `toContainText` (nội dung) / `toBeVisible` / `not.toBeVisible` (hiển thị) / `res.status()` (mã HTTP) / `not.toHaveProperty` (cấu trúc dữ liệu response)

### 4.5 Kết quả trên 3 browser

| | chromium | firefox | webkit |
|---|---|---|---|
| Passed | 7 | 7 | 7 |
| Failed | 9 | 9 | 9 |

Kết quả **giống hệt nhau** trên cả 3 browser -> toàn bộ lỗi nằm ở logic ứng dụng, không có lỗi tương thích trình duyệt.

9 test fail tương ứng 5 bug: **A01** (regex mật khẩu mâu thuẫn - TC01, TC02, TC08), **A02** (email không validate - TC09, TC10), **A04** (trùng email - TC13, TC16), **A03** (API không validate - TC14), **A06** (mật khẩu plaintext - TC15).

---

## 5. FR-09 - Mã giảm giá

### 5.1 Test case - 19

| Nhóm | Test case |
|---|---|
| Áp mã trên giao diện (13) | TC01 mã cố định 50k / TC02 mã cố định 100k / TC03 mã 10% cho đơn 500k / TC04 mã 10% tại đúng mức tối thiểu / TC05 đơn đúng mức tối thiểu 500k / TC06 dưới mức tối thiểu 1 đồng / TC07 mã hết hạn / TC08 mã không tồn tại / TC09 mã chỉ có khoảng trắng / TC10 mã nhập chữ thường / TC11 mã có khoảng trắng thừa / TC12 và TC12b đổi tổng tiền sau khi áp mã |
| Phân quyền và giới hạn (6) | TC13 áp mã không cần đăng nhập / TC14 dùng quá số lần / TC15 né giới hạn bằng `user_id=null` / TC16 mã 2 lượt dùng lần thứ ba / TC17 tổng tiền do client gửi / TC18 tổng tiền âm |

Phân bố: 3 positive / 8 negative / 8 edge.

### 5.2 Dữ liệu - 2 file CSV

`data/fr09-coupon-ui.csv` chứa bộ **mã x tổng tiền x kết quả mong đợi** (`expect_discount` và `expect_final` tính sẵn theo công thức đúng). `data/fr09-coupon-api.csv` chứa các trường hợp tầng API.

Dữ liệu mã giảm giá lấy từ seed `sut/backend/database.js:106-111`:

| Mã | Loại | Giá trị | Đơn tối thiểu | Lượt/người | Hạn |
|---|---|---|---|---|---|
| `SAVE10` | percent | 10% | 300.000  VND | 1 | 2099 |
| `BIGBUY` | fixed | 50.000  VND | 500.000  VND | 1 | 2099 |
| `VIP100` | fixed | 100.000  VND | 300.000  VND | 2 | 2099 |
| `EXPIRED` | percent | 20% | 100.000  VND | 1 | **2020** |

### 5.3 Assertion pattern - 5 loại

Giá trị số học (`toBe` trên số tiền giảm và thành tiền) / nội dung text / trạng thái (`toBeDisabled`, cờ áp mã) / mã HTTP / bất biến nghiệp vụ (`toBeGreaterThanOrEqual` - thành tiền không được âm)

### 5.4 Kết quả trên 3 browser

| | chromium | firefox | webkit |
|---|---|---|---|
| Passed | 12 | 12 | 12 |
| Failed | 7 | 7 | 7 |

7 test fail tương ứng 5 bug: **B01** (công thức phần trăm sai - TC03, TC10), **B02** (lỗi biên - TC04, TC05), **B03** (endpoint công khai - TC13), **B04** (né giới hạn lượt dùng - TC15), **B05** (tổng tiền client tự đặt - TC17).

B01 là lỗi nghiêm trọng nhất trong toàn bộ bài: đơn hàng 500.000  VND áp mã "giảm 10%" ra **5.000.000  VND**.

---

## 6. FR-14 - Quản lý danh mục

### 6.1 Test case - 15

| Nhóm | Test case |
|---|---|
| Thêm danh mục (10) | TC01 tên hợp lệ / TC02 tên tiếng Việt có dấu và ký tự `&` / TC03 tên rỗng / TC04 chỉ khoảng trắng / TC05 trùng tên / TC06 500 ký tự / TC07 payload XSS / TC08 khoảng trắng thừa hai đầu / TC09 và TC09b payload SQL injection |
| Xóa và phân quyền (5) | TC10 xóa danh mục vừa tạo / TC11 xóa danh mục đang có sản phẩm / TC12 hộp thoại xác nhận / TC13 xóa ID không tồn tại / TC14 user thường tạo danh mục |

Phân bố: 4 positive / 3 negative / 8 edge.

### 6.2 Dữ liệu - 2 file CSV

`data/fr14-add-category.csv` / `data/fr14-delete-category.csv`. Placeholder `__LONG_500__` được giãn thành chuỗi 500 ký tự vì CSV không biểu diễn trực tiếp được.

### 6.3 Assertion pattern - 5 loại

`toHaveCount` (đếm dòng bảng) / nội dung text nguyên văn / `toHaveValue` / `toBeVisible` (trạng thái control) / mã HTTP / hộp thoại trình duyệt (`page.on('dialog')`)

### 6.4 Kết quả trên 3 browser

| | chromium | firefox | webkit |
|---|---|---|---|
| Passed | 4 | 4 | 4 |
| Failed | 11 | 11 | 11 |

11 test fail tương ứng 8 bug: **C01** (tên rỗng), **C02** (trùng tên), **C03** (XSS, độ dài, SQLi), **C08** (không trim), **C05** (xóa danh mục có sản phẩm), **C04** (không xác nhận xóa), **C09** (xóa ID không tồn tại trả 200), **C06** (user thường tạo được danh mục).

Tỉ lệ fail của FR-14 cao nhất trong ba feature (11/15) vì màn hình này gần như không có bước kiểm tra dữ liệu nào ở cả hai tầng.

---

## 7. Review script AI sinh - AI sai gì và vì sao

Đây là phần trả lời trực tiếp yêu cầu mục 6:84. Chi tiết đầy đủ ở `AI-Review-Fix-Log.md`; dưới đây là tổng hợp và phân tích.

### 7.1 Năm lỗi đã phát hiện và sửa

| # | Lỗi | Loại theo đề | Hậu quả |
|---|---|---|---|
| 1 | Kiểm việc cắt khoảng trắng bằng `getByRole('cell', { name })` | Assertion yếu | Test **pass** dù hệ thống không trim - chuẩn accessible name tự chuẩn hóa khoảng trắng |
| 2 | Chạy suite kèm cờ `--reporter=line` | Lỗi cấu hình | 3 lượt chạy **không sinh report nào** mà terminal vẫn báo thành công |
| 3 | Kiểm "phải ở lại trang" bằng `expect(page).toHaveURL()` | Flaky wait | Toàn bộ nhóm negative **pass giả**; che mất 3 bug |
| 4 | Mọi test dùng chung tài khoản seed | Phụ thuộc thứ tự | 3 test fail **sai lý do** (*"đã đạt giới hạn"*), che mất bug B01 |
| 5 | Chờ link "Giỏ hàng" để xác nhận đã đăng nhập | Assertion yếu | Link hiển thị ở **cả hai** trạng thái; login hỏng thì lỗi nổ ở tận trang khác |

Ba trong bốn loại lỗi mà đề nêu tên đều xuất hiện: **assertion yếu** (#1, #5), **flaky wait** (#3), **selector giòn** (4 lỗi ở mục 3). Loại còn lại - thiếu edge case - không xảy ra vì bước 1 của quy trình liệt kê test case trước khi sinh mã.

### 7.2 Vì sao AI không tự phát hiện

Phân theo ba nhóm nguyên nhân mà đề nêu:

**Đặc thù của hệ thống (lỗi #4, #5 và 4 lỗi selector).** Đây là nhóm đông nhất. Không mô hình nào đoán được rằng `App.jsx:23` hiển thị link "Giỏ hàng" ở cả hai trạng thái đăng nhập, hay bảng `coupon_usage` tích lũy dữ liệu qua các test. Những thông tin này chỉ tồn tại trong mã nguồn và lược đồ cơ sở dữ liệu. **Khắc phục:** đọc mã nguồn trước, đưa mã thật vào prompt thay vì mô tả bằng lời.

**Giới hạn của mô hình (lỗi #1, #2, #3).** Cả ba đều là tương tác ngầm giữa các tầng công cụ: chuẩn accessible name tự chuẩn hóa khoảng trắng, cờ CLI đè cấu hình file, matcher polling pass ngay lần thử đầu tiên. Đây là kiến thức về cơ chế bên trong Playwright, không suy ra được từ việc đọc mã ứng dụng.

**Chất lượng prompt.** Không có lỗi nào thuần túy do prompt kém, vì quy trình đã chia 6 bước ngay từ đầu. Điều này cho thấy chia nhỏ prompt là điều kiện **cần** nhưng chưa **đủ**.

### 7.3 Quy luật chung

Bốn trong năm lỗi khiến test **xanh mà không kiểm chứng gì**. Chỉ có lỗi #2 fail lộ liễu, mà cũng phải chủ động chạy `ls reports/` mới thấy.

Điều này đảo ngược trực giác thông thường về kiểm thử: với một bộ test do AI sinh, **kết quả pass mới là thứ cần nghi ngờ**, vì fail luôn tự báo còn pass thì im lặng. Cách phát hiện hiệu quả nhất trong bài này là **cố ý kiểm tra ngược**: với mỗi test pass, tự hỏi *"nó có còn pass không nếu hệ thống hỏng?"* - chính câu hỏi đó đã lôi ra lỗi #1 và #3.

---

## 8. Bug phát hiện - 18

Toàn bộ 18 bug đã được đăng lên GitHub Issues kèm ảnh chụp: https://github.com/dinosauce-285/HW04-Software-Testing/issues

| Mức | FR-01 | FR-09 | FR-14 | Tổng |
|---|---|---|---|---|
| Critical | 3 | 3 | 2 | **8** |
| Major | 1 | 2 | 3 | **6** |
| Minor | 1 | 0 | 3 | **4** |
| **Tổng** | **5** | **5** | **8** | **18** |

Danh sách đầy đủ kèm mã bug, test case phát hiện, ảnh chụp và số hiệu issue: `Bug-Report.md`.

### Ba bug đáng chú ý nhất

**B01 - mã giảm giá phần trăm làm đơn hàng đắt lên gấp 10 lần** (issue #6). Công thức `total x (1 - discount_value)` với `discount_value = 10` cho ra số tiền giảm **âm** 9 lần tổng đơn. Giao diện vẫn hiển thị *"Áp dụng thành công! Giảm 10%"* ngay bên trên dòng *"Tiết kiệm: -4,500,000  VND"*. Đây là lỗi tính tiền, ảnh hưởng trực tiếp tới doanh thu và tới niềm tin của khách hàng.

**C06 - user thường quản lý được danh mục sản phẩm** (issue #16). Middleware `authenticateToken` chỉ xác minh chữ ký JWT mà không kiểm `role`. Toàn bộ nhóm endpoint quản trị đều thiếu bước này, nên phạm vi ảnh hưởng rộng hơn nhiều so với riêng FR-14.

**A01 - quy tắc mật khẩu mâu thuẫn với chính gợi ý của nó** (issue #1). Regex đòi **khoảng trắng** và **cấm** ký tự đặc biệt, trong khi dòng gợi ý ngay dưới ô nhập lại yêu cầu ký tự đặc biệt. Không mật khẩu nào thoả được cả hai. Hệ quả kép: người dùng làm đúng bị chặn, còn mật khẩu yếu `Test 1234` thì lọt.

### Cách chụp bằng chứng

Bug tái hiện được trên giao diện thì chụp trực tiếp bằng Playwright điều khiển trình duyệt thật. Bug chỉ tồn tại ở tầng API thì không có gì để chụp trên màn hình, nên script mở HTML report của lần chạy thật, click vào đúng test fail rồi chụp phần Errors - ảnh hiện `Expected` / `Received` kèm số dòng mã nguồn. Cách này gắn bằng chứng trực tiếp với lần chạy thật, không dựng lại bằng tay được.

Script chụp: `tests/tools/capture-bugs.spec.ts` và `tests/tools/capture-issues.spec.ts`.
Ảnh: `../evidence/bugs/` (16 ảnh bug) và `../evidence/issues/` (19 ảnh: 1 ảnh danh sách toàn bộ 18 issue + 18 ảnh chi tiết, mỗi issue một ảnh, chụp sau khi ảnh bằng chứng nhúng trong issue đã tải xong).

---

## 9. Test case không automate được

**Không có.** Toàn bộ 50 test case đều automate được và đều chạy đủ trên 3 browser.

Lý do đạt được điều này: cả ba feature đều thao tác trên dữ liệu mà bộ test tự tạo và tự kiểm soát được - tài khoản tạo qua API, danh mục tạo rồi xóa, mã giảm giá có sẵn trong seed. Không có trường hợp nào phụ thuộc email thật, cổng thanh toán thật, hay xác nhận của con người.

Chi tiết: `Not-Automated.md`.

---

## 10. Kết luận

### Số liệu tổng hợp

| Chỉ số | Giá trị |
|---|---|
| Feature | 3 |
| Test case automate | 50 (FR-01: 16 / FR-09: 19 / FR-14: 15) |
| File dữ liệu CSV | 7 |
| Assertion pattern mỗi feature | 5 |
| Lượt chạy browser | 9 (3 feature x 3 browser) |
| HTML report | 9 |
| Lượt thực thi test case | 150 |
| Pass / Fail mỗi browser | 23 / 27 |
| Bug phát hiện | 18 (8 Critical / 6 Major / 4 Minor) |
| GitHub Issue | 18 |
| Test case không automate được | 0 |
| Lỗi script tự phát hiện và sửa | 5 |

### Nhận xét về SUT

27 trên 50 test case fail. Con số này cao vì hệ thống được thiết kế có chủ đích để chứa lỗi (`sut/setup_guide.md` nói rõ điều này), nhưng phân bố của chúng vẫn cho thấy một quy luật rõ: **phần lớn lỗi nằm ở chỗ thiếu kiểm tra dữ liệu ở tầng server**. Chỗ nào frontend có validate thì server lại không, nên gọi thẳng API là bỏ qua được toàn bộ. Ba bug Critical nặng nhất (B01, B05, C06) đều thuộc tầng backend.

Một quan sát khác: kết quả **giống hệt nhau trên cả 3 browser** ở cả ba feature. Với một ứng dụng React đơn giản như EShop, chạy đa trình duyệt không phát hiện thêm lỗi nào - nó xác nhận rằng lỗi nằm ở logic chứ không ở tầng render.

### Nhận xét về việc dùng AI

Bộ script này gần như hoàn toàn do AI sinh, nhưng không dòng nào được giữ lại mà chưa qua kiểm chứng bằng cách chạy thật. Giá trị của AI thể hiện rõ nhất ở khối lượng - dựng 50 test case, 7 file dữ liệu và 3 page object trong một buổi làm việc. Giới hạn của nó thể hiện rõ nhất ở khâu **xác minh**: 4 trong 5 lỗi đã sửa đều là test pass mà không kiểm chứng gì, và không lỗi nào tự báo.

Kết luận rút ra: trong kiểm thử tự động, khoảng cách giữa *"script chạy được"* và *"script kiểm được đúng thứ cần kiểm"* là rất lớn, và AI hiện chỉ đảm bảo được vế đầu. Phân tích đầy đủ ở `../appendix/AI-Critique.md`.

---

## 11. Task 2 - Video demo

**Link (unlisted):** https://youtu.be/Vh_Qu7MG8tc

Video chạy end-to-end feature **FR-09 Mã giảm giá** trên cả ba trình duyệt và mở bản HTML report sinh ra, theo đúng yêu cầu mục 6:89-91.

| Yêu cầu | Đáp ứng ở đâu trong video |
|---|---|
| Chứng minh tác giả (mục 6:91, mục 11:132) | Mở đầu: terminal chạy `whoami`, `hostname`, `date -Iseconds`, `git log`; thuyết minh bằng giọng của chính sinh viên, tiếng Việt |
| Chạy một script end-to-end, đa trình duyệt (mục 6:89) | Ba lượt `FEATURE=fr09-coupon BROWSER=<b> npx playwright test --project=<b>` chạy tuần tự trên chromium, firefox, webkit |
| HTML report (mục 6:89) | Mở report vừa sinh bằng `npx playwright show-report`, chỉ vào tiêu đề `Run by: 23127262` và tab Metadata |
| Kể >= 1 lỗi đã sửa (mục 6:90) | Lỗi #2 trong `AI-Review-Fix-Log.md` - xem dưới |

### Lỗi được kể trong video

AI đưa lệnh chạy `npx playwright test --project=chromium --reporter=line`. Cờ `--reporter` ở dòng lệnh **thay thế toàn bộ** mảng `reporter` khai trong `playwright.config.ts`, giết luôn reporter HTML - ba lượt chạy đầu báo "4 passed" bình thường nhưng không sinh report nào.

Chọn kể lỗi này vì nó cho thấy được bằng hình ngay trên màn hình, và vì nó là loại thất bại nguy hiểm nhất: **hoàn toàn im lặng**. Lệnh đúng cú pháp, chạy thành công, không có cảnh báo. Nếu không chủ động kiểm thư mục report thì tới lúc đóng gói mới phát hiện đã mất sạch bằng chứng mà mục 6:83 bắt buộc phải có.

Cách sửa: bỏ cờ `--reporter`, để config tự quyết định. Không sửa file nào - config vốn đã đúng, sai là ở cách gọi.

Trong quá trình chuẩn bị video còn xác minh thêm một điều chưa biết trước đó: liệt kê `html` ngay trên dòng lệnh (`--reporter=line,html`) cũng **không** cứu được. Report có sinh ra, nhưng rơi về thư mục mặc định `playwright-report/` và mất tiêu đề tuỳ chỉnh, vì các tuỳ chọn `outputFolder` và `title` nằm trong config chứ không đi theo cờ. Phát hiện này đã được bổ sung vào Agent Skill.

---

## 12. Agent Skill

**Link video demo (unlisted):** https://youtu.be/GsoKs7q_q4M

**Skill:** `.claude/skills/playwright-feature-suite/` - `SKILL.md` (202 dòng) + 4 template chạy được (`playwright.config.ts`, `csv.ts`, `global-setup.ts`, `extract-ai-audit.mjs`).

Skill đóng gói đúng quy trình đã dùng cho cả ba feature của bài này, chia thành 10 bước:

| Bước | Nội dung |
|---|---|
| 0 | Khảo sát hệ thống trước, cấm đoán selector |
| 1 | Liệt kê test case trước khi viết mã |
| 2 | Tách dữ liệu ra CSV |
| 3 | Page Object dựng từ mã nguồn thật |
| 4 | Spec chạy vòng qua dữ liệu |
| 5 | Assertion theo đặc tả đúng - kèm ba cái bẫy khiến assertion pass mà không kiểm gì |
| 6 | Cô lập dữ liệu giữa các test |
| 7 | Chạy đa trình duyệt và lưu report |
| 8 | Phân loại fail rồi mới báo bug |
| 9 | Ghi lại mọi lần sửa script do AI sinh |

Phần có giá trị nhất là mục **"Three traps that make an assertion pass while checking nothing"** ở bước 5. Cả ba đều là lỗi có thật đã gặp trong bài (accessible name tự chuẩn hoá khoảng trắng, matcher polling pass ở lần thử đầu, chờ phần tử tồn tại ở cả hai trạng thái) chứ không phải lời khuyên chung chung.

### Cách demo trong video

Video quay việc dùng skill trên **FR-05 Product listing and search** - một feature **chưa** nằm trong bài nộp. Chọn feature mới vì mục 7:95 nói mục đích của skill là *"so that it can be reused on additional features"*; dựng lại một feature đã làm thì không chứng minh được điều đó.

Video cho thấy skill tự dẫn qua từng bước, và đặc biệt là bước 0 buộc đọc mã nguồn thật trước khi viết selector - đúng cơ chế ngăn AI bịa selector, vốn là nguyên nhân của cả 4 lỗi khảo sát ghi trong `AI-Review-Fix-Log.md`.
