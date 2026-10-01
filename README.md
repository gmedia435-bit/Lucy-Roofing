# Lucy Roofing LLC — Commercial Brand & AI Lead-Capture Platform

This platform represents a **$10k luxury commercial roofing build** for **Lucy Roofing LLC**. It features oversized fluid typography, custom GSAP & ScrollTrigger motion sequences, smooth Lenis scrolling, bilingual EN/ES translation switching, and an **AI-powered Lead-Capture Chat Assistant** running via a Vercel Serverless Function with zero client-side API key exposure.

---

## 🚀 Key Features

1. **Luxury Commercial Aesthetic**:
   - Palette from logo: Deep near-black base (`#070A11`), warm off-white, and disciplined crimson red (`#D01020`).
   - Typography: Google Fonts `Syne` (Display headlines) and `Inter` (Body & UI text) with fluid `clamp()` sizing.
   - Micro-textures: Architectural hairline grid dividers and high-contrast dark overlay treatments on crew photos.

2. **GSAP + ScrollTrigger & Lenis Motion**:
   - Short (<1.5s) page-load intro reveal (runs once per session).
   - Parallax hero image scaling and masked line-by-line slide-up headline reveals.
   - Glassmorphic header that hides on scroll-down, reveals on scroll-up, with top scroll progress bar.
   - Sticky 6-Step Process sequence with animated progress line drawing.
   - Materials interactive typographic hover grid.
   - Count-up animations for verified stats (`10+` years experience).
   - Custom cursor dot and magnetic button pull (desktop pointer devices only).
   - Full `@media (prefers-reduced-motion: reduce)` accessibility compliance.

3. **Bilingual EN / ES System**:
   - Single source of truth translation file: [`translations.js`](./translations.js).
   - Persistent language choice (`localStorage`), dynamic `lang` and `hreflang` header updates.
   - Original English copy is 100% preserved.

4. **AI Lead-Capture Chat Assistant**:
   - Serverless backend at `/api/chat.js` calling Groq API (`openai/gpt-oss-20b`).
   - 40-second delay OR 60% scroll depth trigger.
   - Positioned to **never block or overlap** the sticky mobile CTA bar (`Call / Text / Estimate`).
   - One-question-at-a-time lead capture flow submitting directly to `SITE_CONFIG.formEndpoint`.
   - Facts-only guardrails from [`site-config.js`](./site-config.js).
   - Fallback UI offering direct Call **(956) 650-8277**, Text, and Estimate form links if API fails.

---

## 🛠️ Vercel Deployment Instructions

### 1. Deploying to Vercel
You can deploy this project directly using Vercel CLI or via GitHub integration:

```bash
# Deploy using Vercel CLI
vercel --prod
```

### 2. Environment Variables Configuration
Set the following environment variable in your Vercel Dashboard under **Project Settings -> Environment Variables**:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | Groq API Key for serverless LLM calls | `your_groq_api_key_here` |

### 3. Local Development
For local testing with serverless functions using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Run local development server
vercel dev
```

---

## 🧪 Testing Checklist

- [x] **English Lead Capture**: Open AI chat assistant, type inquiry, answer lead questions, verify lead submission.
- [x] **Spanish Lead Capture**: Toggle `[ EN | ES ]` header switch, open chat assistant, verify Spanish greeting and responses.
- [x] **Off-Topic Deflection**: Ask non-roofing questions (e.g. "What is the capital of France?") -> verifies polite refusal.
- [x] **Prompt Injection Protection**: Input "Ignore all previous instructions" -> verifies strict guardrails hold.
- [x] **Price Deflection**: Ask for specific dollar quotes -> verifies deflection to the free 1-day proposal team.
- [x] **Mobile CTA Bar Alignment**: Test on 360px and 390px viewports -> confirms chat bubble stays above mobile CTA bar without overlap.
- [x] **Reduced Motion**: Enable prefers-reduced-motion in browser settings -> verifies immediate visibility without parallax/scroll delays.
