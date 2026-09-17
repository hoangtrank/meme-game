---
name: project-workflow
---

# Quy tắc project-workflow

Dự án này chạy theo skill `project-workflow`. Trạng thái nằm ở `workflow/STATE.md`, hook SessionStart in ra đầu mỗi phiên.

- Trước khi nhận việc mới: xem pha hiện tại và cổng đang chờ trong STATE.md. Có cổng chờ khách hàng thì nhắc lại câu hỏi, không tự tiếp tục.
- Mọi kết luận nghiên cứu là một dòng trong `workflow/assumptions.md`. Mọi blocker là một dòng trong `workflow/blockers.md` với loại B0 đến B5.
- Không sửa `workflow/rubric-customer.md` trong lúc DELIVER. Không skip test để xanh. Không deploy production khi chưa có "có" rõ ràng trong phiên hiện tại.
- Gặp tình huống không có trong skill: dừng và hỏi khách hàng, không đoán.
- Báo cáo cho khách hàng bằng tiếng Việt, ngôn ngữ goal và trải nghiệm, ngắn. Kỹ thuật chỉ khi được hỏi.
