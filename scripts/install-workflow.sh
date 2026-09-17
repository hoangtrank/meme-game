#!/usr/bin/env bash
# Cài project-workflow vào một repo khác, hoặc vào ~/.claude để dùng ở mọi project.
#
#   scripts/install-workflow.sh /path/to/repo      # cài vào một project
#   scripts/install-workflow.sh --user             # cài agents, skill, workflows vào ~/.claude (mọi project)
#
# Không ghi đè file đã có. Chạy lại an toàn.
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATES="$SRC/.claude/skills/project-workflow/templates"

copy_if_absent() { # src dst
  if [ -e "$2" ]; then echo "  giữ nguyên: $2"; else mkdir -p "$(dirname "$2")"; cp -R "$1" "$2"; echo "  tạo: $2"; fi
}

install_generic() { # root
  local root="$1"
  echo "Phần dùng chung -> $root/.claude"
  for f in "$SRC"/.claude/agents/*.md; do copy_if_absent "$f" "$root/.claude/agents/$(basename "$f")"; done
  copy_if_absent "$SRC/.claude/skills/project-workflow" "$root/.claude/skills/project-workflow"
  for f in "$SRC"/.claude/workflows/*.js; do copy_if_absent "$f" "$root/.claude/workflows/$(basename "$f")"; done
}

if [ "${1:-}" = "--user" ]; then
  install_generic "$HOME"
  echo "Xong. Agents, skill và workflows đã có ở ~/.claude cho mọi project."
  echo "Trong từng project vẫn cần: scripts/install-workflow.sh /path/to/repo  (để tạo workflow/ và rules)."
  exit 0
fi

TARGET="${1:?Cách dùng: install-workflow.sh /path/to/repo | --user}"
[ -d "$TARGET" ] || { echo "Không thấy thư mục: $TARGET" >&2; exit 1; }
TARGET="$(cd "$TARGET" && pwd)"

install_generic "$TARGET"

echo "Quy tắc và settings"
copy_if_absent "$SRC/.claude/rules/project-workflow.md" "$TARGET/.claude/rules/project-workflow.md"
copy_if_absent "$SRC/.claude/settings.json" "$TARGET/.claude/settings.json"

echo "Trạng thái dự án -> $TARGET/workflow"
mkdir -p "$TARGET/workflow/postmortems" "$TARGET/workflow/evals" "$TARGET/workflow/spikes"
for name in STATE project-profile preferences assumptions proposal rubric-customer rubric-technical blockers decisions plan metrics; do
  copy_if_absent "$TEMPLATES/$name.md" "$TARGET/workflow/$name.md"
done
copy_if_absent "$TEMPLATES/postmortem-TEMPLATE.md" "$TARGET/workflow/postmortems/TEMPLATE.md"
copy_if_absent "$TEMPLATES/evals-README.md" "$TARGET/workflow/evals/README.md"
copy_if_absent "$TEMPLATES/spikes-README.md" "$TARGET/workflow/spikes/README.md"

if [ ! -f "$TARGET/CLAUDE.md" ] || ! grep -q "project-workflow" "$TARGET/CLAUDE.md"; then
  {
    echo ""
    echo "## Quy trình làm việc"
    echo ""
    echo "Dự án này dùng skill \`project-workflow\`. Trạng thái ở \`workflow/STATE.md\`, quy tắc ở \`.claude/rules/project-workflow.md\`. Bắt đầu bằng: \"chạy research cho: <bài toán>\"."
  } >> "$TARGET/CLAUDE.md"
  echo "  thêm mục vào: $TARGET/CLAUDE.md"
else
  echo "  giữ nguyên: $TARGET/CLAUDE.md"
fi

echo "Xong. Bước tiếp theo trong $TARGET: điền workflow/project-profile.md và workflow/preferences.md."
