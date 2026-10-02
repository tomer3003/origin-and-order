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
- **Source priority (user's instruction): PHB PDF > http://dnd2024.wikidot.com/
  > SRD mirror.** The wikidot site covers the 2024 rules per class/spell/feat
  and is the first fallback when the PDF extract is ambiguous (column-shifted
  tables, etc.); the SRD is last.
- **The user's own PHB 2024 PDF** is at
  `C:\Users\Owner\Downloads\SKT1\DnD Beyond Player’s Handbook 2024.pdf`.
  Scratchpad extracts don't survive between sessions, so re-extract with
  `pdftotext -layout "<that path>" <scratchpad>/phb.txt` (pdftotext ships
  with Git Bash). Chapter 7 spell descriptions start around line 16,400.
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
- Nothing. Next candidates: Warlock Mystic Arcanum picker, then subclass depth (see Phase D).

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

### Done — explicit level/slot scaling in every TL;DR (user follow-up)

The user asked for two things after using Phase B: full text before the
TL;DR (it already was — checked the actual `popoverHtml()` output and the
CSS, no flex/order tricks anywhere; DOM order and visual order both already
put `.pop-body` before `.pop-tldr`, so nothing needed changing there), and
explicit scaling by spell level / player level, which genuinely wasn't
there before.

- Every spell now names its exact upcast in the TL;DR. Cantrips (level 0)
  get an auto-generated note — "gains one die at character levels 5, 11,
  17" — via `spellScalingNote()` in `app.js`, rather than repeating the same
  sentence on 25 data entries; two real exceptions are flagged in the data
  (`noCantripScale: true` on Shillelagh and True Strike, which use weapon
  damage rather than a scaling spell die; `cantripScaleNote` overrides the
  default on Eldritch Blast, which adds beams rather than bigger dice).
  Level-1 spells carry a new explicit `scaling` field in `spells.js` (e.g.
  "+1d6 per slot level above 1st") for every spell that upcasts, filled in
  from the actual 2024 rules per spell — and spells that genuinely don't
  upcast now say so explicitly ("No change when cast with a higher-level
  slot") rather than silently omitting the topic.
- Feats: `tough`'s HP bonus is now stated with real numbers
  ("+4 the level you take this, then +2 every level after") instead of the
  vague "scales with character level". Any feat whose text mentions
  "Proficiency Bonus" (Alert, Lucky, Crafter, Musician, Skulker's uses,
  the Dwarven/Draconic-style per-Long-Rest counts, etc.) now automatically
  gets a line noting it scales via Proficiency Bonus and exactly which
  levels raise it (5, 9, 13, 17), detected from the feat's own text rather
  than hand-flagged per entry.
- Cleaned up `spells.js`'s `damage` strings to hold only the base damage
  (e.g. `"1d10 Fire"`) — the old inline `"(scales with level)"` qualifiers
  are gone now that scaling has its own explicit, structured home.

### Done — full rebuild of spells.js from the actual 2024 PHB text, not memory

The user caught this directly: the previous `spells.js` (all of it — data
written in the very first Phase B pass) was sourced from general trained
knowledge of 5e, which meant it was quietly full of **2014 rules**, not 2024
ones. They named Healing Word specifically. They also asked for the FULL
spell description in the popover (like the official book/D&D Beyond layout:
stat-block bullets, full prose, a real "Using a Higher-Level Spell Slot"
paragraph) rather than a paraphrase, and reported Warlock spells were
completely unpickable.

**Every single spell in this file was re-transcribed from the user's own
PHB text** (chapter 7, extracted to the scratchpad as `phb-spells.txt`,
cross-checked against each class's own "___ Spell List" appendix for exact
class membership) — not rewritten from memory a second time. What that
process actually found, to be concrete about how wrong "sourced from
memory" can go:

- **Four cantrips that don't exist in this book at all**: Control Flames,
  Create Bonfire, Frostbite, and Gust are Tasha's Cauldron of Everything
  cantrips that the 2024 PHB did NOT carry forward — it replaced all four
  with one new consolidated cantrip, **Elementalism** (Druid/Sorcerer/
  Wizard), which is now in the data instead.
- **Three spells whose core mechanic changed between 2014 and 2024**,
  not just numbers: **Sleep** is now a Wisdom save with an Incapacitated →
  Unconscious progression (was: a fixed Hit-Point pool with no save at
  all). **Color Spray** is now a Constitution save inflicting Blinded
  until the end of your next turn (was: the same fixed-HP-pool mechanic
  as old Sleep). **Inflict Wounds** is now a Constitution save for 2d10
  (was: a melee spell attack for a different die).
- **Healing Word and Cure Wounds both doubled their dice** in 2024 —
  2d4/2d8 base and +2d4/+2d8 per upcast level, not the 2014 1d4/1d8. This
  is the exact error the user caught.
- **False Life and Witch Bolt had wrong base amounts** (2d4+4 not 1d4+4;
  2d12 not 3d12), and Witch Bolt's follow-up hit needs a Bonus Action each
  turn — it isn't automatic.
- **Several spells were missing a class from their real list**, or had one
  that isn't real: Comprehend Languages doesn't include Cleric; Disguise
  Self doesn't include Warlock; Bane, Command, and Protection from Evil
  and Good, and Speak with Animals were each missing one real class
  (Warlock, Bard, Druid, and Warlock respectively); Light was missing Bard.
- **Several spells that DO upcast were marked as if they didn't**
  (Charm Person, Longstrider, Jump, Tasha's Hideous Laughter all add a
  target per slot level above 1st in 2024 — none of them upcast in 2014,
  which is presumably where the blank came from), and **Sleep's fabricated
  2014-style upcast note is gone** since 2024 Sleep has none.
- Three cantrips needed a genuinely different scaling note rather than the
  generic "+1 die" rule, now hand-written from the real text: Shillelagh's
  weapon die itself grows (d8→d10→d12→2d6), Spare the Dying's *range*
  doubles instead of adding damage, and True Strike adds a separate
  Radiant damage die on top of the weapon's own damage.

**The `text` field is now the spell's FULL description**, not a paraphrase
— the user specifically asked to see the whole thing, the way the official
book/D&D Beyond does. This is legally fine to reproduce this fully: nearly
all core PHB spells are also published in the CC-BY-4.0-licensed D&D 5.2
SRD, and the license permits verbatim reproduction with attribution, which
is why there's now a real attribution line in `index.html`'s footer and an
`SRD_ATTRIBUTION` export in `spells.js`. A new `higherLevel` field holds the
spell's actual "Using a Higher-Level Spell Slot" / "Cantrip Upgrade"
paragraph, shown as its own labeled block. Class/feat/species text stays
paraphrased, as before — that discipline didn't change, only spells did,
and only because full-text display was explicitly requested and is
actually licensed for it.

**The popover itself was redesigned** to match the book's own layout,
matching a screenshot the user provided: title, an italic "Level 1
Evocation (Sorcerer, Wizard)" line, a bulleted Casting Time/Range/
Components/Duration block (`popoverHtml()` in `app.js` now takes a `stats`
array, rendered as `dl`/`dt`/`dd` — CSS for this was already sitting
unused in `style.css`), the full body text, the bolded higher-level
paragraph, and the TL;DR **last** — full text is explicitly before the
TL;DR now, per the user's request (it turned out the DOM order already had
this right in the previous pass; the popover just didn't have "full text"
worth ordering yet). The popover also widened from 360px to
`min(440px, 100vw - 32px)` to fit real prose.

**Two real code bugs, found by testing this rather than trusting the
diff:**
- **Warlock spells were entirely unpickable** — `maxSpellLevelFor()` only
  handled `caster.type` of `"full"`/`"half"`/`"third"`; Warlock's Pact
  Magic caster type is `"pact"`, which fell through to `return 0`, making
  every spell look one level too high to ever be eligible. Fixed by
  reading `PACT_MAGIC[level].level` for that type, the same table
  `pactMagic()` already used elsewhere.
- **`cantripScaleNote` was being silently discarded** for the three
  cantrips that need it: `spellScalingNote()` checked `noCantripScale`
  *before* checking for a custom note, so Eldritch Blast's real "adds a
  beam" text never rendered — the TL;DR just went straight to the plain
  damage line. Fixed by checking `cantripScaleNote` first; it always wins
  when present.

Verified all of this live in a real browser: a Warlock can now pick
cantrips and a full 4-spell known list at level 3; the Witch Bolt and
Eldritch Blast popovers were read back in full to confirm the new
stat-block-then-TL;DR layout and the corrected scaling notes; `spellsForList`
was queried directly to confirm Elementalism is present and the four fake
cantrips are gone.

**Still true, unchanged**: coverage is cantrips + level-1 spells only.
Nothing here expanded which spells exist — this pass was entirely about
making the ones that DO exist actually correct, sourced from the real book
instead of general knowledge.

### Done — Wizard's "spells learned another way" (user follow-up)

Two more pieces of user feedback after the PHB spell rebuild:

1. *"give the other classes that can swap spells on level up. I see bard can
   do it but warlock can[not]."* Checked this directly rather than assuming:
   `swapOnLevel: true` was already set in the data for every "list"-mode
   caster (Bard, Ranger, Sorcerer, Warlock, and the Eldritch
   Knight/Arcane Trickster subclasses) — `permanentGrowthWalkthrough()` in
   `js/app.js` renders the same swap control for all of them off the same
   `w.swapOnLevel` flag, with no class-specific branching. Built a real level
   4 Warlock through the live UI (localStorage-seeded to skip the click-walk,
   then driven for real) and confirmed the swap dropdowns render and work
   identically to Bard at levels 2–4. The Warlock-specific bug the user was
   actually hitting was the Pact Magic `maxSpellLevelFor` bug fixed earlier
   this session (see above) — that made the whole spell pool empty, which
   would have made swapping look broken too, for the same root cause as
   "can't pick warlock spells." No further code change was needed here.

2. *"for wizard create a separate section for spells learned with a free
   choice of all spells."* This one was real: the Wizard's spellbook only
   ever had the fixed per-level growth (6 at level 1, +2/level) with no way
   to represent spells copied in later from a scroll or another wizard's
   book — a real, uncapped RAW mechanic. Added a third array,
   `spellPicks[i].extra`, alongside `known`/`spellbook`/`prepared`
   (`js/rules.js` `pickEntry()`, `js/state.js` `migrate()` for old saves).
   `js/app.js` gained `copiedSpellPicker()`, rendered as its own "Spells
   learned another way" section between the per-level growth walkthrough and
   the daily "prepared today" picker, for any `prepMode === "spellbook"`
   caster (Wizard today, data-driven for whatever else might use that mode
   later) — an uncapped, freely-toggled chip list over the same full-level
   pool the growth rows draw from, no swap, no target count, "already known"
   dupe-highlighting shared with every other picker via `allKnownSpellKeys()`
   (which now also reads `.extra`). The "prepared today" pool was updated to
   union `spellbook` and `extra` together, since both live in the same
   physical book. Verified live: added Alarm via the new section, confirmed
   it immediately appeared as a pickable option in "Prepared today," and
   confirmed all four of its growth-row chips correctly flipped to the
   "already known" dupe style without being blocked.

### Done — Phase C: persistence and output
Multiple saved characters (requirement 11), JSON export/import
(requirement 10) and the printable sheet (requirement 15) all landed with
`app.js` — our own layout, never Wizards' artwork or template.

**Single-step levelling (requirement 10) is done.** Entry points: a
"Level up to N" button on the Character Sheet step, and a "Level up" button
per character in the Saved characters list. It's the "Single-step
levelling" section of `app.js`:
- `state.levelUp` holds the mode (`phase: "pick"` → choose the class,
  existing or a new multiclass; `phase: "choose"` → answer that level).
  It carries a JSON `snapshot` of the pre-level character: Cancel restores
  it, "Different class" undoes and re-picks, and the "New at X N" summary
  diffs against it (features gained, proficiency bonus, spell slots,
  per-class resource counters). It's persisted in the draft, so a refresh
  mid-level-up resumes; `saveCharacter` strips it and `doSave` refuses while
  it's open. Finish auto-saves if the character already has an id.
- Only that level's asks are shown: its HP row (+ "take the average"),
  skills for a new multiclass entry, Expertise if the owed count rose,
  class choices due/pending, subclass at 3, the feat slot `index:level`
  plus any feat slot still owed, and for spells just that class's block:
  cantrips if the count changed, `permanentGrowthWalkthrough(w, onlyLevel)`
  for this level's row and swap (falls back to the full walkthrough if
  earlier rows are short), the prepared picker for free/spellbook modes.
  Finish is gated on class/hp/feats/spells issues being empty.
- **`state.levelOrder` (new)**: real chronological level history, one class
  key per level. `R.levelLog()` reconciles it against `classes` (drops
  surplus, appends unaccounted levels grouped by class, forces the starting
  class onto character level 1), so builder edits can never desync it and
  characters without it behave exactly as before. This was necessary, not
  cosmetic: hpRolls are keyed by character level, so levelling Fighter 3 /
  Wizard 2 into Fighter 4 under the old grouped order would have shifted the
  Wizard's rolls onto different rows. Verified: that exact build lands
  Fighter 4 on character level 7 with every earlier roll intact.
- Multiclass prerequisites (`R.multiclassPrereqIssues`, 13+ in each class's
  primary ability, parsing "or"/"and" from `primary`) are shown as warnings,
  not blocks.
- **Pre-existing bug fixed along the way**: every multiclass entry was
  asked for the class's full starting skill count. 2024 multiclassing grants
  one skill for Bard/Ranger/Rogue (`multiclassSkillCount: 1` in their data)
  and none otherwise; `R.skillCountFor()` now drives both the picker and
  validation, and `migrate()` trims the surplus from older saves.

Verified live: Fighter 3 / Wizard 2 → Wizard 3 (subclass, +2 spellbook,
slots L1×3 → L1×4 L2×2, HP 45 → 52) → Fighter 4 (ASI, char level 7) →
Rogue 1 (1 skill + Expertise, Stealth +7, HP 69); Cancel restores exactly;
refresh mid-level-up resumes; Sorcerer 1 → 2 showed only the level-2 row
and its swap offered only previously known spells; Sorcerer 2 → Cleric 1
showed Divine Order, cantrips, prepared spells and the combined slots.
No console errors; no horizontal overflow at 375 px.

Known limit: removing a non-last class in the builder still shifts
`featPicks`/`spellPicks` keyed by class index (pre-existing, unrelated to
levelling).

### Done — spells granted by feats (user request)

Feats with a `grantsSpells` block in `feats.js` now get real spell options,
checked against the PHB feat text: Magic Initiate (Cleric/Druid/Wizard: 2
cantrips + 1 level-1 spell from that list, **plus a choice of Int/Wis/Cha**
as the casting ability), Fey-Touched (Misty Step + one level-1
Divination/Enchantment), Shadow-Touched (Invisibility + one level-1
Illusion/Necromancy), Ritual Caster (level-1 Ritual spells equal to the
Proficiency Bonus), Telepathic (Detect Thoughts) and Telekinetic (Mage
Hand). Fey/Shadow/Ritual/Telepathic/Telekinetic cast with the ability the
feat raised (`abilityBumps`).

- Rules: `R.featSpellGrants()` (one entry per feat slot, anchored to the
  class level whose slot took it; Origin feats anchor to the starting class
  at level 1), `R.featSpellIssues()` (folded into `spellStepIssues`, so the
  Spells step gates on them), and `allKnownSpellKeys` includes them. Picks
  live on the feat's own pick (`featPicks[slot].spellPicks[pickId]`,
  `.spellAbility`), so changing the feat clears them.
- Placement, per the user: in the **Spells step, at the same level as the
  slot that granted it**. Inside the class's growth walkthrough row (e.g.
  directly under "Level 4 — pick 1 new" for a Sorcerer who took
  Shadow-Touched at 4); at the end of the class block under a "Level N"
  head for prepare-from-the-whole-list classes; in a "Spells from feats"
  box for non-casters. `renderedGrants` in `app.js` prevents double
  rendering. Level-up mode shows the same blocks for the feat taken that
  level. The sheet lists each feat's spells with their own DC/attack.
- Misty Step, Invisibility and Detect Thoughts were added to `spells.js`
  from the PHB with `grantedOnly: true`, which keeps them out of class
  pools until level 2 is transcribed in full. **Remove the flag in Phase D.**
- Feat text corrected against the PHB: Magic Initiate's ability is a
  choice (was hard-coded); **Spell Sniper grants no cantrip in 2024** (the
  old text said it did); Ritual Caster scales with Proficiency Bonus.
- Noticed, not fixed: the level-1 data has 49 spells and is missing some
  2024 level-1 spells (e.g. Ray of Sickness), so school/ritual pools for
  these feats are slightly short. Fold into the Phase D transcription pass.

### Done — every cantrip, level 1 and level 2 spell (Phase D, part 1)

`spells.js` now holds all 161 PHB spells at levels 0-2 (34 + 64 + 63),
generated from the PDF rather than typed: 80 were new (5 cantrips incl.
Toll the Dead / Starry Wisp / Sorcerous Burst, 15 level-1 incl. Ray of
Sickness / Hex / the smites, 60 level-2), and **every existing entry's book
fields were replaced with the PDF's** — the comparison showed the earlier
"full text" pass had in fact abridged several (Elementalism, Find Familiar,
Tenser's Floating Disk, Silent Image, Unseen Servant…) and had real errors:
Color Spray was missing Bard, Acid Splash is Evocation in 2024 (not
Conjuration), Chill Touch's range is Touch, Elementalism's duration is
Instantaneous, and ranges are just "Self" (the area is in the text).
Hand-written TL;DR fields (roll/save/damage/effect/scaling and the cantrip
notes) were kept for existing spells; new spells get auto-derived roll,
save and damage (with a small override table) plus a hand-written `effect`
line each. `ritual` now comes from the casting time; the TL;DR derives
"requires Concentration" from the duration. `grantedOnly` is gone.

**Pipeline (reuse for levels 3-9)**, scripts in `tools/`, run from the
scratchpad with Git Bash's perl:
1. `pdftotext -enc UTF-8 <PHB.pdf> phb-raw.txt` (raw mode — paragraphs stay
   on one line; `-enc UTF-8` matters, the default is Latin-1).
2. `perl parse-spells.pl phb-raw.txt > spells.jsonl` — all 391 spells.
3. Filter the levels wanted into `low.jsonl` (`grep '"level": [012],'`), then
   `perl prep.pl low.jsonl js/data/spells.js normalized.json`.
4. `perl gen.pl normalized.json js/data/spells.js > new-spells.js`; add an
   `%EFFECT` line for every new spell (it warns about missing ones) and
   `%DAMAGE` overrides where the regex misreads damage.
5. Check: `perl lists.pl` (needs `pdftotext -layout -enc UTF-8 … phb8.txt`)
   compares every class's "Level N <Class> Spells" table with the spell
   headers — all 22 class/level lists at 0-2 match exactly. `perl ligs.pl`
   finds words whose fi/fl/ff ligature the PDF dropped (only "rst" → "first"
   at these levels; `fixText` in gen.pl repairs known ones).
Known PDF quirks: stat blocks of summon spells run into the higher-level
paragraph (moved back into the text), tables flatten (Augury's rewritten by
hand), picture captions leak as "↑ NAME", and two level-3+/6 spells (Phantom
Steed, Summon Fiend) have a caption inside their header line — fix those
when doing level 3+. (Done: parse-spells.pl now strips it.)

### Done — spell levels 3-9 (Phase D, part 2): all 391 PHB spells

Same pipeline, run over the whole book: 230 new spells (52 / 41 / 48 / 34
/ 21 / 18 / 16 at levels 3-9). Levels 0-2 regenerated byte-identical apart
from two corrected effect lines (Cordon of Arrows' die, Dragon's Breath's
half damage).

- Effect lines for levels 3-9 live in `tools/effects-hi.pl`, loaded by
  gen.pl; gen.pl's `%EFFECT` table now always wins over an existing entry's
  effect, so fixes made there propagate. Run gen.pl from the directory
  holding effects-hi.pl.
- `tools/check-effects.pl new-spells.js` cross-checks hand-written effects
  against book text ("Half damage on a success" must match "half as much";
  every dice expression in an effect must appear in the text). Clean.
- `%DAMAGE` overrides cover incidental damage the regex grabbed (Wish's
  stress, Teleport's mishap, Dimension Door, Contact Other Plane, Meld into
  Stone, summon stat-block attacks → null) and multi-type damage (Flame
  Strike, Ice Storm, Meteor Swarm, Destructive Wave, Jallarzi's, Spirit
  Guardians, the Prismatics, Symbol, Fire Shield, Bestow Curse).
- Flattened tables restated by hand in `fixText`: Confusion, Control
  Weather, Creation, Divine Word, Reincarnate, Scrying, Teleport (its column
  values were scrambled in the raw extract and were re-read from the layout
  extract). Prismatic Spray/Wall and Glyph of Warding already read fine.
- Animate Objects' stat block was after its higher-level sentence; moved
  into the text like the other summons. More dropped ligatures repaired:
  "eff ects", "up to ve".
- `lists.pl all.json` across levels 0-9: every class/level table matches.
  Its six remaining flags are matcher false positives ("Divination" is also
  a school name in the tables, "Commune" matches inside "Commune with
  Nature", and Paladin/Ranger L5 regions run past the table end) — checked
  by hand against the Paladin L5 table.
- Verified live: a Wizard 17's level-17 row groups 31/39/32/29/29/22/15/13/12
  spells by level 1-9; Teleport/Confusion/Fireball/Summon Undead tooltips
  render correctly; no console errors.

### Done — validation against the PHB and dnd2024.wikidot.com

Scripts in `tools/`; wikidot pages are fetched with curl (`spell:all`, then
one `spell:<slug>` page each, 0.4 s apart; some possessives slug as
"melfs-…", others as "leomund-s-…").
- `phb-presence-check.pl phb8.txt js/data/spells.js` — independent of the
  parser (uses the layout extract): 391 chapter-7 description headers, all
  ours with matching levels; all 391 of ours appear on a class spell table.
- `wikidot-check.pl all.html js/data/spells.js` — all 391 found on wikidot
  (which has 456: the 65 extra are other books, fine). Level, school, class
  lists, casting time, range, duration match for every spell. Components
  match; the 10 cost-marker disagreements are wikidot's, confirmed in the
  PHB (Acid Splash marked costly, Find the Path marked consumed, Gentle
  Repose's consumed 2 CP not marked, cheap costs like Guards and Wards'
  10 GP unmarked). Befuddlement's "Instantanous" is a wikidot typo.
- `wikidot-text-check.pl <pages> js/data/spells.js` — word-level LCS diff of
  every description: 360/391 identical. The rest: our readable rewrites of
  7 tables + 2 PHB typos fixed (expected), stat-block formatting (AC vs
  Armor Class; `statblock-number-check.pl` confirms every number matches,
  except Animate Objects' CHA 1 (−5), where wikidot's "−1" is wrong), and
  the errata group below.
- **Real bugs this found and fixed**: the parser's caption filter was
  deleting all-caps stat-block rows ("STR 13 DEX 16 CON 14") from all 12
  summon/animate stat blocks; page-header timestamps start with a form feed
  (now stripped); another dropped ligature ("rst" anywhere → "first", Word of
  Recall); six dropped hyphens ("40foot" → "40-foot").
- After applying the official errata (see the errata log below): 366/391
  identical. Of the rest, only two aren't explained by our own table
  rewrites/typo fixes or stat-block formatting: **Sorcerous Burst** (wikidot
  "ranged spell attack", PHB "ranged attack roll") and **Polymorph** (wikidot
  adds "(see appendix B for a sample of Beast stat blocks)" and an "a").
  Neither is in the official errata, so the PHB wording stands — wikidot
  carries some unofficial edits, so it is NOT an errata source on its own.

## Errata log (official) — check this when touching any listed area

**Policy (user decision):** apply official Wizards of the Coast errata over
the printed PHB. Source: "Errata — Player's Handbook (2024)", v1.0 (2025),
https://media.dndbeyond.com/compendium-images/errata/PHB-24/PHB-2024_v1.pdf
(also summarized at enworld.org/threads/d-d-2024-players-handbook-errata.712944).
Wikidot sometimes reflects errata but also has unofficial edits, so confirm
anything wikidot-only against the official document. The user's PHB PDF is a
9/8/24 D&D Beyond copy that already includes *some* of these fixes (noted
below) — always check the PDF text before assuming it's pre-errata. When the
errata document gets a new version, re-download it and diff against this list.

| Area | Erratum | Status |
|---|---|---|
| Goliath, Powerful Build (p. 192) | Advantage on ability **checks** (not saving throws) to end Grappled | Already in our PHB copy; `species.js` summary matches |
| Grappler, Fast Wrestler (p. 204) | "Speed isn't halved" → "don't spend extra movement" to move a Grappled creature | In our PHB copy; `feats.js` summary updated to say so |
| Poisoner, Brew Poison (p. 206) | Poison lasts until you **deal damage** with the item, not until you hit | In our PHB copy; `feats.js` summary now states the duration |
| Telekinetic, Minor Telekinesis (p. 208) | Mage Hand's range **and** its distance from you both +30 ft. | In our PHB copy; `feats.js` summary now says both |
| Armor table, Shield (p. 219) | Shield row reads "Shield (Utilize Action to Don or Doff)" | In our PHB copy. **Relevant later:** when equipment tables are built (Phase D), show the Utilize-action don/doff for shields |
| Animal Shapes, Polymorph, Shapechange, True Polymorph | Temporary Hit Points vanish when the spell ends; reworded HP clauses | **Applied** in `tools/gen.pl` `@ERRATA` (exact find/replace, dies if PHB text moves) |
| Conjure Elemental, Conjure Minor Elementals | Upcast +1d8 (was 2d8) | **Applied** (gen.pl) |
| Conjure Fey | Upcast +1d12 (was 2d12) | **Applied** (gen.pl) |
| Conjure Woodland Beings | Upcast "above 4" (was "above 5") | Already in our PHB copy |
| Giant Insect | HP "+10 for each spell level above 4" | Already in our PHB copy |
| Appendix B, all creature stat blocks (pp. 346-359) | Replaced with the Monster Manual (2025) versions | **Relevant later:** any feature that shows Beast/creature stats — Druid Wild Shape forms, Find Familiar / Find Steed / Animate Dead creatures, Polymorph targets, Ranger beast companion. Source those stat blocks from the MM 2025 (the user's MM PDF is in the same Downloads folder), not the PHB's appendix B |
| Rules Glossary, Grappling (p. 367) | "Escaping a Grapple" → "Ending a Grapple", plus: the grappler can release the target at any time (no action) | Our PHB copy is still pre-errata here. **Relevant later:** if a rules glossary / condition tooltips are added, use the errata wording |
| Rules Glossary, Hide [Action] (p. 368) | Invisible only "while hidden"; "The condition ends on you" → "You stop being hidden" | Our PHB copy is still pre-errata here. **Relevant later:** same as Grappling — and any class feature text that references hiding (Rogue Cunning Action, etc.) |

The DMG and Monster Manual (2025) have their own errata documents on D&D
Beyond; not relevant yet (this builder doesn't use DMG/MM content) — check
them if Wild Shape forms, familiars, or magic items are ever added.

**Gap noticed, not built**: Warlock Mystic Arcanum (`mysticArcanum` in
warlock.js: one level 6/7/8/9 spell at Warlock 11/13/15/17) has data but no
picker — Pact Magic caps the Warlock pool at level 5, so those spells can't
be chosen yet.

### Then — Phase D: depth
Warlock Mystic Arcanum picker (above), full subclass features at every
level, full equipment tables, more species-adjacent polish (the
Medium-or-Small size choice noted earlier). Class by class.

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
