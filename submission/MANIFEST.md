# MANIFEST — nội dung bài nộp

**Sinh viên:** Lý Quốc Thạnh — `23127262` · **Bài:** HW04 — AI Automation Testing
**File nộp:** `23127262_HW04_AI_Automation_100.zip`

File này đối chiếu từng mục bắt buộc của đề (§14:148-157) và Policies với đường dẫn thật trong repo. Đây là **chỉ mục**, không lặp lại nội dung — số liệu tổng hợp nằm ở [`../README.md`](../README.md), diễn giải nằm ở [`report/Main-Report.md`](report/Main-Report.md).

---

## 1. Chín mục bắt buộc của §14

| # | Đề yêu cầu | File thật | Trạng thái |
|---|---|---|---|
| 1 | Main report (Markdown **+ PDF**) | [`report/Main-Report.md`](report/Main-Report.md) | ✅ md · ☐ pdf |
| 2 | Link repo GitHub công khai | mục 4 dưới đây · [`../README.md`](../README.md) | ✅ |
| 3 | HTML report đa trình duyệt | [`../reports/`](../reports/) — 9 thư mục | ✅ 9/9 |
| 4 | Link video YouTube unlisted | mục 4 dưới đây | ☐ chờ quay |
| 5 | AI Critique (md **+ PDF**) | [`appendix/AI-Critique.md`](appendix/AI-Critique.md) | ✅ md · ☐ pdf |
| 5 | AI Audit Report (md **+ PDF**) | [`appendix/AI-Audit-Report.md`](appendix/AI-Audit-Report.md) | ✅ md · ☐ pdf |
| 6 | Git commit log (file text) | [`appendix/git-log.txt`](appendix/git-log.txt) | ◐ cần xuất lại trước khi zip |
| 7 | Bug report + ảnh trang GitHub Issues | [`report/Bug-Report.md`](report/Bug-Report.md) · [`evidence/bugs/`](evidence/bugs/) 16 ảnh · [`evidence/issues/`](evidence/issues/) 4 ảnh | ✅ |
| 8 | `README.md` — bảng tự đánh giá + test summary | [`../README.md`](../README.md) | ✅ |
| 9 | Tài liệu hỗ trợ khác | [`report/AI-Review-Fix-Log.md`](report/AI-Review-Fix-Log.md) · [`report/Not-Automated.md`](report/Not-Automated.md) · [`appendix/Git-Commit-Log.md`](appendix/Git-Commit-Log.md) | ✅ |

Hai mục **nằm ngoài thư mục này** vì lý do kỹ thuật, không phải bỏ sót:

- `../README.md` — GitHub bắt README phải ở gốc repo mới hiển thị trên trang chủ repo.
- `../reports/` — `playwright.config.ts:18` ghi report vào `reports/` ở gốc; đổi đường dẫn sẽ làm 9 thư mục hiện có lệch với mô tả trong báo cáo chính.

---

## 2. Policies — ràng buộc đóng gói

| Quy định | Nội dung | Trạng thái |
|---|---|---|
| Tên file | `StudentID_ExerciseID_SelfAssessedGrade.zip`, grade 3 chữ số | `23127262_HW04_AI_Automation_100.zip` ✅ |
| Bản PDF | *"must also submit a Save-As-PDF version of those files"* — mọi file `.md` nộp kèm | ☐ 8 file, xem mục 3 |
| Giới hạn Moodle | tối đa **20 file**, mỗi file **≤ 20 MB** | ☐ zip ~45 MB → chia 3 phần ~15 MB |
| Git | repo công khai, commit log nộp kèm | ✅ |
| Link online | *"Misuse or over-reliance on online links… will result in a score of zero"* | file thật đều nằm trong zip; link chỉ để bổ sung ✅ |

---

## 3. Danh sách file cần xuất PDF

Tám file. Đề chỉ gọi tên ba file đầu, năm file còn lại theo Policies (*"those files"* = mọi file Markdown nộp kèm).

| # | File | Nguồn ràng buộc |
|---|---|---|
| 1 | `report/Main-Report.md` | §14:149 |
| 2 | `appendix/AI-Critique.md` | §14:153 |
| 3 | `appendix/AI-Audit-Report.md` | §14:153 |
| 4 | `report/Bug-Report.md` | Policies — PDF Copies |
| 5 | `report/AI-Review-Fix-Log.md` | Policies — PDF Copies |
| 6 | `report/Not-Automated.md` | Policies — PDF Copies |
| 7 | `appendix/Git-Commit-Log.md` | Policies — PDF Copies |
| 8 | `../README.md` | Policies — PDF Copies |

> PDF được `.gitignore` bỏ qua (`submission/**/*.pdf`) — sinh lại được từ `.md`, không cần vào lịch sử git. Chúng vẫn **phải nằm trong zip**.

---

## 4. Ba link

| Link | Giá trị |
|---|---|
| Repo bài làm (public) | https://github.com/dinosauce-285/HW04-Software-Testing |
| Video Task 2 (unlisted, ≥5 phút) | `<điền>` |
| Video Agent Skill (unlisted) | `<điền>` |

Khi có link → điền vào file này, [`../README.md`](../README.md), [`../CLAUDE.md`](../CLAUDE.md) và mục Task 2 của [`report/Main-Report.md`](report/Main-Report.md). Bốn chỗ phải khớp nhau (R11).

---

## 5. Cấu trúc zip đề xuất

```
23127262_HW04_AI_Automation_100/
├── README.md            + README.pdf
├── submission/          toàn bộ thư mục này, kèm 7 file .pdf
├── reports/             9 thư mục HTML report
├── tests/               script automation
├── data/                7 file .csv
└── playwright.config.ts
```

Bỏ ra ngoài: `sut/` (mã nguồn SUT, không phải sản phẩm của mình) · `survey/` (khảo sát nội bộ) · `artifacts/` (trang HTML hỗ trợ làm bài) · `node_modules/` · `docs/` (đề bài gốc).

---

## 6. Còn thiếu trước khi đóng gói

| # | Việc | Chặn bởi |
|---|---|---|
| 1 | Quay video Task 2 và video Agent Skill | — |
| 2 | Viết mục Task 2 + Agent Skill vào `report/Main-Report.md` | có link |
| 3 | Điền 2 link vào 4 file, lật ☐ → ✅ ở README | có link |
| 4 | Xuất lại `appendix/git-log.txt` sau commit cuối cùng | mọi commit đã xong |
| 5 | Xuất 8 file PDF | mọi `.md` đã chốt |
| 6 | Zip và chia 3 phần ≤ 20 MB | tất cả các mục trên |

Thứ tự trên là bắt buộc: đảo mục 5 lên trước mục 3 thì PDF sẽ thiếu link video.
