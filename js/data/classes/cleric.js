/* Cleric — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const cleric = {
  key: "cleric",
  name: "Cleric",
  tagline: "A priest who channels divine power from the Outer Planes",
  primary: "Wisdom",
  hitDie: 8,
  saves: ["wis", "cha"],
  skillCount: 2,
  skillOptions: ["history", "insight", "medicine", "persuasion", "religion"],
  weaponProf: "Simple weapons",
  armorTraining: "Light and Medium armor, and Shields",
  toolProf: null,
  multiclassGrants: "Hit Point Die, Light and Medium armor training, Shield training",
  equipment: [
    { key: "A", label: "Chain Shirt, Shield, Mace, Holy Symbol, Priest's Pack, 7 GP", armor: "chainShirt", shield: true },
    { key: "B", label: "110 GP to spend freely", armor: "none", shield: false }
  ],
  caster: {
    type: "full",
    ability: "wis",
    listKey: "cleric",
    /* Prepares from the entire Cleric list after a Long Rest. */
    prepMode: "free",
    swapOnLevel: false,
    focus: "a Holy Symbol",
    cantripsByLevel: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    preparedByLevel: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22]
  },
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Divine Domain",

  tracks: [
    { label: "Channel Divinity", byLevel: [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4] },
    { label: "Divine Spark", suffix: "d8", byLevel: [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4] }
  ],

  /* Level-1 and level-7 branch choices the builder must ask about. */
  choices: [
    {
      key: "divineOrder", level: 1, label: "Divine Order",
      options: [
        { key: "protector", name: "Protector", text: "Gain Martial weapon proficiency and Heavy armor training." },
        { key: "thaumaturge", name: "Thaumaturge", text: "One extra Cleric cantrip, and add your Wisdom modifier (min +1) to Arcana and Religion checks." }
      ]
    },
    {
      key: "blessedStrikes", level: 7, label: "Blessed Strikes",
      options: [
        { key: "divineStrike", name: "Divine Strike", text: "Once per turn on a weapon hit, add 1d8 Necrotic or Radiant damage (2d8 from level 14)." },
        { key: "potentSpellcasting", name: "Potent Spellcasting", text: "Add your Wisdom modifier to Cleric cantrip damage. From level 14, damaging a creature with a cantrip also grants a creature within 60 ft. Temporary HP equal to twice your Wisdom modifier." }
      ]
    }
  ],

  features: {
    1: [
      { name: "Spellcasting", text: "Cast Cleric spells using Wisdom, with a Holy Symbol as your focus. Prepare your spells from the whole Cleric list after a Long Rest." },
      { name: "Divine Order", text: "Choose a sacred role: Protector (Martial weapons and Heavy armor) or Thaumaturge (an extra cantrip plus a Wisdom-sized bonus to Arcana and Religion checks)." }
    ],
    2: [
      { name: "Channel Divinity", text: "Two uses (one back on a Short Rest, all on a Long Rest), spent on Divine Spark — Magic action, 1d8 + Wis to heal a creature within 30 ft. or force a Con save for that much Necrotic/Radiant damage, half on a success — or Turn Undead: Magic action, each chosen Undead within 30 ft. makes a Wis save or is Frightened and Incapacitated for 1 minute while fleeing you." }
    ],
    5: [
      { name: "Sear Undead", text: "Turn Undead also deals Radiant damage: roll d8s equal to your Wisdom modifier (min 1) and apply the total to each Undead that failed the save. The turn effect continues." }
    ],
    7: [
      { name: "Blessed Strikes", text: "Choose Divine Strike (once per turn, +1d8 Necrotic or Radiant on a weapon hit) or Potent Spellcasting (add Wisdom to Cleric cantrip damage)." }
    ],
    10: [
      { name: "Divine Intervention", text: "Magic action: cast any Cleric spell of level 5 or lower that isn't a Reaction, free and without Material components. Once per Long Rest." }
    ],
    14: [
      { name: "Improved Blessed Strikes", text: "Divine Strike rises to 2d8. Potent Spellcasting additionally grants a creature within 60 ft. twice your Wisdom modifier in Temporary HP whenever a cantrip of yours damages something." }
    ],
    20: [
      { name: "Greater Divine Intervention", text: "Divine Intervention can cast Wish. Doing so locks the feature until you finish 2d4 Long Rests." }
    ]
  },

  subclasses: {
    life: {
      name: "Life Domain",
      blurb: "Healing, vitality, and the positive energy of the planes",
      spellsByLevel: {
        3: ["Aid", "Bless", "Cure Wounds", "Lesser Restoration"],
        5: ["Mass Healing Word", "Revivify"],
        7: ["Aura of Life", "Death Ward"],
        9: ["Greater Restoration", "Mass Cure Wounds"]
      },
      features: {
        3: [
          { name: "Disciple of Life", text: "A healing spell you cast with a slot restores an extra 2 + the slot's level HP." },
          { name: "Preserve Life", text: "Magic action, one Channel Divinity use: split five times your Cleric level in HP among Bloodied creatures within 30 ft., including yourself. No creature can go past half its HP maximum." }
        ],
        6: [{ name: "Blessed Healer", text: "Whenever a slot-cast healing spell heals someone else, you regain 2 + the slot's level HP." }],
        17: [{ name: "Supreme Healing", text: "Healing dice from your spells and Channel Divinity are never rolled — every die counts as its maximum." }]
      }
    },
    light: {
      name: "Light Domain",
      blurb: "Radiance, fire, and revelation that burns away lies",
      spellsByLevel: {
        3: ["Burning Hands", "Faerie Fire", "Scorching Ray", "See Invisibility"],
        5: ["Daylight", "Fireball"],
        7: ["Arcane Eye", "Wall of Fire"],
        9: ["Flame Strike", "Scrying"]
      },
      features: {
        3: [
          { name: "Radiance of the Dawn", text: "Magic action, one Channel Divinity use: a 30-ft. Emanation dispels magical Darkness and forces a Con save on each chosen creature for 2d10 + your Cleric level Radiant damage, half on a success." },
          { name: "Warding Flare", text: "Reaction when a creature you can see within 30 ft. makes an attack roll: give it Disadvantage. Uses = Wisdom modifier (min 1), refilled on a Long Rest." }
        ],
        6: [{ name: "Improved Warding Flare", text: "Warding Flare refills on a Short Rest too, and each use grants the attack's target 2d6 + your Wisdom modifier in Temporary HP." }],
        17: [{ name: "Corona of Light", text: "Magic action: 60 ft. of Bright Light plus 30 ft. of Dim Light for 1 minute. Enemies in the Bright Light have Disadvantage on saves against Radiance of the Dawn and against your Fire and Radiant spells. Uses = Wisdom modifier (min 1) per Long Rest." }]
      }
    },
    trickery: {
      name: "Trickery Domain",
      blurb: "Illusion, stealth, and mischief against the accepted order",
      spellsByLevel: {
        3: ["Charm Person", "Disguise Self", "Invisibility", "Pass without Trace"],
        5: ["Hypnotic Pattern", "Nondetection"],
        7: ["Confusion", "Dimension Door"],
        9: ["Dominate Person", "Modify Memory"]
      },
      features: {
        3: [
          { name: "Blessing of the Trickster", text: "Magic action: you or a willing creature within 30 ft. gains Advantage on Stealth checks until your next Long Rest or next use." },
          { name: "Invoke Duplicity", text: "Bonus Action, one Channel Divinity use: an intangible illusion of yourself appears within 30 ft. for 1 minute. You can cast spells from its space, gain Advantage on attacks against creatures within 5 ft. of both of you, and move it 30 ft. as a Bonus Action." }
        ],
        6: [{ name: "Trickster's Transposition", text: "Whenever you create or move the illusion, you may swap places with it." }],
        17: [{ name: "Improved Duplicity", text: "You and your allies have Advantage on attacks against creatures within 5 ft. of the illusion, and when it ends someone within 5 ft. of it regains HP equal to your Cleric level." }]
      }
    },
    war: {
      name: "War Domain",
      blurb: "Battle prowess offered up as prayer",
      spellsByLevel: {
        3: ["Guiding Bolt", "Magic Weapon", "Shield of Faith", "Spiritual Weapon"],
        5: ["Crusader's Mantle", "Spirit Guardians"],
        7: ["Fire Shield", "Freedom of Movement"],
        9: ["Hold Monster", "Steel Wind Strike"]
      },
      features: {
        3: [
          { name: "Guided Strike", text: "When you or a creature within 30 ft. misses an attack, spend a Channel Divinity use to add +10 to the roll. Helping someone else costs your Reaction." },
          { name: "War Priest", text: "Bonus Action: one weapon or Unarmed Strike attack. Uses = Wisdom modifier (min 1), refilled on a Short or Long Rest." }
        ],
        6: [{ name: "War God's Blessing", text: "Spend a Channel Divinity use instead of a slot to cast Shield of Faith or Spiritual Weapon. Cast this way they need no Concentration and last 1 minute." }],
        17: [{ name: "Avatar of Battle", text: "Resistance to Bludgeoning, Piercing, and Slashing damage." }]
      }
    }
  }
};
