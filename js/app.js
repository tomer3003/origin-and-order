/* Origin & Order — UI layer.

   ── The scroll-jump fix (requirement 14) ─────────────────────────────────
   The old single-file build had one `renderAll()` that ended with
   `window.scrollTo({top:0})`. Every chip, radio and select handler called it,
   so picking a skill threw you back to the top of the page. That is fixed
   here by splitting redraw from navigation:

     rerender()    redraws tracker + panel + sheet and NEVER scrolls.
     goToStep(i)   changes step, redraws, and THEN scrolls to the top.

   Every option handler calls rerender(). Only Back, Continue and the step
   tracker call goToStep(). Nothing else in this file is allowed to scroll.
   ─────────────────────────────────────────────────────────────────────────── */

import { ABILS, ABIL_NAME, ABIL_ABBR, SKILLS, ALL_SKILL_KEYS, ALIGNMENTS, ARMOR,
         STANDARD_ARRAY, PB_COST, PB_BUDGET, FIGHTING_STYLES, FIGHTING_STYLE_OPTIONS,
         SIZES } from "./data/core.js";
import { CLASSES } from "./data/classes/index.js";
import { SPECIES, SPECIES_KEYS } from "./data/species.js";
import { BACKGROUNDS, BACKGROUND_KEYS } from "./data/backgrounds.js";
import { FEATS } from "./data/feats.js";
import { SPELLS } from "./data/spells.js";
import * as R from "./rules.js";
import { STEPS, STEP_LABEL, defaultState, newClassEntry, loadDraft, saveDraft,
         clearDraft, loadIndex, saveCharacter, loadCharacter, deleteCharacter,
         exportCharacter, parseImported } from "./state.js";

let state = loadDraft();

/* ---------------- Tiny DOM helpers ---------------- */

function h(tag, attrs, ...kids) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "dataset") Object.assign(node.dataset, v);
      else node.setAttribute(k, v === true ? "" : String(v));
    });
  }
  kids.flat().forEach((kid) => {
    if (kid == null || kid === false) return;
    node.appendChild(typeof kid === "string" || typeof kid === "number"
      ? document.createTextNode(String(kid)) : kid);
  });
  return node;
}

function byId(id) { return document.getElementById(id); }

/* ---------------- Hover tooltips (requirements 7, 13) ----------------

   One shared floating element, positioned next to whatever triggered it.
   `pointer-events:none` in CSS means we only ever need to react to the
   trigger's own mouseenter/mouseleave/focus/blur — never the popover's. */

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function popoverNode() {
  let el = byId("popover");
  if (!el) {
    el = h("div", { id: "popover", class: "popover" });
    el.hidden = true;
    document.body.appendChild(el);
  }
  return el;
}

function showTooltip(anchor, html) {
  const pop = popoverNode();
  pop.innerHTML = html;
  pop.hidden = false;
  const r = anchor.getBoundingClientRect();
  pop.style.left = (r.left + window.scrollX) + "px";
  pop.style.top = (r.bottom + window.scrollY + 8) + "px";
  requestAnimationFrame(() => {
    const pr = pop.getBoundingClientRect();
    const maxLeft = window.scrollX + document.documentElement.clientWidth - pr.width - 8;
    let left = r.left + window.scrollX;
    if (left > maxLeft) left = Math.max(8, maxLeft);
    let top = r.bottom + window.scrollY + 8;
    const maxTop = window.scrollY + document.documentElement.clientHeight - pr.height - 8;
    if (top > maxTop) top = Math.max(8, r.top + window.scrollY - pr.height - 8);
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  });
}

function hideTooltip() {
  const pop = byId("popover");
  if (pop) pop.hidden = true;
}

/* Spread onto any h(...) attrs to make that element a hover/focus trigger.
   `buildHtml` is called lazily, on first hover, not at render time. */
function tooltipTrigger(buildHtml) {
  return {
    tabIndex: 0,
    onmouseenter: (e) => showTooltip(e.currentTarget, buildHtml()),
    onmouseleave: hideTooltip,
    onfocus: (e) => showTooltip(e.currentTarget, buildHtml()),
    onblur: hideTooltip
  };
}

/* `stats` is an optional list of {label, value} pairs rendered as a
   bulleted mini stat-block (Casting Time / Range / Components / Duration)
   between the meta line and the full body text — matching the book's own
   layout. `higherLevel`, when present, is shown as its own bolded
   paragraph ("Using a Higher-Level Spell Slot." / "Cantrip Upgrade.")
   AFTER the full body and BEFORE the TL;DR, same order as the book. */
function popoverHtml({ name, meta, stats, body, higherLevelLabel, higherLevel, tldr }) {
  const statsHtml = stats && stats.length
    ? `<dl>${stats.map((s) => `<dt>${escapeHtml(s.label)}</dt><dd>${escapeHtml(s.value)}</dd>`).join("")}</dl>`
    : "";
  const higherHtml = higherLevel
    ? `<div class="pop-higher"><b>${escapeHtml(higherLevelLabel || "Using a Higher-Level Spell Slot.")}</b> ${escapeHtml(higherLevel)}</div>`
    : "";
  return `<h5>${escapeHtml(name)}</h5>` +
    (meta ? `<div class="pop-meta">${escapeHtml(meta)}</div>` : "") +
    statsHtml +
    `<div class="pop-body">${escapeHtml(body)}</div>` +
    higherHtml +
    (tldr ? `<div class="pop-tldr"><b>TL;DR</b><div>${escapeHtml(tldr)}</div></div>` : "");
}

/* A short, structured summary of what a feat actually grants, separate from
   its prose description — the "roll type / effect" TL;DR the spell popover
   will use the same pattern for once spells exist. */
function featTLDR(feat) {
  const bits = [];
  if (feat.asi) {
    bits.push("+2 to one ability score, or +1 to two different scores (max 20 each)");
  } else if (feat.abilityChoice) {
    const cap = feat.category === "boon" ? 30 : 20;
    const which = feat.abilityChoice === "any"
      ? "any one ability score"
      : feat.abilityChoice.map((a) => ABIL_NAME[a]).join(" or ");
    bits.push(`+1 to ${which} (max ${cap})`);
  }
  if (feat.tiesSaveProf) bits.push("saving throw proficiency in that same ability");
  if (feat.skillChoiceFrom) bits.push(`proficiency in one of ${feat.skillChoiceFrom.map((s) => SKILLS[s].name).join(", ")}`);
  if (feat.skillChoiceAny) bits.push(`proficiency in ${feat.skillChoiceAny} skill${feat.skillChoiceAny > 1 ? "s" : ""} of your choice`);
  if (feat.expertiseChoiceAny) bits.push(`Expertise in ${feat.expertiseChoiceAny} skill you're already proficient in`);
  if (feat.hpBonusPerLevel) bits.push(`Hit Point maximum +${feat.hpBonusPerLevel * 2} the level you take this, then +${feat.hpBonusPerLevel} every level after`);
  if (feat.hpBonusFlat) bits.push(`+${feat.hpBonusFlat} Hit Point maximum (fixed, doesn't grow with level)`);
  if (feat.repeatable) bits.push("can be taken more than once");
  if (/Proficiency Bonus/.test(feat.text)) {
    bits.push("scales with your Proficiency Bonus, which rises at character levels 5, 9, 13, and 17");
  }
  return bits.length ? bits.join("; ") + "." : "No ability score, skill, or resource choice attached; doesn't change with level.";
}

function featPopoverHtml(feat) {
  const category = feat.category === "origin" ? "Origin Feat"
    : feat.category === "boon" ? "Epic Boon Feat" : "General Feat";
  const meta = [category, feat.prereq ? `Prereq: ${feat.prereq}` : null].filter(Boolean).join(" · ");
  return popoverHtml({ name: feat.name, meta, body: feat.text, tldr: featTLDR(feat) });
}

/* A structured "what kind of roll, what damage, what else" line for a
   spell, same idea as featTLDR — built from the spell's own roll/damage/
   effect fields rather than re-parsing its prose. */
function spellTLDR(spell) {
  const bits = [];
  if (spell.roll === "attack") bits.push("Spell attack roll");
  else if (spell.roll === "save") bits.push(`Target makes a ${ABIL_NAME[spell.saveAbility]} saving throw against your spell DC`);
  else bits.push("No attack roll or save");
  if (spell.damage) bits.push(spell.damage);
  if (spell.effect) bits.push(spell.effect);
  if (spell.concentration) bits.push("requires Concentration");
  bits.push(spellScalingNote(spell));
  return bits.filter(Boolean).map((b) => b.replace(/\.$/, "")).join(" — ") + ".";
}

/* How this spell changes with a higher character level (cantrips) or a
   higher-level slot (level 1+) — always stated explicitly, never left
   implicit, including saying so when a spell simply doesn't scale. */
function spellScalingNote(spell) {
  if (spell.level === 0) {
    /* A custom note always wins — it exists specifically because the
       default "bigger die" rule doesn't describe what this cantrip does
       (Eldritch Blast adds beams, Shillelagh grows its die, Spare the
       Dying's range doubles, True Strike adds a separate damage type). */
    if (spell.cantripScaleNote) return spell.cantripScaleNote;
    if (spell.noCantripScale || !spell.damage) return null;
    return "Damage gains one die at character levels 5, 11, and 17 (2 dice at 5th, 3 at 11th, 4 at 17th)";
  }
  return spell.scaling || "No change when cast with a higher-level slot beyond what the slot itself allows";
}

/* The book's own italic subhead style: "Level 1 Evocation (Sorcerer,
   Wizard)" or "Evocation Cantrip (Warlock)". */
function spellMetaLine(spell) {
  const classList = spell.classes.map((k) => (CLASSES[k] && CLASSES[k].name) || k).join(", ");
  const levelSchool = spell.level === 0
    ? `${spell.school} Cantrip`
    : `Level ${spell.level} ${spell.school}`;
  return `${levelSchool} (${classList})${spell.ritual ? " — Ritual" : ""}`;
}

function spellPopoverHtml(spell) {
  const stats = [
    { label: "Casting Time", value: spell.time },
    { label: "Range", value: spell.range },
    { label: "Components", value: spell.components },
    { label: "Duration", value: spell.duration }
  ];
  return popoverHtml({
    name: spell.name,
    meta: spellMetaLine(spell),
    stats,
    body: spell.text,
    higherLevelLabel: spell.level === 0 ? "Cantrip Upgrade." : "Using a Higher-Level Spell Slot.",
    higherLevel: spell.higherLevel,
    tldr: spellTLDR(spell)
  });
}

/* A spell name as a hoverable/focusable tooltip trigger, everywhere a spell
   is shown — the picker, the known/prepared lists, the sheet. */
function spellNameEl(key, extraClass) {
  const spell = SPELLS[key];
  if (!spell) return h("span", { text: key });
  return h("b", {
    class: `pop-trigger${extraClass ? " " + extraClass : ""}`,
    text: spell.name,
    ...tooltipTrigger(() => spellPopoverHtml(spell))
  });
}

/* ---------------- Redraw vs navigate ---------------- */

/* Redraw in place. Never scrolls. Call this from every option handler.

   Two things are needed to actually hold the scroll position, and the first
   one is easy to miss: emptying a container before refilling it collapses the
   document height, at which point the browser clamps scrollY to the new
   (tiny) maximum. Refilling afterwards does not undo that clamp, so the page
   appears to jump to the top even though nothing ever called scrollTo. So we
   build each subtree detached and swap it in with replaceChildren, which is a
   single atomic mutation — the document is never short. The explicit restore
   below is then just a safety net for the cases where the new panel really is
   shorter than the old scroll offset. */
function rerender() {
  saveDraft(state);
  const y = window.scrollY;
  renderTracker();
  renderStepPanel();
  renderSidebar();
  if (window.scrollY !== y) window.scrollTo({ top: y, behavior: "instant" });
}

/* Build children into a detached fragment, then swap them in atomically. */
function swapChildren(host, build) {
  const frag = document.createDocumentFragment();
  build(frag);
  host.replaceChildren(...frag.childNodes);
}

/* Change step, redraw, then scroll. The ONLY thing that scrolls. */
function goToStep(index) {
  const clamped = Math.max(0, Math.min(STEPS.length - 1, index));
  state.step = clamped;
  rerender();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- Step validation ---------------- */

function stepIssues(key) {
  switch (key) {
    case "class":      return R.classStepIssues(state);
    case "species":    return state.speciesKey ? speciesIssues() : ["Choose a species."];
    case "background": return state.backgroundKey ? [] : ["Choose a background."];
    case "abilities":  return R.abilityStepIssues(state);
    case "hp":         return R.hpStepIssues(state);
    case "feats":      return R.featStepIssues(state);
    case "spells":     return R.spellStepIssues(state);
    case "identity":   return state.alignment ? [] : ["Choose an alignment."];
    default:           return [];
  }
}

function speciesIssues() {
  const sp = SPECIES[state.speciesKey];
  const issues = [];
  if (!sp) return ["Choose a species."];
  if (sp.lineageChoice && !state.speciesLineage) issues.push(`Choose a ${sp.lineageLabel}.`);
  const want = (sp.grantsSkillChoice || 0) + (sp.skillChoiceFrom ? 1 : 0);
  const got = (state.speciesSkills || []).filter(Boolean).length;
  if (want && got !== want) {
    issues.push(`Choose ${want} skill${want === 1 ? "" : "s"} from your species traits.`);
  }
  return issues;
}

function stepValid(key) { return stepIssues(key).length === 0; }

/* The furthest step the player has legitimately unlocked. */
function furthestUnlocked() {
  for (let i = 0; i < STEPS.length; i++) {
    if (!stepValid(STEPS[i])) return i;
  }
  return STEPS.length - 1;
}

/* ---------------- Tracker ---------------- */

function renderTracker() {
  swapChildren(byId("tracker"), buildTracker);
}

function buildTracker(host) {
  const unlocked = furthestUnlocked();
  STEPS.forEach((key, i) => {
    const done = i < unlocked;
    const active = i === state.step;
    const locked = i > unlocked;
    const btn = h("button", {
      class: `tstep${done ? " done" : ""}${active ? " active" : ""}${locked ? " locked" : ""}`,
      type: "button",
      disabled: locked,
      "aria-current": active ? "step" : null,
      onclick: () => { if (!locked) goToStep(i); }
    },
      h("span", { class: "step-num", text: done ? "✓" : String(i + 1) }),
      h("span", { class: "tstep-label", text: STEP_LABEL[key] })
    );
    host.appendChild(btn);
  });
}

/* ---------------- Step panel ---------------- */

const BUILDERS = {
  class: buildClassStep,
  species: buildSpeciesStep,
  background: buildBackgroundStep,
  abilities: buildAbilitiesStep,
  hp: buildHpStep,
  feats: buildFeatsStep,
  spells: buildSpellsStep,
  identity: buildIdentityStep,
  sheet: buildSheetStep
};

function renderStepPanel() {
  swapChildren(byId("stepPanel"), (panel) => {
    const key = STEPS[state.step];
    BUILDERS[key](panel);
    panel.appendChild(navRow(key));
  });
}

function navRow(key) {
  const issues = stepIssues(key);
  const isLast = state.step === STEPS.length - 1;
  const row = h("div", { class: "stepnav noprint" },
    h("button", {
      class: "btn ghost", type: "button", disabled: state.step === 0,
      onclick: () => goToStep(state.step - 1)
    }, "Back"),
    h("div", { style: "flex:1" }),
    isLast ? null : h("button", {
      class: "btn primary", type: "button", disabled: issues.length > 0,
      title: issues.length ? issues.join(" ") : null,
      onclick: () => goToStep(state.step + 1)
    }, "Continue")
  );
  return row;
}

function issueList(key) {
  const issues = stepIssues(key);
  if (!issues.length) return null;
  return h("ul", { class: "feat-list", style: "margin-top:10px" },
    issues.map((t) => h("li", { class: "warn", text: t })));
}

/* =======================================================================
   Step 1 — Classes & Levels (requirements 2 and 5)
   ======================================================================= */

function buildClassStep(panel) {
  panel.appendChild(h("h2", { text: "Classes & Levels" }));
  panel.appendChild(h("p", { class: "lede", text:
    "Pick a class and how many levels you have in it. Add more classes to multiclass — your total level is capped at 20. The first class in the list is the one you started in, which is the one that sets your level-1 hit points and your saving throw proficiencies." }));

  const entries = R.classEntries(state);

  if (entries.length === 0) {
    panel.appendChild(classPicker("Choose your starting class"));
  } else {
    panel.appendChild(classRows(entries));
    panel.appendChild(levelTotal());

    const remaining = R.availableClassKeys(state);
    const atCap = R.totalLevel(state) >= R.MAX_LEVEL;
    if (state.addingClass) {
      panel.appendChild(classPicker("Add an additional class", true));
    } else if (remaining.length && !atCap) {
      panel.appendChild(h("div", { class: "hp-actions" },
        h("button", {
          class: "btn small", type: "button",
          onclick: () => { state.addingClass = true; rerender(); }
        }, "+ Add additional class")));
    } else if (atCap) {
      panel.appendChild(h("div", { class: "callout warnbox", text:
        "You are at total level 20 — drop a level somewhere before adding another class." }));
    }

    entries.forEach((entry, index) => panel.appendChild(classDetail(entry, index)));
  }

  const issues = issueList("class");
  if (issues) panel.appendChild(issues);
}

/* The card grid. Classes already taken are greyed out, per requirement 5. */
function classPicker(heading, isAdditional) {
  const taken = new Set(R.classEntries(state).map((c) => c.key));
  const wrap = h("div", {},
    h("h4", { text: heading }),
    h("div", { class: "grid-cards" },
      Object.entries(CLASSES).map(([key, cls]) => {
        const already = taken.has(key);
        return h("button", {
          class: `ccard${already ? " disabled" : ""}`,
          type: "button",
          disabled: already,
          title: already ? "Already in this build" : null,
          onclick: () => {
            if (already) return;
            state.classes.push(newClassEntry(key));
            state.addingClass = false;
            rerender();
          }
        },
          h("span", { class: "cname", text: cls.name }),
          h("span", { class: "cmeta", text: cls.tagline }),
          h("span", { class: "ctag", text: `d${cls.hitDie} · ${cls.primary}` }),
          already ? h("span", { class: "cmeta", text: "Already taken" }) : null
        );
      })
    )
  );
  if (isAdditional) {
    wrap.appendChild(h("div", { class: "hp-actions" },
      h("button", { class: "btn small ghost", type: "button",
        onclick: () => { state.addingClass = false; rerender(); } }, "Cancel")));
  }
  return wrap;
}

function classRows(entries) {
  const total = R.totalLevel(state);
  return h("div", { class: "class-rows" },
    entries.map((entry, index) => {
      const cls = CLASSES[entry.key];
      /* A row may be raised only as far as the level-20 cap allows. */
      const headroom = R.MAX_LEVEL - (total - (entry.levels || 0));
      const options = [];
      for (let n = 1; n <= Math.min(R.MAX_LEVEL, headroom); n++) options.push(n);

      return h("div", { class: "class-row" },
        h("span", { class: "crname" }, cls.name,
          index === 0 ? h("span", { class: "crfirst", text: " · starting class" }) : null),
        h("label", { class: "chip-select" },
          h("span", { class: "hint", text: "Levels" }),
          h("select", {
            "aria-label": `${cls.name} levels`,
            onchange: (e) => {
              entry.levels = Number(e.target.value);
              pruneEntry(entry);
              rerender();
            }
          }, options.map((n) => h("option", { value: n, selected: n === entry.levels }, String(n))))
        ),
        index > 0 ? h("button", {
          class: "btn small ghost", type: "button",
          onclick: () => { state.classes.splice(index, 1); rerender(); }
        }, "Remove") : null,
        index > 0 ? h("button", {
          class: "btn small ghost", type: "button",
          title: "Make this the class you started in",
          onclick: () => {
            const [moved] = state.classes.splice(index, 1);
            state.classes.unshift(moved);
            rerender();
          }
        }, "Make starting class") : null,
        h("span", { class: "crsub", text: subclassSummary(entry, cls) })
      );
    })
  );
}

function levelTotal() {
  const total = R.totalLevel(state);
  const over = total > R.MAX_LEVEL;
  return h("div", { class: "level-total" },
    h("span", { class: "lt-num", text: String(total) }),
    h("span", { class: "lt-label", text: over
      ? `total level — over the cap of ${R.MAX_LEVEL}`
      : `total level · proficiency bonus ${R.fmtMod(R.profBonus(total))}` })
  );
}

function subclassSummary(entry, cls) {
  const bits = [];
  if ((entry.levels || 0) >= cls.subclassLevel) {
    bits.push(entry.subclass
      ? cls.subclasses[entry.subclass].name
      : `${cls.subclassLabel} not chosen`);
  }
  if (cls.caster) bits.push(`${cls.caster.type} caster`);
  return bits.join(" · ");
}

/* Dropping levels can orphan choices made at higher levels. */
function pruneEntry(entry) {
  const cls = CLASSES[entry.key];
  if (entry.subclass && (entry.levels || 0) < cls.subclassLevel) entry.subclass = null;
  (cls.choices || []).forEach((choice) => {
    if ((entry.levels || 0) < choice.level && entry.choices) delete entry.choices[choice.key];
  });
  const expWant = R.expertiseOwed(entry);
  if ((entry.expertise || []).length > expWant) entry.expertise = entry.expertise.slice(0, expWant);
  /* HP rolls past the new total level are dropped. */
  const total = R.totalLevel(state);
  Object.keys(state.hpRolls).forEach((k) => { if (Number(k) > total) delete state.hpRolls[k]; });
  /* Feat picks for levels no longer held are dropped. */
  const valid = new Set(R.featSlots(state).map((s) => s.id));
  Object.keys(state.featPicks).forEach((k) => { if (!valid.has(k)) delete state.featPicks[k]; });
}

function classDetail(entry, index) {
  const cls = CLASSES[entry.key];
  const wrap = h("div", { class: "detail" },
    h("h4", { text: `${cls.name} — level ${entry.levels}` }),
    h("div", { class: "kv-row" },
      kv("Hit Die", `d${cls.hitDie}`),
      kv("Primary", cls.primary),
      kv(index === 0 ? "Saving Throws" : "Saves (not granted)",
         cls.saves.map((s) => ABIL_NAME[s]).join(", ")),
      kv("Weapons", cls.weaponProf),
      kv("Armor", cls.armorTraining),
      cls.toolProf ? kv("Tools", cls.toolProf) : null
    )
  );

  if (index > 0) {
    wrap.appendChild(h("div", { class: "callout", text:
      `Multiclassing into ${cls.name} grants only: ${cls.multiclassGrants}.` }));
  }

  wrap.appendChild(skillFieldset(entry, cls));
  if (R.expertiseOwed(entry)) wrap.appendChild(expertiseFieldset(entry, cls));
  if (index === 0) wrap.appendChild(equipmentFieldset(entry, cls));
  else if (!entry.equipment) entry.equipment = (cls.equipment[0] || {}).key || null;

  (cls.choices || []).forEach((choice) => {
    if ((entry.levels || 0) >= choice.level) wrap.appendChild(choiceFieldset(entry, cls, choice));
  });

  if ((entry.levels || 0) >= cls.subclassLevel) wrap.appendChild(subclassFieldset(entry, cls));

  wrap.appendChild(featureSummary(entry, cls));
  return wrap;
}

function kv(k, v) {
  return h("div", { class: "kv" }, h("span", { class: "k", text: k }), h("span", { class: "v", text: v }));
}

function skillFieldset(entry, cls) {
  const options = cls.skillOptions === "any" ? ALL_SKILL_KEYS : cls.skillOptions;
  const chosen = entry.skills || [];
  const fromElsewhere = skillsFromOtherSources(entry);

  return h("fieldset", {},
    h("legend", { text: `Skills — choose ${cls.skillCount}` }),
    h("div", { class: "chip-select" },
      options.map((sk) => {
        const on = chosen.includes(sk);
        const dupe = !on && fromElsewhere.has(sk);
        const full = !on && chosen.length >= cls.skillCount;
        return h("button", {
          class: `chip${on ? " on" : ""}${dupe ? " dupe" : ""}${full ? " disabled" : ""}`,
          type: "button",
          disabled: full,
          title: dupe ? "You already have this from another source" : null,
          onclick: () => {
            if (on) entry.skills = chosen.filter((s) => s !== sk);
            else if (chosen.length < cls.skillCount) entry.skills = [...chosen, sk];
            rerender();
          }
        }, SKILLS[sk].name);
      })
    ),
    h("div", { class: "hint", text: `${chosen.length} of ${cls.skillCount} chosen. Dashed outlines mark skills you already have elsewhere — picking one wastes it.` })
  );
}

function skillsFromOtherSources(exceptEntry) {
  const set = new Set();
  R.classEntries(state).forEach((c) => {
    if (c === exceptEntry) return;
    (c.skills || []).forEach((s) => set.add(s));
  });
  const bg = BACKGROUNDS[state.backgroundKey];
  if (bg) bg.skills.forEach((s) => set.add(s));
  (state.speciesSkills || []).forEach((s) => set.add(s));
  return set;
}

function expertiseFieldset(entry, cls) {
  const want = R.expertiseOwed(entry);
  const chosen = entry.expertise || [];
  /* Expertise can only go on a skill you're actually proficient in. Wizard's
     Scholar narrows it further to six specific skills. */
  const limit = cls.expertiseLimit
    ? new Set(Object.entries(cls.expertiseLimit)
        .filter(([lvl]) => (entry.levels || 0) >= Number(lvl))
        .flatMap(([, list]) => list))
    : null;
  const eligible = [...R.proficientSkills(state)]
    .filter((s) => !limit || limit.has(s))
    .sort((a, b) => SKILLS[a].name.localeCompare(SKILLS[b].name));

  return h("fieldset", {},
    h("legend", { text: `Expertise — choose ${want}` }),
    eligible.length === 0
      ? h("div", { class: "hint", text: "Choose your skill proficiencies first, then come back for Expertise." })
      : h("div", { class: "chip-select" },
          eligible.map((sk) => {
            const on = chosen.includes(sk);
            const full = !on && chosen.length >= want;
            return h("button", {
              class: `chip${on ? " on" : ""}${full ? " disabled" : ""}`,
              type: "button",
              disabled: full,
              onclick: () => {
                if (on) entry.expertise = chosen.filter((s) => s !== sk);
                else if (chosen.length < want) entry.expertise = [...chosen, sk];
                rerender();
              }
            }, SKILLS[sk].name);
          })
        ),
    h("div", { class: "hint", text: `${chosen.length} of ${want} chosen.` })
  );
}

function equipmentFieldset(entry, cls) {
  return h("fieldset", {},
    h("legend", { text: "Starting equipment" }),
    cls.equipment.map((eq) => h("label", { class: "optrow" },
      h("input", {
        type: "radio", name: `eq-${entry.key}`, checked: entry.equipment === eq.key,
        onchange: () => { entry.equipment = eq.key; state.armorOverride = null; state.shieldOverride = null; rerender(); }
      }),
      h("span", {}, h("b", { text: eq.key + ". " }), eq.label)
    ))
  );
}

function choiceFieldset(entry, cls, choice) {
  const options = [];
  if (choice.optionsFrom) {
    (FIGHTING_STYLE_OPTIONS[choice.optionsFrom] || []).forEach((k) => {
      options.push({ key: k, name: FIGHTING_STYLES[k].name, text: FIGHTING_STYLES[k].text });
    });
  }
  (choice.options || []).forEach((o) => options.push(o));
  (choice.extraOptions || []).forEach((o) => options.push(o));

  const current = (entry.choices || {})[choice.key];
  return h("fieldset", {},
    h("legend", { text: `${choice.label} — level ${choice.level}` }),
    options.map((o) => h("label", { class: "optrow" },
      h("input", {
        type: "radio", name: `choice-${entry.key}-${choice.key}`, checked: current === o.key,
        onchange: () => {
          if (!entry.choices) entry.choices = {};
          entry.choices[choice.key] = o.key;
          rerender();
        }
      }),
      h("span", {}, h("b", { text: o.name + ". " }), o.text)
    ))
  );
}

function subclassFieldset(entry, cls) {
  const options = R.subclassChoicesFor(entry);
  return h("fieldset", {},
    h("legend", { text: `${cls.subclassLabel} — chosen at level ${cls.subclassLevel}` }),
    h("div", { class: "grid-cards" },
      options.map((sub) => h("button", {
        class: `ccard${entry.subclass === sub.key ? " selected" : ""}`,
        type: "button",
        onclick: () => { entry.subclass = sub.key; rerender(); }
      },
        h("span", { class: "cname", text: sub.name }),
        h("span", { class: "cmeta", text: sub.blurb }),
        sub.caster ? h("span", { class: "ctag", text: "adds spellcasting" }) : null
      ))
    ),
    entry.subclass ? subclassFeatureList(cls.subclasses[entry.subclass], entry.levels) : null
  );
}

function subclassFeatureList(sub, levels) {
  const rows = [];
  Object.entries(sub.features).forEach(([lvl, list]) => {
    if (Number(lvl) > levels) return;
    list.forEach((f) => rows.push({ level: Number(lvl), ...f }));
  });
  rows.sort((a, b) => a.level - b.level);
  if (!rows.length) return null;
  return h("ul", { class: "feat-list", style: "margin-top:12px" },
    rows.map((f) => h("li", {}, h("b", { text: `${f.name} (${f.level}). ` }), f.text)));
}

function featureSummary(entry, cls) {
  const group = R.featuresByClass(state).find((g) => g.classKey === entry.key);
  if (!group || !group.rows.length) return h("div", {});
  return h("div", {},
    h("h4", { text: `${cls.name} features through level ${entry.levels}` }),
    h("ul", { class: "feat-list" },
      group.rows.map((f) => {
        const label = `${f.name} (${f.level})${f.subclass ? " · " + f.subclass : ""}. `;
        const feat = f.isFeat && f.featKey ? FEATS[f.featKey] : null;
        return h("li", {},
          feat
            ? h("b", { class: "pop-trigger", text: label, ...tooltipTrigger(() => featPopoverHtml(feat)) })
            : h("b", { text: label }),
          f.pending ? h("span", { class: "warn", text: f.text }) : f.text
        );
      })
    )
  );
}

/* =======================================================================
   Step 2 — Species
   ======================================================================= */

function buildSpeciesStep(panel) {
  panel.appendChild(h("h2", { text: "Species" }));
  panel.appendChild(h("p", { class: "lede", text:
    "Species sets your size, Speed and a handful of traits. In the 2024 rules it gives no ability score bonuses — those come from your background." }));

  panel.appendChild(h("div", { class: "grid-cards" },
    SPECIES_KEYS.map((key) => {
      const sp = SPECIES[key];
      return h("button", {
        class: `ccard${state.speciesKey === key ? " selected" : ""}`,
        type: "button",
        onclick: () => {
          if (state.speciesKey !== key) {
            state.speciesKey = key;
            state.speciesLineage = null;
            state.speciesSkills = [];
          }
          rerender();
        }
      },
        h("span", { class: "cname", text: sp.name }),
        h("span", { class: "cmeta", text: sp.tagline }),
        h("span", { class: "ctag", text: `${SIZES[sp.size]} · ${sp.speed} ft.` })
      );
    })
  ));

  const sp = SPECIES[state.speciesKey];
  if (!sp) return;

  const detail = h("div", { class: "detail" },
    h("div", { class: "kv-row" },
      kv("Size", SIZES[sp.size]),
      kv("Speed", `${speciesSpeed()} ft.`)
    ),
    h("ul", { class: "feat-list" },
      sp.traits.map((t) => h("li", {}, h("b", { text: t.name + ". " }), t.text)))
  );

  if (sp.lineageChoice) {
    detail.appendChild(h("fieldset", {},
      h("legend", { text: sp.lineageLabel }),
      Object.entries(sp.lineageChoice).map(([key, opt]) => h("label", { class: "optrow" },
        h("input", {
          type: "radio", name: "lineage", checked: state.speciesLineage === key,
          onchange: () => { state.speciesLineage = key; rerender(); }
        }),
        h("span", {}, h("b", { text: opt.name + ". " }), opt.text)
      ))
    ));
  }

  if (sp.skillChoiceFrom) {
    detail.appendChild(speciesSkillPicker(sp.skillChoiceFrom.label, sp.skillChoiceFrom.options, 0));
  }
  if (sp.grantsSkillChoice) {
    detail.appendChild(speciesSkillPicker("Skillful — any one skill", ALL_SKILL_KEYS, sp.skillChoiceFrom ? 1 : 0));
  }
  if (sp.grantsOriginFeat) {
    detail.appendChild(h("div", { class: "callout", text:
      "Versatile grants an Origin feat — you'll choose it on the Feats step." }));
  }

  panel.appendChild(detail);
  const issues = issueList("species");
  if (issues) panel.appendChild(issues);
}

function speciesSpeed() {
  const sp = SPECIES[state.speciesKey];
  if (!sp) return 30;
  const lin = sp.lineageChoice && state.speciesLineage ? sp.lineageChoice[state.speciesLineage] : null;
  return (lin && lin.speed) || sp.speed;
}

/* Species skill slots are positional so two independent picks don't collide. */
function speciesSkillPicker(label, options, slot) {
  const current = (state.speciesSkills || [])[slot] || null;
  const otherSlots = (state.speciesSkills || []).filter((_, i) => i !== slot);
  return h("fieldset", {},
    h("legend", { text: label }),
    h("div", { class: "chip-select" },
      options.map((sk) => {
        const on = current === sk;
        const usedElsewhere = otherSlots.includes(sk);
        return h("button", {
          class: `chip${on ? " on" : ""}${usedElsewhere ? " disabled" : ""}`,
          type: "button",
          disabled: usedElsewhere,
          onclick: () => {
            const next = [...(state.speciesSkills || [])];
            while (next.length <= slot) next.push(null);
            next[slot] = on ? null : sk;
            /* Keep the array positional — trailing nulls are trimmed only so
               the "how many chosen" count stays honest. */
            while (next.length && next[next.length - 1] == null) next.pop();
            state.speciesSkills = next;
            rerender();
          }
        }, SKILLS[sk].name);
      })
    )
  );
}

/* =======================================================================
   Step 3 — Background
   ======================================================================= */

function buildBackgroundStep(panel) {
  panel.appendChild(h("h2", { text: "Background" }));
  panel.appendChild(h("p", { class: "lede", text:
    "Your background grants two skills, a tool, an Origin feat, starting equipment, and the three ability scores you'll distribute bonuses across on the next step." }));

  panel.appendChild(h("div", { class: "grid-cards" },
    BACKGROUND_KEYS.map((key) => {
      const bg = BACKGROUNDS[key];
      return h("button", {
        class: `ccard${state.backgroundKey === key ? " selected" : ""}`,
        type: "button",
        onclick: () => {
          if (state.backgroundKey !== key) {
            state.backgroundKey = key;
            state.bgChoices = { mode: "twoOne", abilityPicks: [null, null] };
          }
          rerender();
        }
      },
        h("span", { class: "cname", text: bg.name }),
        h("span", { class: "cmeta", text: bg.skills.map((s) => SKILLS[s].name).join(", ") }),
        h("span", { class: "ctag", text: bg.abilities.map((a) => ABIL_ABBR[a]).join(" · ") })
      );
    })
  ));

  const bg = BACKGROUNDS[state.backgroundKey];
  if (!bg) return;

  panel.appendChild(h("div", { class: "detail" },
    h("div", { class: "kv-row" },
      kv("Ability Scores", bg.abilities.map((a) => ABIL_NAME[a]).join(", ")),
      kv("Skills", bg.skills.map((s) => SKILLS[s].name).join(", ")),
      kv("Tool", bg.tool),
      kv("Origin Feat", FEATS[bg.feat] ? FEATS[bg.feat].name : bg.feat)
    ),
    h("div", { class: "callout", text: "Equipment: " + bg.equipment }),
    FEATS[bg.feat] ? h("ul", { class: "feat-list" },
      h("li", {}, h("b", { text: FEATS[bg.feat].name + ". " }), FEATS[bg.feat].text)) : null
  ));
}

/* =======================================================================
   Step 4 — Ability scores
   ======================================================================= */

function buildAbilitiesStep(panel) {
  panel.appendChild(h("h2", { text: "Ability Scores" }));
  panel.appendChild(h("p", { class: "lede", text:
    "Set your six base scores, then decide how your background's bonus is split. Feats you take later can raise them further." }));

  const methods = [
    ["standard", "Standard array (15, 14, 13, 12, 10, 8)"],
    ["pointbuy", "Point buy (27 points)"],
    ["manual", "Enter your own rolls"]
  ];
  panel.appendChild(h("div", { class: "method-toggle" },
    methods.map(([key, label]) => h("button", {
      class: `chip${state.abilityMethod === key ? " on" : ""}`,
      type: "button",
      onclick: () => {
        state.abilityMethod = key;
        ABILS.forEach((a) => { state.abilityAssign[a] = key === "pointbuy" ? 8 : null; });
        rerender();
      }
    }, label))
  ));

  if (state.abilityMethod === "pointbuy") {
    const spent = R.pointBuyCost(state.abilityAssign);
    panel.appendChild(h("div", { class: "pb-remaining" },
      h("b", { text: String(PB_BUDGET - spent) }), ` of ${PB_BUDGET} points remaining`));
  }

  panel.appendChild(abilityGrid());
  if (state.backgroundKey) panel.appendChild(backgroundBonusFieldset());

  const issues = issueList("abilities");
  if (issues) panel.appendChild(issues);
}

function abilityGrid() {
  const bgBonus = R.backgroundBonus(state);
  const featBonus = R.featAbilityBonus(state);
  const final = R.finalAbilities(state);

  return h("div", { class: "ability-grid" },
    ABILS.map((a) => {
      const card = h("div", { class: "ability-card" },
        h("div", { class: "aname", text: ABIL_NAME[a] }),
        h("div", { class: "ascore mono", text: String(final[a]) }),
        h("div", { class: "amod", text: R.fmtMod(R.mod(final[a])) })
      );

      const extras = [];
      if (bgBonus[a]) extras.push(`background ${R.fmtMod(bgBonus[a])}`);
      if (featBonus[a]) extras.push(`feats ${R.fmtMod(featBonus[a])}`);
      card.appendChild(h("div", { class: "abonus", text: extras.join(", ") }));

      card.appendChild(abilityInput(a));
      return card;
    })
  );
}

function abilityInput(a) {
  const value = state.abilityAssign[a];

  if (state.abilityMethod === "standard") {
    const remaining = R.remainingStandardValues(state);
    const options = [...new Set([...(value == null ? [] : [value]), ...remaining])]
      .sort((x, y) => y - x);
    return h("select", {
      "aria-label": `${ABIL_NAME[a]} base score`,
      onchange: (e) => {
        state.abilityAssign[a] = e.target.value === "" ? null : Number(e.target.value);
        rerender();
      }
    },
      h("option", { value: "", selected: value == null }, "—"),
      options.map((n) => h("option", { value: n, selected: n === value }, String(n)))
    );
  }

  if (state.abilityMethod === "pointbuy") {
    const current = value == null ? 8 : value;
    const spent = R.pointBuyCost(state.abilityAssign);
    const canRaise = current < 15 && (spent - (PB_COST[current] || 0) + (PB_COST[current + 1] || 0)) <= PB_BUDGET;
    return h("div", { class: "stepper" },
      h("button", {
        type: "button", disabled: current <= 8,
        "aria-label": `Lower ${ABIL_NAME[a]}`,
        onclick: () => { state.abilityAssign[a] = current - 1; rerender(); }
      }, "−"),
      h("span", { class: "mono", text: String(current) }),
      h("button", {
        type: "button", disabled: !canRaise,
        "aria-label": `Raise ${ABIL_NAME[a]}`,
        onclick: () => { state.abilityAssign[a] = current + 1; rerender(); }
      }, "+")
    );
  }

  return h("input", {
    type: "number", min: 1, max: 20, value: value == null ? "" : value,
    "aria-label": `${ABIL_NAME[a]} base score`,
    style: "width:70px; text-align:center; margin-top:6px",
    oninput: (e) => {
      const n = e.target.value === "" ? null : Number(e.target.value);
      state.abilityAssign[a] = n;
      /* A typed number must not re-render the input mid-keystroke. */
      saveDraft(state);
      renderSidebar();
    }
  });
}

function backgroundBonusFieldset() {
  const bg = BACKGROUNDS[state.backgroundKey];
  const ch = state.bgChoices;
  const wrap = h("fieldset", {},
    h("legend", { text: `${bg.name} ability bonus` }),
    h("label", { class: "optrow" },
      h("input", {
        type: "radio", name: "bgmode", checked: ch.mode !== "spread",
        onchange: () => { ch.mode = "twoOne"; rerender(); }
      }),
      h("span", {}, h("b", { text: "+2 and +1. " }), "Two of the three scores.")
    ),
    h("label", { class: "optrow" },
      h("input", {
        type: "radio", name: "bgmode", checked: ch.mode === "spread",
        onchange: () => { ch.mode = "spread"; rerender(); }
      }),
      h("span", {}, h("b", { text: "+1 to all three. " }), bg.abilities.map((a) => ABIL_NAME[a]).join(", "))
    )
  );

  if (ch.mode !== "spread") {
    const [p2, p1] = ch.abilityPicks || [];
    wrap.appendChild(h("div", { class: "kv-row", style: "margin-top:10px" },
      h("label", { class: "kv" },
        h("span", { class: "k", text: "Gets +2" }),
        h("select", {
          onchange: (e) => { ch.abilityPicks = [e.target.value || null, p1]; rerender(); }
        },
          h("option", { value: "", selected: !p2 }, "—"),
          bg.abilities.map((a) => h("option", { value: a, selected: a === p2 }, ABIL_NAME[a]))
        )
      ),
      h("label", { class: "kv" },
        h("span", { class: "k", text: "Gets +1" }),
        h("select", {
          onchange: (e) => { ch.abilityPicks = [p2, e.target.value || null]; rerender(); }
        },
          h("option", { value: "", selected: !p1 }, "—"),
          bg.abilities.filter((a) => a !== p2).map((a) => h("option", { value: a, selected: a === p1 }, ABIL_NAME[a]))
        )
      )
    ));
  }
  return wrap;
}

/* =======================================================================
   Step 5 — Hit points (requirements 4 and 6)
   ======================================================================= */

function buildHpStep(panel) {
  panel.appendChild(h("h2", { text: "Hit Points" }));
  panel.appendChild(h("p", { class: "lede", text:
    "Level 1 in your starting class is fixed at the maximum of your hit die plus your Constitution modifier. For every level after that, type in the number you actually rolled — or press Roll to have the app roll it for you." }));

  const rows = R.hpRows(state);
  if (!rows.length) {
    panel.appendChild(h("div", { class: "empty-note", text: "Pick a class first." }));
    return;
  }

  const conMod = R.abilityMods(state).con;
  const table = h("table", { class: "hp-table" },
    h("thead", {}, h("tr", {},
      h("th", { text: "Level" }),
      h("th", { text: "Class" }),
      h("th", { text: "Die" }),
      h("th", { text: "Roll" }),
      h("th", { text: "CON" }),
      h("th", { text: "Extra" }),
      h("th", { text: "HP" })
    )),
    h("tbody", {}, rows.map((row) => hpRow(row)))
  );
  panel.appendChild(table);

  panel.appendChild(h("div", { class: "hp-actions" },
    h("button", {
      class: "btn small", type: "button",
      onclick: () => { rows.forEach((r) => { if (!r.fixed) state.hpRolls[String(r.charLevel)] = rollDie(r.hitDie); }); rerender(); }
    }, "Roll every level"),
    h("button", {
      class: "btn small", type: "button",
      onclick: () => {
        rows.forEach((r) => { if (!r.fixed) state.hpRolls[String(r.charLevel)] = Math.floor(r.hitDie / 2) + 1; });
        rerender();
      }
    }, "Use the fixed average"),
    h("button", {
      class: "btn small ghost danger", type: "button",
      onclick: () => { state.hpRolls = {}; rerender(); }
    }, "Clear rolls")
  ));

  const extras = extraHpNotes();
  if (extras.length) {
    panel.appendChild(h("div", { class: "callout", text: "Also counted: " + extras.join("; ") + "." }));
  }

  panel.appendChild(h("div", { class: "level-total" },
    h("span", { class: "lt-num", text: String(R.hpMax(state)) }),
    h("span", { class: "lt-label", text: `Hit point maximum · CON ${R.fmtMod(conMod)} per level` })
  ));

  const issues = issueList("hp");
  if (issues) panel.appendChild(issues);
}

function hpRow(row) {
  const cls = CLASSES[row.classKey];
  return h("tr", { class: row.fixed ? "fixed" : "" },
    h("td", { class: "num", text: String(row.charLevel) }),
    h("td", { text: `${cls.name} ${row.classLevel}` }),
    h("td", { class: "num", text: `d${row.hitDie}` }),
    h("td", {}, row.fixed
      ? h("span", {}, String(row.hitDie), " ", h("span", { class: "fixednote", text: "max, fixed" }))
      : h("span", { class: "chip-select" },
          h("input", {
            type: "number", min: 1, max: row.hitDie,
            value: row.base == null ? "" : row.base,
            "aria-label": `Level ${row.charLevel} hit die roll`,
            oninput: (e) => {
              const v = e.target.value;
              if (v === "") delete state.hpRolls[String(row.charLevel)];
              else state.hpRolls[String(row.charLevel)] = clampRoll(Number(v), row.hitDie);
              /* Don't redraw the panel while they're typing — only the sheet. */
              saveDraft(state);
              renderSidebar();
            },
            onblur: () => rerender()
          }),
          h("button", {
            class: "btn small", type: "button",
            onclick: () => { state.hpRolls[String(row.charLevel)] = rollDie(row.hitDie); rerender(); }
          }, "Roll")
        )
    ),
    h("td", { class: "num", text: R.fmtMod(row.conMod) }),
    h("td", { class: "num", text: row.extras ? R.fmtMod(row.extras) : "—" }),
    h("td", { class: "num", text: row.total == null ? "—" : String(row.total) })
  );
}

function clampRoll(n, die) {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(die, Math.floor(n)));
}

function rollDie(sides) { return 1 + Math.floor(Math.random() * sides); }

function extraHpNotes() {
  const notes = [];
  const sp = SPECIES[state.speciesKey];
  if (sp && sp.hpBonusPerLevel) notes.push(`${sp.name} species toughness, +${sp.hpBonusPerLevel} per level`);
  R.ownedFeatKeys(state).forEach((k) => {
    const f = FEATS[k];
    if (f && f.hpBonusPerLevel) notes.push(`${f.name}, +${f.hpBonusPerLevel} per level`);
    if (f && f.hpBonusFlat) notes.push(`${f.name}, +${f.hpBonusFlat} flat`);
  });
  R.classEntries(state).forEach((entry) => {
    const cls = CLASSES[entry.key];
    const sub = entry.subclass && cls.subclasses ? cls.subclasses[entry.subclass] : null;
    if (sub && sub.hpBonus && (entry.levels || 0) >= sub.hpBonus.fromLevel) {
      notes.push(`${sub.name} Draconic Resilience`);
    }
  });
  return notes;
}

/* =======================================================================
   Step 6 — Feats (requirement 7)
   ======================================================================= */

function buildFeatsStep(panel) {
  panel.appendChild(h("h2", { text: "Feats" }));
  panel.appendChild(h("p", { class: "lede", text:
    "Every Ability Score Improvement level is a feat choice, and level 19 is an Epic Boon. Starting above level 1 means you owe all the earlier ones too — they're all listed here rather than skipped." }));

  const slots = R.featSlots(state);
  if (!slots.length) {
    panel.appendChild(h("div", { class: "empty-note", text:
      "No feat choices yet. A background grants one Origin feat, and your first class ASI arrives at level 4." }));
    return;
  }

  slots.forEach((slot) => panel.appendChild(featSlotBlock(slot)));

  const issues = issueList("feats");
  if (issues) panel.appendChild(issues);
}

function featSlotBlock(slot) {
  if (slot.fixedFeat) {
    const f = FEATS[slot.fixedFeat];
    return h("fieldset", {},
      h("legend", { text: `${slot.label} · ${slot.source}` }),
      h("ul", { class: "feat-list" },
        h("li", {},
          f ? h("b", { class: "pop-trigger", text: f.name + ". ", ...tooltipTrigger(() => featPopoverHtml(f)) })
            : h("b", { text: slot.fixedFeat + ". " }),
          f ? f.text : "")),
      h("div", { class: "hint", text: "Granted automatically by your background." })
    );
  }

  const pick = (state.featPicks || {})[slot.id] || {};
  const options = R.featOptionsFor(state, slot);
  const chosen = pick.featKey ? FEATS[pick.featKey] : null;

  const choose = (key) => {
    state.featPicks[slot.id] = key
      ? { featKey: key, abilityBumps: {}, skillPicks: [], expertisePicks: [] }
      : {};
    rerender();
  };

  const block = h("fieldset", {},
    h("legend", { text: `${slot.label} · ${slot.source}${slot.charLevel ? ` · character level ${slot.charLevel}` : ""}` }),
    h("div", { class: "hint", style: "margin-bottom:6px" }, "Hover or focus a feat to read it before choosing."),
    h("div", { class: "chip-select" },
      options.map((o) => h("button", {
        class: `chip${o.key === pick.featKey ? " on" : ""}${o.disabled ? " disabled" : ""}`,
        type: "button", disabled: o.disabled,
        title: o.disabled ? o.disabledReason : null,
        ...tooltipTrigger(() => featPopoverHtml(o)),
        onclick: () => choose(o.key === pick.featKey ? null : o.key)
      }, o.name))
    )
  );

  if (chosen) {
    block.appendChild(h("ul", { class: "feat-list", style: "margin-top:10px" },
      h("li", {},
        h("b", { class: "pop-trigger", text: chosen.name + ". ", ...tooltipTrigger(() => featPopoverHtml(chosen)) }),
        chosen.text)));
    if (chosen.asi) {
      block.appendChild(asiBumpPicker(slot, pick));
    } else {
      if (chosen.abilityChoice) block.appendChild(featAbilityChoicePicker(slot, pick, chosen));
      if (chosen.skillChoiceFrom) block.appendChild(featSkillPicker(slot, pick, chosen.skillChoiceFrom, 1, "Choose a skill"));
      if (chosen.skillChoiceAny) block.appendChild(featSkillPicker(slot, pick, ALL_SKILL_KEYS, chosen.skillChoiceAny, `Choose ${chosen.skillChoiceAny} skill${chosen.skillChoiceAny > 1 ? "s" : ""}`));
      if (chosen.expertiseChoiceAny) block.appendChild(featExpertisePicker(slot, pick, chosen));
    }
  }
  return block;
}

/* A single ability score to bump by 1 (every non-ASI feat with an
   `abilityChoice` works this way — general feats cap at 20, boons at 30). */
function featAbilityChoicePicker(slot, pick, feat) {
  const bumps = pick.abilityBumps || {};
  const chosenAbility = Object.keys(bumps).find((a) => bumps[a] > 0) || null;
  const cap = feat.category === "boon" ? 30 : 20;
  const eligible = feat.abilityChoice === "any" ? ABILS : feat.abilityChoice;
  const scores = R.finalAbilities(state);

  const update = (a) => {
    const patch = { abilityBumps: a ? { [a]: 1 } : {} };
    if (feat.tiesSaveProf) patch.saveProfAbility = a || null;
    state.featPicks[slot.id] = { ...pick, ...patch };
    rerender();
  };

  return h("div", { style: "margin-top:10px" },
    h("div", { class: "chip-select" },
      eligible.map((a) => {
        const on = a === chosenAbility;
        const without = scores[a] - (bumps[a] || 0);
        const tooHigh = !on && without + 1 > cap;
        return h("button", {
          class: `chip${on ? " on" : ""}${tooHigh ? " disabled" : ""}`,
          type: "button", disabled: tooHigh,
          title: tooHigh ? `Would exceed ${cap}` : null,
          onclick: () => update(on ? null : a)
        }, `${ABIL_ABBR[a]} ${scores[a]}`);
      })
    ),
    h("div", { class: "hint", text: feat.tiesSaveProf
      ? (chosenAbility ? `+1 ${ABIL_NAME[chosenAbility]}, and proficiency in ${ABIL_NAME[chosenAbility]} saving throws.` : "Pick the ability to raise — it also grants a saving throw proficiency in that ability.")
      : (chosenAbility ? `+1 ${ABIL_NAME[chosenAbility]}.` : "Pick one score to raise by 1.") })
  );
}

/* N skills from a given pool (a short fixed list for feats like Observant,
   or the full list for Skilled / Skill Expert). Reuses the same "you already
   have this elsewhere" dashed-outline convention as the class skill picker. */
function featSkillPicker(slot, pick, pool, count, label) {
  const chosen = (pick.skillPicks || []).filter(Boolean);
  const already = R.proficientSkills(state);

  const update = (next) => {
    state.featPicks[slot.id] = { ...pick, skillPicks: next };
    rerender();
  };

  return h("div", { style: "margin-top:10px" },
    h("div", { class: "hint", text: label }),
    h("div", { class: "chip-select" },
      pool.map((sk) => {
        const on = chosen.includes(sk);
        const dupe = !on && already.has(sk);
        const full = !on && chosen.length >= count;
        return h("button", {
          class: `chip${on ? " on" : ""}${dupe ? " dupe" : ""}${full ? " disabled" : ""}`,
          type: "button", disabled: full,
          title: dupe ? "You already have this from another source" : null,
          onclick: () => update(on ? chosen.filter((s) => s !== sk) : [...chosen, sk])
        }, SKILLS[sk].name);
      })
    ),
    h("div", { class: "hint", text: `${chosen.length} of ${count} chosen.` })
  );
}

/* Skill Expert's Expertise pick draws from whatever the character is
   proficient in — including the skill this same feat just granted. */
function featExpertisePicker(slot, pick, feat) {
  const chosen = (pick.expertisePicks || []).filter(Boolean);
  const eligible = [...R.proficientSkills(state)].sort((a, b) => SKILLS[a].name.localeCompare(SKILLS[b].name));
  const want = feat.expertiseChoiceAny;

  const update = (next) => {
    state.featPicks[slot.id] = { ...pick, expertisePicks: next };
    rerender();
  };

  return h("div", { style: "margin-top:10px" },
    h("div", { class: "hint", text: `Choose ${want} skill${want > 1 ? "s" : ""} for Expertise` }),
    eligible.length === 0
      ? h("div", { class: "hint", text: "Pick this feat's new skill proficiency first, or have one from elsewhere." })
      : h("div", { class: "chip-select" },
          eligible.map((sk) => {
            const on = chosen.includes(sk);
            const full = !on && chosen.length >= want;
            return h("button", {
              class: `chip${on ? " on" : ""}${full ? " disabled" : ""}`,
              type: "button", disabled: full,
              onclick: () => update(on ? chosen.filter((s) => s !== sk) : [...chosen, sk])
            }, SKILLS[sk].name);
          })
        ),
    h("div", { class: "hint", text: `${chosen.length} of ${want} chosen.` })
  );
}

/* The Ability Score Improvement feat: +2 to one score, or +1 to two.

   The mode is stored on the pick rather than inferred from the bumps,
   because an empty bumps object is ambiguous — inferring it made "+2 to one
   score" impossible to select. */
function asiBumpPicker(slot, pick) {
  const bumps = pick.abilityBumps || {};
  const mode = pick.asiMode === "two" ? "two" : "oneOne";
  const picked = Object.keys(bumps).filter((a) => bumps[a] > 0);
  const scores = R.finalAbilities(state);

  const update = (patch) => {
    state.featPicks[slot.id] = { ...pick, ...patch };
    rerender();
  };

  return h("div", { style: "margin-top:10px" },
    h("div", { class: "method-toggle" },
      h("button", {
        class: `chip${mode === "two" ? " on" : ""}`, type: "button",
        onclick: () => update({ asiMode: "two", abilityBumps: {} })
      }, "+2 to one score"),
      h("button", {
        class: `chip${mode === "oneOne" ? " on" : ""}`, type: "button",
        onclick: () => update({ asiMode: "oneOne", abilityBumps: {} })
      }, "+1 to two scores")
    ),
    h("div", { class: "chip-select" },
      ABILS.map((a) => {
        const on = bumps[a] > 0;
        const wants = mode === "two" ? 2 : 1;
        /* An ASI can't push a score past 20. Compare against the score as it
           would be without this slot's own contribution. */
        const without = scores[a] - (bumps[a] || 0);
        const tooHigh = !on && without + wants > 20;
        const full = !on && !tooHigh && (mode === "oneOne" && picked.length >= 2);
        return h("button", {
          class: `chip${on ? " on" : ""}${tooHigh || full ? " disabled" : ""}`,
          type: "button", disabled: tooHigh || full,
          title: tooHigh ? "Would exceed 20" : (full ? "Two scores already chosen" : null),
          onclick: () => {
            const next = { ...bumps };
            if (on) delete next[a];
            else if (mode === "two") { Object.keys(next).forEach((k) => delete next[k]); next[a] = 2; }
            else next[a] = 1;
            update({ abilityBumps: next });
          }
        }, `${ABIL_ABBR[a]} ${scores[a]}`);
      })
    ),
    h("div", { class: "hint", text: mode === "two"
      ? `Pick one score to raise by 2. ${picked.length ? "Chosen." : "Nothing chosen yet."}`
      : `Pick two different scores to raise by 1 each. ${picked.length} of 2 chosen.` })
  );
}

/* =======================================================================
   Step 7 — Spells (requirements 7, 9, 16)
   ======================================================================= */

function buildSpellsStep(panel) {
  panel.appendChild(h("h2", { text: "Spells" }));
  panel.appendChild(h("p", { class: "lede", text:
    "Only spells on each class's own list are shown here. Hover or focus a spell to read it before choosing." }));

  const work = R.spellWork(state);
  if (!work.length) {
    panel.appendChild(h("div", { class: "empty-note", text:
      "Nothing casts yet — take levels in a spellcasting class (or an Eldritch Knight / Arcane Trickster subclass) to see spells here." }));
    return;
  }

  work.forEach((w) => panel.appendChild(casterSpellBlock(w)));

  const issues = issueList("spells");
  if (issues) panel.appendChild(issues);
}

function casterSpellBlock(w) {
  const wrap = h("fieldset", {},
    h("legend", { text: `${w.className} · level ${w.level}` })
  );
  if (w.cantripTarget > 0) wrap.appendChild(cantripPicker(w));
  if (w.prepMode === "free") {
    wrap.appendChild(flatSpellPicker(w, "prepared", w.pool, w.preparedTarget,
      `Prepared spells — choose ${w.preparedTarget}`,
      "Prepares fresh after every Long Rest — there's no permanent known-spell list to grow, so pick your whole prepared set here."));
  } else {
    wrap.appendChild(permanentGrowthWalkthrough(w));
    if (w.prepMode === "spellbook") {
      wrap.appendChild(copiedSpellPicker(w));
      const bookPool = [...(w.pick.spellbook || []), ...(w.pick.extra || [])].filter(Boolean);
      wrap.appendChild(flatSpellPicker(w, "prepared", bookPool, w.preparedTarget,
        `Prepared today — choose ${w.preparedTarget} from your spellbook`,
        bookPool.length ? null : "Add spells to your spellbook above first."));
    } else {
      wrap.appendChild(h("div", { class: "hint", style: "margin-top:10px", text:
        "Known spells are always prepared for this class — there's no separate daily-preparation step." }));
    }
  }
  return wrap;
}

/* Cantrips: flat, freely reassignable, capped at the current count — every
   class that has them lets you swap on a Long Rest anyway, so a level-walked
   history would be more bookkeeping than the rule actually needs. */
function cantripPicker(w) {
  const chosen = (w.pick.cantrips || []).filter(Boolean);
  const known = R.allKnownSpellKeys(state);
  return h("div", { style: "margin-bottom:12px" },
    h("div", { class: "hint", text: `Cantrips — choose ${w.cantripTarget}` }),
    h("div", { class: "chip-select", style: "margin-top:4px" },
      w.cantripPool.map((key) => {
        const spell = SPELLS[key];
        const on = chosen.includes(key);
        const dupe = !on && known.has(key);
        const full = !on && chosen.length >= w.cantripTarget;
        return h("button", {
          class: `chip${on ? " on" : ""}${dupe ? " dupe" : ""}${full ? " disabled" : ""}`,
          type: "button", disabled: full,
          title: dupe ? "You already know this from another source" : null,
          ...tooltipTrigger(() => spellPopoverHtml(spell)),
          onclick: () => {
            w.pick.cantrips = on ? chosen.filter((k) => k !== key) : [...chosen, key];
            rerender();
          }
        }, spell.name);
      })
    ),
    h("div", { class: "hint", text: `${chosen.length} of ${w.cantripTarget} chosen.` })
  );
}

/* The BG3-style level-by-level walkthrough for "list" and "spellbook" modes:
   one section per class level reached, each showing how many NEW spells are
   owed at that level and, for swap-capable classes, one optional swap. */
function permanentGrowthWalkthrough(w) {
  const list = (w.pick[w.permanentKey] || []).filter(Boolean);
  const known = R.allKnownSpellKeys(state);
  const label = w.permanentKey === "spellbook" ? "Spellbook" : "Known spells";
  const wrap = h("div", { style: "margin-top:12px" },
    h("h4", { text: `${label} — ${list.length} of ${w.permanentTarget}` })
  );

  let runningTotal = 0;
  w.growth.forEach((row) => {
    const startIndex = runningTotal;
    runningTotal = row.target;
    if (row.newCount === 0 && row.level !== 1) return;

    const section = h("div", { class: "spell-groups", style: "margin-bottom:10px" });
    section.appendChild(h("div", { class: "spell-level-head" },
      h("span", { text: `Level ${row.level}${row.newCount ? ` — pick ${row.newCount} new` : ""}` }),
      h("span", { class: `count${list.length >= row.target ? " full" : ""}`, text: `${Math.min(list.length, row.target)} / ${row.target}` })
    ));

    const upToHere = list.slice(0, startIndex);
    const newSlice = list.slice(startIndex, row.target);
    section.appendChild(h("div", { class: "chip-select" },
      row.pool.map((key) => {
        const spell = SPELLS[key];
        const alreadyElsewhere = upToHere.includes(key);
        const on = newSlice.includes(key);
        const dupe = !on && !alreadyElsewhere && known.has(key);
        const full = !on && !alreadyElsewhere && (list.length >= row.target || newSlice.length >= row.newCount);
        return h("button", {
          class: `chip${on ? " on" : ""}${dupe ? " dupe" : ""}${(full || alreadyElsewhere) ? " disabled" : ""}`,
          type: "button", disabled: full || alreadyElsewhere,
          title: alreadyElsewhere ? "Already in this list from an earlier level" : (dupe ? "You already know this from another source" : null),
          ...tooltipTrigger(() => spellPopoverHtml(spell)),
          onclick: () => {
            const next = [...list];
            if (on) next.splice(next.indexOf(key), 1);
            else next.splice(startIndex + newSlice.length, 0, key);
            w.pick[w.permanentKey] = next;
            rerender();
          }
        }, spell.name);
      })
    ));

    if (w.swapOnLevel && row.level > 1 && list.length >= row.target) {
      section.appendChild(swapControl(w, list, startIndex));
    }

    wrap.appendChild(section);
  });

  return wrap;
}

/* One optional "replace a spell you know with a different one" control,
   offered once per level for swap-capable classes (Bard/Ranger/Sorcerer/
   Warlock and the third-caster subclasses) — never for the Wizard's
   spellbook, which only ever grows, per RAW. */
function swapControl(w, list, upToIndex) {
  /* Spells known before THIS level's own new picks — RAW lets you replace a
     spell you already knew, not one you just learned this same level-up. */
  const learnedBeforeThisLevel = list.slice(0, upToIndex);
  const outSel = h("select", { "aria-label": "Spell to replace" },
    h("option", { value: "" }, "— optionally replace a known spell —"),
    learnedBeforeThisLevel.map((key) => h("option", { value: key }, SPELLS[key].name))
  );
  const inSel = h("select", { "aria-label": "New spell" },
    h("option", { value: "" }, "— with —"),
    w.pool.filter((k) => !list.includes(k)).map((key) => h("option", { value: key }, SPELLS[key].name))
  );
  return h("div", { class: "optrow", style: "margin-top:6px" },
    outSel, inSel,
    h("button", {
      class: "btn small", type: "button",
      onclick: () => {
        const from = outSel.value, to = inSel.value;
        if (!from || !to) return;
        const next = list.map((k) => (k === from ? to : k));
        w.pick[w.permanentKey] = next;
        rerender();
      }
    }, "Swap")
  );
}

/* Spells added to the spellbook by copying them from a scroll or another
   wizard's book, rather than by the guaranteed per-level growth above — RAW
   places no cap on this, so it's a free, uncapped choice from the same pool
   the growth walkthrough draws from, kept in its own list (`pick.extra`) so
   it never throws off the growth schedule's own counts. */
function copiedSpellPicker(w) {
  const chosen = (w.pick.extra || []).filter(Boolean);
  const known = R.allKnownSpellKeys(state);
  return h("div", { style: "margin-top:12px" },
    h("h4", { text: "Spells learned another way" }),
    h("div", { class: "hint", text:
      "Spells copied into your spellbook from a scroll or another spellbook — a free choice from the full list, with no cap and no swap." }),
    h("div", { class: "chip-select", style: "margin-top:4px" },
      w.pool.map((key) => {
        const spell = SPELLS[key];
        const on = chosen.includes(key);
        const dupe = !on && known.has(key);
        return h("button", {
          class: `chip${on ? " on" : ""}${dupe ? " dupe" : ""}`,
          type: "button",
          title: dupe ? "You already know this from another source" : null,
          ...tooltipTrigger(() => spellPopoverHtml(spell)),
          onclick: () => {
            w.pick.extra = on ? chosen.filter((k) => k !== key) : [...chosen, key];
            rerender();
          }
        }, spell.name);
      })
    ),
    h("div", { class: "hint", text: chosen.length ? `${chosen.length} copied.` : "None copied yet." })
  );
}

/* A flat, freely-reassignable pick of exactly `target` spells from `pool` —
   used for "free" mode's daily preparation and "spellbook" mode's
   prepared-from-book subset. Nothing here is a permanent commitment. */
function flatSpellPicker(w, pickKey, pool, target, label, hint) {
  const chosen = (w.pick[pickKey] || []).filter(Boolean);
  const known = R.allKnownSpellKeys(state);
  const wrap = h("div", { style: "margin-top:12px" },
    h("div", { class: "hint", text: label })
  );
  if (hint) wrap.appendChild(h("div", { class: "hint", text: hint }));
  wrap.appendChild(h("div", { class: "chip-select", style: "margin-top:4px" },
    pool.map((key) => {
      const spell = SPELLS[key];
      const on = chosen.includes(key);
      const dupe = !on && known.has(key);
      const full = !on && chosen.length >= target;
      return h("button", {
        class: `chip${on ? " on" : ""}${dupe ? " dupe" : ""}${full ? " disabled" : ""}`,
        type: "button", disabled: full,
        title: dupe ? "You already know this from another source" : null,
        ...tooltipTrigger(() => spellPopoverHtml(spell)),
        onclick: () => {
          w.pick[pickKey] = on ? chosen.filter((k) => k !== key) : [...chosen, key];
          rerender();
        }
      }, spell.name);
    })
  ));
  wrap.appendChild(h("div", { class: "hint", text: `${chosen.length} of ${target} chosen.` }));
  return wrap;
}

/* =======================================================================
   Step 8 — Details
   ======================================================================= */

function buildIdentityStep(panel) {
  panel.appendChild(h("h2", { text: "Details" }));
  panel.appendChild(h("p", { class: "lede", text:
    "Name your character, choose an alignment, and note anything you want carried onto the sheet." }));

  panel.appendChild(h("label", { class: "field" },
    h("span", { class: "k", text: "Character name" }),
    h("input", {
      class: "full", type: "text", value: state.name,
      oninput: (e) => { state.name = e.target.value; saveDraft(state); renderSidebar(); }
    })
  ));

  panel.appendChild(h("h4", { text: "Alignment" }));
  panel.appendChild(h("div", { class: "align-grid" },
    ALIGNMENTS.map((al) => h("button", {
      class: `align-cell${state.alignment === al ? " selected" : ""}`,
      type: "button",
      onclick: () => { state.alignment = al; rerender(); }
    }, al))
  ));

  panel.appendChild(h("label", { class: "field", style: "margin-top:18px" },
    h("span", { class: "k", text: "Pronouns" }),
    h("input", {
      class: "full", type: "text", value: state.pronouns,
      oninput: (e) => { state.pronouns = e.target.value; saveDraft(state); }
    })
  ));
  panel.appendChild(h("label", { class: "field" },
    h("span", { class: "k", text: "Appearance" }),
    h("textarea", {
      rows: 3, oninput: (e) => { state.appearance = e.target.value; saveDraft(state); }
    }, state.appearance)
  ));
  panel.appendChild(h("label", { class: "field" },
    h("span", { class: "k", text: "Backstory" }),
    h("textarea", {
      rows: 5, oninput: (e) => { state.backstory = e.target.value; saveDraft(state); }
    }, state.backstory)
  ));

  const issues = issueList("identity");
  if (issues) panel.appendChild(issues);
}

/* =======================================================================
   Step 9 — Sheet
   ======================================================================= */

function buildSheetStep(panel) {
  panel.appendChild(h("h2", { class: "noprint", text: "Character Sheet" }));
  panel.appendChild(h("div", { class: "hp-actions noprint" },
    h("button", { class: "btn small", type: "button", onclick: () => window.print() }, "Print"),
    h("button", { class: "btn small", type: "button", onclick: () => doSave() }, "Save character"),
    h("button", { class: "btn small", type: "button", onclick: () => exportCharacter(state) }, "Export JSON")
  ));
  panel.appendChild(printSheet());
}

function printSheet() {
  const mods = R.abilityMods(state);
  const scores = R.finalAbilities(state);
  const pb = R.profBonus(R.totalLevel(state));
  const saves = R.saveProficiencies(state);
  const profs = R.proficientSkills(state);
  const exps = R.expertiseSkills(state);
  const acInfo = R.acDetail(state);
  const sp = SPECIES[state.speciesKey];
  const bg = BACKGROUNDS[state.backgroundKey];

  const classLine = R.classEntries(state).map((e) => {
    const cls = CLASSES[e.key];
    const sub = e.subclass ? cls.subclasses[e.subclass].name : null;
    return `${cls.name} ${e.levels}${sub ? ` (${sub})` : ""}`;
  }).join(" / ") || "—";

  return h("div", { class: "printsheet" },
    h("div", { class: "ps-head" },
      h("div", { class: "ps-charname" }, state.name || "Unnamed Character",
        h("small", { text: classLine })),
      h("div", { class: "ps-headgrid" },
        psField("Species", sp ? sp.name : "—"),
        psField("Background", bg ? bg.name : "—"),
        psField("Alignment", state.alignment || "—"),
        psField("Total Level", String(R.totalLevel(state))),
        psField("Proficiency Bonus", R.fmtMod(pb)),
        psField("Speed", `${speciesSpeed()} ft.`)
      )
    ),
    h("div", { class: "ps-cols" },
      h("div", { class: "ps-abils" },
        ABILS.map((a) => h("div", { class: "ps-abil" },
          h("div", { class: "psa-name", text: ABIL_ABBR[a] }),
          h("div", { class: "psa-mod", text: R.fmtMod(mods[a]) }),
          h("div", { class: "psa-score", text: String(scores[a]) })
        ))
      ),
      h("div", {},
        h("div", { class: "ps-combat" },
          psCombat("Armor Class", String(acInfo.total)),
          psCombat("Hit Points", String(R.hpMax(state))),
          psCombat("Initiative", R.fmtMod(mods.dex))
        ),
        h("div", { class: "ps-box" },
          h("h4", { text: "Saving Throws" }),
          h("ul", { class: "ps-lines" },
            ABILS.map((a) => h("li", { class: saves.has(a) ? "prof" : "" },
              h("span", { class: "psl-n", text: ABIL_NAME[a] }),
              h("span", { class: "psl-v", text: R.fmtMod(mods[a] + (saves.has(a) ? pb : 0)) })
            ))
          )
        ),
        h("div", { class: "ps-box" },
          h("h4", { text: "Skills" }),
          h("ul", { class: "ps-lines" },
            ALL_SKILL_KEYS.map((sk) => h("li", { class: profs.has(sk) ? "prof" : "" },
              h("span", { class: "psl-n" }, SKILLS[sk].name,
                exps.has(sk) ? h("small", { text: " ◆" }) : null,
                h("small", { text: ` (${ABIL_ABBR[SKILLS[sk].ab]})` })),
              h("span", { class: "psl-v", text: R.fmtMod(R.skillModifier(state, sk)) })
            ))
          ),
          h("div", { class: "ps-note", text: "◆ marks Expertise." })
        )
      ),
      h("div", {},
        spellBox(),
        trackBox(),
        h("div", { class: "ps-box" },
          h("h4", { text: "Features & Traits" }),
          h("ul", { class: "ps-feats" }, featureLines())
        ),
        h("div", { class: "ps-box" },
          h("h4", { text: "Equipment" }),
          h("div", { class: "ps-feats", text: equipmentText() })
        ),
        state.appearance || state.backstory ? h("div", { class: "ps-box" },
          h("h4", { text: "Notes" }),
          h("div", { class: "ps-feats", text: [state.appearance, state.backstory].filter(Boolean).join(" — ") })
        ) : null
      )
    ),
    h("div", { class: "ps-note", text:
      "Origin & Order — a layout of our own, covering the same fields as the official 2024 sheet. Rules summaries are paraphrased." })
  );
}

function psField(k, v) {
  return h("div", { class: "ps-field" },
    h("span", { class: "psk", text: k }), h("span", { class: "psv", text: v }));
}

function psCombat(k, v) {
  return h("div", { class: "ps-cbox" },
    h("div", { class: "pscb-k", text: k }), h("div", { class: "pscb-v", text: v }));
}

function spellBox() {
  const allowances = R.spellAllowances(state);
  const slots = R.spellSlots(state);
  const pact = R.pactMagic(state);
  if (!allowances.length) return null;

  return h("div", { class: "ps-box" },
    h("h4", { text: "Spellcasting" }),
    h("ul", { class: "ps-lines" },
      allowances.map((a) => h("li", {},
        h("span", { class: "psl-n", text: a.label }),
        h("span", { class: "psl-v", text:
          `DC ${R.spellSaveDC(state, a.ability)} · atk ${R.fmtMod(R.spellAttackBonus(state, a.ability))} · ${a.cantrips} cantrips · ${a.spellbook ? `${a.spellbook} in book, ` : ""}${a.prepared} prepared` })
      ))
    ),
    slots.length ? h("div", { class: "ps-slots", style: "margin-top:8px" },
      slots.map((n, i) => h("span", { class: "ps-slot", text: `L${i + 1}: ${n}` }))) : null,
    pact ? h("div", { class: "ps-slots", style: "margin-top:6px" },
      h("span", { class: "ps-slot", text: `Pact Magic: ${pact.slots} × level ${pact.level}` })) : null,
    R.isMulticlass(state) && slots.length ? h("div", { class: "ps-note", text:
      `Slots from a combined caster level of ${R.casterLevel(state)}.` + (pact ? " Pact Magic is tracked separately." : "") }) : null,
    ...R.spellWork(state).map((w) => spellNameList(w))
  );
}

/* The actual chosen spell names for one caster entry, grouped by level, with
   the same hover tooltip used everywhere else a spell appears. Only shows
   what's actually cast day-to-day: cantrips + prepared (or known, for
   classes where known IS prepared) — not the Wizard's whole spellbook,
   which is reference material rather than what's ready right now. */
function spellNameList(w) {
  const readyKeys = [
    ...(w.pick.cantrips || []),
    ...(w.prepMode === "free" || w.prepMode === "spellbook" ? (w.pick.prepared || []) : (w.pick.known || []))
  ].filter(Boolean);
  if (!readyKeys.length) return null;

  const byLevel = new Map();
  readyKeys.forEach((key) => {
    const lvl = SPELLS[key] ? SPELLS[key].level : 0;
    if (!byLevel.has(lvl)) byLevel.set(lvl, []);
    byLevel.get(lvl).push(key);
  });

  return h("div", { class: "ps-spelllist", style: "margin-top:8px" },
    [...byLevel.keys()].sort((a, b) => a - b).map((lvl) => {
      const names = [];
      byLevel.get(lvl)
        .sort((a, b) => SPELLS[a].name.localeCompare(SPELLS[b].name))
        .forEach((key, i) => {
          if (i > 0) names.push(", ");
          names.push(spellNameEl(key));
        });
      return h("div", { class: "pss-group" },
        h("div", { class: "pss-head", text: `${w.className} — ${lvl === 0 ? "Cantrips" : `Level ${lvl}`}` }),
        names
      );
    })
  );
}

function trackBox() {
  const tracks = R.tracksFor(state);
  if (!tracks.length) return null;
  return h("div", { class: "ps-box" },
    h("h4", { text: "Class Resources" }),
    h("ul", { class: "ps-lines" },
      tracks.map((t) => h("li", {},
        h("span", { class: "psl-n", text: t.label }),
        h("span", { class: "psl-v", text: t.value })
      ))
    )
  );
}

function featureLines() {
  const out = [];
  const sp = SPECIES[state.speciesKey];
  if (sp) {
    sp.traits.forEach((t) => out.push(h("li", {}, h("b", { text: t.name + ". " }), t.text)));
    if (sp.lineageChoice && state.speciesLineage) {
      const lin = sp.lineageChoice[state.speciesLineage];
      out.push(h("li", {}, h("b", { text: lin.name + ". " }), lin.text));
    }
  }
  /* Class-level feats (ASI/Epic Boon slots) are already listed once per class
     below, with their chosen ability/skill detail — track their keys so the
     flat feat list underneath only adds background- and species-granted
     feats, which featuresByClass never sees. */
  const shownFeatKeys = new Set();
  R.featuresByClass(state).forEach((group) => {
    group.rows.forEach((f) => {
      const label = `${f.name} (${group.className} ${f.level}). `;
      const feat = f.isFeat && f.featKey ? FEATS[f.featKey] : null;
      if (feat) shownFeatKeys.add(f.featKey);
      const nameEl = feat
        ? h("b", { class: "pop-trigger", text: label, ...tooltipTrigger(() => featPopoverHtml(feat)) })
        : h("b", { text: label });
      out.push(h("li", {}, nameEl, f.text));
    });
  });
  R.featSlots(state).forEach((slot) => {
    if (slot.classIndex != null) return; // already covered above
    const k = slot.fixedFeat || (state.featPicks[slot.id] || {}).featKey;
    const f = k && FEATS[k];
    if (!f || shownFeatKeys.has(k)) return;
    shownFeatKeys.add(k);
    out.push(h("li", {},
      h("b", { class: "pop-trigger", text: f.name + " (feat). ", ...tooltipTrigger(() => featPopoverHtml(f)) }),
      f.text));
  });
  if (!out.length) out.push(h("li", { class: "empty-note", text: "Nothing yet." }));
  return out;
}

function equipmentText() {
  const bits = [];
  R.classEntries(state).forEach((entry, i) => {
    if (i > 0) return;
    const cls = CLASSES[entry.key];
    const eq = (cls.equipment || []).find((e) => e.key === entry.equipment);
    if (eq) bits.push(`${cls.name}: ${eq.label}`);
  });
  const bg = BACKGROUNDS[state.backgroundKey];
  if (bg) bits.push(`${bg.name}: ${bg.equipment}`);
  return bits.join(" · ") || "—";
}

/* =======================================================================
   Sidebar sheet summary
   ======================================================================= */

function renderSidebar() {
  swapChildren(byId("sheet"), buildSidebar);
}

function buildSidebar(host) {
  const total = R.totalLevel(state);
  const mods = R.abilityMods(state);
  const scores = R.finalAbilities(state);
  const classLine = R.classEntries(state).map((e) => `${CLASSES[e.key].name} ${e.levels}`).join(" / ");

  const card = h("div", { class: "sheet-card" },
    h("h2", { class: "sheet-name", text: state.name || "Unnamed character" }),
    h("div", { class: "sheet-tagline", text: classLine ? `${classLine}${total ? ` · level ${total}` : ""}` : "No class chosen yet" }),
    h("div", { class: "sheet-grid3" },
      statTile("hp", "HP", String(R.hpMax(state))),
      statTile("ac", "AC", String(R.ac(state))),
      statTile("pb", "Prof", R.fmtMod(R.profBonus(total)))
    ),
    h("div", { class: "sheet-abilities" },
      ABILS.map((a) => h("div", { class: "sa" },
        h("div", { class: "aab", text: ABIL_ABBR[a] }),
        h("div", { class: "amod2 mono", text: R.fmtMod(mods[a]) }),
        h("div", { class: "asc", text: String(scores[a]) })
      ))
    )
  );

  const pending = [
    ...R.pendingSubclasses(state).map(({ cls }) => `${cls.name} ${cls.subclassLabel}`),
    ...R.pendingClassChoices(state).map(({ cls, choice }) => `${cls.name} ${choice.label}`),
    ...R.pendingFeatSlots(state).map((s) => `${s.label} feat`),
    ...(R.hpPendingLevels(state).length ? [`HP for level${R.hpPendingLevels(state).length === 1 ? "" : "s"} ${R.hpPendingLevels(state).join(", ")}`] : [])
  ];
  if (pending.length) {
    card.appendChild(h("div", { class: "sheet-section" },
      h("h3", { text: "Still to choose" }),
      h("ul", { class: "linelist" }, pending.map((t) => h("li", { class: "warn", text: t })))
    ));
  }

  const slots = R.spellSlots(state);
  const pact = R.pactMagic(state);
  if (slots.length || pact) {
    card.appendChild(h("div", { class: "sheet-section" },
      h("h3", { text: "Spell Slots" }),
      h("div", { class: "tagrow" },
        slots.map((n, i) => h("span", { class: "tag slot", text: `L${i + 1}×${n}` })),
        pact ? h("span", { class: "tag slot", text: `Pact ${pact.slots}×L${pact.level}` }) : null
      )
    ));
  }

  const tracks = R.tracksFor(state);
  if (tracks.length) {
    card.appendChild(h("div", { class: "sheet-section" },
      h("h3", { text: "Resources" }),
      h("ul", { class: "linelist" }, tracks.map((t) =>
        h("li", { class: "row" }, h("span", { class: "l", text: t.label }), h("span", { class: "mono", text: t.value }))))
    ));
  }

  card.appendChild(h("div", { class: "sidebar-actions noprint" },
    h("button", { class: "btn small", type: "button", onclick: () => doSave() }, "Save character"),
    h("button", { class: "btn small ghost", type: "button", onclick: () => openLibrary() }, "Saved characters"),
    h("button", { class: "btn small ghost danger", type: "button", onclick: () => {
      if (!confirm("Start over? The current draft will be cleared.")) return;
      clearDraft();
      state = defaultState();
      goToStep(0);
    } }, "Start over")
  ));

  host.appendChild(card);
}

function statTile(kind, label, value) {
  return h("div", { class: `stat-tile ${kind}` },
    h("div", { class: "stat-label", text: label }),
    h("span", { class: "stat-num", text: value }));
}

/* =======================================================================
   Saved characters (requirements 10 and 11)
   ======================================================================= */

function summaryLine() {
  const line = R.classEntries(state).map((e) => `${CLASSES[e.key].name} ${e.levels}`).join(" / ");
  const sp = SPECIES[state.speciesKey];
  return [sp ? sp.name : null, line].filter(Boolean).join(" ") || "Unfinished";
}

function doSave() {
  const id = saveCharacter(state, summaryLine());
  if (id) {
    state.id = id;
    rerender();
    flash("Saved.");
  } else {
    flash("Could not save — browser storage is unavailable.");
  }
}

function flash(message) {
  const host = byId("flash");
  if (!host) return;
  host.textContent = message;
  host.hidden = false;
  setTimeout(() => { host.hidden = true; }, 2600);
}

function openLibrary() {
  const list = loadIndex();
  const backdrop = h("div", { class: "modal-backdrop", onclick: (e) => {
    if (e.target === backdrop) backdrop.remove();
  } });
  const modal = h("div", { class: "modal" },
    h("h3", { text: "Saved characters" }),
    list.length === 0
      ? h("div", { class: "empty-note", text: "Nothing saved in this browser yet." })
      : h("div", { class: "char-list" }, list.map((entry) => h("div", { class: "char-item" },
          h("div", { class: "ci-main" },
            h("div", { class: "ci-name", text: entry.name }),
            h("div", { class: "ci-sub", text: `${entry.summary} · ${new Date(entry.updated).toLocaleString()}` })
          ),
          h("button", { class: "btn small", type: "button", onclick: () => {
            const loaded = loadCharacter(entry.id);
            if (loaded) { state = loaded; backdrop.remove(); goToStep(STEPS.length - 1); }
          } }, "Open"),
          h("button", { class: "btn small ghost danger", type: "button", onclick: () => {
            if (!confirm(`Delete ${entry.name}?`)) return;
            deleteCharacter(entry.id);
            backdrop.remove();
            openLibrary();
          } }, "Delete")
        ))),
    h("div", { class: "hp-actions", style: "margin-top:16px" },
      h("label", { class: "btn small" }, "Import JSON",
        h("input", { type: "file", accept: ".json,application/json", style: "display:none",
          onchange: (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              try {
                state = parseImported(String(reader.result));
                backdrop.remove();
                goToStep(STEPS.length - 1);
                flash("Imported.");
              } catch {
                flash("That file isn't a character export.");
              }
            };
            reader.readAsText(file);
          } })
      ),
      h("button", { class: "btn small ghost", type: "button", onclick: () => backdrop.remove() }, "Close")
    )
  );
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}

/* ---------------- Boot ---------------- */

function boot() {
  byId("themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    const now = root.getAttribute("data-theme");
    const next = now === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("oo.theme", next); } catch { /* ignore */ }
  });
  try {
    const saved = localStorage.getItem("oo.theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch { /* ignore */ }

  byId("libraryBtn").addEventListener("click", openLibrary);

  /* Clamp a restored step to what's actually unlocked. */
  state.step = Math.min(state.step || 0, furthestUnlocked());
  rerender();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
