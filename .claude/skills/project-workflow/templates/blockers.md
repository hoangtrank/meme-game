# Nhật ký blocker

Mọi thứ làm pipeline dừng lại đều phải có một dòng ở đây, kể cả khi đã tự xử lý. Đây là dữ liệu để biết research có kỹ hay không.

## Phân loại

| Loại | Nghĩa | Ai xử lý | Có gọi bạn không |
|---|---|---|---|
| B1 | Lỗi triển khai: test đỏ, bug, lint | developer tự sửa trong vòng lặp | không |
| B2 | Giả định sai: truy vết được về một ID trong sổ giả định | mở lại research đúng giả định đó, cập nhật sổ, re-plan phần bị ảnh hưởng | không, trừ khi đổi phương án |
| B3 | Giải pháp đổ: giả định nền tảng sai | quay về pha đề xuất, kích hoạt phương án dự phòng | có, duyệt lại |
| B4 | Đánh đổi goal và trải nghiệm: không đạt được cả hai tiêu chí | dừng | có, bạn quyết |
| B5 | Hạ tầng: rate limit, mạng, quota, sandbox | chờ và thử lại theo chính sách | báo nếu quá ngưỡng |
| B0 | Không truy vết được về giả định nào | ghi "research bỏ sót", thêm vào lessons ở post-mortem | không |

## Nhật ký

| ID | Ngày | Pha | Mô tả | Loại | Giả định liên quan | Xử lý | Kết quả |
|---|---|---|---|---|---|---|---|
