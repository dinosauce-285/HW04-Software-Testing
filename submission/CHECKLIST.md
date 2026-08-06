# CHECKLIST - đối chiếu điều khoản -> file

**Sinh viên:** Lý Quốc Thạnh - `23127262` / **Bài nộp:** `23127262_HW04_AI_Automation_100.zip`

Checklist này đi theo **từng dòng** của hai tài liệu nguồn, không theo cấu trúc thư mục - để tránh việc "thư mục trông đầy đủ" nhưng thực ra hụt yêu cầu. Mỗi điều khoản trỏ tới **một** file cụ thể; chỗ nào một file phục vụ hai điều khoản đều được ghi rõ lý do.

Nguồn: `docs/2026.HW04.Automation Testing_En.md` / `docs/___2026.Homework.Policies.md`

**Ký hiệu:** [x] đủ / [~] có nhưng chưa chốt / [ ] chưa có / [!] không đạt / - không áp dụng

---

## A. Đề bài - HW04

### §2 Nguyên tắc làm việc

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A2.1 | §2:20 - AI-first, dẫn AI **từng bước**, cấm một prompt kiểu *"write all the automation scripts"* | [`appendix/AI-Audit-Report.md`](appendix/AI-Audit-Report.md) - 95 lượt riêng biệt / quy trình 6 bước/feature mô tả ở [`report/Main-Report.md`](report/Main-Report.md) §3 | [x] |
| A2.2 | §2:21 - mọi kết quả AI phải được người review và sửa | [`report/AI-Review-Fix-Log.md`](report/AI-Review-Fix-Log.md) - 5 lỗi đã sửa + 4 lỗi đối chứng từ khảo sát | [x] |
| A2.3 | §2:22 - toàn bộ quá trình dùng AI ghi thành log đầy đủ | [`appendix/AI-Audit-Report.md`](appendix/AI-Audit-Report.md) | [~] cần sinh lại sau phiên AI cuối |
| A2.4 | §2:23 - tài liệu ở định dạng text (Markdown) | mọi file `.md` trong thư mục này | [x] |
| A2.5 | §2:24 - chấm theo chất lượng, không chỉ hoàn thành | - tiêu chí chấm, không phải hạng mục nộp | - |

### §5 Chọn feature

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A5.1 | §5:69 - 3 feature web, mỗi pool A/B/C một cái, **giống HW02** | [`report/Main-Report.md`](report/Main-Report.md) §1 - nêu rõ "kế thừa từ HW02" và lý do bỏ Pool D | [x] |
| A5.2 | §5:70 - nếu không có HW02 thì tự khai + nêu lý do | - có HW02, không áp dụng | - |
| A5.3 | §5:71 - không trùng với thành viên khác trong nhóm | - §5:71 mở đầu bằng *"Within each group"*; HW04 là bài cá nhân (§1 Form: Individual Assignment) nên không có nhóm để đối chiếu | - |

### §6 Task 1 - script automation

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A6.1 | §6:81 - mỗi feature **>= 12 test case** | [`tests/fr01-register/`](tests/fr01-register/) 16 / [`tests/fr09-coupon/`](tests/fr09-coupon/) 19 / [`tests/fr14-category/`](tests/fr14-category/) 15 | [x] 50 |
| A6.2 | §6:82 - dữ liệu ở file `.csv`/`.json` riêng, **cấm mảng viết cứng trong script** | [`data/`](data/) - 7 file `.csv`, đọc qua [`tests/fixtures/csv.ts`](tests/fixtures/csv.ts) | [x] |
| A6.3 | §6:82 - **>= 3 kiểu assertion khác nhau** | [`report/Main-Report.md`](report/Main-Report.md) §4.4, §5.3, §6.3 - 5 kiểu mỗi feature | [x] |
| A6.4 | §6:83 - chạy trên **>= 3 browser**, **>= 9 lượt**, mỗi lượt một HTML report | [`html-reports/`](html-reports/) - 9 thư mục, chromium/firefox/webkit x 3 feature | [x] 9/9 |
| A6.5 | §6:83 - report hiển thị **`Run by: {StudentID}`** | tiêu đề + tab Metadata mỗi report, nhúng qua `playwright.config.ts:32-47` | [x] |
| A6.6 | §6:84 - nêu AI sai gì **và vì sao trượt** (prompt / model / đặc thù feature) | [`report/AI-Review-Fix-Log.md`](report/AI-Review-Fix-Log.md) - cột "Vì sao AI trượt" + cột phân loại | [x] |
| A6.7 | §6:85 - bug ghi ở **cả** Markdown **và** GitHub Issues | [`report/Bug-Report.md`](report/Bug-Report.md) - 18 bug <-> 18 issue | [x] |
| A6.8 | §6:85 - **đính ảnh** vào mỗi issue | [`evidence/bugs/`](evidence/bugs/) 16 ảnh / [`evidence/issues/`](evidence/issues/) 4 ảnh trang Issues | [x] |
| A6.9 | §6:85 - ghi lại test case **không automate được** + lý do | [`report/Not-Automated.md`](report/Not-Automated.md) - kết luận 0 case phải bỏ, kèm lý do vì sao đạt 100% | [x] |

### §6 Task 2 - video demo

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A6.10 | §6:89 - YouTube **unlisted**, **>= 5 phút**, thuyết minh **tiếng Việt** | link ở mục D | [x] |
| A6.11 | §6:89 - chạy **một** script end-to-end, gồm cả đa browser và HTML report | FR-09 trên 3 browser + mở HTML report | [x] |
| A6.12 | §6:90 - kể **>= 1 lỗi đã sửa** trong script AI sinh | lỗi #2 - cờ `--reporter` đè config, xem [`report/AI-Review-Fix-Log.md`](report/AI-Review-Fix-Log.md) | [x] |
| A6.13 | §6:91 - face-cam **hoặc** terminal chạy `whoami` + `hostname` | mở đầu video Task 2 | [x] |

### §7 Agent Skill

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A7.1 | §7:95 - xây skill áp dụng được quy trình này cho feature khác | `../.claude/skills/playwright-feature-suite/` - SKILL.md + 4 template | [x] |
| A7.2 | §7:96 - nộp skill **kèm video demo** dùng skill trên một feature hoàn chỉnh | link ở mục D - demo trên FR-05, feature chưa nộp | [x] |

### §8 Công cụ

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A8.1 | §8:100 - khai báo công cụ AI trong AI Audit Report | [`appendix/AI-Audit-Report.md`](appendix/AI-Audit-Report.md) - bảng "Tên công cụ / Mô hình" | [x] |
| A8.2 | §8:103 - Playwright hoặc Selenium 4+ | Playwright 1.62 - `../package.json` | [x] |
| A8.3 | §8:104 - Allure hoặc Playwright HTML reporter | Playwright HTML reporter - `../playwright.config.ts:43` | [x] |

### §9 AI Audit Report

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A9.1 | §9:113 - khai báo có dùng AI | [`appendix/AI-Audit-Report.md`](appendix/AI-Audit-Report.md) mục 1 (checkbox Có) + mục 6 Mandatory Disclosure dán nguyên văn theo mẫu của Khoa | [x] |
| A9.2 | §9:114-117 - mỗi lượt: **tên công cụ / ngày giờ / prompt nguyên văn / output** | [`appendix/AI-Prompt-Log.md`](appendix/AI-Prompt-Log.md) - 95 lượt, đủ 4 trường. Tách khỏi AI-Audit-Report vì mẫu của Khoa tổ chức theo artifact, không theo lượt | [~] chưa gồm phiên hiện tại |
| A9.3 | §9:119 - *(khuyến khích)* skill/rule tự trích xuất sau phiên | `../tools/extract-ai-audit.mjs` | [x] |

### §10 AI Critique

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A10.1 | §10:121 - đúng **200-300 chữ** | [`appendix/AI-Critique.md`](appendix/AI-Critique.md) - **299 chữ** phần thân | [x] sát trần |
| A10.2 | §10:123 - trả lời 3 câu: AI sai/thiên lệch/thiếu ở đâu / vì sao không tự phát hiện / rút ra nguyên tắc gì | cùng file - 3 đoạn tương ứng | [x] |

### §11 Chống gian lận

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A11.1 | §11:131 - HTML report chứa `Run by: {ID}` **kèm ISO timestamp** | 9 report - `Run at (ISO)` trong tab Metadata, không sửa tay HTML | [x] |
| A11.2 | §11:132 - video có giọng của chính mình + face-cam hoặc `whoami`/`hostname` | trùng A6.13 - cùng một điều kiện, hai chỗ nhắc | [x] |

### §12 Git

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A12.1 | §12:136 - repo GitHub **công khai** | https://github.com/dinosauce-285/HW04-Software-Testing | [x] |
| A12.2 | §12:136 - **>= 8 commit** chạm file test, trải **>= 4 ngày** | thực tế: **6 commit** chạm `.spec.ts`, tất cả trong **1 ngày** (04/08/2026) | [!] **không đạt** |
| A12.3 | §12:137 - commit log ở file text | [`appendix/git-log.txt`](appendix/git-log.txt) | [~] xuất lại trước khi zip |

### §14 Nội dung bắt buộc trong zip

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| A14.1 | §14:145 - tên file `<MSSV>_HW04_AI_Automation_<grade>.zip` | `23127262_HW04_AI_Automation_100.zip` | [ ] khi đóng gói |
| A14.2 | §14:149 - báo cáo chính (**md + PDF**), gồm cả automation report và phần review/gap analysis | [`report/Main-Report.md`](report/Main-Report.md) - 12 mục, §7 là gap analysis, §11-12 là Task 2 và Agent Skill | [x] md / [ ] pdf |
| A14.3 | §14:150 - link repo công khai (script, data file, HTML report) | mục D + [`README.md`](README.md) | [x] |
| A14.4 | §14:151 - HTML report đa browser | [`html-reports/`](html-reports/) | [x] |
| A14.5 | §14:152 - link video YouTube unlisted | mục D + [`report/Main-Report.md`](report/Main-Report.md) §11-12 | [x] |
| A14.6 | §14:153 - AI Critique (**md + PDF**) | [`appendix/AI-Critique.md`](appendix/AI-Critique.md) | [x] md / [ ] pdf |
| A14.7 | §14:153 - AI Audit Report (**md + PDF**) | [`appendix/AI-Audit-Report.md`](appendix/AI-Audit-Report.md) | [~] md / [ ] pdf |
| A14.8 | §14:154 - git commit log (file **text**) | [`appendix/git-log.txt`](appendix/git-log.txt) - file `.txt` riêng, **không** gộp vào `.md` | [~] |
| A14.9 | §14:155 - bug report + ảnh trang GitHub Issues | [`report/Bug-Report.md`](report/Bug-Report.md) + [`evidence/issues/`](evidence/issues/) | [x] |
| A14.10 | §14:156 - `README.md` có bảng tự đánh giá **và** test summary (số feature / TC automate/chạy/pass/fail / số lượt browser / số bug / link video) | [`README.md`](README.md) | [x] |
| A14.11 | §14:157 - tài liệu hỗ trợ khác | [`report/AI-Review-Fix-Log.md`](report/AI-Review-Fix-Log.md) / [`report/Not-Automated.md`](report/Not-Automated.md) / [`appendix/Git-Commit-Log.md`](appendix/Git-Commit-Log.md) / file này | [x] |

### §17 Quy định khác

| Mã | Điều khoản | Ghi chú | TT |
|---|---|---|---|
| A17.1 | §17:181 - không nhận nộp trễ | - | - |
| A17.2 | §17:182 - **thiếu bất kỳ tài liệu bắt buộc nào -> 0 điểm** | lý do checklist này tồn tại | - |
| A17.3 | §17:183 - sao chép giữa sinh viên, **kể cả prompt** -> 0 cả hai bên | prompt trong AI Audit là của phiên làm việc thật | [x] |

---

## B. Policies môn học

| Mã | Điều khoản | File / bằng chứng | TT |
|---|---|---|---|
| P1 | Individual Work - bài cá nhân | - | [x] |
| P2 | AI Disclosure - khai báo việc dùng AI | [`appendix/AI-Audit-Report.md`](appendix/AI-Audit-Report.md) mục "Khai báo" | [x] |
| P3 | Text-Based Formats - Markdown được khuyến khích | toàn bộ tài liệu là `.md` | [x] |
| P4 | **PDF Copies** - nộp kèm bản "Save-As-PDF" của **những file đó** | 8 file, xem mục C | [ ] |
| P5 | Submission file name - `StudentID_ExerciseID_SelfAssessedGrade.zip` | đề §14:145 nói cụ thể hơn -> theo đề: `23127262_HW04_AI_Automation_100.zip` | [ ] khi đóng gói |
| P6 | Git Usage - quản lý lịch sử bằng Git | 18 commit | [x] |
| P7 | Commit Messages - **mỗi bước trong mỗi yêu cầu** một commit rõ ràng | Conventional Commits, quy ước ở [`appendix/Git-Commit-Log.md`](appendix/Git-Commit-Log.md) | [x] |
| P8 | Submit the git commit logs | [`appendix/git-log.txt`](appendix/git-log.txt) | [~] |
| P9 | Work Allocation / Task Complexity - không trùng việc trong nhóm, không chọn việc quá dễ | trùng A5.3 - dành cho bài project theo nhóm | - |
| P10 | Peer Reviews - cross-review trong nhóm | dành cho bài project; HW04 là bài cá nhân | - |
| P11 | Self-Assessment - tự chấm theo rubric | [`README.md`](README.md) mục Self-Assessment - 100/100 kèm căn cứ | [x] |
| P12 | File Restrictions - Moodle tối đa **20 file**, mỗi file **<= 20 MB**, dùng split-and-zip | zip ~45 MB -> chia 3 phần ~15 MB | [ ] khi đóng gói |
| P13 | **Online Links Policy** - lạm dụng link online -> **0 điểm** | mọi file thật đều nằm trong zip; link chỉ bổ sung | [x] |
| P14 | Strict Compliance - vi phạm quy định nộp bài -> 0 điểm | - | - |

---

## C. Chín file cần xuất PDF

Đề (§14:149, §14:153) gọi tên ba file đầu. Sáu file còn lại theo Policies P4 - *"those files"* = mọi file Markdown nộp kèm. Xuất thiếu là rủi ro §17:182.

| # | File | Bắt buộc bởi |
|---|---|---|
| 1 | `report/Main-Report.md` | §14:149 |
| 2 | `appendix/AI-Critique.md` | §14:153 |
| 3 | `appendix/AI-Audit-Report.md` | §14:153 |
| 4 | `report/Bug-Report.md` | P4 |
| 5 | `report/AI-Review-Fix-Log.md` | P4 |
| 6 | `report/Not-Automated.md` | P4 |
| 7 | `appendix/Git-Commit-Log.md` | P4 |
| 8 | `appendix/AI-Prompt-Log.md` | P4 |
| 9 | `README.md` | P4 |

File này (`CHECKLIST.md`) là công cụ đối chiếu nội bộ, không nằm trong danh sách bắt buộc - xuất PDF cũng được, không xuất cũng không sao.

> PDF bị `.gitignore` bỏ qua (`submission/**/*.pdf`) vì sinh lại được từ `.md`. Chúng vẫn **phải có trong zip**.

---

## D. Ba link

| Link | Giá trị |
|---|---|
| Repo bài làm (public) | https://github.com/dinosauce-285/HW04-Software-Testing |
| Video Task 2 (unlisted, >= 5 phút) | https://youtu.be/Vh_Qu7MG8tc |
| Video Agent Skill (unlisted) | https://youtu.be/GsoKs7q_q4M |

Có link -> điền vào **4 chỗ**: file này / [`README.md`](README.md) / `../CLAUDE.md` §1 / mục Task 2 của [`report/Main-Report.md`](report/Main-Report.md).

---

## E. Cấu trúc zip

```
23127262_HW04_AI_Automation_100/
|-- submission/           nguyên thư mục này, kèm 9 file .pdf
|-- .claude/skills/       Agent Skill - §7:96 bắt nộp, 10 điểm
|-- tools/                extract-ai-audit.mjs - §9:119
|-- playwright.config.ts  cấu hình 3 browser + stamp "Run by"
\-- package.json          khai dependency để chạy lại được
```

**Bốn thứ ở gốc không chuyển vào `submission/` - đều là ngoại lệ kỹ thuật có chủ đích, không phải bỏ sót:**

| Ở gốc | Vì sao không dời | Vẫn phải vào zip |
|---|---|---|
| `.claude/skills/` | Claude Code chỉ nạp skill từ đúng đường dẫn này; dời đi là skill hết hoạt động, video demo không quay được | [x] §7:96 |
| `tools/` | script sinh AI Audit, chạy từ gốc repo | [x] §9:119 |
| `playwright.config.ts` | Playwright phân giải `testDir` và `outputFolder` theo vị trí config; dời đi là 9 report lệch đường dẫn | [x] |
| `package.json` | npm cần nó ở gốc để `npm install` chạy được | [x] |

Không đưa vào zip: `sut/` (mã nguồn SUT, không phải sản phẩm của mình) / `survey/` (khảo sát nội bộ) / `artifacts/` (trang hỗ trợ làm bài) / `docs/` (đề bài gốc) / `node_modules/`.

---

## F. Kết luận - còn thiếu thật sự

**Ba việc chưa xong, theo thứ tự phụ thuộc:**

| # | Việc | Điều khoản | Chặn bởi |
|---|---|---|---|
| 1 | Sinh lại AI Prompt Log sau phiên AI cuối | A2.3 / A9.2 | mọi việc dùng AI đã xong |
| 2 | Xuất lại `git-log.txt` sau commit cuối | A12.3 / A14.8 / P8 | mọi commit đã xong |
| 3 | Xuất 9 PDF, rồi zip và chia 3 phần <= 20 MB | P4 / P12 / A14.1 | mọi `.md` đã chốt |

Hai video đã xong: Task 2 và Agent Skill. Link ở mục D.

**Một điều khoản không thể đạt:**

**A12.2** - đề đòi >= 8 commit chạm file test, trải >= 4 ngày. Thực tế 6 commit chạm `.spec.ts`, tất cả trong ngày 04/08/2026. Không sửa được bằng cách nào hợp lệ: đổi ngày commit là làm giả bằng chứng, và §11 nói rõ TA kiểm tra trực tiếp phần bằng chứng thực thi. Ghi nhận đúng thực trạng thay vì che.

**Một điều khoản sát ngưỡng:**

**A10.1** - AI Critique 299 chữ, trần là 300. Thêm một câu nữa là vượt.
