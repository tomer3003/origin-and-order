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
- Nothing landed yet beyond this log and the seeded level-1 `index.html`.

### In progress
- Phase A (see below).

### Next — Phase A: breadth first
Per the user's explicit priority: get all 12 classes + multiclassing +
levels 1-20 mechanically solid and pickable EARLY, even while spell lists,
equipment and subclass feature text are still thin. Depth comes after.

1. Split the single `index.html` into modules (`css/style.css`,
   `js/data/*.js`, `js/rules.js`, `js/state.js`, `js/app.js`).
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

## Open questions for the user (non-blocking; noted rather than asked)

- Cross-device sync is gone with the move off Claude hosting. Saved characters
  are per-browser `localStorage` only. If they want real sync later that needs a
  backend (Supabase/Firebase) — out of scope unless asked.
- Two SRD-mirror numbers were ambiguous and are currently taken from the
  standard full-caster pattern rather than a direct read: Bard prepared-spell
  counts at levels 17-20. Worth a PHB eyeball since the user owns the book.
