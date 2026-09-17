# Spike

Mỗi spike là một thư mục `workflow/spikes/<assumption-id>/` do developer tạo ở pha RESEARCH để chứng minh hoặc bác bỏ một giả định rủi ro cao.

Quy tắc:

- Spike trả lời đúng một câu hỏi, không hơn.
- Phải chạy được bằng một lệnh ghi trong `README.md` của spike.
- Kết quả ghi vào `RESULT.md`: xác nhận, bác bỏ, hoặc chưa kết luận, kèm output thật.
- Spike phải giống môi trường thật ở đúng chiều đang kiểm: cùng phiên bản thư viện, cùng loại dữ liệu, cùng nền tảng. Spike trên môi trường khác thì kết quả không được tính.
- Code spike không được copy vào sản phẩm. Developer viết lại ở pha DELIVER.
