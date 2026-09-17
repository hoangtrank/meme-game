# Bộ eval hồi quy

Mỗi lần bạn sửa prompt agent, template, hoặc lessons.md, chạy lại các task ở đây để chắc workflow không thoái lui. Không có bộ này thì mỗi lần "tối ưu" là một lần đánh cược.

## Cấu trúc

```
workflow/evals/
  <task-id>/
    brief.md       # đúng câu bạn đã nói với Claude lúc bắt đầu
    expected.md    # kết quả tốt trông như thế nào: giả định nào phải được tìm ra, blocker nào phải được phân loại đúng
    result-v1.md   # kết quả lần chạy với phiên bản workflow v1 (git tag)
    result-v2.md
```

## Cách chạy

1. Tag phiên bản workflow hiện tại: `git tag workflow-vN`.
2. Với mỗi task, chạy lại pha RESEARCH bằng brief.md, so kết quả với expected.md.
3. Ghi result-vN.md: tìm ra bao nhiêu giả định trong expected, thêm được gì mới, bỏ sót gì.
4. Thoái lui thì revert thay đổi.

## Chọn task nào làm eval

- Task từng có B0 hoặc B3: bắt buộc.
- Task bạn từng phải sửa tay nhiều: nên.
- Task chạy trơn tru: một cái là đủ, để chắc không phá cái đang tốt.
