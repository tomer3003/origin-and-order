/* Wizard — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const wizard = {
  key: "wizard",
  name: "Wizard",
  tagline: "A scholar of arcane theory with a spellbook of their own making",
  primary: "Intelligence",
  hitDie: 6,
  saves: ["int", "wis"],
  skillCount: 2,
  skillOptions: ["arcana", "history", "insight", "investigation", "medicine", "nature", "religion"],
  weaponProf: "Simple weapons",
  armorTraining: "None",
  toolProf: null,
  multiclassGrants: "Hit Point Die only",
  equipment: [
    { key: "A", label: "2 Daggers, Arcane Focus (Quarterstaff), Robe, Spellbook, Scholar's Pack, 5 GP", armor: "clothes", shield: false },
    { key: "B", label: "55 GP to spend freely", armor: "none", shield: false }
  ],
  caster: {
    type: "full",
    ability: "int",
    listKey: "wizard",
    /* Learns spells into the spellbook and prepares a subset daily. No
       swap-on-level-up: the book only grows. */
    prepMode: "spellbook",
    swapOnLevel: false,
    focus: "an Arcane Focus or your spellbook",
    /* Six level 1 spells at level 1, then two more per Wizard level. */
    spellbookStart: 6,
    spellbookPerLevel: 2,
    cantripsByLevel: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    /* The Wizard's prepared count runs higher than the other full casters
       from level 13 on. Read off the PHB table. */
    preparedByLevel: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25]
  },
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Wizard Subclass",

  tracks: [],

  /* Scholar (level 2) grants Expertise, but only in one of six skills. */
  expertiseGrants: { 2: 1 },
  expertiseLimit: { 2: ["arcana", "history", "investigation", "medicine", "nature", "religion"] },

  features: {
    1: [
      { name: "Spellcasting", text: "Cast Wizard spells using Intelligence, with an Arcane Focus or your spellbook. 3 cantrips (4 at level 4, 5 at level 10), swapping one per Long Rest. Your spellbook starts with six level 1 spells and gains two more each Wizard level; you prepare a subset of it after a Long Rest." },
      { name: "Ritual Adept", text: "Cast any Ritual-tagged spell in your spellbook as a Ritual without preparing it, reading from the book." },
      { name: "Arcane Recovery", text: "On a Short Rest, recover spell slots totalling half your Wizard level (rounded up) in levels, none above level 5. Once per Long Rest." }
    ],
    2: [
      { name: "Scholar", text: "Gain Expertise in one skill you're proficient in from Arcana, History, Investigation, Medicine, Nature, or Religion." }
    ],
    5: [
      { name: "Memorize Spell", text: "On a Short Rest, swap one prepared level 1+ spell for another from your spellbook." }
    ],
    18: [
      { name: "Spell Mastery", text: "Choose a level 1 and a level 2 spell in your book with an action casting time: both are always prepared and castable free at their lowest level. Swap either for an eligible same-level spell on a Long Rest." }
    ],
    20: [
      { name: "Signature Spells", text: "Choose two level 3 spells in your book: both are always prepared and each can be cast once at level 3 for free, refreshing on a Short or Long Rest." }
    ]
  },

  subclasses: {
    abjurer: {
      name: "Abjurer",
      blurb: "Protective magic and a ward woven from your own spells",
      features: {
        3: [
          { name: "Abjuration Savant", text: "Add two Abjuration spells of level 2 or lower to your spellbook free, plus one more Abjuration spell free whenever you unlock a new spell-slot level." },
          { name: "Arcane Ward", text: "Casting an Abjuration spell with a slot raises a ward on yourself with HP equal to twice your Wizard level + your Intelligence modifier, lasting until a Long Rest. It soaks your damage until it hits 0, and regains twice a slot's level in HP whenever you cast an Abjuration spell with a slot or spend one as a Bonus Action. Once per Long Rest to create." }
        ],
        6: [{ name: "Projected Ward", text: "Reaction when a creature within 30 ft. takes damage: your Arcane Ward absorbs it instead, with any overflow falling on that creature." }],
        10: [{ name: "Spell Breaker", text: "Counterspell and Dispel Magic are always prepared, Dispel Magic can be cast as a Bonus Action with your Proficiency Bonus added to its check, and a slot spent on either isn't consumed if the spell fails to stop anything." }],
        14: [{ name: "Spell Resistance", text: "Advantage on saving throws against spells, and Resistance to spell damage." }]
      }
    },
    diviner: {
      name: "Diviner",
      blurb: "Glimpses of past, present, and future",
      features: {
        3: [
          { name: "Divination Savant", text: "Add two Divination spells of level 2 or lower to your spellbook free, plus one more Divination spell free whenever you unlock a new spell-slot level." },
          { name: "Portent", text: "After each Long Rest, roll two d20s and record them. Replace any d20 Test by you or a creature you can see with one of those rolls, declared before the roll and once per turn. Unused rolls are lost on your next Long Rest." }
        ],
        6: [{ name: "Expert Divination", text: "Casting a Divination spell with a level 2+ slot returns one expended slot of a lower level, up to level 5." }],
        10: [{ name: "The Third Eye", text: "Bonus Action: pick 120-ft. Darkvision, the ability to read any language, or a free See Invisibility, lasting until your next rest. Once per Short or Long Rest." }],
        14: [{ name: "Greater Portent", text: "Roll three d20s for Portent instead of two." }]
      }
    },
    evoker: {
      name: "Evoker",
      blurb: "Explosive elemental force, aimed precisely",
      features: {
        3: [
          { name: "Evocation Savant", text: "Add two Evocation spells of level 2 or lower to your spellbook free, plus one more Evocation spell free whenever you unlock a new spell-slot level." },
          { name: "Potent Cantrip", text: "A damaging cantrip that misses or is saved against still deals half its damage, though none of its other effects." }
        ],
        6: [{ name: "Sculpt Spells", text: "When an Evocation spell of yours affects creatures you can see, 1 + the spell's level of them automatically succeed on their saves and take no damage where they'd take half." }],
        10: [{ name: "Empowered Evocation", text: "Add your Intelligence modifier to one damage roll of any Wizard Evocation spell you cast." }],
        14: [{ name: "Overchannel", text: "A damaging Wizard spell cast with a level 1-5 slot deals maximum damage. The first use after a Long Rest is free; each use after that costs 2d12 Necrotic damage per spell level, rising by 1d12 each time, ignoring Resistance and Immunity." }]
      }
    },
    illusionist: {
      name: "Illusionist",
      blurb: "Deceptions so convincing they edge into reality",
      features: {
        3: [
          { name: "Illusion Savant", text: "Add two Illusion spells of level 2 or lower to your spellbook free, plus one more Illusion spell free whenever you unlock a new spell-slot level." },
          { name: "Improved Illusions", text: "Cast Illusion spells without Verbal components, and Illusion spells with a range of 10+ ft. gain 60 ft. of range. You also know Minor Illusion for free (another cantrip if you had it), can make both a sound and an image with one casting, and can cast it as a Bonus Action." }
        ],
        6: [{ name: "Phantasmal Creatures", text: "Summon Beast and Summon Fey are always prepared and can be recast as Illusion spells, making the creature spectral. Each can be cast free once per Long Rest, at half the creature's HP." }],
        10: [{ name: "Illusory Self", text: "Reaction when a creature hits you: an illusory duplicate takes the attack, which misses automatically. Once per Short or Long Rest, or spend a level 2+ slot to recharge it." }],
        14: [{ name: "Illusory Reality", text: "Bonus Action while an Illusion spell you cast with a slot is ongoing: make one inanimate, nonmagical object in it real for 1 minute. It can't deal damage or impose conditions." }]
      }
    }
  }
};
