import {productionEditorial} from './production-figures.mjs';
import {videoEditorial} from './video-figure.mjs';
import {conceptEditorial} from './concept-map.mjs';
import {taskEditorial} from './task-flow.mjs';
const p=(en,zh)=>({en,zh});
// Form is chosen for the content, not for visual variety alone.
export const editorial={
 ...conceptEditorial,
 ...taskEditorial,
 ...productionEditorial,
 ...videoEditorial,
 'environment-toolkit':{
  form:'responsibility branches',
  subtitle:p('Who defines the outcome, and which capability does what?','谁定义结果，各种能力分别负责什么？'),
  footer:p('Tools enable actions; inspect the evidence to decide whether the task is complete.','工具提供执行能力；是否完成任务，仍要检查交付依据。')
 },
 'environment-mcp':{
  form:'connection topology',
  subtitle:p('Clients live inside the host; each connects to its corresponding MCP server.','Client 位于 Host 内部，分别连接对应的 MCP Server。')
 },
 'scope-paths':{
  form:'two-path merge',
  subtitle:p('Different starting points lead to the same product questions.','不同起点，最终都需要回答同一组产品问题。'),
  footer:p('The paths can complement each other. Revisit uncertain parts when evidence changes.','两条路径可以互补；新证据出现时，回到仍不确定的部分。')
 },
 'scope-mvp':{
  form:'user journey',
  subtitle:p('Example: one practice session from source material to useful feedback.','示例：从输入材料，到获得可回顾的学习反馈。'),
  footer:p('Keep input on failure and offer retry. Files, history and sharing need separate justification.','失败时保留输入并允许重试；文件、历史与分享等扩展能力另行判断。')
 },
 'architecture-decisions':{
  form:'decision with revision loop',
  subtitle:p('Use product constraints to assess AI recommendations and test decisive assumptions.','用产品约束评估 AI 建议，验证会改变决定的关键假设。'),
  footer:p('An AI recommendation stays provisional until its decisive assumptions have been checked.','影响方向的假设未核实前，AI 推荐仍是候选方案。')
 },
 'architecture-boundaries':{
  form:'trust boundary',
  subtitle:p('Practice-session example: separate interaction, trusted checks and external generation.','单次练习示例：分清界面交互、可信校验与外部生成。'),
  footer:p('These are responsibilities, not a microservice requirement. The server can be part of one full-stack app.','图示表达职责，不要求拆成微服务；服务端可以位于同一全栈应用内。')
 },
 'architecture-failures':{
  form:'sequence with alternative outcomes',
  subtitle:p('Synchronous example: success and failure are alternative outcomes.','同步交互示例：成功与失败是两种不同结果。'),
  lanes:[p('Client','客户端'),p('Application server','应用服务端'),p('Generator','生成服务')],
  footer:p('A timeout ends this wait; it does not establish that upstream work has been cancelled.','超时结束的是本次等待，并不代表上游任务已取消。')
 }
};
