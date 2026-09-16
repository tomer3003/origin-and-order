/* Rogue — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const rogue = {
  key: "rogue",
  name: "Rogue",
  tagline: "A precise, elusive expert in stealth and opportunity",
  primary: "Dexterity",
  hitDie: 8,
  saves: ["dex", "int"],
  skillCount: 4,
  skillOptions: ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "persuasion", "sleightOfHand", "stealth"],
  weaponProf: "Simple weapons and Martial weapons with the Finesse or Light property",
  armorTraining: "Light armor",
  toolProf: "Thieves' Tools",
  multiclassGrants: "Hit Point Die, one Rogue skill, Thieves' Tools, Light armor training",
  equipment: [
    { key: "A", label: "Leather Armor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves' Tools, Burglar's Pack, 8 GP", armor: "leather", shield: false },
    { key: "B", label: "100 GP to spend freely", armor: "none", shield: false }
  ],
  caster: null,
  /* Arcane Trickster turns the Rogue into a third caster from level 3; the
     subclass carries its own `caster` block. */
  asiLevels: [4, 8, 10, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Rogue Subclass",

  tracks: [
    { label: "Sneak Attack", suffix: "d6", byLevel: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10] },
    { label: "Weapon Mastery", byLevel: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] }
  ],

  /* Expertise picks: 2 skills at level 1, 2 more at level 6. */
  expertiseGrants: { 1: 2, 6: 2 },

  features: {
    1: [
      { name: "Expertise", text: "Double your proficiency bonus for 2 skill proficiencies; 2 more at level 6." },
      { name: "Sneak Attack", text: "Once per turn, add 1d6 damage to a hit with a Finesse or Ranged weapon if you have Advantage, or if a non-Incapacitated ally is within 5 ft. of the target and you don't have Disadvantage. The dice grow to 10d6 by level 19." },
      { name: "Thieves' Cant", text: "You know Thieves' Cant plus one other language of your choice." },
      { name: "Weapon Mastery", text: "Use the mastery properties of 2 kinds of weapons you are proficient with; change them on a Long Rest." }
    ],
    2: [
      { name: "Cunning Action", text: "Bonus Action: Dash, Disengage, or Hide." }
    ],
    3: [
      { name: "Steady Aim", text: "Bonus Action, only if you haven't moved this turn: gain Advantage on your next attack this turn. Your Speed becomes 0 for the rest of the turn." }
    ],
    5: [
      { name: "Cunning Strike", text: "When you deal Sneak Attack damage, trade dice for an effect (save DC 8 + Dex modifier + Proficiency Bonus). Poison (1d6, needs a Poisoner's Kit) — Con save or Poisoned for 1 minute. Trip (1d6) — a Large or smaller target makes a Dex save or falls Prone. Withdraw (1d6) — move half your Speed without provoking." },
      { name: "Uncanny Dodge", text: "Reaction when an attacker you can see hits you: halve that attack's damage." }
    ],
    7: [
      { name: "Evasion", text: "On a Dexterity save for half damage, take none on a success and half on a failure. Not while Incapacitated." },
      { name: "Reliable Talent", text: "On ability checks using a skill or tool you're proficient with, treat a d20 of 9 or lower as a 10." }
    ],
    11: [
      { name: "Improved Cunning Strike", text: "Apply up to two Cunning Strike effects at once, paying each die cost." }
    ],
    14: [
      { name: "Devious Strikes", text: "Three more Cunning Strike options. Daze (2d6) — Con save or the target may only move, or act, or take a Bonus Action next turn. Knock Out (6d6) — Con save or Unconscious for 1 minute or until damaged. Obscure (3d6) — Dex save or Blinded until the end of its next turn." }
    ],
    15: [
      { name: "Slippery Mind", text: "Proficiency in Wisdom and Charisma saving throws." }
    ],
    18: [
      { name: "Elusive", text: "No attack roll can have Advantage against you unless you're Incapacitated." }
    ],
    20: [
      { name: "Stroke of Luck", text: "Turn a failed d20 Test into a 20. Once per Short or Long Rest." }
    ]
  },

  subclasses: {
    arcaneTrickster: {
      name: "Arcane Trickster",
      blurb: "Wizard magic bent toward misdirection and theft",
      /* Third caster from level 3, Wizard list, Intelligence. Indexed by
         full Rogue level; levels 1-2 have no spellcasting. */
      caster: {
        type: "third",
        ability: "int",
        listKey: "wizard",
        prepMode: "list",
        swapOnLevel: true,
        startLevel: 3,
        focus: "an Arcane Focus",
        cantripsByLevel: [0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        preparedByLevel: [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13]
      },
      features: {
        3: [
          { name: "Spellcasting", text: "Cast Wizard spells using Intelligence with an Arcane Focus. You know Mage Hand plus two other Wizard cantrips (a fourth at level 10) and keep a growing prepared list, swapping one cantrip (never Mage Hand) and one spell whenever you gain a Rogue level." },
          { name: "Mage Hand Legerdemain", text: "Cast Mage Hand as a Bonus Action and make the hand Invisible. Control it as a Bonus Action and make Sleight of Hand checks through it." }
        ],
        9: [{ name: "Magical Ambush", text: "Casting a spell while you have the Invisible condition gives the target Disadvantage on saves against it that turn." }],
        13: [{ name: "Versatile Trickster", text: "Using Cunning Strike's Trip option also lets you apply it to another creature within 5 ft. of your Mage Hand." }],
        17: [{ name: "Spell Thief", text: "Reaction right after a creature's spell targets or includes you: it makes an Int save against your spell DC. On a failure the spell doesn't affect you and, if it's level 1+ and a level you can cast, you have it prepared for 8 hours while the caster can't use it." }]
      }
    },
    assassin: {
      name: "Assassin",
      blurb: "Stealth, poison, and disguise turned lethal",
      features: {
        3: [
          { name: "Assassinate", text: "Advantage on Initiative rolls. During the first round of combat you have Advantage against any creature that hasn't taken a turn, and a Sneak Attack landed that round deals extra damage of the weapon's type equal to your Rogue level." },
          { name: "Assassin's Tools", text: "Gain a Disguise Kit and a Poisoner's Kit, with proficiency in both." }
        ],
        9: [{ name: "Infiltration Expertise", text: "Mimic a studied person's speech, handwriting, or both after an hour of study, and Steady Aim no longer drops your Speed to 0." }],
        13: [{ name: "Envenom Weapons", text: "Cunning Strike's Poison option also deals 2d6 Poison damage on a failed save, ignoring Poison Resistance." }],
        17: [{ name: "Death Strike", text: "A Sneak Attack hit in the first round of combat forces a Con save (DC 8 + Dex modifier + Proficiency Bonus); on a failure the attack's damage doubles." }]
      }
    },
    soulknife: {
      name: "Soulknife",
      blurb: "Blades of psychic force drawn from your own mind",
      psionicDice: {
        3: { count: 4, die: "d6" }, 5: { count: 6, die: "d8" }, 9: { count: 8, die: "d8" },
        11: { count: 8, die: "d10" }, 13: { count: 10, die: "d10" }, 17: { count: 12, die: "d12" }
      },
      features: {
        3: [
          { name: "Psionic Power", text: "A pool of Psionic Energy Dice (four d6s at level 3, up to twelve d12s at level 17; one back on a Short Rest, all on a Long Rest). Psi-Bolstered Knack — add a die to a failed check with a skill or tool you're proficient in, spending it only if that turns the check into a success. Psychic Whispers — Magic action: roll a die to open telepathy with up to your Proficiency Bonus in creatures for that many hours, within 1 mile. The first use after a Long Rest is free." },
          { name: "Psychic Blades", text: "On the Attack action or an Opportunity Attack, manifest a blade in a free hand: Simple Melee, 1d6 Psychic + the attack's ability modifier, Finesse and Thrown (60/120 ft.), with the Vex mastery for free. After attacking with it you can throw or swing a second blade as a Bonus Action for 1d4." }
        ],
        9: [{ name: "Soul Blades", text: "Homing Strikes — add a die to a missed Psychic Blade attack, spending it only if the attack then hits. Psychic Teleportation — Bonus Action: spend and roll a die, then teleport up to 10 times that many feet." }],
        13: [{ name: "Psychic Veil", text: "Magic action: gain the Invisible condition for 1 hour, ending early once you deal damage or force a save. Once per Long Rest, or spend a die to recharge it." }],
        17: [{ name: "Rend Mind", text: "When Psychic Blades deal Sneak Attack damage, the target makes a Wis save (DC 8 + Dex modifier + Proficiency Bonus) or is Stunned for 1 minute, repeating the save each turn. Once per Long Rest, or spend three dice to recharge it." }]
      }
    },
    thief: {
      name: "Thief",
      blurb: "Burglar, treasure hunter, and classic adventurer",
      features: {
        3: [
          { name: "Fast Hands", text: "Bonus Action: a Sleight of Hand check to pick a lock, disarm a trap, or pick a pocket; or the Utilize action; or the Magic action to use a magic item that needs it." },
          { name: "Second-Story Work", text: "A Climb Speed equal to your Speed, and your jump distance uses Dexterity instead of Strength." }
        ],
        9: [{ name: "Supreme Sneak", text: "New Cunning Strike option — Stealth Attack (1d6): if you have the Hide action's Invisible condition, the attack doesn't end it as long as you finish the turn behind Three-Quarters or Total Cover." }],
        13: [{ name: "Use Magic Device", text: "Attune to up to four magic items. On spending an item's charges, a 1d6 roll of 6 spends none. You can use any Spell Scroll with Intelligence — reliably for cantrips and level 1 spells, otherwise on a DC 10 + spell level Arcana check, with the scroll disintegrating on a failure." }],
        17: [{ name: "Thief's Reflexes", text: "Take two turns in the first round of any combat: one at your Initiative and one at your Initiative minus 10." }]
      }
    }
  }
};
