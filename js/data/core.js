/* Shared constants: abilities, skills, alignments, armour, and the
   progression tables that more than one class uses. */

export const ABILS = ["str", "dex", "con", "int", "wis", "cha"];

export const ABIL_NAME = {
  str: "Strength", dex: "Dexterity", con: "Constitution",
  int: "Intelligence", wis: "Wisdom", cha: "Charisma"
};

export const ABIL_ABBR = {
  str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA"
};

export const SKILLS = {
  athletics:      { name: "Athletics",        ab: "str" },
  acrobatics:     { name: "Acrobatics",       ab: "dex" },
  sleightOfHand:  { name: "Sleight of Hand",  ab: "dex" },
  stealth:        { name: "Stealth",          ab: "dex" },
  arcana:         { name: "Arcana",           ab: "int" },
  history:        { name: "History",          ab: "int" },
  investigation:  { name: "Investigation",    ab: "int" },
  nature:         { name: "Nature",           ab: "int" },
  religion:       { name: "Religion",         ab: "int" },
  animalHandling: { name: "Animal Handling",  ab: "wis" },
  insight:        { name: "Insight",          ab: "wis" },
  medicine:       { name: "Medicine",         ab: "wis" },
  perception:     { name: "Perception",       ab: "wis" },
  survival:       { name: "Survival",         ab: "wis" },
  deception:      { name: "Deception",        ab: "cha" },
  intimidation:   { name: "Intimidation",     ab: "cha" },
  performance:    { name: "Performance",      ab: "cha" },
  persuasion:     { name: "Persuasion",       ab: "cha" }
};

export const ALL_SKILL_KEYS = Object.keys(SKILLS);

export const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
export const PB_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const PB_BUDGET = 27;

/* ---------- Armour ----------
   dexCap: null = add full Dex, a number = cap the Dex bonus, 0 = no Dex. */
export const ARMOR = {
  none:        { name: "No armor",                base: 10, dexCap: null, category: "none" },
  clothes:     { name: "Clothing / robe",         base: 10, dexCap: null, category: "none" },
  padded:      { name: "Padded Armor",            base: 11, dexCap: null, category: "light", stealthDis: true },
  leather:     { name: "Leather Armor",           base: 11, dexCap: null, category: "light" },
  studded:     { name: "Studded Leather Armor",   base: 12, dexCap: null, category: "light" },
  hide:        { name: "Hide Armor",              base: 12, dexCap: 2,    category: "medium" },
  chainShirt:  { name: "Chain Shirt",             base: 13, dexCap: 2,    category: "medium" },
  scaleMail:   { name: "Scale Mail",              base: 14, dexCap: 2,    category: "medium", stealthDis: true },
  breastplate: { name: "Breastplate",             base: 14, dexCap: 2,    category: "medium" },
  halfPlate:   { name: "Half Plate Armor",        base: 15, dexCap: 2,    category: "medium", stealthDis: true },
  ringMail:    { name: "Ring Mail",               base: 14, dexCap: 0,    category: "heavy", stealthDis: true },
  chainMail:   { name: "Chain Mail",              base: 16, dexCap: 0,    category: "heavy", strReq: 13, stealthDis: true },
  splint:      { name: "Splint Armor",            base: 17, dexCap: 0,    category: "heavy", strReq: 15, stealthDis: true },
  plate:       { name: "Plate Armor",             base: 18, dexCap: 0,    category: "heavy", strReq: 15, stealthDis: true }
};

/* ---------- Spell slot tables ---------- */

/* Full casters: Bard, Cleric, Druid, Sorcerer, Wizard. Also the table a
   multiclass character's combined caster level is looked up on. */
export const FULL_CASTER_SLOTS = {
  1:  [2],
  2:  [3],
  3:  [4, 2],
  4:  [4, 3],
  5:  [4, 3, 2],
  6:  [4, 3, 3],
  7:  [4, 3, 3, 1],
  8:  [4, 3, 3, 2],
  9:  [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2],
  11: [4, 3, 3, 3, 2, 1],
  12: [4, 3, 3, 3, 2, 1],
  13: [4, 3, 3, 3, 2, 1, 1],
  14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1],
  16: [4, 3, 3, 3, 2, 1, 1, 1],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
};

/* Half casters: Paladin and Ranger, both of which gain Spellcasting at
   level 1 under the 2024 rules. */
export const HALF_CASTER_SLOTS = {
  1:  [2],
  2:  [2],
  3:  [3],
  4:  [3],
  5:  [4, 2],
  6:  [4, 2],
  7:  [4, 3],
  8:  [4, 3],
  9:  [4, 3, 2],
  10: [4, 3, 2],
  11: [4, 3, 3],
  12: [4, 3, 3],
  13: [4, 3, 3, 1],
  14: [4, 3, 3, 1],
  15: [4, 3, 3, 2],
  16: [4, 3, 3, 2],
  17: [4, 3, 3, 3, 1],
  18: [4, 3, 3, 3, 1],
  19: [4, 3, 3, 3, 2],
  20: [4, 3, 3, 3, 2]
};

/* Third casters: Eldritch Knight and Arcane Trickster, which begin at
   subclass level 3. Indexed by the FULL class level. */
export const THIRD_CASTER_SLOTS = {
  3:  [2],
  4:  [3],
  5:  [3],
  6:  [3],
  7:  [4, 2],
  8:  [4, 2],
  9:  [4, 2],
  10: [4, 3],
  11: [4, 3],
  12: [4, 3],
  13: [4, 3, 2],
  14: [4, 3, 2],
  15: [4, 3, 2],
  16: [4, 3, 3],
  17: [4, 3, 3],
  18: [4, 3, 3],
  19: [4, 3, 3, 1],
  20: [4, 3, 3, 1]
};

/* Warlock Pact Magic: slot count and the level every slot is cast at.
   Kept entirely separate from the tables above — Pact Magic never merges
   into a multiclass character's regular slots. */
export const PACT_MAGIC = {
  1:  { slots: 1, level: 1 },  2:  { slots: 2, level: 1 },
  3:  { slots: 2, level: 2 },  4:  { slots: 2, level: 2 },
  5:  { slots: 2, level: 3 },  6:  { slots: 2, level: 3 },
  7:  { slots: 2, level: 4 },  8:  { slots: 2, level: 4 },
  9:  { slots: 2, level: 5 },  10: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },  12: { slots: 3, level: 5 },
  13: { slots: 3, level: 5 },  14: { slots: 3, level: 5 },
  15: { slots: 3, level: 5 },  16: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 },  18: { slots: 4, level: 5 },
  19: { slots: 4, level: 5 },  20: { slots: 4, level: 5 }
};

/* The ASI feature grants a feat choice; these are the generic entries the
   builder shows at those levels. */
export const ASI_FEATURE = {
  name: "Ability Score Improvement",
  text: "Take the Ability Score Improvement feat (+2 to one score, or +1 to two) or any other feat you qualify for."
};

export const EPIC_BOON_FEATURE = {
  name: "Epic Boon",
  text: "Take an Epic Boon feat, or any other feat you qualify for."
};

export const SIZES = { small: "Small", medium: "Medium" };
