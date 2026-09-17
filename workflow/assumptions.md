# Sổ giả định

Đây là file quan trọng nhất của workflow. Mọi kết luận nghiên cứu phải thành một dòng ở đây. Mọi blocker phải truy vết về một dòng ở đây, hoặc bị ghi là "research bỏ sót".

Quy tắc:

- Rủi ro CAO và tin cậy dưới 0.8 thì bắt buộc spike trước Gate 1.
- Bằng chứng phải là link, file, hoặc kết quả chạy thật. "Tôi nghĩ vậy" không phải bằng chứng.
- Không xoá dòng. Giả định bị bác bỏ thì đổi trạng thái và ghi hậu quả.
- ID theo dạng A-001, tăng dần, không tái sử dụng.

| ID | Giả định | Nếu sai thì sao | Rủi ro | Tin cậy | Bằng chứng | Cách kiểm chứng | Trạng thái | Nguồn |
|---|---|---|---|---|---|---|---|---|
| A-000 | (ví dụ) Thư viện X hỗ trợ tính năng Y trên nền tảng Z | Phải đổi thư viện, mất 2 ngày | CAO | 0.6 | link docs | spike 1 giờ | mở | researcher:kỹ thuật |

Trạng thái: mở, đã spike, xác nhận, bác bỏ, không còn liên quan.
Rủi ro: CAO, VỪA, THẤP.
