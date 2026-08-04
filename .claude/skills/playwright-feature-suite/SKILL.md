---
name: playwright-feature-suite
description: Dựng bộ automation test Playwright data-driven cho MỘT feature web, chạy đa trình duyệt và sinh HTML report có gắn nhãn tác giả. Dùng khi cần automate một chức năng (đăng ký, thanh toán, CRUD quản trị...) từ đầu tới lúc có report và bug report. Kích hoạt bởi các yêu cầu như "automate feature X", "viết test Playwright cho màn hình Y", "dựng suite data-driven", "chạy test trên 3 browser".
---

# Dựng bộ test Playwright cho một feature

Skill này đóng gói quy trình đã dùng để automate 3 feature của EShop trong HW04, cho ra
50 test case, 9 HTML report và 18 bug được xác nhận.

Nguyên tắc bao trùm: **không sinh script từ mô tả chức năng**. Mọi selector và mọi kỳ vọng
phải bắt nguồn từ mã nguồn thật hoặc từ hành vi quan sát được khi chạy.

## Bước 0 — Khảo sát trước, đừng đoán

Trước khi viết dòng test đầu tiên, chạy một script khảo sát dùng một lần để xác minh hành vi thật.

1. Đọc mã nguồn của màn hình (component, route, handler API, lược đồ CSDL).
2. Viết script Playwright thăm dò, in ra: nhãn nút thật, `type` của các ô nhập, số phần tử
   khớp mỗi selector dự định dùng, mã trạng thái HTTP của các endpoint liên quan.
3. Ghi kết quả vào một file khảo sát — nó là căn cứ để viết assertion về sau.

**Bốn thứ luôn phải kiểm ở bước này**, vì đây là những chỗ suy đoán hay sai nhất:

| Kiểm gì | Vì sao |
|---|---|
| Nhãn nút và tiêu đề thật | UI tiếng Việt vẫn hay lẫn nút tiếng Anh (`Sign In`, `Login`) |
| `type` của ô mật khẩu | Nhiều app khai `type="text"` → `input[type=password]` không khớp |
| Số phần tử khớp mỗi selector CSS | Khớp 2 phần tử là strict mode violation |
| Trạng thái sống qua reload được không | Dữ liệu trong context React mất khi `page.goto` |

## Bước 1 — Liệt kê test case trước khi viết mã

Áp dụng phân vùng tương đương và phân tích giá trị biên. Với mỗi ràng buộc, sinh ít nhất
ba trường hợp: **dưới biên · đúng biên · trên biên**. Lỗi `>` thay vì `>=` chỉ lộ ra ở ca "đúng biên".

Mục tiêu tối thiểu 12 test case mỗi feature, chia thành ba nhóm positive / negative / edge.

## Bước 2 — Tách dữ liệu ra file CSV

Một dòng là một test case. Các cột nên có:

```csv
tc_id,loai,mo_ta,<các cột dữ liệu>,expect_*,ref_bug
```

- `expect_*` mã hoá kỳ vọng, để spec không chứa giá trị nào viết cứng.
- `ref_bug` liên kết test case với mã bug, dùng cho thông báo lỗi và cho bug report.
- Giá trị CSV không biểu diễn được (chuỗi 500 ký tự, email cần duy nhất mỗi lần chạy)
  thì dùng placeholder `__LONG_500__`, `__UNIQUE__` rồi giãn ra trong helper đọc CSV.

Đọc bằng `csv-parse/sync` với `trim: false` — nếu để `true` thì các test kiểm chính khoảng trắng
sẽ mất dữ liệu đầu vào.

## Bước 3 — Page Object dựng từ mã nguồn thật

Gom toàn bộ selector vào một lớp. Ghi chú ngay trong file mọi cái bẫy đã phát hiện ở bước 0,
kèm số dòng mã nguồn — đó là thứ giúp người sau hiểu vì sao selector lại kỳ lạ như vậy.

Page Object cung cấp hai loại phương thức:
- **Hành động** — không assert, để test tự quyết định kỳ vọng.
- **Đọc trạng thái** — trả về giá trị thô (số, chuỗi, boolean), không diễn giải.

## Bước 4 — Spec chạy vòng qua dữ liệu

```ts
const cases = readCsv<Case>('feature.csv');
for (const c of cases) {
  test(`${c.tc_id} [${c.loai}] ${c.mo_ta}`, async ({ page }) => { /* ... */ });
}
```

Tên test lấy từ CSV nên hiện trực tiếp trong HTML report, đọc là hiểu ngay đang kiểm gì.

## Bước 5 — Assertion theo đặc tả đúng, không theo hành vi hiện tại

Đây là bước quyết định giá trị của cả bộ test.

Nếu hệ thống trả 5.000.000 ₫ trong khi đặc tả nói 450.000 ₫ thì assertion viết **450.000**.
Test sẽ fail, và chính cái fail đó là bằng chứng bug. Viết theo hành vi hiện tại thì
report toàn màu xanh mà không phát hiện được gì.

Dùng ít nhất 3 kiểu assertion **khác nhau về bản chất**:

| Kiểu | Ví dụ |
|---|---|
| Đếm phần tử | `expect(rows).toHaveCount(n)` |
| Nội dung text | `expect(el).toContainText('...')` |
| Điều hướng | `expect(page).toHaveURL(/...$/)` |
| Trạng thái control | `toBeDisabled` · `toHaveValue` · `toBeVisible` |
| Tầng API | `expect(res.status()).toBe(400)` |
| Bất biến nghiệp vụ | `expect(final).toBeGreaterThanOrEqual(0)` |

Kèm thông báo lỗi mô tả **hệ quả nghiệp vụ**, không chỉ nói giá trị lệch:

```ts
expect(discount, `${c.tc_id}: số tiền giảm sai — bug ${c.ref_bug}`).toBe(Number(c.expect_discount));
```

### Ba cái bẫy khiến assertion pass mà không kiểm gì

Đây là phần quan trọng nhất của skill này. Cả ba đều đã thực sự xảy ra.

**1. `getByRole` chuẩn hoá khoảng trắng.** Chuẩn accessible name tự gộp khoảng trắng, nên
`getByRole('cell', { name: 'Tên' })` vẫn khớp `'  Tên  '`. Muốn kiểm việc trim thì phải so
trên `allTextContents()` nguyên văn.

**2. Matcher polling pass ở lần thử đầu.** `expect(page).toHaveURL(/\/register$/)` để kiểm
"phải ở lại trang" luôn đúng, vì lần poll đầu diễn ra trước khi ứng dụng kịp điều hướng.
Phải chờ trạng thái ổn định trước:

```ts
const navigated = await page.waitForURL('**/login', { timeout: 3000 }).then(() => true, () => false);
expect(navigated).toBe(false);
```

**3. Chờ phần tử tồn tại ở cả hai trạng thái.** Chờ một link hiển thị cả khi đã và chưa đăng nhập
thì không xác nhận được gì. Phải chọn phần tử **chỉ** xuất hiện ở trạng thái mong muốn
(nút "Thoát", tên người dùng), và đối chiếu nhánh `{user ? ... : ...}` trong mã nguồn.

## Bước 6 — Cô lập dữ liệu giữa các test

Test dùng chung tài khoản hoặc dữ liệu tích lũy sẽ phụ thuộc thứ tự chạy và **fail sai lý do**,
che mất bug thật.

- `globalSetup` reset cơ sở dữ liệu về trạng thái seed trước mỗi lượt chạy.
- Mỗi test tự tạo tài khoản riêng nếu feature có hạn mức tính theo người dùng.
- Dữ liệu do test tạo thì gắn timestamp vào tên để không đụng nhau.
- Đặt `retries: 0` — test fail vì bug thật là kết quả cần giữ nguyên, không được retry cho qua.

## Bước 7 — Chạy đa trình duyệt và lưu report

```ts
// playwright.config.ts
const RUN_AT = new Date().toISOString();
const REPORT_DIR = `reports/${FEATURE}-${BROWSER}-${RUN_AT.replace(/[:.]/g, '-')}`;

metadata: { 'Run by': STUDENT_ID, 'Run at (ISO)': RUN_AT },
reporter: [['list'], ['html', { open: 'never', outputFolder: REPORT_DIR,
             title: `Run by: ${STUDENT_ID} — ${FEATURE} — ${BROWSER} — ${RUN_AT}` }]],
```

Chạy **từng feature trên từng browser một lượt riêng**:

```bash
for b in chromium firefox webkit; do FEATURE=$f BROWSER=$b npx playwright test --project=$b; done
```

**Không bao giờ thêm cờ `--reporter` vào dòng lệnh** — nó đè toàn bộ danh sách reporter trong
config, khiến lượt chạy không sinh report nào mà terminal vẫn báo thành công.

Sau mỗi lượt: `ls reports/` để xác nhận thư mục mới thật sự xuất hiện. Lệnh `--list` cũng tạo
thư mục report rỗng — nhớ xoá, kẻo đếm nhầm.

## Bước 8 — Phân loại fail rồi mới báo bug

Với mỗi test fail, trả lời trước một câu hỏi: **bug thật hay script sai?**

| Dấu hiệu | Kết luận |
|---|---|
| Thông báo lỗi khớp đúng hệ quả nghiệp vụ đã dự đoán | Bug thật |
| Fail vì "đã đạt giới hạn", "không tìm thấy phần tử" ở bước dựng bối cảnh | Script sai — sửa rồi chạy lại |
| Fail chỉ ở một browser | Nghi lỗi tương thích hoặc timing — kiểm riêng |
| Kết quả giống hệt trên cả 3 browser | Lỗi logic phía server |

Chỉ khi đã chắc là bug thật mới ghi vào bug report và tạo issue.

### Chụp bằng chứng

- Bug thấy được trên giao diện → chụp trực tiếp trong trình duyệt tại đúng khoảnh khắc lỗi hiện ra.
- Bug chỉ ở tầng API → mở HTML report của lần chạy thật, click vào test fail, chụp phần Errors
  (có `Expected` / `Received` và số dòng mã nguồn).
- Đưa ảnh vào repo rồi nhúng vào issue bằng URL raw của GitHub — `gh` không upload ảnh trực tiếp được.

## Bước 9 — Ghi lại mọi lần sửa script do AI sinh

Mỗi lần sửa, ghi ngay một dòng: AI sinh gì · sai chỗ nào · sửa thành gì · **vì sao AI trượt**.
Cột cuối không dựng lại được sau, và nó là phần phân tích có giá trị nhất.

Phân loại nguyên nhân thành ba nhóm: `prompt` (thiếu ngữ cảnh) · `model` (giới hạn mô hình) ·
`feature` (đặc thù hệ thống, chỉ biết khi đọc mã nguồn).

## Checklist trước khi coi là xong

- [ ] ≥ 12 test case, đủ cả positive / negative / edge
- [ ] Không còn giá trị dữ liệu nào viết cứng trong file spec
- [ ] ≥ 3 kiểu assertion khác nhau về bản chất
- [ ] Chạy đủ 3 browser, mỗi lượt một thư mục report riêng
- [ ] Report hiện đúng nhãn tác giả và ISO timestamp — mở ra xem tận mắt, không chỉ tin config
- [ ] Mọi test fail đã được phân loại bug thật / script sai
- [ ] Test pass đã bị chất vấn ngược: nó có còn pass không nếu hệ thống hỏng?
- [ ] Nhật ký sửa script đã ghi đủ cột "vì sao AI trượt"
