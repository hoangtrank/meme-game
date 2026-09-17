# Đo lường workflow

Trả lời câu hỏi "workflow này đã tối ưu và hợp với tôi chưa?" bằng số, không bằng cảm giác. Ghi một dòng sau mỗi lần chạy. Sau 3 lần chạy thì xem bảng tinh chỉnh.

## Mỗi lần chạy

| Lần | Task | Ngày | Số lần bạn bị hỏi | Trong đó hỏi thừa | Số lần bạn phải sửa tay | Blocker B1/B2/B3/B4/B5/B0 | Vòng rubric đến khi đạt | Spike đã chạy / giả định bị bác bỏ sau đó | Lỗi phát hiện sau 2 tuần | Thời gian từ research đến goal | Token | Bạn chấm 1 đến 5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | / / / / / | | / | | | | |

## Mục tiêu sau giai đoạn hiệu chỉnh

Điền sau 3 lần chạy đầu. Đây là ngưỡng bạn chấp nhận, không phải lý tưởng.

| Chỉ số | Mục tiêu | Vì sao |
|---|---|---|
| Hỏi thừa mỗi lần chạy | | |
| Blocker B0 mỗi lần chạy | 0 | B0 nghĩa là research bỏ sót thứ không ai lường |
| Giả định bị bác bỏ sau khi đã spike | 0 | spike sai nghĩa là spike chưa giống thật |
| Vòng rubric đến khi đạt | | |
| Lỗi sau 2 tuần | | |

## Bảng tinh chỉnh

Triệu chứng nào thì vặn nút nào. Sửa đúng một nút mỗi lần rồi chạy lại để biết nút đó có tác dụng không.

| Triệu chứng | Nguyên nhân thường gặp | Nút cần vặn |
|---|---|---|
| Nhiều B2, giả định sai không được bắt sớm | thiếu góc nhìn research hoặc ngưỡng spike quá cao | thêm góc nhìn vào `angles` khi chạy research, hạ ngưỡng tin cậy bắt buộc spike trong assumptions.md |
| Nhiều B0 | checklist research thiếu loại rủi ro đó | thêm vào `lessons.md` của skill, researcher đọc ở đầu mỗi lần |
| Bạn bị hỏi thừa | bảng "khi nào hỏi tôi" trong preferences.md quá chặt | nới bảng đó, không sửa prompt agent |
| Bạn phải sửa tay nhiều | preferences.md hoặc project-profile.md thiếu quy tắc | thêm quy tắc, ghi rõ ví dụ |
| Vòng rubric cao, grader chấm lắc | tiêu chí không đo được | viết lại tiêu chí theo dạng cách đo và ngưỡng |
| Research lâu mà ít phát hiện mới | góc nhìn trùng nhau | bớt góc nhìn, hoặc dùng loop-until-dry |
| Lỗi sau phát hành | rubric khách hàng thiếu kịch bản | thêm kịch bản chấp nhận và e2e tương ứng |
| Agent chọn công nghệ bạn không thích | ràng buộc cứng chưa ghi | ghi vào project-profile.md mục 3 |
| Spike xác nhận nhưng lúc làm thật vẫn đổ | spike không giống môi trường thật | brief spike phải nêu rõ môi trường, dữ liệu thật |

## Giao thức hiệu chỉnh

1. Chọn 3 task thật của dự án này, nhỏ, vừa, lớn.
2. Trước khi chạy, tự ước lượng bạn sẽ làm mất bao lâu và gặp vấn đề gì.
3. Chạy trọn workflow từng task, không can thiệp ngoài các gate.
4. Điền bảng "mỗi lần chạy" và so với ước lượng của bạn.
5. Sau 3 lần, chọn đúng một nút trong bảng tinh chỉnh, sửa, tag git, chạy lại task số 2.
6. Chỉ số cải thiện thì giữ, không thì revert tag. Lặp lại.

Khi nào workflow được coi là "hợp với bạn": ba lần chạy liên tiếp không có B0, số lần hỏi thừa bằng 0, và bạn chấm từ 4 trở lên.
