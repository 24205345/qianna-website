> Engineering reference archive, October 30, 2026. This preserves implementation detail before the concept-map rewrite; it is not the current public chapter.

# 【AI Dev Workflow · 08】 From Demo to an Enterprise AI Platform: Reliability, Concurrency, and Long-Running Tasks

> **Reading context**
> The first seven stages turn an idea into a usable product with persistence and deployment. Production introduces another set of questions: does it work for unfamiliar users? Can an interrupted task recover? When the model makes a mistake, can the system protect permissions, money, data, and budgets?

**A demo proves that a path can work. A production product must keep delivering within an agreed scope and handle situations outside that scope.** An enterprise platform also lets multiple teams use the product under shared identity, authorization, audit, and operational rules.

Two workloads carry the discussion: an internal knowledge and service assistant explains authorization, tools, and external effects; long-video extraction and summarization explain first results, segment parallelism, scheduling, and recovery. Start the assistant with read-only answers before confirmed writes. Establish video extraction before validating speed, coverage, and cost. Let the task determine whether agents help. Architectures, thresholds, and examples here are teaching designs to validate against your workload.

Read in this order: value and boundaries → platform architecture → execution and recovery → data and security → evaluation and releases → interaction latency and concurrency → long-video processing → operations and delivery. Primary sources appear beside the relevant discussion. Distinguish framework capabilities, guarantees the application must enforce, and metrics that require measurement. References were checked on October 30, 2026.

---

## 1. Define production requirements before choosing how much AI to use

### Turn “it answers” into a business outcome

Choose a task with an accountable owner and compare it with the current manual process or existing software. Record users, inputs, deliverables, error consequences, and human handoff. Better benchmark scores justify investment when they improve business outcomes.

| Question | Example for the internal assistant | Evidence to retain |
| :--- | :--- | :--- |
| Who uses it, and when? | Employees check travel policy; service teams receive tickets | Representative tasks, access rules, business owner |
| What counts as completion? | Cite the applicable policy; create exactly one correct ticket after confirmation | Acceptance rules and final records in the business system |
| What value does it create? | Reduce resolution time while controlling errors and review effort | Human baseline, completion rate, cost per successful task |
| Which failures must be blocked? | Unauthorized access, duplicate writes, fabricated citations, sensitive data disclosure | Enforcement rules, adversarial cases, response procedures |
| Who takes over? | A named service queue receives completed steps and unresolved issues | Ownership, response targets, operating instructions |

Separate **availability**, which measures whether the service can be used; **task quality**, which measures correctness; and **business value**, which measures time saved, revenue gained, or losses reduced. HTTP 200, fluent prose, and positive feedback cannot individually establish task success.

### Choose between code, workflows, and agents

| Task characteristics | Starting candidate | Example and tradeoff |
| :--- | :--- | :--- |
| Explicit rules and state transitions | Application code, rules, database transactions | Quotas, authorization, order transitions; code enforces the rules |
| Mostly fixed steps with some language understanding | A workflow with model calls at selected steps | Parse → retrieve → generate → validate; easier to evaluate and debug by stage |
| New information determines the next action | A bounded single agent | Investigate across sources; allow tool selection within action and budget limits |
| Subtasks are independent and measured benefits justify coordination | Multiple agents or a parallel workflow | Research separate sources; account for coordination, synthesis, and extra calls |

Workflows can include branches, loops, and approvals; a DAG is one representation. An agent can choose actions dynamically within its authority while runtime code enforces execution, authorization, and state transitions. Anthropic likewise recommends starting with simple, composable patterns and adding complexity when the task warrants it. [Building effective agents](https://www.anthropic.com/research/building-effective-agents)

**Deliverable:** a one-page production task brief with a human baseline, success conditions, risk boundaries, ownership, and the architecture decision.

---

## 2. Establish the platform structure

An enterprise system does not automatically require microservices, Kubernetes, or self-hosted models. A small team can start with a modular application, relational database, object storage, and a background worker. Split services when execution time, isolation, or scaling requirements justify the operational work.

First trace the boundaries a task crosses. The model proposes actions; the server-side executor and tool gateway decide whether to execute them and retain verifiable business results. These responsibilities can live in one application. Policies, versions, telemetry, and audit apply throughout the path.

[![Planning and execution have different boundaries — The model proposes actions; the server authorizes execution and records business effects.](/notes/enterprise-ai-production/production-boundaries.en-e5369b115c3b.webp)](/notes/enterprise-ai-production/production-boundaries.en-e5369b115c3b.webp)

*The model proposes actions; the server authorizes execution and records business effects. [View full-size](/notes/enterprise-ai-production/production-boundaries.en-e5369b115c3b.webp)*

Each responsibility requires the following capabilities and controls:

| Layer | Responsibilities | Boundary to enforce |
| :--- | :--- | :--- |
| Work interface | Input, progress, evidence, confirmation, cancellation, handoff | Distinguish accepted requests from completed tasks; retain status after refresh |
| Identity and access | SSO, organization membership, roles, admission limits | Resolve tenants from verified identity; authorize resources on the server |
| Orchestration | Task state, queues, approvals, retries, deadlines | Enforce transitions, budgets, and recovery entry points |
| Models and context | Prompts, routing, structured output, retrieval, memory | Model output proposes actions and must pass validation |
| Tool gateway | Allowlisted tools, business checks, credentials, idempotency | Reauthorize each execution; withhold broad administrator credentials from the model |
| Data and evidence | Business records, original sources, indexes, execution history, results | Distinguish authoritative state, derived indexes, and generated content |

**A task moves through:** authentication and membership verification → task creation and budget allocation → queue → worker → authorized context assembly → proposed action → tool validation and execution → durable progress → verified result.

Keep identifiers distinct: `tenant_id` identifies an organization, `user_id` an actor, `task_id` a business task, `attempt_id` an execution attempt, `operation_id` a business mutation, and `trace_id` its observability chain. A retry may create another attempt and trace; the same business operation must retain its stable idempotency identifier.

Expose meaningful states: queued, running, awaiting approval, reconciling an unknown result, partially completed, failed, and canceled. A stopped model response or closed browser tab does not establish that backend execution has stopped.

**Deliverable:** responsibilities, a task data model, identity propagation, and storage and retention rules for each data category.

---

## 3. Build a bounded executor

### Treat tool calls as external input

Structured output and JSON Schema constrain shape. They do not prove that a customer exists, an amount is reasonable, or an operation is authorized. Apply four checks before execution:

1. **Structure:** the tool exists and parameters satisfy its schema.
2. **Business rules:** the object exists, its state permits the action, and values are valid.
3. **Authorization:** this user and tenant may perform this action on this object.
4. **Execution conditions:** required approval exists, budget remains, and the task is active.

For “create an access-card support ticket,” the model can extract location and symptoms. The server binds the requester to the authenticated identity, checks permitted locations, presents a preview, and executes after confirmation. A model-generated `tenant_id` or claim that an administrator approved the action is insufficient.

### Use explicit states for uncertain execution

| Current state | Event or condition | Permitted behavior |
| :--- | :--- | :--- |
| queued | Worker obtains a valid execution lease | Enter running and record the attempt |
| running | Sensitive write required | Prepare an action preview; enter awaiting_approval |
| awaiting_approval | Authorized approval; parameters unchanged | Recheck authorization and business state, then execute |
| running | A write times out with an unknown remote outcome | Enter reconciling and verify the remote result |
| running | Recoverable failure within budget | Apply bounded retry or controlled replanning |
| Any active state | Deadline or cancellation | Stop starting new steps; reconcile writes already in flight |
| reconciling | Automatic verification is insufficient | Enter needs_review with evidence for a human |

This is a simplified model. Define success, failure, partial completion, other terminal states, and the actors allowed to trigger transitions. Bind approval to the action, parameter digest, expiry, and version. Changed parameters require new approval; execution must recheck current permissions and business state.

Set limits for **model turns, tool calls, tokens or spending, total duration, tool timeouts, concurrency, and output size**. Detect repeated calls with identical arguments and repeated lack of progress. Measure suitable limits for the workload rather than adopting an arbitrary universal step count.

Errors can return an `error_code`, retryability, and a sanitized recovery hint. Denied permission should normally stop that action; missing input can trigger a user question; transient dependency failure may justify retry. Replanning must not become a way to bypass a denial by trying other tools.

**Deliverable:** state transitions, tool contracts, execution budgets, and an error taxonomy.

---

## 4. Design retry, idempotency, and recovery

### A timeout does not prove that nothing happened

“Retry reads, never retry writes” is too coarse. Decisions depend on side effects, idempotency guarantees, the failure, and the remaining budget. AWS emphasizes that a timed-out call may already have changed remote state; side-effecting operations need corresponding idempotency design. [Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)

| Situation | Response | Important detail |
| :--- | :--- | :--- |
| A side-effect-free read encounters a transient failure | Bounded exponential backoff with jitter; follow Retry-After where specified | Avoid multiplying retries across SDK, worker, and agent |
| A write has valid idempotency protection | Retry with the same business key and parameters where the API contract permits | Check key retention, concurrent requests, and cached failure behavior |
| A write times out and its result is unknown | Reconcile using the remote request ID or business operation ID | Do not invent a new key or assume failure |
| Invalid input, denied access, or incompatible resource state | Correct the request, obtain authorization, or stop | Use the service error contract, rather than HTTP status alone |
| The task cannot continue after confirmed side effects | Apply business-specific compensation or human intervention | Some actions are irreversible; compensation can also fail |

An idempotency key represents one business operation within a tenant and must be stored before dispatch. Regenerating it on every retry defeats deduplication. Using only an order ID can incorrectly merge distinct operations on the same order. Stripe API v1 documents replaying saved execution responses for a key and rejecting mismatched parameters; verify the contract of each target API. [Idempotent requests](https://docs.stripe.com/api/idempotent_requests)

### Checkpoints track progress; operation records track business effects

A queue may redeliver messages. A worker can crash after remote success but before local persistence. Consider ticket creation: the service creates the ticket, but its response is lost. Reconcile using the business operation ID saved before dispatch and recover the existing ticket rather than creating another with a new key.

[![After a write timeout, reconcile the outcome — The remote write may have succeeded. Reconcile by the original operation ID before continuing.](/notes/enterprise-ai-production/production-recovery.en-68a2d2d298cb.webp)](/notes/enterprise-ai-production/production-recovery.en-68a2d2d298cb.webp)

*The remote write may have succeeded. Reconcile by the original operation ID before continuing. [View full-size](/notes/enterprise-ai-production/production-recovery.en-68a2d2d298cb.webp)*

Supporting this recovery path requires:

- **Durable task progress:** completed steps, input and output references, pending approvals, versions, and budgets. An in-memory checkpointer loses state on restart. LangGraph documents persistent checkpoints and the limits of memory-only storage. [Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- **An operation ledger:** stable operation ID, parameter digest, execution status, remote request ID, and reconciliation result. Unique constraints, transactions, and concurrency controls prevent workers from submitting the same mutation simultaneously.
- **Reliable dispatch:** consider a transactional outbox when business state and outgoing events must be saved together. Consumers still need deduplication, and expired leases must lead to identifiable recovery work.
- **Replay boundaries:** restoring a checkpoint does not guarantee once-only external effects. Reuse confirmed results and reconcile unknown writes. Evaluation replays should use mocks or a sandbox by default.

### Compensation is a business decision

If a ticket was created but notification failed, retry the notification and retain the ticket. A failed checkout after inventory reservation may instead require releasing stock. A refund does not erase every consequence of a charge, and an email cannot reliably be unseen by its recipient.

Use Saga-style compensation when a multi-step business process requires it. Give compensation its own state, idempotency, alerts, and manual recovery path. The required ordering follows business constraints and need not mechanically reverse the original sequence. Azure’s pattern documentation explains these limitations. [Compensating Transaction pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction)

**Deliverable:** a retry matrix, operation ledger, recovery and reconciliation flows, and compensation procedures.

---

## 5. Separate knowledge, context, memory, and business truth

### Store each kind of information for its purpose

| Information | Contents | Boundary |
| :--- | :--- | :--- |
| Business facts | Tickets, orders, permissions, approval results | Read the authoritative business system; a conversation summary cannot replace it |
| Knowledge / RAG | Policies, product documentation, procedures, evidence | Retain provenance, versions, scope, effective dates, and access rules |
| Task context and long-term memory | Current progress and unresolved issues; approved cross-session preferences | Scope short-term state to a task or conversation; define ownership, purpose, and lifecycle for long-term memory |

Retrieval finds evidence for the current task; memory retains information for later use. A vector database is not the default store for every kind of state. LangGraph distinguishes thread-scoped short-term state from long-term memory namespaces, which still require server-side authorization. [Memory overview](https://docs.langchain.com/oss/python/concepts/memory)

### Diagnose RAG by stage

At ingestion, retain source references, stable document IDs, versions, access control, update times, and effective periods. Monitor parsing and indexing failures. At query time, establish authorized scope before retrieval, reranking, evidence selection, and cited generation.

Evaluate keyword and semantic retrieval for the actual workload. Policy numbers, ticket IDs, and specialized names often need exact matching; conceptual questions benefit from semantic similarity. Hybrid retrieval and reranking are candidates with quality, latency, and cost tradeoffs. [Azure AI Search: hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview)

When retrieval appears relevant but the answer is wrong, inspect separately:

1. Whether parsing or chunking lost headings, tables, footnotes, or applicability.
2. Whether correct evidence entered the candidate set and survived reranking and context assembly.
3. Whether retrieved policies apply to different regions, employee categories, or effective periods.
4. Whether each important answer claim has supporting evidence and a valid citation.

A newer document does not necessarily replace an older one. Historical questions may need the version effective at that time; regional policies can coexist. Select by scope and effective dates. Show unresolved conflicts and ask for clarification. Insufficient evidence should lead to an explicit uncertainty response or human handoff.

### Keep context compact without losing critical facts

Allocate context budget to rules, user requests, evidence, tool results, and output. Remove duplicate results and irrelevant history first. Preserve goals, constraints, approvals, unresolved issues, and evidence references. Keep money, dates, IDs, and permission state in structured fields. Anthropic discusses compaction and structured notes alongside the risk of losing important information. [Effective context engineering](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents)

Instructions to answer only from evidence help, but cannot establish reliability. Temperature 0 does not eliminate hallucinations or guarantee complete determinism across models and infrastructure. Citation checks, outcome validation, and regression evaluation remain necessary.

Long-term memory also needs write eligibility, provenance, correction, expiry, and deletion. Distinguish user statements from inferred preferences. A contaminated conversation must not automatically become shared organizational knowledge.

**Deliverable:** data categories, knowledge metadata, retrieval evaluation cases, context budgets, and memory lifecycle rules.

---

## 6. Enforce enterprise trust boundaries

### Tenant isolation spans the entire data path

SSO establishes identity; resource authorization determines permitted actions. Resolve the tenant from verified server-side membership. Apply role and resource rules at data access and tool execution.

Isolation covers database rows, objects and signed URLs, vector indexes, caches, queues, checkpoints, exports, logs, and feedback. Cache keys need appropriate tenant and permission scope. Shared indexes must enforce filtering. Permission revocation must address cached results and existing download links.

Postgres RLS can provide a database boundary, but identify roles, views, and service credentials that bypass policies. Supabase documents these bypass cases; a privileged backend client does not automatically provide tenant isolation. [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### External content supplies data, not authority

Websites, attachments, emails, and retrieved passages can contain instructions to ignore rules, export files, or invoke tools. They remain untrusted after entering context. OWASP describes indirect prompt injection through external content and recommends layered controls, including restricted authority and approval for high-risk actions. [Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

Cover these boundaries together:

- Allowlist tools and external destinations. Defend URL fetching against SSRF, internal addresses, unsafe redirects, and unintended resources.
- Inject narrowly scoped credentials on the server. Avoid exposing secrets or broad shell and arbitrary SQL capabilities to the model.
- Mark external content separately from system instructions. Enforce sensitive writes through independent policy and approval checks.
- Sandbox parsing and code execution where appropriate, with resource limits. Sandboxing complements authorization.
- Classify and redact data across inputs, outputs, logs, and exports. Establish acceptable provider processing and retention conditions.

Define retention, deletion propagation, backup handling, and access to audit records according to customer requirements and the data involved. Self-hosting or a single certification cannot independently establish that the entire product satisfies every requirement.

**Deliverable:** a permission matrix, data flows and threats, cross-tenant negative tests, and retention and deletion procedures.

---

## 7. Add multiple agents only when the benefits are measurable

Extra roles rarely fix unclear tool descriptions, poor evidence, or inadequate budgets. Establish a single-agent or fixed-workflow baseline and compare on the same tasks.

Multiple agents can help with independently investigable subtasks or distinct context and permission scopes. One option is a coordinator assigning bounded tasks to specialists and merging their results. Other topologies are possible; explain their coordination and recovery costs.

A delegation contract should include subtask ID, objective, input and evidence references, permitted tools, budget, deadline, output schema, completion criteria, and error types. Send the minimum necessary context. Delegation must not expand authority, and worker outputs still require validation.

Handle duplicate assignments, shared-resource write conflicts, subtask timeouts, cancellation propagation, and partial success. Route mutations through a common gateway with locks, version checks, or business transactions where appropriate. Avoid multiple agents independently claiming responsibility for final submission.

Compare completion rate, evidence coverage, human review time, total cost, and end-to-end latency. Parallel work can reduce some waiting while stragglers and synthesis increase other delays. More agents do not universally improve results.

**Deliverable:** baseline comparison, delegation contracts, ownership of shared state, and failure aggregation rules. Retain the simpler design when benefits are unclear.

---

## 8. Establish evaluation and release gates

### Grow evaluation from real tasks and failures

Build a versioned dataset from authorized, sanitized, annotated examples. Include normal tasks, long-tail requests, insufficient evidence, conflicting policies, denied access, injection, timeouts, duplicate delivery, and cancellation. Separate development examples from held-out evaluation to reduce overfitting.

Define metric denominators first. For example, automatic completion rate can count accepted, in-scope tasks that meet business acceptance conditions within time and budget, divided by all accepted, in-scope tasks. Report refusals, handoffs, and incomplete tasks alongside it. Correctly refusing an unauthorized request can pass a safety evaluation without counting as completion of the requested business operation.

| Evaluation target | Possible checks | Misleading shortcut |
| :--- | :--- | :--- |
| Task completion | Final business records, state, user requirements | “Done” in the response is insufficient |
| Tool execution | Selection, arguments, authority, call counts, side effects | Do not enforce a unique shortest path when alternatives are valid |
| Retrieval and answers | Recall@K, citation support, key fact coverage, appropriate abstention | Relevant retrieval alone does not establish correctness |
| Security and isolation | Permission, tenant, malicious-file, and injection cases | Passing tests does not prove zero real-world risk |
| Cost and performance | Cost per success, P50/P95/P99, queue time under load | Average latency hides severe tail delays |

Use code or database assertions for objectively verifiable results. Combine rubric-based model grading with human review for open-ended answers. Calibrate graders against humans and test for style preferences, scoring drift, and injected evaluation content. Repeat variable tasks and report sample size and variation. “At least one successful attempt” does not describe consistent reliability. Anthropic’s evaluation guidance distinguishes transcripts, outcomes, and grader types. [Demystifying evals for AI agents](https://www.anthropic.com/research/demystifying-evals-for-ai-agents)

### Version AI configuration as part of the release

Behavior changes can come from application code, prompts, model and parameters, tool descriptions and schemas, retrieval configuration, index snapshots, or policies. Save a release manifest and record actual versions on each task. If a provider dependency cannot be pinned, record observable identifiers and changes.

A candidate passes offline evaluation and sandbox validation before gradually receiving more traffic. Each gate can stop the rollout. Reviewed production failures become cases for the next evaluation.

[![Release through gates; learn from observed failures — Test candidate versions before expanding traffic; reviewed production evidence improves the next evaluation.](/notes/enterprise-ai-production/production-release.en-9d827ceaff09.webp)](/notes/enterprise-ai-production/production-release.en-9d827ceaff09.webp)

*Test candidate versions before expanding traffic; reviewed production evidence improves the next evaluation. [View full-size](/notes/enterprise-ai-production/production-release.en-9d827ceaff09.webp)*

For a new capability, start with a small read-only pilot before opening write access. Shadow requests must use paths without real side effects or sandbox tools. Creating a second real ticket is not a safe shadow test.

Gate releases on quality, critical security cases, performance, cost, and recovery exercises. Stop expansion when results regress; restore a compatible release or switch to read-only or human processing. Rolling back a prompt cannot undo an email. Decide how existing tasks retain their original versions and whether checkpoint migration is necessary.

**Deliverable:** evaluation datasets, release reports, canary rules, rollback, and in-flight task handling.

---

## 9. Define what a fast response means

### Acceptance, first token, first useful result, and completion differ

A quick “processing” message demonstrates feedback. Retrieval, queueing, or transcription may have consumed considerable time before the model starts. The first video summary may cover only its opening section. Establish what the user is waiting for before optimizing.

| Metric | Suggested measurement boundary | Common confusion |
| :--- | :--- | :--- |
| Request acceptance | Submission to a durably saved task ID and status endpoint | HTTP 202 and “processing” do not establish completion |
| Model time to first token, or TTFT | Model dispatch to the first content token; record the provider's definition separately | Excludes earlier download, queueing, and retrieval; heartbeats and metadata are not content |
| First useful content for the user | Submission to a usable answer or an evidenced segment displayed in the interface | State whether “first response” refers to the model or user boundary; exclude placeholders |
| Streaming behavior | Content-token intervals, long pauses, tokens per second, interrupted streams | A good average rate does not prove fast startup or uninterrupted output |
| Complete task duration | Submission to completed processing, validation, and durable output | A first segment is not a complete video summary; report failures and cancellations too |

Measure P50/P95/P99 separately for questions, short files, and long videos, recording input size, output size, and load. Separate transfer, queueing, parsing and ASR, retrieval, model input processing, generation, and postprocessing. Find the critical dependency path; adding all step durations overcounts overlapping work.

### Stream feedback while keeping execution durable

Interactive answers can stream after authorization, evidence preparation, and required checks. For a long video, durably save a job before returning its ID. Workers advance it while the client polls status or subscribes to events. The entire download, transcription, and synthesis should not depend on one open web request.

SSE suits server-to-client progress, incremental content, and terminal events. Consider WebSocket when frequent bidirectional interaction warrants it. Event IDs and reconnection provide transport features; the application must still retain recoverable state or events, deduplicate in order, and reauthorize access. Native EventSource and fetch-based streaming clients need their own reconnection handling. Test proxy buffering, idle timeouts, connection limits, in-stream errors, and slow clients. [MDN: Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

A closed page or disconnected stream does not automatically cancel a job. Separate resubscription, canceling unstarted steps, and reconciling operations already in flight. Report stage and completed work, such as “8 of 20 segments transcribed.” With dynamic segments or an unknown total, show processed duration and stage rather than an invented percentage. Partial results need covered time ranges and versions; replace them explicitly when complete output is published.

### Optimize the actual critical path

Remove unnecessary serial model calls and repeated retrieval, and constrain output length. Parallelize independent work. Evaluate shorter input, reusable stable context where caching is allowed, and appropriate model selection against first useful content, completion time, quality, and cost. Measure cache behavior, model input processing, generation, and client rendering separately. Streaming does not make downloading or ASR faster and does not guarantee a shorter total task.

For output safety or schema checks, decide which content can appear immediately and which must be buffered until validated. Streaming must not bypass sensitive-data authorization. **Deliverable:** latency budgets by task class, a streaming protocol, progress and cancellation semantics, and slow-connection and interruption checks.

---

## 10. Bound concurrency with capacity and fair scheduling

### Estimate the work accumulated inside the system

Concurrent users, requests per second, active jobs, model calls, and GPU usage measure different things. One video can fan out into dozens of requests. Admission rate limiting alone can still let a single job saturate downstream resources.

With stable throughput and consistent measurement boundaries, estimate average work in the system as completion rate multiplied by average time inside it. For example, two completions per second with a 30-second average residence time imply about 60 jobs in that boundary, not necessarily 60 workers: residence can include queueing and waiting. Capacity planning also needs bursts, tails, resource bottlenecks, and failure headroom. Queues do not create capacity; arrivals persistently above completion rate create growing backlogs.

| Control point | What to bound | Overload behavior |
| :--- | :--- | :--- |
| Admission and tenants | Active and queued work, input sizes, and budgets per user, tenant, and globally | Reject before expensive work or queue explicitly with understandable status |
| Transfer and media processing | Connections, bandwidth, CPU, memory, temporary disk, media duration | Limit downloads and transcoding; avoid loading entire files into memory |
| ASR and vision | GPU memory, media seconds processed, batch size, resident models | Allocate stage-specific slots and separate worker pools when justified |
| Model gateway | Concurrent calls, request and token rates, provider quotas, connections | Apply shared and tenant limits; retries use the same budget |
| Segment scheduling | Fan-out, active segments per job, queue length | Dispatch bounded batches so other jobs receive capacity |
| Persistence and delivery | Database connections, object writes, caches, stream buffers | Reuse connections, bound writes and buffers, isolate slow consumers |

Use separate queues and concurrency pools for interactive answers and long videos while retaining aggregate limits for shared models, databases, and storage. Rotate or weight tenant work and preserve opportunities for aging batch jobs. Paid tenants still need global boundaries. Coordinate limits atomically through shared scheduling state rather than independent process-local counters.

Give queues length and waiting limits, oldest-job age, retry budgets, and a failed-job handling path. Apply backpressure or reject excess work instead of accepting requests that will mostly expire. Preserve useful completions within their deadlines. AWS discusses useful throughput under overload and preventing unmanageable backlogs with backpressure, priorities, and isolation. [Load shedding](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/), [Queue backlogs](https://aws.amazon.com/builders-library/avoiding-insurmountable-queue-backlogs/)

### Tune batching, scaling, and load tests around the bottleneck

Where the model and serving engine support them, small batches can improve inference throughput while increasing waiting and time to first result. Compare length grouping, maximum batching delay, and separate interactive queues. Triton's dynamic batching exposes batch-size and queue-delay configuration: a throughput/latency tradeoff rather than a universal speed switch. [NVIDIA Triton: Batchers](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/batcher.html)

Scale using queue age, stage throughput, CPU/GPU/memory, and downstream headroom rather than ingress QPS alone. More workers do not expand a provider's token allowance and may exhaust database connections first. Include warmup, minimum capacity, scaling startup time, circuit breaking, and degradation.

Load tests need mixed lengths and tenants, steady arrivals, bursts, sustained load, cold starts, one noisy tenant, and dependency failures. Generate traffic at intended arrival rates; waiting for each response before sending the next can hide queueing. Report accepted and rejected work, correct completion rate, first content and total duration, backlog recovery, and cost. **Deliverable:** a capacity model, layered limits, scheduling rules, representative load results, and explicit overload behavior.

---

## 11. Long-video processing: parallel segments and evidence-based synthesis

Consider a two-hour interview as a teaching example. The user wants useful, replayable highlights soon, followed by complete chapters, attributed viewpoints, and timestamps. Set separate objectives for the first usable segment and the full result. A fast opening summary does not establish that the entire video was processed. This extends the [video download and summary demo](/notes/ai-video-downloader-summarizer) with production design; it does not claim that the existing project implements these capabilities.

### Choose the valid path that avoids unnecessary work

Inspect duration, language, available captions, and access permissions. Prefer applicable timestamped captions with quality sampling. Automatic captions can omit passages or misidentify names; retranscribe missing intervals where needed. For speech-only summaries, obtain the audio track rather than downloading and decoding unnecessary high-resolution video.

Slides, charts, code demonstrations, and silent actions require more than a transcript. Add scene- or time-based keyframes, OCR, and visual analysis aligned to the audio timeline. State whether output covers speech or audiovisual content, and check whether visual sampling missed important events.

An ASR provider may accept a whole recording asynchronously, or the application can schedule segments. Asynchronous submission separates requesting work from retrieving results; it does not establish low latency. Compare provider queueing, upload, execution, and retrieval. Azure's batch transcription follows asynchronous submission and result retrieval. [Batch transcription](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/batch-transcription)

### Separate media segmentation from summary chunking

**Media segments** address upload constraints, transcription throughput, and retry scope. Combine voice activity detection (VAD) or silence boundaries with tunable duration and size limits plus modest contextual overlap. Avoid cutting mechanically through sentences. Suitable lengths depend on model, language, file size, and hardware; five minutes is not a universal setting. Video cuts without re-encoding can also depend on keyframes, so a requested cut time does not establish an exact boundary. [FFmpeg: segment muxer](https://ffmpeg.org/ffmpeg-formats.html#segment)

Store `segment_id`, original intervals, actual cut offsets, content fingerprints, language, versions, and state. Restore local recognition timestamps using the actual source offset. Align overlapping text and time ranges to remove duplicates without losing boundary sentences, terms, or speaker cues. Whole-recording speaker consistency needs reconciliation; independently assigned “speaker 1” labels need not identify the same person.

**Summary chunks** follow topics, chapters, and token budgets after transcript alignment. They need not match audio segments. Extract facts, speakers, viewpoints, and source intervals, combine chapter results, then produce an overall account. Retain evidence references and access to original passages. Repeatedly summarizing shorter summaries can erase counterexamples and qualifications.

The diagram shows the ASR path; validated captions can join at timeline alignment. Global, tenant, and job budgets bound parallel work. The illustrated segment count is not a fixed concurrency setting.

[![Long videos: parallel segments, ordered evidence — Valid captions take a shorter path. Resume segments independently; publish the full overview after coverage checks.](/notes/enterprise-ai-production/production-video.en-86d3919fbaba.webp)](/notes/enterprise-ai-production/production-video.en-86d3919fbaba.webp)

*Valid captions take a shorter path. Resume segments independently; publish the full overview after coverage checks. [View full-size](/notes/enterprise-ai-production/production-video.en-86d3919fbaba.webp)*

### Deliver incrementally with bounded parallelism

Dispatch only a limited number of ready segments. Confirmed passages can enter extraction and appear before all ASR work finishes. Final synthesis waits for required intervals or explicitly marks missing coverage. Merge out-of-order completions by source time and stop new dispatch after cancellation. Worker parallelism is not multi-agent negotiation; a deterministic pipeline handles most of this work.

Retry failed segments alone. Scope reusable artifacts by authorization boundary, source fingerprint, stage parameters, and model/prompt versions. Cache reads still require authorization, expiry, deletion, and invalidation. Recovery reuses verified artifacts and reconciles uncertain external execution. Expired source links, unavailable captions, silence, abnormal duration, persistent segment failures, and stalled later sections need inspectable states and human handling.

| Validation layer | Evidence to retain | Response to a problem |
| :--- | :--- | :--- |
| Extraction coverage | Expected intervals, successful segments, nonsilent gaps, failed and skipped reasons | Fill gaps; segmentation is not transcription; record silence separately |
| Transcript quality | Samples of language, names, numbers, boundary sentences, speaker consistency | Adjust cuts, terminology, or models while retaining original versions |
| Summary grounding | Chapter coverage, original support and timestamps, contradictions and omissions | Revisit passages and correct unsupported claims; mark missing later sections |
| Experience and efficiency | First evidenced result, full duration, ASR real-time factor, peak resources, cost | Locate transfer, queue, ASR, or synthesis bottlenecks and compare changes |

Define `RTF = transcription compute duration / corresponding audio duration`; lower values mean faster computation under the stated conditions. Say whether queueing, transfer, and preprocessing are included. User completion time also includes these stages and synthesis, so one segment's RTF cannot stand in for the full experience. Compare direct captions, whole-file ASR, segmentation, and concurrency levels on the same inputs and quality requirements. Shared GPUs, quotas, the longest segment, and synthesis overhead limit speedup; N segments do not promise an N-fold improvement.

**Deliverable:** stage dependencies, a segment manifest, resumable artifacts, progressive-result semantics, and comparisons of coverage, quality, latency, and cost.

---

## 12. Make the platform observable, affordable, and maintainable

### Trace a failed task across dependencies

Connect admission, queueing, retrieval, model calls, tools, approval waits, and persistence to a task. Record controlled summaries or references, durations, tokens, estimated costs, versions, retries, and error classes. OpenTelemetry’s generative AI conventions offer a reference for telemetry fields; verify the version you adopt. [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

Debug traces explain execution. Audit records establish who approved and performed actions; their access and retention can differ. Avoid collecting complete sensitive content, secrets, or internal model reasoning by default. Sampling, redaction, and log access are design concerns.

Monitor technical and business signals: service failures, task completion, handoffs, unresolved outcomes, denied actions, duplicate side effects, queue depth, index freshness, and spending anomalies. Decompose a P99 spike into queue, retrieval, model, tool, and approval time. Report user waiting time separately from automated execution where appropriate.

### Use service objectives to govern operating cost

A service level indicator, or SLI, is a measurement; an SLO is its target. Define windows, denominators, and exceptions for each task class. Read-only answer latency and a human-approved workflow need different treatment. Agree targets with business owners and validate them under load.

Measure **total cost per successful task**, including failed attempts, retries, model calls, retrieval, compute, storage, and human review. Estimate model charges from input, cached input, output, and provider-specific billing, then reconcile with invoices.

Improve context and repeated calls before evaluating caching, batching, smaller-model routing, or provider failover. A cheaper model can cost more if it increases retries. Alternative providers require quality, tool compatibility, and data-handling validation. Caches need tenant and permission isolation plus correct invalidation.

Connect the latency, scheduling, and segment metrics from sections 9–11 to cost records. Reserve budget before concurrent dispatch and settle afterward; otherwise workers can all pass the same balance check. Trace spending alerts to tenants, jobs, segments, and actual versions.

### Operations need owners and recovery practice

For critical failures, define an owner, alert conditions, procedures, and escalation. Exercise worker crashes, database and provider outages, key rotation, backup restoration, and queue replay. RPO describes an acceptable data-loss window; RTO describes a recovery-time objective. Having backup files does not prove restoration works.

Enterprise users may also need organization and role management, SSO and offboarding, usage and billing, task history, audit exports, data export and deletion, and operational interfaces for retry, reconciliation, compensation, and handoff. Prioritize customer requirements and provide appropriate interfaces beyond the chat window.

**Deliverable:** dashboards, SLOs and quotas, alerts and ownership, recovery exercise records, and administration interfaces.

---

## 13. Worked example: from policy Q&A to a service platform

An employee asks: “Use the applicable policy to explain my access-card issue and create a service ticket if needed.” Increase capabilities in stages.

| Stage | Added capability | Acceptance evidence |
| :--- | :--- | :--- |
| Read-only assistant | Identity filtering, policy versions, citations, abstention | Unauthorized content never enters context; uncertainty and conflicts are handled |
| Ticket draft | Extract details, ask questions, preview the action | Server binds the requester; user confirms location, content, and scope |
| Controlled submission | Approval, stable operation ID, idempotency, status lookup | Duplicate clicks and retries preserve one business operation; unknown outcomes are reconciled |
| Team pilot | Quotas, traces, feedback, recovery, handoff | Worker restart is recoverable; one team’s failures do not exhaust shared capacity |
| Platform operations | Versioned evaluation, canary releases, audit, usage, recovery | Operators can explain failures, stop unsafe actions, and restore service within objectives |

Retrieval and ticket creation can remain a fixed workflow. Add agent planning when the request requires dynamic investigation. If the ticket service succeeds but its response is lost, show “verifying submission” and query by operation ID. Once confirmed, save the external ticket ID and process notification separately. A failed notification must not create another ticket.

Cancellation stops actions that have not started. Writes already dispatched still require reconciliation. If a ticket was created, explain the outcome and offer closure or human handling according to business policy.

Apply the same progression to generation, sales support, research, and analytics: every external action needs authorization, state, recovery, and validation; additional autonomy needs demonstrated benefits sufficient to justify its cost and risk.

---

## 14. Deliver in risk-based increments

| Increment | Priorities | Gate for the next increment |
| :--- | :--- | :--- |
| A · Definition and baseline | Real tasks, conventional alternatives, ownership, data classification, initial evaluation | Value and error consequences can be measured |
| B · Read-only production pilot | Identity, isolation, reliable retrieval, abstention, quotas, telemetry, handoff | Representative quality and cost evidence; critical isolation cases pass |
| C · Enable writes | Tool authorization, confirmation, operation ledger, reconciliation, recovery, necessary compensation | Duplicate delivery, crashes, cancellation, and unknown-outcome exercises pass |
| D · Expand adoption | Regression gates, canaries, stream recovery, mixed-workload capacity, restoration, administration, audit | Agreed service objectives are met and the team can operate the system |
| E · Expand autonomy | Controlled comparisons of planning, routing, or multiple agents | Business or quality benefits exceed added cost and complexity |

These increments describe dependencies, not fixed delivery dates. Security, evaluation, and operations begin in the first increment and deepen with risk. Multi-agent work can wait; authorization and idempotency must precede real writes.

Before launch, retain evidence that:

- Business success, permitted scope, ownership, and human handoff are explicit.
- Negative cases cover tenant boundaries, revoked access, malicious content, and disclosure.
- Tasks have budgets and stopping conditions; duplicate requests do not cause unintended side effects.
- Unknown outcomes, worker crashes, cancellation, and recovery have executable procedures.
- Knowledge has provenance and applicable versions; insufficient or conflicting evidence has defined behavior.
- Releases link to evaluation, with exercised canary and rollback procedures.
- Acceptance, model TTFT, first useful content, and full duration have separate definitions.
- Mixed-length and tenant load tests cover overload, reconnection, queues, and cancellation.
- Long-media coverage is checkable, failed segments resumable, and partial output explicit.
- Latency, spending, and capacity targets have measurements and degradation policies.
- Alerts have owners, backups can be restored, and users can find status and support.

Use the following prompt to review a project. Require evidence, keep unverified claims as unknown, and do not let an AI review automatically certify enterprise readiness.

```prompt
Review this AI product's readiness to move from demo to enterprise production.

Project evidence: <PRD, architecture, tool contracts, data flows, evaluations, run records>
Users and tenants: <users, roles, organization boundaries>
Core task: <input, outcome, success criteria>
External side effects: <tickets, messages, payments, other mutations>
Targets and constraints: <latency, cost, data handling, maintenance capacity>
Workload: <arrival rates, tenant mix, input duration and size, provider quotas>

Read the evidence first. Separate confirmed facts, targets, and unknowns.
Do not assume that the project needs agents or multiple agents.

Review business fit, execution state, tool authorization, retry and idempotency,
recovery, knowledge and memory, tenant isolation, evaluation and release,
first useful content and completion latency, concurrency scheduling,
segmented long-running work, observability, cost, and operational support.

For each finding, report the failure scenario, impact, existing evidence,
gap, smallest useful improvement, validation method, and owner.
Identify requirements that must precede real writes and order delivery by dependency.
Include remote success with a local timeout, duplicate delivery, cancellation
with requests in flight, changed parameters or permissions after approval,
malicious retrieved content, provider outages, and exhausted quotas.
For long jobs, include reconnection, slow clients, queue backlogs, noisy tenants,
out-of-order segments, gaps and overlaps, caption and visual coverage,
and the distinction between partial results and complete output.
Require separate evidence for acceptance, model TTFT, first useful content,
full duration, and cost. Async, streaming, segmentation, and more workers
do not establish a speedup without measurement.

Prefer the existing stack and simple designs. Justify each new component,
its alternatives, and its maintenance cost.
Do not treat prompts, framework features, or unexecuted test plans as proven guarantees.
```

The handoff to the next iteration should contain verifiable artifacts: task and permission contracts, recoverable execution records, versioned evaluation, service objectives, and operating procedures. Let actual workloads and failure exercises guide further investment and the scope of autonomy.
