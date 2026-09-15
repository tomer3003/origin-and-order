/* Barbarian — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const barbarian = {
  key: "barbarian",
  name: "Barbarian",
  tagline: "A fierce warrior powered by primal Rage",
  primary: "Strength",
  hitDie: 12,
  saves: ["str", "con"],
  skillCount: 2,
  skillOptions: ["animalHandling", "athletics", "intimidation", "nature", "perception", "survival"],
  weaponProf: "Simple and Martial weapons",
  armorTraining: "Light and Medium armor, and Shields",
  toolProf: null,
  multiclassGrants: "Hit Point Die, Martial weapons, Shield training",
  equipment: [
    { key: "A", label: "Greataxe, 4 Handaxes, Explorer's Pack, 15 GP", armor: "none", shield: false },
    { key: "B", label: "75 GP to spend freely", armor: "none", shield: false }
  ],
  /* Unarmored Defense: 10 + Dex + Con, Shield allowed. */
  unarmoredDefense: ["dex", "con"],
  caster: null,
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Primal Path",

  /* Per-level counters shown on the sheet. Index 0 = level 1. */
  tracks: [
    { label: "Rages", byLevel: [2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6] },
    { label: "Rage Damage", prefix: "+", byLevel: [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4] },
    { label: "Weapon Mastery", byLevel: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] }
  ],

  features: {
    1: [
      { name: "Rage", text: "Bonus Action (not in Heavy armor): gain resistance to Bludgeoning/Piercing/Slashing, a damage bonus on Strength attacks, and Advantage on Strength checks and saves. You can't cast spells or hold Concentration. Lasts to the end of your next turn; extend it by attacking, forcing a save, or spending a Bonus Action, up to 10 minutes. Regain one use on a Short Rest, all on a Long Rest." },
      { name: "Unarmored Defense", text: "With no armor worn, AC = 10 + Dex modifier + Con modifier. A Shield still works." },
      { name: "Weapon Mastery", text: "Use the mastery property of 2 kinds of Simple or Martial melee weapons; change one on a Long Rest." }
    ],
    2: [
      { name: "Danger Sense", text: "Advantage on Dexterity saves unless you're Incapacitated." },
      { name: "Reckless Attack", text: "On your first attack roll of the turn, choose to gain Advantage on Strength attacks until your next turn — attacks against you gain Advantage too." }
    ],
    3: [
      { name: "Primal Knowledge", text: "Gain one more Barbarian skill. While Raging, you may make Acrobatics, Intimidation, Perception, Stealth, or Survival checks as Strength checks." }
    ],
    5: [
      { name: "Extra Attack", text: "Attack twice when you take the Attack action." },
      { name: "Fast Movement", text: "+10 ft. Speed while not in Heavy armor." }
    ],
    7: [
      { name: "Feral Instinct", text: "Advantage on Initiative rolls." },
      { name: "Instinctive Pounce", text: "Move up to half your Speed as part of the Bonus Action that starts your Rage." }
    ],
    9: [
      { name: "Brutal Strike", text: "When using Reckless Attack, give up Advantage on one Strength attack to add 1d10 damage plus an effect — Forceful Blow (push 15 ft., then close half your Speed freely) or Hamstring Blow (target's Speed −15 ft.)." }
    ],
    11: [
      { name: "Relentless Rage", text: "Dropping to 0 HP while Raging: make a DC 10 Con save to stay up with HP equal to twice your Barbarian level. The DC climbs 5 per use and resets on a rest." }
    ],
    13: [
      { name: "Improved Brutal Strike", text: "Two more Brutal Strike options — Staggering Blow (target has Disadvantage on its next save and can't make Opportunity Attacks) and Sundering Blow (the next attack against it gets +5)." }
    ],
    15: [
      { name: "Persistent Rage", text: "Rage lasts a full 10 minutes with no need to extend it, ending early only if you fall Unconscious or don Heavy armor. On rolling Initiative you can refill all Rage uses, once per Long Rest." }
    ],
    17: [
      { name: "Improved Brutal Strike", text: "Brutal Strike's extra damage rises to 2d10, and you can apply two different effects at once." }
    ],
    18: [
      { name: "Indomitable Might", text: "If a Strength check or save totals less than your Strength score, use the score instead." }
    ],
    20: [
      { name: "Primal Champion", text: "Strength and Constitution each increase by 4, to a maximum of 25." }
    ]
  },

  subclasses: {
    berserker: {
      name: "Path of the Berserker",
      blurb: "Turns Rage outward as raw violence",
      features: {
        3: [{ name: "Frenzy", text: "While Raging and using Reckless Attack, the first target you hit each turn with a Strength attack takes extra damage: roll d6s equal to your Rage Damage bonus." }],
        6: [{ name: "Mindless Rage", text: "Immune to Charmed and Frightened while Raging, and entering a Rage ends those conditions on you." }],
        10: [{ name: "Retaliation", text: "Reaction when a creature within 5 ft. damages you: make one melee attack against it." }],
        14: [{ name: "Intimidating Presence", text: "Bonus Action: creatures you choose in a 30-ft. Emanation make a Wis save (DC 8 + Str mod + Prof) or are Frightened for 1 minute, repeating the save at the end of each of their turns. Once per Long Rest, or spend a Rage use to recharge it." }]
      }
    },
    wildHeart: {
      name: "Path of the Wild Heart",
      blurb: "Kinship with the animal world",
      features: {
        3: [
          { name: "Animal Speaker", text: "Cast Beast Sense and Speak with Animals as Rituals only, using Wisdom." },
          { name: "Rage of the Wilds", text: "On entering a Rage pick one: Bear (resistance to everything but Force, Necrotic, Psychic, Radiant), Eagle (Disengage + Dash within that Bonus Action, and as a Bonus Action while Raging), or Wolf (allies get Advantage on attacks against enemies within 5 ft. of you)." }
        ],
        6: [{ name: "Aspect of the Wilds", text: "Pick one, changeable on a Long Rest: Owl (60 ft. Darkvision, or +60 ft. if you have it), Panther (Climb Speed = Speed), or Salmon (Swim Speed = Speed)." }],
        10: [{ name: "Nature Speaker", text: "Cast Commune with Nature as a Ritual only, using Wisdom." }],
        14: [{ name: "Power of the Wilds", text: "On entering a Rage pick one: Falcon (Fly Speed = Speed while unarmored), Lion (enemies within 5 ft. have Disadvantage attacking anyone but you), or Ram (knock a Large or smaller creature Prone on a melee hit)." }]
      }
    },
    worldTree: {
      name: "Path of the World Tree",
      blurb: "Draws vitality and travel from the cosmic tree",
      features: {
        3: [{ name: "Vitality of the Tree", text: "Entering a Rage grants Temporary HP equal to your Barbarian level. Each turn while Raging you can give a creature within 10 ft. Temporary HP: roll d6s equal to your Rage Damage bonus. Those vanish when the Rage ends." }],
        6: [{ name: "Branches of the Tree", text: "Reaction when a visible creature starts its turn within 30 ft. while you Rage: Str save (DC 8 + Str mod + Prof) or it teleports next to you, and you may drop its Speed to 0 for the turn." }],
        10: [{ name: "Battering Roots", text: "On your turn your reach grows 10 ft. with Heavy or Versatile melee weapons, and hits can trigger Push or Topple on top of another mastery property." }],
        14: [{ name: "Travel along the Tree", text: "Teleport up to 60 ft. when you Rage and as a Bonus Action while Raging. Once per Rage, extend that to 150 ft. and bring up to six willing creatures from within 10 ft." }]
      }
    },
    zealot: {
      name: "Path of the Zealot",
      blurb: "Rage as ecstatic union with a god",
      features: {
        3: [
          { name: "Divine Fury", text: "While Raging, the first creature you hit each turn takes an extra 1d6 + half your Barbarian level damage, Necrotic or Radiant (your choice each time)." },
          { name: "Warrior of the Gods", text: "A pool of four d12s; Bonus Action to spend any number and heal that total. Refills on a Long Rest, and grows to 5/6/7 dice at levels 6/12/17." }
        ],
        6: [{ name: "Fanatical Focus", text: "Once per Rage, reroll a failed save adding your Rage Damage bonus; you must use the new roll." }],
        10: [{ name: "Zealous Presence", text: "Bonus Action: up to ten creatures within 60 ft. gain Advantage on attacks and saves until your next turn. Once per Long Rest, or spend a Rage use to recharge it." }],
        14: [{ name: "Rage of the Gods", text: "Rage in a divine form for 1 minute: Fly Speed = Speed with hovering, resistance to Necrotic/Psychic/Radiant, and a Reaction spending a Rage use to pull a creature within 30 ft. back from 0 HP to HP equal to your Barbarian level. Once per Long Rest." }]
      }
    }
  }
};
