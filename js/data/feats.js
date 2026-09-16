/* Feats — 2024 rules. Our own short mechanical paraphrase, never book prose.

   Three categories matter to the builder:
   - `origin`  : granted by a background, or by the Human's Versatile trait.
                 Available at level 1.
   - `general` : the menu at every Ability Score Improvement level.
   - `boon`    : the menu at level 19 (Epic Boon).

   `prereq` is free text shown to the player; `prereqFn` (where present) is
   the machine-checkable version the builder uses to grey out options. */

export const FEATS = {
  /* ---------------- Origin feats ---------------- */
  alert: {
    name: "Alert", category: "origin",
    text: "Add your Proficiency Bonus to Initiative, and you can swap Initiative with a willing ally."
  },
  crafter: {
    name: "Crafter", category: "origin",
    text: "Proficiency with three Artisan's Tools, a 20% discount on nonmagical gear, and you can craft one temporary tool on a Long Rest."
  },
  healer: {
    name: "Healer", category: "origin",
    text: "Utilize action, one Healer's Kit use: a creature spends a Hit Die and heals that roll + your Proficiency Bonus. You also reroll 1s on healing dice."
  },
  lucky: {
    name: "Lucky", category: "origin",
    text: "Luck Points equal to your Proficiency Bonus, refilled on a Long Rest: spend one for Advantage on a d20 Test, or to impose Disadvantage on an attack against you."
  },
  magicInitiateCleric: {
    name: "Magic Initiate (Cleric)", category: "origin",
    text: "Two Cleric cantrips and one level 1 Cleric spell, always prepared and castable free once per Long Rest. Wisdom is the ability for them."
  },
  magicInitiateDruid: {
    name: "Magic Initiate (Druid)", category: "origin",
    text: "Two Druid cantrips and one level 1 Druid spell, always prepared and castable free once per Long Rest. Wisdom is the ability for them."
  },
  magicInitiateWizard: {
    name: "Magic Initiate (Wizard)", category: "origin",
    text: "Two Wizard cantrips and one level 1 Wizard spell, always prepared and castable free once per Long Rest. Intelligence is the ability for them."
  },
  musician: {
    name: "Musician", category: "origin",
    text: "Proficiency with three Musical Instruments, and after a rest you can grant Heroic Inspiration to allies who heard you play."
  },
  savageAttacker: {
    name: "Savage Attacker", category: "origin",
    text: "Once per turn on a weapon hit, roll the damage dice twice and use either result."
  },
  skilled: {
    name: "Skilled", category: "origin",
    text: "Proficiency in any three skills or tools of your choice.",
    grantsSkillOrTool: 3
  },
  tavernBrawler: {
    name: "Tavern Brawler", category: "origin",
    text: "Unarmed Strikes deal 1d4 + Strength and reroll 1s, you're proficient with improvised weapons, and once per turn a hit can push the target 5 ft."
  },
  tough: {
    name: "Tough", category: "origin",
    text: "Your HP maximum increases by twice your character level, and by 2 more at every level after.",
    hpBonusPerLevel: 2
  },

  /* ---------------- General feats (ASI levels) ---------------- */
  abilityScoreImprovement: {
    name: "Ability Score Improvement", category: "general", repeatable: true,
    text: "+2 to one ability score, or +1 to two of them, up to a maximum of 20.",
    asi: true
  },
  actor: {
    name: "Actor", category: "general", prereq: "Charisma 13+",
    prereqFn: (s) => s.cha >= 13,
    text: "+1 Charisma (max 20), Advantage on Deception and Performance checks made to pass as someone else, and you can mimic a voice you've heard."
  },
  athlete: {
    name: "Athlete", category: "general", prereq: "Strength or Dexterity 13+",
    prereqFn: (s) => s.str >= 13 || s.dex >= 13,
    text: "+1 Strength or Dexterity (max 20), standing up costs only 5 ft. of movement, and you can climb at your full Speed."
  },
  charger: {
    name: "Charger", category: "general", prereq: "Strength or Dexterity 13+",
    prereqFn: (s) => s.str >= 13 || s.dex >= 13,
    text: "+1 Strength or Dexterity (max 20). After a Dash as a Bonus Action, one attack that turn adds 1d8 damage, or shoves the target 10 ft."
  },
  chef: {
    name: "Chef", category: "general",
    text: "+1 Constitution or Wisdom (max 20), Cook's Utensils proficiency, and on a Short Rest you can feed allies Temporary HP or hand out treats."
  },
  crossbowExpert: {
    name: "Crossbow Expert", category: "general", prereq: "Dexterity 13+",
    prereqFn: (s) => s.dex >= 13,
    text: "+1 Dexterity (max 20), ignore the Loading property, no Disadvantage on ranged attacks within 5 ft., and Bonus Action Hand Crossbow attacks."
  },
  crusher: {
    name: "Crusher", category: "general",
    text: "+1 Strength or Constitution (max 20). Once per turn on Bludgeoning damage, move the target 5 ft.; a Critical Hit gives attackers Advantage against it until your next turn."
  },
  defensiveDuelist: {
    name: "Defensive Duelist", category: "general", prereq: "Dexterity 13+",
    prereqFn: (s) => s.dex >= 13,
    text: "+1 Dexterity (max 20). Reaction while wielding a Finesse weapon: add your Proficiency Bonus to AC against one attack."
  },
  dualWielder: {
    name: "Dual Wielder", category: "general", prereq: "Strength or Dexterity 13+",
    prereqFn: (s) => s.str >= 13 || s.dex >= 13,
    text: "+1 Strength or Dexterity (max 20). Two-weapon fighting works with non-Light one-handed weapons, and you can draw or stow two weapons at once."
  },
  durable: {
    name: "Durable", category: "general",
    text: "+1 Constitution (max 20), and spending Hit Dice always heals at least twice your Constitution modifier per die. You also regain more dice on a Long Rest."
  },
  elementalAdept: {
    name: "Elemental Adept", category: "general", repeatable: true, prereq: "Spellcasting or Pact Magic",
    text: "+1 Intelligence, Wisdom, or Charisma (max 20). Your spells ignore Resistance to one chosen damage type, and their damage dice never roll below 2."
  },
  feyTouched: {
    name: "Fey-Touched", category: "general",
    text: "+1 Intelligence, Wisdom, or Charisma (max 20). Misty Step plus one level 1 Divination or Enchantment spell, both always prepared and each castable free once per Long Rest."
  },
  grappler: {
    name: "Grappler", category: "general", prereq: "Strength or Dexterity 13+",
    prereqFn: (s) => s.str >= 13 || s.dex >= 13,
    text: "+1 Strength or Dexterity (max 20), Advantage on attacks against creatures you're Grappling, and a Grapple can also move the target with you."
  },
  greatWeaponMaster: {
    name: "Great Weapon Master", category: "general", prereq: "Strength 13+",
    prereqFn: (s) => s.str >= 13,
    text: "+1 Strength (max 20). A Critical Hit or a kill with a Heavy weapon grants a Bonus Action attack, and Heavy weapon damage adds your Proficiency Bonus."
  },
  heavilyArmored: {
    name: "Heavily Armored", category: "general", prereq: "Medium armor training",
    text: "+1 Strength (max 20) and Heavy armor training."
  },
  heavyArmorMaster: {
    name: "Heavy Armor Master", category: "general", prereq: "Heavy armor training",
    text: "+1 Strength (max 20), and while in Heavy armor Bludgeoning, Piercing, and Slashing damage is reduced by your Proficiency Bonus."
  },
  inspiringLeader: {
    name: "Inspiring Leader", category: "general",
    text: "+1 Wisdom or Charisma (max 20). A 10-minute speech gives up to six creatures Temporary HP equal to your character level + that ability's modifier."
  },
  keenMind: {
    name: "Keen Mind", category: "general",
    text: "+1 Intelligence (max 20), you always know which way is north and how long until the next sunrise, and you can Study as a Bonus Action."
  },
  lightlyArmored: {
    name: "Lightly Armored", category: "general",
    text: "+1 Strength or Dexterity (max 20) and Light armor training."
  },
  mageSlayer: {
    name: "Mage Slayer", category: "general",
    text: "+1 Strength or Dexterity (max 20). Once per turn, hitting a Concentrating creature adds damage and gives it Disadvantage on the Concentration save, and you have Advantage on saves against its spells while adjacent."
  },
  martialWeaponTraining: {
    name: "Martial Weapon Training", category: "general",
    text: "+1 Strength or Dexterity (max 20) and Martial weapon proficiency."
  },
  mediumArmorMaster: {
    name: "Medium Armor Master", category: "general", prereq: "Medium armor training",
    text: "+1 Strength or Dexterity (max 20), Medium armor no longer hampers Stealth, and it allows up to +3 Dex to AC."
  },
  moderatelyArmored: {
    name: "Moderately Armored", category: "general", prereq: "Light armor training",
    text: "+1 Strength or Dexterity (max 20), plus Medium armor and Shield training."
  },
  mountedCombatant: {
    name: "Mounted Combatant", category: "general",
    text: "+1 Strength, Dexterity, or Wisdom (max 20). Advantage on attacks against unmounted creatures smaller than your mount, and you can redirect attacks aimed at it."
  },
  observant: {
    name: "Observant", category: "general", prereq: "Intelligence or Wisdom 13+",
    prereqFn: (s) => s.int >= 13 || s.wis >= 13,
    text: "+1 Intelligence or Wisdom (max 20), proficiency in Insight, Investigation, or Perception, and you can Search as a Bonus Action."
  },
  piercer: {
    name: "Piercer", category: "general",
    text: "+1 Strength or Dexterity (max 20). Once per turn, reroll one Piercing damage die, and a Critical Hit adds another damage die."
  },
  poisoner: {
    name: "Poisoner", category: "general",
    text: "+1 Dexterity or Intelligence (max 20), Poisoner's Kit proficiency, your poison ignores Resistance, and you can coat a weapon as a Bonus Action."
  },
  polearmMaster: {
    name: "Polearm Master", category: "general", prereq: "Strength or Dexterity 13+",
    prereqFn: (s) => s.str >= 13 || s.dex >= 13,
    text: "+1 Strength or Dexterity (max 20). A Bonus Action butt-end attack for 1d4, and Opportunity Attacks when a creature enters your reach with a polearm."
  },
  resilient: {
    name: "Resilient", category: "general",
    text: "+1 to one ability score of your choice (max 20), and proficiency in that ability's saving throws."
  },
  ritualCaster: {
    name: "Ritual Caster", category: "general", prereq: "Intelligence, Wisdom, or Charisma 13+",
    prereqFn: (s) => s.int >= 13 || s.wis >= 13 || s.cha >= 13,
    text: "+1 Intelligence, Wisdom, or Charisma (max 20), and a ritual book holding two level 1 Ritual spells you can cast as Rituals, growing as you level."
  },
  sentinel: {
    name: "Sentinel", category: "general", prereq: "Strength or Dexterity 13+",
    prereqFn: (s) => s.str >= 13 || s.dex >= 13,
    text: "+1 Strength or Dexterity (max 20). An Opportunity Attack hit drops the target's Speed to 0, and you can react when a creature within 5 ft. attacks someone else."
  },
  shadowTouched: {
    name: "Shadow-Touched", category: "general",
    text: "+1 Intelligence, Wisdom, or Charisma (max 20). Invisibility plus one level 1 Illusion or Necromancy spell, both always prepared and each castable free once per Long Rest."
  },
  sharpshooter: {
    name: "Sharpshooter", category: "general", prereq: "Dexterity 13+",
    prereqFn: (s) => s.dex >= 13,
    text: "+1 Dexterity (max 20). Ranged attacks ignore Half and Three-Quarters Cover, Long Range costs no Disadvantage, and their damage adds your Proficiency Bonus."
  },
  shieldMaster: {
    name: "Shield Master", category: "general", prereq: "Shield training",
    text: "+1 Strength (max 20). Bonus Action Shield shove, your Shield's AC bonus applies to Dex saves, and you can interpose it to avoid damage entirely."
  },
  skillExpert: {
    name: "Skill Expert", category: "general",
    text: "+1 to one ability score (max 20), proficiency in one skill, and Expertise in one skill you're proficient with.",
    grantsExpertise: 1
  },
  skulker: {
    name: "Skulker", category: "general", prereq: "Dexterity 13+",
    prereqFn: (s) => s.dex >= 13,
    text: "+1 Dexterity (max 20), you can Hide in Dim Light, missing a ranged attack doesn't reveal you, and Darkvision no longer imposes Disadvantage on Perception."
  },
  slasher: {
    name: "Slasher", category: "general",
    text: "+1 Strength or Dexterity (max 20). Once per turn, Slashing damage cuts the target's Speed by 10 ft.; a Critical Hit gives it Disadvantage on attacks until your next turn."
  },
  speedy: {
    name: "Speedy", category: "general", prereq: "Dexterity or Constitution 13+",
    prereqFn: (s) => s.dex >= 13 || s.con >= 13,
    text: "+1 Dexterity or Constitution (max 20), +10 ft. Speed, Dashing ignores Difficult Terrain, and Opportunity Attacks against you have Disadvantage after you Dash."
  },
  spellSniper: {
    name: "Spell Sniper", category: "general", prereq: "Spellcasting or Pact Magic",
    text: "+1 Intelligence, Wisdom, or Charisma (max 20), one attack-roll cantrip, doubled range on your attack-roll spells, and they ignore Half and Three-Quarters Cover."
  },
  telekinetic: {
    name: "Telekinetic", category: "general",
    text: "+1 Intelligence, Wisdom, or Charisma (max 20), Mage Hand cast without components and invisibly, and a Bonus Action telekinetic shove of 5 ft."
  },
  telepathic: {
    name: "Telepathic", category: "general",
    text: "+1 Intelligence, Wisdom, or Charisma (max 20), telepathic speech out to 60 ft., and Detect Thoughts always prepared, castable free once per Long Rest."
  },
  warCaster: {
    name: "War Caster", category: "general", prereq: "Spellcasting or Pact Magic",
    text: "+1 Intelligence, Wisdom, or Charisma (max 20), Advantage on Concentration saves, you can cast with hands full, and Opportunity Attacks can be spells."
  },
  weaponMaster: {
    name: "Weapon Master", category: "general",
    text: "+1 Strength or Dexterity (max 20), and you gain the Weapon Mastery property of two kinds of weapons, swappable on a Long Rest."
  },

  /* ---------------- Epic Boon feats (level 19) ---------------- */
  boonCombatProwess: {
    name: "Boon of Combat Prowess", category: "boon",
    text: "+1 to one ability score (max 30). Once per turn, turn a missed weapon attack into a hit."
  },
  boonDimensionalTravel: {
    name: "Boon of Dimensional Travel", category: "boon",
    text: "+1 to one ability score (max 30). After the Attack or Magic action, teleport up to 30 ft."
  },
  boonEnergyResistance: {
    name: "Boon of Energy Resistance", category: "boon",
    text: "+1 to one ability score (max 30). Resistance to two damage types of your choice, and a Reaction to halve one instance of that damage to someone within 30 ft."
  },
  boonFate: {
    name: "Boon of Fate", category: "boon",
    text: "+1 to one ability score (max 30). Once per turn, replace a d20 Test within 60 ft. with a 2d6 roll instead."
  },
  boonFortitude: {
    name: "Boon of Fortitude", category: "boon",
    text: "+1 to one ability score (max 30). +40 HP maximum, and spending a Hit Die also adds your Proficiency Bonus to the healing.",
    hpBonusFlat: 40
  },
  boonIrresistibleOffense: {
    name: "Boon of Irresistible Offense", category: "boon",
    text: "+1 to Strength or Dexterity (max 30). Your weapon and Unarmed Strike damage ignores Resistance, and rolling 20 on a d20 Test adds your ability score to the damage."
  },
  boonRecovery: {
    name: "Boon of Recovery", category: "boon",
    text: "+1 to one ability score (max 30). Bonus Action: heal half your HP maximum, twice per Long Rest. Dropping to 0 HP also leaves you at 1 HP instead, once per Long Rest."
  },
  boonSkill: {
    name: "Boon of Skill", category: "boon",
    text: "+1 to one ability score (max 30). Proficiency in every skill, and Expertise in three of your choice."
  },
  boonSpeed: {
    name: "Boon of Speed", category: "boon",
    text: "+1 to one ability score (max 30). +30 ft. Speed, you ignore Difficult Terrain, and a Bonus Action Disengage."
  },
  boonSpellRecall: {
    name: "Boon of Spell Recall", category: "boon",
    text: "+1 to one ability score (max 30). Each time you cast a prepared spell with a level 1-4 slot, roll a d6; on a 6 the slot isn't spent."
  },
  boonNightSpirit: {
    name: "Boon of the Night Spirit", category: "boon",
    text: "+1 to one ability score (max 30). In Dim Light or Darkness you can become Invisible as a Bonus Action, gain Resistance to all but Psychic damage, and add 2d10 to one damaging roll per turn."
  },
  boonTruesight: {
    name: "Boon of Truesight", category: "boon",
    text: "+1 to one ability score (max 30). Truesight out to 60 ft."
  }
};

export const FEAT_KEYS = Object.keys(FEATS);

export const ORIGIN_FEAT_KEYS  = FEAT_KEYS.filter((k) => FEATS[k].category === "origin");
export const GENERAL_FEAT_KEYS = FEAT_KEYS.filter((k) => FEATS[k].category === "general");
export const BOON_FEAT_KEYS    = FEAT_KEYS.filter((k) => FEATS[k].category === "boon");
