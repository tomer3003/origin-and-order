/* Druid — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const druid = {
  key: "druid",
  name: "Druid",
  tagline: "A priest of nature who borrows the shapes of beasts",
  primary: "Wisdom",
  hitDie: 8,
  saves: ["int", "wis"],
  skillCount: 2,
  skillOptions: ["animalHandling", "arcana", "insight", "medicine", "nature", "perception", "religion", "survival"],
  weaponProf: "Simple weapons",
  armorTraining: "Light armor and Shields",
  toolProf: "Herbalism Kit",
  multiclassGrants: "Hit Point Die, Light armor training, Shield training",
  equipment: [
    { key: "A", label: "Leather Armor, Shield, Sickle, Druidic Focus (Quarterstaff), Explorer's Pack, Herbalism Kit, 9 GP", armor: "leather", shield: true },
    { key: "B", label: "50 GP to spend freely", armor: "none", shield: false }
  ],
  caster: {
    type: "full",
    ability: "wis",
    listKey: "druid",
    /* Prepares from the entire Druid list after a Long Rest. */
    prepMode: "free",
    swapOnLevel: false,
    focus: "a Druidic Focus",
    cantripsByLevel: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    preparedByLevel: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22]
  },
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Druid Circle",

  tracks: [
    { label: "Wild Shape", byLevel: [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4] }
  ],

  choices: [
    {
      key: "primalOrder", level: 1, label: "Primal Order",
      options: [
        { key: "magician", name: "Magician", text: "One extra Druid cantrip, and add your Wisdom modifier (min +1) to Arcana and Nature checks." },
        { key: "warden", name: "Warden", text: "Gain Martial weapon proficiency and Medium armor training." }
      ]
    },
    {
      key: "elementalFury", level: 7, label: "Elemental Fury",
      options: [
        { key: "potentSpellcasting", name: "Potent Spellcasting", text: "Add your Wisdom modifier to Druid cantrip damage. From level 15, cantrips with a range of 10 ft. or more reach 300 ft. further." },
        { key: "primalStrike", name: "Primal Strike", text: "Once per turn on a weapon or Wild Shape attack hit, add 1d8 Cold, Fire, Lightning, or Thunder damage (2d8 from level 15)." }
      ]
    }
  ],

  features: {
    1: [
      { name: "Spellcasting", text: "Cast Druid spells using Wisdom, with a Druidic Focus. Prepare your spells from the whole Druid list after a Long Rest." },
      { name: "Druidic", text: "You speak Druidic and always have Speak with Animals prepared. Druidic messages are spotted automatically by other speakers; everyone else needs a DC 15 Investigation check just to notice one." },
      { name: "Primal Order", text: "Choose a role: Magician (an extra cantrip plus a Wisdom-sized bonus to Arcana and Nature checks) or Warden (Martial weapons and Medium armor)." }
    ],
    2: [
      { name: "Wild Shape", text: "Bonus Action: become one of your known Beast forms for hours equal to half your Druid level, gaining Temporary HP equal to your Druid level. You keep your HP, mental scores, class features, and proficiencies but can't cast spells. Two uses; one back on a Short Rest, all on a Long Rest. Known forms and max CR: 4 forms / CR 1/4 at level 2, 6 / CR 1/2 at level 4, 8 / CR 1 with a Fly Speed allowed at level 8." },
      { name: "Wild Companion", text: "Magic action: spend a spell slot or a Wild Shape use to cast Find Familiar with no Material components. The familiar is Fey and lasts until your next Long Rest." }
    ],
    5: [
      { name: "Wild Resurgence", text: "Once per turn, if you have no Wild Shape uses, spend a spell slot to get one back. You can also trade a Wild Shape use for a level 1 slot once per Long Rest." }
    ],
    7: [
      { name: "Elemental Fury", text: "Choose Potent Spellcasting (add Wisdom to cantrip damage) or Primal Strike (once per turn, +1d8 Cold/Fire/Lightning/Thunder on a weapon or Beast-form hit)." }
    ],
    15: [
      { name: "Improved Elemental Fury", text: "Potent Spellcasting extends cantrip range by 300 ft.; Primal Strike rises to 2d8." }
    ],
    18: [
      { name: "Beast Spells", text: "Cast spells while in Wild Shape, except ones with a costed or consumed Material component." }
    ],
    20: [
      { name: "Archdruid", text: "On rolling Initiative with no Wild Shape uses left, regain one. You can also convert unspent Wild Shape uses into a single spell slot at 2 spell levels each, once per Long Rest." }
    ]
  },

  subclasses: {
    land: {
      name: "Circle of the Land",
      blurb: "Magic shaped by a chosen kind of terrain",
      features: {
        3: [
          { name: "Circle of the Land Spells", text: "After each Long Rest pick a land type — arid, polar, temperate, or tropical — and have its spells for your level and lower prepared. Arid: Blur, Burning Hands, Fire Bolt, then Fireball, Blight, Wall of Stone. Polar: Fog Cloud, Hold Person, Ray of Frost, then Sleet Storm, Ice Storm, Cone of Cold. Temperate: Misty Step, Shocking Grasp, Sleep, then Lightning Bolt, Freedom of Movement, Tree Stride. Tropical: Acid Splash, Ray of Sickness, Web, then Stinking Cloud, Polymorph, Insect Plague." },
          { name: "Land's Aid", text: "Magic action, one Wild Shape use: a 10-ft.-radius Sphere within 60 ft. forces a Con save on chosen creatures for 2d6 Necrotic damage, half on a success, while one chosen creature there regains 2d6 HP. Rises to 3d6 at level 10 and 4d6 at level 14." }
        ],
        6: [{ name: "Natural Recovery", text: "Cast one prepared Circle spell of level 1+ free, once per Long Rest. Also, on a Short Rest recover spell slots totalling half your Druid level (rounded up) in levels, none above level 5 — once per Long Rest." }],
        10: [{ name: "Nature's Ward", text: "Immune to the Poisoned condition, plus Resistance matching your current land: Fire (arid), Cold (polar), Lightning (temperate), or Poison (tropical)." }],
        14: [{ name: "Nature's Sanctuary", text: "Magic action, one Wild Shape use: a 15-ft. Cube of spectral growth within 120 ft. lasts 1 minute, giving you and your allies Half Cover and giving allies your Nature's Ward Resistance. Bonus Action to move it 60 ft." }]
      }
    },
    moon: {
      name: "Circle of the Moon",
      blurb: "Lunar magic poured into savage beast forms",
      spellsByLevel: {
        3: ["Cure Wounds", "Moonbeam", "Starry Wisp"],
        5: ["Conjure Animals"],
        7: ["Fount of Moonlight"],
        9: ["Mass Cure Wounds"]
      },
      features: {
        3: [
          { name: "Circle Forms", text: "Wild Shape forms may be up to CR equal to your Druid level divided by 3 (rounded down), your AC becomes 13 + Wisdom modifier if that beats the Beast's, and you gain Temporary HP equal to three times your Druid level." },
          { name: "Circle of the Moon Spells", text: "The listed spells are always prepared, and you can cast them while in a Wild Shape form." }
        ],
        6: [{ name: "Improved Circle Forms", text: "Beast-form attacks can deal Radiant damage instead of their usual type, and you add your Wisdom modifier to Constitution saves." }],
        10: [{ name: "Moonlight Step", text: "Bonus Action: teleport 30 ft. and gain Advantage on your next attack this turn. Uses = Wisdom modifier (min 1) per Long Rest, or spend a level 2+ slot to restore one." }],
        14: [{ name: "Lunar Form", text: "Once per turn a Beast-form hit can deal an extra 2d10 Radiant damage, and Moonlight Step can bring one willing creature from within 10 ft. along with you." }]
      }
    },
    sea: {
      name: "Circle of the Sea",
      blurb: "Tides, currents, and the fury of storms",
      spellsByLevel: {
        3: ["Fog Cloud", "Gust of Wind", "Ray of Frost", "Shatter", "Thunderwave"],
        5: ["Lightning Bolt", "Water Breathing"],
        7: ["Control Water", "Ice Storm"],
        9: ["Conjure Elemental", "Hold Monster"]
      },
      features: {
        3: [
          { name: "Circle of the Sea Spells", text: "The listed spells are always prepared." },
          { name: "Wrath of the Sea", text: "Bonus Action, one Wild Shape use: a 5-ft. Emanation of ocean spray surrounds you for 10 minutes. On manifesting it and as a Bonus Action after, one creature in it makes a Con save or takes Cold damage — d6s equal to your Wisdom modifier (min 1) — and, if Large or smaller, is pushed 15 ft." }
        ],
        6: [{ name: "Aquatic Affinity", text: "The Emanation grows to 10 ft., and you gain a Swim Speed equal to your Speed." }],
        10: [{ name: "Stormborn", text: "While Wrath of the Sea is active you gain a Fly Speed equal to your Speed and Resistance to Cold, Lightning, and Thunder damage." }],
        14: [{ name: "Oceanic Gift", text: "Manifest the Emanation around a willing creature within 60 ft. instead of yourself — it uses your spell save DC and Wisdom modifier — or spend two Wild Shape uses to cover both of you." }]
      }
    },
    stars: {
      name: "Circle of the Stars",
      blurb: "Secrets read from the constellations",
      features: {
        3: [
          { name: "Star Map", text: "A Tiny star chart usable as your Spellcasting Focus. While holding it you have Guidance and Guiding Bolt prepared and can cast Guiding Bolt free a number of times equal to your Wisdom modifier (min 1) per Long Rest. A 1-hour ceremony replaces a lost map." },
          { name: "Starry Form", text: "Bonus Action, one Wild Shape use: glow with a constellation for 10 minutes instead of shape-shifting. Archer — Bonus Action ranged spell attack for 1d8 + Wisdom Radiant damage. Chalice — a slot-cast healing spell also heals someone within 30 ft. for 1d8 + Wisdom. Dragon — treat a d20 of 9 or lower as a 10 on Intelligence and Wisdom checks and Concentration saves." }
        ],
        6: [{ name: "Cosmic Omen", text: "After a Long Rest roll a die. Even (Weal): Reaction to add 1d6 to a d20 Test by a creature within 30 ft. Odd (Woe): Reaction to subtract 1d6 instead. Uses = Wisdom modifier (min 1) per Long Rest." }],
        10: [{ name: "Twinkling Constellations", text: "Archer and Chalice dice become 2d8, Dragon grants a 20-ft. hovering Fly Speed, and you can change constellation at the start of each of your turns." }],
        14: [{ name: "Full of Stars", text: "While in Starry Form you are partly incorporeal: Resistance to Bludgeoning, Piercing, and Slashing damage." }]
      }
    }
  }
};
