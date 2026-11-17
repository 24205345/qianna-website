import { resolveAccent, LIBRARY_TREATMENTS, SURFACE_TREATMENTS } from './visualTheme';

// Each experiment changes one decision while retaining the same material and task state.
export const TOPICS = [
  { id: 'structure', name: '页面结构', question: '页面怎样分区？' },
  { id: 'visual', name: '文字与视觉', question: '怎样让内容容易阅读？' },
  { id: 'navigation', name: '导航与内容', question: '怎样找到需要的信息？' },
  { id: 'input', name: '输入与操作', question: '怎样完成一次操作？' },
  { id: 'feedback', name: '状态与反馈', question: '等待或失败后怎么办？' },
  { id: 'responsive', name: '响应式与动效', question: '换个屏幕怎样使用？' },
];

const option = (value, label, en, request, requestEn) => ({ value, label, en, request, requestEn });
const experiment = (id, topic, title, en, area, initial, options, description, when, difference, observe, rules) => ({
  id, topic, title, en, area, initial, options, description, when, difference, observe, rules,
});

export const EXPERIMENTS = [
  experiment('regions', 'structure', '完整页面的组成', 'Page regions', 'product', 'complete', [
    option('complete', '完整分区', 'Complete regions', '保留页眉、主内容、辅助区域与页脚，使用清楚的阅读顺序。', 'Include a header, main content, supporting region and footer in a clear reading order.'),
    option('essential', '聚焦主内容', 'Essential regions', '收起辅助区域与页脚，主内容保留完整标题、说明和行动入口。', 'Hide supplementary regions and the footer while retaining the heading, introduction and main action.'),
  ], '页眉、主内容和页脚分别承担定位、完成任务与页面收尾；辅助区域放补充信息。', '先列出读者需要知道和完成的事，再决定哪些区域需要出现。', '页面区域是内容职责；卡片和分栏是组织这些内容的呈现方式。', '切换后，找到主任务的位置，再看辅助信息是否影响阅读。', ['标题说明页面用途；同一页面有清楚的主内容。', '收起辅助区域时，不能一起移除完成任务必需的信息。']),
  experiment('columns', 'structure', '单栏与主次分栏', 'Column hierarchy', 'content', 'lead', [
    option('single', '单栏阅读', 'Single column', '正文采用单栏，补充信息接在正文之后。', 'Use one reading column and place supplementary information after the main content.'),
    option('lead', '主次双栏', 'Lead and supporting columns', '桌面正文约占三分之二，次栏放摘要；窄屏先展示正文。', 'Allocate about two thirds to the main content and the remainder to a summary; put main content first on narrow screens.'),
    option('equal', '等宽双栏', 'Equal columns', '桌面使用等宽双栏，以相近权重呈现正文与参考内容；窄屏纵向排列。', 'Use equal-width columns for equally important content, stacked on narrow screens.'),
  ], '栏宽会影响信息权重、文字行长和阅读顺序。', '正文与参考材料需要同时查看时使用双栏；连续阅读可选择单栏。', '双栏说明区域数量，主次双栏还说明它们的重要程度。', '比较正文与摘要各自占多少空间，以及窄屏上的先后顺序。', ['同一内容沿同一阅读边线对齐。', '窄屏按任务顺序堆叠，不能挤成两条细列。']),
  experiment('sidebar', 'structure', '侧栏与工作区域', 'Sidebar workspace', 'workspace', 'sidebar', [
    option('sidebar', '左侧目录', 'Left sidebar', '桌面将资料目录放在左侧，编辑和结果放在主工作区。', 'Place the source directory on the left and editing and results in the main workspace.'),
    option('inline', '顶部目录', 'Inline directory', '将资料目录排列在工作区上方，主内容使用完整宽度。', 'Place the directory above the workspace and let the main content use the available width.'),
  ], '侧栏承载稳定的目录或工具，主工作区承载当前任务。', '需要频繁切换资料或功能，且不想离开当前任务时。', '侧栏是布局位置；侧栏里可以放导航，也可以放辅助材料。', '切换布局后，输入的材料和生成结果应继续保留。', ['保留当前选中项。', '窄屏将目录收纳到主内容上方，不遮挡输入。']),
  experiment('collection', 'structure', '卡片、列表与表格', 'Cards, list and table', 'content', 'cards', [
    option('cards', '图文卡片', 'Visual cards', '项目以带封面和简短摘要的卡片排列，保留资料选择与详情入口。', 'Display projects as cards with covers, summaries, selection and detail actions.'),
    option('list', '紧凑列表', 'Compact list', '同一批项目改用列表，保留标题、分类、摘要与详情入口。', 'Show the same projects in a compact list with titles, categories, summaries and detail actions.'),
    option('table', '字段表格', 'Comparison table', '将项目按标题、分类和更新时间对齐为表格，便于逐项比较。', 'Align projects in a table by title, category and updated date for comparison.'),
  ], '卡片强调单条内容，列表利于快速扫读，表格利于比较一致的字段。', '先判断用户是浏览、寻找，还是需要逐项比较。', 'Bento 是网格中不同尺寸卡片的排布方式，不能替代列表或表格的内容职责。', '同样六条资料换一种呈现，比较封面、摘要与日期哪个更容易被看见。', ['切换呈现时保留筛选条件和当前项目。', '表格有列标题，窄屏在表格区域内滚动。']),

  experiment('type', 'visual', '标题与文字层级', 'Type hierarchy', 'content', 'clear', [
    option('flat', '接近的字号', 'Flat hierarchy', '标题与正文采用接近的字号，保留标题语义。', 'Use similar visual sizes for headings and body text while retaining heading semantics.'),
    option('clear', '清楚的层级', 'Clear hierarchy', '主标题、章节标题和正文形成清楚的字号层级，正文保持可读。', 'Establish distinct sizes for the main title, section headings and readable body text.'),
    option('display', '突出主标题', 'Display heading', '放大主标题，次级标题与正文保持克制，长标题自然换行。', 'Emphasize the main heading while keeping secondary headings and body text restrained; wrap long titles naturally.'),
  ], '文字层级让读者先知道主题，再找到章节与具体内容。', '文章、项目说明和结果页都需要明确主次。', '视觉上放大文字与使用正确的标题层级是两件事，需要同时考虑。', '先只扫标题，判断能否看出文章结构。', ['保留标题的语义层级。', '长中文不截断；放大文字后仍可阅读。']),
  experiment('rhythm', 'visual', '行长、行距与留白', 'Reading measure and spacing', 'content', 'comfortable', [
    option('compact', '紧凑', 'Compact reading', '收紧正文行距和段间距，适合短内容的快速扫读。', 'Use compact line and paragraph spacing for short, scannable content.'),
    option('comfortable', '舒展', 'Comfortable reading', '限制正文行长，使用舒展行距和清楚的段间距。', 'Limit body measure and use comfortable line height with distinct paragraph spacing.'),
    option('wide', '较长的行', 'Wide measure', '增加正文行宽，对照较长文字行对阅读的影响。', 'Increase the text measure to compare the effect of long lines on reading.'),
  ], '字号相同，行长、行距与段间距也会改变阅读节奏。', '长文优先照顾连续阅读；工具列表可适当提高密度。', '行距影响同一段里的文字，段间距帮助区分内容组。', '用相同段落比较换行和段落分组，而不是只看空白多少。', ['标题与正文沿同一阅读边线。', '窄屏按可用宽度自然换行。']),
  experiment('color', 'visual', '强调色与状态色', 'Accent and semantic colors', 'workspace', 'semantic', [
    option('quiet', '中性呈现', 'Neutral palette', '以中性灰区分层级，状态仍通过明确文字和图形表达。', 'Use neutral tones for hierarchy and communicate states with explicit text and symbols.'),
    option('semantic', '语义状态色', 'Semantic states', '成功、提醒与错误使用不同语义色，并保留状态文字。', 'Use distinct semantic colors for success, warning and error with visible text labels.'),
    option('accent', '强调主操作', 'Primary action accent', '强调色集中用于主操作和当前项，状态信息仍保留独立名称。', 'Reserve the accent for the primary action and current selection; keep explicit state labels.'),
  ], '强调色表达操作优先级，状态色表达成功、提醒或错误。', '页面有多个操作和反馈时，用颜色辅助区分职责。', '品牌色不等于成功色；颜色不能成为判断状态的唯一依据。', '比较主操作与三种状态是否能一眼区分；再只读文字核对含义。', ['状态同时有文字说明。', '装饰色不抢占主要操作的注意力。']),
  experiment('image', 'visual', '图片比例与裁切', 'Image ratio and fit', 'content', 'cover', [
    option('cover', '铺满封面', 'Cover crop', '封面固定横向比例，图片铺满并居中裁切。', 'Use a fixed landscape cover ratio with centered cover cropping.'),
    option('contain', '完整显示', 'Contain image', '封面固定横向比例，完整显示图片并允许留白。', 'Keep the landscape frame and contain the entire image with letterboxing where needed.'),
    option('portrait', '竖向封面', 'Portrait cover', '使用竖向封面比例，同一图片铺满裁切。', 'Use a portrait cover ratio and cover-crop the same image.'),
  ], '容器比例决定图片占多大空间，裁切方式决定哪些画面能被保留。', '作品集封面需要整齐时可统一比例；图表和原稿通常需要完整展示。', '改变图片容器比例，与改变图片如何装入容器，是不同的决定。', '保持同一组封面，切换比例与裁切方式，对照图形、线条和画框边缘是否被裁掉。', ['不拉伸图片。', '重要信息被裁掉时，提供完整查看入口。']),

  experiment('tabs', 'navigation', '页签与页内导航', 'Tabs and section links', 'content', 'tabs', [
    option('tabs', '页签切换', 'Tabs', '以页签在同一位置切换项目资料、阅读笔记与练习工作台，保留各自状态。', 'Use tabs to switch between projects, reading and practice in one location while preserving their states.'),
    option('anchors', '页内定位', 'Section links', '项目、阅读与练习三个章节同时保留在页面中，导航链接定位到对应章节。', 'Keep projects, reading and practice in the page and use section links to navigate to them.'),
  ], '页签在同一位置切换内容，页内链接移动到已存在的章节。', '多个内容面板不需要同时阅读时可用页签；连续文章可用页内目录。', '站点导航组织全站入口，页签改变当前区域，筛选改变当前数据集合。', '点击“项目资料”“阅读笔记”与“练习工作台”，观察是内容替换还是滚动位置变化。', ['页签有当前项和对应面板，支持方向键。', '页内定位保留三个章节，并让目标标题接收焦点。']),
  experiment('filter', 'navigation', '搜索与分类筛选', 'Search and filtering', 'content', 'combined', [
    option('search', '文字搜索', 'Text search', '允许按项目标题和摘要搜索，并显示结果数量。', 'Search project titles and summaries and show the result count.'),
    option('category', '分类筛选', 'Category filter', '按项目分类筛选，并提供“全部”入口。', 'Filter by category and provide an All option.'),
    option('combined', '组合条件', 'Combined filters', '搜索与分类共同过滤同一批内容，提供清除条件入口。', 'Combine search and category filters on the same dataset with a clear-filters action.'),
  ], '搜索适合已知道关键词的用户，分类帮助按范围探索。', '资料或项目数量增加，用户开始需要缩小查找范围时。', '没有数据与搜索没有匹配结果不同；后者需要保留搜索条件。', '输入“阅读”，再选择一个分类，观察结果数量；试试没有匹配项的词。', ['输入和筛选在更换样式后保留。', '无匹配结果时提供清除条件，而不是“创建第一条”。']),
  experiment('pagination', 'navigation', '排序与翻页', 'Sorting and pagination', 'workspace', 'pages', [
    option('pages', '按页查看', 'Pagination', '资料按页呈现，显示当前页与总页数，切换筛选后回到第一页。', 'Paginate sources with current and total pages; return to the first page when filters change.'),
    option('more', '加载更多', 'Load more', '先显示部分资料，点击加载更多逐步增加，直到全部显示。', 'Show an initial subset and reveal more sources on request until all are visible.'),
  ], '排序决定内容先后，分页和加载更多决定一次显示多少内容。', '条目较多，需要稳定定位或分批浏览时。', '表格是数据结构，分页是浏览方式；它们可以组合使用。', '先改变排序，再翻页或加载更多，核对内容顺序和数量。', ['当前页超出范围时回到有效页。', '加载更多达到末尾后给出明确结束状态。']),
  experiment('disclosure', 'navigation', '折叠与展开', 'Accordion and disclosure', 'content', 'accordion', [
    option('accordion', '按需展开', 'Accordion', '次要说明通过折叠标题展开，标题指示当前展开状态。', 'Reveal secondary explanations through accordion headings with an expanded-state indicator.'),
    option('expanded', '全部展示', 'All content visible', '直接展示所有说明，方便连续阅读和比较。', 'Show all explanations for continuous reading and comparison.'),
  ], '折叠让读者按需查看次要内容，展开显示利于连续阅读。', 'FAQ、辅助说明或需要保留入口的长内容。', '折叠收起内容，页签在多个面板间切换；关键操作不能藏得难以发现。', '打开一个说明，再调整样式，核对展开状态仍然保留。', ['标题是可操作按钮。', '收起后入口仍说明里面是什么。']),

  experiment('validation', 'input', '输入与表单校验', 'Form validation', 'workspace', 'submit', [
    option('submit', '提交时检查', 'Validate on submit', '提交时检查项目名称与链接，错误放在对应字段下，并保留输入。', 'Validate the project name and URL on submit, place errors below each field and retain input.'),
    option('blur', '离开字段时检查', 'Validate on blur', '离开已填写的字段时提供校验反馈，提交时检查全部字段。', 'Validate completed fields on blur and check all fields on submit.'),
  ], '标签说明要填什么，辅助文字说明格式，校验帮助发现并修正问题。', '填写资料、创建项目或保存设置时。', '占位文字会在输入后消失，不能代替字段标签；错误也不能只靠红色边框。', '留空提交，再填一个错误链接，修正后重新保存。', ['错误说明原因与修正方法，焦点移到首个错误字段。', '保存期间阻止重复提交；失败后保留已填写的内容。']),
  experiment('choice', 'input', '单选、多选与开关', 'Radio, checkbox and switch', 'workspace', 'radio', [
    option('radio', '单选题型', 'Radio group', '题型只能选择一种，选择后在摘要中显示当前值。', 'Allow exactly one question type and reflect the current choice in the summary.'),
    option('checkbox', '多选题型', 'Checkbox group', '题型可以选择多种，摘要列出全部已选项。', 'Allow multiple question types and list all selections in the summary.'),
    option('switch', '即时设置开关', 'Immediate switch', '使用开关立即控制解析是否可见，切换后不需要额外提交。', 'Use an immediate switch to control explanation visibility without an additional submit action.'),
  ], '单选处理互斥选项，多选允许组合，开关控制一项即时生效的设置。', '先确定选项能否共存、是否立即生效，再选择控件。', '开关不是两项答案的单选题；复选框也不总意味着立即保存。', '尝试选两项题型，再切换到开关，观察能表达的决定有什么不同。', ['整条标签可点击。', '用文字显示当前选择，不能只看控件颜色。']),
  experiment('combobox', 'input', '下拉选择与搜索选择', 'Select and combobox', 'workspace', 'native', [
    option('native', '原生下拉', 'Native select', '用原生下拉选择资料来源，保留明确标签。', 'Choose a source through a labeled native select.'),
    option('searchable', '输入后查找', 'Searchable combobox', '可输入关键词筛选资料候选，支持方向键、Enter 确认和 Escape 关闭。', 'Filter source suggestions by typing and support arrow navigation, Enter selection and Escape dismissal.'),
  ], '选项较少时下拉容易使用，选项较多时可以提供输入搜索。', '选择资料、城市或已有项目，输入必须对应一个候选项时。', '搜索输入查找内容；组合框还需要确认一个有效的选项。', '输入“空间”缩小候选，再用方向键和 Enter 完成选择。', ['输入文字与已确认的值分开处理。', '清空搜索可以重新找到所有候选项。']),
  experiment('overlay', 'input', '弹窗、抽屉与弹出面板', 'Dialog, drawer and popover', 'workspace', 'dialog', [
    option('dialog', '居中弹窗', 'Modal dialog', '点击资料详情打开居中弹窗，提供关闭按钮、Escape 关闭与焦点返回。', 'Open source details in a centered modal dialog with a close button, Escape dismissal and focus restoration.'),
    option('drawer', '侧边抽屉', 'Side drawer', '点击资料详情打开右侧抽屉，保留背景上下文，关闭后返回触发入口。', 'Open source details in a right-side drawer retaining background context and restoring trigger focus on close.'),
    option('popover', '局部弹出面板', 'Local popover', '点击资料详情在入口附近展开简短面板，点击外部或按 Escape 可收起。', 'Show a concise popover near the source action and dismiss it on outside click or Escape.'),
  ], '浮层让用户在保留当前页面的情况下查看补充信息或完成局部任务。', '资料详情、简短帮助或需要集中处理的编辑任务。', 'Tooltip 适合简短解释；含有链接或操作的内容需要可交互面板。', '分别打开同一份资料详情，按 Escape，再检查焦点是否回到入口。', ['有明确关闭入口。', '模态浮层内保持键盘焦点，关闭后恢复触发位置。']),

  experiment('loading', 'feedback', '加载与进度', 'Loading and progress', 'workspace', 'skeleton', [
    option('spinner', '等待指示', 'Spinner', '加载时显示等待指示和动作文字，完成后替换为结果。', 'Show a spinner with action text while loading and replace it with results when complete.'),
    option('skeleton', '骨架占位', 'Skeleton', '加载时用骨架屏保留结果的主要形状，完成后替换内容。', 'Preserve the main result structure with skeleton placeholders during loading, then replace them with content.'),
    option('progress', '确定进度', 'Determinate progress', '任务能报告进度时显示进度条与阶段文字，结束后明确显示完成。', 'Show a determinate progress bar with stage text when progress is known, and explicitly indicate completion.'),
  ], '等待指示告诉用户任务仍在进行；骨架保留布局；确定进度需要任务提供实际进度。', '请求、上传或生成需要等待时。', '未知进度不能随意显示百分比；动画时长不等于后台任务时长。', '点击开始加载，观察占位、处理阶段和完成结果的变化。', ['忙碌时阻止重复开始。', '完成后保留可读结果，而不是只闪过成功提示。']),
  experiment('empty', 'feedback', '空内容与无匹配结果', 'Empty and no-result states', 'workspace', 'empty', [
    option('empty', '尚无资料', 'No source yet', '首次没有资料时说明用途，并提供添加示例资料入口。', 'Explain an initially empty workspace and offer an action to add a sample source.'),
    option('no-results', '搜索无匹配', 'No matching results', '搜索无匹配时保留关键词与筛选条件，提供清除条件入口。', 'Retain search and filters when there are no matches and provide a clear-filters action.'),
    option('ready', '已有资料', 'Content available', '有资料时展示列表，并保留继续添加或筛选的入口。', 'Show the source list when content exists and retain add and filter actions.'),
  ], '空状态说明目前缺少什么，并帮助用户采取下一步。', '首次使用、搜索没有匹配、内容被清空时。', '“还没有内容”需要创建入口，“没有匹配”需要调整查询。', '比较两种空状态的说明和按钮，再操作它们提供的下一步。', ['不把请求失败误报为没有资料。', '清除筛选保留原始数据。']),
  experiment('recovery', 'feedback', '成功、失败与重试', 'Failure recovery', 'workspace', 'retry', [
    option('success', '正常完成', 'Successful completion', '处理成功后在操作附近显示确认，并保留可查看的结果。', 'Confirm successful processing near the action and retain the result for inspection.'),
    option('retry', '失败后重试', 'Retry after failure', '处理失败时说明原因，保留材料并提供重试；重试后展示结果。', 'Explain processing failure, retain the source and offer retry; show results after a successful retry.'),
    option('partial', '保留部分结果', 'Retain partial output', '处理到一半失败时保留已生成部分，标明未完成并允许重新开始。', 'Retain partial output after a mid-task failure, mark it incomplete and allow a fresh attempt.'),
  ], '反馈不仅要说明结果，还要交代下一步能做什么。', '保存、加载或生成可能失败的任务。', 'Toast 是短暂通知；持续阻止任务的问题应留在相关区域，直到修正。', '输入自己的材料，触发模拟失败，再重试并核对输入仍在。', ['失败不能显示完成。', '只有已经生成内容时才声称保留了部分结果。']),
  experiment('stream', 'feedback', 'AI 输出与中断', 'Streaming and interruption', 'workspace', 'stream', [
    option('stream', '逐段显示', 'Stream partial output', '逐段展示 AI 结果，支持暂停、继续和取消；取消后保留已显示部分并标记未完成。', 'Reveal AI output in chunks with pause, resume and cancel; retain visible partial output and mark it incomplete on cancellation.'),
    option('buffered', '完成后显示', 'Buffered result', '处理中只显示阶段信息，完成后一次展示结果；取消时明确说明未生成完整结果。', 'Show stage information during processing and reveal the result on completion; clearly report incomplete generation on cancellation.'),
  ], '流式输出让结果逐步可见，任务状态仍需独立说明。', 'AI 生成或其他能分段返回内容的长任务。', '暂停可以继续，取消结束本次任务；出现文字不代表结果已经完整。', '生成两段后暂停，再继续；另开一次任务并取消，比较留下了什么。', ['中断后停止后续更新。', '保留原始输入，重试重新开始，不把旧结果当作新结果追加。']),

  experiment('responsive', 'responsive', '宽度与内容顺序', 'Responsive order', 'workspace', 'main-first', [
    option('main-first', '主任务优先', 'Main task first', '桌面并排显示目录与主内容，窄屏先展示主任务，再展示资料目录；输入与选择继续保留。', 'Show the directory beside the main content on desktop; put the main task before the source directory on narrow screens and retain input and selections.'),
    option('source-first', '材料优先', 'Source first', '桌面并排显示目录与主内容，窄屏先展示资料目录，再展示主任务；输入与选择继续保留。', 'Show the directory beside the main content on desktop; put the source directory before the main task on narrow screens and retain input and selections.'),
  ], '响应式改变的是可用空间和内容关系，需要保留任务顺序与操作状态。', '同一页面需要在电脑、平板和手机上使用时。', '缩放只改变显示比例，真实窄屏会触发布局重排。', '将画布切到手机宽度，再切换顺序；已填内容应继续保留。', ['以画布实际宽度重排。', '不通过隐藏主任务来获得更整齐的窄屏。']),
  experiment('sticky', 'responsive', '吸顶与页面滚动', 'Sticky and normal flow', 'content', 'flow', [
    option('flow', '随页面滚动', 'Normal document flow', '内容导航按正常文档顺序排列，随页面内容一起滚动；站点导航保持可用。', 'Keep content navigation in normal document flow so it scrolls with the content; keep site navigation available.'),
    option('sticky', '滚动时吸顶', 'Sticky navigation', '内容导航到达站点导航下方后吸顶，背景保持可读且不遮挡定位目标。', 'Stick content navigation below the site header when reached, with a readable background and unobscured anchor targets.'),
  ], '吸顶让局部导航在滚动中保持可用，正常流让它随内容移出。', '页面较长且需要反复定位不同章节时。', '固定定位始终相对视口；吸顶先参与正常排版，再在边界内停留。', '在预览画布内滚动文章，比较三个内容入口是否停留在站点导航下方。', ['吸顶区域不占满窄屏。', '定位到章节后标题不被导航遮挡。']),
  experiment('motion', 'responsive', '过渡与交互反馈', 'Motion feedback', 'product', 'lift', [
    option('none', '立即变化', 'Immediate change', '状态立即变化，不添加入场或位移动画。', 'Apply state changes immediately without entrance or movement animation.'),
    option('fade', '短暂淡入', 'Brief fade', '新内容以短暂淡入出现，主任务与焦点保持稳定。', 'Reveal new content with a brief fade while preserving the main task and focus.'),
    option('lift', '轻微位移', 'Small upward motion', '新内容以短距离上移和淡入出现，保持主任务与焦点稳定。', 'Reveal content with a small upward fade while preserving the main task and focus.'),
  ], '动效可以说明状态变化和内容关系，幅度和时长需要服务于具体动作。', '内容出现、面板切换或操作反馈时。', '过渡连接两个状态；入场动画描述内容如何出现；二者都不是任务执行进度。', '修改选项后点重播动画，再操作卡片，比较运动方向与结束状态。', ['结束后布局稳定。', '系统要求减少动态效果时直接展示，不依赖运动传达状态。']),
  experiment('access', 'responsive', '文字放大与减少动态', 'Text scaling and reduced motion', 'content', 'standard', [
    option('standard', '常规显示', 'Standard display', '保持可读字号、可见键盘焦点与明确控件标签。', 'Use readable text, visible keyboard focus and explicit control labels.'),
    option('large', '放大文字', 'Larger text', '放大正文后允许自然换行，不截断按钮和字段标签。', 'Allow natural wrapping when text is enlarged without truncating buttons or field labels.'),
    option('reduced', '减少动态', 'Reduced motion', '减少动态效果时停止位移和循环动画，用文字与静态状态表达变化。', 'Disable movement and looping animation in reduced-motion mode and communicate changes through text and static states.'),
  ], '可用性还包括键盘、较大文字、触屏与不同运动偏好。', '这些能力应贯穿所有页面与组件。', '可访问性不是一种视觉主题；切换显示偏好后仍要能完成同一任务。', '用 Tab 浏览控件并查看焦点，再放大文字和收窄画布。', ['操作不能只依赖鼠标悬停。', '遵守系统减少动态效果的偏好。']),
];

export const DEFAULT_SETTINGS = Object.fromEntries(EXPERIMENTS.map(item => [item.id, item.initial]));
export const getExperiment = id => EXPERIMENTS.find(item => item.id === id) || EXPERIMENTS[0];
export const getOption = (item, settings) => item.options.find(option => option.value === settings[item.id]) || item.options.find(option => option.value === item.initial);

export const STUDY_TERMS = Object.fromEntries(EXPERIMENTS.map(item => [item.id, {
  id: item.id, cn: item.title, en: item.en,
  category: TOPICS.find(topic => topic.id === item.topic).name,
  desc: item.description, promptCn: getOption(item, DEFAULT_SETTINGS).request,
  promptEn: getOption(item, DEFAULT_SETTINGS).requestEn,
  tailwind: item.en, lessonId: item.id,
}]));

export const MATERIALS = [
  { id: 'space', title: '空间与日常', category: '设计', date: '2026-10-28', summary: '从城市的空隙观察日常生活，整理尺度、路径与停留的关系。', en: 'Space and everyday life' },
  { id: 'reading', title: '带着问题阅读', category: '阅读', date: '2026-11-08', summary: '把一个值得追问的问题留下，再回到材料中核对依据。', en: 'Reading with a question' },
  { id: 'learning', title: '学习工具原型', category: '工具', date: '2026-11-02', summary: '从资料输入到练习反馈，设计一个可以走完的小任务。', en: 'Learning tool prototype' },
  { id: 'light', title: '光与材料', category: '设计', date: '2026-10-18', summary: '记录光线如何改变材料表面，以及观察者对空间的判断。', en: 'Light and material' },
  { id: 'evidence', title: '观点与依据', category: '阅读', date: '2026-11-10', summary: '区分材料中的描述与判断，为每个主要观点寻找可核对的依据。', en: 'Claims and evidence' },
  { id: 'notes', title: '笔记整理工作台', category: '工具', date: '2026-11-05', summary: '用稳定的目录、搜索和状态反馈连接材料与正在进行的任务。', en: 'Notes workspace' },
];

const KEYBOARD_RULE = '所有控件可通过键盘使用，焦点清楚；浮层关闭后返回入口。';
const KEYBOARD_RULE_EN = 'Support keyboard operation with visible focus and restore trigger focus when overlays close.';

export function buildStudyPrompt({ lesson, settings, language, scope, term, config, library, surface, hover, includeTech, reducedMotion }) {
  const en = language === 'en';
  const selected = getOption(lesson, settings);
  const scopeLabel = en ? { page: 'Page brief', part: 'Selected region', change: 'Current adjustment' }[scope] : { page: '整页需求', part: '当前部位', change: '本次调整' }[scope];
  const lines = [`# ${scopeLabel}`];
  if (scope === 'part' && term) {
    lines.push(en ? `Region: ${term.en}.` : `部位：${term.cn}（${term.en}）。`, en ? term.promptEn : term.promptCn);
  } else {
    lines.push(en ? 'Extend the existing preset website using its navigation, hero, components and content. Keep one continuous website.' : '在当前预设网页上优化补充，沿用现有导航、首屏、组件风格与内容，保持同一个完整网页。');
    if (scope === 'page') {
      lines.push(en ? 'Retain navigation, hero, actions, metrics, feature cards, FAQ and footer. Add project browsing, reading notes and practice as internal sections using the same visual system.' : '保留导航、首屏、行动入口、指标、特性卡片、折叠问答与页脚；在其中加入项目资料、阅读笔记与练习工作台，使用同一套视觉样式。');
      const ids = ['regions', 'columns', 'collection', 'tabs', lesson.id];
      if (config.layout === 'dashboard') ids.push('sidebar');
      for (const item of EXPERIMENTS.filter(item => ids.includes(item.id))) lines.push(`- ${en ? item.en : item.title}: ${en ? getOption(item, settings).requestEn : getOption(item, settings).request}`);
      if (config.showSkeleton) lines.push(en ? '- Include the optional Skeleton Loader style sample.' : '- 保留可选的骨架屏（Skeleton Loader）样式示例。');
      if (config.showToast) lines.push(en ? '- Include the optional Toast Notification style sample.' : '- 保留可选的轻提示（Toast Notification）样式示例。');
    } else lines.push(en ? `Change only ${lesson.en}: ${selected.requestEn}` : `本轮只调整“${lesson.title}”：${selected.request}`);
  }
  lines.push('', en ? '## Visual direction' : '## 视觉约定');
  lines.push(en ? `Style reference: ${library}; surface: ${surface}; accent: ${resolveAccent(config)}; ${config.darkMode ? 'dark' : 'light'} canvas; radius: ${config.radius}.` : `风格参考：${library}；表面质感：${surface}；强调色：${resolveAccent(config)}；${config.darkMode ? '深色' : '浅色'}画布；圆角：${config.radius}。`);
  const libraryTreatment = LIBRARY_TREATMENTS[config.designSystem];
  const surfaceTreatment = SURFACE_TREATMENTS[config.visualStyle];
  if (libraryTreatment) lines.push(en ? `Controls and spacing: ${libraryTreatment.en}.` : `组件形态与间距：${libraryTreatment.cn}。`);
  if (surfaceTreatment) lines.push(en ? `Surface finish: ${surfaceTreatment.en}; retain the selected control geometry and spacing.` : `表面处理：${surfaceTreatment.cn}；保留所选组件的形态与间距。`);
  const layout = { bento: 'Bento Grid Layout', split: 'Split-Screen Hero', dashboard: 'Sidebar + Main Workspace' }[config.layout];
  lines.push(en ? `Page layout: ${layout}.` : `整体布局：${layout}。`);
  lines.push(en ? 'The library name is a visual reference, not a requirement to replace the project component library.' : '组件库名称作为视觉参考；沿用项目现有组件与技术栈。');
  lines.push('', en ? '## Behavior and completion' : '## 行为与边界');
  lines.push(en ? 'Retain entered material, selection, filters and visible results when changing presentation. Explain failures and provide an appropriate recovery action.' : '改变呈现时保留材料、选择、筛选条件和已有结果；失败时说明原因并提供相应恢复入口。');
  lines.push(en ? KEYBOARD_RULE_EN : KEYBOARD_RULE);
  if (!reducedMotion && settings.access !== 'reduced' && settings.motion !== 'none') {
    const entrance = { spring: ['弹簧回弹', 'Spring entrance'], stagger: ['依次入场', 'Staggered entrance'], bounce: ['缩放回弹', 'Overshoot entrance'], fade: ['柔和淡入', 'Ease-out fade'] }[config.motionType];
    if (entrance) lines.push(en ? `Entrance: ${entrance[1]}.` : `入场方式：${entrance[0]}。`);
  }
  lines.push(reducedMotion || settings.access === 'reduced' || settings.motion === 'none'
    ? (en ? 'Display states immediately without movement or looping animation; respect system reduced-motion preferences.' : '立即展示状态，关闭位移与循环动画，并遵守系统减少动态效果的偏好。')
    : (en ? `Hover reference: ${hover}. Keep motion brief, preserve focus and respect system reduced motion.` : `悬停参考：${hover}。动效短暂、结束后稳定，保留焦点并遵守系统减少动态效果的偏好。`));
  if (includeTech) lines.push('', en ? '## Optional implementation reference' : '## 可选实现参考', en ? `If the existing project uses React and Framer Motion, evaluate spring parameters stiffness: ${config.stiffness}, damping: ${config.damping}. The lab uses a CSS approximation; validate the actual implementation.` : `现有项目使用 React 与 Framer Motion 时，可评估弹簧参数 stiffness: ${config.stiffness}、damping: ${config.damping}。本实验室以 CSS 近似预览，成品实现需要单独验证。`);
  lines.push('', en ? 'Replace placeholder content with your own. Previews are local examples and do not establish backend or model support.' : '将占位内容替换为自己的内容；预览是本地示例，不代表已接入后台或模型。');
  return lines.join('\n');
}
