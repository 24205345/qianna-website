# 【AI Dev Workflow · 02】 Scope & Product Definition: From Initial Ideas to a Testable MVP

> **Context**
> Once the development environment is ready, the next decision is which problem to work on. An initial idea often mixes goals, features, visual preferences, and technical choices. Before implementation, turn those ideas into a clear user scenario, an initial scope, and acceptance criteria that can guide design and development.

Start with three questions: **Who is it for, what problem does it solve, and what should the first version do?** Then follow the user's task from beginning to end to check whether the answers are specific enough.

Produce a short, revisable definition of the user, value, complete journey, current scope, and validation plan. Adjust detail to the product.

Choose a starting point below, then define, research, scope, and review the product. Replace prompt placeholders; mark unknowns as “to discuss.”

---

## 1. Choose a Path Based on How Clear the Idea Is

Bring an outline for review, or use conversation to clarify a vague idea. Both paths lead to the same product definition.

[![Two ways to reach a clear problem — An outline and an open conversation are complementary starting points. Revisit uncertain parts as evidence changes.](https://media.qiannawang.com/notes/workbench-diagrams/v3/scope-paths.en-a422298c26d3.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/scope-paths.en-a422298c26d3.webp)

*An outline and an open conversation are complementary starting points. Revisit uncertain parts as evidence changes. [Open full-size diagram](https://media.qiannawang.com/notes/workbench-diagrams/v3/scope-paths.en-a422298c26d3.webp)*


### Path A: Start with an Initial Outline

Give AI your work experience, requirements notes, feedback, or feature list. Examine which user task each feature serves, why it is needed, and which judgments lack evidence. Even a detailed list can leave the audience and core value open to challenge.

This prompt can start the full product definition process. Sections 2–6 explain how to assess the quality of its results.

```prompt
You are a product adviser with experience in product analysis and software delivery.
I have an initial outline. Help me review it, improve it, and define the scope of this version.

Project and stage: [Name; new product or iteration]
User and situation: [Who will use it and when]
Core problem and current approach: [How the task is handled now and what is difficult]
Desired outcome: [What the user should complete or receive]
Initial journey and candidate features: [Paste my outline]
Evidence and materials: [Feedback, observations, research, competitor links, or other materials]
Known constraints: [Time, budget, business, data, or operating conditions]
For an iteration: [Current behavior, proposed changes, and capabilities to preserve]

Please:
1. Restate your understanding of the user, core task, and value. Examine gaps and contradictions.
2. Distinguish facts, interpretations, and hypotheses. Identify the assumptions that most affect the direction.
3. Research specific questions where necessary, explaining which findings affect scope.
4. Define the shortest complete user journey. Divide features into required now, future candidates, and out of scope for now, with reasons.
5. Write a short PRD with main exceptions, acceptance criteria, and a plan to validate user value.
6. List questions for the subsequent design and architecture stage.

Working agreements:
- Challenge my outline where appropriate. Identify what could be simplified, changed, or dropped.
- Do not automatically turn candidate features or competitor features into current requirements.
- If missing information would materially change the user, core value, or scope, ask up to five focused questions first and wait for my answers before settling the affected conclusions.
- For other uncertainties, state provisional assumptions and continue the parts that can be completed independently.
- Give sources and checking dates for external research. Mark unverifiable claims for checking; do not invent feedback or data.
- This task is product definition. Leave detailed technical design and coding for a later stage.

Organize the output as project understanding and key questions, evidence and assumptions, core journey, scope decisions, a short PRD, and validation and handoff.
```

### Path B: Start with a Vague Idea

If all you can say is "I want to build a learning tool" or "I want to improve this part of my work," start with a recent difficulty, the current approach, and the change you want. Explore a few questions per turn, then compare a small number of directions once there is enough context. Keep the product form and features open for now.

A rough idea or one actual experience is enough; other fields can stay blank. Once you can provisionally describe the user, situation, difficulty, and desired outcome, prepare a one-page exploration summary and continue with Section 2.

```prompt
Act as a product exploration partner. Help me gradually clarify what I want to build through a conversation.
My idea is still vague. I cannot yet fully define the target user, product form, or features.

Current idea or interest: [Describe it in your own words; fragments are fine]
Related experience or observation: [A recent difficulty, a work problem, or something you noticed]
Desired change: [What you hope would become different for yourself or others]
Known conditions or preferences: [Fill in what you know, or leave blank]

Please work with me as follows:
1. Briefly restate your understanding, then ask only one to three useful questions per turn. Wait for my answers before continuing.
2. Explore specific experiences, current approaches, difficulties, and desired outcomes. Offer accessible examples when they would help me explain.
3. Once there is enough context, suggest two or three possible directions. Explain whom each serves, which problem it addresses, and what still needs testing, so I can compare them and respond.
4. After discussing a topic, briefly summarize what is clear, where we disagree, and provisional assumptions. Let me revise or reject them.
5. Once we can provisionally describe the user, situation, problem, and desired outcome, prepare a one-page exploration summary. Check that it represents my intention before moving into research and MVP scope.

Working agreements:
- Do not begin by asking me to complete a full requirements form or by producing a complete PRD or feature list.
- Do not present your suggestions as my decisions. Do not invent user needs or market validation.
- Allow the direction to narrow, change, or be postponed. Mention existing tools if they may already meet the need.
- Research specific external questions when necessary and give sources. Clearly mark information you cannot verify.
- Focus on the problem and value at this stage. Leave detailed technology choices and coding for later.

Use my starting information to ask the first round of questions.
```

**Use either path or combine them.** Return to exploration when evidence challenges the user or problem. Conversation still needs research and actual feedback; using an existing tool or postponing is also a valid outcome.

---

## 2. Define the User and Core Value

### Describe a Specific Situation

"Build an AI learning tool" gives a direction, but it does not yet define the first version. "Help people learn more efficiently" also needs detail. What are they learning? When do they need help? How do they handle the task now, and which part is difficult?

Use this sentence to draft a problem statement:

> For [a specific group of users], when [a situation occurs], the current approach of [how they handle the task] creates [a specific difficulty]. The product aims to help them [complete a core task], and we will examine its value through [an observable outcome].

For a knowledge practice tool, an example hypothesis could be:

> Independent learners who have just read a passage want to check their understanding. Rereading offers little explicit feedback, while writing questions and checking answers by hand takes effort. The product aims to turn the passage into a practice session that helps reveal specific gaps through questions and explanations.

This description already helps with priorities. The relationship between questions and source material, answer feedback, and a learning recap deserve attention. Leaderboards, shareable graphics, and virtual presenters each need a separate explanation of how they help the core task.

### Choose the First Group of Users

A product may eventually serve several groups, but the first round of validation benefits from a clear audience. Students testing themselves, teachers preparing questions, and businesses running training may all use a knowledge practice tool. Their needs for question review, saved results, and access permissions differ.

| What to clarify | Questions to ask |
| :--- | :--- |
| Target user | Whom does the first version prioritize? What is their background? |
| Situation | What triggers use? On which device and in what setting? |
| Current approach | Do they use another product, a spreadsheet, or manual work? |
| Main difficulty | Which step takes time, causes mistakes, or cannot be completed? |
| Desired outcome | What result would make this session useful to them? |

Initial answers may come from observation, work experience, conversations with users, or existing usage records. Keep unsupported answers as hypotheses for further research.

---

## 3. Combine Human Judgment with AI Research

### Turn Existing Material into Research Questions

Bring together the problem statement, observations, and constraints from the first two sections. Find gaps most likely to change the direction. Narrow "research competitors" into a question that affects a decision, such as whether early users can work with pasted text or whether a business task requires an audit trail. Prioritize assumptions whose failure would change the user, core journey, or scope.

People familiar with the setting should supply its context. Data permissions, approval processes, content updates, and source traceability may all affect the choices. Record sources and missing material, and assign a next validation action to each important question.

### Research Specific Questions

You can alternate between tools with web research capabilities and conversational tools. Use research to find sources and understand existing approaches; use conversation to organize material, compare options, and draft the document. Check information that affects a decision against its original source.

Useful research questions include:

- How do people already complete the task, and where does that approach fall short?
- Which value do similar products emphasize first? What happens between opening the product and obtaining a result?
- Which features directly support the core task, and which support retention, collaboration, or charging for the product?
- Which external capabilities does the idea depend on? Do data availability, interfaces, cost, or deployment conditions affect the first version?

A competitor comparison should record concrete observations, such as the first use journey, input requirements, output format, and failure handling. A checklist of product names and features still needs an explanation of what the differences mean for the intended user.

| Comparison area | What to record |
| :--- | :--- |
| Audience and task | Whom the product explicitly serves and what it helps them do first |
| Core journey | Conditions for starting and the main steps to a result |
| Output value | Whether the user receives a file, answer, report, or completed action |
| Usage limits | Supported inputs, quotas, account requirements, and observation date |
| Relevant choices | Which decisions fit your scenario and which need reconsideration |

Questions about user behavior need conversations or observation. To investigate whether early users can work with pasted text, ask people who fit the scenario to demonstrate their current approach using material from a recent task. Record where they get stuck, existing alternatives, and the effort involved. Ask about experiences that have already happened; keep statements about future willingness to use the product as hypotheses.

### Distinguish Facts from Uncertainty in the Analysis

AI can help suggest explanations and approaches. Examine the basis for a convincing answer by separating three kinds of information:

- **Known facts:** information with a source, observation, or record you can check, such as steps you experienced while using a product.
- **Interpretations:** explanations drawn from those facts, such as the possibility that a prerequisite increases the effort of first use.
- **Hypotheses to test:** judgments that still need user conversations, a prototype, or actual use, such as willingness to pay for an outcome.

Record the source, checking date, and next validation step for important claims.

**Feasible is not the same as useful.** Check whether users have the task and why existing approaches fall short.

### Research Alternatives and Evidence

Use this prompt to compare existing approaches. List questions that require user conversations or direct observation as follow-up validation actions. A source supports only what it actually establishes.

```prompt
Research existing ways to solve the product problem below and help me decide the scope of this version.

User, situation, and task: [Fill in]
Current approach and difficulty: [Fill in; mark unknowns]
Questions or assumptions to investigate: [List one to three]
Candidate approaches or sources: [Links or material; leave blank if none]
Known constraints and scope decision: [Fill in]

Please:
1. Compare at most three relevant approaches, including suitable manual methods or general-purpose tools. Explain how each completes the same task.
2. Record main steps, input requirements, outputs, limits, and implications for the user. Distinguish actual testing, documentation claims, and interpretation.
3. Give original source links and checking dates for facts that affect the decision. Mark inaccessible or unverifiable information as unknown; do not pretend to have tested a product.
4. Separate observed facts, interpretations, and hypotheses. Explain which evidence supports or challenges my idea.
5. Recommend continuing, simplifying, using an existing approach, or postponing. Explain which scope decisions would change and the smallest next validation action.

Use available web research capabilities. Without web access, analyze only the supplied material and list what remains to check.
Do not invent interviews, user counts, or market data, or automatically turn competitor features into current requirements.
Output a comparison, evidence gaps, and recommended tradeoffs. Leave detailed technical design and coding for later.
```

Use the web research capabilities prepared in the first stage. Write findings that affect scope back into the problem statement and assumption list before defining the MVP. You do not need to complete an exhaustive competitor study before making scope decisions.

---

## 4. Define the MVP Around a Complete Journey

### Find the Shortest Complete Journey That Delivers Value

MVP stands for Minimum Viable Product. It delivers core value within a limited scope and helps test a defined set of assumptions. First identify what this round needs to establish, then decide how much to build.

For the knowledge practice example, test whether one complete session helps users discover gaps in their understanding.

[![MVP keeps the whole value journey — Example: a single practice session. History, richer inputs, and social features need separate justification.](https://media.qiannawang.com/notes/workbench-diagrams/v3/scope-mvp.en-6ff51b8d40de.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/scope-mvp.en-6ff51b8d40de.webp)

*Example: a single practice session. History, richer inputs, and social features need separate justification. [Open full-size diagram](https://media.qiannawang.com/notes/workbench-diagrams/v3/scope-mvp.en-6ff51b8d40de.webp)*


A generation endpoint alone leaves the user’s task unfinished. Keep input, practice, feedback, and review in the same journey.

Start with one input type. A recap can be a results page; evaluate sharing, downloads, and history separately.

### Decide What Belongs in This Version

Ask whether the core value would still hold without a feature. Also check whether it provides a necessary condition for the current round of validation.

| Decision area | Question |
| :--- | :--- |
| Core task | Can the user still complete the main task without it? |
| Validation goal | Can you still test the most important assumption without it? |
| Conditions of use | Would its absence prevent actual use? |
| Simpler alternatives | Could a simpler interface, manual step, or narrower scope work for the first round? |

History belongs in scope when reviewing across sessions is central. Training may require identities and records; a payment hypothesis needs observable purchase behavior.

Judge databases, knowledge retrieval, accounts, and payment against the task. Retrieval may be central when an existing knowledge base is the necessary source for answers. Decide its place in the MVP from that requirement.

### Record Inclusions and Deferrals

A scope table should include why something is deferred and when to reconsider it. The following choices illustrate a knowledge practice tool:

| Current scope | Deferred work | When to reconsider |
| :--- | :--- | :--- |
| A single text passage as input | Documents, videos, and web pages | Early users need these sources and the text journey has received feedback |
| One question format with explanations | Multiple formats and generated illustrations | Different formats have a demonstrated role in the learning task |
| A recap of the current session | Sharing, report export, and historical trends | Users need to take results away or return for ongoing review |
| Individual practice | Multiplayer challenges and leaderboards | A specific shared learning scenario has emerged |

Apply the same approach elsewhere. A download tool can first test downloading from specified sources. A personal website can define what visitors need to find. An internal system can focus on one business task that can run from initiation to completion.

---

## 5. Write Requirements That Can Be Checked

### Describe Behavior Beyond Feature Names

"Intelligent summaries," "a friendly interface," and "fast responses" express intentions. Add the trigger, input, output, and what happens when something goes wrong.

For each core requirement, ask when the user starts it, what the system processes, what the user receives, and how they can continue after a failure.

For example, expand "provide feedback after an answer" into:

> After the user submits an answer, display the correct answer, their answer, and an explanation. The explanation should correspond to the input material. After reviewing feedback, the user can move to the next question. If generation fails, preserve the input and provide an understandable message and a way to retry.

Check the normal journey and the main exceptions: empty or unsupported input, processing, failure, duplicate submission, and whether the user needs to resume after leaving. Define the behavior for situations relevant to the current task.

### Define Quality for AI Output

An AI requirement should explain how people will use the output and which errors would disrupt their task. For a knowledge practice tool, check whether questions are grounded in the input, the wording and choices are clear, and answers agree with explanations. For a summary tool, check for missing essential information, whether conclusions can be traced to a source, and how insufficient material is handled.

Prepare a small set of representative inputs covering normal, boundary, and failure cases. Describe the expected behavior before deciding whether numerical targets are useful. Set quality, waiting time, and cost targets for the actual scenario, and distinguish intended targets from measured results.

### Check Functional Completion and User Value Separately

Functional completion and user value need different evidence. A successful demonstration does not replace observation of real use.

| Compare | Functional acceptance | Value validation |
| --- | --- | --- |
| Core question | Does the system behave as defined? | Does it help the person solve a real problem? |
| Practice example | Complete a session; preserve input on failure; show a recap of this session. | Discover gaps; actually return with new material; understand why people continue or stop. |
| Evidence | Representative examples, edge cases and failure paths checked against expected behavior. | Observe real tasks, useful outcomes and repeat use; record behavior separately from stated interest. |
| What it establishes | Delivery meets the agreement; this alone does not prove product value. | Evidence for continuing, adjusting or stopping, within the limits of the trial. |

Describe a specific experiment: who participates, which actual task they use, what behavior to observe, when to review the results, and what would change the decision. Choose participant counts and thresholds for the setting before the trial. Record task completion, discovered problems, and repeat use separately from stated interest. The example in Section 6 shows this format.

---

## 6. Assemble the Product Definition in a Short PRD

A PRD is a Product Requirements Document. Bring the problem, evidence, scope, and acceptance criteria into one current version, recording decisions and open questions. The initial document can be brief. Use this template for a new product or an iteration of an existing one.

```prompt
Product or iteration name

Background and problem
Target user:
Triggering situation:
Current approach and main difficulty:
Evidence and sources:

Current goal
Core task the user should complete:
Most important hypothesis to test:

Core journey
Starting input, main steps, and resulting outcome:

Scope and tradeoffs
Included in this version:
Excluded from this version:
Reasons for exclusion and conditions for reconsideration:

Core requirements and acceptance
Triggers, inputs, and outputs:
Normal journey and main exceptions:
Acceptance criteria and representative examples:

Known constraints
Relevant business, data, time, cost, or operating limits:
Confirmed conditions and provisional assumptions:

Validation plan
Behavior or feedback to observe:
How to test it:
Results that would lead to continuing, changing, or stopping:

Open questions
Questions that affect scope:
Questions for design and development:

Decision log
What changed, why, and which journeys or criteria it affects:
```

For an existing product, add its current behavior, the proposed change, and capabilities that must be preserved. This helps reveal whether the new requirement affects an established journey.

Store the requirements in project Markdown or a document tool suited to the collaboration. Maintain one clear current version, with links or attachments for research and longer records, so that different documents do not describe conflicting scopes.

### Example: A Short PRD for a Knowledge Practice Tool

The following draft brings together the earlier examples. **This is a hypothetical project used to illustrate the format; it has no actual user validation yet.** Input limits, participant counts, and decision thresholds are illustrative choices. Adjust them for the setting and agree on them before the trial.

**Background and problem:** The first users are independent learners who have just read a passage and want to check their understanding. They may currently reread it or write their own questions, but struggle to identify gaps. This is a product hypothesis to investigate through interviews; no interview records or competitor testing evidence are available yet.

**Current goal and hypothesis:** Help a user complete a practice session grounded in the passage and identify one point to revisit. The hypothesis is that answering questions with corresponding explanations helps reveal specific gaps in understanding.

**Core journey:** Paste 200–2,000 characters of material → Generate three multiple-choice questions → Answer each question and read its explanation → Review incorrect answers and the corresponding source passages.

**Scope and tradeoffs:** Include text input, one question format, explanations, and a session recap. Defer accounts, saved history, document and video inputs, sharing, and payment to focus on the value of one session. Reconsider accounts and history if people actually return and need review across sessions. Reconsider other inputs if their main materials cannot reasonably be pasted.

**Core requirements and acceptance:**

| Situation | Behavior that can be checked |
| :--- | :--- |
| Input and generation | For blank or out-of-range input, explain the limit, preserve the text, and do not start generation. For five pre-reviewed valid samples, produce three questions per sample, each with four choices, one correct answer, an explanation, and a source passage. Manually verify that the source supports each answer. If material is insufficient, explain why and allow editing. |
| Answers and recap | After submission, show the user's answer, the correct answer, and the explanation before continuing. At completion, the recap's incorrect answers and source passages match this session. |
| Failure and retry | When a generation service failure is simulated, preserve the text on the current page and offer retry. Repeated generation clicks do not create multiple sessions. Recovery after closing the page is outside this version. |

**Known constraints and open questions:** Start by testing a single session in a desktop browser, without saved history. Generation time, per-session cost, and quality across different materials have not been measured. Record them during a feasibility experiment; narrow supported material or change the journey if they cannot support the trial scenario.

**Value validation plan:** Invite five learners who fit the scenario to complete one session each using material they have permission to use. Ask them to explain a gap they discovered and check it against the source. A provisional condition for continuing is that at least three identify a source-supported gap and at least two choose to complete another session with new material and actually finish it. Fix input or interaction obstacles first. If the journey works but nobody discovers useful new information, revisit the problem and approach. This small trial informs the next experiment; it cannot establish learning effectiveness.

**Decision log and handoff:** Start with text and a session recap to reduce retrieval and history management work during validation. Hand over questions about waiting and retry behavior, necessary temporary state, and measurement methods. Update this PRD whenever a decision changes scope.

### Refine the Document with doc-coauthoring

For substantial material and iterative writing, consider Anthropic's [doc-coauthoring](https://github.com/anthropics/skills/blob/main/skills/doc-coauthoring/SKILL.md). Its context gathering, refinement, and reader testing can help organize interviews, notes, and an outline into a PRD. See the [Skills directory](https://skills.sh/anthropics/skills/doc-coauthoring) for installation:

```bash
npx skills add https://github.com/anthropics/skills --skill doc-coauthoring
```

The skill is optional; the template and prompts also work on their own. Once the draft is assembled, use the next section to check whether a reader without the earlier conversation can understand it.

---

## 7. Review and Revise the Draft

Examine the written product definition for possible misunderstandings, unsupported decisions, and requirements that cannot yet be checked. The review should produce specific issues and suggested changes. Incorporate necessary revisions into the same PRD assembled in Section 6.

### Ask AI to Review Without the Earlier Context

Start a fresh conversation with only the PRD and necessary attachments. Check whether it accurately understands the user, complete journey, exclusions, and acceptance criteria. This also supports the previous section's reader testing. Ask the reviewer to identify gaps rather than filling them with explanations from the earlier conversation.

```prompt
Act as a product reviewer encountering this project for the first time. Review the product definition below.
Judge only from the supplied material and explicitly mark missing information as unknown.

Product definition: [Paste the PRD]
Supporting evidence or appendices: [Paste or link; state if none]
Time and resource limits for this version: [Fill in; leave blank if unknown]

Check:
1. Whether the user, triggering situation, core problem, and desired outcome are specific and consistent.
2. Whether the MVP forms a complete journey, what could be simplified or deferred, and whether exclusions break the core task.
3. Which conclusions lack evidence or present hypotheses as facts.
4. Whether core requirements include executable acceptance criteria, representative examples, and main failure cases.
5. Whether the validation plan tests user value, with clear conditions for continuing, changing, or stopping.
6. Whether someone without the earlier conversation can understand the scope and proceed to design.

For each issue, give its location, specific problem, impact, suggested change, and whether it blocks the next stage.
Separate direction-changing gaps from improvements that can wait. Do not mark an item as passed without sufficient evidence.
Ask at most five key questions about blockers. Do not invent decisions or expand scope on my behalf.
Finish by judging readiness for the next stage and listing issues that must be resolved first.
```

Resolve gaps that could change the user, core value, scope, or acceptance first; record other improvements for later. An AI verdict is one review result. Section 8 uses the remaining questions to decide whether to proceed.

Distinguish an untested hypothesis from an incomplete plan. The trial in Section 6 has not happened yet, but it can remain a planned validation item when its goal, method, and decision conditions are clear. If what to observe is still unclear, refine the plan first. Reviewing the document does not itself produce evidence from users.

### Annotate the Document and Keep the Reasons for Changes

Whichever path you use, once there is an exploration summary or requirements draft, you can comment directly in the document:

```prompt
[TODO] The audience is too broad. Separate the scenarios and suggest which group to prioritize.
[CHECK SOURCE] Where does this limit come from? Verify it before excluding this input type.
[SCOPE DECISION] Support text first. Keep other inputs as future candidates.
[ACCEPTANCE NEEDED] Which examples and checks define a good explanation?
```

Ask AI to revise from those comments and check that related scope, journeys, and acceptance criteria change together. Incorporate confirmed decisions into the current text, keep unresolved matters as open items, and record the reasons for decisions that affect scope.

When a new idea appears during development, examine how it affects the current core task. If it changes the goal of this version, update the requirements and acceptance criteria together. Otherwise, keep it as a future candidate. This allows new learning while preserving a clear completion boundary.

---

## 8. Decide the Next Step and Hand Over

After review and revision, use the remaining questions to decide the next step. Clearly marked assumptions can travel with the work, but gaps that could change the direction need an explicit decision.

| Current situation | Next step |
| :--- | :--- |
| The user and core task are clear, scope and acceptance are actionable, and remaining questions concern implementation | Move to Architecture & Contracts to define the technical approach and interfaces |
| Uncertainty about input, task duration, data use, or an external capability could make the core journey infeasible | Run a small feasibility experiment, record the results, and adjust the PRD |
| The user, problem, or core value is still unclear and the evidence does not support the direction | Return to exploration or user research, narrow the direction, or postpone development |

Use the current PRD as the handoff entry point, with links to evidence, acceptance examples, and open questions. For each important question, state the decision it affects and how you plan to resolve it. Put requirements for saved results, continuity across devices, acceptable waiting time, and behavior during external failures into the relevant requirements.

The next stage can use this material to discuss technology choices, data models, and interface contracts. When architecture experiments or actual use reveal new information, follow Section 7 to revise scope, acceptance, and the decision log together.
