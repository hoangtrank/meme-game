# meme-game

Repo này chứa hai thứ: dự án meme-game, và bộ quy trình nhiều agent `project-workflow` dùng để làm dự án đó. Phần quy trình được thiết kế để copy sang các dự án khác bằng `scripts/install-workflow.sh`.

## Trạng thái

- Dự án chưa có code. Pha hiện tại và việc cần làm nằm ở `workflow/STATE.md`, hook SessionStart in ra đầu mỗi phiên.
- Hồ sơ dự án và cách làm việc của khách hàng: `workflow/project-profile.md`, `workflow/preferences.md`. Chưa điền thì chưa được sang pha RESEARCH.

## Quy trình làm việc

Dự án này dùng skill `project-workflow`. Sổ tay vận hành đầy đủ ở `.claude/skills/project-workflow/SKILL.md`, quy tắc bắt buộc ở `.claude/rules/project-workflow.md`.

Câu lệnh khách hàng dùng:

- "chạy research cho: <bài toán>" chạy workflow `/research`
- "chốt phương án <X>" ghi quyết định và mở Gate 1
- "triển khai" chạy workflow `/deliver`
- "post-mortem" đóng task và cập nhật metrics
- "trạng thái workflow" đọc STATE.md

## Bố cục

- `.claude/agents/` bảy vai: researcher, red-team, architect, developer, qa, reviewer, customer-grader
- `.claude/workflows/` hai workflow đã lưu: `research.js`, `deliver.js`
- `.claude/skills/project-workflow/` sổ tay, template, và `lessons.md` xuyên dự án
- `workflow/` trạng thái riêng của dự án này, được commit
- `scripts/install-workflow.sh` cài quy trình vào repo khác hoặc vào `~/.claude`
