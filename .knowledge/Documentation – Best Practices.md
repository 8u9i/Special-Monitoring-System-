# Accessible Technical Documentation – Best Practices

## Introduction

When you're writing technical documentation for a project or a tool, you'll want it to be **accessible** – meaning it caters to and is usable by the **diverse global audience** on the web. Web accessibility aims to make it possible for anyone to access web content, regardless of health, economic, geographic, or language challenges.

---

## Why Accessibility Matters

| Reason | Impact |
|--------|--------|
| **Wider audience** | People with different abilities can access and use your content |
| **Brand quality** | Shows you are an accessibility-oriented organization |
| **Career opportunities** | Accessibility skills are in demand for developers and designers |
| **SEO benefits** | Good accessibility practices = good SEO practices |
| **Legal compliance** | Accessibility is enforced by law in many countries |

---

## Best Practices for Accessible Technical Documentation

### 1. Use Clear Headings and Paragraphs

**Why:** Headings help screen readers understand and navigate a page's contents.

**Best practices:**
- Use proper heading hierarchy: `H1` for page title, `H2` for major headings, `H3` for subheadings
- Break content into paragraphs for easier reading
- Introduce new topics with headings
- Guide readers through the text in a logical manner

**Markdown example:**
```markdown
# Use H1 for the page title
## Use H2 for major headings
### Use H3 for subheadings
```

### 2. Make Content Clear and Concise

**Best practices:**
- Keep sentences **short** – easier to read and understand
- Give full meanings of acronyms when first used
- Use **simple sentences** and avoid ambiguous words
- Remove all forms of ambiguity

**Before (complex):**
> The web3 running on the Blockchain structure which is transparent, secure, immutable, decentralized would require the processes of artificial intelligence, where it would read data, process, and store information.

**After (clear):**
> Web3 is built on the transparent, secure, unchangeable, and decentralized structure of the blockchain. It uses artificial intelligence processes to read, process, and store information.

### 3. Use Informative Link Text

**Bad:** "Click here" or "Read More" – they don't tell the reader much

**Good:** Descriptive text that explains the link's purpose

✅ `Check out these resources for content writers by W3C.`

### 4. Add Alt Text and Captions to Media

#### Images

- **Alt text:** Describe the **purpose** of the image, not just what it shows
- Alt text helps screen readers read out the description
- Alt text also helps search engine bots classify content

**Example:**
> Instead of "various containers on a ship in motion", write: "various containers on a ship in motion to illustrate the packaging structure and process of a digital container."

- **Captions:** Provide additional details about the image
- Markdown doesn't natively support image captions – use plugins (ReadTheDocs, MkDocs) or custom components (Docusaurus)

#### Videos

- Use HTML `<video>` tag for captions
- YouTube and Vimeo offer built-in caption support – enable before embedding
- **Avoid flashing content** – if present, ensure it does not exceed two times within a second

### 5. Add Transcripts to Audio and Video

Not everyone will want to watch or listen – transcripts make content accessible to all.

#### For Audio
- Insert transcripts using HTML
- Include timestamps for reference

#### For Video
- YouTube provides built-in transcripts in the video description
- Transcripts display with timestamps when clicking "Show Transcript"

### 6. Use Code Snippets (Not Images)

- Use **code blocks** within text to explain code instead of images
- Code snippets allow screen readers to read through the code
- Only use images when absolutely necessary

✅ **Good:** `index.html` code block with syntax highlighting
❌ **Bad:** Screenshot of code

### 7. Use Colour Contrast Technique

- Use colours that are **opposite or heavily contrasting**
- Example: black text on white background (high contrast) vs. light brown on brown (low contrast)
- Use accessible colour palettes like **Color Safe**

### 8. Add Translation Options

- Some documentation sites (Jekyll, Docusaurus) offer multilingual options
- Docusaurus supports multilingual via Crowdin or Git

### 9. Test Your Documentation

| Tool | Purpose |
|------|---------|
| **WAVE** | Web Accessibility Evaluation Tool – checks for errors |
| **AXE** | Accessibility Engine – automated testing |
| **NVDA** | NonVisual Desktop Access – screen reader for testing |

### 10. Set Up a Suggestion/Improvement Box

You can't cover every user's needs – let them help you improve.

**Options:**
- External form link (Google Forms, company website)
- Custom feedback component in your docs

---

## Summary Checklist

**Document Structure:**
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Content broken into short paragraphs
- [ ] Short sentences, simple vocabulary
- [ ] Acronyms defined on first use

**Links and Media:**
- [ ] Descriptive link text (no "click here")
- [ ] Alt text describes image purpose, not just appearance
- [ ] Captions added to images where helpful
- [ ] Video captions enabled
- [ ] Transcripts for audio and video content

**Code and Design:**
- [ ] Code snippets used instead of screenshots
- [ ] High colour contrast (e.g., black on white)
- [ ] Accessible colour palette used

**Testing and Feedback:**
- [ ] Tested with WAVE, AXE, or NVDA
- [ ] Translation options available (if applicable)
- [ ] Feedback/suggestion mechanism in place

---

## Style Guides for Accessible Technical Writing

Consider using or creating a style guide to consistently implement these practices:

- Accessibility style guide by Heyawhite
- Write accessible documentation by Google for developers
- Writing for Accessibility by MailChimp content style guide

---

*Remember: Accessibility is not just about compliance – it's about reaching a wider audience, improving user experience, and building better products for everyone.*