const p = (en, zh) => ({ en, zh });
export const featureBuildDiagrams = [
  {
    id: 'build-path', note: 'feature-build-scaling', icon: 'Workflow',
    title: p('Build it, try it, then add more', '先做出来，试过以后再加功能'),
    caption: p('Choose the scope, commit existing code, then let the AI build and test. Try it before extending it.', '先确定范围、提交既有代码，再让 AI 开发自测；你亲自试用，通过后再扩展。'),
    code: lang => lang === 'zh' ? `flowchart LR
 P["说清这次做什么"] --> S["提交既有代码"] --> A["AI 开发并自测"] --> U["你亲自试用"] --> E["再加一个功能"]
` : `flowchart LR
 P["Choose this build"] --> S["Commit existing code"] --> A["AI builds and tests"] --> U["You try it"] --> E["Add one feature"]
`,
  },
  {
    id: 'build-validation', note: 'feature-build-scaling', icon: 'ListChecks',
    title: p('AI tests first. You try it next.', 'AI 先自测，你再亲自试'),
    caption: p('If you find a problem, send it to the AI and repeat the steps after repair.', '遇到问题就反馈给 AI；修好后，你再按原步骤试一次。'),
    code: lang => lang === 'zh' ? `flowchart LR
 A["AI 自己测试"] --> B["你亲自试用"] --> C{"用起来正常吗？"}
 C -->|是| D["保存这版代码"]
 C -->|否| E["把问题和报错贴给 AI"] --> F["AI 修复并重新测试"] --> B
` : `flowchart LR
 A["AI tests"] --> B["You try it"] --> C{"Works as expected?"}
 C -->|Yes| D["Save this version"]
 C -->|No| E["Send the problem to AI"] --> F["AI fixes and tests again"] --> B
`,
  },
  {
    id: 'build-timing', note: 'feature-build-scaling', icon: 'Activity',
    title: p('Where does the wait happen?', '生成慢了，先看时间花在哪里'),
    caption: p('An illustration without measured times. Showing all questions together can make first display and completion coincide.', '示意图，没有实际耗时数据；三题一起返回时，看到题目和全部完成可能是同一时刻。'),
    code: lang => lang === 'zh' ? `sequenceDiagram
 participant U as 用户
 participant A as 应用
 participant G as 生成服务
 U->>A: 点击并提交材料
 Note over A: 收到请求
 A->>G: 请求生成
 G-->>A: 候选结果
 Note over A: 检查结果
 A-->>U: 看到题目 / 全部生成完
 Note over U: 三题一起返回时，两者可能重合
` : `sequenceDiagram
 participant U as User
 participant A as Application
 participant G as Generator
 U->>A: Click and submit material
 Note over A: Request accepted
 A->>G: Request generation
 G-->>A: Candidate output
 Note over A: Validate and organize
 A-->>U: First useful content / complete result
 Note over U: May coincide with synchronous delivery
`,
  },
];
export const featureBuildEditorial = {
  'build-path': {
    form: 'five-step development journey',
    subtitle: p('One working practice session comes before extra features.', '先完成一次练习，再考虑更多功能。'),
    footer: p('Fix problems first. Commit the working version before each new feature.', '发现问题先修好；每次扩展新功能前，先提交当前能用的代码。'),
  },
  'build-validation': {
    form: 'verification loop with human acceptance',
    subtitle: p('It should run correctly and do what you wanted.', '既要能运行，也要做出你想要的功能。'),
    footer: p('Repeat the failed steps and check that existing features still work.', '再试一次刚才出错的操作，也看看原来能用的功能有没有坏。'),
  },
  'build-timing': {
    form: 'conceptual timing sequence without quantitative scale',
    subtitle: p('When does the server receive the request, show a question, and finish?', '按钮点下去后，什么时候收到请求、看到题目、全部生成完？'),
    footer: p('Seeing a question earlier need not mean faster completion. No measured times are shown.', '先看到题目，不代表全部生成得更快。图中没有实际用时。'),
  },
};
export function drawFeatureBuild(diagram, layout, lang, canvas) {
  const { L, c, text, icon, path, box, circle, foot, add } = canvas;
  if (diagram.id === 'build-path') {
    const steps = [
      ['FileText', L('Choose this build', '说清这次做什么'), L('One complete task', '先做完整的核心功能')],
      ['GitBranch', L('Commit existing code', '提交既有代码'), L('Keep a working version', '留一个能退回的版本')],
      ['ListChecks', L('AI builds and tests', 'AI 开发并自测'), L('Run, check, and fix', '写完先自己运行检查')],
      ['UserRound', L('You try it', '你亲自试用'), L('Try your own material', '用自己的材料走一遍')],
      ['Workflow', L('Add one feature', '再加一个功能'), L('Keep old features working', '原来的功能也要能用')],
    ];
    steps.forEach(([glyph, title, detail], i) => {
      const x = 104 + i * 208;
      circle(x, 151, 25, c.surface); icon(glyph, x - 13, 138, 26);
      if (i < 4) path(`M${x + 36} 151H${x + 170}`, { arrow: true });
      text(title, x, 218, { align: 'middle', width: 194, size: 18, weight: 600, maxLines: 2 });
      text(detail, x, 263, { align: 'middle', width: 190, size: 15, color: c.muted, maxLines: 2 });
    });
    foot(layout.footer[lang], 316);
  } else if (diagram.id === 'build-validation') {
    const stages = [
      [130, 'ListChecks', L('AI tests', 'AI 自己测试'), L('Run the app and fix errors', '运行项目，先修报错')],
      [412, 'UserRound', L('You try it', '你亲自试用'), L('Use your own material', '拿自己的材料试一遍')],
    ];
    stages.forEach(([x, glyph, title, detail]) => {
      circle(x, 156, 27, c.surface); icon(glyph, x - 14, 142, 28);
      text(title, x, 217, { align: 'middle', width: 246, size: 19, weight: 600 });
      text(detail, x, 249, { align: 'middle', width: 246, size: 15, color: c.muted });
    });
    path('M170 156H371', { arrow: true });
    path('M451 156H589', { arrow: true });
    add(`<path d="M690 107L784 156L690 205L596 156Z" fill="${c.surface}" stroke="${c.rule}"/>`);
    text(L('Works?', '用起来正常吗？'), 690, 162, { align: 'middle', width: 160, size: 17 });
    path('M789 156H855', { arrow: true });
    text(L('Yes', '是'), 820, 137, { width: 45, size: 14, color: c.muted });
    icon('FileCheck2', 908, 117, 28);
    text(L('Save this version', '保存这版代码'), 923, 218, { align: 'middle', width: 185, size: 18, weight: 600 });
    path('M690 210V314H412V349', { arrow: true });
    text(L('No · send the problem', '否 · 把问题告诉 AI'), 528, 299, { width: 252, size: 15, color: c.muted });
    box(283, 354, 258, 82, { fill: c.surface });
    text(L('What did you do?', '刚才做了什么？'), 412, 387, { align: 'middle', width: 238, size: 17 });
    text(L('Error text / screenshot', '错误文字 / 截图'), 412, 416, { align: 'middle', width: 238, size: 15, color: c.muted });
    path('M547 395H629', { arrow: true });
    box(635, 354, 280, 82);
    text(L('AI fixes and tests again', 'AI 修复，再自己测试'), 775, 402, { align: 'middle', width: 256, size: 17 });
    path('M775 349V335H1024V90H412V125', { arrow: true });
    text(L('You try again', '你再试一次'), 811, 322, { width: 190, size: 14, color: c.muted });
    foot(layout.footer[lang], 475);
  } else {
    const milestones = [
      [70, L('Click', '点击'), L('Start timing', '开始计时')],
      [285, L('Request received', '收到请求'), L('Processing starts', '开始处理')],
      [665, L('A question appears', '看到题目'), L('You can start reading', '可以开始看')],
      [955, L('All done', '全部生成完'), L('Three usable questions', '三道题都能用')],
    ];
    path('M70 172H983', { arrow: true });
    milestones.forEach(([x, title, detail], i) => {
      circle(x, 172, 5, c.ink);
      const center = i === 0 ? 108 : i === 3 ? 932 : x;
      const width = i === 0 ? 164 : i === 3 ? 188 : 254;
      text(title, center, 125, { align: 'middle', width, size: 18, weight: 600 });
      text(detail, center, 218, { align: 'middle', width, size: 15, color: c.muted });
    });
    box(285, 280, 670, 116, { dashed: true });
    icon('Cloud', 309, 303, 29);
    text(L('Model generates → check result → show it', '模型出题 → 检查结果 → 页面显示'), 360, 323, { width: 558, size: 19 });
    text(L('Record how long the model takes separately.', '单独记录等模型花了多久。'), 309, 369, { width: 616, size: 16, color: c.muted });
    path('M665 246V260H955V246', { dashed: true });
    text(L('If all questions arrive together, first display and completion can coincide.', '三题一起返回时：看到题目和全部生成完，可能是同一时刻。'), 70, 448, { width: 918, size: 17 });
    foot(layout.footer[lang], 492);
  }
}
