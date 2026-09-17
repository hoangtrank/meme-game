# meme-game và project-workflow

Bộ quy trình nhiều agent cho Claude Code: khách hàng mô tả bài toán, agent nghiên cứu và tìm ẩn số, khách hàng chốt phương án, agent làm đến khi đạt goal, rồi cả hai rút bài học. Repo này vừa là dự án meme-game vừa là nơi phát triển bộ quy trình để dùng cho các dự án khác.

## Bắt đầu với dự án này

1. Mở Claude Code trong repo. Hook sẽ in `workflow/STATE.md`.
2. Trả lời các câu hỏi để điền `workflow/project-profile.md` và `workflow/preferences.md`. Có thể nói "bắt đầu intake" để Claude hỏi từng mục.
3. Nói: `chạy research cho: <bài toán đầu tiên>`.
4. Đọc phần 1 và 2 của `workflow/proposal.md`, trả lời câu hỏi ở phần 3, sửa `workflow/rubric-customer.md` theo ý bạn, rồi nói `chốt phương án <X>`.
5. Nói `triển khai`. Bạn chỉ bị hỏi khi gặp blocker loại B3, B4, hoặc trước khi deploy production.
6. Nghiệm thu bằng demo, rồi nói `post-mortem`.

## Cách quy trình xử lý vấn đề

| Chuyện gì xảy ra | Quy trình làm gì |
|---|---|
| Research bỏ sót thứ bạn chưa biết | Bốn red team độc lập tấn công đề xuất, giả định rủi ro cao phải có spike bằng code trước khi bạn chốt |
| Đang làm thì phát hiện giả định sai | Developer dừng, ghi blocker B2 với ID giả định, research mở lại đúng giả định đó, plan cập nhật, tiếp tục |
| Giải pháp không khả thi | Blocker B3, quay về Gate 1 với phương án dự phòng đã viết sẵn trong proposal |
| Tình huống không ai lường | Blocker B0, ghi vào `lessons.md` để lần sau researcher kiểm tra trước |
| Bạn chỉ quan tâm goal và trải nghiệm | Rubric khách hàng tách khỏi rubric kỹ thuật, customer-grader chấm mà không được đọc code hay plan |
| Tình huống không có trong sổ tay | Dừng và hỏi bạn, không đoán |

Chi tiết trong `.claude/skills/project-workflow/SKILL.md`.

## Áp dụng cho dự án khác

Ba cách, chọn một:

```bash
# 1. Copy vào một repo cụ thể. Không ghi đè file đã có, chạy lại an toàn.
scripts/install-workflow.sh /path/to/other-repo

# 2. Cài agents, skill, workflows vào ~/.claude để mọi project đều có.
#    Mỗi project vẫn chạy cách 1 để có workflow/ và rules riêng.
scripts/install-workflow.sh --user

# 3. Cài như plugin Claude Code từ GitHub, cập nhật tập trung.
/plugin marketplace add hoangtrank/meme-game
/plugin install project-workflow@hoangtrank-workflows
#    Hoặc từ thư mục local: claude --plugin-dir /path/to/meme-game
```

Cách 1 hợp khi bạn muốn chỉnh agent riêng cho từng dự án. Cách 3 hợp khi bạn muốn sửa một chỗ, mọi dự án nhận bản mới. Cách 2 ở giữa.

Phần dùng chung và phần riêng từng dự án được tách rõ:

| Dùng chung, copy nguyên | Riêng từng dự án, điền mới |
|---|---|
| `.claude/agents/*.md` | `workflow/project-profile.md` |
| `.claude/skills/project-workflow/` | `workflow/preferences.md` |
| `.claude/workflows/*.js` | `workflow/rubric-customer.md` |
| `.claude/rules/project-workflow.md` | `workflow/assumptions.md`, `blockers.md`, `decisions.md` |
| `lessons.md` trong skill | `workflow/metrics.md`, `postmortems/`, `evals/` |

## Làm sao biết quy trình đã hợp với bạn

Không đoán, đo. `workflow/metrics.md` có ba phần:

- Bảng ghi mỗi lần chạy: số lần bạn bị hỏi và bao nhiêu là thừa, số lần bạn phải sửa tay, blocker theo loại, số vòng rubric, lỗi sau hai tuần, điểm bạn tự chấm.
- Bảng tinh chỉnh: triệu chứng nào thì vặn nút nào. Mỗi lần chỉ vặn một nút rồi chạy lại.
- Giao thức hiệu chỉnh: ba task thật của dự án, nhỏ vừa lớn, so kết quả với ước lượng của chính bạn.

Quy trình được coi là hợp khi ba lần chạy liên tiếp không có B0, không có câu hỏi thừa, và bạn chấm từ 4 trên 5. Mỗi lần đổi prompt agent, chạy lại `workflow/evals/` để chắc không thoái lui.

## Bố cục

```
.claude/
  agents/            researcher, red-team, architect, developer, qa, reviewer, customer-grader
  workflows/         research.js, deliver.js
  skills/project-workflow/
    SKILL.md         sổ tay vận hành: máy trạng thái, cổng, định tuyến blocker
    lessons.md       bài học xuyên dự án
    templates/       mẫu cho mọi file trong workflow/
  rules/             quy tắc tự nạp mỗi phiên
  settings.json      permissions và hook SessionStart
.claude-plugin/      manifest để cài như plugin
scripts/install-workflow.sh
workflow/            trạng thái của dự án này
```

## Model và chi phí

Mọi agent để trống `model`, tức dùng model của phiên hiện tại. Muốn giảm chi phí thì thêm `model: sonnet` vào `researcher.md` và `qa.md` trước, đó là hai vai đọc nhiều, suy luận ít. Không hạ model của architect, red-team và customer-grader, đó là ba vai quyết định chất lượng.
