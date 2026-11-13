# 【AI Dev Workflow · 04】 UI Prototype & Ergonomics: From Product Flows to Usable Interfaces

> **What should this stage produce?**
> [Chapter 03](https://www.qiannawang.com/notes/architecture-contracts) defined responsibilities and API contracts. Now turn those decisions into an interface people can understand, operate, and recover in when something goes wrong.

An agent can build a page quickly. **A page that renders does not establish that a task is easy to finish.** Use a clickable prototype to check the flow, information order, and interaction states before connecting real services.

We continue the **knowledge quiz tool** from the previous chapters: provide material, generate practice, answer questions, then inspect explanations and source evidence. The layouts and numbers below are teaching examples, not validated product results.

| Decisions you own | Work an agent can help with |
| :--- | :--- |
| What the user does first and which outcome matters | Map the task into views and states; identify gaps |
| Which information is primary or optional | Implement layouts using established styles and components |
| What waiting, failure, and leaving should mean | Create controllable mock scenarios |
| What counts as usable | Check implementation, then validate through actual task trials |

---

## 1. Derive Views from Tasks

Start with one task: **“Practice using this material, find what I misunderstood, and check the evidence.”** Follow that task before listing a homepage, dashboard, or account center.

[![One task, four interface moments — Views follow the task; they need not become four separate URLs.](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-task-pages.en-3941ad3d64e4.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-task-pages.en-3941ad3d64e4.webp)

*Views follow the task; they need not become four separate URLs. [View full-size](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-task-pages.en-3941ad3d64e4.webp)*

**Organize around the task; each moment does not need a separate URL.** A small tool may switch states on one page. Split views when length or independent access justifies it.

- **Provide material:** Explain supported inputs and place format or length limits beside the input.
- **Generate practice:** Keep the input recognizable; explain the wait and offer cancellation or recovery.
- **Answer questions:** Make the question, answer controls, and submission clear. Do not reveal explanations prematurely.
- **Review feedback:** Distinguish correct, incorrect, and insufficient evidence. Source review should return to the same answer position.

This list defines the prototype scope. **Do not add accounts, history, or billing merely because a template includes them.**

## 2. Establish Information Hierarchy

An interface should answer: **Where am I? What can I do now? What happens next?** Check those questions in a wireframe before refining color, spacing, and decoration.

[![Give the next action a clear place — A wireframe for the answering state. Explanations appear after submission.](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-reading-order.en-f351e5b8a295.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-reading-order.en-f351e5b8a295.webp)

*A wireframe for the answering state. Explanations appear after submission. [View full-size](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-reading-order.en-f351e5b8a295.webp)*

Answering is the primary task, so the question and choices lead. Source material is available on demand; feedback appears after submission. Establish this order before making every module an equally prominent card.

**Turn references into explicit requirements**

Instead of asking an agent to “copy this screenshot,” identify the parts worth borrowing and the existing rules to retain:

- **Layout:** Is the reference about a split view, content width, or spacing?
- **Hierarchy:** How do headings, body text, and supporting notes differ? Which action leads?
- **Components:** Reuse established buttons, fields, navigation, and feedback patterns.
- **Boundaries:** Design narrow screens, error states, and long content that the reference does not show.

Use an existing component library or the project's current stack. **Confirm the task and states before adding dependencies.** The GOV.UK guide to [making prototypes](https://www.gov.uk/service-manual/design/making-prototypes) explains the uses of different fidelities, from paper to code. Choose the fidelity that answers the current question.

### Define a Visual Direction

Once the flow is clear, describe the character of the page. Anthropic's [frontend aesthetics guide](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics) recommends specifying typography, color, motion, and backgrounds, providing concrete references, and identifying generic defaults to avoid.

For our quiz tool, “quiet and suitable for reading” can become this **visual brief**. These are example decisions; replace them with the rules of your project.

| Design area | A concrete instruction for the agent |
| :--- | :--- |
| Typography | Reuse project fonts; distinguish headings, body, and notes. Wrap long questions naturally and choose a readable measure and line height |
| Layout and spacing | Make answering the primary desktop area, with source material available on demand. On mobile, put the question first; group related information and use consistent spacing |
| Color and background | Retain the light background, neutral grays, and fine rules. Make the primary action clear; accompany error and selection colors with text or shape |
| Motion and feedback | Use motion to explain a view change or panel appearing. Keep the answer area stable and show the final state directly when reduced motion is requested |

**In an existing product, inherit its design rules first.** The guide's font exclusions, dramatic type contrasts, and background effects are example preferences. This site retains its established two-font, neutral-gray direction. Check Chinese glyph coverage, fallback fonts, and mixed-language text separately; an English specimen alone is insufficient.

### Extract Rules from References

When a page appeals to you, identify the specific decision worth borrowing. [Refero Styles](https://styles.refero.design/) organizes website examples into typography, color, spacing and component rules, with formats such as `DESIGN.md`. Use its method to turn a visual preference into instructions an agent can reuse.

**Observe one decision, write one rule, then define its limits.** For the quiz tool:

| What you observe | A requirement for your own project |
| :--- | :--- |
| Prominent headings and quieter body text | Reuse project fonts, distinguish heading and body roles, and check wrapping with real long questions |
| Related content sits together, with space between groups | Keep questions and choices together; disclose source evidence on demand instead of importing the reference's entire layout |
| One action leads visually | Prioritize “Generate practice” after material input; keep “Use sample” secondary and specify waiting and failure states |

Keep three things: **the reference, the adopted rule, and what still needs validation.** Update the project's existing design notes, or maintain a `DESIGN.md`. The filename matters less than concrete, checkable rules that stay aligned with the implementation.

Refero's [example notes](https://styles.refero.design/style/12255b63-e506-4bc1-a4cd-d05487de32f3) distinguish normalized styles, interpreted recommendations and reconstructed examples. Treat these as design references, rather than official brand specifications or original component code. Check the reference's fonts, buttons and palette against your own project before adopting them.

```prompt
Prepare a visual brief for one view. Do not edit code in this pass.

- View and core task: [for example, answer a question and inspect source evidence on demand]
- Existing pages / reference screenshots: [attach; identify whether each informs layout, typography, or atmosphere]
- Fonts, palette, components, and content to retain: [attach]

Inspect the project's existing styles first. For typography and hierarchy, layout and spacing, color and backgrounds, and motion and feedback, specify the exact object, proposed rule, and verification method. Turn adjectives such as quiet or polished into observable decisions. Mark unknowns explicitly.

Describe desktop and narrow-screen content order, wrapping for long Chinese headings and body text, keyboard focus, and reduced-motion behavior. List existing text, screenshots, and working behavior to preserve. Reuse fonts and dependencies unless there is a justified need to change them.

Deliver a visual brief for the prototype implementation, recording references, adopted rules and open checks. Distinguish requirements directly supported by references from your own suggestions. Update existing project design notes first, using DESIGN.md if helpful; do not overwrite the project with the reference product's entire visual system.
```

## 3. Describe the Behavior

“Make it polished” and “add animation” are hard to verify. Beginners do not need to memorize every component name. Start with:

**Object → trigger → visible change → completion and boundaries.**

> **Vague:** Make the card move.  
> **Specific:** On pointer hover, raise the practice card by 4 px over 200 ms and darken its border; restore it on pointer leave. Use an outline for keyboard focus and direct activation on touch. Remove the movement when reduced motion is requested.

The duration and distance are adjustable example parameters. They describe a visual transition, not a promise that a business request finishes in 200 ms.

### Describe an Action Entry

“Make the button stand out” leaves its purpose unclear. A call to action (CTA) should explain **what to click, what follows, and which action takes priority.** [CTA.gallery](https://www.cta.gallery/) collects buttons, forms, downloads and other action entries. Inspect wording, placement and priority; inclusion in a marketing gallery does not establish conversion performance.

Compare two actions using the same material in the quiz tool:

| Comparison | What to observe |
| :--- | :--- |
| Replace “Continue / Try” with “Generate practice / Use sample” | Can someone predict the next step before clicking? |
| Keep explicit wording, then emphasize “Generate practice” | Is the main action easy to find, while the secondary action remains recognizable? |
| Activate the action and inspect waiting and failure | Are duplicate submissions prevented, material retained on failure, and retry clearly available? |

You could request: **Make “Generate practice” the main action after the material field, with “Use sample” secondary. During generation, explain the wait and prevent duplicate submissions. On failure, retain the material and offer retry.** Check wording, visual priority and request states separately; stronger button color cannot answer every question.

### Change One Dimension

The guide also demonstrates [typography-only prompts and theme constraints](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics#isolated-prompting). Here, apply that approach to a bounded iteration: **identify the intended improvement, then compare the result.**

1. **Keep a baseline:** Capture the same content, state, and viewport before editing, with both desktop and narrow-screen examples.
2. **Limit the pass:** For example, “Adjust only the question page's text hierarchy and paragraph spacing. Retain layout, palette, buttons, and answering behavior.” Keep the scope of a typography change explicit.
3. **Compare and try:** Check hierarchy, long Chinese text, and mobile readability, then complete answering and source review again. Record observations instead of accepting “more polished” as a test result.

Use the lab next to connect these decisions with examples you can operate.

### Try the Interface Lab

**[Open the interactive lab →](/notes/ui-prototype-ergonomics/interface-lab.html?lang=en)**

The lab places settings on the left, a live preview in the middle, and the generated prompt on the right. Compare the Linear, Gumroad, AntD and Apple presets, then adjust layout, component-library direction, surface, accent color, corners and motion parameters. Examples run in the page without model requests or persistent settings.

Enable “X-Ray” to hover over or select the navigation, hero, button group, grid and other regions. The anatomy card explains their Chinese and English names and provides a requirement sentence. The right-hand glossary lists all ten regions. Turn X-Ray off to inspect the page without annotations. Controls retain the supplied Chinese/bilingual labels; this English entry starts with the English prompt, and the “中英结构版” tab offers the mixed-language version.

**Try → observe → name → describe:**

1. Choose a preset, then change one setting and compare the same content.
2. Enable X-Ray and identify the affected region by its name and explanation. Operate the preview's tabs and FAQ accordion directly.
3. Inspect the generated page prompt. Copy it, replace its example objects, and remove technology, component and visual requirements that do not apply.

Compare entrance styles, spring stiffness, damping and hover feedback, and toggle skeleton or toast examples. The preview approximates physical motion with CSS; validate the generated Framer Motion parameters in the finished implementation. The 75%, 85% and 100% controls change the canvas display scale. They do not test the finished page's mobile layout.

**Describe the page before the control.** Establish information order, primary and secondary areas, and reading rhythm. Then add component triggers and states.

| Page-level decision | Effects to describe |
| :--- | :--- |
| Layout | Asymmetric, equal and single columns; desktop split view and mobile source disclosure |
| Page ending | The same footer links in a flat list or purpose-based groups; normal flow without covering content |
| Type and spacing | Serif or sans-serif headings, type hierarchy; line height, paragraph gaps and text measure |
| Page motion | Fade or short upward movement on scroll; view changes with stable navigation and focus |

Replace “make it polished” with: **Use a lead column and a secondary column on desktop, serif headings, and comfortable body spacing. Stack them on mobile. Reveal secondary sections once on entry with a short upward fade; show them immediately when reduced motion is requested.** Then specify the relevant controls below.

| What you want to express | Names and rules to specify |
| :--- | :--- |
| What to click next and what follows | CTA: specific labels, primary and secondary actions, and resulting states |
| Whether a button can be used or is busy | Button: default, hover, focus, disabled, loading |
| A content item lifting slightly | Card: trigger, distance, border, return behavior |
| How someone corrects an invalid entry | Input: validation timing, error text, retained input |
| Related views in one location | Tabs: selection, keyboard controls, retained drafts |
| Secondary information revealed on demand | Accordion: expansion scope, one or several open |
| Detail without leaving the task | Modal / drawer: position, backdrop, dismissal, focus return |
| Confirmation of an operation | Inline status / toast: location, meaning, dismissal |
| Incremental AI output | Streaming / progress: partial versus complete, pause, failure, cancel |

**Explain the purpose before choosing the component.** An error blocking progress should remain near the relevant operation, rather than appearing only in a fleeting notification. A drawer is not inherently better than a dialog; consider whether the background must remain usable.

The lab demonstrates common page and component behavior. **It does not replace a complete project design system.** Replace its example objects with yours and remove rules that do not apply.

### Explore with a Question

Alongside Refero Styles and CTA.gallery above, choose a resource for the question you currently face. Leave with a requirement in your own words, beyond saving a screenshot.

| Your question | What to inspect and take away |
| :--- | :--- |
| What belongs at the end of a page? | Inspect typography and grouping in [Footer.design](https://www.footer.design/). List the navigation, contact or explanatory routes you need; keep the main action in the main content |
| How should an object change on scroll? | Choose one local effect in [Scrolltide](https://www.scrolltide.co/). Record its object, trigger, movement and ending; add touch and reduced-motion behavior |
| Does an animated background help? | Inspect backgrounds in [Scroll Shaders](https://scrollshaders.com/). Check contrast, attention and a static alternative with your own text before adopting one |

The last two are optional advanced references. Establish the task, content hierarchy and failure recovery first. A working preview does not validate performance on your own devices and page.

**Check the design lesson and asset permissions separately.** The lab does not embed templates or shaders from these reference sites. Scrolltide's [terms](https://www.scrolltide.co/terms) and Scroll Shaders' [license](https://scrollshaders.com/license) distinguish finished-project use from resource redistribution. Check the specific permissions before copying code, downloading assets or offering reusable examples. Public references were checked in November 2026; changing catalog counts and prices are not selection criteria here.

## 4. Reduce Interaction Burden

Fewer clicks and denser screens need to serve the task. Automatic generation may save a click, but uploading private material or incurring charges requires an explanation before the trigger and confirmation where the product rules require it.

For the quiz tool:

- **Reduce searching:** Keep material, the current question, and progress in predictable places. Show submission feedback nearby.
- **Reduce remembering:** Preserve the current selection while inspecting the source.
- **Reduce guessing:** “Submit answer” is clearer than “Continue.” A busy button should communicate its action state.
- **Reveal details on demand:** Collapse explanations and full material where appropriate, with discoverable entry points.

[![Keep the task order across screen sizes — A secondary source panel can move into a drawer; preserve the current answer.](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-responsive-order.en-a96298f2c9ad.webp)](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-responsive-order.en-a96298f2c9ad.webp)

*A secondary source panel can move into a drawer; preserve the current answer. [View full-size](https://media.qiannawang.com/notes/workbench-diagrams/v3/ui-responsive-order.en-a96298f2c9ad.webp)*

Desktop may show questions and source side by side. On mobile, prioritize answering and open the source on demand. **Responsive design preserves task order; shrinking the desktop is insufficient.**

**Check these directly**

- **Keyboard:** Reach controls in order, see focus, and return to the opener after dismissing an overlay.
- **Touch and narrow screens:** Essential actions must not require hover. Controls remain usable without page-wide horizontal scrolling.
- **Meaning:** Give errors textual explanations. Do not communicate selection or completion through color alone.
- **Motion:** Respect the system's reduced-motion preference. Status must remain understandable without animation.

These checks relate to [WCAG 2.2 requirements for keyboard access, focus, reflow, and status messages](https://www.w3.org/WAI/WCAG22/quickref/); performing a few checks does not establish conformance to the whole standard. Browsers expose the motion preference through [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).

## 5. Design Waiting and Recovery

AI mockups often show only input and an attractive final result. Prototype the intermediate states to discover repeated clicks, premature impressions of completion, and lost material.

| State | What users should understand and be able to do |
| :--- | :--- |
| Empty | Know the supported material and next action; optionally try a sample |
| Invalid input | See the reason near the field, with entered content retained |
| Running | See genuinely available status; avoid duplicate submissions |
| Partial output | Know it is unfinished and what remains missing |
| Complete | See the result and next action, beyond a success notification |
| Failed or canceled | Know what is retained, how to retry, and whether another charge applies |

**Do not invent progress.** If the backend can only confirm “accepted” and “generating,” show those states. Without a basis for total work, do not display a precise-looking percentage. The lab explicitly labels its progress as a local simulation.

**Streaming does not establish faster processing.** It can reveal output progressively, but measure time to first useful content separately from full completion. Durable queues, background execution, and recovery belong to [chapter 08 on production upgrades](https://www.qiannawang.com/notes/enterprise-ai-production). Here, define what the person sees and controls.

For example, retain material when quiz generation fails and offer retry. **A prototype's Cancel button defines intended behavior; whether the server can stop work and what happens to charges still require contract confirmation.**

## 6. Build a Clickable Prototype

Give the agent **the core task, scope, API contracts, existing visual references, and state rules**. Use controlled mock data to make the full path testable first.

```prompt
Build a clickable UI prototype in the existing project.

Inputs:
- PRD and scope: [attach]
- Architecture and API contracts: [attach]
- Existing visual references and components: [attach]
- Task: provide material → generate a quiz → answer → review explanation and source.

First inspect existing UI patterns. Summarize the proposed views, states and unknowns before editing. Preserve existing content, screenshots and working features.

Implement the scoped flow with clearly labeled mock data. Include empty, invalid input, running, partial, success, failure and canceled states where applicable. Allow deliberate switching between mock scenarios. Do not call real paid services or claim backend integration is complete.

Keep source review from losing an answer draft. Define desktop and narrow-screen behavior, keyboard focus and reduced-motion alternatives. Separate mock data from presentation so the real API can replace it later.

Deliver a runnable prototype, a state list and unresolved contract questions. Verify the main task and one failure path; report actual checks and remaining gaps.
```

**Attach a behavior description to the relevant component.** One applicable description from the lab is more useful than ten unrelated animations in a broad prompt.

Then compare the prototype with chapter 03's contracts: does the data exist, can errors be distinguished, and do cancel and retry have matching meanings? **A behavior working with mocks does not mean the real service supports it.**

## 7. Validate with a Task

Walk the full flow yourself, then ask someone resembling the intended user to try it. Give a task without teaching each click. Record hesitation, misunderstood wording, and unnecessary backtracking.

For example: **“Use this material to complete a quiz, check the evidence for a wrong answer, and return to your practice.”** Observe completion and points needing explanation. Do not claim efficiency gains without measurement.

```prompt
Review this prototype against one task: use the supplied material to complete a quiz, inspect the source for a wrong answer, and return without losing progress.

Inspect the running UI and the relevant contracts. Check the normal path, generation failure, cancel/retry behavior, long content, a narrow viewport, keyboard navigation and focus return. Distinguish observed behavior from assumptions; do not report a check as passed unless you performed it.

List issues by their effect on task completion. Propose the smallest corrections, preserving current content and working behavior. Return evidence, remaining unknowns and a handoff checklist for real API integration. Do not mark user validation complete on behalf of real users.
```

**Bring these into the next stage**

1. **A clickable prototype:** One complete task and an accessible failure branch.
2. **Views and state rules:** Who triggers each change, what appears, available actions, and when it ends.
3. **Component and layout decisions:** Reuse, mobile behavior, and draft retention.
4. **Trial notes and open questions:** Observed problems versus items needing real services or users.

Connect real features and data in the next stage. Replace mocks scenario by scenario and verify again. **The prototype's central deliverable is a shared, checkable understanding of what should happen.**
