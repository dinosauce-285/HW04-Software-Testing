# Git Commit Log - HW04

*(đề HW04 mục 12 / Policies - "Version Control Requirements")*

**Repo:** https://github.com/dinosauce-285/HW04-Software-Testing

Log đầy đủ ở [`git-log.txt`](git-log.txt) - đó là file text mà mục 14:154 yêu cầu. File này giải thích quy ước và ghi số liệu đối chiếu.

## Ràng buộc của đề

> *"at least **8 commits** over at least **4 days**. Only commits that change test-script files (`.spec.js`, `.spec.ts`, or equivalent) count toward the 8-commit minimum; commits touching only the README, PDF, or other non-test documents do not count."* (mục 12:136)

## Số liệu thực tế

Đếm bằng lệnh, tính đến lần xuất `git-log.txt` cuối cùng.

| Chỉ số | Lệnh | Thực tế | Cần đạt | |
|---|---|---|---|---|
| Commit đụng `.spec.*` | `git log --oneline --diff-filter=ACMR -- '*.spec.ts' '*.spec.js' \| wc -l` | **8** | >= 8 | [x] |
| Số ngày riêng biệt | `git log --format=%ad --date=short --diff-filter=ACMR -- '*.spec.ts' '*.spec.js' \| sort -u \| wc -l` | **2** | >= 4 | [!] |
| Tổng commit toàn repo | `git rev-list --count HEAD` | **31** | - | - |

### Tám commit đụng file test

| Ngày | Commit |
|---|---|
| 04/08/2026 | `test(featC): add 15 data-driven cases for category management` |
| 04/08/2026 | `test(featA): add 16 data-driven cases for account registration` |
| 04/08/2026 | `test(featB): add 19 data-driven cases for discount coupon` |
| 04/08/2026 | `chore(report): capture bug evidence screenshots for github issues` |
| 04/08/2026 | `docs(report): write main report and capture github issues evidence` |
| 04/08/2026 | `chore(repo): rename deliverables to submission and add manifest of required contents` |
| 04/08/2026 | `chore(repo): consolidate every deliverable under submission and map each requirement to its file` |
| 06/08/2026 | `docs(repo): replace non-ascii symbols with plain keyboard characters` |

**Ngưỡng 8 commit: đạt. Ngưỡng 4 ngày: không đạt** - công việc dồn trong hai ngày 04/08 và 06/08. Ghi nhận đúng thực trạng; sửa ngày commit là làm giả bằng chứng, mà mục 11 nói rõ TA kiểm tra trực tiếp phần bằng chứng thực thi.

## Quy ước commit message

Conventional Commits, viết bằng tiếng Anh, **không** kèm trailer `Co-Authored-By` - bài nộp đứng tên sinh viên, việc dùng AI đã khai ở [`AI-Audit-Report.md`](AI-Audit-Report.md).

```
<type>(<scope>): <mô tả ngắn, thức mệnh lệnh, không viết hoa đầu, không dấu chấm cuối>
```

- `type` thuộc: `feat` / `fix` / `docs` / `chore` / `refactor` / `test`
- `scope` thuộc: `featA` / `featB` / `featC` / `data` / `config` / `report` / `skill` / `appendix` / `repo`

Ví dụ có thật trong lịch sử:

```
test(featA): add 16 data-driven cases for account registration
feat(config): add REPORT_ROOT so trial runs do not pollute the submitted reports
docs(appendix): restructure ai audit report to the faculty template and split the prompt log
```

Quy ước này đáp ứng Policies - *"For every step within a requirement, students must create a clear and explicit Git commit message"*: mỗi bước có nghĩa là một commit riêng, `scope` chỉ rõ bước đó thuộc phần nào của bài.

## Cách xuất lại log

```bash
git log --pretty=format:'%h | %ad | %s' --date=iso > submission/appendix/git-log.txt
```

Chạy sau commit cuối cùng. Commit tạo ra bởi chính lần xuất này sẽ không nằm trong file - điều đó là bình thường và không tránh được.
