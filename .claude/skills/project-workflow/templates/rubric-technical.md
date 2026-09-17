# Rubric kỹ thuật

Định nghĩa "giải pháp tốt nhất" cho lần triển khai này. Architect viết ở pha Plan, reviewer chấm. Khách hàng không cần đọc.

Quy tắc: mỗi tiêu chí có cách đo và bằng chứng dạng file:line hoặc output lệnh.

## Kiến trúc

| # | Tiêu chí | Cách đo |
|---|---|---|
| T1 | Đúng phương án đã chốt ở Gate 1, không lệch âm thầm | so với proposal.md |
| T2 | Ranh giới module rõ, không phụ thuộc vòng | |

## Chất lượng code

| # | Tiêu chí | Cách đo |
|---|---|---|
| T3 | Lint và typecheck sạch | lệnh |
| T4 | Không có code chết, không TODO không có chủ | grep |

## Kiểm thử

| # | Tiêu chí | Cách đo |
|---|---|---|
| T5 | Mọi kịch bản chấp nhận có e2e tương ứng | đối chiếu rubric-customer |
| T6 | Test chạy xanh trong CI | |

## Bảo mật và dữ liệu

| # | Tiêu chí | Cách đo |
|---|---|---|
| T7 | Không secret trong code, input được validate | |

## Vận hành và chi phí

| # | Tiêu chí | Cách đo |
|---|---|---|
| T8 | Có log và cách quan sát lỗi ở production | |
| T9 | Chi phí hạ tầng trong ngân sách ở project-profile | |

## Bảo trì

| # | Tiêu chí | Cách đo |
|---|---|---|
| T10 | README hoặc docs đủ để người mới chạy được | |
