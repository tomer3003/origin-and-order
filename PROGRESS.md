# Origin & Order — build progress log

A D&D 2024 (5.5e) character builder. Plain static site, no build step, deployed
to GitHub Pages from `master` root: https://tomer3003.github.io/origin-and-order/

**Read this file first when resuming work.** It records what is done, what is
partial, and what is next, so a cold start needs no re-derivation.

## Working style

The user has asked that this work happen in the local interactive session,
not by spawning a remote/background agent — do the work directly rather than
delegating it. Still commit and push frequently regardless of who's doing the
work; that habit is what made the earlier remote-agent interruption a
non-event instead of a setback.

---

## Local testing note

This machine has **no node and no working python** (the `python` on PATH is
the Microsoft Store stub). ES modules can't load over `file://`, so to see
the app locally you need a server. `tools/serve.ps1` in this repo is a small
PowerShell `HttpListener` static server that works from any clone:
`powershell -NoProfile -File tools/serve.ps1` serves the repo on
`http://localhost:8123/` (or use the Claude Code preview tool with the
`.claude/launch.json` already checked in). The deployed site needs no server
at all — this is purely a local-testing workaround.

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

A sweep over **all 12 classes × every subclass × levels 1-20** (each build
run through `hpMax`, `ac`, `spellSlots`, `pactMagic`, `spellAllowances`,
`featSlots`, `featuresByClass` and `tracksFor`) reported zero exceptions and
zero malformed features or tracks.

Multiclass spell slots were then checked case by case, all passing:

| build | caster level | slots |
|---|---|---|
| Paladin 1 alone | 0 | `[2]` — own table, not the combined formula |
| Ranger 1 alone | 0 | `[2]` |
| Paladin 2 / Sorcerer 1 | 2 | `[3]` |
| Fighter 3 Eldritch Knight | 1 | `[2]` |
| Fighter 3 Champion | 0 | `[]` — third casting needs the subclass |
| Rogue 3 Arcane Trickster | 1 | `[2]` |
| Bard 20 | 20 | `[4,3,3,3,3,2,2,1,1]` |
| Warlock 5 alone | 0 | `[]` plus Pact 2 × L3 |
| Warlock 5 / Sorcerer 5 | 5 | `[4,3,2]` plus Pact 2 × L3, unmerged |
| Cleric 10 / Wizard 5 / Paladin 4 | 17 | `[4,3,3,3,2,1,1,1,1]` |

The live site was confirmed serving the modular app with a clean console,
and the layout has no horizontal overflow at 375 px.

### In progress
- Phase C's remaining item: post-creation single-step levelling. See below.

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

### Done — feat choices, feat/tooltip system, and 5 more species
(Landed directly by the user's own session, not a background agent — see
the note at the top of this file about working style going forward.)

- **Feats now actually let you pick what they grant.** Every general/boon
  feat with a baked-in "+1 X or Y (max N)" clause has an `abilityChoice` field
  in `feats.js` (an array of eligible abilities, or the string `"any"`), and
  `featAbilityChoicePicker` in `app.js` renders a one-click chip picker for it
  — this is the same UI pattern as the ASI feat's own picker, just simpler
  (always +1, never a 2-mode split). `Resilient` additionally sets
  `tiesSaveProf: true`, which ties the chosen ability to a save proficiency
  via `pick.saveProfAbility` (consumed in `saveProficiencies()`).
  `Skilled`/`Observant`/`Skill Expert` use `skillChoiceAny` /
  `skillChoiceFrom` / `expertiseChoiceAny` the same way, writing into
  `pick.skillPicks` / `pick.expertisePicks`, consumed by `proficientSkills()`
  / `expertiseSkills()`. `Skill Expert`'s Expertise picker reads
  `proficientSkills(state)` live, so a skill the same feat just granted shows
  up as an Expertise option immediately — verified in a real browser.
  `pendingFeatSlots()` (renamed logic now lives in `featPickIncomplete()`)
  was also broken before this: it only checked completion for the literal
  ASI feat, so e.g. picking "Athlete" and never choosing Str-or-Dex counted
  as a finished feat slot. Fixed for every choice type above.
- **Hover/focus tooltips exist now** (requirements 7 and 13), starting with
  feats — the CSS for this (`.popover`, `.pop-trigger`, `.pop-tldr` etc.) was
  already sitting unused in `style.css` from an earlier pass; the JS side
  (`showTooltip`/`hideTooltip`/`tooltipTrigger`/`popoverHtml` in `app.js`) was
  missing and is now written. The feat *picker* itself changed from a plain
  `<select>` to a chip grid for this reason — you can't attach a rich hover
  tooltip to a native `<option>`. Every place a feat name appears (the
  picker, the chosen-feat summary, the per-class feature list, the flat
  feat list, the sidebar) now triggers the same tooltip. `featTLDR()`
  generates the structured "what you actually get" line from the feat's
  choice metadata rather than repeating its prose. **Spells will reuse this
  exact popover component** once Phase B starts — same `popoverHtml()` call,
  different content builder.
- Fixed a real duplicate-listing bug found while testing the above: a
  class-level feat (e.g. Athlete at a Fighter ASI level) was appearing twice
  in the sheet's Features & Traits list — once via `featuresByClass` (with
  its chosen-ability detail) and again via the flat `ownedFeatKeys` fallback
  (without it). The flat list now only adds background/species feats that
  `featuresByClass` never covers.
- **5 more species**: Aasimar, Gnome, Goliath, Orc, Tiefling, bringing the
  total to all 10 from the 2024 PHB. Gnome and Tiefling use the same
  `lineageChoice` pattern as Elf/Dragonborn (Gnomish Lineage, Fiendish
  Legacy); Goliath's Giant Ancestry is a 6-option version of the same thing.
  Orc has no lineage choice, matching the book. Goliath is 35 ft. Speed, not
  30 — checked in the browser that this actually flows through to the sheet.
  Aasimar and Tiefling can pick Medium or Small in the book; this builder
  doesn't have a size-choice mechanism yet (Human has the same gap already),
  so both are fixed at Medium for now — noted here rather than silently
  guessed past.
- Added `tools/serve.ps1` (repo-relative copy of the scratchpad script) and
  `.claude/launch.json` so local testing works from a fresh clone without
  hunting for the script — this machine still has no working node/python.

### Done — Phase B: spells (requirements 7, 9, 16), coverage note below

New file `js/data/spells.js`: `SPELLS` (one entry per spell, tagged with
every class `listKey` it appears on — shared spells like Cure Wounds are
defined once, not duplicated per class) and `spellsForList(listKey, minLevel,
maxLevel)`. Each spell carries structured `roll`/`saveAbility`/`damage`/
`effect` fields that `spellTLDR()` in `app.js` turns into the same kind of
auto-generated "what you actually get" line as `featTLDR()` — reuses the
exact same `popoverHtml()` component built for feats, so hovering a spell
name anywhere (the picker, a known/prepared list, the sheet) shows full text
+ TL;DR the same way a feat does.

**Coverage: cantrips and level-1 spells only**, across the 6 lists that have
spells (Bard, Cleric, Druid, Sorcerer, Warlock, Wizard) plus Paladin/Ranger's
level-1 entries — roughly 80 unique spells. This is NOT the full ~350-spell
book; levels 2-9 are Phase D. The picking mechanism, per-class filtering, and
tooltips are fully built against this data, so extending it is purely adding
more entries to `spells.js` — no code changes needed elsewhere.

New "Spells" step, between Feats and Details (`js/rules.js`'s `spellWork()` /
`spellStepIssues()`, `js/app.js`'s `buildSpellsStep()` and friends). One
independent block per caster class entry (multiclass casters never merge
their known/prepared lists, matching how their slots already didn't merge).
Three distinct pickers, matching each class's actual rule and PROGRESS.md's
original prepMode note:
- **`free`** (Cleric, Druid, Paladin): a flat picker straight from the whole
  eligible list, count = that level's `prepared` target. No permanent
  known-spell list exists for these classes at all.
- **`list`** (Bard, Ranger, Sorcerer, Warlock, and the Eldritch Knight /
  Arcane Trickster third-caster subclasses): a level-by-level walkthrough
  (`permanentGrowthWalkthrough`) — one section per class level reached,
  each requiring exactly that level's new-spell delta (which is sometimes
  +2 in a single level, e.g. Sorcerer 4→5 — never assume it's always +1).
  Levels after the first also get one optional swap
  (`swapControl`), matching the "replace one spell you know" rule; the swap
  pool only offers spells known *before* the current level's own new picks,
  not spells just learned this same level-up (fixed an off-by-one here
  during testing — the pool briefly included one of the level's own new
  picks). Known IS prepared for these classes; no separate prep step.
- **`spellbook`** (Wizard only): the spellbook grows via the same
  level-by-level walkthrough but with no swap option (per RAW), and
  `prepared` is a separate flat picker constrained to spells already in the
  book, re-choosable freely each time (no permanent commitment).

Cantrips are handled the same way for every mode: a flat, freely-reassignable
picker capped at the current count. Not level-walked on purpose — every
class with cantrips lets you swap one on a Long Rest anyway, so a permanent
history would be bookkeeping the rule doesn't actually need.

Requirement 12 (already-known spells highlighted, never blocked): every
picker marks a spell with the same `.dupe` chip styling already used for
skills whenever `R.allKnownSpellKeys(state)` — every spell picked anywhere
across every caster entry — already contains it, but never disables it for
that reason (only "already in this list from an earlier level" and "target
count reached" actually disable a chip).

Requirement 16 (only show spells on the current class's list): every picker
pulls from `R.spellPoolFor`, which is keyed off `caster.listKey` and Bard's
`extraListsFromLevel` (Magical Secrets) — never a flat all-spells list.
**Real bug caught while testing and fixed**: the level-1+ pools were
initially built with `spell.level <= maxLevel`, which let cantrips (level 0)
leak into them since `0 <= 1` is true. `spellsForList`/`spellPoolFor` now
take an explicit `minLevel`, and the level-1+ pools pass `minLevel: 1`.

`spellBox()` (used by both the sidebar-style summary and the printable
sheet) now lists the actual chosen spell names by level, using the same
hover-tooltip name element, instead of just showing counts.

All three prepModes verified end-to-end in a real browser (Sorcerer/list
with an actual swap performed, Cleric/free, Wizard/spellbook with the
prepared-from-book constraint confirmed) — not just read from the code.

STATE_VERSION bumped 2 → 3 for `spellPicks`; `migrate()` normalizes it the
same defensive way as every other field.

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
Spell levels 2-9 (see the Phase B coverage note above), full subclass
features at every level, full equipment tables, more species-adjacent
polish (the Medium-or-Small size choice noted earlier). Class by class.

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
