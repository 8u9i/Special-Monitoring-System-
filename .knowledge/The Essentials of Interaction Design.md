# About Face: The Essentials of Interaction Design
## Complete Knowledge Base

---

# PART I: GOAL-DIRECTED DESIGN

---

## CHAPTER 1: A DESIGN PROCESS FOR DIGITAL PRODUCTS

### The Fundamental Problem

Digital products fail because of four main reasons:

| Problem | Description | Impact |
|---------|-------------|--------|
| **Misplaced priorities** | Marketing focuses on feature lists; developers focus on technical challenges | Products lack coherent user experience |
| **Ignorance about real users** | No understanding of what makes users happy | Products don't meet actual needs |
| **Conflicts of interest** | Developers who build also design (ease of coding vs. ease of use) | Implementation model dominates |
| **Lack of design process** | No repeatable method for ensuring desirability | Design is accidental or nonexistent |

### The Three Pillars of Product Success

**Desirability, Viability, Capability** (Larry Keeley, Doblin Group)

| Pillar | Description | Who Owns It |
|--------|-------------|-------------|
| **Desirability** | People want to use it | Design |
| **Viability** | It makes business sense | Marketing/Business |
| **Capability** | It can be built | Engineering |

**If any pillar is weak, the product fails.**

### Implementation Model vs. Mental Model vs. Represented Model

| Model Type | Definition | Characteristics |
|------------|------------|-----------------|
| **Implementation Model** | How the system actually works internally | Code, data structures, algorithms |
| **Mental Model** | How users THINK it works | Simplified, based on experience, often wrong technically |
| **Represented Model** | How the designer shows it to the user | What appears on screen, can be anything |

**CRITICAL PRINCIPLE:**
> **User interfaces should be based on user mental models rather than implementation models.**

### Why This Matters

When represented model matches mental model:
- Users understand the product easily
- Tasks flow naturally
- Learning is fast
- Errors are reduced

When represented model follows implementation model:
- Users must understand how software works internally
- Cognitive load is high
- Learning is difficult
- Users feel stupid

### Goals vs. Tasks vs. Activities

| Level | Definition | Change Over Time | Example |
|-------|------------|------------------|---------|
| **Goals** | Why user does something (end state desired) | Very slow or never changes | "Get to San Francisco quickly and safely" |
| **Activities** | High-level behavior patterns | Changes with technology | "Travel by wagon" vs. "Travel by plane" |
| **Tasks** | Specific actions to complete activities | Changes frequently | "Harness horses" vs. "Book flight online" |
| **Actions** | Individual operations | Platform-dependent | "Click button" vs. "Tap screen" |
| **Operations** | Atomic system interactions | Implementation-dependent | "Send HTTP request" vs. "Update database" |

**Key Insight:** Tasks change with technology; goals don't. Design for goals, not tasks.

### User Goal Types (Norman's Three Levels)

| Goal Type | Cognitive Level | Questions It Answers | Examples |
|-----------|-----------------|---------------------|----------|
| **Experience Goals** | Visceral (unconscious) | How do I want to FEEL? | Feel smart, in control, secure, cool |
| **End Goals** | Behavioral (conscious) | What do I want to DO? | Stay connected, clear my to-do list |
| **Life Goals** | Reflective (aspirational) | Who do I want to BE? | Be respected, live well, succeed |

### The Three Types of User Goals in Detail

**Experience Goals (Visceral Level):**
- Universal and personal
- Hard to articulate
- Express how user wants to feel
- Examples: "Feel smart," "Feel in control," "Have fun," "Feel reassured"
- Impact: Product's visual design, feel, microinteractions

**End Goals (Behavioral Level):**
- Motivation for using the product
- Focus of interaction design
- Must be met for product to be worth using
- Examples: "Be aware of problems before they become critical," "Clear my to-do list by 5:00 PM"
- Impact: Product behaviors, tasks, information architecture

**Life Goals (Reflective Level):**
- Personal aspirations beyond the product
- Deep drives and motivations
- Create fanatically loyal users
- Examples: "Live the good life," "Be attractive and respected," "Succeed in my ambitions"
- Impact: Strategy, branding, overall design concept

### Consequences of Poor Product Behavior

**Digital products are rude when they:**
- Blame users for mistakes that aren't their fault
- Interrogate users with patronizing questions ("Are you sure?")
- Forget information users told them
- Don't anticipate needs

**Digital products require people to think like computers when they:**
- Make users know technical details (SSID, IRQ)
- Force users to understand file systems
- Use incomprehensible jargon
- Hide meaning and intentions

**Digital products have sloppy habits when they:**
- Forget to "shut the refrigerator door"
- Ask the same question repeatedly
- Put dangerous commands next to safe ones
- Require users to step out of main work flow
- Have confusing appearance

**Digital products require humans to do heavy lifting when they:**
- Force manual copying between windows
- Make users manage file operations manually
- Require navigation to hidden functionality

### Why Good Design Matters

> **"Don't make the user feel stupid."**

This is the most important interaction design guideline.

### Planning and Designing Product Behavior

**The architect analogy:**
- Architects design buildings by understanding how people will use spaces
- Interaction designers design digital products by understanding how people will use them
- Both require significant upfront planning

**Capability, Viability, Desirability:**
| Company | Strength | Weakness |
|---------|----------|----------|
| Apple | Desirability | Business mistakes |
| Microsoft | Business viability | Desirability |
| Novell | Technology capability | Desirability |

---

## CHAPTER 2: DESIGN RESEARCH

### Qualitative vs. Quantitative Research

| Aspect | Qualitative | Quantitative |
|--------|-------------|--------------|
| **Answers** | What, how, why | How much, how many |
| **Method** | Observation, interviews, ethnography | Surveys, analytics, statistics |
| **Sample size** | Small (6-12 per persona type) | Large (statistically significant) |
| **Output** | Behavior patterns, motivations, goals | Numbers, percentages, demographics |
| **When to use** | Discovery, definition | Validation, sizing |
| **Strength** | Rich detail, context, nuance | Measurable, comparable |
| **Weakness** | Not statistically generalizable | Lacks context, why questions |

### The Design Research Problem

**Traditional process is broken:**
1. Researchers do research
2. They write reports
3. Reports are "thrown over the transom" to designers
4. Designers must guess what matters

**Better approach:**
1. Designers do the research (or are deeply involved)
2. Designers develop empathy through direct exposure
3. Designers can translate observations into design decisions

### Goal-Directed Research Activities (In Order)

#### 1. Kickoff Meeting
- Understand stakeholder perspectives
- Ask: What is the product? Who uses it? What do they need? Who are competitors?
- Gather pointers to domain literature

#### 2. Literature Review
- Internal: Marketing plans, brand strategy, market research, technology specs, customer support data
- External: Industry reports, journal articles, competitor analysis, user forums, social media

#### 3. Product/Competitive Audit
- Examine existing product or prototype
- Examine competitors
- Do informal heuristic review against design principles

#### 4. Stakeholder Interviews
- Who: Executives, managers, product management, marketing, development, sales, customer support
- Format: One-on-one, about 1 hour each
- Questions to ask:
  - What is the preliminary product vision?
  - What is budget and schedule?
  - What are technical constraints and opportunities?
  - What are business drivers?
  - How do stakeholders perceive users?
  - What challenges does the team face?

#### 5. SME (Subject Matter Expert) Interviews
- Who: Domain authorities (doctors, accountants, engineers, etc.)
- What: Industry best practices, complex regulations, user role characteristics
- Caution: SMEs are expert users; their perspective is skewed toward expert controls

#### 6. Customer Interviews
- Who: Purchasers (may not be users)
- What: Goals in purchasing, frustrations, decision process, installation/management issues

#### 7. User Interviews
- Who: Actual users (current and potential)
- What: Context of use, domain knowledge, current tasks, goals, mental models, frustrations

#### 8. User Observation/Ethnographic Field Studies
- Watch users in their actual environment
- Combine observation with interviewing
- What to observe:
  - Information they need (papers, sticky notes on screen)
  - Inadequate systems (cheat sheets, manuals)
  - Frequency and priority of tasks (inbox, outbox)
  - Workflows (memos, charts, calendars)

### Ethnographic Interview Methods

**Core Principles of Contextual Inquiry (Beyer & Holtzblatt):**
1. **Context** - Interview in the user's environment
2. **Partnership** - Collaborative exploration with user
3. **Interpretation** - Read between the lines, verify assumptions
4. **Focus** - Keep interview directed at design issues

**Goal-Directed Improvements:**
- Shorten interviews (1 hour vs. full day)
- Use smaller design teams (2-3 designers)
- Identify goals FIRST, then tasks
- Apply to consumer domains, not just business

**Specific Methods:**

| Method | Description |
|--------|-------------|
| **Interview where interaction happens** | Observe in natural environment |
| **Avoid fixed set of questions** | Adapt to what you learn |
| **Assume role of apprentice, not expert** | Learn from the user |
| **Use open-ended questions** | "Why," "How," "What" - get detailed responses |
| **Use closed-ended questions** | "Did you," "Do you" - yes/no, redirects discussion |
| **Focus on goals first, tasks second** | Understand motivation BEFORE mechanics |
| **Avoid making user a designer** | Don't ask for solutions, ask about problems |
| **Avoid discussing technology** | Focus on user needs, not implementation |
| **Encourage storytelling** | Get specific examples of use |
| **Ask for show-and-tell** | Have users demonstrate with artifacts |
| **Avoid leading questions** | Don't bias responses |

**Goal-Oriented Questions:**
- What makes a good day? A bad day?
- What activities currently waste your time?
- What is most important to you?
- What helps you make decisions?

**System-Oriented Questions:**
- What are the most common things you do?
- What parts do you use most?
- What drives you crazy?
- How do you work around problems?
- What shortcuts do you employ?

**Workflow-Oriented Questions:**
- What did you do when you first came in today?
- How often do you do this?
- What constitutes a typical day?
- What would be an unusual event?

**Attitude-Oriented Questions:**
- What do you see yourself doing five years from now?
- What would you prefer not to do?
- What do you procrastinate on?
- What do you enjoy most?

### Persona Hypothesis

**Before research, create a hypothesis about:**
- What different sorts of people might use the product
- How their needs and behaviors might vary
- What ranges of behavior need exploration

**For Business Products:**
- Roles = common sets of tasks (e.g., travelers, receptionists, administrators)

**For Consumer Products:**
- Behavioral variables (frequency of shopping, desire to shop, motivation)
- Lifestyle choices or life stages

**For Both:**
- Domain expertise vs. technical expertise
- Environmental variables (company size, location, IT presence)

**Interview Planning:**
- 6 interviews per behavioral pattern (enterprise)
- 8-12 interviews per user type (consumer)
- 2 designers per interview
- Maximum 6 interviews per day

### Other Research Methods (Less Effective for Design Definition)

| Method | Use | Limitations |
|--------|-----|-------------|
| **Focus Groups** | Gauging reactions to form/brand | Bad for interaction, stifles diversity |
| **Usability Testing** | Validating a complete design | Too late for discovery, hard to test intermediates |
| **Card Sorting** | Understanding information organization | Assumes refined organizational skills |
| **Task Analysis** | Detailed current task understanding | Doesn't illuminate goals, trapped by current technology |

---

## CHAPTER 3: MODELING USERS - PERSONAS AND GOALS

### What Are Personas?

**Definition:** Personas are composite archetypes based on behavior patterns observed in research.

| Characteristic | Description |
|----------------|-------------|
| **Not real people** | But based on real people |
| **Not averages** | Represent distinctive behaviors within ranges |
| **Not stereotypes** | Based on data, not assumptions |
| **Not demographics** | Based on behavior, not age/income/location |
| **Have goals** | Motivations drive their behaviors |
| **Are specific** | Names, photos, narratives make them real |

### Why Model Users?

| Reason | Explanation |
|--------|-------------|
| **Simplify complexity** | 100 pages of interview notes are unusable |
| **Focus attention** | Elastic "user" bends to fit anyone's opinion |
| **Build empathy** | Real people are easier to care about |
| **Communicate** | Common language for team and stakeholders |
| **Prioritize** | Primary persona guides all decisions |

### Design Pitfalls Personas Prevent

| Pitfall | How Personas Solve It |
|---------|----------------------|
| **Elastic User** | "User" can't bend to fit anyone's opinion - personas are specific, fixed |
| **Self-Referential Design** | Designers can't project their own preferences onto personas |
| **Edge Cases** | Personas keep focus on core needs, not rare situations |
| **Feature Silos** | Personas connect features to real use cases |

### Persona Effectiveness

**Why personas work:**
- **Empathy** - Real people engage emotions
- **Method acting** - Designers "become" personas
- **Research-based** - Grounded in observed behavior
- **Fictional but true** - Composite of real patterns
- **Context-specific** - Tied to specific product domain

### Persona Construction Process (8 Steps)

#### Step 1: Group Interview Subjects by Role
- Enterprise: Map to job roles or descriptions
- Consumer: Family roles, attitudes, lifestyle choices

#### Step 2: Identify Behavioral Variables

| Variable Type | Questions to Ask |
|---------------|------------------|
| **Activities** | What does the user do? How often? |
| **Attitudes** | How does the user think about the domain? Technology? |
| **Aptitudes** | What education/training does the user have? |
| **Motivations** | Why is the user engaged in this domain? |
| **Skills** | What abilities does the user have? |

- Typically 15-30 variables per role
- Compare to persona hypothesis; add/modify as needed

#### Step 3: Map Interview Subjects to Behavioral Variables
- Map each subject across each variable
- Identify clusters across multiple variables
- Patterns must have logical connection, not spurious correlation

#### Step 4: Identify Significant Behavior Patterns
- Each cluster = potential persona
- 6-8 variable clusters needed for a valid pattern
- Usually 2-3 patterns per role

#### Step 5: Synthesize Characteristics and Define Goals

**For each pattern, synthesize:**
- Behaviors (activities + motivations)
- Use environment(s)
- Frustrations and pain points
- Demographics
- Skills and abilities
- Attitudes and emotions
- Interactions with people/products/services
- Alternative ways of doing the same thing

**Give persona a name:**
- Evocative but not distracting
- Not a caricature or stereotype
- Add age, location, income, job title (minimal demographic detail)

**Define Goals:**

| Goal Type | Per Persona | Examples |
|-----------|-------------|----------|
| **End Goals** | 3-5 | "Maintain accurate patient records" |
| **Life Goals** | 0-1 | "Be respected as a healthcare professional" |
| **Experience Goals** | 0-2 | "Feel confident in critical situations" |

#### Step 6: Check for Completeness and Redundancy
- Any gaps? Add personas or do more research
- Any duplicates? Eliminate or differentiate
- Each persona must vary from others in at least one significant behavior

#### Step 7: Designate Persona Types

| Type | Description | Priority |
|------|-------------|----------|
| **Primary** | Main design target. Must be satisfied. | ONE per interface |
| **Secondary** | Mostly satisfied by primary's design with additions | Up to 2-3 |
| **Supplemental** | Needs covered by primary/secondary | Any number |
| **Customer** | Purchaser (may not use product) | Varies |
| **Served** | Affected by product (patient, etc.) | Varies |
| **Negative/Anti-** | Who product is NOT for | Rhetorical tool |

**Selecting Primary Persona:**
- Test each persona against goals of others
- Which persona is most demanding?
- Avoid selecting based on largest market segment
- OXO Good Grips: Designed for arthritic users (small segment) but satisfied everyone

#### Step 8: Expand Description

**Persona Narrative (1-2 pages):**
- Quick introduction (job/lifestyle)
- Brief day in the life
- Pet peeves, concerns, interests related to product
- What persona is looking for in the product
- DO: Include behavior patterns, pain points
- DO NOT: Include excessive fiction, unobserved details, design solutions

**Persona Photo:**
- Captures demographics
- Hints at environment
- Captures general attitude
- Avoid: Unusual angles, exaggerated expressions, posed shots, models
- Use: People engaged in appropriate activity against realistic background

### Misconceptions About Personas

| Misconception | Reality |
|---------------|---------|
| "Designers make them up" | Based on real ethnographic data |
| "Real people are better" | Real people have idiosyncratic behaviors that mislead |
| "People don't do tasks" | Goals still exist (e.g., "Be caught up on what's happening") |
| "Need quantitative validation" | Qualitative data provides sufficient validation for design |

### Personas vs. Other Models

| Model | Basis | Use |
|-------|-------|-----|
| **Personas** | Behavior patterns + goals | Design definition |
| **Market Segments** | Demographics + purchasing | Sales/marketing |
| **User Roles** | Job descriptions | Task analysis |
| **User Profiles** | Demographics + brief bio | Communication |

### Related Models

| Model | Description |
|-------|-------------|
| **Workflow Models** | Information flow and decision processes |
| **Artifact Models** | Forms and documents used in tasks |
| **Physical Models** | Layout of physical workspace |

---

## CHAPTER 4: REQUIREMENTS DEFINITION - SETTING THE VISION

### The Research-Design Gap

**Problem:** Research yields insights, but how do you get from insights to design?

**Solution:** Use scenarios (narratives) with personas to bridge the gap.

### Scenarios as a Design Tool

**Why narrative works:**
- Stories are how humans think about possibilities
- Stories are compelling and shareable
- Stories structure experience over time
- Stories encourage "what-if" thinking

**Scenarios vs. Use Cases vs. User Stories:**

| Method | Focus | Level | When to Use |
|--------|-------|-------|-------------|
| **Scenarios** | User goals, ideal experience | High-level story | Definition |
| **Use Cases** | System functionality, transactions | Detailed, exhaustive | Validation |
| **User Stories** | Informal requirements | Task-level | Agile development |

### Three Types of Persona-Based Scenarios

| Type | When Created | Focus |
|------|--------------|-------|
| **Context Scenario** | Before design (requirements) | High-level ideal experience, pretend interface is magic |
| **Key Path Scenario** | During design (framework) | Most frequent interactions, specific interface vocabulary |
| **Validation Scenario** | During design (testing) | What-if questions, edge cases |

### Requirements Definition Process (5 Steps)

#### Step 1: Create Problem and Vision Statements

**Problem Statement:**
- Concise reflection of situation that needs changing
- Connect business concerns to user concerns

**Template:** "Company X's customer satisfaction ratings are low. Market share has diminished by 10% because users have inadequate tools to perform tasks X, Y, and Z that would help them meet their goal of G."

**Vision Statement:**
- Inversion of problem statement
- Lead with user needs, transition to business goals

**Template:** "The new design of Product X will help users achieve G by allowing them to do X, Y, and Z with greater [accuracy/efficiency], without problems A, B, and C. This will dramatically improve Company X's customer satisfaction ratings and lead to increased market share."

#### Step 2: Explore and Brainstorm
- Purpose: Get preconceptions out of your head
- Air all wacky ideas
- Cherry-pick concepts to test stakeholder appetite
- Don't spend too much time (hours to a couple days)

#### Step 3: Identify Persona Expectations

**For each primary and secondary persona, identify:**
- Attitudes, experiences, aspirations
- General expectations about the product
- Behaviors they expect or want
- How they think about basic elements of data

**What to look for in research:**
- What do interview subjects mention first?
- What action words (verbs) do they use?
- What nouns?
- What intermediate steps/objects do they NOT mention?

#### Step 4: Construct Context Scenarios

**What context scenarios answer:**
- Where will product be used?
- How long? Is user frequently interrupted?
- Do multiple users share a device?
- What other products will it be used with?
- What primary activities must persona perform?
- What is expected end result?
- How much complexity is permissible?

**Sample Context Scenario (Vivien the Real Estate Agent):**

1. Getting ready in morning, Vivien checks email on phone (faster than booting computer)
2. Sees email from client Frank who wants to view a house today. Phone has contact info, she calls him with one action from the email.
3. On speakerphone, she checks appointments, creates new appointment. Phone automatically associates it with Frank.
4. After sending daughter to school, she goes to office. Phone has updated Outlook appointments, office knows where she'll be.
5. Running late, phone alerts her. She sees appointment plus all documents related to Frank (emails, memos, call logs). Phone automatically connects to Frank. She lets him know she'll be 20 minutes late.
6. She knows address but not how to get there. She taps address in appointment. Phone downloads directions with thumbnail map showing her location.
7. At property, phone rings. Normally goes to voicemail, but daughter has a code to get through. Phone uses distinctive ringtone for daughter.
8. Daughter missed bus. She calls husband, gets voicemail. She texts him. Five minutes later, husband IMs: "I'll get Alice; good luck on the deal!"

**Key Technique: PRETEND THE INTERFACE IS MAGIC**
- Imagine ideal experience without technical constraints
- Then figure out how to achieve that technically
- Products that minimize hassle seem magical to users

#### Step 5: Identify Design Requirements

**Requirements = Objects + Actions + Context**

**Types of Requirements:**

| Type | What It Is | Examples |
|------|------------|----------|
| **Data Requirements** | Objects and information | Accounts, people, addresses, documents, status, dates |
| **Functional Requirements** | Operations on objects | Create, edit, delete, search, display |
| **Contextual Requirements** | Relationships, environment, capabilities | What displays together, physical environment |
| **Business Requirements** | Stakeholder priorities, budget, timeline | Regulations, pricing, business model |
| **Technical Requirements** | Platform, hardware, software | Weight, size, display, power, platform |
| **Customer/Partner Requirements** | Installation, maintenance, configuration | Support costs, licensing |

---

## CHAPTER 5: DESIGNING THE PRODUCT - FRAMEWORK AND REFINEMENT

### Framework Definition Process (6 Steps)

#### Step 1: Define Form Factor, Posture, and Input Methods

**Form Factor:**
- Desktop? Web? Phone? Tablet? Kiosk? Embedded?
- Each has constraints: screen size, resolution, input method

**Posture:**
- How much attention does user devote?
- How does product respond to that attention?
- (See Chapter 9 for detailed postures)

**Input Methods:**
- Keyboard, mouse, touchscreen, voice, hardware buttons, gestures
- What's primary? What's secondary?

#### Step 2: Define Functional and Data Elements

**Functional Elements:** Operations user can perform
**Data Elements:** Objects and information user works with

**How to define:**
1. Return to requirements from scenarios
2. Translate each requirement into concrete elements
3. For each function, ask: Which solution best...
   - Accomplishes user goals most efficiently?
   - Fits design principles?
   - Differentiates from competition?
   - Fits technical constraints?

**Pretend the product is human:**
- What would a helpful human do?
- How can software offer helpful information without getting in the way?
- How can it minimize persona's effort?

#### Step 3: Determine Functional Groups and Hierarchy

**Questions to answer:**
- Which elements need large screen real estate? Which small?
- Which elements are containers for others?
- How should containers be arranged for optimal flow?
- Which elements are used together?
- In what sequence are they used?
- What data is useful for decisions?

**Create indented lists or Venn diagrams of groupings.**

**Consider primary screens/views:**
- What views does the product need?
- What data/functionality belongs in each view?

#### Step 4: Sketch the Interaction Framework

**Start with rectangles:**
1. Subdivide each view into rough rectangular areas
2. Label each area
3. Draw arrows to show relationships and flows

**Keep it simple:**
- Boxes representing functional groups
- Names and descriptions of relationships
- No detail yet (pixels can come later)

**Use fast tools:**
- Whiteboard (easy to erase, collaborative)
- Tablet with OneNote
- Digital camera to capture ideas

**As sketches become detailed:**
- Move to digital tools (Fireworks, Illustrator, OmniGraffle)
- Render in sketchy style to encourage discussion
- Show sequential screen states

#### Step 5: Construct Key Path Scenarios

**What key path scenarios do:**
- Describe persona's interaction using the interface's vocabulary
- Show primary pathways through the interface
- Focus on most frequent, daily interactions

**Storyboarding:**
- Sequence of low-fidelity sketches
- Accompanied by scenario narrative
- Each interaction = one or more frames
- Reality check for coherence and flow

**Process Variations:**

| Approach | Sequence |
|----------|----------|
| **Verbal thinkers** | 1. Key path scenarios → 2. Groupings → 3. Sketch |
| **Visual thinkers** | 1. Sketch → 2. Key path scenarios → 3. Groupings |

#### Step 6: Check Designs with Validation Scenarios

**Alternative Scenarios:**
- Less-traveled interactions that split from key paths
- Less frequently used tools and views
- Secondary persona needs

**Necessary-Use Scenarios:**
- Must be performed but infrequently (purge, config, upgrade)
- Need pedagogy (rare use = users forget how)
- Can be buried deeper in interface

**Edge-Case Scenarios:**
- Atypical situations product must handle
- NEVER the focus of design
- Buried deep in interface

### Visual Design Framework Process (3 Steps)

#### Step 1: Develop Experience Attributes

**Process:**
1. Gather brand guidelines
2. Gather examples of strongly branded products
3. Identify direct and indirect competition
4. Pull relevant terms from qualitative research (especially pain points)
5. Discuss with stakeholders using examples and votes
6. Identify 3-5 adjectives that define the product
7. Document exact meaning of each word
8. Ensure attributes distinguish from competitors
9. Finalize with stakeholders

**Examples:** "Smart," "Confident," "Approachable," "Brilliant," "Secure"

#### Step 2: Develop Visual Language Studies

**What:**
- Explore color, type, widget treatments
- Dimensionality and "material" properties
- Abstract, independent of interaction design

**How many:** 3-5 different approaches
**Strategy:** Include 1-2 "extreme" options
**Based on:** Persona experience goals, brand guidelines, experience keywords

#### Step 3: Apply Style to Screen Archetype
- Apply selected visual style to key screens
- Refine visual style against key behaviors and information
- Make design more concrete for feasibility assessment

### Industrial Design Framework Process (3 Steps)

#### Step 1: Collaborate on Form Factor and Input
- General size and shape
- Screen size
- Number and orientation of hard/soft buttons
- Touch/multitouch, keyboard, voice, motion tracking
- Sanity check with engineers (cost, battery, etc.)

**Principle:** There is only one user experience. Form and behavior must be designed in concert.

#### Step 2: Develop Rough Prototypes
- Foam board, simple materials
- Test ergonomics
- Show stakeholders for cost/ergonomic feedback

#### Step 3: Develop Form Language Studies
- Shape, dimensionality, materials, color, finish
- Based on persona goals, attitudes, experience keywords

### Service Design Framework Process (3 Steps)

#### Step 1: Describe Customer Journeys
- Narrative of persona using service
- From first exposure to final transaction
- Different journeys for different personas

#### Step 2: Create Service Blueprint
- Touch points for persona
- "Backstage" processes (customer service interface)
- Swimlane diagrams with user at top, organization at bottom
- "Line of visibility" between onstage and backstage

#### Step 3: Create Experience Prototypes
- Mock-ups of key touch points
- Video scenes illustrating experience
- Varying fidelity from interviews to full pilots

### Refinement Phase

**What happens:**
- Sketches → Full-resolution pixel-level screens
- Visual style guide developed
- Industrial designers finalize materials with engineers

**Form and Behavior Specification:**
- Screen renderings with callouts
- Storyboards to illustrate behaviors
- Interactive prototypes (optional)
- Underlying patterns and rationale

### Validation and Testing

**Formative vs. Summative Evaluation:**

| Type | When | Purpose |
|------|------|---------|
| **Formative** | During design | Iterative improvement |
| **Summative** | After completion | Final assessment |

**What Usability Testing Validates:**
- Naming (button labels make sense)
- Organization (information is grouped meaningfully)
- First-time use and discoverability
- Effectiveness (can users complete tasks?)

**When to Test:**
- Late enough that design is concrete
- Early enough to make changes
- Usually during Refinement phase

**Designer Involvement:**
- Planning the study
- Defining recruiting criteria (using personas)
- Developing user tasks (using scenarios)
- Observing test sessions
- Analyzing findings

**Challenge:** Usability testing measures first-time use. Most users are intermediates. Hard to test for intermediate use.

---

## CHAPTER 6: CREATIVE TEAMWORK

### Core Teams vs. Extended Teams

| Team Type | Size | Composition |
|-----------|------|-------------|
| **Core Team** | 2-4 people | Focused, complementary skills |
| **Extended Team** | Larger | Multiple core teams (design, marketing, engineering) |

### Thought Partnership

**The Problem:**
- Designers can be too polite or too stubborn
- Solo work can be lonely and limited
- Teams can produce mere compromises

**The Solution: Generation and Synthesis**

| Role | Characteristics | Pitfall |
|------|-----------------|---------|
| **Generator** | Concrete thinker, grabs marker, ideates, draws | Zooms in too quickly, incomplete solutions |
| **Synthesizer** | Questions, organizes, reframes problems, prompts | Struggles to move beyond list-making |

**Sample Dialogue:**
> Generator: "I have an idea. When you're in the main list, you pull down and see the control for adding a new thing."
> 
> Synthesizer: "Great. It might feel hidden though. In Jeff's scenario, he only adds a new thing every few weeks."
>
> Generator: "True. He might forget it's there."
>
> Synthesizer: "I like keeping focus on information, though."
>
> Generator: "How about we show the field with help text when the screen loads, then snap up to cover it? You see it, then focus on the list."
>
> Synthesizer: "I like it. Might get annoying if it happens too often, but we can add rules."

**Establishing Thought Partnership:**
1. Clarify the problem
2. Appeal to partner's strengths
3. Switch roles explicitly when needed
4. 15-minute rule: If stuck >15 minutes, bring in outsider

### Team Composition

| Role | Responsible For | Has Authority Over |
|------|-----------------|-------------------|
| **Design** | Users' goals | How product looks, feels, behaves |
| **Usability** | Validating design works | Testing, identifying problems |
| **Engineering** | Construction | Development platforms, feasibility |
| **Marketing** | Market opportunity | Customer segments, positioning |
| **Business Leads** | Profitability | Prioritization |

### Design Disciplines

| Discipline | Focus | Collaboration |
|------------|-------|---------------|
| **Interaction Design** | Product behavior | Works with industrial on inputs, visual on brand |
| **Visual Interface Design** | Visual structure, affordances, brand | Works with interaction on priority and flow |
| **Visual Information Design** | Data visualization | For data-intensive applications |
| **Industrial Design** | Physical form, ergonomics | Early collaboration on inputs |

### Design Skill Levels

| Level | Description |
|-------|-------------|
| **Apprentice** | Early career, needs mentorship |
| **Craftsman** | Independent, drives creative vision |
| **Leader** | Organizational leadership, advocacy, mentorship |

---

# PART II: MAKING WELL-BEHAVED PRODUCTS

---

## CHAPTER 7: A BASIS FOR GOOD PRODUCT BEHAVIOR

### Design Values

| Value | Meaning |
|-------|---------|
| **Ethical** | Considerate, helpful, do no harm, improve situations |
| **Purposeful** | Useful, usable, helps users achieve goals |
| **Pragmatic** | Viable, feasible, meets business and technical requirements |
| **Elegant** | Efficient, artful, simplest complete solution |

### Ethical Interaction Design

**Types of Harm to Minimize:**
- Interpersonal (insult, humiliation)
- Psychological (confusion, frustration)
- Physical (pain, injury)
- Economic (loss of productivity, wealth)
- Social/Societal (exploitation, injustice)
- Environmental (pollution, biodiversity loss)

**Sustainability Phases (Kem-Laurin Kramer):**
1. Manufacturing (materials, refinement)
2. Transportation (shipping)
3. Usage and energy consumption
4. Recyclability (repair, upgrade, parts)
5. Facilities (manufacturing, R&D, sales, servers)

### Purposeful Interaction Design
- Based on understanding user goals
- Supports users where weak, empowers where strong

### Pragmatic Interaction Design
- Design must get built to be valuable
- Active dialog between business, engineering, design

### Elegant Interaction Design

**Simplicity:**
> "Perfection is attained not when there is no longer anything to add, but when there is no longer anything to take away." - Saint-Exupéry

**Internal Coherence:**
- Feels like a unified whole
- Not cobbled together from disparate pieces

**Appropriate Cognition and Emotion:**
- Not just "desire" - context matters
- Medical systems should inspire caution and reverence
- Consumer products may inspire desire

### Interaction Design Principles

**Levels of Detail:**

| Level | Focus |
|-------|-------|
| **Conceptual** | What digital products should be like, how they fit context |
| **Behavioral** | How product should behave in general and specific contexts |
| **Interface** | Organization, navigation, communication |

### Interaction Design Patterns

**What patterns do:**
- Reduce design time and effort
- Improve quality of solutions
- Facilitate communication
- Educate designers

**Types of Patterns:**

| Type | Level | Example |
|------|-------|---------|
| **Postural** | Conceptual | "Transient" posture |
| **Structural** | Information/functional arrangement | Organizer-Workspace, Double Drawer |
| **Behavioral** | Specific interactions | Widget behaviors |

**Sample Pattern - Desktop: Organizer-Workspace**
- Left pane: Navigation
- Right pane: Overview at top, Detail at bottom
- Used in Outlook, email clients, many authoring tools

**Sample Pattern - Mobile: Double Drawer**
- Swipe right to expose left drawer (primary navigation)
- Swipe left to expose right drawer (ancillary objects)
- Used in Facebook, Path, many mobile apps

---

## CHAPTER 8: DIGITAL ETIQUETTE

### The Core Insight

> Humans treat computers as if they were people. (Nass & Reeves, The Media Equation)

**If we want users to like products, design them like likeable people.**

### The Ideal Division of Labor

> **The computer does the work, and the person does the thinking.**

- Humans are unmatched at pattern recognition and creative problem solving
- Humans need help with information management (access, analyze, organize, visualize)
- Decisions should be made by humans

### Designing Considerate Products

**Characteristics of Considerate Products:**

| Characteristic | Meaning | Example |
|----------------|---------|---------|
| **Take an interest** | Remember user preferences | Forms autocomplete |
| **Are deferential** | User is boss, software serves | No "Submit" buttons |
| **Are forthcoming** | Volunteer useful info | Suggest related items |
| **Use common sense** | Don't put opposites next to each other | Safe controls away from dangerous |
| **Use discretion** | Protect private data | Secure passwords, privacy settings |
| **Anticipate needs** | Predict what user wants | Preload links during idle time |
| **Are conscientious** | Think about related tasks | Rename conflicting files intelligently |
| **Don't burden with problems** | Don't whine about own issues | Fix problems silently |
| **Keep you informed** | Modeless feedback | Status indicators, not popups |
| **Are perceptive** | Watch and learn | Remember preferences |
| **Are self-confident** | Don't second-guess | No "Are you sure?" |
| **Don't ask questions** | Offer choices instead | Modeless tools vs. modal dialogs |
| **Fail gracefully** | Don't lose data on crash | Write to disk immediately |
| **Know when to bend rules** | Support fudgeability | Accept incomplete data |
| **Take responsibility** | Own the full task | Cancel printing properly |
| **Help avoid mistakes** | Gently alert | Visual feedback, not modals |

### Designing Smart Products

**Use Idle Cycles:**
- Computers waste billions of instructions waiting
- Use downtime to index, preload, prepare
- If wrong, discard results

**Have Memory:**
> If it's worth it to the user to do it, it's worth it to the application to remember it.

**What to Remember:**
- File locations (where user gets files)
- Window positions
- Preferences
- Recent choices
- Actions (for Undo across sessions)

**Decision-Set Reduction:**
- People choose from small sets, not infinite possibilities
- Remember the small set, not just the last choice
- Example: 250-item menu → user picks from 5-6 favorites

**Preference Thresholds:**
- Most decisions are unimportant
- Don't ask about unimportant decisions
- Make assumptions, let user override

**Mostly Right, Most of the Time:**
- If right 80% of time, don't ask for permission
- Support Undo for the 20%
- Better than interrupting for 100%

### Designing Social Products

**Social vs. Market Norms:**
- **Social norms**: Reciprocity, friendship. Don't pay for dinner at friend's house.
- **Market norms**: Fair price, honest dealing. Don't leave without paying at restaurant.

**User Identity:**
- Let users upload images (more memorable than arbitrary icons)
- Use ToolTips for full names
- Dynamic profiles (actions speak louder than self-description)

**Collaboration:**
- Comments with threaded replies
- "Resolve" button for issues
- Visible version history

**Social Circles (Dunbar's Number ≈ 150):**
- Maximum number of social relationships one person can maintain
- Networks larger than 150 need explicit rules and mechanisms

**Privacy:**
- Additional sharing = carefully explained, opt-in affair
- Business contexts: IP rights violations possible

**Anti-Social Users:**
- Provide tools to silence griefers
- Report to community caretakers
- Distinguish anti-social from earnest but unpopular

---

## CHAPTER 9: PLATFORM AND POSTURE

### Platform Definition

**Platform** = Hardware + software that enables product function.

**Common Platforms:**
- Desktop software
- Websites/web applications
- Mobile devices (phones, tablets)
- Kiosks
- In-vehicle systems
- Home entertainment (TV, game consoles)
- Professional devices (medical, scientific)

### Posture Definition

**Posture** = Product's behavioral stance - how it presents itself to users.

**Decision factors:**
- How much attention user devotes
- How product responds to that attention
- Usage contexts and environments

### Desktop Postures

#### Sovereign Posture

**Characteristics:**
- Dominates user attention for long periods
- Full-screen use (optimized for)
- Conservative visual style (colors muted)
- Rich input (mouse, keyboard, shortcuts)
- Rich visual feedback
- Document views maximized

**Design Targets:**
- Intermediate users (not beginners or experts)
- Generous with screen real estate
- Controls can be smaller (users learn location)

**Examples:** Word, Excel, Photoshop, Outlook

#### Transient Posture

**Characteristics:**
- Brief, supporting role
- Simple, clear, obvious
- Single window and view
- Launches to previous position
- Large controls (not used enough to memorize)
- Instructions built into surface

**Design Targets:**
- Infrequent users
- Clear, unambiguous

**Examples:** Calculator, printer dialog, file open dialog

#### Daemonic Posture

**Characteristics:**
- Background, invisible
- No active user interaction
- Minimal UI
- Accessible via control panels

**Design Targets:**
- Installation, configuration
- Status reporting

**Examples:** Printer driver, network connection, Dropbox sync

### Web Postures

#### Informational Websites

**Characteristics:**
- Navigation + search
- Content consumption

**Balance:**
- Sovereign attributes: Detailed information display, full-screen use
- Transient attributes: Clear navigation, bookmarkability, infrequent users

**Examples:** Wikipedia, corporate marketing sites

#### Transactional Websites

**Characteristics:**
- Shopping carts, checkout, user profiles
- Complex transactions

**Balance:**
- Navigational clarity
- Efficient transactions
- Brand visual design

**Examples:** Amazon, financial services

#### Web Applications

**Characteristics:**
- Complex behavior like desktop
- May replace sovereign desktop apps
- Collaboration and cloud data

**Sovereign web apps:** Full-screen, dense controls, environments not pages
**Transient web apps:** Clear orientation, occasional use

### Mobile Postures

#### Satellite Posture

**Characteristics:**
- Content viewing, minimal input
- Syncs with desktop/cloud
- Transient
- Controls: Navigation, viewing

**Examples:** E-readers (Kindle), cameras, wearables

#### Standalone Posture

**Characteristics:**
- Full-featured apps on handhelds
- Full-screen
- Brief interactions (transient)
- Large controls for finger input

**Design Targets:**
- Self-explanatory (on-the-go usage)
- Quick in/out

**Examples:** iPhone apps, Android apps

#### Tablet Posture

**Characteristics:**
- Full-screen apps (no windows)
- Sovereign apps
- Finger controls
- Simplified compared to desktop
- Widgets/tiles for transient content

### Other Platform Postures

#### Kiosk Posture

**Characteristics:**
- First-time and infrequent users
- Public environment (bright, distractions)
- Standing position
- Touchscreen or hardware buttons

**Design Targets:**
- Large, colorful, clear controls
- Simple navigation
- Single full screen (no dialogs)
- Optimized for first-time use

#### 10-Foot Interface (TV)

**Characteristics:**
- Remote control (D-pad navigation)
- Sitting across room
- Current focus required

**Design Targets:**
- Large buttons and text
- Left-right/up-down navigation
- Grids of content

#### Automotive Interface

**Characteristics:**
- Driver safety primary
- Quick glances only
- Minimal distraction

**Design Targets:**
- Clear at a glance
- Shallow visual hierarchy
- Direct control mappings
- Audible feedback
- Consistent layout

#### Smart Appliance Posture

**Characteristics:**
- Transient
- Non-technical users
- Hardware controls

**Design Targets:**
- Simple and straightforward
- Status daemons
- Don't add unwanted features

---

## CHAPTER 10: OPTIMIZING FOR INTERMEDIATES

### The Perpetual Intermediate

**Key Insight:** Most users are neither beginners nor experts.

**The Bell Curve:**
- Beginners: Small group, quickly become intermediates or abandon
- Intermediates: Largest group, stay there forever
- Experts: Small group, come and go rapidly

> **Principle: Optimize for intermediates.**

### What Intermediates Need

- Fast access to common tools
- ToolTips (brief function reminder)
- Reference materials (online help, index)
- Advanced features exist (reassuring, even if not used)
- Working set front and center

### What Beginners Need

- Rapid onboarding (they don't stay beginners long)
- Understand scope and purpose
- Mental model support
- Guided tours, not reference help

**For transient or distracted products (kiosks, ATMs, medical devices), optimize for beginners.**

### What Experts Need

- Shortcuts to everything
- High information density
- New, powerful features (without complexity fear)
- Keyboard accelerators

### Inflection

**Definition:** Organize interface to minimize typical navigation.

**Strategy:** Place most frequently desired functions in most immediate locations. Push less frequent functions deeper.

#### Commensurate Effort

> Users make commensurate effort if the rewards justify it.

- Users will work harder for more valuable results
- Complex interface is acceptable for complex results
- Complex interface for simple results is unacceptable

#### Progressive Disclosure

- Advanced controls hidden behind expand/collapse toggle
- Toggle is "sticky" (stays how user left it)
- Intermediates can peek at advanced features
- Experts can leave expanded

### Organizing for Inflection

**Three Attributes:**

| Attribute | How to Apply |
|-----------|--------------|
| **Frequency of use** | Most frequent = most accessible |
| **Degree of dislocation** | Big changes = deeper in interface |
| **Degree of risk** | Dangerous functions = harder to access |

### Designing for Three Levels

| User Level | Strategy | Example |
|------------|----------|---------|
| **Beginners** | Rapid onboarding, mental model support, guided tours | Welcome dialogs, first-use guides |
| **Intermediates** | ToolTips, fast access to working set, reference help | ToolTips, help index |
| **Experts** | Shortcuts, keyboard commands, customization | Keyboard shortcuts, advanced settings |

---

## CHAPTER 11: ORCHESTRATION AND FLOW

### Flow

**Definition:** Deep, nearly meditative involvement where users lose track of time.

**Characteristics:**
- Extremely productive
- "Gentle sense of euphoria"
- Unaware of passage of time

**Goal:** Design products to promote and enhance flow.

### Transparency

> No matter how cool your interface is, less of it would be better.

**When product interacts well:**
- Interaction mechanics disappear
- User is face-to-face with objectives
- Unaware of intervening software

**When interaction is poor:**
- Designers loom with clumsy presence
- User conscious of mechanics

### Orchestration

**Definition:** Harmonious organization of all elements toward a single goal.

**Goal:** Make interaction invisible, like good writing.

### Harmonious Interactions

**Principles:**

| Principle | Application |
|-----------|-------------|
| **Follow mental models** | Match how users think, not how software works |
| **Less is more** | Reduce interface elements, not capabilities |
| **Let users direct** | Don't interrogate with dialogs |
| **Provide choices** | Don't ask questions (toolbars vs. dialogs) |
| **Keep tools close** | Palettes, toolbars, not menus |
| **Provide modeless feedback** | Information in interface, not dialogs |
| **Design for probable, anticipate possible** | Do what's probably right, support Undo for exceptions |
| **Contextualize information** | Show "compared to what?" |
| **Reflect status** | Objects and apps show state |
| **Avoid unnecessary reporting** | Don't report normalcy |
| **Avoid blank slates** | Start with good defaults |
| **Differentiate command and config** | Quick Print vs. Print Setup |
| **Hide ejector seat levers** | Dangerous functions hard to trigger |

### Motion, Timing, and Transitions

**Response Time Guidelines:**

| Response Time | User Perception | Action |
|---------------|-----------------|--------|
| <0.1 seconds | Instantaneous, direct manipulation | No feedback needed |
| <1 second | Responsive, thought process intact | No feedback needed |
| <10 seconds | Noticeably slow, mind wanders | Progress bar needed |
| >10 seconds | User attention lost | Background process, can continue other work |

**Motion Design Goals (Dan Saffer, Microinteractions):**

1. Focus user attention in appropriate place
2. Show relationships between objects and actions
3. Maintain context during transitions
4. Provide perception of progression (progress bars, spinners)
5. Create virtual space for navigation
6. Encourage immersion and engagement

**Motion Design Qualities:**
1. **Short, sweet, responsive** - <1 second, don't slow interaction
2. **Simple, meaningful, appropriate** - Match function
3. **Natural and smooth** - Mimic physical attributes (inertia, elasticity)

---

## CHAPTER 12: REDUCING WORK AND ELIMINATING EXCISE

### Four Types of User Work

| Type | Definition | Examples |
|------|------------|----------|
| **Cognitive** | Comprehending behaviors, text, organization | Reading labels, understanding hierarchy |
| **Memory** | Recalling commands, passwords, locations | Remembering file locations, shortcuts |
| **Visual** | Finding objects, decoding layouts | Scanning for a control, decoding colors |
| **Physical** | Keystrokes, mouse movements, gestures | Clicking, dragging, typing |

### Goal-Directed Tasks vs. Excise Tasks

| Task Type | Definition | Example |
|-----------|------------|---------|
| **Goal-Directed** | Contributes directly to achieving goal | Steering toward destination |
| **Excise** | Extra work for tools or outside agents | Opening garage door, red lights |

> **Principle: Eliminate excise wherever possible.**

### Types of Excise

#### Navigational Excise

**Definition:** Work to get around in the software.

**Levels of Navigation:**
1. Across windows, views, pages
2. Across panes within a view
3. Across tools, commands, menus
4. Within information (scrolling, zooming, linking)

**Navigation Trauma:** Getting lost in the interface.

**Signs of Poor Navigation:**
- User constantly shuttles between windows
- User loses context
- User can't find what they need

#### Skeuomorphic Excise

**Definition:** Mechanical representations translated into digital (often unnecessarily).

**Examples:**
- Address book as little bound book
- Desktop with telephone, file cabinet
- Calendar with monthly pages

**Problem:**
- Consumes screen real estate
- Limits efficiency
- Loses subtle visual cues

#### Modal Excise

**Definition:** Stopping the proceedings with idiocy.

**Examples:**
- Error messages
- Confirmation dialogs
- Permission dialogs

> **Principle: Don't stop the proceedings with idiocy.**

#### Stylistic Excise

**Definition:** Visual work to decode information.

**Causes:**
- Overly stylized graphics
- Unclear hierarchy
- Visual clutter

### Excise Elimination Strategies

| Strategy | Implementation |
|----------|----------------|
| **Reduce places to go** | Fewer windows, modes, pages, screens |
| **Provide signposts** | Persistent objects for orientation |
| **Provide overviews** | Thumbnails, breadcrumbs |
| **Proper mapping** | Controls suggest their function |
| **Avoid hierarchies** | Use monocline grouping (one level deep) |
| **Don't replicate mechanical models** | Design for information age |

### Common Excise Traps

**Don't force users to:**
- Go to another window to affect current window
- Remember where they put things in the file system
- Resize windows unnecessarily
- Move windows
- Reenter personal settings
- Fill fields to satisfy arbitrary completeness
- Ask permission
- Confirm actions (need robust Undo)

---

## CHAPTER 13: METAPHORS, IDIOMS, AND AFFORDANCES

### Three Interface Paradigms

| Paradigm | Description | Strength | Weakness |
|----------|-------------|----------|----------|
| **Implementation-centric** | Based on how software works | Easy to build | Users must understand internals |
| **Metaphoric** | Based on real-world analogies | Easy for beginners | Doesn't scale, global metaphors fail |
| **Idiomatic** | Based on learned behaviors | Powerful, scales well | Must learn (but only once) |

### Metaphoric Interfaces

**Definition:** Uses real-world connections users make between visual cues and function.

**Problems with Metaphors:**
- Don't scale well (file icons for 1000s of files)
- Difficult for processes and relationships
- Culture-dependent
- Cost after user becomes intermediate
- "Never bend your interface to fit a metaphor"

**Global Metaphors:**
- Single overarching metaphor for entire system
- Problem: Stretches too far, adds overhead after initial learning

**Exceptions:**
- Video games (diegetic interfaces)
- Simulation software
- Music creation software (touch instruments)

### Idiomatic Interfaces

**Definition:** Based on learning simple, non-metaphorical visual and behavioral idioms.

**Characteristics:**
- No associative connections (unlike metaphors)
- Must be learned (not intuited)
- Easy to learn and remember
- Need to learn only once

**Examples:**
- Windows, title bars, scrollbars, dropdowns
- Mouse input
- Double-clicking, dragging, swiping

### Manual Affordances

**Definition:** Visual cues that suggest how to manipulate an object.

**Examples:**
- 3D-looking button = "push me"
- Handles, grips
- Raised/indented areas

**Virtual Manual Affordances:**
- Shading, highlighting, shadows
- Flattening trend reduces affordance (learnability problem)

**Controls must have text or icons to explain function.**

### Direct Manipulation

**Three Components (Shneiderman):**
1. Visual representation of data objects
2. Visible/gestural mechanisms for acting on objects
3. Immediately visible results of actions

> **Principle: Rich visual feedback is the key to successful direct manipulation.**

**When to Use:**
- Pointing to what you want
- Moving objects
- Setting tabs and indentations (visual)
- Reordering lists
- Image editing (Snapseed)

**When Not to Use:**
- Complex numeric data entry
- Tasks requiring precision (CAD)
- When user may not be skilled enough

### Pliancy and Hinting

**Pliancy:** Objects or screen areas that react to input.

**Three Ways to Communicate Pliancy:**

| Method | Description | Example |
|--------|-------------|---------|
| **Static hinting** | Object itself shows it's interactive | 3D button rendering |
| **Dynamic hinting** | Object changes on mouseover | Rollover effect on toolbar icon |
| **Cursor hinting** | Cursor changes over object | I-beam over text, arrows on window edges |
| **Pliant response hinting** | Object shows it's been clicked | Button depresses, then action on release |

---

## CHAPTER 14: RETHINKING DATA ENTRY, STORAGE, AND RETRIEVAL

### Data Entry

#### Data Integrity vs. Data Immunity

| Approach | Description | Problem |
|----------|-------------|---------|
| **Data Integrity** | Reject bad data at entry | Punishes users, breaks flow, assumes users are wrong |
| **Data Immunity** | Accept all data, handle gracefully | More work for developers, better user experience |

> **Principle: Audit, don't edit.**

**How to Implement Data Immunity:**
- Accept what user enters
- Provide modeless feedback about issues
- Record actions for accountability
- Support fudgeability (out-of-sequence actions)

**Handling Missing Data:**
- Don't stop proceedings
- Provide modeless feedback
- Allow later completion
- Annotate with notes

#### Fudgeability

**Definition:** Ability to perform actions out of sequence or before prerequisites are satisfied.

**Manual Systems:** Fudgeability exists naturally (clerk can expedite orders, accept incomplete info)

**Digital Systems:** Often have only two states - nonexistence and full compliance

**Solution:** Support intermediate states ("suspense")

### Data Storage

#### Problems with Current Storage Model

| Problem | Example |
|---------|---------|
| **Save Changes dialog** | Always answered the same way - unnecessary |
| **Close without saving** | Used as crude Undo (should use real Undo) |
| **Save As** | Confusing for archiving, can't rename open files |
| **Two copies** | RAM + disk model confuses users |

#### Unified File Model

**Principle:** Document is a single thing, not two copies (RAM and disk).

**Design Principles:**
- Save documents and settings automatically
- Put files where users can find them

**Commands in Unified Model:**

| Command | Purpose |
|---------|---------|
| **Automatic save** | Every change, or during idle |
| **Create a Copy** | Explicit copy (not Save As) |
| **Rename/Move** | Inline renaming in title bar |
| **Discard Changes** | Revert to last saved |
| **Revert to Version** | Return to previous version |
| **Properties** | Document type, metadata |

**File Menu:**
- New, Open, Close (no Save Changes)
- Rename/Move
- Create a Copy
- Discard Changes
- Revert to Version
- Properties

### Data Retrieval

#### Storage vs. Retrieval

| System | Definition | Physical World | Digital World |
|--------|------------|----------------|---------------|
| **Storage** | Safely keeping things | Shelves, cabinets | File system |
| **Retrieval** | Finding things by attributes | Card catalog, index | Search, tags, Spotlight |

**In digital world, storage and retrieval should be separate.**

#### Retrieval Methods

| Method | Description | Strength | Weakness |
|--------|-------------|----------|----------|
| **Positional** | Remember where it is | Familiar | Requires memory |
| **Identity** | Remember its name | Familiar | Requires memory |
| **Attribute-based** | Search by properties | Powerful, no memory needed | Must be implemented |

**Attribute-based retrieval examples:**
- Spotlight (OS X)
- Google Search
- Tags (del.icio.us, Flickr, Twitter hashtags)

#### Constrained Natural-Language Output

**Definition:** Query builder where dropdowns form English sentences.

**Example:**
> "Show me [all documents] [created by] [John] [in the last] [30] [days]"

**Advantages:**
- Self-documenting
- Guarantees valid queries
- No programming language required

---

## CHAPTER 15: PREVENTING ERRORS AND INFORMING DECISIONS

### Rich Modeless Feedback

**Definition:** Visual information displayed in main views, not modal dialogs.

#### RVMF (Rich Visual Modeless Feedback)

**Characteristics:**
- Rich: In-depth information
- Visual: Uses pixels on screen (often dynamic)
- Modeless: Always available, no special action required

**Examples:**
- Outlook: Icon next to sender name shows availability
- iOS App Store: Progress indicator on downloading app
- Civilization: City status (smoke = unrest, architecture = advancement)

**Audible Feedback:**

> **Positive audible feedback** = reassuring sounds when things work
> **Negative audible feedback** = beeps when things fail

| Type | User Reaction | Example |
|------|---------------|---------|
| **Positive** | Comfortable, knows they're doing well | Keyboard clicks, app launch sounds |
| **Negative** | Humiliated, hates the software | Error beeps |

**Design:**
- Use positive audible feedback for success
- Silence for failure (user notices without being told)

### Undo

#### Mental Models of Undo

**Users don't want to believe they make mistakes.**
- Undo should be about exploration, not fixing errors
- Users experiment; Undo is the rope ladder back

> **Principle: Ask forgiveness, not permission.**

#### Types of Undo

| Type | Description |
|------|-------------|
| **Single** | Undo last action only |
| **Multiple** | Undo multiple actions in reverse order |
| **Group Multiple** | Undo a batch of actions at once |
| **Discontiguous** | Undo selected actions (not necessarily sequential) |
| **Category-specific** | Undo only formatting changes, or only content changes |

**Incremental vs. Procedural Actions:**
- **Incremental**: Has data component (typing, deleting, pasting) - easy to undo
- **Procedural**: Has only procedure component (formatting, rotating) - harder to undo

#### Redo

**Definition:** Undoes an Undo.

**Use case:** User undoes too many actions.

#### Versioning

**Definition:** Automatic or manual snapshots of document state.

**Implementation:**
- Save version at intervals
- Allow revert to any version
- Show time, date, size, author notes
- Current state saved as version when reverting

#### Deleted Data Buffer

**Definition:** Repository of all deleted text/data.

**Benefits:**
- Browse randomly (not just LIFO)
- Date-stamped entries
- Cut-and-paste recovery

### What-If / Compare Functions

**Use case:** Compare before and after states.

**Implementations:**
- Toggle Undo/Redo (crude)
- "Jump" button (compare current and previous)
- Preview thumbnails
- Side-by-side comparison

---

## CHAPTER 16: DESIGNING FOR DIFFERENT NEEDS

### Command Modalities

| Type | Description | User Level | Example |
|------|-------------|------------|---------|
| **Pedagogic** | Teaches by inspection | Beginners | Menus |
| **Immediate** | Direct effect | Intermediates | Toolbars, buttons |
| **Invisible** | Requires memorization | Experts | Keyboard shortcuts |

### Memorization Vectors

**Definition:** Pathway from pedagogic to immediate/invisible commands.

**Implementation:**
- Show keyboard shortcuts in menus (right side)
- Show toolbar icons on menu items
- Show mnemonics when Alt key pressed
- ToolTips on toolbar icons

### Learnability and Help

#### Assistive Interfaces

| Type | Description | When to Use |
|------|-------------|-------------|
| **Guided tours** | Sequential screens with text/images | First-time use, major updates |
| **Overlays** | Transparent annotations on interface | Explaining gestures/controls |
| **ToolTips** | Brief text on hover | Intermediate reference |
| **Galleries** | Ready-to-use templates | Reducing blank slate intimidation |
| **Wizards** | Step-by-step configuration | Setup, configuration (NOT primary tasks) |

#### Online Help

**Best for Intermediates:**
- Reference material
- Comprehensive index
- Full-text search

**Overviews are critical:**
- Scope, effect, power, upside, downside
- Why use this facility
- Compared to what?

### Customizability

**Personalization (Decoration):**
- Change colors, fonts, desktop patterns
- Makes places more likable and familiar
- Helps navigation (differentiation)

**Configuration (Moving persistent objects):**
- Move, add, delete interface elements
- For experienced users
- Corporate IT managers value it

**Idiosyncratically Modal Behavior:**
- When user population splits on preferred idiom
- Offer BOTH approaches
- Let users choose

### Localization and Globalization

| Concept | Definition |
|---------|------------|
| **Localization** | Translating for specific language/culture |
| **Globalization** | Making as universal as possible |

**Localization Considerations:**
- Word/phrase length (German longer, Spanish longest)
- Asian languages - sorting difficulties
- Date/time formats (day-month-year vs. month-day-year)
- Decimal points and commas
- Calendar types (Gregorian vs. others)

### Accessibility

**Goals:**
1. Users perceive and understand all information
2. Users perceive, understand, and manipulate controls
3. Users navigate easily

**10 Accessibility Guidelines:**

| # | Guideline | Implementation |
|---|-----------|----------------|
| 1 | Leverage OS accessibility tools | VoiceOver, TalkBack |
| 2 | Don't override user-selected system settings | Color schemes, font sizes |
| 3 | Enable standard keyboard access | Tab navigation, arrow keys, Enter |
| 4 | Display options for visually impaired | High contrast (80%), enlarge type |
| 5 | Provide visual-only and audible-only output | Screen readers, visual cues |
| 6 | No flashing/flickering | Can cause seizures |
| 7 | Simple, clear, brief language | Short sentences, no jargon |
| 8 | Accommodate response times | 10x average, adjustable timers |
| 9 | Consistent layouts and task flows | One paradigm, not many |
| 10 | Text equivalents for visual elements | Invisible ToolTips, tags |

---

## CHAPTER 17: INTEGRATING VISUAL DESIGN

### Visual Art vs. Visual Design

| Aspect | Visual Art | Visual Design |
|--------|------------|---------------|
| **Purpose** | Self-expression | Communication |
| **Constraints** | Few | Many (users, context, brand) |
| **Value** | Singularity, uniqueness | Utility, clarity |

### Visual Elements

| Element | Use | Characteristic |
|---------|-----|----------------|
| **Shape** | Object recognition | Attention: low |
| **Size** | Hierarchy, attention | Ordered and quantitative |
| **Color (Hue)** | Categories, meaning | Not ordered or quantitative |
| **Color (Value)** | Contrast, hierarchy | Ordered |
| **Color (Saturation)** | Attention, excitement | Quantitative |
| **Orientation** | Directional info | Hard to perceive at small sizes |
| **Texture** | Affordance cues | Takes attention to distinguish |
| **Position** | Relationships, hierarchy | Ordered and quantitative |
| **Typography** | Content communication | Word shape matters |

### Visual Interface Design Principles

**What visual interfaces should do:**

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | Convey tone/communicate brand | Experience attributes |
| 2 | Lead through visual hierarchy | Size, color, position |
| 3 | Provide visual structure and flow | Alignment grid, logical path |
| 4 | Signal what users can do | Affordance, icons, pre-visualization |
| 5 | Respond to commands | Visual feedback |
| 6 | Draw attention to important events | Contrast (size, color, motion) |
| 7 | Build cohesive visual system | Consistency, standards |
| 8 | Minimize visual work | Reduce visual noise |
| 9 | Keep it simple | Take things away until it breaks |

### The Squint Test

Close one eye and squint to see:
- Which elements pop out
- Which are fuzzy
- Which seem grouped

### Grid System

**Benefits:**
- Usability: Users learn where things are
- Aesthetic appeal: Sense of order
- Efficiency: Less tweaking, consistent extensions

**Atomic Grid Unit:**
- Smallest spacing between elements (e.g., 4px)
- All spacing in multiples of atomic unit

**Relationships:**
- Golden section (1.61)
- Square root of 2 (1:1.14)
- 4:3 (display aspect ratio)

### Information Hierarchy

**Rank by importance (from scenarios):**
1. What needs understanding instantly
2. Secondary information
3. Exception-only information

**Use visual properties to distinguish levels:**
- Size (larger = more important)
- Color contrast (more contrast = more important)
- Position (above, left = more important)

### Icons

**Guidelines:**
- Represent both action and object ("Cut" = scissors + document)
- Avoid cultural metaphors (thumbs-up offensive in some cultures)
- Group related functions
- Keep simple, avoid excessive detail
- Reuse elements
- Use ToolTips for text

### Consistency and Standards

**Benefits:**
- Faster learning
- Higher throughput
- Fewer errors
- Lower training and support costs

**Risks:**
- Only as good as the standard
- Can stifle innovation

> **Principle: Obey standards unless there is a truly superior alternative.**

**When to Violate:**
- When new idiom is measurably better for target users
- Significant improvement in real-world use
- But accept risk of failure

---

# PART III: INTERACTION DETAILS

---

## CHAPTER 18: DESIGNING FOR THE DESKTOP

### Primary Window Anatomy

| Component | Purpose |
|-----------|---------|
| **Content area** | Main work area |
| **Menu bar** | Pedagogic access to all functions |
| **Toolbars** | Immediate access to frequent functions |
| **Index panes** | Navigation to content objects |
| **Sidebars** | Properties, contextual controls |
| **Tool palettes** | Modal tools (drawing, selection) |

### Window States

| State | Description | When to Use |
|-------|-------------|-------------|
| **Maximized** | Fills entire screen | Sovereign applications, default |
| **Minimized** | Collapses to taskbar/dock | When not using |
| **Restored/Pluralized** | Shares screen with others | Transient applications, multitasking |

### Menus

#### Types

| Type | Description | When to Use |
|------|-------------|-------------|
| **Drop-down** | From menu bar | Pedagogic access |
| **Contextual** | Right-click | Object-specific actions |
| **Cascading** | Hierarchical submenus | Rarely - hard to use |

#### Menu Guidelines

| Guideline | Why |
|-----------|-----|
| Disable items not applicable | Teaching tool |
| Use check marks for toggles | Shows state |
| Show icons consistently | Visual language |
| Show keyboard accelerators | Learning vector |
| Use access keys (underlined letters) | Keyboard access |

### Toolbars

**Characteristics:**
- Icon buttons (immediate access)
- ToolTips (learning vector)
- Disable when not applicable
- Customizable for advanced users
- Docking (flexible positioning)

**Toolbar vs. Modeless Dialog:**
- Toolbars: Always available, efficient
- Modeless dialogs: Floating, need management

### Direct Manipulation

#### Pointing Actions

| Action | Selection | Description |
|--------|-----------|-------------|
| **Point** | No | Position cursor |
| **Click** | Yes | Select or activate |
| **Double-click** | Yes | Select + act (select + action) |
| **Drag** | Yes | Move or select range |
| **Right-click** | Yes | Context menu |

#### Selection Order

**Object-Verb Order (Preferred):**
1. Select object(s)
2. Execute command

**Verb-Object Order (Useful for some cases):**
1. Execute command
2. Identify object(s)
3. Apply command

**Guidelines:**
- Mouse-down selects
- Mouse-up commits
- Visual indication of selection is essential

---

## CHAPTER 19: DESIGNING FOR MOBILE

### Mobile Form Factors

| Type | Screen Size | Aspect Ratio | Use |
|------|-------------|--------------|-----|
| **Handheld** | 4-6" | 16:9 | Portrait bias, transient |
| **Tablet** | 9-10" | 4:3 or 16:9 | Sovereign apps |
| **Mini-tablet** | 7-8" | 4:3 or 16:9 | Awkward in-between |

### Mobile Navigation Patterns

| Pattern | Description | Examples |
|---------|-------------|----------|
| **Stacks** | Vertical list with top/bottom bars | Most mobile apps |
| **Carousels** | Horizontal swipe between views | iOS Weather |
| **Swimlanes** | Stack of carousels | Netflix |
| **Cards** | Self-contained content objects | Facebook, LinkedIn, Google Now |
| **Drawers** | Hidden navigation, slide to reveal | Gmail, Facebook |

### Bars and Controls

| Control | Location | Purpose |
|---------|----------|---------|
| **Tab bars** | Bottom (iOS), Top (Android) | Switch between views |
| **Nav bars** | Top | Back button, title, actions |
| **Tool bars** | Top/Bottom | Actions on current content |
| **Action bars** | Top (Android) | Navigation + actions |
| **Hamburger icon** | Nav bar | Reveal drawer |

### Gestures

| Gesture | Purpose | Discoverability |
|---------|---------|-----------------|
| **Tap** | Select, activate, toggle | High |
| **Tap-and-hold** | Context menu | Low (avoid) |
| **Drag** | Scroll, move, reorder | Medium |
| **Swipe** | Quick navigation, delete | Medium |
| **Pinch** | Zoom in/out | Medium |
| **Rotate** | Knobs, object rotation | Low |

### Principles

1. Most mobile apps have **transient posture**
2. **Guided tours** orient first-time users
3. **Overlays** explain gestures
4. Use **tap-to-reveal** controls
5. Use **direct manipulation** where possible
6. Support **app integration** (IFTTT, AudioBus)

---

## CHAPTER 20: DESIGNING FOR THE WEB

### Web Navigation

| Type | Location | Description |
|------|----------|-------------|
| **Primary navigation** | Top (preferred) or side | Major sections |
| **Secondary navigation** | Left menus, fat navigation | Sub-sections |
| **Breadcrumbs** | Above content | Show hierarchy, allow upward navigation |
| **Content navigation** | Throughout | Feeds, galleries, featured carousels |

### Web Search Patterns

| Pattern | Description |
|---------|-------------|
| **Auto-complete** | Complete search terms as user types |
| **Auto-suggest** | Fuzzy matching, spell correction |
| **Faceted search** | Filter by attributes |
| **Categorized suggestions** | Scope search by category |

### Scrolling

**Infinite Scrolling:**
- Load more as user scrolls
- Best for: News feeds, where far-down items lose relevance
- Avoid when: Users need end of list, need to return to specific items

**Pagination:**
- Page-based results
- Best for: Search results, long lists of similar items

**Principle:**
- Infinite scrolling and site footers are mutually exclusive.

### Responsive Design

**Breakpoints:**

| Screen Width | Layout |
|--------------|--------|
| >1024px | Multi-column, full navigation |
| 768-1024px | Modified layout, collapsed navigation |
| <768px | Single column, hamburger menu |

> **Principle: If you have only one version of your site, make it responsive.**

---

## CHAPTER 21: DESIGN DETAILS - CONTROLS AND DIALOGS

### Control Types

| Type | Purpose | Examples |
|------|---------|----------|
| **Imperative** | Initiate action | Buttons, hyperlinks |
| **Selection** | Choose options | Checkboxes, radio buttons, lists |
| **Entry** | Input data | Text fields, spinners, sliders |
| **Display** | Present information | Scrollbars, labels, splitters |

### Selection Controls

| Control | When to Use | Characteristics |
|---------|-------------|-----------------|
| **Check box** | Multiple options, binary choices | Square, independent |
| **Radio button** | Mutually exclusive options (2-6) | Round, one selected |
| **List box** | Many mutually exclusive options | Scrollable, single or multiple |
| **Combo box** | Many options + ability to add new | Text + dropdown |
| **Toggle button** | Binary choice, toolbar-friendly | Icon button, stays down when on |
| **Switch** | Binary choice, mobile-friendly | On/Off labels, sliding |

### Entry Controls

| Control | When to Use | Characteristics |
|---------|-------------|-----------------|
| **Text field** | Unbounded text input | Free text entry |
| **Spinner** | Numeric values with small steps | +/- buttons + text field |
| **Slider** | Ranges, continuous values | Track with thumb |
| **Dial** | Compact, knob-like input | Rotary control |
| **Combo box** | Selection + text entry | Text + dropdown |

### Bounded vs. Unbounded Entry

| Control Type | Description | When to Use |
|--------------|-------------|-------------|
| **Bounded** | Restricts values to valid range | Any limited set of values |
| **Unbounded** | Accepts any input | Open-ended text |

> **Principle: Use bounded controls for bounded input.**

### Dialogs

#### Five Dialog Types

| Type | Description | Modality |
|------|-------------|----------|
| **Property** | View/change settings | Modeless preferred |
| **Function** | Execute a command | Modal common |
| **Process** | Show progress | Non-modal |
| **Notification** | Important messages | Modeless |
| **Bulletin** | Errors, alerts, confirmations | Modal |

#### Dialog Guidelines

| Guideline | Why |
|-----------|-----|
| Put primary interactions in primary window | Reduce excise |
| Use verbs in function dialog title bars | "Print Report" |
| Use object names in property dialog title bars | "Report Properties" |
| Differentiate modal from modeless | Use Close control only for modeless |
| Don't stack tabs | Tabbed dialogs have limits |
| Don't dynamically change button labels | Confusing |

### Eliminating Errors, Alerts, Confirmations

| Instead Of | Do This |
|------------|---------|
| **Error dialog** | Make errors impossible with bounded controls |
| **Alert dialog** | Use modeless feedback (visual status) |
| **Confirmation dialog** | Do, don't ask. Support Undo. |

> **Principle: Most error dialogs stop the proceedings with idiocy.**

### Error Messages

**Why error messages fail:**
- Users interpret them as being told they're stupid
- They don't prevent errors, only protect the application
- They treat users as less important than code

**How to eliminate errors:**
1. Make errors impossible (bounded controls)
2. Make application smarter (auto-correct)
3. Use modeless feedback (inform, don't interrupt)

**When errors are unavoidable:**
- Be polite, illuminating, helpful
- Never hint user caused the problem
- Offer to solve the problem
- Don't dump problem in user's lap

### Confirmation Dialogues

**Why confirmations fail:**
- They work only when unexpected
- Routine confirmations become automatic
- Users dismiss without reading

**How to eliminate confirmations:**
1. **Do, don't ask** - be confident
2. **Make all actions reversible** - robust Undo
3. **Provide modeless feedback** - inform, don't confirm

---

# DESIGN PRINCIPLES SUMMARY

## Process Principles

| # | Principle | Chapter |
|---|-----------|---------|
| 1 | User interfaces should be based on user mental models rather than implementation models | 1 |
| 2 | Focus the design for each interface on a single primary persona | 3 |
| 3 | Define what the product will do before you design how it will do it | 4 |
| 4 | In the early stages, pretend the interface is magic | 4 |
| 5 | Form and behavior must be designed in concert | 5 |

## Behavior Principles

| # | Principle | Chapter |
|---|-----------|---------|
| 6 | The computer does the work; the person does the thinking | 8 |
| 7 | Software should behave like a considerate human being | 8 |
| 8 | If it's worth it to the user to do it, it's worth it to remember | 8 |
| 9 | Don't stop the proceedings with idiocy | 11 |
| 10 | Ask forgiveness, not permission | 11 |
| 11 | Audit, don't edit | 14 |

## Interface Principles

| # | Principle | Chapter |
|---|-----------|---------|
| 12 | Don't make the user feel stupid | 3 |
| 13 | Optimize for intermediates | 10 |
| 14 | Inflect the interface for typical navigation | 10 |
| 15 | Users make commensurate effort if the rewards justify it | 10 |
| 16 | Visually communicate pliancy whenever possible | 13 |
| 17 | Visually distinguish elements that behave differently | 17 |

## Detail Principles

| # | Principle | Chapter |
|---|-----------|---------|
| 18 | Use bounded controls for bounded input | 21 |
| 19 | Put primary interactions in the primary window | 18 |
| 20 | Use links for navigation, buttons for action | 21 |
| 21 | Make errors impossible | 21 |
| 22 | Do, don't ask | 21 |
| 23 | Make all actions reversible | 15 |

---

*End of Complete Knowledge Base*