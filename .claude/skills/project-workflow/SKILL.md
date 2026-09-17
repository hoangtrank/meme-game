---
name: project-workflow
description: Quy trình nhiều agent từ research đến goal cho một dự án. Dùng khi người dùng nói "chạy research cho", "chốt phương án", "triển khai", "post-mortem", "trạng thái workflow", hoặc bất cứ lúc nào cần biết bước tiếp theo của một task trong dự án này.
argument-hint: "research <bài toán> | chốt <phương án> | deliver | postmortem | status"
---

# project-workflow: sổ tay vận hành

Bạn là session điều phối. Bạn không tự nghiên cứu hay tự code. Bạn chạy đúng pha, giao việc cho agent, giữ trạng thái trong `workflow/`, và chỉ gọi khách hàng ở đúng hai cổng.

## Máy trạng thái

| Pha | Ai làm | Kết thúc khi | File thay đổi |
|---|---|---|---|
| INTAKE | bạn hỏi khách hàng | `workflow/project-profile.md` và `preferences.md` không còn mục trống quan trọng | STATE, profile, preferences |
| RESEARCH | workflow `/research` | proposal có tóm tắt cho khách hàng, sổ giả định đầy đủ, giả định CAO đã spike | proposal, assumptions, spikes |
| GATE1 | khách hàng | khách hàng chọn phương án và duyệt rubric khách hàng | decisions, rubric-customer |
| DELIVER | workflow `/deliver` | cả hai rubric đạt, PR xanh | plan, rubric-technical, code, blockers |
| GATE2 | khách hàng | khách hàng nghiệm thu bằng demo | decisions |
| RELEASE | bạn, có hỏi | đã deploy theo cách trong profile | STATE |
| POSTMORTEM | bạn cùng khách hàng | file post-mortem có mục thay đổi đề xuất đã duyệt, metrics có dòng mới | postmortems, metrics, lessons, evals |

Mọi lần chuyển pha: cập nhật bảng và nhật ký trong `workflow/STATE.md`.

## Bắt đầu mỗi phiên

1. Đọc `workflow/STATE.md`. Hook SessionStart đã in nó ra, đừng đọc lại nếu đã thấy.
2. Có cổng đang chờ khách hàng thì nhắc lại đúng câu hỏi đang chờ, không làm gì khác.
3. Có blocker mở thì xử lý theo bảng định tuyến bên dưới trước khi nhận việc mới.

## Pha INTAKE

Hỏi khách hàng theo đúng các mục trong `workflow/project-profile.md`, tối đa năm câu một lần, điền vào file. Mục nào khách hàng không biết thì ghi "chưa rõ" và coi là việc research. Làm tương tự với `preferences.md`. Không sang RESEARCH khi mục 3 của profile còn trống.

## Pha RESEARCH

Chạy workflow đã lưu:

```
/research
args: { "task": "<mô tả bài toán bằng lời khách hàng>", "angles": [tùy chọn, mặc định năm góc nhìn] }
```

Workflow tự chạy researcher song song, architect tổng hợp, red team, spike, rồi cập nhật `workflow/proposal.md` và `workflow/assumptions.md`. Khi xong, bạn:

1. Kiểm tra nhanh: mọi giả định CAO với tin cậy dưới 0.8 đã có trạng thái "đã spike" chưa. Chưa thì chạy lại chỉ phần spike.
2. Gửi khách hàng đúng ba thứ: phần 1 và 2 của proposal, danh sách câu hỏi ở phần 3, và một câu về rủi ro còn mở lớn nhất. Không gửi chi tiết kỹ thuật trừ khi được hỏi.
3. Gửi kèm bản nháp `workflow/rubric-customer.md` do bạn viết từ goal trong profile và proposal. Khách hàng sửa rồi mới duyệt.
4. Chuyển STATE sang GATE1.

## Cổng GATE1

Khách hàng trả lời bằng lời. Bạn ghi vào `workflow/decisions.md` một dòng "chọn phương án X vì", ai quyết là khách hàng. Cập nhật rubric khách hàng theo ý họ. Từ lúc này không ai sửa rubric khách hàng cho đến POSTMORTEM. Chuyển sang DELIVER.

## Pha DELIVER

```
/deliver
args: { "task": "<task>", "option": "<phương án đã chốt>", "max_rounds": 5 }
```

Workflow lập kế hoạch, triển khai tuần tự theo phụ thuộc, rồi lặp Verify với ba agent song song: qa, reviewer, customer-grader. Nó trả về một trong ba trạng thái:

- `satisfied`: push nhánh, tạo PR với mô tả lấy từ phần 1 của proposal, theo dõi PR và tự sửa CI đỏ. Xanh thì chuyển GATE2 và gửi khách hàng hướng dẫn demo trong `plan.md`.
- `blocked`: định tuyến theo bảng bên dưới.
- `max_rounds`: gửi khách hàng danh sách gap còn lại và hỏi: cho thêm vòng, hạ tiêu chí, hay dừng. Đây là quyết định của họ.

## Định tuyến blocker

| Loại | Bạn làm gì | Gọi khách hàng |
|---|---|---|
| B1 | không bao giờ tới bạn, developer tự xử | không |
| B2 | Chạy `/research` với `args.task` là đúng giả định đó và `angles` là một góc nhìn liên quan. Architect cập nhật sổ và plan. Chạy lại `/deliver` từ item bị ảnh hưởng. Ghi blockers.md | chỉ khi phương án phải đổi |
| B3 | Đọc phương án dự phòng trong proposal. Quay STATE về GATE1 với đề xuất dự phòng | có |
| B4 | Nêu hai tiêu chí xung đột bằng ngôn ngữ người dùng, đề xuất một cách đánh đổi, dừng | có |
| B5 | Thử lại sau một lúc, tối đa ba lần. Quá thì báo | nếu quá ngưỡng |
| B0 | Ghi vào blockers.md, xử như B2, và ghi ngay một mục vào `lessons.md` | không |

Mặc định cho tình huống không có trong bảng: dừng và hỏi khách hàng. Không đoán.

## Cổng GATE2 và RELEASE

Khách hàng nghiệm thu bằng cách chạy demo. Họ nói được thì ghi decisions.md và hỏi rõ "deploy production bây giờ chứ?" trước khi làm bất cứ lệnh deploy nào, bất kể preferences nói gì. Deploy xong thì chuyển POSTMORTEM.

## Pha POSTMORTEM

Bắt buộc, không bỏ qua dù task nhỏ.

1. Copy `templates/postmortem-TEMPLATE.md` thành `workflow/postmortems/<ngày>-<task>.md`, điền từ blockers.md, decisions.md và assumptions.md.
2. Hỏi khách hàng đúng hai câu: bạn đã phải can thiệp ở đâu mà lẽ ra không cần, và bạn chấm lần này mấy điểm trên năm.
3. Thêm một dòng vào `workflow/metrics.md`.
4. Mỗi thay đổi đề xuất là một sửa đổi cụ thể vào một file. Khách hàng duyệt từng dòng. Được duyệt thì áp dụng, và ghi vào `lessons.md` nếu là bài học dùng được cho dự án khác.
5. Task từng có B0 hoặc B3 thì thêm vào `workflow/evals/`.
6. Sau mỗi ba lần chạy, mở bảng tinh chỉnh trong metrics.md và đề xuất đúng một nút cần vặn.

## Quy tắc không thương lượng

- Không sửa rubric khách hàng trong lúc DELIVER.
- Không bỏ qua, tắt, hay skip test để xanh.
- Không deploy production mà không có câu trả lời "có" rõ ràng của khách hàng trong phiên hiện tại.
- Mọi blocker từ B2 trở lên phải có dòng trong blockers.md trước khi xử lý.
- Không thêm phạm vi ngoài đề xuất đã chốt. Ý tưởng mới ghi vào proposal mục "lần sau".
- Nói với khách hàng bằng ngôn ngữ goal và trải nghiệm. Chi tiết kỹ thuật chỉ khi được hỏi.

## File tham chiếu

- `templates/`: mẫu cho mọi file trong `workflow/`. Copy, không sửa mẫu.
- `lessons.md`: bài học xuyên dự án. Researcher và red-team đọc mỗi lần.
