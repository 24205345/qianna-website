# Building qiannawang.com: A Full-Stack Personal Portfolio Case Study

> A personal account and practical guide to growing [www.qiannawang.com](https://www.qiannawang.com) from a static showcase into a website I can update through an editing dashboard. It covers content choices, visual direction, working with AI, publishing, and ongoing maintenance.

## Introduction: Why Build This Website?

A portfolio can be a single introduction page or an online résumé. I wanted a third possibility: **a small archive with the reading experience of a journal**.

- **For visitors:** a quiet place to explore, like opening a carefully arranged sketchbook or research archive.
- **For me:** a content management system (CMS) for updating articles, projects, and images without editing code and publishing the whole website each time.
- **For building it:** AI assistance to get the content and pages in place first, then add editing, storage, and analytics as needed.

The website now serves four purposes:

| Role | What it does |
| --- | --- |
| **Portfolio** | Projects and Traces present projects, photography, drawings, and observations from my travels |
| **Writing platform** | Notes holds technical reflections, tool experiments, and website-building experiences; Workbench organizes related articles and resources into workflows |
| **Personal introduction** | About explains my background, experience, and interests; the homepage offers a brief first impression |
| **Light interaction** | Guestbook accepts comments for review before publication; analytics helps me understand which content people open |

These purposes shape the website. A short introduction and a few representative projects may be enough if you want people to get to know you quickly. If you want to keep publishing, it helps to think further about how content is organized, read, and updated.

AI agent tools can help build a personal website: describe your needs in everyday language, let the tool help write and revise code, then adjust the result through previews and actual use. You still decide what to show, what it should feel like, and whether the result meets your needs.

## Positioning and Content Strategy

### 2.1 Dividing Content into Sections

I did not plan all these sections at the start. As my work developed and I had more to publish, I added new modules. Notes became a place for experiences and tool experiments; Workbench later brought related articles, prompts, and resources together as workflows.

These are the main sections today. Each has its own publishing rhythm and reading needs:

| Section | Path | Content | Update frequency |
| --- | --- | --- | --- |
| **Notes** | `/notes` | Long-form articles in Chinese and English, experiences, and tool notes | Occasionally |
| **Projects** | `/projects` | Research, architecture, and digital products, organized by project | On completion or meaningful progress |
| **Traces** | `/traces` | Photography, drawings, and outdoor travel records | As material accumulates |
| **Workbench** | `/workbench` | Articles, prompts, and resources arranged by step | As working methods develop |
| **About** | `/about` | Background, experience, and interests | Infrequently |
| **Guestbook** | `/guestbook` | Visitor comments reviewed before publication | As visitors submit them |

You do not need every section on day one. Look at the material you already have: what is worth sharing, what needs more explanation, and what could stand as a topic of its own. Combining a small amount of material first and separating it later can make maintenance easier.

### 2.2 The Homepage Reading Order

I originally put articles first so visitors would see what I was writing most recently. The current order is:

**Projects → Traces → Notes → Workbench → About Me → Guestbook Preview**

Work and observations come first, followed by writing and working methods, then personal background. This reflects how I want people to get to know me. A website centered on writing could keep articles at the top.

The homepage shows a small selection from each section, with links to the complete lists. This supports a quick visit while leaving clear paths for people who want to explore further.

The opening visual area is often called the hero. Mine uses a cover image, title, subtitle, and an `Enter →` text link. The image and brief introduction set the atmosphere: an invitation to browse a personal archive.

### 2.3 Choosing What to Show

1. **Quality before quantity.** Projects does not need extra entries just to fill a grid; one travel record can tell a complete story.
2. **Give words and images a purpose.** Explain the background, my contribution, and the results before expanding through images. Someone unfamiliar with the project should still understand it.
3. **Choose languages for the audience.** The Notes list and homepage mainly use English; article pages offer Chinese and English. Two languages also mean maintaining two versions, so consider what you can keep up to date.

When preparing a project, I choose a representative cover and write an introduction that makes sense on its own. Process images, results, and detail shots each explain something different. Captions help readers know what to look for.

The material also determines the presentation. A research project such as Thesis needs to explain the question, process, and results. The early Xicaoshi architecture project focuses on site, design, and space. Undergraduate Portfolio is a book, so page browsing and enlargement matter.

Travel records follow the same principle. Nanji Luo, Yubeng, and paragliding records mainly use galleries; the skiing record unfolds through an ordered sequence of text, photographs, and video. Decide what readers need to understand before asking AI to arrange the page.

## Visual Style and Design System

### Finding References and a Direction

Before writing code, I spent time browsing websites, taking screenshots, and collecting a sense of what I wanted. Personal portfolios can draw useful references from websites with **an editorial feel, generous space, and images that carry the story**. References do not have to be limited to designers' portfolios.

These are places I return to, grouped by what I study:

| Type | Where I look | What I study |
| --- | --- | --- |
| Curated websites | [Awwwards](https://www.awwwards.com/), [Godly](https://godly.website/), [siteInspire](https://www.siteinspire.com/) | Typography, restraint in motion, and information density in the first screen |
| Portfolios and photography | Behance, Dribbble, architects' and photographers' personal websites | Project storytelling, gallery rhythm, and About pages |
| Journals and blogs | Personal websites on Readymag and Cargo, independent magazines | Heading hierarchy, spacing, and the relationship between lists and long-form reading |
| Interface details | [Mobbin](https://mobbin.com/) (mainly apps, but useful for navigation and forms) | Sidebars, tabs, and mobile menus |

My process has four steps:

1. **Annotate screenshots.** Mark the text weight, colors, corner shapes, and image proportions I like. Include examples that feel too busy. Specific preferences make the discussion more useful.
2. **Write a short description of the atmosphere.** For example: warm grays, serif headings, restrained buttons, like a carefully arranged portfolio archive. Give the website a shared direction.
3. **Discuss it with AI.** Share the screenshots and description with Cursor. Discuss layout and homepage order before implementation. Mobile layouts and long content also need attention when references do not show them.
4. **Make a preview first.** Use real text and images to check reading order, proportions, title length, and spacing. Add dashboard editing after the presentation feels right.

References helped me identify principles such as spacing, hierarchy, and reading order. The warm grays and serif headings emerged through several rounds of screenshot discussion and page previews.

A prompt for this stage could be:

```prompt
I want a personal website showing [content], so [readers] can understand my [qualities or work].
Available material: [projects, images, articles, and introduction].

Reference A: I like its [heading hierarchy and spacing].
Reference B: I like its [image proportions and content arrangement].
The overall atmosphere should be [a short description].

First discuss the homepage reading order, page layout, and mobile presentation.
Explain which references suit my material and which need adjustments.
Mark missing material as something to provide later.
Propose an approach before coding, and do not add sections I have not requested.
```

### 3.1 Words That Guide the Style

I keep a few terms to guide new pages:

- **Quiet editorial presentation:** use headings, image sizes, and space to guide reading, with fewer competing decorations.
- **Warm grays:** a light background, dark headings, and softer body text establish a clear hierarchy.
- **Serif headings:** a book-like character for titles, paired with clear sans-serif body text.
- **Restrained labels:** smaller categories, dates, and section names stay distinct from the main content.

These terms should translate into visible choices. Restraint might mean fewer buttons, lighter dividers, and avoiding elaborate animation in every section.

### 3.2 Typography

The website uses Geist Sans for body text and a serif face for headings. They support extended reading and clear visual orientation.

I test fonts with real Chinese and English titles, paragraphs, and dates. A single English word looking good does not mean a long heading or Chinese paragraph will work equally well. Font size, line spacing, and wrapping on phones matter too.

### 3.3 Colors and Repeated Elements

Once the overall direction is clear, repeated elements need consistent treatment so AI has something concrete to follow when adding pages.

| Element | How I handle it |
| --- | --- |
| Background and text | Warm gray background, dark headings, and distinct levels of body and supporting text |
| Sections and cards | Thin borders, moderate rounding, and pale backgrounds without layers of nested boxes |
| Categories and links | Clear text, light dividers, and consistent hover feedback |
| Editing dashboard | Similar colors, with clear navigation, forms, and save actions |

I keep these rules in the project documentation and ask AI to read them before making changes. Feedback is also specific: “The category label draws attention away from the project title. Make the title more prominent while keeping the current colors and spacing.” This is easier to act on than repeatedly asking for something to look more sophisticated.

## Content and Media

A portfolio contains more than text: it also has high-resolution photographs and long videos. They need different ways of reading and managing them. I consider how the material should appear before deciding where to store it.

During the early move to online content management, Supabase held most text records and images. As photographs and large files accumulated, both the free storage space and transfer allowance became insufficient, and I could no longer upload new material smoothly. I moved images and other large files to Cloudflare R2. Supabase continues to hold articles, project information, login information, and file addresses.

R2 is an object storage service for files. For this website, the practical idea is simple: the file lives there, and the content refers to it by its address.

| Content | How it is managed | How it appears |
| --- | --- | --- |
| Articles and project text | Edited in the dashboard and saved in Supabase | Articles, project introductions, and tables of contents |
| Photographs and attachments | Files mainly in R2; addresses and descriptions in Supabase | Homepage covers, galleries, inline images, or downloads |
| Videos | Existing Google Drive links retained; file storage used as needed | Played within projects or travel records |
| Mixed-media records | Text, photographs, and videos arranged to suit the material | A continuous narrative or a gallery |

This arrangement developed through use. A small amount of material can start with a simple setup. When storage, transfer, or uploads become an actual problem, compare expanding the existing service with moving files. Consider future management and backups as well as the initial setup.

## Choosing Tools as the Website Grows

### 5.1 Make a Version That Can Show Your Work

When I started, I did not understand the differences between frontend, backend, and databases. I had not selected a complete technical setup. My goal was straightforward: quickly make a website that could present my work and introduce me.

I gathered my introduction, representative projects, and reference websites, then used AI to help make pages I could preview. Text and images lived directly in the project files; after editing them, I published the website again. That static presentation was enough to start, without a content management dashboard.

An actual page made it easier to judge the result: did the homepage order work, did text and images feel balanced, could a visitor open a complete project, and was it readable on a phone? Those observations helped me decide what to change next.

If you are starting from scratch, ask AI to help make a small version using real content: a short introduction, a few representative projects, and a way to contact you. Once that version communicates who you are, add functions in response to problems you encounter.

### 5.2 Add a Dashboard When Updating Becomes Work

Static pages met my initial needs. As the work and content grew, opening project files and publishing again for every text or image change became inconvenient. I wanted a page where I could log in and edit content: the CMS mentioned earlier.

I started with Projects, making existing projects editable in the dashboard and checking that the public pages showed the changes. Once that worked, I gradually extended it to other sections.

Solving these problems helped me understand the concepts. The **frontend** is the interface people view and use. The **backend** handles requests such as saving changes and checking permissions. The **database** stores organized information such as project names, descriptions, and categories. A first showcase needs pages people can view; logging in to edit and preserving those changes introduces further decisions about how these parts work together.

This website uses Supabase for content and login, with editing pages inside my own website. I can change a project or its order in the browser, and public pages read the updated content without requiring a code edit each time.

Looking back, the useful questions are: **Which current problem does this tool solve, and can I keep maintaining it?** If a few projects change only occasionally, static pages may still be enough. A dashboard can come later when updates become more frequent.

### 5.3 The Tools in Use Today

A technology stack is the group of tools supporting a website. These are the main tools the website uses today, rather than a checklist you need to complete for a first version:

| Tool | Its role here |
| --- | --- |
| **Next.js** | Organizes pages, reads content, and handles operations such as dashboard saves |
| **React** | Breaks navigation, project lists, and galleries into reusable interface parts |
| **TypeScript** | Checks data types to help catch some code errors |
| **Tailwind CSS** | Defines and coordinates page styles |
| **Supabase** | Stores articles and project information, and handles login and access permissions |
| **Cloudflare R2** | Stores images and other large files |
| **Vercel** | Builds and publishes the website, with production and preview addresses |
| **Markdown editing and display tools** | Support writing, formatting, and reading articles |

To let others visit, the website also needs to be published online. I use Vercel mainly because it connects to the code repository and builds and publishes changes, reducing the work of maintaining a server. I also wrote an [Alibaba Cloud ECS Docker deployment guide](/notes/aliyun-ecs-docker-deploy), an alternative depending on how much server maintenance you want to take on.

R2 joined later as images and large files grew. It addresses storage and transfer pressure while Supabase retains content information and file addresses. The same pattern applies: encounter a specific problem, then adjust the relevant tool.

These services still mean managing accounts, domains, usage, and renewals. Ask AI to explain candidate tools in terms of your current needs: why they are necessary, how updating will work, and what maintenance they add. Then decide whether to connect them.

## Managing Content: Database and Dashboard

### 6.1 Decide What You Need to Manage

With the dashboard in place, everyday content updates no longer require editing project files. Supabase stores content and handles login; the management pages provide the editing interface.

Before connecting them, I need to describe how I want content managed. A project needs more than a name and introduction: it may need a cover, gallery, category, and publication status. The website also needs to remember which project each image belongs to and its order. Explaining these relationships helps AI arrange the data and editing functions.

You do not have to learn to design an entire database first. Describe a real task: “I want to add a project, upload several images, arrange them, save a draft, and publish it after checking.” Ask AI to explain what needs saving for that task, then build a dashboard you can actually use.

### 6.2 Make Everyday Editing Convenient

I log in at `/admin/login` and switch sections through a sidebar. It can collapse on a computer and becomes a menu on a phone, leaving room for editing. These are the main tasks it supports today:

| Module | Managed content | Everyday tasks |
| --- | --- | --- |
| Site Settings | Homepage text, hero, and display images | Change introductions and selected images |
| Projects | Introductions, categories, images, videos, and presentation choices | Add or update projects and arrange galleries |
| Traces | Photography, drawing collections, and travel records | Add work, write descriptions, and arrange items |
| Notes | Bilingual titles, summaries, text, and attachments | Edit articles, save drafts, or publish |
| Workbench | Work stages, related articles, and resources | Arrange workflows and update resource links |
| About | Introduction, experience, interests, and photograph | Update background information |
| Guestbook | Comments, contact information, and review status | Read, approve, reject, or delete comments |
| Analytics | Content visit records | View statistics over different periods |

Features were added in response to actual editing needs. Homepage display images later received separate settings, for example, so changing a homepage selection does not require changing the original in a project page. When discussing such needs with AI, explain what you want to adjust independently and what should remain shared.

A useful dashboard makes content easy to find, distinguishes saving from publishing, and explains failures. Whenever I add an editing function, I change a real item, open the public page, and check its text, images, and order. I also return to the dashboard to make sure I can keep editing. Updates to bilingual content require checking both languages.

### 6.3 Decide Who Can View and Edit

The dashboard is for my use, while the website is public. What people can see and do needs to be clear. I explain these requirements to AI before it sets access rules for the database and save operations:

- **Visitors:** can read public content, without seeing drafts or dashboard information.
- **Administrator:** can edit content and view management information after login and permission checks.
- **Visitor submissions:** comments wait for review; email addresses and other contact information are only available for management.

A guestbook also needs ongoing attention. Whether to add one depends on whether you want to maintain this kind of conversation.

Permissions need actual checks. Browse without logging in and confirm that drafts, management actions, and private information are not exposed. Hiding a button does not by itself restrict access.

### 6.4 Maintain Files and Existing Links

Moving from local material to online management, and later from Supabase storage to R2, involves existing files and links. The difficult part is keeping earlier content usable.

My approach is:

1. **List what is involved:** identify the files and the pages that refer to them.
2. **Copy first:** place files in the new location while keeping the originals.
3. **Check:** confirm that the files are complete and the new addresses work.
4. **Switch:** update references, inspect the affected pages, and test new uploads.

Earlier, I also encountered a local copy of the repository missing original images. The material had to be completed before importing it. Before asking AI to move content, explain which files are already in use online, which are local, and what can be restored if something goes wrong.

Once a move is complete, everyday updates continue through the dashboard. Historical bulk import scripts are different from normal uploads and should not be rerun simply to check the website.

When reorganizing sections, I kept the original photography and drawing addresses available. Links shared earlier can still reach the corresponding content. Maintaining a website includes checking that existing images and links continue to work.

## Publishing, Domains, and Configuration

The next three sections follow the needs of a live website: make it accessible, improve how it appears in search and sharing, then understand its use. This work can happen gradually.

### 7.1 Publishing the Website

A local preview lets me check pages on my computer. Deployment publishes the website online so others can visit an address.

Vercel is connected to this website's code repository. Updates to the production code trigger a build and publication. Other branches can provide preview addresses for checking changes before using them on the main website.

A working sequence with AI is:

```text
Edit and preview locally → Run code checks → Review the preview version → Confirm and publish → Check the public address
```

Code being committed and the website being live are separate events. A failed deployment needs investigation; a successful one still needs an actual visit. Editing an article in the dashboard normally does not require publishing the entire codebase again.

### 7.2 Setting Up a Domain

A domain is the address visitors remember and use. You can start with the address supplied by the hosting platform, then connect your own domain once the main pages work.

| Domain | Use here |
| --- | --- |
| `www.qiannawang.com` | Main public website |
| `qiannawang.com` | Redirects to the main website |
| `qianna-site.vercel.app` | Alternative address supplied by the platform |
| `media.qiannawang.com` | Public media file addresses |

Setup involves adding the domain to the hosting platform and entering the corresponding DNS records with the domain service. Ask AI to explain each step, then check the addresses with and without `www`, HTTPS, and page links.

### 7.3 Environment Variables

Environment variables hold settings the website needs, such as which database and file storage to connect to and its public address. Your computer and the hosting platform need separate configuration. Working locally does not mean the online settings are ready.

Ask AI to explain where each setting comes from, where to enter it, whether it is private, and whether changing it requires another deployment.

Passwords and storage secrets must not appear in public pages or the code repository. Handle configuration in the relevant platform rather than placing complete secrets in screenshots or public troubleshooting notes.

### 7.4 Where Login Emails Return

When Supabase sends a login confirmation or password reset email, it needs to know which website the link should return to. An old domain or local address can send the visitor to the wrong place.

After connecting the production domain, check the website address and allowed return addresses in the login service. Then send an actual email and follow the link through the return and login process. Preview versions that need login should be checked separately.

## SEO and GEO

### 8.1 Why I Started Checking

After receiving an SEO sales comment, I checked my own website and found that page information still used the default `Create Next App` title. I realized that a working page also needs to introduce itself properly in browser tabs, sharing previews, and search results.

SEO helps search engines discover and understand pages. I first corrected basic information, then checked which pages search platforms had actually indexed.

### 8.2 Basic SEO Work

| Item | What it addresses |
| --- | --- |
| Website and page titles and descriptions | Explain the page and replace default template text |
| Sharing preview information | Show a suitable title, description, and cover when a link is shared |
| Consistent public addresses | Reduce confusion between entrances such as addresses with and without `www` |
| Sitemap | Lists public pages to help search engines discover them |
| Crawler instructions | Indicate areas that should not be crawled; the dashboard still relies on login and permissions |
| Author and website information | Describe the website, author, and their connections in a consistent format |

AI can help implement these settings, but it needs accurate names, descriptions, fields of interest, and public addresses. After updating projects or articles, check that their titles and summaries still fit.

### 8.3 GEO: Helping AI Understand Content

GEO, or generative engine optimization, generally concerns making content easier for generative search and AI answers to understand and cite. My starting point is to make the content clear.

1. Explain who I am and what I focus on at the start of About.
2. Provide consistent structured information about the website and author.
3. Give each project and article an introduction that explains its subject and results independently.
4. Provide `llms.txt` as a text introduction to the website's content and entrances.

For example, someone who reads only the opening project paragraph should understand the research topic and my contribution. This supports accurate communication, but it cannot guarantee that an AI platform will read, index, or cite the website.

### 8.4 Checks After Publishing

My checking order is:

1. Inspect titles, descriptions, covers, and links at the public address.
2. Verify website ownership in [Google Search Console](https://search.google.com/search-console).
3. Submit `sitemap.xml` and review the result.
4. Use URL inspection to understand crawling and indexing for important pages.

Domain verification and sitemap submission are complete for this website, and I have confirmed homepage indexing. New pages still need follow-up. A page not appearing in search immediately after publication is not necessarily broken.

For a personal portfolio, I would start with basic information, the introduction, and the content itself. Further optimization can follow actual needs and search performance.

## Visitors, Feedback, and Analytics

### 9.1 Complementary Sources

I want to understand both overall visits and individual articles and projects, so I keep the website's own records alongside platform tools:

| Source | What I look at | Where |
| --- | --- | --- |
| Website visit records | Which content is opened, visit counts, and approximate time spent | Dashboard Analytics |
| Vercel Analytics | Overall traffic trends and sources | Vercel dashboard |
| Speed Insights | Loading, response to interaction, and whether page elements shift unexpectedly | Platform experience statistics |

Page views are often called PV, and unique visitors UV. The latter depends on the measurement method: the same person using another browser may be counted again. Keep these limitations in mind when reading trends.

### 9.2 Using Visit Records

The dashboard can show content visits over different periods. It helps identify projects or articles people often open, then consider whether better explanations, updated material, or clearer links would support the website's goals.

Opening a page does not mean finishing it, and time spent may be affected by switching tabs. With few visits, there is little reason to rush into ranking content. Ask a few people to try the website and describe how they browse.

If the goal is to explain my work through projects, I can ask what project they remember, whether my contribution is clear, and whether the next step is easy to find. That feedback is often easier to act on than a single number.

### 9.3 Guestbook as Qualitative Feedback

Comments can explain what statistics cannot: what interests readers, what they did not understand, and whether they want to discuss something. Genuine feedback is worth answering and can guide the next content update.

I still review comments before publication. Generic sales messages and spam can be rejected without treating them as evidence that the website needs another service.

## Appendix: Lessons from Building the Website

These are working habits and decisions from building the portfolio, for anyone making a similar website.

### Set the Content and Atmosphere First

I deliberately placed the content and visual sections first. My initial questions were **how the homepage should be read, and whether the website should feel quiet or lively**.

Those decisions make it easier to judge a layout, interaction, or tool. Technology can change, while the work and personal expression need a basis of their own. The warm grays, serif headings, and restrained interactions developed through these judgments.

### Work in Small Iterations

Projects, Traces, Notes, Guestbook, and Analytics arrived gradually. Workbench appeared after articles and resources had accumulated.

For each content type, I first prepare material, arrange its presentation, complete editing, and try an update. Once it works, I extend to another type. This lets me reuse suitable patterns and notice features that are not worth developing further.

I care about whether an addition solves a real problem. The dashboard made updates easier; R2 addressed growing file storage needs. Those needs became clear through use.

### What Working with AI Is Like

Many features were built with an agent in Cursor. An agent is an AI assistant that can read the project, change files, and run checks. It helps with implementation, while content, style, and tradeoffs still require my involvement.

Some habits that help me:

- **Give one specific goal at a time.** “The homepage project description is too long; keep the name, cover, and one sentence so people can open the detail page” is easier to check than “improve the homepage.”
- **Read what already exists.** Ask AI to inspect existing pages, fonts, and navigation rules before making changes so the style does not shift each round.
- **Look at the actual page.** Explain what happens, why it affects reading or use, and the desired result. Add annotated screenshots when useful.
- **Check before keeping changes.** Ask AI to run code checks and a build, then personally try menus, details, mobile browsing, and dashboard updates. A completion report still needs confirmation through use.

A feedback prompt could be:

```prompt
This round should only change [page or section].
Current problem: [what happens and why it affects reading or use].
Desired result: [a change I can observe on the page].
Reference: [screenshot or an existing page that already works well].

Read the existing implementation first and explain the proposed change.
Follow the current visual rules and preserve unrelated content and functions.
Keep a recoverable version before editing.
Afterwards, check the actual desktop and mobile result.
Tell me what you checked and what still needs my own confirmation.
```

I also ask AI to look up documentation for the versions the project actually uses. Tools and frameworks change, so an older tutorial may not fit the current project.

### Connect Supabase, GitHub, and Vercel through MCP

Reading local files alone does not tell AI the live database state or whether a deployment succeeded. MCP is a way for AI tools to connect to external services within authorized permissions, reducing the need to copy screenshots and errors back and forth.

For this website, I mainly use these connections:

| Service | What it helps inspect | A building scenario |
| --- | --- | --- |
| **Supabase** | Content structures, access rules, and logs | Investigate failed saves or check existing data arrangements before adding content |
| **GitHub** | Code versions, change history, and automated checks | Confirm changes were saved and inspect checks after a commit |
| **Vercel** | Deployment state, domains, settings, and errors | Confirm production updates or investigate deployment and domain problems |

A few useful habits:

1. **Check actual state when needed.** Inspect how information is organized before adding a new content type, rather than guessing from an old description.
2. **Understand significant changes first.** Before deleting live content, changing online settings, or expanding permissions, review the scope and recovery options.
3. **Distinguish inspection from bulk work.** Connections are useful for checking state, settings, and problems; moving many files still needs a list and verification.
4. **Check documentation separately.** Official documentation or tools such as Context7 help confirm methods; service connections show actual online state.

Add the services through your AI tool's connection settings, review permissions, and authorize access. The precise interface changes over time, so follow current instructions. If a connection fails or authorization expires, restore it before treating an AI response as an observed result.

### The Website as a Place to Experiment

A portfolio can host small interaction experiments. I once added a water ripple to the homepage cover: mouse movement or a click gently distorted the image.

I made a development-only adjustment panel with sliders for wave speed, refraction, and trails, then saved settings I liked. Visitors who prefer reduced motion also need consideration, without being required to watch animation.

**The ripple effect is currently disabled.** I kept the experiment code, and the homepage now uses lighter motion. The lesson remains useful: try an effect separately, experience it yourself, then decide whether it belongs on the public page.

New gallery browsing, scrolling effects, and article presentations can be explored in the same way. The website gives me room to experiment; content and browsing experience guide what stays.

### Keep a Short Record of Decisions

For larger changes, I keep a short record of why I changed something, what I chose, how I checked it, and how to recover from problems. Returning to the project months later, these notes help me resume more easily than the final page alone.

Maintenance also means being able to find original images, text, account ownership, service usage, and renewal information. Public experiences go in Notes; details needed to maintain the website stay in project documentation.

### A Small Starting Point

If you are preparing a personal website, you can follow the order I used:

1. **Start with a static preview.** Prepare an introduction, a few representative pieces, and reference images. Use AI to help establish page order and atmosphere.
2. **Complete one browsing path.** Open a project or article from the homepage, then return to the list or find contact details. Try it on a computer and a phone.
3. **Add editing when updates need it.** Start with the content you change most often; my first module was Projects.
4. **Check the basics after publication.** Review public addresses, titles, descriptions, images, and sharing previews, then add search and analytics work as needed.

This is one path. Your material and publishing rhythm may call for a different first version. One page that communicates who you are is a valid start.

## Lessons and Possible Next Steps

### 11.1 Choices That Have Been Useful

1. **Make content easy to update.** Move frequently changed material into the dashboard and keep rarely changed areas simple.
2. **Reuse suitable patterns.** Follow existing reading and editing approaches when adding sections, reducing repeated decisions.
3. **Keep visual consistency.** Shared fonts, colors, spacing, and link behavior help the website remain coherent as it grows.
4. **Review comments before publishing.** Keep a way to communicate while retaining control over public content.
5. **Keep checking after launch.** Pages, search appearance, sharing previews, and dashboard updates all need actual use to confirm them.

### 11.2 Problems and What I Check

| Symptom | What I check first | Lesson for building |
| --- | --- | --- |
| Local images are blank | Whether material was downloaded completely and paths are correct | Check the input material before changing display code |
| More images, but uploads are restricted | Storage space, transfer usage, and upload method | Adjust services to actual use and retain original files before moving them |
| Login emails lead to the wrong page | Return addresses in the login service | Test email links after changing the public domain |
| Local preview works but deployment fails | Build errors and documentation for the versions in use | Ask AI to inspect the specific error, beyond the preview |
| A detail page fails | The data the page needs and how it is read | Open new features rather than checking only the homepage |
| Titles still show default text | Page titles, descriptions, and public addresses | Check browser tabs and sharing previews at launch |

### 11.3 Possible Next Steps

Future changes will follow the content and how the website is used:

- Review indexing in Search Console and address important page issues.
- Improve Notes covers and illustrations.
- Add public identity links such as LinkedIn to make background and contact easier to find.
- Add presentation templates for projects with different storytelling needs.
- Add RSS if readers need a way to follow new articles.

These are possibilities. Priority depends on whether each addresses a current problem.

## Closing

The website will keep changing with my work, writing, and interests. Decisions gradually become visible in its content order, visual atmosphere, and updating process.

If you are preparing a personal website, start by gathering the material you want to show and deciding how readers should get to know you. Then work with AI to build it step by step. Comments are welcome and appear publicly after review.
