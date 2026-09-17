// Pha DELIVER của project-workflow.
// Chạy: /deliver với args { task, option, max_rounds? }
// Trả về status: satisfied | blocked | max_rounds. Session điều phối định tuyến theo SKILL.md.
export const meta = {
  name: 'deliver',
  description: 'Lập kế hoạch, triển khai theo phụ thuộc, rồi lặp qa + reviewer + customer-grader đến khi đạt cả hai rubric hoặc gặp blocker cần người',
  whenToUse: 'Pha DELIVER của project-workflow, sau khi khách hàng đã chốt phương án và duyệt rubric khách hàng ở Gate 1',
  phases: [
    { title: 'Plan', detail: 'architect viết plan.md và rubric-technical.md' },
    { title: 'Implement', detail: 'developer làm từng work item theo thứ tự phụ thuộc' },
    { title: 'Verify', detail: 'qa, reviewer, customer-grader chấm song song' },
    { title: 'Fix', detail: 'developer sửa gap, rồi Verify lại' },
  ],
}

const task = args && args.task
const option = args && args.option
const maxRounds = (args && args.max_rounds) || 5
if (!task || !option) throw new Error('Cần args.task và args.option (phương án đã chốt ở Gate 1)')

const BLOCKER = {
  type: 'object',
  properties: {
    class: { type: 'string', enum: ['B0', 'B1', 'B2', 'B3', 'B4', 'B5'] },
    description: { type: 'string' },
    assumption: { type: 'string' },
    evidence: { type: 'string' },
  },
  required: ['class', 'description', 'assumption', 'evidence'],
}
const PLAN = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          depends_on: { type: 'array', items: { type: 'string' } },
          acceptance: { type: 'string' },
          assumptions: { type: 'array', items: { type: 'string' } },
        },
        required: ['id', 'title', 'depends_on', 'acceptance', 'assumptions'],
      },
    },
    test_command: { type: 'string' },
    e2e_command: { type: 'string' },
  },
  required: ['items', 'test_command', 'e2e_command'],
}
const DEV_RESULT = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['done', 'blocked'] },
    files_changed: { type: 'array', items: { type: 'string' } },
    test_output: { type: 'string' },
    blockers: { type: 'array', items: BLOCKER },
  },
  required: ['status', 'files_changed', 'test_output', 'blockers'],
}
const GRADE = {
  type: 'object',
  properties: {
    satisfied: { type: 'boolean' },
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          criterion: { type: 'string' },
          passed: { type: 'boolean' },
          evidence: { type: 'string' },
        },
        required: ['criterion', 'passed', 'evidence'],
      },
    },
    gaps: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: BLOCKER },
  },
  required: ['satisfied', 'results', 'gaps', 'blockers'],
}

const nonTrivial = (blockers) => (blockers || []).filter((b) => b && b.class !== 'B1')

phase('Plan')
const plan = await agent(
  `Task: ${task}\nPhương án đã chốt ở Gate 1: ${option}\n\nLàm phần "Ở pha DELIVER: lập kế hoạch" trong hướng dẫn của bạn. Viết workflow/plan.md và workflow/rubric-technical.md. Trả về đúng schema, items theo thứ tự phụ thuộc, mỗi item đủ nhỏ cho một developer làm trong một phiên.`,
  { agentType: 'architect', label: 'plan', phase: 'Plan', schema: PLAN },
)
if (!plan || !plan.items || plan.items.length === 0) throw new Error('Architect không trả về work item nào')
log(`Kế hoạch: ${plan.items.length} work item`)

// Triển khai tuần tự theo thứ tự architect đã sắp. Tuần tự là cố ý: các item sửa cùng cây code,
// chạy song song sẽ đụng nhau và cần worktree cộng merge, chưa đáng.
phase('Implement')
const implemented = []
for (let i = 0; i < plan.items.length; i++) {
  const item = plan.items[i]
  const r = await agent(
    `Chế độ triển khai. Work item ${item.id}: ${item.title}\nTiêu chí chấp nhận: ${item.acceptance}\nGiả định liên quan: ${item.assumptions.join(', ') || 'không'}\nLệnh test: ${plan.test_command}\n\nĐọc workflow/plan.md để biết bối cảnh. Chỉ làm item này. Trả về đúng schema; blockers để rỗng nếu chỉ có B1 đã tự sửa.`,
    { agentType: 'developer', label: `dev:${item.id}`, phase: 'Implement', schema: DEV_RESULT },
  )
  if (!r) {
    implemented.push({ id: item.id, status: 'no_result' })
    continue
  }
  implemented.push({ id: item.id, status: r.status, files: r.files_changed })
  const hard = nonTrivial(r.blockers)
  if (r.status === 'blocked' || hard.length) {
    return { status: 'blocked', stage: 'implement', item: item.id, blockers: hard, implemented }
  }
}

let round = 0
let lastGaps = []
while (round < maxRounds) {
  round++
  log(`Verify vòng ${round}/${maxRounds}`)
  // Rào chắn ở đây là đúng: quyết định đạt hay chưa cần cả ba góc chấm cùng lúc.
  const grades = await parallel([
    () =>
      agent(
        `Vòng ${round}. Lệnh test: ${plan.test_command}. Lệnh e2e: ${plan.e2e_command}. Làm đúng hướng dẫn của bạn: đối chiếu kịch bản chấp nhận, viết e2e còn thiếu, chạy toàn bộ, chụp screenshot. Trả về đúng schema; satisfied = mọi kịch bản đạt.`,
        { agentType: 'qa', label: `qa:r${round}`, phase: 'Verify', schema: GRADE },
      ),
    () =>
      agent(
        `Vòng ${round}. Chấm theo workflow/rubric-technical.md đúng hướng dẫn của bạn. Trả về đúng schema; satisfied = mọi tiêu chí đạt.`,
        { agentType: 'reviewer', label: `reviewer:r${round}`, phase: 'Verify', schema: GRADE },
      ),
    () =>
      agent(
        `Vòng ${round}. Chấm theo workflow/rubric-customer.md đúng hướng dẫn của bạn, chỉ đọc những file được phép. Trả về đúng schema; satisfied = mọi tiêu chí và kịch bản đạt.`,
        { agentType: 'customer-grader', label: `customer:r${round}`, phase: 'Verify', schema: GRADE },
      ),
  ])
  const [qa, review, customer] = grades
  const missing = [qa, review, customer].filter((g) => !g).length
  if (missing) log(`Cảnh báo: ${missing} agent chấm không trả kết quả ở vòng ${round}`)

  const hard = grades.filter(Boolean).flatMap((g) => nonTrivial(g.blockers))
  if (hard.length) return { status: 'blocked', stage: 'verify', round, blockers: hard, implemented }

  const allOk = grades.every((g) => g && g.satisfied)
  lastGaps = [
    ...(qa ? qa.gaps.map((g) => `[qa] ${g}`) : []),
    ...(review ? review.gaps.map((g) => `[reviewer] ${g}`) : []),
    ...(customer ? customer.gaps.map((g) => `[khách hàng] ${g}`) : []),
  ]
  if (allOk && !missing) {
    return { status: 'satisfied', rounds: round, implemented, customer_results: customer.results }
  }
  if (round >= maxRounds) break

  log(`Còn ${lastGaps.length} gap, developer sửa`)
  const fix = await agent(
    `Chế độ triển khai. Sửa các gap sau, mỗi gap là một việc cụ thể. Không sửa rubric. Lệnh test: ${plan.test_command}.\n\n${lastGaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}\n\nTrả về đúng schema.`,
    { agentType: 'developer', label: `fix:r${round}`, phase: 'Fix', schema: DEV_RESULT },
  )
  const fixHard = fix ? nonTrivial(fix.blockers) : []
  if (!fix || fix.status === 'blocked' || fixHard.length) {
    return { status: 'blocked', stage: 'fix', round, blockers: fixHard, implemented, gaps: lastGaps }
  }
}

return { status: 'max_rounds', rounds: round, implemented, gaps: lastGaps }
