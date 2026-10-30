# 【AI Dev Workflow · 03】 Architecture & Contracts: From Product Requirements to Verifiable Technical Decisions

> **Context**
> [Product definition](https://www.qiannawang.com/notes/scope-product-definition) establishes whom the product serves, the task it completes, and how to check it. The next step turns those decisions into system responsibilities, data flows, and interaction agreements that design, implementation, and validation can share.

This stage asks: **Who is responsible, how do the parts cooperate, and what happens on failure?** Capture the structure, core journey, contracts, and reasons for important decisions.

Treat AI proposals as candidates. Fit choices to product needs, existing capabilities, runtime limits, and maintenance costs. Check direction-changing claims against version-specific official sources and a small experiment.

Follow constraints → choices → responsibilities → contracts → validation and handoff. Prompts appear where they are used.

---

## 1. Extract Technical Constraints from the Product Definition

### Identify Conditions That Could Change the Approach

Start with the PRD's core journey, acceptance criteria, and known constraints. Translate broad intentions into conditions that affect implementation. Separate business requirements, provisional targets, and measured results.

| Product condition | Architectural question | How to establish it |
| :--- | :--- | :--- |
| People enter text, files, or media | Who retrieves and parses it, what sizes are allowed, and what may reach external services? | Representative input and data use requirements |
| People wait for a result | Can the call return synchronously, or does it need task queries or streamed feedback? | Waiting targets, measured duration, and hosting limits |
| Work must resume later or across devices | Which state must persist, for how long, and how is the user identified? | Specific recovery scenarios and access requirements |
| Several people act or charges are involved | Who may access each resource, and could repeated requests duplicate work or charges? | Access rules and repeated-operation examples |
| An external API is required | Do quotas, failures, costs, or data processing terms affect the journey? | Version-specific documentation and a small real call |

The knowledge practice tool from the previous chapter initially tests a single session. Questions and answers may stay on the current page while the server generates and validates the exercise. Saved history needs its own justification. If reviewing across sessions becomes central, revisit persistence. Even without history, specify how temporary state, logs, and external services handle the material.

### Test Direction-Changing Uncertainty First

Separate confirmed constraints, provisional targets, and unknowns. Test input availability, critical platform support, and execution limits before refining directories or module names.

Use a small experiment to record time, cost, and failure behavior for a representative input. Unmeasured figures remain targets.

---

## 2. Compare Architecture and Technology Choices Against Constraints

Bring product constraints, feasible candidates, and evidence into one decision process. The diagram summarizes the selection steps; the comparisons and verification example below show how to apply them.

[![Turn an AI proposal into a decision — A recommendation stays provisional until its direction-changing assumptions are checked.](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-decisions.en-3bb1dab79cc6.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-decisions.en-3bb1dab79cc6.webp)

*A recommendation stays provisional until its direction-changing assumptions are checked. [Open full-size diagram](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-decisions.en-3bb1dab79cc6.webp)*

### Separate System Structure from Tool Names

Client frameworks, server frameworks, databases, managed services, and editors solve different problems and can be combined. Taro and uni-app mainly affect the client; FastAPI and NestJS mainly support server interfaces; VS Code and HBuilderX affect the development workflow. Choosing a client framework does not automatically choose a server language.

Decide what can share an application, what needs independent execution, and what can use managed services. Existing behavior and compatibility come first; every extra service needs a reason and an operating budget.

### Common Candidates and Where to Consider Them

These combinations are examples for comparison, with no fixed ranking. Product context, team experience, and validation of critical capabilities determine the choice.

| Situation | Candidate combination | Example and main checks |
| :--- | :--- | :--- |
| Websites, content platforms, and small web products | Next.js + TypeScript, adding data and managed services as needed | Portfolios, member content sites, and booking tools; check rendering, server responsibilities, and operating limits. [Next.js documentation](https://nextjs.org/docs) |
| An existing frontend needs an independent business service | React / Vue + NestJS | Admin tools or several clients sharing business interfaces; justify the separate service and maintenance work. [NestJS documentation](https://docs.nestjs.com/) |
| Core processing depends on Python | A web client + FastAPI | Document processing, data analysis, and model services; check Python dependencies, duration, and resource needs. [FastAPI documentation](https://fastapi.tiangolo.com/) |
| The product explicitly targets WeChat alone | A native WeChat Mini Program | Local services or workflows inside WeChat; check platform capabilities, publishing requirements, and actual cross-platform demand |
| The team wants to reuse React / Vue experience across platforms | Taro + a server chosen for the business task | A Mini Program first, with other clients later; verify the combination of framework version, component library, and target platform. [Official Taro repository](https://github.com/NervJS/taro) |
| The team wants to use Vue for a cross-platform product | uni-app + a server chosen for the business task | Forms, content, and booking products; check compilation, plugins, and each target's run and debug workflow. [uni-app documentation](https://uniapp.dcloud.net.cn/quickstart-cli.html) |

Include existing Java, .NET, or other established systems when relevant. Add databases, queues, and caches for actual persistence, consistency, or execution requirements. Calling an AI API does not itself require Python or an independent backend.

### Example: Check an AI Recommendation About Mini Program Tooling

Suppose a project starts with a WeChat Mini Program, may later support H5, and wants to keep using VS Code. After AI suggests uni-app, the developer asks: Which steps work with the existing editor and CLI, and which require dedicated tools?

Check editing, compilation, running and debugging, and packaging separately. Official uni-app documentation supports using editors such as VS Code for CLI projects, while App running and debugging still involves HBuilderX tooling. Verify Mini Program, H5, and App workflows individually, and distinguish uni-app from uni-app x. [Official CLI and tooling guidance](https://uniapp.dcloud.net.cn/quickstart-cli.html)

Then use the candidates to run a page, one critical platform capability, and a real API call. Record tools and adaptation work. A developer with stronger React experience may choose Taro after the target-platform experiment succeeds; prior Vue and uni-app experience may lead elsewhere. This illustrates a conditional decision, not a completed project benchmark. Cross-platform support still requires adaptation and testing on devices.

### Ask AI to Compare Options and Expose Evidence Gaps

```prompt
Compare the architecture and technology choices needed for this stage of the product.

Product definition and core journey: [Paste the PRD or summary]
Target platforms and initial scope: [Web, Mini Program, App, or other]
Existing product and technical experience: [Codebase, familiar languages, and tools]
Constraints and measured results: [Time, budget, data, duration, and deployment conditions]
Questions to investigate: [Important uncertainties]

Please:
1. Extract architecturally significant conditions, separating confirmed requirements, provisional targets, and hypotheses.
2. Compare at most three feasible options, including suitable existing capabilities. Explain the requirements each meets, development and maintenance costs, and conditions that make it unsuitable.
3. Distinguish client, server, storage, managed services, and development tools. Explain responsibilities and how they combine.
4. Give official sources and checking dates for version compatibility, platform capabilities, and tooling limits. Mark unknowns and do not pretend to have run experiments.
5. Propose the smallest experiment for the risks most likely to change the direction, including inputs, observations, and decision conditions.
6. Make a conditional recommendation with reasons and triggers for reconsideration, rather than only a list of technologies.

You may challenge the initial recommendation. Fit the product and existing capabilities; do not default to separate frontend and backend, microservices, a particular framework, or a database.
If missing conditions could change the direction, ask at most five key questions and wait for answers before settling affected conclusions.
Produce an architecture draft at this stage; do not generate a complete project or begin a large refactor.
```

---

## 3. Define Responsibilities and Trace the Core Journey

### Draw Enough to Explain Important Decisions

Map the system, users, external services, and data boundaries. [C4 context and container diagrams](https://c4model.com/diagrams) provide useful levels; “container” here does not specifically mean Docker.

The knowledge practice tool could begin with the three responsibilities shown below. It continues the hypothetical product from the previous chapter and still needs technical experiments and user feedback.

[![Name the responsibility boundaries — The application server can live in the same full-stack app. This is a responsibility map, not a microservice prescription.](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-boundaries.en-a2207a93c424.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-boundaries.en-a2207a93c424.webp)

*The application server can live in the same full-stack app. This is a responsibility map, not a microservice prescription. [Open full-size diagram](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-boundaries.en-a2207a93c424.webp)*

The client handles the exercise; the application validates input and generated output. Define necessary temporary state, retention, and operating controls separately from user history.

### Trace an Action to an Observable Result


Track input, state, output, and failures. Distinguish interface states from state the server must retain.

If experiments show that synchronous processing fits the waiting target and operating limits, it can be the initial approach. If work must run longer, resume after leaving, or be queried across devices, consider task creation and result queries or another suitable interaction. When introducing task states, define allowed transitions, terminal states, and result retention together.

---

## 4. Write Explicit Interaction Contracts

### Agree on Structure, Meaning, and Behavior

A contract is the shared agreement on inputs, outputs, and behavior. Describe HTTP APIs with [OpenAPI](https://learn.openapis.org/specification/structure.html) where appropriate. Internal functions can use types with runtime validation; events also need message structures and handling rules. Language-level types need to be paired with checks on data actually received.

A successful JSON response is one example. A contract should also specify:

- The trigger, caller, access rules, and applicable version.
- Field types, required fields, nullability, units, limits, and enums.
- Success and failure structures, waiting budgets, and retry behavior.
- Repeated requests, state changes, compatibility, and representative examples.

### Example: A Synchronous Contract for One Practice Session

This example keeps the single-session scope and assumes an experiment permits a synchronous response. Numbers and time budgets are illustrative decisions, not measurements. Change the approach if hosting limits or experiments do not support it.

| Item | Example agreement |
| :--- | :--- |
| Operation | `POST /api/practice-sessions` with a JSON body containing the required string `material` |
| Input boundary | Trim leading and trailing whitespace, count Unicode code points, and accept 200–2,000 characters; validate again on the server |
| Success | HTTP 200 with an object containing exactly three items in `questions`; question IDs are unique within the session |
| Question structure | A question, four choices with unique IDs, one valid correct-choice ID, an explanation, and a source quote; all required and nonempty |
| Output constraints | The correct-choice ID belongs to that question's choices. The source supports the answer and explanation, with content checks in addition to structural validation |
| Waiting and retry | An illustrative 20-second budget for the server's external call, checked against hosting limits before release. Prevent repeated interface submission while processing and offer explicit retry after failure |
| Retention boundary | Keep the exercise and answers on the current page without promising recovery after closing. Retry may generate a new result and incur another API cost |

`questions` and `choices` are arrays containing question and choice objects. Question fields `id`, `prompt`, `correctChoiceId`, `explanation`, and `sourceQuote`, and choice fields `id` and `text`, are nonempty strings.

The object below shows one question, not the complete response, which still requires three. The source sentence, "The event starts every Wednesday at seven in the evening," supplies the answer.

```json
{
  "id": "q1",
  "prompt": "On which day is the event held?",
  "choices": [
    { "id": "a", "text": "Tuesday" },
    { "id": "b", "text": "Wednesday" },
    { "id": "c", "text": "Thursday" },
    { "id": "d", "text": "Friday" }
  ],
  "correctChoiceId": "b",
  "explanation": "The source states that the event takes place every Wednesday.",
  "sourceQuote": "The event starts every Wednesday at seven in the evening."
}
```

This is personal self-assessment, allowing the client to receive answers and show feedback. Formal assessment or secret answers require a different boundary for returning answers and scoring on the server. When material cannot support the required questions, return a recognizable failure rather than inventing content to reach the count.

### Ask AI to Draft a Contract

```prompt
Draft actionable interaction contracts for the core journey using the chosen approach.

Product definition and acceptance criteria: [Paste]
Responsibilities and core journey: [Paste]
Confirmed technical choices and constraints: [Fill in]
Boundary to coordinate: [HTTP API, function, event, or task]

Output:
1. Each interaction's caller, trigger, input and output, field types, required and null rules, units, and legal states.
2. Normal, boundary, and failure examples, with error codes, user-facing meaning, waiting budgets, and retry behavior.
3. Where identity and resource permissions are checked, repeated-operation semantics, and state that needs retention.
4. A contract draft matching the boundary, such as OpenAPI, types, or an event schema, with a validation approach.
5. Meaning, compatibility requirements, and open questions that examples still leave unresolved.

Match the current product scope. Do not introduce accounts, payments, queues, or persistence without a requirement.
Check structural validity separately from business correctness. Do not treat one successful example as a complete schema.
Ask key questions first when gaps change core behavior; label other assumptions.
Keep success results, errors, mocks, and acceptance criteria consistent. Do not implement business code yet.
```

---

## 5. Agree on Permissions and Failure Behavior

### Make Trust Boundaries Explicit

Describe identifying a caller separately from granting access to a resource. For user resources, check authorization on the trusted server for each operation. Showing or hiding a client button is an interface choice. Anonymous features also need explicit access scope and controls on resource consumption.

Keep model secrets, protected business credentials, and charging decisions on the trusted server. Validate both client input and externally generated output. Document which services receive material and how logs and data are retained. Configure CORS for actual browser origins where applicable; it does not check identity or resource permissions. See the [OWASP REST security guidance](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html).

### Turn Failures into Predictable Interaction Results

Using the earlier synchronous practice-session example, first trace how success and failure reach the client. Then define the error codes and recovery behavior in the table below.

[![The contract includes the failure path — Illustrative synchronous flow. A timeout ends the wait; it does not prove upstream work has stopped.](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-failures.en-97f45aa2ef5d.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-failures.en-97f45aa2ef5d.webp)

*Illustrative synchronous flow. A timeout ends the wait; it does not prove upstream work has stopped. [Open full-size diagram](https://media.qiannawang.com/notes/workbench-diagrams/v3/architecture-failures.en-97f45aa2ef5d.webp)*

The practice tool could use the following error agreements. Define codes consistently within the project.

| Situation | Example HTTP status and application code | Caller behavior |
| :--- | :--- | :--- |
| Input type or length is invalid | 400 / `INVALID_INPUT` | Preserve the material and explain the required change |
| Material cannot support the questions | 422 / `INSUFFICIENT_MATERIAL` | Explain why and allow more material |
| A usage limit is reached | 429 / `RATE_LIMITED` | Explain when to retry and follow server-provided waiting information |
| The upstream call fails or output violates the contract | 502 / `UPSTREAM_FAILURE` or `INVALID_OUTPUT` | Preserve input and offer explicit retry where the error allows it |
| Generation exceeds its waiting budget | 504 / `GENERATION_TIMEOUT` | End the current wait and offer retry without assuming upstream work has been cancelled |

A common failure response can contain `error.code`, a displayable `error.message`, `error.retryable`, and a diagnostic `requestId`. Do not expose secrets, raw stack traces, or internal service details. The client also needs behavior for network and hosting failures outside the application's control: preserving input, ending the wait, and offering recovery.

Agree separately on whether retries can duplicate writes or charges. For operations that must not repeat, consider an idempotency identifier, deduplication scope, expiry, and concurrency behavior. Disabling repeated clicks does not guarantee one server execution. The synchronous example permits explicit regeneration, so explain that it may produce a new result and another API cost.

---

## 6. Check the Approach with Mocks and Small Experiments

### Generate Examples from the Same Contract

Mocks simulate interactions so interface and server work can advance against a shared agreement. Prepare relevant cases such as success, invalid input, processing, timeout, and external failure, keeping field and state meanings consistent.

Browser and Node.js projects can use [MSW](https://mswjs.io/docs/) to simulate network interactions. Other environments may use suitable platform stubs or test services. Choose tools for the contract; clients do not all need the same interception mechanism.

Mocks check whether a consumer handles agreed results. Real interfaces also need checks that their actual responses match the contract. Missing fields, nulls, error codes, and version changes can reveal drift. Structural checks on AI output do not establish that answers are supported by the source material.

### Keep Real Validation for Important Risks

For the practice tool, call the real generation path with a small set of reviewed representative materials. Record whether it returns three valid questions, their source support, time, and cost. Simulate upstream failure and invalid output to check errors and input recovery. Validate the target runtime as well as local behavior.

For a Mini Program choice, check compilation, preview, critical platform APIs, and behavior on devices. When an experiment fails, revise the architecture and related contracts. The result may call for narrower input, a different waiting model, or another technical approach.

---

## 7. Record Important Architecture Decisions

### Preserve Reasons, Costs, and Reconsideration Conditions

Use a short [Architecture Decision Record (ADR)](https://adr.github.io/) for decisions that affect system boundaries, data, compatibility, or operation. It preserves the context, rationale, and consequences of a decision so another developer or a fresh AI conversation can recover the reasoning.

```prompt
Decision name and date:
Status: Proposed / Accepted / Superseded
Relevant product requirements and constraints:
Options considered:
Choice and main reasons:
Evidence, relevant versions, and experiment results:
Accepted costs and untested assumptions:
Impact on responsibilities, data, contracts, and operation:
Conditions for reconsidering:
Superseding record or related material:
```

For example, a decision to start with synchronous generation can state that the current scope tests one session and acceptance depends on an experiment meeting the waiting budget in the target environment. It accepts explicit retry after failure and reopens task-based processing if duration, recovery needs, or platform limits change. Keep the status Proposed until the experiment is complete.

Update technology choices alongside decisions. When a contract changes, check consumers, mocks, and acceptance examples together. Retaining an old interface, introducing a version, or coordinating an upgrade depends on compatibility needs. Across languages, people, or multiple AI tasks, identify the same contract as the current reference.

---

## 8. Review and Hand Over to the Next Stage

### Check Alignment Across Requirements, Structure, and Contracts

```prompt
As a reviewer who did not participate in earlier discussions, assess whether the architecture and contracts can support this version of the product.

Product definition and acceptance criteria: [Paste]
Responsibilities, core journey, and technology decisions: [Paste]
Contracts, mock examples, and completed experiments: [Paste or link]
Open questions: [Fill in]

Check:
1. Whether each core requirement has an owner and important data and states can be traced through the journey.
2. Whether technology choices fit the platforms, existing capabilities, and constraints, including any unjustified complexity.
3. Whether contracts cover inputs, outputs, nulls, states, errors, permissions, waiting, repeated operations, and required compatibility.
4. Whether documents, examples, mocks, and acceptance agree, with structural validation separated from business quality.
5. Whether AI claims about versions and capabilities have sources or experiment results, and whether unknowns have been presented as conclusions.
6. Which issues block the next stage and which can proceed with an explicit validation plan.

For each issue, provide its location, specific problem, impact, recommended action, and whether it blocks progress.
Do not invent test results or expand scope. Ask at most five questions needing a decision and finish with a conditional handoff judgment.
```

### Hand Over a Usable Current Version

Provide the current PRD, structure and journey descriptions, contracts and examples, important decisions, and open questions. For each critical unknown, state its impact, validation method, and when a decision is needed. For existing architecture, identify the change and behavior that must remain compatible.

The UI prototype can use this material for input limits, waiting, failure, retry, and result states; implementation can build and validate the agreed behavior. If platform or runtime uncertainty could make the core journey infeasible, complete the necessary experiment first. Update product definition if it changes value or scope.

Detailed deployment, storage configuration, and framework installation can remain in later chapters. Architecture and contracts continue to evolve during implementation, providing a clear, verifiable approach the product can afford to maintain.
