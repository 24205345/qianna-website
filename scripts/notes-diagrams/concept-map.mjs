const pair = (en, zh) => ({ en, zh });

export const conceptBranches = [
  { icon: 'Users', question: pair('Who can use it?', '谁能使用？'), terms: pair('Identity · roles\nPermissions · data boundaries', '登录身份 · 成员角色\n资源权限 · 数据隔离') },
  { icon: 'Workflow', question: pair('How does work run?', '任务怎样运行？'), terms: pair('Async work · job queues\nWorkers · saved results', '异步处理 · 消息队列\n后台 Worker · 结果保存') },
  { icon: 'Gauge', question: pair('How does it feel faster?', '怎样更快给出结果？'), terms: pair('First useful result · streaming\nSegments · permitted reuse', '首个结果 · 流式返回\n分段处理 · 缓存复用') },
  { icon: 'Network', question: pair('What if many people arrive?', '人多了怎么办？'), terms: pair('Concurrency · rate limits\nFair scheduling · scaling', '高并发 · 限流与配额\n公平调度 · 扩容') },
  { icon: 'History', question: pair('What if something fails?', '出错以后怎么办？'), terms: pair('Task state · bounded retries\nResume · avoid duplicate effects', '任务状态 · 有限重试\n断点恢复 · 避免重复执行') },
  { icon: 'Activity', question: pair('How does it keep working?', '怎样长期运营？'), terms: pair('Quality checks · alerts\nCost · releases · recovery', '质量评估 · 日志告警\n成本 · 发布 · 备份恢复') },
];

export const conceptDiagrams = [{
  id: 'production-map', note: 'enterprise-ai-production', icon: 'Network', localAsset: true,
  title: pair('From personal demo to a team-ready platform', '从个人 Demo 到团队平台：六个升级问题'),
  caption: pair('Start with the problem, then learn the concept and choose the next useful upgrade.', '先找到产品遇到的问题，再认识相关概念，决定下一步值得做的升级。'),
  anchor: pair('## 1. Start with a map of the upgrade', '## 1. 先看全貌：平台升级可以从六个问题展开'),
  code: lang => `mindmap\n  root((${lang === 'en' ? 'Team-ready AI product' : '个人 Demo 到团队平台'}))\n${conceptBranches.map(b => `    ${b.question[lang]}\n${b.terms[lang].split('\n').map(t => `      ${t.replace(/ · /g, ' / ')}`).join('\n')}`).join('\n')}`,
}];

export const conceptEditorial = {
  'production-map': {
    form: 'six-branch concept mindmap',
    subtitle: pair('Six connected concerns, not a fixed build sequence or a mandatory tool list.', '这是相互关联的能力地图；按产品阶段逐步补齐，不要求一次装完所有工具。'),
    footer: pair('Use one video-summary product to connect each question, concept, upgrade and acceptance check.', '用同一个视频总结产品，将问题、概念、升级动作与验收方法连在一起。'),
  },
};

export function drawConceptMap(diagram, layout, lang, canvas) {
  const { L, c, text, icon, path, circle, foot } = canvas;
  // A mindmap encodes relationships. Branches carry no execution arrows.
  path('M440 350H393M393 175V525M393 175H367M393 350H367M393 525H367');
  path('M600 350H647M647 175V525M647 175H673M647 350H673M647 525H673');
  circle(520, 350, 80, c.surface);
  text(L('Team-ready\nAI product', '个人 Demo\n到团队平台'), 520, 338, { size: 19, weight: 600, align: 'middle', width: 144, maxLines: 2 });
  conceptBranches.forEach((branch, i) => {
    const left = i < 3;
    const y = 146 + (i % 3) * 175;
    const x = left ? 24 : 695;
    icon(branch.icon, x, y - 22, 24);
    text(branch.question[lang], x + 35, y, { size: 17, weight: 600, width: left ? 300 : 285, maxLines: 2 });
    text(branch.terms[lang], x, y + 40, { size: 16, color: c.muted, width: left ? 330 : 321, maxLines: 3 });
  });
  text(L('Understand the need → describe the change → let the agent implement → verify the outcome', '看懂需要 → 描述升级目标 → 交给 Agent 实现 → 验证真实结果'), 24, 624, { size: 15, color: c.muted, width: 992, maxLines: 2 });
  foot(layout.footer[lang], 657);
}
