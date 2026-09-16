/* Species — 2024 rules. Traits are our own short mechanical paraphrase.
   More species come in Phase D; these five were in the level-1 build. */

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
  }
};

export const SPECIES_KEYS = Object.keys(SPECIES);
