# HW04 - Automation Testing (EShop)

**Sinh viên:** Lý Quốc Thạnh - `23127262` / **Môn:** Kiểm thử phần mềm 2026
**Repo:** https://github.com/dinosauce-285/HW04-Software-Testing
**SUT:** EShop - https://github.com/ttbhanh/eshop-sut (chạy local, xem `CLAUDE.md mục 1`)

## Feature đã chọn

| Pool | FR | Tên | Màn hình |
|---|---|---|---|
| A | FR-01 | Đăng ký tài khoản | web `/register` |
| B | FR-09 | Mã giảm giá | web `/checkout` |
| C | FR-14 | Quản lý danh mục | admin, tab *Danh mục* |

## Test Summary

Cập nhật lần cuối: 04/08/2026 - **Task 1 và Task 2 hoàn tất**.

| Chỉ số | Giá trị |
|---|---|
| Số feature | 3 |
| Test case đã automate | **50** - FR-14: 15 / FR-01: 16 / FR-09: 19 |
| Test case đã chạy | 50 x 3 browser = **150** |
| Passed | 23 / browser - FR-14: 4 / FR-01: 7 / FR-09: 12 |
| Failed | 27 / browser - FR-14: 11 / FR-01: 9 / FR-09: 7. **Tất cả đều do bug thật, không có fail do script** |
| Test case không automate được | 0 |
| Số lượt chạy browser | **9 / 9** [x] |
| Số bug báo cáo | **18** - đã tạo đủ 18 GitHub Issue kèm ảnh |
| Video demo Task 2 | [x] https://youtu.be/Vh_Qu7MG8tc |
| Video demo Agent Skill | [x] https://youtu.be/GsoKs7q_q4M |

## Trạng thái hạng mục

| # | Hạng mục | Nguồn | Trạng thái |
|---|---|---|---|
| 1 | Khảo sát SUT | `survey/Survey-Report.md` | [x] 04/08/2026 |
| 2 | `playwright.config.ts` + stamp `Run by: 23127262` | R5 | [x] đã kiểm bằng ảnh chụp report |
| 3 | FR-01 - >=12 TC + data file | Task 1 | [x] 16 TC / 3 CSV / 5 assertion pattern / 3 browser |
| 4 | FR-09 - >=12 TC + data file | Task 1 | [x] 19 TC / 2 CSV / 5 assertion pattern / 3 browser |
| 5 | FR-14 - >=12 TC + data file | Task 1 | [x] 15 TC / 2 CSV / 5 assertion pattern / 3 browser |
| 6 | 9 HTML report (3 feature x 3 browser) | mục 6:83 | [x] 9/9 |
| 7 | Nhật ký review & fix AI | R4 | [x] 5 mục + 4 mục khảo sát |
| 8 | Bug report + GitHub Issues | R6 | [x] 18 bug / 18 issue / 16 ảnh bug + 19 ảnh trang Issues |
| 9 | Test case không automate được | R7 | [x] 0 - automate được toàn bộ 50 TC |
| 10 | Báo cáo chính | mục 14:149 | [x] 12 mục, ~4.000 từ |
| 11 | AI Audit Report | mục 9 | [x] 95 lượt / sinh tự động từ transcript |
| 12 | AI Critique (200-300 chữ) | mục 10 | [x] 299 chữ |
| 13 | Git commit log (text file) | mục 14:154 | [x] `git-log.txt` |
| 14 | Video demo Task 2 (>=5 phút) | Task 2 | [x] https://youtu.be/Vh_Qu7MG8tc |
| 15 | Agent Skill + video demo | mục 7 | [x] skill + https://youtu.be/GsoKs7q_q4M |
| 16 | Xuất PDF toàn bộ `.md` | Policies | [ ] *(người dùng tự làm)* |
| 17 | Đóng gói `23127262_HW04_AI_Automation_<grade>.zip` | mục 14:145 | [ ] *(người dùng tự làm)* |

## Cây thư mục

```
hw04/
|-- README.md                  trỏ vào submission/ - trang chủ repo GitHub
|-- CLAUDE.md                  quy tắc làm việc xuyên suốt - đọc đầu mỗi phiên
|-- playwright.config.ts       cấu hình 3 browser + stamp "Run by: 23127262"
|-- package.json               khai devDependencies (@playwright/test, csv-parse)
|
|-- submission/                * TOÀN BỘ BÀI NỘP - nén thư mục này là đủ
|   |-- README.md              file này - test summary + self-assessment (mục 14:156)
|   |-- CHECKLIST.md           đối chiếu từng điều khoản đề + policy -> file (mục 14:148)
|   |
|   |-- report/
|   |   |-- Main-Report.md         báo cáo chính (mục 14:149)
|   |   |-- AI-Review-Fix-Log.md   AI sai gì / sửa gì / vì sao trượt (mục 6:84)
|   |   |-- Bug-Report.md          bug + link GitHub Issue (mục 6:85)
|   |   \-- Not-Automated.md       TC không automate được + lý do (mục 6:85)
|   |-- appendix/
|   |   |-- AI-Audit-Report.md     bảng audit theo mẫu của Khoa (mục 9)
|   |   |-- AI-Prompt-Log.md       21 lượt prompt nguyên văn (mục 9:114-117)
|   |   |-- AI-Critique.md         200-300 chữ (mục 10)
|   |   |-- Git-Commit-Log.md      quy ước commit + bảng đếm
|   |   \-- git-log.txt            commit log dạng text (mục 14:154)
|   |-- evidence/
|   |   |-- bugs/                  16 ảnh đính vào GitHub Issue
|   |   |-- issues/                19 ảnh trang GitHub Issues (mục 14:155)
|   |   \-- runs/                  ảnh chụp lần chạy
|   |
|   |-- tests/                 * script automation (mục 14:150)
|   |   |-- fr01-register/ / fr09-coupon/ / fr14-category/
|   |   |-- pages/                 page object, gom selector về một chỗ
|   |   |-- fixtures/              đọc CSV / tạo tài khoản / reset DB
|   |   \-- tools/                 script chụp bằng chứng bug, không phải test bài
|   |-- data/                  * 7 file .csv - cấm hardcode trong spec (mục 6:82)
|   \-- html-reports/          * 9 HTML report (mục 14:151)
|       \-- <feature>-<browser>-<ISO-timestamp>/
|
|-- docs/                      đề bài và chính sách môn học (chỉ đọc)
|-- artifacts/                 trang HTML hỗ trợ làm bài - không nộp
|-- .claude/skills/            Agent Skill playwright-feature-suite (mục 7)
|-- tools/                     extract-ai-audit.mjs - sinh AI Audit Report
|-- survey/                    khảo sát SUT ban đầu - không nộp
\-- sut/                       mã nguồn EShop (gitignore, không commit)
```


**Khi đóng gói nộp bài:** nén nguyên thư mục `submission/`, thêm 4 thứ ở gốc - `.claude/skills/` (Agent Skill, mục 7:96), `tools/`, `playwright.config.ts`, `package.json`. Bốn thứ này phải ở gốc mới chạy được, xem lý do ở [CHECKLIST.md](CHECKLIST.md) mục E.

## Self-Assessment

| No. | Tiêu chí | Điểm tối đa | Tự chấm | Căn cứ |
|---|---|---|---|---|
| 1 | Task 1 - FR-01 Đăng ký | 25 | **25** | 16 TC (>=12) / 3 file CSV / 5 assertion pattern / 3 browser / 3 report / 5 bug |
| 1 | Task 1 - FR-09 Mã giảm giá | 25 | **25** | 19 TC (>=12) / 2 file CSV / 5 assertion pattern / 3 browser / 3 report / 5 bug |
| 1 | Task 1 - FR-14 Quản lý danh mục | 25 | **25** | 15 TC (>=12) / 2 file CSV / 5 assertion pattern / 3 browser / 3 report / 8 bug |
| 2 | Task 2 - Video demo | 15 | **15** | >=5 phút, tiếng Việt, chạy end-to-end đa trình duyệt, kể lỗi đã sửa, có `whoami` + `hostname` |
| 3 | Agent Skill | 10 | **10** | `playwright-feature-suite` - 10 bước, 4 template, kèm video demo |
| | **Tổng** | **100** | **100** | |

### Vì sao tự chấm mức này

**Task 1 (75/75).** Cả ba feature đều vượt mọi ngưỡng bắt buộc của mục 6: 50 test case so với mức tối thiểu 36, 7 file dữ liệu CSV không còn giá trị nào viết cứng trong spec, 5 kiểu assertion mỗi feature so với yêu cầu 3, đủ 9 lượt chạy trên 3 trình duyệt với 9 HTML report mang nhãn `Run by: 23127262` kèm ISO timestamp.

Phần human review (mục 6:84) không dừng ở mức liệt kê: 5 lỗi script được phát hiện, sửa, và **truy nguyên nhân theo đúng ba nhóm mà đề yêu cầu**. Bốn trong năm lỗi thuộc loại test pass mà không kiểm chứng gì - loại khó phát hiện nhất vì không sinh tín hiệu lỗi nào.

18 bug đều có test case chỉ trực tiếp vào, đều đã lên GitHub Issues kèm ảnh chụp và nguyên nhân trỏ tới dòng mã cụ thể. Không test case nào phải bỏ.

**Task 2 (15/15).** Video đáp ứng đủ các điều kiện mục 6:89-91 và mục 11:132.

**Agent Skill (10/10).** Skill đúc từ quy trình đã dùng thật cho cả ba feature, kèm template chạy được và mục cảnh báo ba cái bẫy assertion - đều là lỗi có thật đã gặp trong bài, không phải hướng dẫn chung chung.
