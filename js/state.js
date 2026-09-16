/* Character state: shape, defaults, and localStorage persistence.

   Storage keys (do not rename without a migration):
     oo.draft              the in-progress character
     oo.characters.index   [{id, name, summary, updated}]
     oo.character.<id>     one full saved character

   There is no server and no cross-device sync — this is per-browser only. */

import { ABILS } from "./data/core.js";

export const STATE_VERSION = 2;

export const STEPS = ["class", "species", "background", "abilities", "hp", "feats", "identity", "sheet"];

export const STEP_LABEL = {
  class: "Classes & Levels",
  species: "Species",
  background: "Background",
  abilities: "Ability Scores",
  hp: "Hit Points",
  feats: "Feats",
  identity: "Details",
  sheet: "Character Sheet"
};

const DRAFT_KEY = "oo.draft";
const INDEX_KEY = "oo.characters.index";
const CHAR_KEY = (id) => `oo.character.${id}`;

export function newClassEntry(key) {
  return {
    key,
    levels: 1,
    subclass: null,
    skills: [],
    expertise: [],
    equipment: null,
    choices: {}
  };
}

export function defaultState() {
  const abilityAssign = {};
  ABILS.forEach((a) => { abilityAssign[a] = null; });
  return {
    version: STATE_VERSION,
    id: null,               // set on first save
    step: 0,
    name: "",

    classes: [],            // ordered; classes[0] is the starting class

    speciesKey: null,
    speciesLineage: null,
    speciesSkills: [],

    backgroundKey: null,
    bgChoices: { mode: "twoOne", abilityPicks: [null, null] },

    abilityMethod: "standard",   // standard | pointbuy | manual
    abilityAssign,

    hpRolls: {},            // { "<charLevel>": number }

    featPicks: {},          // { "<slotId>": { featKey, abilityBumps? } }
    featSkills: [],
    featExpertise: [],

    armorOverride: null,    // lets the player pick armour independent of the kit
    shieldOverride: null,

    alignment: null,
    pronouns: "",
    appearance: "",
    backstory: ""
  };
}

/* ---------------- Draft persistence ---------------- */

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return defaultState();
    return migrate(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function saveDraft(state) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {
    /* Quota or a private window; the app still works for this session. */
  }
}

export function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
}

/* Fill in anything a stored state predates, so an old draft never crashes a
   newer build. Version 1 was the single-file level-1-only builder, which had
   `className` and a flat `classChoices` object instead of `classes`. */
export function migrate(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== "object") return base;

  const out = { ...base, ...raw };

  /* Version 1 → 2: one class, always level 1. */
  if (!Array.isArray(out.classes)) out.classes = [];
  if (out.classes.length === 0 && raw.className) {
    const old = raw.classChoices || {};
    out.classes = [{
      key: raw.className,
      levels: 1,
      subclass: null,
      skills: Array.isArray(old.skills) ? old.skills : [],
      expertise: Array.isArray(old.expertise) ? old.expertise : [],
      equipment: old.equipment || null,
      choices: {}
    }];
  }
  if (raw.speciesName && !out.speciesKey) out.speciesKey = raw.speciesName;
  if (raw.background && !out.backgroundKey) out.backgroundKey = raw.background;

  out.bgChoices = { ...base.bgChoices, ...(raw.bgChoices || {}) };
  if (!Array.isArray(out.bgChoices.abilityPicks)) out.bgChoices.abilityPicks = [null, null];

  out.abilityAssign = { ...base.abilityAssign, ...(raw.abilityAssign || {}) };
  out.hpRolls = raw.hpRolls && typeof raw.hpRolls === "object" ? { ...raw.hpRolls } : {};
  out.featPicks = raw.featPicks && typeof raw.featPicks === "object" ? { ...raw.featPicks } : {};
  ["speciesSkills", "featSkills", "featExpertise"].forEach((k) => {
    if (!Array.isArray(out[k])) out[k] = [];
  });

  /* Normalize each class entry so a partially-written one can't break render. */
  out.classes = out.classes.filter((c) => c && c.key).map((c) => ({
    key: c.key,
    levels: clampLevels(c.levels),
    subclass: c.subclass || null,
    skills: Array.isArray(c.skills) ? c.skills : [],
    expertise: Array.isArray(c.expertise) ? c.expertise : [],
    equipment: c.equipment || null,
    choices: c.choices && typeof c.choices === "object" ? { ...c.choices } : {}
  }));

  out.version = STATE_VERSION;
  return out;
}

function clampLevels(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 1;
  return Math.max(1, Math.min(20, Math.floor(v)));
}

/* ---------------- Saved characters ---------------- */

export function loadIndex() {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIndex(list) {
  try { localStorage.setItem(INDEX_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export function saveCharacter(state, summary) {
  const id = state.id || makeId();
  const stored = { ...state, id, version: STATE_VERSION };
  try {
    localStorage.setItem(CHAR_KEY(id), JSON.stringify(stored));
  } catch {
    return null;
  }
  const list = loadIndex().filter((e) => e.id !== id);
  list.unshift({
    id,
    name: state.name || "Unnamed character",
    summary: summary || "",
    updated: new Date().toISOString()
  });
  writeIndex(list);
  return id;
}

export function loadCharacter(id) {
  try {
    const raw = localStorage.getItem(CHAR_KEY(id));
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function deleteCharacter(id) {
  try { localStorage.removeItem(CHAR_KEY(id)); } catch { /* ignore */ }
  writeIndex(loadIndex().filter((e) => e.id !== id));
}

function makeId() {
  return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------------- Export / import ---------------- */

/* A real Blob download and a real file input — there is no host capability
   involved, this is a plain static site. */
export function exportCharacter(state) {
  const payload = JSON.stringify({ app: "origin-and-order", version: STATE_VERSION, character: state }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (state.name || "character").replace(/[^\w-]+/g, "-").toLowerCase() + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseImported(text) {
  const parsed = JSON.parse(text);
  const character = parsed && parsed.character ? parsed.character : parsed;
  const migrated = migrate(character);
  migrated.id = null;   // imported characters save as new entries
  return migrated;
}
