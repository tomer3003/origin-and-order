/* Rules engine. Pure functions over a character state object — no DOM, no
   storage, no rendering. Everything the sheet shows is derived here. */

import {
  ABILS, ARMOR, PB_COST, STANDARD_ARRAY, SKILLS,
  FULL_CASTER_SLOTS, HALF_CASTER_SLOTS, THIRD_CASTER_SLOTS, PACT_MAGIC,
  ASI_FEATURE, EPIC_BOON_FEATURE
} from "./data/core.js";
import { CLASSES, CASTER_WEIGHT, THIRD_CASTER_SUBCLASSES } from "./data/classes/index.js";
import { SPECIES } from "./data/species.js";
import { BACKGROUNDS } from "./data/backgrounds.js";
import { FEATS } from "./data/feats.js";

export const MAX_LEVEL = 20;

/* ---------------- Small numeric helpers ---------------- */

export function mod(score) { return Math.floor((score - 10) / 2); }
export function fmtMod(m) { return m >= 0 ? "+" + m : String(m); }
export function profBonus(level) { return 2 + Math.floor((Math.max(1, level) - 1) / 4); }

/* ---------------- Class list / levels ---------------- */

/* state.classes is an ordered list of
   { key, levels, subclass, skills[], equipment, choices{}, expertise[] }.
   Order matters: the first entry is the class the character started in, which
   is the one that gets the fixed maximum-hit-die HP at level 1. */

export function classEntries(state) {
  return (state.classes || []).filter((c) => c && c.key && CLASSES[c.key]);
}

export function totalLevel(state) {
  return classEntries(state).reduce((n, c) => n + (c.levels || 0), 0);
}

export function classDef(entry) { return CLASSES[entry.key]; }

export function isMulticlass(state) { return classEntries(state).length > 1; }

/* Classes still available to add: everything not already taken. */
export function availableClassKeys(state) {
  const taken = new Set(classEntries(state).map((c) => c.key));
  return Object.keys(CLASSES).filter((k) => !taken.has(k));
}

/* Character levels in the order they were gained, each tagged with the class
   it was taken in. Character level N is index N-1.

   With the class + level-count UI the order is simply: all of the first
   class's levels, then all of the second's, and so on. */
export function levelLog(state) {
  const out = [];
  classEntries(state).forEach((entry, classIndex) => {
    for (let classLevel = 1; classLevel <= (entry.levels || 0); classLevel++) {
      out.push({
        charLevel: out.length + 1,
        classIndex,
        classKey: entry.key,
        classLevel,
        hitDie: CLASSES[entry.key].hitDie
      });
    }
  });
  return out;
}

/* ---------------- Ability scores ---------------- */

export function pointBuyCost(assign) {
  return ABILS.reduce((sum, a) => sum + (PB_COST[assign[a]] || 0), 0);
}

/* STANDARD_ARRAY minus the values already assigned, as a multiset. */
export function remainingStandardValues(state) {
  const remaining = [...STANDARD_ARRAY];
  ABILS.forEach((a) => {
    const v = state.abilityAssign[a];
    if (v == null) return;
    const i = remaining.indexOf(v);
    if (i >= 0) remaining.splice(i, 1);
  });
  return remaining;
}

export function baseAbilities(state) {
  const out = {};
  ABILS.forEach((a) => {
    const v = state.abilityAssign ? state.abilityAssign[a] : null;
    out[a] = v == null ? 10 : v;
  });
  return out;
}

/* Background grants either +2/+1 to two of its three abilities, or +1 to all
   three. state.bgChoices.mode is "twoOne" or "spread". */
export function backgroundBonus(state) {
  const bonus = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  const bg = BACKGROUNDS[state.backgroundKey];
  if (!bg) return bonus;
  const ch = state.bgChoices || {};
  if (ch.mode === "spread") {
    bg.abilities.forEach((a) => { bonus[a] += 1; });
  } else {
    const [plus2, plus1] = ch.abilityPicks || [];
    if (plus2 && bg.abilities.includes(plus2)) bonus[plus2] += 2;
    if (plus1 && plus1 !== plus2 && bg.abilities.includes(plus1)) bonus[plus1] += 1;
  }
  return bonus;
}

/* Ability bumps bought with feat slots. state.featPicks is keyed by slot id
   and each pick may carry an `abilityBumps` object, e.g. {str:2} or
   {dex:1, con:1}. */
export function featAbilityBonus(state) {
  const bonus = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  Object.values(state.featPicks || {}).forEach((pick) => {
    if (!pick || !pick.abilityBumps) return;
    Object.entries(pick.abilityBumps).forEach(([a, n]) => {
      if (bonus[a] != null) bonus[a] += Number(n) || 0;
    });
  });
  return bonus;
}

export function finalAbilities(state) {
  const base = baseAbilities(state);
  const bg = backgroundBonus(state);
  const ft = featAbilityBonus(state);
  const out = {};
  ABILS.forEach((a) => { out[a] = base[a] + bg[a] + ft[a]; });
  return out;
}

export function abilityMods(state) {
  const scores = finalAbilities(state);
  const out = {};
  ABILS.forEach((a) => { out[a] = mod(scores[a]); });
  return out;
}

/* ---------------- Hit points ---------------- */

/* Requirement 4/6: character level 1 in the FIRST class is fixed at the hit
   die's maximum plus the Con modifier. Every level after that is a number the
   player types in (their own roll), with a Roll button to fill 1..hitDie.

   state.hpRolls is keyed by character level: { "2": 7, "3": 4, ... }. */
export function hpRows(state) {
  const conMod = abilityMods(state).con;
  const species = SPECIES[state.speciesKey];
  const perLevelSpecies = species && species.hpBonusPerLevel ? species.hpBonusPerLevel : 0;
  const perLevelFeat = featHpPerLevel(state);

  return levelLog(state).map((lv) => {
    const fixed = lv.charLevel === 1;
    const rolled = state.hpRolls ? state.hpRolls[String(lv.charLevel)] : null;
    const base = fixed ? lv.hitDie : (rolled == null ? null : Number(rolled));
    const extras = perLevelSpecies + perLevelFeat;
    return {
      ...lv,
      fixed,
      base,                                  // the die result (or its max at level 1)
      conMod,
      extras,
      total: base == null ? null : base + conMod + extras,
      pending: base == null
    };
  });
}

/* Feats like Tough add a flat amount per character level. */
function featHpPerLevel(state) {
  let n = 0;
  ownedFeatKeys(state).forEach((key) => {
    const f = FEATS[key];
    if (f && f.hpBonusPerLevel) n += f.hpBonusPerLevel;
  });
  return n;
}

function featHpFlat(state) {
  let n = 0;
  ownedFeatKeys(state).forEach((key) => {
    const f = FEATS[key];
    if (f && f.hpBonusFlat) n += f.hpBonusFlat;
  });
  return n;
}

/* Subclass HP riders, currently just Draconic Sorcery's Draconic Resilience. */
function subclassHpBonus(state) {
  let n = 0;
  classEntries(state).forEach((entry) => {
    const cls = CLASSES[entry.key];
    const sub = entry.subclass && cls.subclasses ? cls.subclasses[entry.subclass] : null;
    if (!sub || !sub.hpBonus) return;
    const { fromLevel, initial, perLevel } = sub.hpBonus;
    if ((entry.levels || 0) < fromLevel) return;
    n += initial + ((entry.levels - fromLevel) * perLevel);
  });
  return n;
}

export function hpMax(state) {
  const rows = hpRows(state);
  const counted = rows.reduce((sum, r) => sum + (r.total == null ? 0 : r.total), 0);
  return counted + featHpFlat(state) + subclassHpBonus(state);
}

export function hpPendingLevels(state) {
  return hpRows(state).filter((r) => r.pending).map((r) => r.charLevel);
}

/* ---------------- Armour class ---------------- */

/* Unarmored Defense can come from the class (Barbarian, Monk) or from a
   subclass (Draconic Sorcery's scales). The best available AC wins. */
export function acDetail(state) {
  const mods = abilityMods(state);
  const first = classEntries(state)[0];
  const eqKey = first ? first.equipment : null;
  const cls = first ? CLASSES[first.key] : null;
  const eq = cls && eqKey ? (cls.equipment || []).find((e) => e.key === eqKey) : null;

  const armorKey = state.armorOverride || (eq ? eq.armor : "none");
  const hasShield = state.shieldOverride != null ? state.shieldOverride : !!(eq && eq.shield);
  const armor = ARMOR[armorKey] || ARMOR.none;

  let best = { value: armor.base, source: armor.name, shield: hasShield };
  if (armor.dexCap == null) best.value += mods.dex;
  else if (armor.dexCap > 0) best.value += Math.min(mods.dex, armor.dexCap);

  /* Unarmored options only apply with no armour worn. */
  const unarmored = armorKey === "none" || armorKey === "clothes";
  if (unarmored) {
    unarmoredDefenseOptions(state).forEach((opt) => {
      const value = 10 + opt.abilities.reduce((n, a) => n + mods[a], 0);
      const shieldAllowed = !opt.noShield;
      if (value > best.value || (value === best.value && shieldAllowed && !best.shield)) {
        best = { value, source: opt.source, shield: hasShield && shieldAllowed };
      }
    });
  }

  const total = best.value + (best.shield ? 2 : 0);
  return { total, base: best.value, shield: best.shield, source: best.source, armorKey };
}

export function ac(state) { return acDetail(state).total; }

function unarmoredDefenseOptions(state) {
  const out = [];
  classEntries(state).forEach((entry) => {
    const cls = CLASSES[entry.key];
    if (cls.unarmoredDefense) {
      out.push({
        abilities: cls.unarmoredDefense,
        source: cls.name + " Unarmored Defense",
        noShield: !!cls.unarmoredDefenseNoShield
      });
    }
    const sub = entry.subclass && cls.subclasses ? cls.subclasses[entry.subclass] : null;
    if (sub && sub.unarmoredDefense && (entry.levels || 0) >= 3) {
      out.push({ abilities: sub.unarmoredDefense, source: sub.name });
    }
  });
  return out;
}

/* ---------------- Proficiencies ---------------- */

export function proficientSkills(state) {
  const set = new Set();
  classEntries(state).forEach((c) => (c.skills || []).forEach((s) => set.add(s)));
  const bg = BACKGROUNDS[state.backgroundKey];
  if (bg) bg.skills.forEach((s) => set.add(s));
  (state.speciesSkills || []).filter(Boolean).forEach((s) => set.add(s));
  (state.featSkills || []).filter(Boolean).forEach((s) => set.add(s));
  return set;
}

export function expertiseSkills(state) {
  const set = new Set();
  classEntries(state).forEach((c) => (c.expertise || []).forEach((s) => set.add(s)));
  (state.featExpertise || []).forEach((s) => set.add(s));
  return set;
}

/* How many Expertise picks a class owes at its current level. */
export function expertiseOwed(entry) {
  const cls = CLASSES[entry.key];
  if (!cls || !cls.expertiseGrants) return 0;
  return Object.entries(cls.expertiseGrants)
    .filter(([lvl]) => (entry.levels || 0) >= Number(lvl))
    .reduce((n, [, count]) => n + count, 0);
}

export function saveProficiencies(state) {
  /* Only the FIRST class grants saving throw proficiencies; multiclassing
     never adds more (2024 rules). */
  const first = classEntries(state)[0];
  return new Set(first ? CLASSES[first.key].saves : []);
}

export function skillModifier(state, skillKey) {
  const skill = SKILLS[skillKey];
  if (!skill) return 0;
  const mods = abilityMods(state);
  const pb = profBonus(totalLevel(state));
  const prof = proficientSkills(state).has(skillKey);
  const exp = expertiseSkills(state).has(skillKey);
  let m = mods[skill.ab];
  if (exp) m += pb * 2;
  else if (prof) m += pb;
  else m += jackOfAllTradesBonus(state);
  return m;
}

/* Bard's Jack of All Trades: half proficiency on unproficient ability checks. */
function jackOfAllTradesBonus(state) {
  const bard = classEntries(state).find((c) => c.key === "bard");
  if (!bard || (bard.levels || 0) < 2) return 0;
  return Math.floor(profBonus(totalLevel(state)) / 2);
}

/* ---------------- Spellcasting ---------------- */

/* Which class entries actually cast, including the two subclass-driven third
   casters, each with the caster block that applies. */
export function casterEntries(state) {
  const out = [];
  classEntries(state).forEach((entry, i) => {
    const cls = CLASSES[entry.key];
    if (cls.caster) {
      out.push({ entry, index: i, cls, caster: cls.caster, fromSubclass: false });
      return;
    }
    const thirdKey = THIRD_CASTER_SUBCLASSES[entry.key];
    const sub = entry.subclass && cls.subclasses ? cls.subclasses[entry.subclass] : null;
    if (thirdKey && entry.subclass === thirdKey && sub && sub.caster) {
      out.push({ entry, index: i, cls, caster: sub.caster, fromSubclass: true, sub });
    }
  });
  return out;
}

/* Multiclass caster level, Warlock excluded — Pact Magic never merges. */
export function casterLevel(state) {
  let n = 0;
  casterEntries(state).forEach(({ entry, caster }) => {
    if (caster.type === "pact") return;
    const levels = entry.levels || 0;
    if (caster.type === "full") n += levels;
    else if (caster.type === "half") n += Math.floor(levels / 2);
    else if (caster.type === "third") n += Math.floor(levels / 3);
  });
  return n;
}

/* Regular (non-Pact) spell slots.

   RAW: with a single spellcasting class you read that class's own table. Only
   a character with two or more contributing classes uses the combined caster
   level on the full-caster table. */
export function spellSlots(state) {
  const casters = casterEntries(state).filter((c) => c.caster.type !== "pact");
  if (casters.length === 0) return [];

  if (casters.length === 1) {
    const { entry, caster } = casters[0];
    const level = entry.levels || 0;
    if (caster.type === "full") return FULL_CASTER_SLOTS[level] || [];
    if (caster.type === "half") return HALF_CASTER_SLOTS[level] || [];
    if (caster.type === "third") return THIRD_CASTER_SLOTS[level] || [];
    return [];
  }

  return FULL_CASTER_SLOTS[Math.min(MAX_LEVEL, casterLevel(state))] || [];
}

export function pactMagic(state) {
  const warlock = classEntries(state).find((c) => c.key === "warlock");
  if (!warlock || !warlock.levels) return null;
  return PACT_MAGIC[Math.min(MAX_LEVEL, warlock.levels)] || null;
}

/* Per-class cantrip and prepared-spell allowances, which are always read off
   that class's own table at that class's own level — never merged. */
export function spellAllowances(state) {
  return casterEntries(state).map(({ entry, cls, caster, fromSubclass, sub }) => {
    const level = entry.levels || 0;
    const i = level - 1;
    const cantrips = caster.cantripsByLevel ? (caster.cantripsByLevel[i] || 0) : 0;
    const prepared = caster.preparedByLevel ? (caster.preparedByLevel[i] || 0) : 0;
    return {
      classKey: entry.key,
      label: fromSubclass ? `${cls.name} (${sub.name})` : cls.name,
      ability: caster.ability,
      listKey: caster.listKey,
      prepMode: caster.prepMode,
      swapOnLevel: !!caster.swapOnLevel,
      focus: caster.focus,
      cantrips,
      prepared,
      spellbook: caster.prepMode === "spellbook"
        ? caster.spellbookStart + Math.max(0, level - 1) * caster.spellbookPerLevel
        : null
    };
  });
}

export function spellSaveDC(state, ability) {
  return 8 + profBonus(totalLevel(state)) + abilityMods(state)[ability];
}

export function spellAttackBonus(state, ability) {
  return profBonus(totalLevel(state)) + abilityMods(state)[ability];
}

/* ---------------- Subclasses ---------------- */

/* Every class chooses its subclass at level 3 in the 2024 rules. */
export function pendingSubclasses(state) {
  return classEntries(state)
    .map((entry, index) => ({ entry, index, cls: CLASSES[entry.key] }))
    .filter(({ entry, cls }) => (entry.levels || 0) >= cls.subclassLevel && !entry.subclass);
}

export function subclassChoicesFor(entry) {
  const cls = CLASSES[entry.key];
  if (!cls || !cls.subclasses) return [];
  return Object.entries(cls.subclasses).map(([key, sub]) => ({ key, ...sub }));
}

/* ---------------- Level-gated class choices ---------------- */

/* Choices a class owes at its current level (Divine Order, Fighting Style,
   Blessed Strikes, and so on) that the player hasn't answered yet. */
export function pendingClassChoices(state) {
  const out = [];
  classEntries(state).forEach((entry, index) => {
    const cls = CLASSES[entry.key];
    (cls.choices || []).forEach((choice) => {
      if ((entry.levels || 0) < choice.level) return;
      const answered = entry.choices && entry.choices[choice.key];
      if (!answered) out.push({ index, entry, cls, choice });
    });
  });
  return out;
}

/* ---------------- Feat slots ---------------- */

/* Requirement 7: a feat is owed at every ASI level of every class, plus the
   Epic Boon at level 19 — and starting a character above level 1 means all
   the earlier ones are owed retroactively, not skipped.

   Slot ids are stable across edits: "<classIndex>:<classLevel>". */
export function featSlots(state) {
  const out = [];

  /* An Origin feat from the background, always. */
  const bg = BACKGROUNDS[state.backgroundKey];
  if (bg) {
    out.push({
      id: "background",
      kind: "origin",
      label: "Background feat",
      source: bg.name,
      fixedFeat: bg.feat,
      charLevel: 1
    });
  }

  /* The Human's Versatile trait grants a free Origin feat. */
  const species = SPECIES[state.speciesKey];
  if (species && species.grantsOriginFeat) {
    out.push({
      id: "species",
      kind: "origin",
      label: "Species feat",
      source: species.name + " (Versatile)",
      charLevel: 1
    });
  }

  /* Class ASI and Epic Boon levels. */
  const log = levelLog(state);
  classEntries(state).forEach((entry, index) => {
    const cls = CLASSES[entry.key];
    (cls.asiLevels || []).forEach((lvl) => {
      if ((entry.levels || 0) < lvl) return;
      out.push({
        id: `${index}:${lvl}`,
        kind: "general",
        label: `${cls.name} ${lvl}`,
        source: "Ability Score Improvement",
        classIndex: index,
        classKey: entry.key,
        classLevel: lvl,
        charLevel: charLevelOf(log, index, lvl),
        feature: ASI_FEATURE
      });
    });
    if (cls.epicBoonLevel && (entry.levels || 0) >= cls.epicBoonLevel) {
      out.push({
        id: `${index}:${cls.epicBoonLevel}`,
        kind: "boon",
        label: `${cls.name} ${cls.epicBoonLevel}`,
        source: "Epic Boon",
        classIndex: index,
        classKey: entry.key,
        classLevel: cls.epicBoonLevel,
        charLevel: charLevelOf(log, index, cls.epicBoonLevel),
        feature: EPIC_BOON_FEATURE
      });
    }
  });

  return out.sort((a, b) => (a.charLevel || 0) - (b.charLevel || 0));
}

function charLevelOf(log, classIndex, classLevel) {
  const hit = log.find((l) => l.classIndex === classIndex && l.classLevel === classLevel);
  return hit ? hit.charLevel : null;
}

export function pendingFeatSlots(state) {
  const picks = state.featPicks || {};
  return featSlots(state).filter((slot) => {
    if (slot.fixedFeat) return false;
    const pick = picks[slot.id];
    return !pick || !pick.featKey;
  });
}

export function ownedFeatKeys(state) {
  const keys = [];
  featSlots(state).forEach((slot) => {
    if (slot.fixedFeat) { keys.push(slot.fixedFeat); return; }
    const pick = (state.featPicks || {})[slot.id];
    if (pick && pick.featKey) keys.push(pick.featKey);
  });
  return keys;
}

/* Which feats a slot may take, with prerequisites applied. */
export function featOptionsFor(state, slot) {
  const scores = finalAbilities(state);
  const owned = new Set(ownedFeatKeys(state));
  return Object.entries(FEATS)
    .filter(([, f]) => f.category === slot.kind)
    .map(([key, f]) => {
      const already = owned.has(key) && !f.repeatable;
      const gated = f.prereqFn ? !f.prereqFn(scores) : false;
      return { key, ...f, disabled: already || gated, disabledReason: already ? "Already taken" : (gated ? f.prereq : null) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* ---------------- Feature list for the sheet ---------------- */

/* Everything the character has, grouped by class, in level order. Includes
   subclass features and the generic ASI/Epic Boon entries. */
export function featuresByClass(state) {
  return classEntries(state).map((entry, index) => {
    const cls = CLASSES[entry.key];
    const levels = entry.levels || 0;
    const rows = [];

    for (let lvl = 1; lvl <= levels; lvl++) {
      (cls.features[lvl] || []).forEach((f) => rows.push({ level: lvl, ...f }));

      if ((cls.asiLevels || []).includes(lvl)) {
        rows.push({ level: lvl, ...featOrStub(state, index, lvl, ASI_FEATURE) });
      }
      if (cls.epicBoonLevel === lvl) {
        rows.push({ level: lvl, ...featOrStub(state, index, lvl, EPIC_BOON_FEATURE) });
      }
      if (lvl === cls.subclassLevel && !entry.subclass) {
        rows.push({ level: lvl, name: cls.subclassLabel, text: "Not chosen yet.", pending: true });
      }

      const sub = entry.subclass && cls.subclasses ? cls.subclasses[entry.subclass] : null;
      if (sub && sub.features && sub.features[lvl]) {
        sub.features[lvl].forEach((f) => rows.push({ level: lvl, subclass: sub.name, ...f }));
      }
    }

    return {
      index,
      classKey: entry.key,
      className: cls.name,
      levels,
      subclassName: entry.subclass && cls.subclasses ? cls.subclasses[entry.subclass].name : null,
      rows
    };
  });
}

/* If a feat slot has been filled, show the chosen feat rather than the stub. */
function featOrStub(state, classIndex, classLevel, stub) {
  const pick = (state.featPicks || {})[`${classIndex}:${classLevel}`];
  if (pick && pick.featKey && FEATS[pick.featKey]) {
    const f = FEATS[pick.featKey];
    return { name: f.name, text: f.text, isFeat: true };
  }
  return { ...stub, pending: true };
}

/* Per-level counters (Rages, Focus Points, Superiority Dice, …). */
export function tracksFor(state) {
  const out = [];
  classEntries(state).forEach((entry) => {
    const cls = CLASSES[entry.key];
    const i = (entry.levels || 0) - 1;
    if (i < 0) return;
    (cls.tracks || []).forEach((t) => {
      const value = t.byLevel[i];
      if (value === 0 || value == null) return;
      out.push({
        label: t.label,
        value: `${t.prefix || ""}${value}${t.suffix || ""}`,
        classKey: entry.key
      });
    });
  });
  return out;
}

/* ---------------- Validation ---------------- */

export function classStepIssues(state) {
  const issues = [];
  const entries = classEntries(state);
  if (entries.length === 0) issues.push("Pick at least one class.");
  const total = totalLevel(state);
  if (total < 1) issues.push("Assign at least one level.");
  if (total > MAX_LEVEL) issues.push(`Total level is ${total}; the maximum is ${MAX_LEVEL}.`);

  entries.forEach((entry) => {
    const cls = CLASSES[entry.key];
    const want = cls.skillCount;
    const got = (entry.skills || []).length;
    if (got !== want) issues.push(`${cls.name}: choose ${want} skill${want === 1 ? "" : "s"} (${got} chosen).`);
    if (!entry.equipment) issues.push(`${cls.name}: choose a starting equipment option.`);
    const expWant = expertiseOwed(entry);
    const expGot = (entry.expertise || []).length;
    if (expWant && expGot !== expWant) issues.push(`${cls.name}: choose ${expWant} Expertise skill${expWant === 1 ? "" : "s"} (${expGot} chosen).`);
  });

  pendingSubclasses(state).forEach(({ cls }) => {
    issues.push(`${cls.name}: choose a ${cls.subclassLabel} (due at level ${cls.subclassLevel}).`);
  });

  pendingClassChoices(state).forEach(({ cls, choice }) => {
    issues.push(`${cls.name}: choose ${choice.label}.`);
  });

  return issues;
}

export function hpStepIssues(state) {
  const pending = hpPendingLevels(state);
  if (pending.length === 0) return [];
  return [`Enter a hit die roll for level${pending.length === 1 ? "" : "s"} ${pending.join(", ")}.`];
}

export function featStepIssues(state) {
  const pending = pendingFeatSlots(state);
  if (pending.length === 0) return [];
  return pending.map((s) => `Choose a feat for ${s.label} (${s.source}).`);
}

export function abilityStepIssues(state) {
  const issues = [];
  const assign = state.abilityAssign || {};
  const unset = ABILS.filter((a) => assign[a] == null);
  if (unset.length) issues.push("Assign every ability score.");
  if (state.abilityMethod === "pointbuy" && pointBuyCost(assign) > 27) {
    issues.push("Point buy is over budget.");
  }
  if (!state.backgroundKey) return issues;
  const ch = state.bgChoices || {};
  if (ch.mode !== "spread") {
    const [p2, p1] = ch.abilityPicks || [];
    if (!p2 || !p1 || p2 === p1) issues.push("Choose which background ability gets +2 and which gets +1.");
  }
  return issues;
}
