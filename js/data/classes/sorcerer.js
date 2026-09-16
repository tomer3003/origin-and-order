/* Sorcerer — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const sorcerer = {
  key: "sorcerer",
  name: "Sorcerer",
  tagline: "A caster whose magic is innate, stamped into their being",
  primary: "Charisma",
  hitDie: 6,
  saves: ["con", "cha"],
  skillCount: 2,
  skillOptions: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"],
  weaponProf: "Simple weapons",
  armorTraining: "None",
  toolProf: null,
  multiclassGrants: "Hit Point Die only",
  equipment: [
    { key: "A", label: "Spear, 2 Daggers, Arcane Focus (crystal), Dungeoneer's Pack, 28 GP", armor: "none", shield: false },
    { key: "B", label: "50 GP to spend freely", armor: "none", shield: false }
  ],
  caster: {
    type: "full",
    ability: "cha",
    listKey: "sorcerer",
    /* Fixed list that grows on level-up, with one optional swap each level. */
    prepMode: "list",
    swapOnLevel: true,
    focus: "an Arcane Focus",
    cantripsByLevel: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    /* The Sorcerer is the odd full caster: it starts at 2 prepared spells
       and climbs in twos early on. Read off the PHB table. */
    preparedByLevel: [2, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22]
  },
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Sorcerous Origin",

  tracks: [
    { label: "Sorcery Points", byLevel: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
    { label: "Metamagic Known", byLevel: [0, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6] }
  ],

  /* Metamagic picks: 2 at level 2, 2 more at 10, 2 more at 17, with one
     swap allowed on every Sorcerer level-up. */
  metamagicGrants: { 2: 2, 10: 2, 17: 2 },
  metamagic: {
    careful:    { name: "Careful Spell",   cost: 1, text: "Creatures up to your Charisma modifier (min 1) automatically succeed on their save against the spell, and take no damage where they would take half." },
    distant:    { name: "Distant Spell",   cost: 1, text: "Double the range of a spell with a range of 5 ft. or more, or make a Touch spell reach 30 ft." },
    empowered:  { name: "Empowered Spell", cost: 1, text: "Reroll damage dice up to your Charisma modifier (min 1), taking the new rolls. Stacks with another Metamagic option on the same casting." },
    extended:   { name: "Extended Spell",  cost: 1, text: "Double the duration of a spell lasting 1 minute or more, up to 24 hours, with Advantage on Concentration saves for it." },
    heightened: { name: "Heightened Spell", cost: 2, text: "One target has Disadvantage on its saves against the spell." },
    quickened:  { name: "Quickened Spell", cost: 2, text: "Cast an action-casting-time spell as a Bonus Action instead. Not usable on a turn you've already cast a level 1+ spell, and you can't cast another after it." },
    seeking:    { name: "Seeking Spell",   cost: 1, text: "Reroll a missed spell attack's d20, taking the new roll. Stacks with another Metamagic option on the same casting." },
    subtle:     { name: "Subtle Spell",    cost: 1, text: "Cast with no Verbal, Somatic, or Material components — except Material components that are consumed or have a listed cost." },
    transmuted: { name: "Transmuted Spell", cost: 1, text: "Swap the spell's damage type among Acid, Cold, Fire, Lightning, Poison, and Thunder." },
    twinned:    { name: "Twinned Spell",   cost: 1, text: "Raise a spell's effective level by 1, for spells that hit an extra creature when upcast." }
  },

  features: {
    1: [
      { name: "Spellcasting", text: "Cast Sorcerer spells using Charisma, with an Arcane Focus. Your prepared list grows as you level, and you can swap one spell per level-up." },
      { name: "Innate Sorcery", text: "Bonus Action: for 1 minute your Sorcerer spell save DC is +1 and you have Advantage on your Sorcerer spell attack rolls. Twice per Long Rest." }
    ],
    2: [
      { name: "Font of Magic", text: "Sorcery Points equal to your Sorcerer level (from level 2), refilled on a Long Rest. Spend a spell slot to gain that many points, or spend points as a Bonus Action to build a slot: 2/3/5/6/7 points for a level 1/2/3/4/5 slot, available from Sorcerer level 2/3/5/7/9. Created slots vanish on a Long Rest." },
      { name: "Metamagic", text: "Two Metamagic options, +2 at level 10 and +2 at level 17, swapping one on each level-up. One option per spell unless stated otherwise." }
    ],
    5: [
      { name: "Sorcerous Restoration", text: "On a Short Rest, regain Sorcery Points up to half your Sorcerer level (rounded down). Once per Long Rest." }
    ],
    7: [
      { name: "Sorcery Incarnate", text: "With no Innate Sorcery uses left, spend 2 Sorcery Points to activate it anyway. While it's active you can apply two Metamagic options to each spell." }
    ],
    20: [
      { name: "Arcane Apotheosis", text: "While Innate Sorcery is active, one Metamagic option per turn costs no Sorcery Points." }
    ]
  },

  subclasses: {
    aberrant: {
      name: "Aberrant Sorcery",
      blurb: "Alien psionic power burning in your mind",
      spellsByLevel: {
        3: ["Arms of Hadar", "Calm Emotions", "Detect Thoughts", "Dissonant Whispers", "Mind Sliver"],
        5: ["Hunger of Hadar", "Sending"],
        7: ["Evard's Black Tentacles", "Summon Aberration"],
        9: ["Rary's Telepathic Bond", "Telekinesis"]
      },
      features: {
        3: [
          { name: "Psionic Spells", text: "The listed spells are always prepared." },
          { name: "Telepathic Speech", text: "Bonus Action: open two-way telepathy with a creature within 30 ft., good out to your Charisma modifier in miles (min 1) and lasting minutes equal to your Sorcerer level. Ends early if you link someone else." }
        ],
        6: [
          { name: "Psionic Sorcery", text: "Cast any level 1+ Psionic Spell by spending Sorcery Points equal to its level instead of a slot. Cast that way it needs no Verbal or Somatic components, and no Material components unless consumed or costed." },
          { name: "Psychic Defenses", text: "Resistance to Psychic damage and Advantage on saves to avoid or end Charmed and Frightened." }
        ],
        14: [{ name: "Revelation in Flesh", text: "Bonus Action: spend 1+ Sorcery Points, each buying one 10-minute alteration — a doubled Swim Speed with water breathing, a hovering Fly Speed equal to your Speed, seeing Invisible creatures within 60 ft., or squeezing through 1-inch gaps and escaping nonmagical restraints for 5 ft. of movement." }],
        18: [{ name: "Warping Implosion", text: "Magic action: teleport to a space within 120 ft. Creatures within 30 ft. of where you left make a Str save for 3d10 Force damage and are dragged toward that space; half damage and no pull on a success. Once per Long Rest, or spend 5 Sorcery Points." }]
      }
    },
    clockwork: {
      name: "Clockwork Sorcery",
      blurb: "The cosmic order of Mechanus running through you",
      spellsByLevel: {
        3: ["Aid", "Alarm", "Lesser Restoration", "Protection from Evil and Good"],
        5: ["Dispel Magic", "Protection from Energy"],
        7: ["Freedom of Movement", "Summon Construct"],
        9: ["Greater Restoration", "Wall of Force"]
      },
      features: {
        3: [
          { name: "Clockwork Spells", text: "The listed spells are always prepared, and your casting carries a visible manifestation of order — spectral cogwheels, clock hands turning in your eyes, a brassy sheen, floating equations, a clockwork focus, or the ticking of gears." },
          { name: "Restore Balance", text: "Reaction when a creature within 60 ft. is about to roll a d20 with Advantage or Disadvantage: cancel both. Uses = Charisma modifier (min 1) per Long Rest." }
        ],
        6: [{ name: "Bastion of Law", text: "Magic action: spend 1 to 5 Sorcery Points to ward yourself or a creature within 30 ft. with that many d8s. The warded creature can spend and roll any of those dice to cut incoming damage by the total. Lasts until a Long Rest or your next use." }],
        14: [{ name: "Trance of Order", text: "Bonus Action: for 1 minute attacks against you can't have Advantage and you treat a d20 of 9 or lower as a 10 on every d20 Test. Once per Long Rest, or spend 5 Sorcery Points." }],
        18: [{ name: "Clockwork Cavalcade", text: "Magic action: a 30-ft. Cube of order spirits heals up to 100 HP split as you choose, repairs damaged objects in the area, and ends spells of level 6 or lower you choose there. Once per Long Rest, or spend 7 Sorcery Points." }]
      }
    },
    draconic: {
      name: "Draconic Sorcery",
      blurb: "The blood and resilience of dragons",
      spellsByLevel: {
        3: ["Alter Self", "Chromatic Orb", "Command", "Dragon's Breath"],
        5: ["Fear", "Fly"],
        7: ["Arcane Eye", "Charm Monster"],
        9: ["Legend Lore", "Summon Dragon"]
      },
      /* Draconic Resilience: +3 HP at level 3, then +1 per Sorcerer level. */
      hpBonus: { fromLevel: 3, initial: 3, perLevel: 1 },
      /* Scales: unarmored AC = 10 + Dex + Cha. */
      unarmoredDefense: ["dex", "cha"],
      features: {
        3: [
          { name: "Draconic Resilience", text: "Your HP maximum rises by 3 now and by 1 more with every Sorcerer level after. Dragon-like scales mean that while unarmored your AC = 10 + Dex modifier + Cha modifier." },
          { name: "Draconic Spells", text: "The listed spells are always prepared." }
        ],
        6: [{ name: "Elemental Affinity", text: "Pick Acid, Cold, Fire, Lightning, or Poison: you gain Resistance to it, and spells of yours that deal it add your Charisma modifier to one damage roll." }],
        14: [{ name: "Dragon Wings", text: "Bonus Action: draconic wings grant a 60-ft. Fly Speed for 1 hour. Once per Long Rest, or spend 3 Sorcery Points." }],
        18: [{ name: "Dragon Companion", text: "Cast Summon Dragon without its Material component, free once per Long Rest, and you can drop its Concentration requirement to make it last 1 minute." }]
      }
    },
    wildMagic: {
      name: "Wild Magic Sorcery",
      blurb: "Raw chaos that surges out of your spellcasting",
      features: {
        3: [
          { name: "Wild Magic Surge", text: "Once per turn, after casting a Sorcerer spell with a slot, roll 1d20; on a 20 roll on the Wild Magic Surge table. A surge that produces a spell is too wild for your Metamagic." },
          { name: "Tides of Chaos", text: "Give yourself Advantage on one d20 Test before rolling. You then need a slot-cast Sorcerer spell or a Long Rest to use it again — and casting that spell triggers an automatic Wild Magic Surge roll." }
        ],
        6: [{ name: "Bend Luck", text: "Reaction right after another creature you can see rolls a d20: spend 1 Sorcery Point to roll 1d4 and add or subtract it from their roll." }],
        14: [{ name: "Controlled Chaos", text: "Whenever you roll on the Wild Magic Surge table, roll twice and pick either result." }],
        18: [{ name: "Tamed Surge", text: "Right after casting a Sorcerer spell with a slot, pick any Wild Magic Surge effect except the final row instead of rolling for it, still making any rolls it calls for. Once per Long Rest." }]
      }
    }
  }
};
