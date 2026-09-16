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

- `js/data/species.js`, `js/data/backgrounds.js`, `js/data/feats.js` extracted
  from the old build. `feats.js` is new work: origin feats, the full General
  feat menu for ASI levels, and the Epic Boon menu for level 19, with
  machine-checkable `prereqFn` predicates.
- `js/rules.js` — the whole derivation layer, pure functions, no DOM.
- `js/state.js` — state shape, `localStorage`, v1 → v2 migration, export/import.
- `js/app.js` + `index.html` — the live modular app. **Phase A is complete**:
  the scroll-jump bug, the multiclass flow, the HP rules, subclass-at-3 and
  feat choices all work and were verified in a browser.
- The old single-file build is kept as `legacy-single-file.html` for
  reference; `index.html` is now the modular app.

### Verified in a real browser (not just by reading the code)
A Fighter 6 (Eldritch Knight) / Wizard 5 / Warlock 4 dwarf soldier, total
level 15, produced all of these correctly:
- Combined caster level 7 → slots `[4,3,3,1]`, with Pact Magic shown
  separately as 2 × level 2.
- Per-class allowances read off each class's own table at its own level: EK
  2 cantrips / 4 prepared, Wizard 4 cantrips / 14 in spellbook / 9 prepared,
  Warlock 3 cantrips / 5 prepared.
- HP 125 on fixed averages: 13 at level 1 (d10 max + Con 2 + Dwarf 1), then
  9 per Fighter level, 7 per Wizard level, 8 per Warlock level.
- Feat slots owed retroactively at Fighter 4, Fighter 6, Wizard 4 and
  Warlock 4 — i.e. character levels 4, 6, 10 and 15.
- Prerequisites enforced: Actor greyed out at Charisma 8, Observant greyed
  out at Int 12 / Wis 10, already-taken feats greyed out in other slots, and
  an Origin feat cannot be selected in an ASI slot.
- Saves from the first class only (Str +8, Con +7), Expertise doubling on
  Arcana (+11), and no Jack of All Trades since there is no Bard.

### In progress
- Phase B (spells). See below.

### Done — Phase A: breadth first (all seven items)

1. ~~Split the single `index.html` into modules.~~ Done. `css/style.css`,
   `js/data/core.js`, `js/data/classes/*`, `js/data/{species,backgrounds,feats}.js`,
   `js/rules.js`, `js/state.js`, `js/app.js`, and a new `index.html` shell.
2. ~~Fix the scroll-jump bug (requirement 14).~~ Done, and the originally
   diagnosed cause turned out to be only half the story. **Read this before
   touching the render path:** removing `window.scrollTo({top:0})` from
   `renderAll()` was necessary but not sufficient. Emptying a container
   before refilling it collapses the document height, and the browser
   clamps `scrollY` to the new tiny maximum at that instant; refilling does
   not restore it, so the page still jumped with nothing calling
   `scrollTo`. The fix is `swapChildren()` in `app.js`: build each subtree
   detached and install it with `replaceChildren`, one atomic mutation, so
   the document is never short. `rerender()` also restores `scrollY`
   explicitly as a safety net. Never go back to clear-then-append.
3. ~~All 12 classes with verified 1-20 tables and 4 subclasses each.~~ Done.
4. ~~Multiclass flow (requirements 2, 5).~~ Done: per-class level dropdown
   whose range is capped by the remaining headroom to 20, add-another-class
   picker greying out taken classes, remove and make-starting-class.
5. ~~HP (requirements 4, 6).~~ Done, plus roll-all / fixed-average
   shortcuts and the Dwarven Toughness, Tough and Draconic Resilience riders.
6. ~~Subclass choice at level 3 for every class.~~ Done.
7. ~~Feats at ASI levels plus retroactively owed feats.~~ Done, with
   prerequisites enforced and an inline +2/+1 picker for the ASI feat.

### Next — Phase B: spells
Spell database with per-class list filtering (requirement 16), the
level-by-level picking walkthrough (requirement 9), and the hover popover
showing full rules text + a mechanical TL;DR (requirement 7). Same popover
component is reused for feats (requirement 13).

### Mostly done — Phase C: persistence and output
Multiple saved characters (requirement 11), JSON export/import
(requirement 10) and the printable sheet (requirement 15) all landed with
`app.js` — our own layout, never Wizards' artwork or template. **Still to
do: the post-creation single-step levelling mode** (requirement 10), i.e.
open a saved character and add one level at a time, answering only the
choices that new level actually triggers rather than walking all eight steps.
`R.levelLog()` and the stable `classIndex:classLevel` feat slot ids were
designed for exactly this, so the data layer is ready for it.

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
