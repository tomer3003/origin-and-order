/* Bard — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const bard = {
  key: "bard",
  name: "Bard",
  tagline: "An inspiring performer of music, dance, and magic",
  primary: "Charisma",
  hitDie: 8,
  saves: ["dex", "cha"],
  skillCount: 3,
  skillOptions: "any",
  weaponProf: "Simple weapons",
  armorTraining: "Light armor",
  toolProf: "Three Musical Instruments of your choice",
  multiclassGrants: "Hit Point Die, one skill, one Musical Instrument, Light armor training",
  equipment: [
    { key: "A", label: "Leather Armor, 2 Daggers, a Musical Instrument, Entertainer's Pack, 19 GP", armor: "leather", shield: false },
    { key: "B", label: "90 GP to spend freely", armor: "none", shield: false }
  ],
  caster: {
    type: "full",
    ability: "cha",
    listKey: "bard",
    /* Fixed list that grows on level-up, with one optional swap each level. */
    prepMode: "list",
    swapOnLevel: true,
    focus: "a Musical Instrument",
    cantripsByLevel:  [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    preparedByLevel:  [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22],
    /* Magical Secrets at level 10 widens where new picks may come from. */
    extraListsFromLevel: { 10: ["bard", "cleric", "druid", "wizard"] }
  },
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Bard College",

  tracks: [
    { label: "Bardic Die", byLevel: ["d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12", "d12", "d12"] }
  ],

  /* Expertise picks: 2 skills at level 2, 2 more at level 9. */
  expertiseGrants: { 2: 2, 9: 2 },

  features: {
    1: [
      { name: "Bardic Inspiration", text: "Bonus Action: give a creature within 60 ft. a Bardic Inspiration die. Within the hour it can add that die to a failed d20 Test, turning it into a possible success. Uses = Charisma modifier (min 1), refilled on a Long Rest. The die grows to d8/d10/d12 at levels 5/10/15." },
      { name: "Spellcasting", text: "Cast Bard spells using Charisma, with a Musical Instrument as your focus. You may swap one cantrip each time you gain a Bard level." }
    ],
    2: [
      { name: "Expertise", text: "Double your proficiency bonus for 2 skill proficiencies; 2 more at level 9." },
      { name: "Jack of All Trades", text: "Add half your Proficiency Bonus (rounded down) to ability checks that use a skill you lack and don't already add proficiency to." }
    ],
    5: [
      { name: "Font of Inspiration", text: "Bardic Inspiration refills on a Short Rest too, and you can spend a spell slot (no action) to regain one use." }
    ],
    7: [
      { name: "Countercharm", text: "Reaction when you or a creature within 30 ft. fails a save against Charmed or Frightened: reroll that save with Advantage." }
    ],
    10: [
      { name: "Magical Secrets", text: "From now on, each new prepared spell you gain — and any spell you replace — may come from the Bard, Cleric, Druid, or Wizard list, counting as a Bard spell for you." }
    ],
    18: [
      { name: "Superior Inspiration", text: "On rolling Initiative, top your Bardic Inspiration uses back up to two if you have fewer." }
    ],
    20: [
      { name: "Words of Creation", text: "Power Word Heal and Power Word Kill are always prepared, and each can hit a second creature within 10 ft. of the first." }
    ]
  },

  subclasses: {
    dance: {
      name: "College of Dance",
      blurb: "Agility and grace in harmony with the cosmos",
      features: {
        3: [{ name: "Dazzling Footwork", text: "While unarmored and without a Shield: AC = 10 + Dex modifier + Cha modifier; Advantage on Performance checks involving dance; spending a Bardic Inspiration use as part of an action, Bonus Action, or Reaction also lets you make one Unarmed Strike; and your Unarmed Strikes can use Dexterity and deal Bludgeoning damage equal to a Bardic Inspiration die roll + Dex modifier without expending the die." }],
        6: [
          { name: "Inspiring Movement", text: "Reaction when a visible enemy ends its turn within 5 ft.: spend a Bardic Inspiration use to move up to half your Speed, and one ally within 30 ft. may use its Reaction to do the same. Neither movement provokes Opportunity Attacks." },
          { name: "Tandem Footwork", text: "On rolling Initiative (and not Incapacitated), spend a Bardic Inspiration use and roll the die: you and each ally within 30 ft. who can see or hear you add that much to Initiative." }
        ],
        14: [{ name: "Leading Evasion", text: "On a Dexterity save for half damage, you take none on a success and half on a failure — and you can extend that to creatures within 5 ft. making the same save. Not usable while Incapacitated." }]
      }
    },
    glamour: {
      name: "College of Glamour",
      blurb: "Beguiling fey magic and otherworldly majesty",
      features: {
        3: [
          { name: "Beguiling Magic", text: "Charm Person and Mirror Image are always prepared. Right after you cast an Enchantment or Illusion spell with a slot, a creature you can see within 60 ft. makes a Wis save against your spell DC or is Charmed or Frightened (your choice) for 1 minute, repeating the save at the end of each of its turns. Once per Long Rest, or spend a Bardic Inspiration use to recharge it." },
          { name: "Mantle of Inspiration", text: "Bonus Action: spend a Bardic Inspiration use and roll the die. Up to your Charisma modifier in creatures within 60 ft. (min 1) each gain twice the rolled number as Temporary HP and may Reaction-move up to their Speed without provoking Opportunity Attacks." }
        ],
        6: [{ name: "Mantle of Majesty", text: "Command is always prepared. Bonus Action: cast Command free and become unearthly for 1 minute, casting Command as a Bonus Action without a slot during it. Creatures you have Charmed fail that save automatically. Once per Long Rest, or spend a level 3+ slot to recharge it." }],
        14: [{ name: "Unbreakable Majesty", text: "Bonus Action: for 1 minute (or until Incapacitated), the first time each turn a creature hits you it must make a Cha save against your spell DC or the attack misses instead. Once per Short or Long Rest." }]
      }
    },
    lore: {
      name: "College of Lore",
      blurb: "Collected spells, secrets, and cutting wit",
      features: {
        3: [
          { name: "Bonus Proficiencies", text: "Gain proficiency with three skills of your choice." },
          { name: "Cutting Words", text: "Reaction when a creature you can see within 60 ft. rolls damage or succeeds on an ability check or attack roll: spend a Bardic Inspiration use and subtract the die roll from its total, possibly turning a success into a failure." }
        ],
        6: [{ name: "Magical Discoveries", text: "Learn two spells from the Cleric, Druid, or Wizard lists (a cantrip, or a level you have slots for). They're always prepared, and you may swap one whenever you gain a Bard level." }],
        14: [{ name: "Peerless Skill", text: "On a failed ability check or attack roll, spend a Bardic Inspiration use and add the die to the d20. If it still fails, the use isn't spent." }]
      }
    },
    valor: {
      name: "College of Valor",
      blurb: "Martial prowess and the deeds of ancient heroes",
      features: {
        3: [
          { name: "Combat Inspiration", text: "A creature holding your Bardic Inspiration die can instead spend it for Defense (Reaction on being hit: add the die to AC against that attack) or Offense (after hitting: add the die to the damage)." },
          { name: "Martial Training", text: "Gain Martial weapon proficiency plus Medium armor and Shield training, and you can use a Simple or Martial weapon as your Spellcasting Focus." }
        ],
        6: [{ name: "Extra Attack", text: "Attack twice when you take the Attack action, and you can swap one of those attacks for a cantrip that takes an action to cast." }],
        14: [{ name: "Battle Magic", text: "After casting a spell that takes an action, make one weapon attack as a Bonus Action." }]
      }
    }
  }
};
