// Pha RESEARCH của project-workflow.
// Chạy: /research với args { task, angles?, max_spikes? }
// Đọc .claude/skills/project-workflow/SKILL.md để biết vị trí của pha này trong quy trình.
export const meta = {
  name: 'research',
  description: 'Nghiên cứu đa góc nhìn, tổng hợp đề xuất, red team, spike giả định rủi ro cao',
  whenToUse: 'Pha RESEARCH của project-workflow, hoặc mở lại research cho một giả định cụ thể khi gặp blocker B2',
  phases: [
    { title: 'Research', detail: 'một researcher mỗi góc nhìn, chạy song song' },
    { title: 'Synthesize', detail: 'architect gộp thành đề xuất và sổ giả định' },
    { title: 'Red team', detail: 'các lăng kính phản biện độc lập' },
    { title: 'Spike', detail: 'developer dựng prototype cho giả định rủi ro cao' },
    { title: 'Finalize', detail: 'architect cập nhật đề xuất sau spike và red team' },
  ],
}

const task = typeof args === 'string' ? args : args && args.task
if (!task) throw new Error('Cần args.task: mô tả bài toán bằng lời khách hàng')

const ANGLES = (args && args.angles) || [
  'kỹ thuật: các cách triển khai, thư viện, giới hạn, độ trưởng thành, phiên bản và tuổi thọ',
  'sản phẩm và trải nghiệm: người dùng cần gì, ma sát ở đâu, đối thủ và sản phẩm tương tự làm thế nào',
  'vận hành và chi phí: hạ tầng, scale, chi phí theo tháng khi tăng gấp mười, bảo trì, quan sát lỗi',
  'bảo mật, pháp lý, dữ liệu: quyền riêng tư, giấy phép, rủi ro lạm dụng, quy định theo vùng',
  'thất bại đã biết: bài học từ người đã làm việc tương tự, issue mở, thay đổi giá và API gần đây',
]
const MAX_SPIKES = (args && args.max_spikes) || 6

const ASSUMPTION = {
  type: 'object',
  properties: {
    statement: { type: 'string' },
    if_wrong: { type: 'string' },
    risk: { type: 'string', enum: ['CAO', 'VỪA', 'THẤP'] },
    confidence: { type: 'number' },
    evidence: { type: 'string' },
    how_to_verify: { type: 'string' },
  },
  required: ['statement', 'if_wrong', 'risk', 'confidence', 'evidence', 'how_to_verify'],
}
const SPIKE = {
  type: 'object',
  properties: {
    assumption: { type: 'string' },
    why: { type: 'string' },
    how: { type: 'string' },
    environment: { type: 'string' },
  },
  required: ['assumption', 'why', 'how', 'environment'],
}
const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          evidence: { type: 'string' },
          source: { type: 'string' },
          confidence: { type: 'number' },
        },
        required: ['claim', 'evidence', 'source', 'confidence'],
      },
    },
    assumptions: { type: 'array', items: ASSUMPTION },
    unknowns: { type: 'array', items: { type: 'string' } },
    spikes: { type: 'array', items: SPIKE },
    customer_may_not_know: { type: 'array', items: { type: 'string' } },
  },
  required: ['findings', 'assumptions', 'unknowns', 'spikes', 'customer_may_not_know'],
}
const SYNTH = {
  type: 'object',
  properties: {
    options: { type: 'array', items: { type: 'string' } },
    recommended: { type: 'string' },
    high_risk_assumptions: { type: 'array', items: { type: 'string' } },
    spikes: { type: 'array', items: SPIKE },
  },
  required: ['options', 'recommended', 'high_risk_assumptions', 'spikes'],
}
const ATTACKS = {
  type: 'object',
  properties: {
    attacks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          severity: { type: 'string', enum: ['đổ phương án', 'đổi thiết kế', 'thêm việc', 'ghi nhận'] },
          assumption: { type: 'string' },
          evidence_or_guess: { type: 'string' },
        },
        required: ['description', 'severity', 'assumption', 'evidence_or_guess'],
      },
    },
    spikes: { type: 'array', items: SPIKE },
    readiness: { type: 'string', enum: ['chưa sẵn sàng', 'sẵn sàng có điều kiện', 'sẵn sàng'] },
    conditions: { type: 'array', items: { type: 'string' } },
  },
  required: ['attacks', 'spikes', 'readiness', 'conditions'],
}
const SPIKE_RESULT = {
  type: 'object',
  properties: {
    assumption: { type: 'string' },
    verdict: { type: 'string', enum: ['xác nhận', 'bác bỏ', 'chưa kết luận'] },
    evidence: { type: 'string' },
    path: { type: 'string' },
    environment_matches_real: { type: 'boolean' },
  },
  required: ['assumption', 'verdict', 'evidence', 'path', 'environment_matches_real'],
}
const FINAL = {
  type: 'object',
  properties: {
    summary_for_customer: { type: 'string' },
    questions_for_customer: { type: 'array', items: { type: 'string' } },
    biggest_open_risk: { type: 'string' },
    assumptions_high_unspiked: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary_for_customer', 'questions_for_customer', 'biggest_open_risk', 'assumptions_high_unspiked'],
}

// Rào chắn ở đây là đúng: architect cần TẤT CẢ góc nhìn để gộp và khử trùng lặp giả định.
phase('Research')
log(`Research ${ANGLES.length} góc nhìn cho: ${task}`)
const research = (
  await parallel(
    ANGLES.map((angle, i) => () =>
      agent(
        `Bài toán: ${task}\n\nGóc nhìn của bạn: ${angle}\n\nLàm đúng phương pháp trong hướng dẫn của bạn. Chỉ nghiên cứu góc nhìn này. Trả về đúng schema.`,
        { agentType: 'researcher', label: `research:${i + 1}`, phase: 'Research', schema: FINDINGS },
      ),
    ),
  )
).filter(Boolean)
if (research.length < ANGLES.length) log(`Cảnh báo: ${ANGLES.length - research.length} góc nhìn không trả kết quả`)

phase('Synthesize')
const synth = await agent(
  `Bài toán: ${task}\n\nBáo cáo từ ${research.length} researcher (JSON):\n${JSON.stringify(research, null, 2)}\n\nLàm phần "Ở pha RESEARCH: tổng hợp" trong hướng dẫn của bạn: gộp giả định vào workflow/assumptions.md với ID A-xxx tiếp nối ID đã có, viết workflow/proposal.md phần 1, 2, 3 theo template. Trả về đúng schema, trong đó spikes là danh sách spike bắt buộc cho giả định CAO tin cậy dưới 0.8.`,
  { agentType: 'architect', label: 'synthesize', phase: 'Synthesize', schema: SYNTH },
)
if (!synth) throw new Error('Architect không trả về kết quả tổng hợp')

const LENSES = ['Pre-mortem', 'Độ phủ', 'Khách hàng', 'Vận hành']
phase('Red team')
const attacks = (
  await parallel(
    LENSES.map((lens) => () =>
      agent(
        `Bài toán: ${task}\n\nLăng kính được giao: ${lens}. Đọc workflow/proposal.md và workflow/assumptions.md rồi tấn công theo đúng lăng kính này. Trả về đúng schema.`,
        { agentType: 'red-team', label: `red-team:${lens}`, phase: 'Red team', schema: ATTACKS },
      ),
    ),
  )
).filter(Boolean)

// Gộp spike từ architect và red team, khử trùng lặp theo tên giả định.
const seen = new Set()
const spikes = []
for (const s of [...(synth.spikes || []), ...attacks.flatMap((a) => a.spikes || [])]) {
  const key = (s.assumption || '').trim().toLowerCase()
  if (!key || seen.has(key)) continue
  seen.add(key)
  spikes.push(s)
}
const toRun = spikes.slice(0, MAX_SPIKES)
if (spikes.length > MAX_SPIKES) log(`Chỉ chạy ${MAX_SPIKES}/${spikes.length} spike. Còn lại: ${spikes.slice(MAX_SPIKES).map((s) => s.assumption).join('; ')}`)

phase('Spike')
log(`Chạy ${toRun.length} spike`)
// Mỗi spike ghi vào thư mục riêng workflow/spikes/<id>/ nên chạy song song không đụng nhau.
const spikeResults = (
  await pipeline(toRun, (s, _item, i) =>
    agent(
      `Chế độ spike. Giả định cần kiểm: ${s.assumption}\nVì sao: ${s.why}\nCách chạy đề xuất: ${s.how}\nMôi trường bắt buộc: ${s.environment}\n\nTạo workflow/spikes/spike-${String(i + 1).padStart(2, '0')}/ theo hướng dẫn của bạn. Trả về đúng schema.`,
      { agentType: 'developer', label: `spike:${i + 1}`, phase: 'Spike', schema: SPIKE_RESULT },
    ),
  )
).filter(Boolean)

phase('Finalize')
const final = await agent(
  `Bài toán: ${task}\n\nKết quả red team (JSON):\n${JSON.stringify(attacks, null, 2)}\n\nKết quả spike (JSON):\n${JSON.stringify(spikeResults, null, 2)}\n\nCập nhật workflow/assumptions.md (trạng thái, tin cậy, thêm giả định mới từ red team), viết phần 4, 5, 6 của workflow/proposal.md, và viết lại phần 1 nếu spike làm đổi đề xuất. Trả về đúng schema. summary_for_customer viết bằng ngôn ngữ goal và trải nghiệm, tối đa 12 dòng.`,
  { agentType: 'architect', label: 'finalize', phase: 'Finalize', schema: FINAL },
)

return {
  task,
  files: ['workflow/proposal.md', 'workflow/assumptions.md', 'workflow/spikes/'],
  summary_for_customer: final ? final.summary_for_customer : null,
  questions_for_customer: final ? final.questions_for_customer : [],
  biggest_open_risk: final ? final.biggest_open_risk : null,
  assumptions_high_unspiked: final ? final.assumptions_high_unspiked : [],
  red_team_readiness: attacks.map((a) => a.readiness),
  spikes: spikeResults,
  spikes_skipped: spikes.length - toRun.length,
}
