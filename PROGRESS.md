# Origin & Order — build progress log

A D&D 2024 (5.5e) character builder. Plain static site, no build step, deployed
to GitHub Pages from `master` root: https://tomer3003.github.io/origin-and-order/

**Read this file first when resuming work.** It records what is done, what is
partial, and what is next, so a cold start needs no re-derivation.

---

## Deployment / architecture facts

- Plain ES modules (`<script type="module" src="js/app.js">`). No bundler, no
  transpiler, no npm. GitHub Pages serves `.js` with the right MIME type, so
  modules just work. Keep it that way — zero build step is a feature.
- `.nojekyll` is present so Pages serves every path verbatim.
- **No `claude.use(...)` anywhere.** This was briefly hosted as a Claude
  Artifact; it is not any more. There is no `db` and no `downloads` capability.
  Saved characters live in `localStorage`; export/import is a real
  Blob + `<a download>` / `<input type="file">`.
- Storage keys: `oo.characters.index` (array of `{id,name,summary,updated}`)
  and `oo.character.<id>` (one full character each). The in-progress draft is
  `oo.draft`.

## Data sourcing rules (important, don't regress this)

- Primary source is the **CC-BY-4.0 D&D 5.2 SRD**. The cleanest mirror found is
  `https://5e24srd.com/classes/<class>.html` (one page per class, accurate
  feature tables) and `https://5e24srd.com/spells/index.html`.
- **Never paste verbatim prose from the PHB or any copyrighted book.** Every
  mechanical description in this codebase is written in our own words as short
  mechanical bullets — e.g. "Bonus Action: regain 1d10 + Fighter level HP" — not
  quoted rules text. Keep that voice for every new class, spell, and feat.
- Where the PHB and the SRD mirror disagree, the **PHB wins** (the SRD
  sometimes simplifies). Known instance: Ranger level-1 spell slots = 2.
- The SRD ships only ONE subclass per class. All four PHB subclasses per class
  are paraphrased from own knowledge.

## Rules facts confirmed against the SRD (do not re-research)

- **All 12 classes choose their subclass at level 3.** No per-class exceptions.
- **Paladin and Ranger get Spellcasting at level 1** in 2024 (not level 2).
- **Level 19 is "Epic Boon" for every class** (an Epic Boon feat choice).
- ASI levels are 4/8/12/16 for most classes, plus:
  Fighter also 6 and 14; Rogue also 10.
- Multiclass caster level =
  (Bard+Cleric+Druid+Sorcerer+Wizard) + floor((Paladin+Ranger)/2)
  + floor(Fighter/3) if Eldritch Knight + floor(Rogue/3) if Arcane Trickster.
  Warlock Pact Magic slots are tracked separately and never merged in.
- Full verified level 1-20 tables for all 12 classes are transcribed in
  `srd-2024-class-tables.md` (kept in the scratchpad, mirrored into this repo
  under `docs/` if useful).

## Spell-preparation models (requirement 9)

Three distinct behaviours, driven by `caster.prepMode` in the class data:

- `free` — Cleric, Druid, Paladin. Prepares from the **entire** class list of
  eligible spell levels after a Long Rest. UI offers all of them at once; no
  pick-one-at-a-time walkthrough, no swap prompt.
- `list` — Bard, Ranger, Sorcerer, Warlock. A fixed list that grows on level-up,
  and **one optional swap of a previously-chosen spell per level-up**.
- `spellbook` — Wizard. Learns new spells into the spellbook each level (no
  swap-on-level-up per RAW) and prepares a subset daily.

---

## STATUS

### Done
- `css/style.css` extracted from the old single-file `index.html`.
- `js/data/core.js` — abilities, skills, alignments, armour, all four spell
  slot tables, Fighting Styles, and the ASI/Epic Boon feature stubs.
- **All 12 classes** are split into `js/data/classes/<class>.js`, collected by
  `js/data/classes/index.js` (which also carries the multiclass caster-level
  weights and the two third-caster subclass keys). Each class carries: core
  traits, equipment options, caster block, ASI/Epic Boon levels, per-level
  `tracks`, level-gated `choices`, full 1-20 `features`, and all four PHB
  subclasses with their own features and always-prepared spell lists.
- Every class table verified **line by line against the user's own PHB**, not
  the SRD mirror. See "Corrections to the SRD mirror" below — the mirror had
  four real errors.

### In progress
- Phase A step 2 onward (see below). `index.html` is still the old
  single-file level-1-only build and is deliberately left working while the
  modular app is assembled beside it.

### Next — Phase A: breadth first
Per the user's explicit priority: get all 12 classes + multiclassing +
levels 1-20 mechanically solid and pickable EARLY, even while spell lists,
equipment and subclass feature text are still thin. Depth comes after.

1. ~~Split the single `index.html` into modules.~~ Data layer done
   (`css/style.css`, `js/data/core.js`, `js/data/classes/*`). Still to
   extract from the old `index.html`: species, backgrounds and feats into
   `js/data/`, then build `js/rules.js`, `js/state.js`, `js/app.js` and the
   new `index.html`.
2. Fix the scroll-jump bug (requirement 14): split `renderAll()` into
   `rerender()` (no scroll) and `goToStep()` (scrolls). Every option-click
   handler calls `rerender()`; only Back/Continue and the step-tracker
   scroll. Diagnosed root cause: old line 664 `window.scrollTo({top:0})`
   inside `renderAll()`, which ~25 chip/radio/select handlers all called.
3. All 12 classes with verified 1-20 feature tables and 4 subclasses each.
4. Multiclass flow (requirements 2, 5): class + level-count dropdown,
   "Add additional class" re-opens the picker with taken classes greyed out,
   running total capped at 20.
5. HP (requirements 4, 6): level 1 of the FIRST class = hit-die max + Con mod,
   fixed. Every other level = an empty number input the player types their own
   roll into, plus a "Roll" button that fills it with 1..hitDie.
6. Subclass choice offered whenever a class reaches level 3.
7. Feats at ASI levels + retroactively owed feats when starting above level 1.

### Then — Phase B: spells
Spell database with per-class list filtering (requirement 16), the
level-by-level picking walkthrough (requirement 9), and the hover popover
showing full rules text + a mechanical TL;DR (requirement 7). Same popover
component is reused for feats (requirement 13).

### Then — Phase C: persistence and output
Multiple saved characters (requirement 11), JSON export/import
(requirement 10), post-creation single-step leveling mode (requirement 10),
and the printable character-sheet view styled after the official 2024 layout
(requirement 15) — our own layout, never Wizards' artwork or template.

### Then — Phase D: depth
Full spell text coverage, full subclass features at every level, full
equipment tables, more species. Class by class.

---

## Corrections to the SRD mirror (found by checking the PHB directly)

`srd-2024-class-tables.md` in the scratchpad is a useful index but its
transcription is **not trustworthy for numbers**. Confirmed errors:

- **Warlock** invocations known, Pact slot count, and slot level were all
  wrong. Correct, from the PHB Warlock Features table:
  invocations `1,3,3,3,5,5,6,6,7,7,7,8,8,8,9,9,9,10,10,10`;
  slots `1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4`;
  slot level `1,1,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5`.
  (`core.js` PACT_MAGIC was already right.)
- **Warlock** prepared spells is
  `2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15`.
- **Sorcerer** prepared spells starts at **2**, not 4, and climbs in twos
  early: `2,4,6,7,9,10,...`. Its Spellcasting text says "choose two level 1
  Sorcerer spells", confirming it.
- **Wizard** prepared spells ends at **25**, not 26, and leaves the shared
  full-caster curve from level 13: `...,16,16,17,18,19,21,22,23,24,25`.
- **Rogue** level 19 is Epic Boon, not an ASI. Rogue ASIs are 4/8/10/12/16.

When adding any future table data, read the PHB chapter text in
`phb-classes/*.txt` rather than the mirror summary. Note that the PDF-to-text
conversion column-shifts the *feature* column against the *level* column in
most tables — the `Level N:` headings later in each chapter are the reliable
source for which level a feature lands on, while the numeric columns read
cleanly in top-to-bottom order.

## Settled former open questions

- Bard prepared-spell counts at levels 17-20 are **19/20/21/22**, exactly as
  previously guessed from the full-caster pattern. Confirmed against the PHB.
- Ranger level 1 has **2** spell slots, confirmed against the PHB Ranger
  Features table. The SRD mirror's "1" was wrong.

## Open questions for the user (non-blocking; noted rather than asked)

- Cross-device sync is gone with the move off Claude hosting. Saved characters
  are per-browser `localStorage` only. If they want real sync later that needs a
  backend (Supabase/Firebase) — out of scope unless asked.
