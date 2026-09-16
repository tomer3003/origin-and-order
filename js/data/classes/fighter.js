/* Fighter — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const fighter = {
  key: "fighter",
  name: "Fighter",
  tagline: "A master of every weapon and every kind of armor",
  primary: "Strength or Dexterity",
  hitDie: 10,
  saves: ["str", "con"],
  skillCount: 2,
  skillOptions: ["acrobatics", "animalHandling", "athletics", "history", "insight", "intimidation", "persuasion", "perception", "survival"],
  weaponProf: "Simple and Martial weapons",
  armorTraining: "Light, Medium, and Heavy armor, and Shields",
  toolProf: null,
  multiclassGrants: "Hit Point Die, Martial weapons, Light and Medium armor training, Shield training",
  equipment: [
    { key: "A", label: "Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer's Pack, 4 GP", armor: "chainMail", shield: false },
    { key: "B", label: "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer's Pack, 11 GP", armor: "studded", shield: false },
    { key: "C", label: "155 GP to spend freely", armor: "none", shield: false }
  ],
  caster: null,
  /* Eldritch Knight turns the Fighter into a third caster from level 3; the
     subclass carries its own `caster` block. */
  asiLevels: [4, 6, 8, 12, 14, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Fighter Subclass",

  tracks: [
    { label: "Second Wind", byLevel: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
    { label: "Weapon Mastery", byLevel: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6] },
    { label: "Action Surge", byLevel: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2] },
    { label: "Indomitable", byLevel: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3] }
  ],

  choices: [
    { key: "fightingStyle", level: 1, label: "Fighting Style", optionsFrom: "fighter" }
  ],

  features: {
    1: [
      { name: "Fighting Style", text: "Gain a Fighting Style feat of your choice." },
      { name: "Second Wind", text: "Bonus Action: regain 1d10 + Fighter level HP. Two uses (three at level 4, four at level 10); one back on a Short Rest, all on a Long Rest." },
      { name: "Weapon Mastery", text: "Use the mastery properties of 3 kinds of Simple or Martial weapons; swap one on a Long Rest. Grows to 4/5/6 kinds at levels 4/10/16." }
    ],
    2: [
      { name: "Action Surge", text: "Take one extra action on your turn (not the Magic action), once per Short or Long Rest. Twice per rest from level 17, still once per turn." },
      { name: "Tactical Mind", text: "On a failed ability check, spend a Second Wind use to add 1d10 to it instead of healing. If it still fails, the use isn't spent." }
    ],
    5: [
      { name: "Extra Attack", text: "Attack twice when you take the Attack action." },
      { name: "Tactical Shift", text: "Activating Second Wind as a Bonus Action also lets you move half your Speed without provoking Opportunity Attacks." }
    ],
    9: [
      { name: "Indomitable", text: "Reroll a failed save with a bonus equal to your Fighter level; you must take the new roll. Once per Long Rest, twice from level 13, three times from level 17." },
      { name: "Tactical Master", text: "When attacking with a weapon whose mastery you can use, swap that property for Push, Sap, or Slow on the attack." }
    ],
    11: [
      { name: "Two Extra Attacks", text: "Attack three times when you take the Attack action." }
    ],
    13: [
      { name: "Studied Attacks", text: "Missing a creature gives you Advantage on your next attack against it before the end of your next turn." }
    ],
    20: [
      { name: "Three Extra Attacks", text: "Attack four times when you take the Attack action." }
    ]
  },

  subclasses: {
    battleMaster: {
      name: "Battle Master",
      blurb: "Battlefield technique fuelled by Superiority Dice",
      /* Maneuvers known: 3 at level 3, +2 each at 7, 10, and 15. */
      maneuverGrants: { 3: 3, 7: 2, 10: 2, 15: 2 },
      superiorityDice: { 3: { count: 4, die: "d8" }, 7: { count: 5, die: "d8" }, 10: { count: 5, die: "d10" }, 15: { count: 6, die: "d10" }, 18: { count: 6, die: "d12" } },
      maneuvers: {
        ambush:            { name: "Ambush", text: "Add a Superiority Die to a Stealth check or Initiative roll (not while Incapacitated)." },
        baitAndSwitch:     { name: "Bait and Switch", text: "Spend 5 ft. of movement and a die to swap places with a willing, non-Incapacitated creature within 5 ft. without provoking. Either of you gains the roll as an AC bonus until your next turn." },
        commandersStrike:  { name: "Commander's Strike", text: "Replace one of your attacks and spend a die: a willing ally uses its Reaction to attack, adding the die to its damage." },
        commandingPresence:{ name: "Commanding Presence", text: "Add a die to an Intimidation, Performance, or Persuasion check." },
        disarmingAttack:   { name: "Disarming Attack", text: "On a hit, add the die to damage; the target makes a Str save or drops one held object in its space." },
        distractingStrike: { name: "Distracting Strike", text: "On a hit, add the die to damage; the next attack against that target by someone else has Advantage." },
        evasiveFootwork:   { name: "Evasive Footwork", text: "Bonus Action: Disengage and add the die to your AC until your next turn." },
        feintingAttack:    { name: "Feinting Attack", text: "Bonus Action: gain Advantage on your next attack this turn against a creature within 5 ft., adding the die to damage if it hits." },
        goadingAttack:     { name: "Goading Attack", text: "On a hit, add the die to damage; the target makes a Wis save or has Disadvantage attacking anyone but you until the end of your next turn." },
        lungingAttack:     { name: "Lunging Attack", text: "Bonus Action: Dash. If you move 5 ft. straight before a melee hit this turn, add the die to its damage." },
        maneuveringAttack: { name: "Maneuvering Attack", text: "On a hit, add the die to damage; a willing ally uses its Reaction to move half its Speed without provoking the target." },
        menacingAttack:    { name: "Menacing Attack", text: "On a hit, add the die to damage; the target makes a Wis save or is Frightened until the end of your next turn." },
        parry:             { name: "Parry", text: "Reaction when a melee attack damages you: reduce the damage by the die roll + your Strength or Dexterity modifier." },
        precisionAttack:   { name: "Precision Attack", text: "On a miss, add the die to the attack roll, possibly turning it into a hit." },
        pushingAttack:     { name: "Pushing Attack", text: "On a hit, add the die to damage; a Large or smaller target makes a Str save or is pushed 15 ft. away." },
        rally:             { name: "Rally", text: "Bonus Action: an ally within 30 ft. gains the die roll + half your Fighter level in Temporary HP." },
        riposte:           { name: "Riposte", text: "Reaction when a creature misses you in melee: attack it, adding the die to damage on a hit." },
        sweepingAttack:    { name: "Sweeping Attack", text: "On a melee hit, a second creature within 5 ft. of the target and in your reach takes the die roll in the same damage type, if the attack would have hit it." },
        tacticalAssessment:{ name: "Tactical Assessment", text: "Add a die to a History, Investigation, or Insight check." },
        tripAttack:        { name: "Trip Attack", text: "On a hit, add the die to damage; a Large or smaller target makes a Str save or is knocked Prone." }
      },
      features: {
        3: [
          { name: "Combat Superiority", text: "Learn 3 maneuvers (2 more at levels 7, 10, and 15, swapping one each time) fuelled by four d8 Superiority Dice, all refilled on a Short or Long Rest. Maneuver save DC = 8 + your Strength or Dexterity modifier + Proficiency Bonus. One maneuver per attack. A fifth die arrives at level 7 and a sixth at level 15." },
          { name: "Student of War", text: "Gain proficiency with one type of Artisan's Tools and one more Fighter skill." }
        ],
        7: [{ name: "Know Your Enemy", text: "Bonus Action: learn a visible creature's Immunities, Resistances, and Vulnerabilities. Once per Long Rest, or spend a Superiority Die to recharge it." }],
        10: [{ name: "Improved Combat Superiority", text: "Superiority Dice become d10s." }],
        15: [{ name: "Relentless", text: "Once per turn, roll 1d8 for a maneuver instead of spending a Superiority Die." }],
        18: [{ name: "Ultimate Combat Superiority", text: "Superiority Dice become d12s." }]
      }
    },
    champion: {
      name: "Champion",
      blurb: "Raw physical excellence and devastating criticals",
      features: {
        3: [
          { name: "Improved Critical", text: "Weapon and Unarmed Strike attacks crit on a 19 or 20." },
          { name: "Remarkable Athlete", text: "Advantage on Initiative rolls and Athletics checks, and after a Critical Hit you can move half your Speed without provoking." }
        ],
        7: [{ name: "Additional Fighting Style", text: "Gain a second Fighting Style feat." }],
        10: [{ name: "Heroic Warrior", text: "In combat, give yourself Heroic Inspiration at the start of any turn you begin without it." }],
        15: [{ name: "Superior Critical", text: "Weapon and Unarmed Strike attacks crit on an 18, 19, or 20." }],
        18: [{ name: "Survivor", text: "Advantage on Death Saving Throws, and an 18-20 on one counts as a 20. While Bloodied and above 0 HP you also regain 5 + your Constitution modifier HP at the start of each of your turns." }]
      }
    },
    eldritchKnight: {
      name: "Eldritch Knight",
      blurb: "Martial skill braided together with Wizard magic",
      /* Third caster from level 3, Wizard list, Intelligence. Indexed by
         full Fighter level; levels 1-2 have no spellcasting. */
      caster: {
        type: "third",
        ability: "int",
        listKey: "wizard",
        prepMode: "list",
        swapOnLevel: true,
        startLevel: 3,
        focus: "an Arcane Focus",
        cantripsByLevel: [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        preparedByLevel: [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13]
      },
      features: {
        3: [
          { name: "Spellcasting", text: "Cast Wizard spells using Intelligence with an Arcane Focus: 2 cantrips (3 at level 10) and a growing prepared list, swapping one cantrip and one spell whenever you gain a Fighter level." },
          { name: "War Bond", text: "A 1-hour ritual bonds you to a weapon. You can't be disarmed of it unless Incapacitated, and you can summon it to your hand as a Bonus Action from anywhere on the same plane. Up to two bonded weapons." }
        ],
        7: [{ name: "War Magic", text: "Replace one of your Attack-action attacks with a Wizard cantrip that takes an action to cast." }],
        10: [{ name: "Eldritch Strike", text: "A weapon hit gives the target Disadvantage on its next save against a spell of yours, before the end of your next turn." }],
        15: [{ name: "Arcane Charge", text: "Action Surge also lets you teleport 30 ft., before or after the extra action." }],
        18: [{ name: "Improved War Magic", text: "Replace two of your Attack-action attacks with a level 1 or 2 Wizard spell that takes an action to cast." }]
      }
    },
    psiWarrior: {
      name: "Psi Warrior",
      blurb: "Telekinetic force folded into weapon and shield",
      psionicDice: {
        3: { count: 4, die: "d6" }, 5: { count: 6, die: "d8" }, 9: { count: 8, die: "d8" },
        11: { count: 8, die: "d10" }, 13: { count: 10, die: "d10" }, 17: { count: 12, die: "d12" }
      },
      features: {
        3: [{ name: "Psionic Power", text: "A pool of Psionic Energy Dice (four d6s at level 3, growing to twelve d12s by level 17; one back on a Short Rest, all on a Long Rest) fuels three powers. Protective Field — Reaction to cut damage to you or a creature within 30 ft. by a die roll + your Intelligence modifier. Psionic Strike — once per turn after a weapon hit within 30 ft., spend a die for that much + Intelligence in Force damage. Telekinetic Movement — Magic action to move a Large-or-smaller loose object or a willing creature 30 ft., once per Short or Long Rest or by spending a die." }],
        7: [{ name: "Telekinetic Adept", text: "Psi-Powered Leap — Bonus Action for a Fly Speed of twice your Speed until the turn ends, once per Short or Long Rest or by spending a die. Telekinetic Thrust — Psionic Strike damage can also force a Str save (DC 8 + Int + Proficiency) to knock the target Prone or shove it 10 ft." }],
        10: [{ name: "Guarded Mind", text: "Resistance to Psychic damage, and you can spend a die at the start of your turn to end every effect making you Charmed or Frightened." }],
        15: [{ name: "Bulwark of Force", text: "Bonus Action: creatures of your choice within 30 ft., up to your Intelligence modifier (min 1), gain Half Cover for 1 minute. Once per Long Rest, or spend a die." }],
        18: [{ name: "Telekinetic Master", text: "Telekinesis is always prepared and castable free using Intelligence. While you Concentrate on it, make one weapon attack as a Bonus Action each turn. Once per Long Rest, or spend a die." }]
      }
    }
  }
};
