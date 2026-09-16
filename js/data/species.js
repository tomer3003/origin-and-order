/* Species — 2024 rules. Traits are our own short mechanical paraphrase.

   Human, Aasimar and Tiefling can pick Medium or Small in the book; this
   builder doesn't model a size choice yet (five species launched with a
   fixed size, and these three keep that simplification for now) — note it
   if that's ever worth fixing. */

export const SPECIES = {
  human: {
    key: "human",
    name: "Human",
    tagline: "Ambitious and everywhere",
    size: "medium",
    speed: 30,
    traits: [
      { name: "Resourceful", text: "Gain Heroic Inspiration whenever you finish a Long Rest." },
      { name: "Skillful", text: "Gain proficiency in one skill of your choice." },
      { name: "Versatile", text: "Gain an Origin feat of your choice (Skilled is a good default)." }
    ],
    grantsSkillChoice: 1,
    grantsOriginFeat: true
  },

  elf: {
    key: "elf",
    name: "Elf",
    tagline: "Fey-touched and keen-sensed",
    size: "medium",
    speed: 30,
    traits: [
      { name: "Darkvision", text: "60 ft." },
      { name: "Fey Ancestry", text: "Advantage on saves against the Charmed condition." },
      { name: "Keen Senses", text: "Proficiency in Insight, Perception, or Survival." },
      { name: "Trance", text: "You don't sleep; a 4-hour trance counts as a Long Rest." }
    ],
    lineageLabel: "Elven Lineage",
    lineageChoice: {
      drow:    { name: "Drow",      text: "Darkvision extends to 120 ft., and you know Dancing Lights." },
      highElf: { name: "High Elf",  text: "You know Prestidigitation, swappable on each Long Rest." },
      woodElf: { name: "Wood Elf",  text: "Speed becomes 35 ft., and you know Druidcraft.", speed: 35 }
    },
    skillChoiceFrom: { label: "Keen Senses", options: ["insight", "perception", "survival"] }
  },

  dwarf: {
    key: "dwarf",
    name: "Dwarf",
    tagline: "Stout, stone-touched, and hard to poison",
    size: "medium",
    speed: 30,
    traits: [
      { name: "Darkvision", text: "120 ft." },
      { name: "Dwarven Resilience", text: "Resistance to Poison damage, and Advantage on saves against the Poisoned condition." },
      { name: "Dwarven Toughness", text: "+1 HP maximum, and +1 more at every level." },
      { name: "Stonecunning", text: "Bonus Action while touching stone: Tremorsense 60 ft. for 10 minutes. Uses = Proficiency Bonus per Long Rest." }
    ],
    /* Applies at every level, level 1 included. */
    hpBonusPerLevel: 1
  },

  halfling: {
    key: "halfling",
    name: "Halfling",
    tagline: "Small, lucky, and hard to pin down",
    size: "small",
    speed: 30,
    traits: [
      { name: "Brave", text: "Advantage on saves against the Frightened condition." },
      { name: "Halfling Nimbleness", text: "Move through the space of any larger creature." },
      { name: "Luck", text: "Reroll a natural 1 on any d20 Test; you must use the new roll." },
      { name: "Naturally Stealthy", text: "Hide even when only lightly obscured by a larger creature." }
    ]
  },

  dragonborn: {
    key: "dragonborn",
    name: "Dragonborn",
    tagline: "Scaled descendants of dragons",
    size: "medium",
    speed: 30,
    traits: [
      { name: "Draconic Ancestry", text: "Your chosen dragon sets your Breath Weapon and Resistance damage type." },
      { name: "Breath Weapon", text: "Replace one attack with a 15-ft. Cone or 30-ft. Line: Dex save (DC 8 + Con modifier + Proficiency Bonus) for 1d10 damage, half on a success. The die grows at levels 5, 11, and 17. Uses = Proficiency Bonus per Long Rest." },
      { name: "Damage Resistance", text: "Resistance to your ancestry's damage type." },
      { name: "Darkvision", text: "60 ft." }
    ],
    lineageLabel: "Draconic Ancestry",
    lineageChoice: {
      black:  { name: "Black",  text: "Acid damage." },
      blue:   { name: "Blue",   text: "Lightning damage." },
      brass:  { name: "Brass",  text: "Fire damage." },
      bronze: { name: "Bronze", text: "Lightning damage." },
      copper: { name: "Copper", text: "Acid damage." },
      gold:   { name: "Gold",   text: "Fire damage." },
      green:  { name: "Green",  text: "Poison damage." },
      red:    { name: "Red",    text: "Fire damage." },
      silver: { name: "Silver", text: "Cold damage." },
      white:  { name: "White",  text: "Cold damage." }
    }
  },

  aasimar: {
    key: "aasimar",
    name: "Aasimar",
    tagline: "Mortals carrying a spark of the Upper Planes",
    size: "medium",
    speed: 30,
    traits: [
      { name: "Celestial Resistance", text: "Resistance to Necrotic and Radiant damage." },
      { name: "Darkvision", text: "60 ft." },
      { name: "Healing Hands", text: "Magic action, once per Long Rest: touch a creature and roll a number of d4s equal to your Proficiency Bonus; it regains that many Hit Points." },
      { name: "Light Bearer", text: "You know the Light cantrip (Charisma)." },
      { name: "Celestial Revelation", text: "From level 3, Bonus Action transformation (1/Long Rest, lasts 1 minute): choose Heavenly Wings (Fly Speed = your Speed), Inner Radiance (10-ft. Bright Light + 10 ft. Dim, Radiant damage = Proficiency Bonus to nearby creatures each turn), or Necrotic Shroud (nearby non-allies Frightened on a failed Charisma save, DC 8 + Cha modifier + Proficiency Bonus). While transformed, once per turn add Proficiency Bonus damage (Necrotic for Shroud, Radiant otherwise) to one hit." }
    ]
  },

  gnome: {
    key: "gnome",
    name: "Gnome",
    tagline: "Small, clever, and quietly magical",
    size: "small",
    speed: 30,
    traits: [
      { name: "Darkvision", text: "60 ft." },
      { name: "Gnomish Cunning", text: "Advantage on Intelligence, Wisdom, and Charisma saving throws." }
    ],
    lineageLabel: "Gnomish Lineage",
    lineageChoice: {
      forest: { name: "Forest Gnome", text: "You know Minor Illusion, and always have Speak with Animals prepared (castable free, Proficiency Bonus times per Long Rest)." },
      rock:   { name: "Rock Gnome", text: "You know Mending and Prestidigitation, and can spend 10 minutes to build a Tiny clockwork device (AC 5, 1 HP) that reproduces one Prestidigitation effect on a touch; up to three at a time, each lasting 8 hours." }
    }
  },

  goliath: {
    key: "goliath",
    name: "Goliath",
    tagline: "Towering descendants of giants",
    size: "medium",
    speed: 35,
    traits: [
      { name: "Large Form", text: "From level 5, Bonus Action (1/Long Rest): become Large for 10 minutes if there's room — Advantage on Strength checks, +10 ft. Speed." },
      { name: "Powerful Build", text: "Advantage on checks to escape a Grapple, and you count as one size larger for carrying capacity." }
    ],
    lineageLabel: "Giant Ancestry",
    lineageChoice: {
      cloud:  { name: "Cloud's Jaunt (Cloud Giant)", text: "Bonus Action, Proficiency Bonus times per Long Rest: teleport up to 30 ft. to a space you can see." },
      fire:   { name: "Fire's Burn (Fire Giant)", text: "Proficiency Bonus times per Long Rest: a hit that deals damage also deals 1d10 Fire damage." },
      frost:  { name: "Frost's Chill (Frost Giant)", text: "Proficiency Bonus times per Long Rest: a hit that deals damage also deals 1d6 Cold damage and cuts the target's Speed by 10 ft. until your next turn." },
      hill:   { name: "Hill's Tumble (Hill Giant)", text: "Proficiency Bonus times per Long Rest: a hit on a Large or smaller creature can give it the Prone condition." },
      stone:  { name: "Stone's Endurance (Stone Giant)", text: "Proficiency Bonus times per Long Rest, Reaction when damaged: roll 1d12 + Constitution modifier and reduce the damage by that total." },
      storm:  { name: "Storm's Thunder (Storm Giant)", text: "Proficiency Bonus times per Long Rest, Reaction when damaged by a creature within 60 ft.: deal 1d8 Thunder damage back to it." }
    }
  },

  orc: {
    key: "orc",
    name: "Orc",
    tagline: "Enduring, fast, and hard to put down",
    size: "medium",
    speed: 30,
    traits: [
      { name: "Adrenaline Rush", text: "Bonus Action Dash that also grants Temporary HP equal to your Proficiency Bonus. Uses = Proficiency Bonus per Short or Long Rest." },
      { name: "Darkvision", text: "120 ft." },
      { name: "Relentless Endurance", text: "Once per Long Rest, dropping to 0 HP leaves you at 1 HP instead." }
    ]
  },

  tiefling: {
    key: "tiefling",
    name: "Tiefling",
    tagline: "Marked by a fiendish bloodline",
    size: "medium",
    speed: 30,
    traits: [
      { name: "Darkvision", text: "60 ft." },
      { name: "Otherworldly Presence", text: "You know the Thaumaturgy cantrip, cast with your Fiendish Legacy's ability." }
    ],
    lineageLabel: "Fiendish Legacy",
    lineageChoice: {
      abyssal:  { name: "Abyssal", text: "Resistance to Poison damage, and you know Poison Spray. At levels 3 and 5 you gain Ray of Sickness, then Hold Person, each always prepared and castable free once per Long Rest." },
      chthonic: { name: "Chthonic", text: "Resistance to Necrotic damage, and you know Chill Touch. At levels 3 and 5 you gain False Life, then Ray of Enfeeblement, each always prepared and castable free once per Long Rest." },
      infernal: { name: "Infernal", text: "Resistance to Fire damage, and you know Fire Bolt. At levels 3 and 5 you gain Hellish Rebuke, then Darkness, each always prepared and castable free once per Long Rest." }
    }
  }
};

export const SPECIES_KEYS = Object.keys(SPECIES);
