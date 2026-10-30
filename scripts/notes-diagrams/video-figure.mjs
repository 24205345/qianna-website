const pair = (en, zh) => ({ en, zh });

export const videoDiagrams = [{
  id: 'production-video', note: 'enterprise-ai-production', icon: 'Clapperboard', localAsset: true,
  title: pair('Long videos: parallel segments, ordered evidence', '长视频：分段并行，按时间轴归并'),
  caption: pair('Valid captions take a shorter path. Resume segments independently; publish the full overview after coverage checks.', '可用字幕走捷径；分段独立恢复，完整概览通过覆盖检查后发布。'),
  anchor: pair('## 4. How it feels faster: deliver something useful sooner', '## 4. 怎样更快：让用户尽早拿到有用的结果'),
  code: lang => lang === 'en' ? `flowchart LR
 S["Authorized source"] --> A["Audio segments with original offsets"]
 subgraph ASR["Bounded ASR: global, tenant and job limits"]
 X["Segment A"]
 Y["Segment B"]
 Z["Other segments"]
 end
 A --> X
 A --> Y
 A --> Z
 X --> E["Align and deduplicate timestamped evidence"]
 Y --> E
 Z --> E
 S -. Valid captions .-> E
 E --> C["Facts and chapters with source references"]
 C --> O["Coverage check and full overview"]
` : `flowchart LR
 S["授权媒体来源"] --> A["带原始时间偏移的音频分段"]
 subgraph ASR["有界 ASR：全局、租户与任务限额"]
 X["片段 A"]
 Y["片段 B"]
 Z["其他片段"]
 end
 A --> X
 A --> Y
 A --> Z
 X --> E["按时间对齐、去重证据"]
 Y --> E
 Z --> E
 S -. 可用字幕 .-> E
 E --> C["附来源的事实与章节"]
 C --> O["覆盖检查与整片概览"]
`,
}];

export const videoEditorial = {
  'production-video': {
    form: 'bounded fan-out and ordered evidence synthesis',
    subtitle: pair('An ASR path with a caption shortcut; segment count and timing are illustrative.', '需要转写时走分段路径；已有合格字幕可跳过 ASR，片段数仅为示意。'),
    footer: pair('Show evidenced partial results early. Final output needs required intervals or explicit missing-coverage labels.', '有证据的部分结果可以先展示；完整概览必须核对必需区间，缺失时明确标记。'),
  },
};

export function drawVideo(diagram, layout, lang, canvas) {
  const { L, c, text, icon, path, box, foot, circle } = canvas;
  circle(130, 174, 28, c.surface); icon('Clapperboard', 115, 159, 30);
  text(L('Authorized source', '授权媒体来源'), 130, 232, { align: 'middle', width: 205, size: 18, weight: 600 });
  text(L('Metadata + access checks', '元数据与访问权限'), 130, 262, { align: 'middle', width: 205, size: 14, color: c.muted });

  circle(440, 174, 28, c.surface); icon('Scissors', 425, 159, 30);
  text(L('Audio segmentation', '音频分段'), 440, 232, { align: 'middle', width: 250, size: 18, weight: 600 });
  text(L('Speech boundaries + offsets', '语音边界与原始偏移'), 440, 262, { align: 'middle', width: 250, size: 14, color: c.muted });
  path('M177 174H393', { arrow: true });

  text(L('Speech-to-text (ASR)', '分批转写'), 823, 124, { align: 'middle', width: 260, size: 18, weight: 600 });
  const rows = [L('Segment A', '片段 A'), L('Segment B', '片段 B'), L('Other segments', '其他片段')];
  rows.forEach((label, i) => {
    const y = 154 + i * 62;
    box(718, y, 216, 44, { fill: c.surface });
    text(label, 826, y + 28, { align: 'middle', width: 190, size: 16 });
    path(`M647 174V${y + 22}H710`, { arrow: true });
    path(`M942 ${y + 22}H980V366`, {});
  });
  path('M486 174H647');
  text(L('Limit how many run together', '同时处理的段数有上限'), 824, 349, { align: 'middle', width: 300, size: 14, color: c.muted });
  path('M980 366V407H800V453', { arrow: true });
  path('M130 287V407H800', { dashed: true });
  text(L('Validated captions skip ASR', '合格字幕跳过转写'), 325, 392, { width: 360, size: 15, color: c.muted });

  const outputs = [
    [800, 'ListOrdered', L('Align evidence', '对齐与归并证据'), L('Keep timestamps · remove overlap', '保留时间戳、处理重叠')],
    [470, 'BookOpen', L('Facts and chapters', '事实抽取与章节汇总'), L('Group by meaning · cite sources', '按内容分章，保留原文引用')],
    [130, 'FileCheck2', L('Full overview', '整片概览'), L('Check coverage + source support', '检查覆盖与结论依据')],
  ];
  outputs.forEach(([x, glyph, title, detail]) => {
    icon(glyph, x - 15, 473, 30);
    text(title, x, 539, { align: 'middle', width: x === 130 ? 210 : 280, size: 18, weight: 600 });
    text(detail, x, 569, { align: 'middle', width: x === 130 ? 210 : 290, size: 14, color: c.muted });
  });
  path('M750 489H521', { arrow: true });
  path('M418 489H181', { arrow: true });
  text(L('Persist each segment; retry only failed work. Concurrency is tuned, not fixed by this illustration.', '每段独立保存与恢复，只重试失败工作；图中的片段数不代表固定并发配置。'), 24, 621, { width: 992, size: 15, color: c.muted });
  foot(layout.footer[lang], 659);
}
