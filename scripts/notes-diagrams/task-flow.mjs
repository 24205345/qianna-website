const pair = (en, zh) => ({ en, zh });

export const taskDiagrams = [{
  id: 'production-task-flow', note: 'enterprise-ai-production', icon: 'Database', localAsset: true,
  title: pair('How background work continues after the page closes', '网页离开后，后台任务怎样继续'),
  caption: pair('Separate admission from execution; the page reads saved task status and results.', '前台接单与后台执行分开；页面读取已保存的任务状态与结果。'),
  anchor: pair('## 3. How work runs: let processing outlive the page', '## 3. 任务怎样运行：网页离开了，工作仍能继续'),
  code: lang => lang === 'en' ? `flowchart LR
 U["Page: submit and view"] <--> A["Server: validate identity and input"]
 A <-->|"1. Save or read status"| D["Database: owner, state and result locations"]
 A -->|"2. Enqueue task identifier"| Q["Queue: pending work"]
 Q -->|"3. Claim"| W["Worker: download, transcribe and summarize"]
 W -->|"4. Save artifacts"| F["File storage: media and results"]
 W -->|"Update progress and result locations"| D
` : `flowchart LR
 U["网页：提交与查看"] <--> A["服务端：校验身份和输入"]
 A <-->|"1 登记或读取状态"| D["数据库：归属、状态和结果位置"]
 A -->|"2 入队：任务编号"| Q["队列：等待处理的工作"]
 Q -->|"3 领取任务"| W["Worker：下载、转写与总结"]
 W -->|"4 保存成果"| F["文件存储：媒体与处理结果"]
 W -->|"回写进度与结果位置"| D
`,
}];

export const taskEditorial = {
  'production-task-flow': {
    form: 'background execution and persistent state topology',
    subtitle: pair('Register and return a task entry; continue in the background and read progress later.', '先登记并返回任务入口，后台持续处理，前台随时读取进度。'),
    footer: pair('A restart needs durable records and safe recovery. A background function alone is insufficient.', '重启后继续，需要持久记录与安全恢复；启动一个后台函数还不够。'),
  },
};

export function drawTaskFlow(diagram, layout, lang, canvas) {
  const { L, c, text, icon, path, circle, foot } = canvas;
  const nodes = [
    [130, 175, 'Monitor', L('Page', '网页'), L('Submit · revisit results', '提交任务、回来查看')],
    [520, 175, 'ShieldCheck', L('Application server', '应用服务端'), L('Validate identity and input', '校验身份与输入')],
    [880, 175, 'Database', L('Database', '数据库'), L('Owner · status\nResult locations', '归属、状态\n结果位置')],
    [130, 425, 'ListChecks', L('Queue', '消息队列'), L('Pending task identifiers', '等待处理的任务编号')],
    [520, 425, 'Workflow', L('Worker', '后台 Worker'), L('Download · transcribe\nSummarize', '下载、转写、总结')],
    [880, 425, 'FileText', L('File storage', '文件存储'), L('Media and result files', '视频与处理成果')],
  ];
  for (const [x, y, glyph, title, detail] of nodes) {
    circle(x, y, 28, c.surface);
    icon(glyph, x - 16, y - 16, 32);
    text(title, x, y + 54, { align: 'middle', width: x === 130 ? 210 : 260, size: 19, weight: 600, maxLines: 1 });
    text(detail, x, y + 84, { align: 'middle', width: x === 130 ? 210 : 260, size: 15, color: c.muted, maxLines: 2 });
  }
  path('M177 175H473', { both: true });
  text(L('Submit / query', '提交 / 查询'), 257, 153, { size: 14, width: 180, color: c.muted });
  path('M567 175H833', { both: true });
  text(L('1. Save / read status', '1 登记 / 读状态'), 602, 153, { size: 14, width: 220, color: c.muted });
  path('M520 286V320H130V389', { arrow: true });
  text(L('2. Enqueue an identifier', '2 入队：任务编号'), 225, 306, { size: 14, width: 280, color: c.muted });
  path('M177 425H473', { arrow: true });
  text(L('3. Claim work', '3 领取任务'), 257, 403, { size: 14, width: 180, color: c.muted });
  path('M567 425H833', { arrow: true });
  text(L('4. Save artifacts', '4 保存成果'), 625, 403, { size: 14, width: 200, color: c.muted });
  path('M520 389V350H880V286', { arrow: true });
  text(L('Update progress + locations', '回写进度与结果位置'), 599, 337, { size: 14, width: 265, color: c.muted });
  text(L('Queues carry work IDs; the database records progress; file storage holds media and artifacts.', '队列传递工作编号，数据库记录进度，文件存储保存媒体与成果。'), 24, 558, { size: 15, width: 992, color: c.muted, maxLines: 1 });
  foot(layout.footer[lang], 580);
}
