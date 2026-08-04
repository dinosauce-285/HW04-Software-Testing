# HW04 — Automation Testing (EShop)

**Sinh viên:** Lý Quốc Thạnh — `23127262` · **Môn:** Kiểm thử phần mềm 2026
**Repo:** https://github.com/dinosauce-285/HW04-Software-Testing
**SUT:** EShop — https://github.com/ttbhanh/eshop-sut (chạy local, xem `CLAUDE.md §1`)

## Feature đã chọn

| Pool | FR | Tên | Màn hình |
|---|---|---|---|
| A | FR-01 | Đăng ký tài khoản | web `/register` |
| B | FR-09 | Mã giảm giá | web `/checkout` |
| C | FR-14 | Quản lý danh mục | admin, tab *Danh mục* |

## Test Summary

Cập nhật lần cuối: 04/08/2026 — **Task 1 hoàn tất**.

| Chỉ số | Giá trị |
|---|---|
| Số feature | 3 |
| Test case đã automate | **50** — FR-14: 15 · FR-01: 16 · FR-09: 19 |
| Test case đã chạy | 50 × 3 browser = **150** |
| Passed | 23 / browser — FR-14: 4 · FR-01: 7 · FR-09: 12 |
| Failed | 27 / browser — FR-14: 11 · FR-01: 9 · FR-09: 7. **Tất cả đều do bug thật, không có fail do script** |
| Test case không automate được | 0 |
| Số lượt chạy browser | **9 / 9** ✅ |
| Số bug báo cáo | **18** — đã tạo đủ 18 GitHub Issue kèm ảnh |
| Video demo Task 2 | ☐ chờ quay |
| Video demo Agent Skill | ☐ chờ quay |

## Trạng thái hạng mục

| # | Hạng mục | Nguồn | Trạng thái |
|---|---|---|---|
| 1 | Khảo sát SUT | `survey/Survey-Report.md` | ✅ 04/08/2026 |
| 2 | `playwright.config.ts` + stamp `Run by: 23127262` | R5 | ✅ đã kiểm bằng ảnh chụp report |
| 3 | FR-01 — ≥12 TC + data file | Task 1 | ✅ 16 TC · 3 CSV · 5 assertion pattern · 3 browser |
| 4 | FR-09 — ≥12 TC + data file | Task 1 | ✅ 19 TC · 2 CSV · 5 assertion pattern · 3 browser |
| 5 | FR-14 — ≥12 TC + data file | Task 1 | ✅ 15 TC · 2 CSV · 5 assertion pattern · 3 browser |
| 6 | 9 HTML report (3 feature × 3 browser) | §6:83 | ✅ 9/9 |
| 7 | Nhật ký review & fix AI | R4 | ✅ 5 mục + 4 mục khảo sát |
| 8 | Bug report + GitHub Issues | R6 | ✅ 18 bug · 18 issue · 16 ảnh bug + 4 ảnh trang Issues |
| 9 | Test case không automate được | R7 | ✅ 0 — automate được toàn bộ 50 TC |
| 10 | Báo cáo chính | §14:149 | ✅ 10 mục, ~3.600 từ |
| 11 | AI Audit Report | §9 | ✅ 21 lượt · sinh tự động từ transcript |
| 12 | AI Critique (200–300 chữ) | §10 | ✅ 297 chữ |
| 13 | Git commit log (text file) | §14:154 | ✅ `git-log.txt` |
| 14 | Video demo Task 2 (≥5 phút) | Task 2 | ☐ |
| 15 | Agent Skill + video demo | §7 | ◐ skill xong · video chờ quay |
| 16 | Xuất PDF toàn bộ `.md` | Policies | ☐ *(người dùng tự làm)* |
| 17 | Đóng gói `23127262_HW04_AI_Automation_<grade>.zip` | §14:145 | ☐ *(người dùng tự làm)* |

## Cây thư mục

```
hw04/
├── CLAUDE.md                  quy tắc làm việc xuyên suốt — đọc đầu mỗi phiên
├── README.md                  file này (bảng trạng thái + test summary)
├── playwright.config.ts       cấu hình 3 browser + stamp "Run by: 23127262"
│
├── docs/                      đề bài và chính sách môn học (chỉ đọc)
│
├── tests/                     ⭐ script automation
│   ├── fr01-register/         spec FR-01
│   ├── fr09-coupon/           spec FR-09
│   ├── fr14-category/         spec FR-14
│   ├── pages/                 page object, gom selector về một chỗ
│   └── fixtures/              đăng nhập, reset DB trước mỗi lần chạy
│
├── data/                      ⭐ test data .csv — cấm hardcode trong spec (R8)
│
├── reports/                   ⭐ HTML report, mỗi lượt chạy một thư mục riêng (R5)
│   └── <feature>-<browser>-<ISO-timestamp>/
│
├── deliverables/              ⭐ tài liệu nộp bài
│   ├── report/
│   │   ├── Main-Report.md         báo cáo chính
│   │   ├── AI-Review-Fix-Log.md   AI sai gì · sửa gì · vì sao trượt (R4)
│   │   ├── Bug-Report.md          bug + link GitHub Issue (R6)
│   │   └── Not-Automated.md       TC không automate được + lý do (R7)
│   ├── appendix/
│   │   ├── AI-Audit-Report.md     log mọi prompt (R1)
│   │   ├── AI-Critique.md         200–300 chữ (§10)
│   │   └── Git-Commit-Log.md      quy ước commit + log (R3)
│   └── evidence/
│       ├── bugs/                  screenshot đính vào GitHub Issue
│       └── runs/                  ảnh chụp lần chạy, dùng cho báo cáo
│
├── .claude/skills/            Agent Skill playwright-feature-suite (§7, 10 điểm)
├── tools/                     extract-ai-audit.mjs — sinh AI Audit Report từ transcript
├── survey/                    khảo sát SUT ban đầu — không phải bài nộp
└── sut/                       mã nguồn EShop (gitignore, không commit)
```

**Khi đóng gói nộp bài** (làm sau, không làm bây giờ): lấy `deliverables/` + `reports/` + `README.md` + `tests/` + `data/` + bản PDF; bỏ `sut/`, `survey/`, `node_modules/`.

## Self-Assessment

⚠️ Điền sau khi hoàn thành.

| No. | Tiêu chí | Điểm tối đa | Tự chấm |
|---|---|---|---|
| 1 | Task 1 — FR-01 Đăng ký | 25 | ☐ |
| 1 | Task 1 — FR-09 Mã giảm giá | 25 | ☐ |
| 1 | Task 1 — FR-14 Quản lý danh mục | 25 | ☐ |
| 2 | Task 2 — Video demo | 15 | ☐ |
| 3 | Agent Skill | 10 | ☐ |
| | **Tổng** | **100** | ☐ |
