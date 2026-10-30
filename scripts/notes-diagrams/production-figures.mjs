// Chapter 08 uses the same neutral canvas and typography as chapters 01–03.
const pair = (en, zh) => ({ en, zh });
export const productionDiagrams = [
  {
    id: 'production-boundaries', note: 'enterprise-ai-production', article: false, icon: 'ShieldCheck', localAsset: true,
    title: pair('Planning and execution have different boundaries', '规划与执行，遵守不同的边界'),
    caption: pair('The model proposes actions; the server authorizes execution and records business effects.', '模型提出候选动作；服务端校验、授权并记录业务操作。'),
    anchor: pair('## 2. Establish the platform structure', '## 2. 搭建平台骨架：把体验、执行、模型和业务数据分开'),
    code: lang => lang === 'en' ? `flowchart LR
 U["Employee"] --> I["Verified identity + task admission"]
 subgraph APP["Trusted application"]
 I --> E["Executor: state + budget"]
 R["Authorized retrieval / memory"] --> E
 E --> G["Tool gateway: validate + authorize + deduplicate"]
 end
 E --> M["External model"]
 M -.-> E
 G --> B["Business system"]
 B -.-> G
 G --> L["Operation ledger + checkpoints"]
` : `flowchart LR
 U["员工"] --> I["验证身份与任务接入"]
 subgraph APP["可信的应用服务端"]
 I --> E["执行器：状态与预算"]
 R["授权检索 / 记忆"] --> E
 E --> G["工具网关：校验、授权与去重"]
 end
 E --> M["外部模型"]
 M -.-> E
 G --> B["业务系统"]
 B -.-> G
 G --> L["操作台账与检查点"]
`,
  },
  {
    id: 'production-recovery', note: 'enterprise-ai-production', article: false, icon: 'History', localAsset: true,
    title: pair('After a write timeout, reconcile the outcome', '写请求超时后，先查证再继续'),
    caption: pair('The remote write may have succeeded. Reconcile by the original operation ID before continuing.', '远端可能已经成功；复用原业务操作 ID 查证结果，再推进后续步骤。'),
    anchor: pair('### Checkpoints track progress; operation records track business effects', '### Checkpoint 记录进度，业务台账记录事实'),
    code: lang => lang === 'en' ? `sequenceDiagram
 participant E as Executor
 participant T as Ticket service
 participant L as Operation ledger
 E->>L: Store operation ID and pending state
 E->>T: Create ticket with stable operation ID
 Note over T: Ticket is created
 T--xE: Response is lost
 Note over E: Outcome unknown; show verifying status
 E->>T: Query using the same operation ID
 T-->>E: Existing ticket ID
 E->>L: Confirm outcome and resume
` : `sequenceDiagram
 participant E as 执行器
 participant T as 工单服务
 participant L as 操作台账
 E->>L: 保存操作 ID 与待执行状态
 E->>T: 携带稳定操作 ID 创建工单
 Note over T: 工单已创建
 T--xE: 响应丢失
 Note over E: 结果未知，展示核实中
 E->>T: 使用同一操作 ID 查询
 T-->>E: 返回已存在的工单 ID
 E->>L: 确认结果，继续后续步骤
`,
  },
  {
    id: 'production-release', note: 'enterprise-ai-production', article: false, icon: 'GitPullRequest', localAsset: true,
    title: pair('Release through gates; learn from observed failures', '用门禁控制发布，用真实失败完善评估'),
    caption: pair('Test candidate versions before expanding traffic; reviewed production evidence improves the next evaluation.', '候选版本先验证再扩大流量；生产证据经脱敏与复核后用于补充评测。'),
    anchor: pair('### Version AI configuration as part of the release', '### 把 AI 配置作为版本化发布对象'),
    code: lang => lang === 'en' ? `flowchart LR
 C["Candidate version"] --> E["Offline evaluation"]
 E -->|Pass| S["Sandbox validation"]
 S -->|Pass| K["Canary"]
 K -->|Pass| P["Production + monitoring"]
 E -->|Fail| R["Revise; keep stable release"]
 S -->|Fail| R
 K -->|Fail| R
 R --> C
 P -.-> D["Authorized, sanitized and reviewed cases"]
 D -.-> E
` : `flowchart LR
 C["候选版本"] --> E["离线评估"]
 E -->|通过| S["沙箱验证"]
 S -->|通过| K["小流量灰度"]
 K -->|通过| P["生产运行与监测"]
 E -->|未通过| R["修订，保持稳定版本"]
 S -->|未通过| R
 K -->|未通过| R
 R --> C
 P -.-> D["经授权、脱敏与复核的案例"]
 D -.-> E
`,
  },
];

export const productionEditorial = {
  'production-boundaries': {
    form: 'execution and trust boundaries',
    subtitle: pair('One task crosses identity, planning, authorization and business state.', '一次任务穿过身份、规划、授权和业务状态；边界由服务端落实。'),
    footer: pair('Logical responsibilities can share one application. Policies, audit and quotas apply across the whole task.', '这些是逻辑职责，可以位于同一应用内；策略、审计与配额贯穿全过程。'),
  },
  'production-recovery': {
    form: 'sequence with an unknown remote outcome',
    subtitle: pair('Example: ticket creation succeeds, but its response never reaches the executor.', '示例：工单创建成功，但响应没有到达执行器。'),
    footer: pair('Do not issue a new operation. If verification is inconclusive, keep the task pending and hand it to a person.', '不新建操作重发；若仍无法查证，保留待核实状态并交给人工。'),
  },
  'production-release': {
    form: 'release gates and evidence feedback',
    subtitle: pair('Version code, prompts, models, tools, retrieval and policy as a tested release.', '代码、提示词、模型、工具、检索与策略，共同组成可验证的发布版本。'),
    footer: pair('Shadow traffic uses read-only paths or sandboxes. A configuration rollback cannot undo completed external actions.', '影子流量使用只读路径或沙箱；配置回退不能撤销已经发生的外部动作。'),
  },
};

export function drawProduction(diagram, layout, lang, canvas) {
  const { L, c, text, icon, path, box, circle, foot, line } = canvas;
  if (diagram.id === 'production-boundaries') {
    box(250, 112, 488, 390, { dashed: true, stroke: c.line });
    text(L('Trusted application server', '可信的应用服务端'), 272, 144, { size: 18, weight: 600, width: 440 });
    icon('UserRound', 61, 196, 34);
    text(L('Employee', '员工'), 78, 262, { size: 19, weight: 600, align: 'middle', width: 150 });
    text(L('Request + confirmation', '请求与动作确认'), 78, 291, { size: 14, color: c.muted, align: 'middle', width: 150 });
    path('M151 215H271', { arrow: true });
    icon('Fingerprint', 288, 175, 27);
    text(L('Identity + task', '身份与任务接入'), 288, 230, { size: 18, weight: 600, width: 184 });
    text(L('Tenant · queue · task ID', '租户、队列与任务 ID'), 288, 257, { size: 14, color: c.muted, width: 184 });
    path('M472 211H501', { arrow: true });
    icon('Workflow', 528, 175, 27);
    text(L('Executor', '执行器'), 528, 230, { size: 18, weight: 600, width: 184 });
    text(L('State · budget · stopping', '状态、预算与停止条件'), 528, 257, { size: 14, color: c.muted, width: 184 });
    icon('Search', 288, 347, 27);
    text(L('Retrieval / memory', '检索与记忆'), 288, 402, { size: 18, weight: 600, width: 184 });
    text(L('Authorized context only', '仅提供授权范围内的上下文'), 288, 429, { size: 14, color: c.muted, width: 184, maxLines: 2 });
    path('M392 338V296H539V273', { arrow: true, dashed: true });
    path('M590 273V337', { arrow: true });
    text(L('Propose', '候选动作'), 607, 311, { size: 14, color: c.muted, width: 104 });
    icon('ShieldCheck', 528, 347, 27);
    text(L('Tool gateway', '工具网关'), 528, 402, { size: 18, weight: 600, width: 184 });
    text(L('Validate · authorize\nDeduplicate · execute', '校验、授权\n去重与执行'), 528, 429, { size: 14, color: c.muted, width: 184, maxLines: 2 });
    icon('Brain', 881, 139, 32);
    text(L('External model', '外部模型'), 897, 199, { size: 18, weight: 600, width: 234, align: 'middle' });
    text(L('Candidate actions', '返回候选动作'), 897, 227, { size: 14, color: c.muted, width: 234, align: 'middle' });
    path('M718 189H822', { arrow: true });
    path('M822 242H718', { arrow: true, dashed: true });
    icon('Ticket', 881, 345, 32);
    text(L('Business system', '业务系统'), 897, 405, { size: 18, weight: 600, width: 234, align: 'middle' });
    text(L('Authoritative result', '返回权威业务结果'), 897, 433, { size: 14, color: c.muted, width: 234, align: 'middle' });
    path('M718 365H822', { arrow: true });
    path('M822 449H718', { arrow: true, dashed: true });
    path('M590 476V536', { arrow: true });
    icon('Database', 271, 520, 25);
    text(L('Operation ledger + checkpoints', '业务操作台账与检查点'), 311, 542, { size: 18, weight: 600, width: 265, maxLines: 2 });
    text(L('Confirmed effects + recoverable progress', '记录已确认的副作用与可恢复进度'), 623, 542, { size: 15, color: c.muted, width: 385 });
    foot(layout.footer[lang], 601);
  } else if (diagram.id === 'production-recovery') {
    const xs = [155, 535, 900];
    const names = [L('Executor', '执行器'), L('Ticket service', '工单服务'), L('Operation ledger', '操作台账')];
    ['Workflow', 'Ticket', 'Database'].forEach((glyph, i) => {
      icon(glyph, xs[i] - 14, 106, 28);
      text(names[i], xs[i], 162, { size: 18, weight: 600, width: 250, align: 'middle' });
      path(`M${xs[i]} 179V609`, { dashed: true, color: c.rule });
    });
    const label = (value, x, y, width) => {
      box(x - 5, y - 18, width + 10, 26, { fill: c.paper, stroke: 'none', r: 0 });
      text(value, x, y, { size: 16, width, maxLines: 1 });
    };
    path('M159 213H896', { arrow: true });
    label(L('1 · Store operation ID + pending state', '1 · 保存稳定操作 ID 与待执行状态'), 211, 199, 640);
    path('M159 281H531', { arrow: true });
    label(L('2 · Create with the operation ID', '2 · 携带该操作 ID 创建工单'), 194, 267, 330);
    box(562, 288, 268, 38, { fill: c.surface });
    text(L('Ticket created remotely', '远端已创建工单'), 575, 313, { size: 15, width: 240 });
    path('M531 357H259', { dashed: true });
    line(246, 348, 264, 366, false, c.line); line(246, 366, 264, 348, false, c.line);
    label(L('3 · Response lost; outcome unknown', '3 · 响应丢失，执行器无法确认结果'), 194, 343, 620);
    path('M159 431H531', { arrow: true });
    label(L('4 · Query by operation ID', '4 · 使用原操作 ID 查询结果'), 194, 417, 330);
    path('M531 497H159', { arrow: true, dashed: true });
    label(L('5 · Return the existing ticket ID', '5 · 返回已存在的工单 ID'), 194, 483, 330);
    path('M159 564H896', { arrow: true });
    label(L('6 · Confirm the outcome; resume subsequent steps', '6 · 保存已确认结果，继续后续步骤'), 211, 550, 640);
    foot(layout.footer[lang], 629);
  } else if (diagram.id === 'production-release') {
    const xs = [121, 370, 620, 870];
    const nodes = [
      ['GitBranch', L('Candidate version', '候选版本'), L('Release manifest', '组合版本与变更范围')],
      ['ListChecks', L('Offline evaluation', '离线评估'), L('Quality + safety cases', '质量与安全用例')],
      ['ShieldCheck', L('Sandbox validation', '沙箱验证'), L('Integration + recovery', '集成与故障恢复')],
      ['SlidersHorizontal', L('Canary', '小流量灰度'), L('Realistic load + budgets', '实际负载与预算')],
    ];
    nodes.forEach(([glyph, title, detail], i) => {
      const x = xs[i]; circle(x, 158, 25, c.surface); icon(glyph, x - 13, 145, 26);
      text(title, x, 216, { size: 18, weight: 600, width: 216, align: 'middle' });
      text(detail, x, 245, { size: 14, color: c.muted, width: 216, align: 'middle' });
      if (i < 3) {
        path(`M${x + 35} 158H${xs[i + 1] - 35}`, { arrow: true });
        if (i > 0) text(L('Pass', '通过'), (x + xs[i + 1]) / 2, 143, { size: 14, color: c.muted, align: 'middle', width: 100 });
      }
    });
    // Gate failures converge before returning to candidate revision.
    [370, 620, 870].forEach(x => path(`M${x} 264V309`, { dashed: true }));
    path('M870 309H121V351', { dashed: true, arrow: true });
    text(L('Gate fails → revise', '门禁未通过，回到修订'), 145, 297, { size: 14, color: c.muted, width: 200 });
    icon('PencilLine', 108, 370, 26);
    text(L('Revise candidate', '修订候选'), 121, 428, { size: 17, weight: 600, width: 216, align: 'middle' });
    text(L('Keep the stable release', '保持稳定版本'), 121, 457, { size: 14, color: c.muted, width: 216, align: 'middle' });
    path('M100 359H33V196H86', { arrow: true });
    icon('FileCheck2', 357, 370, 26);
    text(L('Review evidence', '复核失败证据'), 370, 428, { size: 17, weight: 600, width: 216, align: 'middle' });
    text(L('Authorize · sanitize · label', '授权、脱敏与标注'), 370, 457, { size: 14, color: c.muted, width: 216, align: 'middle' });
    box(400, 299, 14, 20, { fill: c.paper, stroke: 'none', r: 0 });
    path('M370 356V331H407V266', { arrow: true, dashed: true });
    icon('Activity', 857, 370, 26);
    text(L('Production + monitoring', '生产运行与监测'), 870, 428, { size: 17, weight: 600, width: 260, align: 'middle' });
    path('M904 264V353', { arrow: true });
    text(L('Pass', '通过'), 920, 324, { size: 14, color: c.muted, width: 100 });
    path('M827 384H416', { arrow: true, dashed: true });
    text(L('Observed failures feed the next evaluation', '真实失败进入下一轮评测'), 467, 368, { size: 14, color: c.muted, width: 340 });
    foot(layout.footer[lang], 506);
  } else {
    throw new Error('Unknown production figure: ' + diagram.id);
  }
}
