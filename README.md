# Teaching That Sticks

*A free, openly licensed CPD programme for clinical educators in the NHS and wider health and care system.*

**[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — copy it, fork it, adapt it, share it.**

---

## What it is

Teaching That Sticks is a three-session programme for anyone in healthcare who teaches — and who has never been formally taught how to. It is built on peer-reviewed learning science and designed to be delivered by clinical educators, to clinical educators. The pedagogy is the content: every session models what it teaches.

**Format:** 3 × 90 minutes, spaced at least one week apart  
**Group size:** 8–20 participants  
**Cost:** £0 — a projector, moveable chairs, and free-tier digital tools are all you need

---

## The problem it exists to solve

Most NHS clinical educators received no training in how to teach. They teach the way they were taught: dense slides, passive delivery, no evaluation of impact. The evidence base is unambiguous — this approach produces minimal retention and rarely produces behaviour change.

This is not a soft skills issue. A 2024 cross-sectional study found a statistically significant correlation (p < 0.001) between educator quality and the patient safety competencies of the nurses they trained. The downstream effect is measurable.

The NHS Educator Workforce Strategy (2023) identifies the pattern directly: clinical staff transition into educational roles based on clinical seniority alone, creating *"unconscious incompetence regarding evidence-based teaching methodologies."* The 10 Year Health Plan for England (2025) commits to an overhaul of education and training curricula within three years.

---

## The three sessions

| # | Title | Core question |
|---|-------|---------------|
| 1 | **Death by PowerPoint?** | Why does my teaching produce so little retention? |
| 2 | **Active Beats Passive** | Why does knowing the evidence not change what I do? |
| 3 | **Did It Stick?** | How do I know if the teaching actually changed practice? |

**Session 1** — Participants experience cognitive overload before receiving any theory. A deliberately catastrophic slide, thirty seconds, projector off. A live word cloud reveals how little was retained. They then redesign a real slide from their own practice using evidence-based principles and make a specific, written commitment to one change.

**Session 2** — A jigsaw activity on learning science. A design challenge under authentic clinical constraints. Then the hard conversation: why everything covered in the first seventy minutes becomes unavailable in environments where learners do not feel psychologically safe to get things wrong.

**Session 3** — Opens with a retrieval quiz on Sessions 1 and 2. Introduces Kirkpatrick's four-level model and confronts the fact that most clinical teaching is evaluated only at Level 1 (smile sheets) while Level 3 — behaviour change — is almost never assessed. Action learning sets in triads on real current challenges. Participants leave with a personalised 30/60/90-day follow-up plan.

---

## Theoretical foundations

The programme draws explicitly on 16 frameworks, each chosen for direct practical application to clinical education:

Biggs · Sweller · Mayer · Vygotsky · Knowles · Ebbinghaus · Kolb · Lave & Wenger · Edmondson · Roediger & Karpicke · Hattie & Timperley · Revans · Kirkpatrick · Meyer & Land · Maslow · Rudolph et al.

Full theory summaries with evidence links are available in the website's Theory Library.

---

## Design principles

1. **The programme models its own message.** No bullet points appear in any session slides. Participants experience evidence-based teaching before they are given a name for what they experienced.
2. **Built for real NHS constraints.** No budget required. No institutional infrastructure. Designed to work with a projector, a laptop, a flipchart, and free-tier Mentimeter and Padlet.
3. **Openly licensed.** CC BY 4.0. Any educator can adapt and deliver it. Attribution required.
4. **Multi-professional.** Designed for F1/F2/ST doctors, nurses, AHPs, pharmacists, paramedics, and educators in higher education — anyone in healthcare who teaches.
5. **Evidence-based.** Every design decision is traceable to a peer-reviewed source, available in the public theory library.

---

## Repository structure

```
site/                   Astro 5 website (source)
├── src/
│   ├── content/
│   │   ├── facilitator/    Session blueprints, pre-programme resources, evaluation toolkit
│   │   ├── sessions/       Participant-facing session pages
│   │   ├── theories/       Theory library entries (16 frameworks)
│   │   └── papers/         Key evidence summaries
│   ├── pages/              Astro page routes
│   └── layouts/            Base shell layout
└── public/
    ├── styles/             shared.css (single stylesheet)
    └── images/             Fox character illustrations
.github/workflows/      GitHub Pages deploy (builds from site/)
Justfile                Dev commands (just dev, just build)
LICENCE.md              CC BY 4.0
```

---

## Running locally

```bash
cd site
npm install
npm run dev        # or: just dev from root
```

Requires Node 18+. Dev server starts at `http://localhost:4321`.

---

## Licence

[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)

You are free to share and adapt this material for any purpose, including commercially, provided you give appropriate credit and indicate if changes were made.

**Attribution:** *Teaching That Sticks* — [https://github.com/teaching-that-sticks/](https://github.com/teaching-that-sticks/)


Pull requests are welcome. Please raise an issue before making large structural changes. Translations are especially welcome.

If you adapt this for your trust or institution, we would love to hear about it.

---

*Teaching That Sticks — because learning that doesn't change practice didn't really happen.*
