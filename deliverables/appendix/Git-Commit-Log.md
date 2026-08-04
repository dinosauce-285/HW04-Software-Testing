# Git Commit Log — HW04

*(CLAUDE.md R2, R3 · đề HW04 §12 · Policies — "Version Control Requirements")*

**Repo:** https://github.com/dinosauce-285/HW04-Software-Testing

## Ràng buộc của đề

> *"at least **8 commits** over at least **4 days**. Only commits that change test-script files (`.spec.js`, `.spec.ts`, or equivalent) count toward the 8-commit minimum; commits touching only the README, PDF, or other non-test documents do not count."* (§12:136)

**Ràng buộc thời gian, không phải khối lượng.** Dồn hết vào một ngày là hỏng dù code đủ.

## Bảng đếm

⚠️ Cập nhật sau mỗi lần commit. Đếm bằng lệnh, không tin trí nhớ.

| Chỉ số | Lệnh | Hiện tại | Cần đạt |
|---|---|---|---|
| Commit hợp lệ (đụng `.spec.*`) | `git log --oneline -- '*.spec.ts' '*.spec.js' \| wc -l` | 0 | ≥ 8 |
| Số ngày riêng biệt | `git log --format=%ad --date=short -- '*.spec.ts' '*.spec.js' \| sort -u \| wc -l` | 0 | ≥ 4 |

| Ngày | Số commit hợp lệ trong ngày | Nội dung |
|---|---|---|
| | | |

## Quy ước commit message

Conventional Commits, viết bằng tiếng Anh, **không** kèm trailer `Co-Authored-By`
(bài nộp đứng tên sinh viên; việc dùng AI khai ở `AI-Audit-Report.md`).

```
<type>(<scope>): <mô tả ngắn, thức mệnh lệnh, không viết hoa đầu, không dấu chấm cuối>
```

- `type` ∈ `feat` · `fix` · `docs` · `chore` · `refactor` · `test`
- `scope` ∈ `featA` · `featB` · `featC` · `data` · `config` · `report` · `skill` · `appendix` · `repo`

Ví dụ:
```
test(featA): add data-driven password validation cases for register
fix(featB): replace ambiguous bg-gray-50 selector in coupon panel
test(featC): cover empty and duplicate category name
```

## Log đầy đủ

Xuất trước khi nộp:
```bash
git log --pretty=format:'%h | %ad | %s' --date=iso > deliverables/appendix/git-log.txt
```

⚠️ Chưa xuất.
