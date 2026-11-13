const pair = (en, zh) => ({ en, zh });
export const videoCaseDiagrams = [
  {
    id: 'vidgrab-learning-loop', note: 'ai-video-downloader-summarizer', icon: 'BookOpen',
    title: pair('From a video to a learning loop', '从视频资料到学习闭环'),
    caption: pair('Summaries lead to questions and quizzes; timestamps take the learner back to the source. Sharing is explicit.', '总结衔接问答与测验，时间戳把学习者带回原片；分享需要主动确认。'),
    anchor: pair('### 7.1 From summaries to learning', '### 7.1 从总结到学习'),
    code: lang => lang === 'en' ? `flowchart LR
 I["Upload or authorized link"] --> R["Summary, chapters, transcript, mind map"]
 R --> Q["Questions and quizzes"] --> V["Review source by timestamp"]
 V --> Q
 R --> H["Account history in PostgreSQL"]
 R -.-> C["Explicit community publication"]
` : `flowchart LR
 I["上传或授权链接"] --> R["总结、章节、字幕与导图"]
 R --> Q["问答与测验"] --> V["按时间戳回看原片"]
 V --> Q
 R --> H["PostgreSQL 账号学习记录"]
 R -.-> C["主动发布到社区"]
`,
  },
  {
    id: 'vidgrab-processing', note: 'ai-video-downloader-summarizer', icon: 'Workflow',
    title: pair('Two inputs, one evidence pipeline', '两条转写路径，一条证据链'),
    caption: pair('Reuse available captions; otherwise transcribe audio. Short text goes directly to synthesis; long text uses bounded map and reduce.', '可用字幕优先，否则转写音频；短文本直接总结，长文本有限并行分块，再按顺序汇总。'),
    anchor: pair('### 7.2 Processing long videos', '### 7.2 长视频分段处理'),
    code: lang => lang === 'en' ? `flowchart TD
 I["Uploaded media / authorized URL"] --> C["Available platform captions"]
 I --> A["Audio chunks: cloud ASR / permitted local fallback"]
 C --> T["Ordered timestamped transcript"]
 A --> T
 T -->|Short input| D["Direct synthesis"]
 T -->|Long input| M["Bounded parallel chunk notes"]
 D --> R["Structured learning result"]
 M -->|Restore source order| R
` : `flowchart TD
 I["上传素材 / 授权链接"] --> C["可用平台字幕"]
 I --> A["音频分段：云 ASR / 按模式回退本地"]
 C --> T["带原始时间位置的有序转写"]
 A --> T
 T -->|短文本| D["直接总结"]
 T -->|长文本| M["有限并行生成分块笔记"]
 D --> R["结构化学习结果"]
 M -->|恢复原始顺序| R
`,
  },
];
export const videoCaseEditorial = {
  'vidgrab-learning-loop': {
    form: 'learning journey with evidence feedback and explicit sharing',
    subtitle: pair('A product loop: understand, check, review, and retain.', '产品闭环：理解、检验、回看与留存。'),
    footer: pair('Storage and sharing extend the result; publication does not happen automatically.', '结果可以进入学习记录；社区发布是独立动作，不会自动公开私人视频。'),
  },
  'vidgrab-processing': {
    form: 'caption and ASR merge with bounded map-reduce branches',
    subtitle: pair('Processing within one application; this is not a durable worker queue.', '这是单应用内的处理流水线，还不是持久化 Worker 队列。'),
    footer: pair('Some ASR sentence times are estimated. Partial output and sampled visuals do not establish full coverage.', '部分 ASR 句级时间是估算值；阶段结果和抽样画面不代表全片已完整覆盖。'),
  },
};
export function drawVideoCase(diagram, layout, lang, canvas) {
  const { L, c, text, icon, path, circle, foot } = canvas;
  const node = (x,y,glyph,title,detail,width=210) => {
    circle(x,y,25,c.surface); icon(glyph,x-14,y-14,28);
    text(title,x,y+48,{align:'middle',width,size:18,weight:600,maxLines:1});
    text(detail,x,y+77,{align:'middle',width,size:15,color:c.muted,maxLines:2});
  };
  if (diagram.id === 'vidgrab-learning-loop') {
    node(120,165,'FileInput',L('Video input','输入视频'),L('Upload / authorized link','上传 / 授权链接'));
    node(385,165,'FileText',L('Learning material','整理学习材料'),L('Summary · chapters\nTranscript · mind map','总结、章节\n字幕与思维导图'));
    node(650,165,'MessagesSquare',L('Check understanding','检验理解'),L('Ask questions\nGenerate and submit quizzes','问答追问\n生成测验与作答'));
    node(915,165,'History',L('Review the source','回到原片'),L('Seek to the evidence\nCheck answers in context','定位证据时间点\n结合上下文核对'));
    path('M158 165H347',{arrow:true});path('M423 165H612',{arrow:true});path('M688 165H877',{arrow:true});
    path('M915 292V330H650V292',{arrow:true});
    text(L('Review, then ask again','回看后继续提问'),675,318,{width:235,size:14,color:c.muted});
    path('M385 292V390H150V432',{arrow:true});
    path('M385 390H800V432',{arrow:true,dashed:true});
    text(L('Save with an account','按账号留存'),175,416,{width:225,size:14,color:c.muted});
    text(L('Publish explicitly','主动确认发布'),565,416,{width:220,size:14,color:c.muted});
    node(150,470,'Database',L('Learning history','学习记录'),L('PostgreSQL records\nMedia in file storage','PostgreSQL 记录\n媒体存入文件存储'),240);
    node(800,470,'Users',L('Community','学习社区'),L('Share · discuss\nWithdraw · moderate','分享与讨论\n撤回与管理'),250);
    foot(layout.footer[lang],595);
  } else {
    text(L('Uploaded media / authorized URL','上传素材 / 授权链接'),520,112,{align:'middle',width:600,size:17,weight:600});
    path('M520 127V145H190V157',{arrow:true});path('M520 145H780V157',{arrow:true});
    node(190,190,'FileText',L('Available captions','可用字幕'),L('Reuse platform text\nSkip audio recognition','复用平台文字\n跳过语音识别'),250);
    node(780,190,'Workflow',L('Audio transcription','音频转写'),L('Bounded cloud chunks\nLocal fallback by mode','云端分段，控制并行\n按模式回退本地'),270);
    path('M190 290V330H477',{arrow:true});path('M780 290V330H563',{arrow:true});
    circle(520,330,25,c.surface);icon('ListChecks',506,316,28);
    text(L('Ordered transcript','有序转写'),520,378,{align:'middle',width:400,size:18,weight:600});
    text(L('Preserve original offsets and source order','保留原始时间位置与顺序'),520,407,{align:'middle',width:600,size:15,color:c.muted});
    path('M520 425V450H190V474',{arrow:true});path('M520 450H780V474',{arrow:true});
    text(L('Short text','短文本'),240,440,{width:190,size:14,color:c.muted});text(L('Long text','长文本'),622,440,{width:190,size:14,color:c.muted});
    node(190,510,'Sparkles',L('Direct synthesis','直接总结'),L('One summarization request','一次总结请求'),250);
    node(780,510,'Layers',L('Chunk notes','分块笔记'),L('Limited parallel calls\nRestore original order','限制并行调用\n恢复原始顺序'),270);
    path('M190 611V650H520V667',{arrow:true});path('M780 611V650H520',{arrow:false});
    circle(520,703,25,c.surface);icon('BookOpen',506,689,28);
    text(L('Structured learning result','结构化学习结果'),520,751,{align:'middle',width:700,size:18,weight:600});
    text(L('Synthesis · key points · chapters · mind map','综合总结、知识要点、章节与导图'),520,780,{align:'middle',width:800,size:15,color:c.muted});
    foot(layout.footer[lang],817);
  }
}
