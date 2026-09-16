/* Paladin — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose.
   Note: in 2024 the Paladin gets Spellcasting at LEVEL 1, not level 2. */

export const paladin = {
  key: "paladin",
  name: "Paladin",
  tagline: "A holy warrior bound to an oath, armoured in divine magic",
  primary: "Strength and Charisma",
  hitDie: 10,
  saves: ["wis", "cha"],
  skillCount: 2,
  skillOptions: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"],
  weaponProf: "Simple and Martial weapons",
  armorTraining: "Light, Medium, and Heavy armor, and Shields",
  toolProf: null,
  multiclassGrants: "Hit Point Die, Martial weapons, Light and Medium armor training, Shield training",
  equipment: [
    { key: "A", label: "Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest's Pack, 9 GP", armor: "chainMail", shield: true },
    { key: "B", label: "150 GP to spend freely", armor: "none", shield: false }
  ],
  caster: {
    type: "half",
    ability: "cha",
    listKey: "paladin",
    /* Prepares from the entire Paladin list, swapping one per Long Rest. */
    prepMode: "free",
    swapOnLevel: false,
    focus: "a Holy Symbol",
    cantripsByLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    preparedByLevel: [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15]
  },
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Sacred Oath",

  tracks: [
    { label: "Channel Divinity", byLevel: [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
    { label: "Lay On Hands Pool", byLevel: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100] },
    { label: "Weapon Mastery", byLevel: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] }
  ],

  choices: [
    {
      key: "fightingStyle", level: 2, label: "Fighting Style", optionsFrom: "paladin",
      extraOptions: [
        { key: "blessedWarrior", name: "Blessed Warrior", text: "Learn two Cleric cantrips, cast using Charisma and counting as Paladin spells. Swap one whenever you gain a Paladin level." }
      ]
    }
  ],

  features: {
    1: [
      { name: "Lay On Hands", text: "A healing pool of five times your Paladin level HP, refilled on a Long Rest. Bonus Action: touch a creature and spend any amount of it as healing, or spend 5 points to end the Poisoned condition instead." },
      { name: "Spellcasting", text: "Cast Paladin spells using Charisma, with a Holy Symbol as your focus. Prepare from the whole Paladin list and swap one prepared spell per Long Rest." },
      { name: "Weapon Mastery", text: "Use the mastery properties of 2 kinds of weapons you are proficient with; change them on a Long Rest." }
    ],
    2: [
      { name: "Fighting Style", text: "Gain a Fighting Style feat, or instead take Blessed Warrior: two Cleric cantrips cast with Charisma, swapping one per Paladin level." },
      { name: "Paladin's Smite", text: "Divine Smite is always prepared, and you can cast it free once per Long Rest." }
    ],
    3: [
      { name: "Channel Divinity", text: "Two uses (three from level 11); one back on a Short Rest, all on a Long Rest. Divine Sense — Bonus Action: for 10 minutes you know the location and type of every Celestial, Fiend, and Undead within 60 ft., plus any consecrated or desecrated ground there. Your oath adds further options." }
    ],
    5: [
      { name: "Extra Attack", text: "Attack twice when you take the Attack action." },
      { name: "Faithful Steed", text: "Find Steed is always prepared, and you can cast it free once per Long Rest." }
    ],
    6: [
      { name: "Aura of Protection", text: "A 10-ft. Emanation (30 ft. from level 18) gives you and your allies in it a bonus to saving throws equal to your Charisma modifier (min +1). Inactive while you are Incapacitated, and only one Paladin's aura can benefit a creature at a time." }
    ],
    9: [
      { name: "Abjure Foes", text: "Magic action, one Channel Divinity use: creatures up to your Charisma modifier (min 1) within 60 ft. make a Wis save or are Frightened for 1 minute or until damaged, and while so Frightened each can only move, act, or take a Bonus Action on its turn — not more than one of those." }
    ],
    10: [
      { name: "Aura of Courage", text: "You and your allies are immune to the Frightened condition while in your Aura of Protection." }
    ],
    11: [
      { name: "Radiant Strikes", text: "Melee weapon and Unarmed Strike hits deal an extra 1d8 Radiant damage." }
    ],
    14: [
      { name: "Restoring Touch", text: "Lay On Hands can also end Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned, at 5 pool points per condition." }
    ],
    18: [
      { name: "Aura Expansion", text: "Your Aura of Protection becomes a 30-ft. Emanation." }
    ]
  },

  subclasses: {
    devotion: {
      name: "Oath of Devotion",
      blurb: "Honour, mercy, and the ideals of knighthood",
      spellsByLevel: {
        3: ["Protection from Evil and Good", "Shield of Faith"],
        5: ["Aid", "Zone of Truth"],
        9: ["Beacon of Hope", "Dispel Magic"],
        13: ["Freedom of Movement", "Guardian of Faith"],
        17: ["Commune", "Flame Strike"]
      },
      features: {
        3: [{ name: "Sacred Weapon", text: "When you take the Attack action, spend a Channel Divinity use: for 10 minutes one held Melee weapon adds your Charisma modifier (min +1) to attack rolls, can deal Radiant damage, and sheds Bright Light for 20 ft. plus 20 ft. of Dim Light." }],
        7: [{ name: "Aura of Devotion", text: "You and your allies are immune to the Charmed condition while in your Aura of Protection." }],
        15: [{ name: "Smite of Protection", text: "Casting Divine Smite gives you and your allies Half Cover in your Aura of Protection until the start of your next turn." }],
        20: [{ name: "Holy Nimbus", text: "Bonus Action: for 10 minutes your aura fills with sunlight, enemies starting a turn in it take Radiant damage equal to your Charisma modifier + Proficiency Bonus, and you have Advantage on saves forced by Fiends and Undead. Once per Long Rest, or spend a level 5 slot to recharge it." }]
      }
    },
    glory: {
      name: "Oath of Glory",
      blurb: "Heroism, athletic excellence, and destined deeds",
      spellsByLevel: {
        3: ["Guiding Bolt", "Heroism"],
        5: ["Enhance Ability", "Magic Weapon"],
        9: ["Haste", "Protection from Energy"],
        13: ["Compulsion", "Freedom of Movement"],
        17: ["Legend Lore", "Yolande's Regal Presence"]
      },
      features: {
        3: [
          { name: "Inspiring Smite", text: "Right after casting Divine Smite, spend a Channel Divinity use to split 2d8 + your Paladin level in Temporary HP among creatures within 30 ft., including yourself." },
          { name: "Peerless Athlete", text: "Bonus Action, one Channel Divinity use: for 1 hour gain Advantage on Athletics and Acrobatics checks, and +10 ft. on Long and High Jumps." }
        ],
        7: [{ name: "Aura of Alacrity", text: "+10 ft. Speed for you, and any ally entering your Aura of Protection or starting a turn in it gains +10 ft. Speed until the end of their next turn." }],
        15: [{ name: "Glorious Defense", text: "Reaction when you or a creature within 10 ft. is hit: add your Charisma modifier (min +1) to the target's AC against it. If the attack misses, make one weapon attack against the attacker if in range. Uses = Charisma modifier (min 1) per Long Rest." }],
        20: [{ name: "Living Legend", text: "Bonus Action: for 10 minutes gain Advantage on all Charisma checks, a Reaction reroll on failed saves, and once per turn the ability to turn a missed weapon attack into a hit. Once per Long Rest, or spend a level 5 slot to recharge it." }]
      }
    },
    ancients: {
      name: "Oath of the Ancients",
      blurb: "Light, life, and laughter preserved against the dark",
      spellsByLevel: {
        3: ["Ensnaring Strike", "Speak with Animals"],
        5: ["Misty Step", "Moonbeam"],
        9: ["Plant Growth", "Protection from Energy"],
        13: ["Ice Storm", "Stoneskin"],
        17: ["Commune with Nature", "Tree Stride"]
      },
      features: {
        3: [{ name: "Nature's Wrath", text: "Magic action, one Channel Divinity use: chosen creatures within 15 ft. make a Str save or are Restrained for 1 minute by spectral vines, repeating the save at the end of each of their turns." }],
        7: [{ name: "Aura of Warding", text: "You and your allies have Resistance to Necrotic, Psychic, and Radiant damage while in your Aura of Protection." }],
        15: [{ name: "Undying Sentinel", text: "When reduced to 0 HP without being killed outright, drop to 1 HP and regain three times your Paladin level in HP instead. Once per Long Rest. You also stop aging visibly and can't be aged magically." }],
        20: [{ name: "Elder Champion", text: "Bonus Action: for 1 minute enemies in your aura have Disadvantage on saves against your spells and Channel Divinity, you regain 10 HP at the start of each turn, and action-casting-time spells can be cast as a Bonus Action. Once per Long Rest, or spend a level 5 slot to recharge it." }]
      }
    },
    vengeance: {
      name: "Oath of Vengeance",
      blurb: "Retribution against the grievously wicked, at any cost",
      spellsByLevel: {
        3: ["Bane", "Hunter's Mark"],
        5: ["Hold Person", "Misty Step"],
        9: ["Haste", "Protection from Energy"],
        13: ["Banishment", "Dimension Door"],
        17: ["Hold Monster", "Scrying"]
      },
      features: {
        3: [{ name: "Vow of Enmity", text: "When you take the Attack action, spend a Channel Divinity use: gain Advantage on attacks against one creature within 30 ft. for 1 minute. If it drops to 0 HP you can move the vow to another creature within 30 ft." }],
        7: [{ name: "Relentless Avenger", text: "An Opportunity Attack hit drops the target's Speed to 0 for the turn, and you can move half your Speed as part of the same Reaction without provoking." }],
        15: [{ name: "Soul of Vengeance", text: "Reaction right after a creature under your Vow of Enmity makes an attack roll, hit or miss: make a melee attack against it if it's in range." }],
        20: [{ name: "Avenging Angel", text: "Bonus Action: for 10 minutes gain a 60-ft. hovering Fly Speed on spectral wings, and enemies starting a turn in your Aura of Protection make a Wis save or are Frightened for 1 minute or until damaged. Once per Long Rest, or spend a level 5 slot to recharge it." }]
      }
    }
  }
};
