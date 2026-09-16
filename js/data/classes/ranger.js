/* Ranger — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose.
   Note: in 2024 the Ranger gets Spellcasting at LEVEL 1 with 2 slots —
   confirmed directly against the PHB Ranger Features table. */

export const ranger = {
  key: "ranger",
  name: "Ranger",
  tagline: "A wilderness hunter who blends tracking with primal magic",
  primary: "Dexterity and Wisdom",
  hitDie: 10,
  saves: ["str", "dex"],
  skillCount: 3,
  skillOptions: ["animalHandling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"],
  weaponProf: "Simple and Martial weapons",
  armorTraining: "Light and Medium armor, and Shields",
  toolProf: null,
  multiclassGrants: "Hit Point Die, Martial weapons, one Ranger skill, Light and Medium armor training, Shield training",
  equipment: [
    { key: "A", label: "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Druidic Focus, Explorer's Pack, 7 GP", armor: "studded", shield: false },
    { key: "B", label: "150 GP to spend freely", armor: "none", shield: false }
  ],
  caster: {
    type: "half",
    ability: "wis",
    listKey: "ranger",
    /* Fixed list that grows on level-up, with one optional swap each level. */
    prepMode: "list",
    swapOnLevel: true,
    focus: "a Druidic Focus",
    cantripsByLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    preparedByLevel: [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15]
  },
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Ranger Subclass",

  tracks: [
    { label: "Favored Enemy", byLevel: [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6] },
    { label: "Weapon Mastery", byLevel: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] }
  ],

  /* Expertise picks: 1 skill at level 2 (Deft Explorer), 2 more at level 9. */
  expertiseGrants: { 2: 1, 9: 2 },

  choices: [
    {
      key: "fightingStyle", level: 2, label: "Fighting Style", optionsFrom: "ranger",
      extraOptions: [
        { key: "druidicWarrior", name: "Druidic Warrior", text: "Learn two Druid cantrips, cast using Wisdom and counting as Ranger spells. Swap one whenever you gain a Ranger level." }
      ]
    }
  ],

  features: {
    1: [
      { name: "Spellcasting", text: "Cast Ranger spells using Wisdom, with a Druidic Focus. Your prepared list grows as you level, and you can swap one spell per level-up." },
      { name: "Favored Enemy", text: "Hunter's Mark is always prepared, and you can cast it free twice per Long Rest — rising to 3/4/5/6 free casts at levels 5/9/13/17." },
      { name: "Weapon Mastery", text: "Use the mastery properties of 2 kinds of weapons you are proficient with; change them on a Long Rest." }
    ],
    2: [
      { name: "Deft Explorer", text: "Gain Expertise in one skill you're proficient in, plus two languages of your choice." },
      { name: "Fighting Style", text: "Gain a Fighting Style feat, or instead take Druidic Warrior: two Druid cantrips cast with Wisdom, swapping one per Ranger level." }
    ],
    5: [
      { name: "Extra Attack", text: "Attack twice when you take the Attack action." }
    ],
    6: [
      { name: "Roving", text: "+10 ft. Speed while not in Heavy armor, plus a Climb Speed and Swim Speed equal to your Speed." }
    ],
    9: [
      { name: "Expertise", text: "Gain Expertise in two more skills you're proficient in." }
    ],
    10: [
      { name: "Tireless", text: "Magic action: give yourself 1d8 + your Wisdom modifier (min 1) Temporary HP, with uses = Wisdom modifier (min 1) per Long Rest. Every Short Rest also drops your Exhaustion level by 1." }
    ],
    13: [
      { name: "Relentless Hunter", text: "Taking damage can't break your Concentration on Hunter's Mark." }
    ],
    14: [
      { name: "Nature's Veil", text: "Bonus Action: gain the Invisible condition until the end of your next turn. Uses = Wisdom modifier (min 1) per Long Rest." }
    ],
    17: [
      { name: "Precise Hunter", text: "Advantage on attack rolls against the creature your Hunter's Mark is on." }
    ],
    18: [
      { name: "Feral Senses", text: "Blindsight out to 30 ft." }
    ],
    20: [
      { name: "Foe Slayer", text: "Hunter's Mark deals d10s instead of d6s." }
    ]
  },

  subclasses: {
    beastMaster: {
      name: "Beast Master",
      blurb: "A primal beast bonded to you by nature magic",
      features: {
        3: [{ name: "Primal Companion", text: "Summon a primal beast — Beast of the Land, Sea, or Sky — that is Friendly to you and your allies and vanishes when you die. It acts on your turn, moving and using its Reaction freely but only Dodging unless you spend a Bonus Action to command an action, or sacrifice one of your own attacks to have it use Beast's Strike. Add your Proficiency Bonus to its checks and saves. Beast's Strike: melee attack at your spell attack bonus, reach 5 ft., 1d4 + 3 + your Wisdom modifier Slashing damage." }],
        7: [{ name: "Exceptional Training", text: "Commanding the beast to act also lets it Dash, Disengage, Dodge, or Help with its Bonus Action, and its damaging hits can deal Force damage instead of their normal type." }],
        11: [{ name: "Bestial Fury", text: "Commanded Beast's Strike happens twice, and the first hit each turn on a Hunter's Mark target adds that spell's bonus damage as Force damage." }],
        15: [{ name: "Share Spells", text: "A spell you cast on yourself also affects your companion if it's within 30 ft." }]
      }
    },
    feyWanderer: {
      name: "Fey Wanderer",
      blurb: "Feywild mirth, glamour, and mind-scarring fury",
      spellsByLevel: {
        3: ["Charm Person"],
        5: ["Misty Step"],
        9: ["Summon Fey"],
        13: ["Dimension Door"],
        17: ["Mislead"]
      },
      features: {
        3: [
          { name: "Dreadful Strikes", text: "Once per turn on a weapon hit, deal an extra 1d4 Psychic damage — 1d6 from level 11." },
          { name: "Otherworldly Glamour", text: "Add your Wisdom modifier (min +1) to every Charisma check, and gain proficiency in Deception, Performance, or Persuasion." }
        ],
        7: [{ name: "Beguiling Twist", text: "Advantage on saves to avoid or end Charmed and Frightened. When you or a creature within 120 ft. succeeds on such a save, Reaction: a different creature within 120 ft. makes a Wis save against your spell DC or is Charmed or Frightened for 1 minute, repeating the save each turn." }],
        11: [{ name: "Fey Reinforcements", text: "Cast Summon Fey without its Material component, free once per Long Rest, and you can drop its Concentration requirement to make it last 1 minute." }],
        15: [{ name: "Misty Wanderer", text: "Cast Misty Step free, uses = Wisdom modifier (min 1) per Long Rest, and each casting can bring a willing creature from within 5 ft. along with you." }]
      }
    },
    gloomStalker: {
      name: "Gloom Stalker",
      blurb: "Shadowfell magic and devastating ambushes",
      spellsByLevel: {
        3: ["Disguise Self"],
        5: ["Rope Trick"],
        9: ["Fear"],
        13: ["Greater Invisibility"],
        17: ["Seeming"]
      },
      features: {
        3: [
          { name: "Dread Ambusher", text: "+10 ft. Speed on your first turn of each combat; add your Wisdom modifier to Initiative rolls; and Dreadful Strike — once per turn on a weapon hit, an extra 2d6 Psychic damage, with uses = Wisdom modifier (min 1) per Long Rest." },
          { name: "Umbral Sight", text: "Darkvision 60 ft. (or +60 ft. if you already had it), and while entirely in Darkness you have the Invisible condition to anything relying on Darkvision to see you." }
        ],
        7: [{ name: "Iron Mind", text: "Proficiency in Wisdom saving throws — or Intelligence or Charisma saves if you already have Wisdom." }],
        11: [{ name: "Stalker's Flurry", text: "Dreadful Strike becomes 2d8 Psychic and adds a rider: Sudden Strike (another attack with the same weapon against a different creature within 5 ft. of the target) or Mass Fear (the target and everything within 10 ft. makes a Wis save or is Frightened until the start of your next turn)." }],
        15: [{ name: "Shadowy Dodge", text: "Reaction when a creature attacks you: impose Disadvantage on the roll, then teleport up to 30 ft. whether it hits or misses." }]
      }
    },
    hunter: {
      name: "Hunter",
      blurb: "Tactical prey-hunting against any kind of foe",
      features: {
        3: [
          { name: "Hunter's Lore", text: "While a creature carries your Hunter's Mark you know its Immunities, Resistances, and Vulnerabilities." },
          { name: "Hunter's Prey", text: "Pick one, swappable on a Short or Long Rest: Colossus Slayer (once per turn, +1d8 damage on a weapon hit against a creature missing any HP) or Horde Breaker (once per turn, a second attack with the same weapon against a different creature within 5 ft. of the target)." }
        ],
        7: [{ name: "Defensive Tactics", text: "Pick one, swappable on a Short or Long Rest: Escape the Horde (Opportunity Attacks against you have Disadvantage) or Multiattack Defense (a creature that hits you has Disadvantage on its other attacks against you that turn)." }],
        11: [{ name: "Superior Hunter's Prey", text: "Once per turn when you damage a Hunter's Mark target, apply that spell's extra damage to another creature within 30 ft. of it as well." }],
        15: [{ name: "Superior Hunter's Defense", text: "Reaction when you take damage: gain Resistance to that damage type until the end of the turn." }]
      }
    }
  }
};
