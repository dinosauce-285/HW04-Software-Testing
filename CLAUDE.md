# CLAUDE.md - Hướng dẫn làm việc (HW04 / Automation Testing)

Đọc file này đầu mỗi phiên. Các quy tắc ở mục 2 phải **tự động áp dụng**, không cần được nhắc.

---

## 1. Biến - không được đoán

| Trường | Giá trị |
|---|---|
| MSSV | `23127262` |
| Họ tên | `Lý Quốc Thạnh` |
| Email MSSV | `23127262@student.hcmus.edu.vn` |
| Repo bài làm (public) | `https://github.com/dinosauce-285/HW04-Software-Testing` |
| Feature Pool A | **FR-01 Đăng ký tài khoản** - tạo tài khoản mới với họ tên, email, mật khẩu |
| Feature Pool B | **FR-09 Mã giảm giá** - áp mã `percent`/`fixed` cho đơn hàng |
| Feature Pool C | **FR-14 Quản lý danh mục** - frontend-admin, tab *Danh mục* |
| Nguồn 3 feature | Kế thừa từ HW02 (Pool D - FR-07 Giỏ hàng Mobile - không dùng ở HW04, theo mục 5:69) |
| Framework | **Playwright** + Playwright HTML reporter |
| SUT - mã nguồn | `sut/` - clone từ `https://github.com/ttbhanh/eshop-sut`, đã gitignore, **không commit** |
| SUT - API | `http://localhost:3000` / `node backend/server.js` |
| SUT - Web | `http://localhost:5173` / `npm run dev` trong `frontend-web` |
| SUT - Admin | `http://localhost:5174` / `npm run dev` trong `frontend-admin` |
| Reset dữ liệu | `node backend/database.js` |
| Tài khoản admin | `admin@eshop.com` / `Admin123!` - **không phải** `admin123` như `setup_guide.md` ghi |
| Tài khoản user | `test@eshop.com` / `Test1234!` |
| Bộ 3 browser | **chromium / firefox / webkit** (phương án 1, đề mục 6:83) |
| Ngôn ngữ script | TypeScript - `tests/**/*.spec.ts` |
| Định dạng test data | **CSV** - `data/*.csv`, đọc bằng `csv-parse/sync` |
| Page Object | Có - selector gom về `tests/pages/` |
| Tên test case | Tiếng Việt (hiện trực tiếp trong HTML report) |
| YouTube Task 2 | `https://youtu.be/Vh_Qu7MG8tc` (unlisted) |
| YouTube Agent Skill | `https://youtu.be/GsoKs7q_q4M` (unlisted) |
| Self-assessed grade | `100` -> file nộp `23127262_HW04_AI_Automation_100.zip` |

Khi còn `<điền>` mà cần dùng -> **hỏi**, không tự suy ra, không dùng giá trị ví dụ.

**FR-14 - lưu ý phạm vi:** UI chỉ có **Thêm** và **Xóa**, **không có Sửa** (API vẫn có `PUT /api/categories/:id` nhưng giao diện không gọi tới). Đề gọi feature này là "Category management (CRUD)" (mục 4:59) - phải nêu rõ sai lệch trong báo cáo chính, và bù số lượng test case bằng validation / phân quyền / edge case của Thêm-Xóa để vẫn đủ >=12 TC.

**Hành vi thật của SUT đã khảo sát 04/08/2026** -> `survey/Survey-Report.md`. Đọc mục 5 của file đó trước khi viết selector: nút đăng nhập là `Sign In`/`Login` chứ không phải tiếng Việt, ô mật khẩu trang Login là `type=text`, giỏ hàng không lưu qua reload.

Chọn Playwright vì đề khuyến nghị (`2026.HW04.Automation Testing_En.md` mục 8:103) và HTML reporter có sẵn, không phải dựng Allure. Đổi sang Selenium thì phải sửa lại R5 và mục 4.

---

## 2. Quy tắc thường trực

### R1 - AI Audit Log tự động, không chen vào flow
*(HW04 mục 9:113-119 / Policies - "AI Disclosure":7)*

Mỗi tương tác AI phải được lưu: **tên công cụ / ngày giờ / prompt nguyên văn / output**.

**Không ghi tay từng lượt.** Transcript đầy đủ đã nằm ở `~/.claude/projects/-home-qt-projects-hw04/*.jsonl`. Cơ chế:
- **Chính** - Stop hook tự trích xuất khi kết thúc phiên, append vào `submission/appendix/AI-Prompt-Log.md` (nhật ký nguyên văn theo lượt); bảng audit theo mẫu của Khoa nằm ở `submission/appendix/AI-Audit-Report.md`, cập nhật tay.
- **Dự phòng** - skill `/log-ai`, gọi tay khi phiên bị ngắt đột ngột hoặc cần lọc lại.

Đề bài khuyến khích đúng cách này: *"you are encouraged to create a skill or rule that extracts the information above automatically after an AI session"* (mục 9:119).
*Thiếu AI Audit Report -> 0 điểm (mục 17:182).*

### R2 - Commit theo từng bước
*(Policies - "Version Control Requirements":22 - "For every step within a requirement, students must create a clear and explicit Git commit message")*

Xong một bước có ý nghĩa (một spec file chạy được, một lần chạy cross-browser, một lần sửa script sau review, một data file) -> **commit ngay, không hỏi**. Báo lại commit message trong câu trả lời.

**Định dạng bắt buộc - Conventional Commits, viết bằng tiếng Anh:**
```
<type>(<scope>): <mô tả ngắn, thức mệnh lệnh, không viết hoa đầu, không dấu chấm cuối>
```
- `type` thuoc `feat` / `fix` / `docs` / `chore` / `refactor` / `test`
- `scope` thuoc `featA` / `featB` / `featC` / `data` / `config` / `report` / `skill` / `appendix` / `repo`
- Ví dụ: `test(featB): add 12 data-driven cases for shopping cart`

**KHÔNG kèm trailer `Co-Authored-By`** - bài nộp phải đứng tên sinh viên; việc dùng AI đã khai ở AI Audit Report (R1).

### R3 - Xuất Git commit log trước khi nộp
*(HW04 mục 14:154 - "Git commit log (text file)")*

```bash
git log --pretty=format:'%h | %ad | %s' --date=iso > submission/appendix/git-log.txt
```

*Người dùng đã quyết **không** theo dõi ràng buộc "8 commit trải 4 ngày" của mục 12:136 - không nhắc lại, không đếm ngày.*

### R4 - Nhật ký review & fix AI
*(HW04 mục 6:84 / mục 14:149 / mục 2:21)*

*"Report what the AI got wrong or missed - fragile selectors, weak or missing assertions, missing edge cases, or flaky waits - and explain **why** it missed them (prompt quality, model limitations, or characteristics of the feature)."*

**Mỗi lần sửa code do AI sinh ra** -> thêm ngay một dòng vào `submission/report/AI-Review-Fix-Log.md`:

| Feature | File:dòng | AI sinh gì | Sai chỗ nào | Mình sửa thành | **Vì sao AI trượt** |

Ghi tại thời điểm sửa, không gom cuối bài - cột "vì sao" không dựng lại được sau. Đây là phần Analyse (G9.3) và nằm trực tiếp trong thang điểm 3x25.

### R5 - Lưu HTML report ngay sau mỗi lần chạy
*(HW04 mục 6:83 / mục 11:131 / mục 14:151)*

*"at least 9 browser runs in total... Each run must produce an HTML report... that visibly displays 'Run by: {StudentID}'"* và *"together with an ISO timestamp"*.

Playwright HTML reporter **ghi đè** `playwright-report/` mỗi lần chạy -> chạy lượt sau là mất lượt trước. Vì vậy mọi lệnh chạy phải xuất ra thư mục riêng:

```
submission/html-reports/<feature>-<browser>-<ISO-timestamp>/
```

Và mỗi report phải mang `Run by: 23127262` + ISO timestamp - nhúng qua metadata trong `playwright.config.ts`, không sửa tay file HTML.
*TA verify trực tiếp phần này (mục 11 Anti-AI-Cheat) - sửa tay HTML là gian lận.*

Đủ ma trận: 3 feature x 3 browser = **9 thư mục report**.

### R6 - Bug -> cả Markdown lẫn GitHub Issues
*(HW04 mục 6:85 / mục 14:155)*

*"Log such bugs both in the Markdown report and on your GitHub Issues page, attaching a screenshot to each issue."*

Assertion fail lộ ra lỗi thật (không phải script sai) -> làm đủ 3 việc, ngay lúc phát hiện:
1. Thêm dòng vào `submission/report/Bug-Report.md`
2. Tạo GitHub Issue trên repo bài làm
3. Đính screenshot vào issue - **chụp ngay lúc thấy**, đừng chờ dựng lại *(quy tắc vận hành, đề chỉ đòi có screenshot)*

Số bug trong Markdown phải **khớp** số issue trên GitHub.

### R7 - Test case không automate được -> ghi lý do ngay
*(HW04 mục 6:85 - "Document any test cases you could not automate and explain why")*

Bỏ qua / `test.skip` / không viết được case nào -> ghi ngay vào `submission/report/Not-Automated.md` kèm lý do kỹ thuật. Không để trống rồi giải thích sau.

### R8 - Bất biến khi viết hoặc sửa script
*(HW04 mục 6:81-82)*

Kiểm 3 điều này ở **mọi** lần đụng vào file spec, kể cả refactor:

| Bất biến | Trích |
|---|---|
| Data ở file `.csv` riêng | *"hardcoded inline arrays or objects in the script are not accepted"* |
| >= 3 assertion pattern khác nhau | *"must use at least three distinct assertion patterns"* |
| >= 12 test case **mỗi** feature | *"at least 12 test cases"* |

Refactor làm rụng assertion pattern hay đẩy data ngược vào script -> chặn lại, không im lặng đi tiếp.

**Assertion viết theo đặc tả ĐÚNG, không theo hành vi hiện tại của SUT.** Ví dụ: đơn 500.000 VND áp `SAVE10` thì kỳ vọng 450.000 VND - test sẽ **fail** vì SUT trả 5.000.000 VND, và chính cái fail đó là bằng chứng bug (mục 6:85 - *"wherever a failing assertion reveals a genuine defect, a bug report"*).
Mỗi test fail phải phân loại rõ trong báo cáo: **fail do bug thật** hay **fail do script sai**. Không được im lặng sửa assertion cho pass.

### R9 - Giữ README đúng
*(HW04 mục 14:156)*

README phải có bảng tự đánh giá + test summary: *"number of features; number of test cases automated, executed, passed, and failed; number of browser runs; number of bugs; and the demo video link."*
Con số nào đổi -> cập nhật README ngay trong cùng phiên.
*mục 17:182 - thiếu bất kỳ tài liệu bắt buộc nào -> 0 điểm.*

### R10 - Đánh dấu phần chưa chạy thật
*(HW04 mục 2:21 - "submitting the raw AI output without review is not acceptable")*

Script, selector, hay test data sinh ra mà **chưa chạy thật trên EShop** phải có [!] và ô [ ] để verify. Nói rõ trong câu trả lời, không im lặng.
AI bịa selector rất nhiều - một spec "trông đúng" mà chưa chạy thì chưa tính là xong.

### R11 - Số liệu nhất quán
*(quy tắc vận hành - không trích từ tài liệu; hỗ trợ mục 14:156)*

Số TC / pass / fail / browser run / bug xuất hiện ở README, báo cáo chính, và report HTML. Khi một con số đổi -> cập nhật **đồng thời** mọi nơi, và **đếm lại bằng lệnh**, không tin trí nhớ.

### R12 - Bồi Agent Skill dần
*(quy tắc vận hành; mục 7:95-96 chỉ "encouraged", nhưng mục 15:168 chấm **10 điểm**)*

Làm xong feature A -> chắt quy trình vừa dùng thành `.claude/skills/`. Feature B, C dùng lại skill đó và tinh chỉnh. Gom vào cuối bài thì skill sẽ rỗng và video demo không có gì để quay.

---

## 3. Việc người dùng tự làm - không đụng vào

Xuất PDF / quay video / đóng gói zip (nén, split, đặt tên).

Không làm hộ, không tự nhắc mỗi phiên. Chỉ trả lời khi được hỏi thẳng.

---

## 4. Ràng buộc khi tạo nội dung

**Chung**
- Bài làm viết bằng **Markdown**, kèm bản PDF (Policies - "PDF Copies":16).
- **AI-first, từng bước** - cấm một prompt kiểu *"write all the automation scripts for this feature"* (mục 2:20). Quy trình phải chia bước: đọc test case -> page object -> data file -> spec -> assertion -> chạy -> sửa. Chính AI Audit Log là bằng chứng cho việc này.
- 3 feature phải thuộc 3 pool khác nhau (A, B, C) và không trùng thành viên nhóm (mục 5:69-71).
- File thật phải nằm trong zip - *"Misuse or over-reliance on online links... will result in a score of zero"* (Policies:42).

**Task 1** - mỗi feature: >=12 TC / 3 browser / data-driven / >=3 assertion pattern / 3 HTML report. Xem R5, R8.

**Task 2 (video, 15đ)** - unlisted YouTube, **>=5 phút**, thuyết minh **tiếng Việt**, chạy end-to-end gồm cả multi-browser và HTML report. Phải kể **>=1 lỗi mình đã sửa** trong script AI sinh. Chứng minh tác giả bằng **face-cam hoặc terminal chạy `whoami` và `hostname`** (mục 6:89-91 / mục 11:132).

**Agent Skill (10đ)** - nộp kèm video demo riêng, quay end-to-end việc dùng skill trên một feature hoàn chỉnh (mục 7:96).

**Phụ lục** - AI Critique phải **200-300 chữ**, đếm trước khi kết luận là đạt (mục 10:121).

**Nộp** - `23127262_HW04_AI_Automation_<grade>.zip` (mục 14:145). Bắt buộc có: báo cáo chính (md+pdf) / link repo / 9 HTML report / link video / AI Critique + AI Audit (md+pdf) / git commit log (text) / bug report + screenshot / README.

---

## 5. Tra cứu

| Cần gì | Ở đâu |
|---|---|
| Yêu cầu chính thức | `docs/2026.HW04.Automation Testing_En.md` |
| Chính sách môn học | `docs/___2026.Homework.Policies.md` |
| SUT (source, cách chạy) | `https://github.com/ttbhanh/eshop-sut` |
| Cấu trúc thư mục, trạng thái, self-assessment | `submission/README.md` |
| Hành vi thật của SUT, bẫy selector | `survey/Survey-Report.md` |

**Repo bài làm:** `https://github.com/dinosauce-285/HW04-Software-Testing` (public, remote `origin`, branch `main`)
