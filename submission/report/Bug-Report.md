# Bug Report - EShop

*(CLAUDE.md R6 / đề HW04 §6:85 - bug phải có mặt ở **cả** file này **và** GitHub Issues, mỗi issue kèm screenshot)*

**18 bug** - số dòng trong bảng khớp đúng 18 issue trên https://github.com/dinosauce-285/HW04-Software-Testing/issues (kiểm 04/08/2026).

Mức nghiêm trọng: `Critical` / `Major` / `Minor` / `Trivial`

| ID | Feature | Tiêu đề | Mức | Test case phát hiện | Screenshot | GitHub Issue |
|---|---|---|---|---|---|---|
| A01 | FR-01 | Quy tắc mật khẩu mâu thuẫn với chính gợi ý hiển thị cho người dùng | Critical | TC01, TC02, TC08 | [`A01-mat-khau-mau-thuan.png`](../evidence/bugs/A01-mat-khau-mau-thuan.png) | [#1](https://github.com/dinosauce-285/HW04-Software-Testing/issues/1) |
| A02 | FR-01 | Ô Email dùng type=text nên không kiểm tra định dạng email | Minor | TC09, TC10 | [`A02-email-khong-hop-le.png`](../evidence/bugs/A02-email-khong-hop-le.png) | [#2](https://github.com/dinosauce-285/HW04-Software-Testing/issues/2) |
| A03 | FR-01 | API đăng ký không kiểm tra dữ liệu đầu vào | Major | TC14 | [`A03-TC14-report.png`](../evidence/bugs/A03-TC14-report.png) | [#3](https://github.com/dinosauce-285/HW04-Software-Testing/issues/3) |
| A04 | FR-01 | Đăng ký trùng email vẫn thành công, tạo tài khoản trùng lặp | Critical | TC13, TC16 | [`A04-trung-email.png`](../evidence/bugs/A04-trung-email.png) | [#4](https://github.com/dinosauce-285/HW04-Software-Testing/issues/4) |
| A06 | FR-01 | Mật khẩu lưu dạng plaintext và bị trả về trong response đăng nhập | Critical | TC15 | [`A06-TC15-report.png`](../evidence/bugs/A06-TC15-report.png) | [#5](https://github.com/dinosauce-285/HW04-Software-Testing/issues/5) |
| B01 | FR-09 | Mã giảm giá phần trăm làm đơn hàng ĐẮT LÊN gấp 10 lần | Critical | TC03, TC10 | [`B01-giam-gia-phan-tram-sai.png`](../evidence/bugs/B01-giam-gia-phan-tram-sai.png) | [#6](https://github.com/dinosauce-285/HW04-Software-Testing/issues/6) |
| B02 | FR-09 | Lỗi biên: đơn hàng đúng bằng mức tối thiểu bị từ chối áp mã | Major | TC04, TC05 | [`B02-loi-bien-muc-toi-thieu.png`](../evidence/bugs/B02-loi-bien-muc-toi-thieu.png) | [#7](https://github.com/dinosauce-285/HW04-Software-Testing/issues/7) |
| B03 | FR-09 | Endpoint áp mã giảm giá không yêu cầu đăng nhập | Major | TC13 | [`B03-TC13-report.png`](../evidence/bugs/B03-TC13-report.png) | [#8](https://github.com/dinosauce-285/HW04-Software-Testing/issues/8) |
| B04 | FR-09 | Né được giới hạn lượt dùng mã bằng cách bỏ user_id | Critical | TC15 | [`B04-TC15-report.png`](../evidence/bugs/B04-TC15-report.png) | [#9](https://github.com/dinosauce-285/HW04-Software-Testing/issues/9) |
| B05 | FR-09 | Tổng tiền thanh toán là ô nhập, khách tự sửa được thành bao nhiêu tuỳ ý | Critical | TC17 | [`B05-tong-tien-sua-duoc.png`](../evidence/bugs/B05-tong-tien-sua-duoc.png) | [#10](https://github.com/dinosauce-285/HW04-Software-Testing/issues/10) |
| C01 | FR-14 | Thêm được danh mục với tên rỗng hoặc chỉ gồm khoảng trắng | Major | TC03, TC04 | [`C01-C02-C03-C08-danh-muc-khong-validate.png`](../evidence/bugs/C01-C02-C03-C08-danh-muc-khong-validate.png) | [#11](https://github.com/dinosauce-285/HW04-Software-Testing/issues/11) |
| C02 | FR-14 | Thêm được danh mục trùng tên với danh mục đã có | Major | TC05 | [`C01-C02-C03-C08-danh-muc-khong-validate.png`](../evidence/bugs/C01-C02-C03-C08-danh-muc-khong-validate.png) | [#12](https://github.com/dinosauce-285/HW04-Software-Testing/issues/12) |
| C03 | FR-14 | Tên danh mục không giới hạn độ dài và không lọc payload XSS / SQL injection | Major | TC06, TC07, TC09 | [`C01-C02-C03-C08-danh-muc-khong-validate.png`](../evidence/bugs/C01-C02-C03-C08-danh-muc-khong-validate.png) | [#13](https://github.com/dinosauce-285/HW04-Software-Testing/issues/13) |
| C04 | FR-14 | Xóa danh mục không có bước xác nhận, bấm nhầm là mất ngay | Minor | TC12 | [`C04-xoa-khong-xac-nhan.png`](../evidence/bugs/C04-xoa-khong-xac-nhan.png) | [#14](https://github.com/dinosauce-285/HW04-Software-Testing/issues/14) |
| C05 | FR-14 | Xóa được danh mục đang chứa sản phẩm, để lại sản phẩm mồ côi | Critical | TC11 | [`C05-TC11-report.png`](../evidence/bugs/C05-TC11-report.png) | [#15](https://github.com/dinosauce-285/HW04-Software-Testing/issues/15) |
| C06 | FR-14 | Tài khoản người dùng thường tạo và xóa được danh mục sản phẩm | Critical | TC14 | [`C06-TC14-report.png`](../evidence/bugs/C06-TC14-report.png) | [#16](https://github.com/dinosauce-285/HW04-Software-Testing/issues/16) |
| C08 | FR-14 | Tên danh mục không được cắt khoảng trắng thừa ở hai đầu | Minor | TC08 | [`C01-C02-C03-C08-danh-muc-khong-validate.png`](../evidence/bugs/C01-C02-C03-C08-danh-muc-khong-validate.png) | [#17](https://github.com/dinosauce-285/HW04-Software-Testing/issues/17) |
| C09 | FR-14 | Xóa danh mục có ID không tồn tại vẫn trả về 200 thành công | Minor | TC13 | [`C09-TC13-report.png`](../evidence/bugs/C09-TC13-report.png) | [#18](https://github.com/dinosauce-285/HW04-Software-Testing/issues/18) |

---

## Phát hiện từ khảo sát nhưng CHƯA đưa vào bảng chính

Ba mục dưới đây đã kiểm chứng thủ công qua `survey/survey.spec.ts` nhưng **chưa** có test case automation nào chỉ trực tiếp vào chúng, nên chưa tạo GitHub Issue - nguyên tắc: chỉ báo bug khi có assertion fail chứng minh.

| Mã | Feature | Tóm tắt | Vì sao chưa đưa lên |
|---|---|---|---|
| A05 | FR-01 | Không có ô xác nhận mật khẩu | Đề bài mô tả FR-01 chỉ gồm họ tên, email, mật khẩu - không có cơ sở đặc tả để coi là lỗi |
| B06 | FR-09 | Lượt dùng mã ghi bằng API call riêng sau checkout, chặn được | Đã phủ gián tiếp qua B04; tách riêng sẽ trùng lặp |
| C07 | FR-14 | API có `PUT /api/categories/:id` nhưng UI không có nút Sửa | Là thiếu sót chức năng, không phải lỗi hành vi - đã nêu trong báo cáo chính |

### Bảng ứng viên gốc

Chi tiết và bằng chứng: `survey/Survey-Report.md §2-§4`.

| Mã | Feature | Tóm tắt | Mức đề xuất |
|---|---|---|---|
| A01 | FR-01 | Regex mật khẩu đòi khoảng trắng và cấm ký tự đặc biệt, ngược với hint hiển thị ngay dưới ô nhập | Critical |
| A02 | FR-01 | Ô Email là `type="text"`, không validate định dạng | Minor |
| A03 | FR-01 | API nhận email sai định dạng và mật khẩu 1 ký tự | Major |
| A04 | FR-01 | Đăng ký trùng email được chấp nhận (`users.email` không UNIQUE) | Critical |
| A05 | FR-01 | Không có ô xác nhận mật khẩu | Minor |
| A06 | FR-01 | Mật khẩu lưu plaintext và trả về trong response đăng nhập | Critical |
| B01 | FR-09 | Công thức giảm giá phần trăm sai - đơn 500.000 VND áp mã "giảm 10%" thành 5.000.000 VND | Critical |
| B02 | FR-09 | Lỗi biên `>` thay vì `>=` ở `min_order_amount` | Major |
| B03 | FR-09 | `POST /api/apply-coupon` không yêu cầu token | Major |
| B04 | FR-09 | Gửi `user_id=null` là bỏ qua giới hạn lượt dùng | Critical |
| B05 | FR-09 | Tổng tiền thanh toán là input sửa được tự do ở trang Checkout | Critical |
| B06 | FR-09 | Lượt dùng mã ghi bằng API call riêng sau checkout, chặn được | Major |
| C01 | FR-14 | Thêm danh mục tên rỗng được chấp nhận | Major |
| C02 | FR-14 | Thêm danh mục trùng tên được chấp nhận | Major |
| C03 | FR-14 | Không lọc XSS, không giới hạn độ dài tên | Major |
| C04 | FR-14 | Xóa không có hộp thoại xác nhận | Minor |
| C05 | FR-14 | Xóa danh mục đang chứa sản phẩm, để lại sản phẩm mồ côi | Critical |
| C06 | FR-14 | User thường tạo/xóa được danh mục - `authenticateToken` không kiểm role | Critical |
| C07 | FR-14 | API có `PUT /api/categories/:id` nhưng UI không có nút Sửa | Minor |
| C08 | FR-14 | Tên danh mục không được cắt khoảng trắng thừa hai đầu - lưu `'  Sách và Văn phòng phẩm  '` nguyên văn. *Phát hiện thêm khi viết TC08, không có trong khảo sát ban đầu* | Minor |
| C09 | FR-14 | `DELETE /api/categories/:id` với ID không tồn tại trả `200 Category deleted` thay vì `404`. *Phát hiện thêm khi viết TC13* | Minor |

**Ngoài phạm vi 3 feature** (ghi nhận nhưng không đưa vào bug report chính): ô mật khẩu trang Login là `type="text"`; `setup_guide.md` ghi sai mật khẩu admin; doanh thu ở dashboard admin nhân đôi đơn `delivered`.
