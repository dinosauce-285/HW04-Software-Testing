# HW04 — Automation Testing (EShop)

**Sinh viên:** Lý Quốc Thạnh — `23127262` · **Môn:** Kiểm thử phần mềm 2026

Toàn bộ bài nộp nằm trong một thư mục duy nhất: **[`submission/`](submission/)**

| Cần gì | Vào đây |
|---|---|
| Test summary, self-assessment, cây thư mục | [`submission/README.md`](submission/README.md) |
| Đối chiếu từng điều khoản đề + policy → file nào | [`submission/CHECKLIST.md`](submission/CHECKLIST.md) |
| Báo cáo chính | [`submission/report/Main-Report.md`](submission/report/Main-Report.md) |
| Script automation · dữ liệu CSV · HTML report | [`submission/tests/`](submission/tests/) · [`submission/data/`](submission/data/) · [`submission/reports/`](submission/reports/) |

## Chạy lại bộ test

Cần EShop chạy local trước — xem [`submission/report/Main-Report.md`](submission/report/Main-Report.md) mục 2.

```bash
npm install
FEATURE=fr09-coupon BROWSER=chromium npx playwright test --project=chromium
```

Report sinh ra ở `submission/reports/<feature>-<browser>-<ISO-timestamp>/`.
**Không** thêm cờ `--reporter` — nó đè cấu hình và lượt chạy sẽ không sinh report nào.

---

File này chỉ là trang chủ repo. Mọi nội dung được chấm điểm nằm trong [`submission/`](submission/).
