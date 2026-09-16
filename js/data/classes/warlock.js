/* Warlock — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose.
   Pact Magic slots are tracked entirely separately and NEVER merge into a
   multiclass character's regular spell slots. */

export const warlock = {
  key: "warlock",
  name: "Warlock",
  tagline: "A pact-bound seeker of power from an otherworldly patron",
  primary: "Charisma",
  hitDie: 8,
  saves: ["wis", "cha"],
  skillCount: 2,
  skillOptions: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"],
  weaponProf: "Simple weapons",
  armorTraining: "Light armor",
  toolProf: null,
  multiclassGrants: "Hit Point Die, Light armor training",
  equipment: [
    { key: "A", label: "Leather Armor, Sickle, 2 Daggers, Arcane Focus (orb), Book (occult lore), Scholar's Pack, 15 GP", armor: "leather", shield: false },
    { key: "B", label: "100 GP to spend freely", armor: "none", shield: false }
  ],
  caster: {
    type: "pact",
    ability: "cha",
    listKey: "warlock",
    /* Fixed list that grows on level-up, with one optional swap each level. */
    prepMode: "list",
    swapOnLevel: true,
    focus: "an Arcane Focus",
    cantripsByLevel: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    preparedByLevel: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15]
  },
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Otherworldly Patron",

  /* All three read directly off the PHB Warlock Features table — the SRD
     mirror's transcription of these columns was wrong. */
  tracks: [
    { label: "Invocations Known", byLevel: [1, 3, 3, 3, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10] },
    { label: "Pact Slots", byLevel: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4] },
    { label: "Slot Level", byLevel: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] }
  ],

  /* Invocation count by level, and the Mystic Arcanum spell levels. */
  invocationsByLevel: [1, 3, 3, 3, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10],
  mysticArcanum: { 11: 6, 13: 7, 15: 8, 17: 9 },

  invocations: {
    agonizingBlast:     { name: "Agonizing Blast",            minLevel: 2,  repeatable: true, text: "Add your Charisma modifier to the damage of one chosen damaging Warlock cantrip." },
    armorOfShadows:     { name: "Armor of Shadows",           minLevel: 1,  text: "Cast Mage Armor on yourself free, at will." },
    ascendantStep:      { name: "Ascendant Step",             minLevel: 5,  text: "Cast Levitate on yourself free, at will." },
    devilsSight:        { name: "Devil's Sight",              minLevel: 2,  text: "See normally in Dim Light and Darkness, magical or not, out to 120 ft." },
    devouringBlade:     { name: "Devouring Blade",            minLevel: 12, requires: "thirstingBlade", text: "Thirsting Blade's Extra Attack grants two extra attacks instead of one." },
    eldritchMind:       { name: "Eldritch Mind",              minLevel: 1,  text: "Advantage on Constitution saves to maintain Concentration." },
    eldritchSmite:      { name: "Eldritch Smite",             minLevel: 5,  requires: "pactOfTheBlade", text: "Once per turn on a pact weapon hit, spend a Pact Magic slot for 1d8 Force damage per slot level plus 1d8, and knock a Huge or smaller target Prone." },
    eldritchSpear:      { name: "Eldritch Spear",             minLevel: 2,  repeatable: true, text: "One chosen damaging Warlock cantrip with a range of 10+ ft. gains 30 ft. of range per Warlock level." },
    fiendishVigor:      { name: "Fiendish Vigor",             minLevel: 2,  text: "Cast False Life on yourself free, at will, always taking the die's maximum Temporary HP." },
    gazeOfTwoMinds:     { name: "Gaze of Two Minds",          minLevel: 5,  text: "Bonus Action: touch a willing creature to perceive through its senses until the end of your next turn, extendable each turn with another Bonus Action. You gain its special senses and, within 60 ft., can cast from either space." },
    giftOfTheDepths:    { name: "Gift of the Depths",         minLevel: 5,  text: "Breathe underwater with a Swim Speed equal to your Speed, and cast Water Breathing free once per Long Rest." },
    giftOfTheProtectors:{ name: "Gift of the Protectors",     minLevel: 9,  requires: "pactOfTheTome", text: "A page in your Book of Shadows holds up to your Charisma modifier in names (min 1). A named creature reduced to 0 HP without being killed outright drops to 1 HP instead — once per Long Rest across all names." },
    investmentChainMaster:{ name: "Investment of the Chain Master", minLevel: 5, requires: "pactOfTheChain", text: "Your Find Familiar gains a 40-ft. Fly or Swim Speed, attacks on your Bonus Action command, can convert its physical damage to Necrotic or Radiant, uses your spell save DC, and can be given Resistance with your Reaction." },
    lessonsFirstOnes:   { name: "Lessons of the First Ones",  minLevel: 2,  repeatable: true, text: "Gain one Origin feat of your choice." },
    lifedrinker:        { name: "Lifedrinker",                minLevel: 9,  requires: "pactOfTheBlade", text: "Once per turn on a pact weapon hit, add 1d6 Necrotic, Psychic, or Radiant damage, and you may spend a Hit Point Die to heal that roll + your Constitution modifier (min 1)." },
    maskOfManyFaces:    { name: "Mask of Many Faces",         minLevel: 2,  text: "Cast Disguise Self free, at will." },
    masterMyriadForms:  { name: "Master of Myriad Forms",     minLevel: 5,  text: "Cast Alter Self free, at will." },
    mistyVisions:       { name: "Misty Visions",              minLevel: 2,  text: "Cast Silent Image free, at will." },
    oneWithShadows:     { name: "One with Shadows",           minLevel: 5,  text: "While in Dim Light or Darkness, cast Invisibility on yourself free." },
    otherworldlyLeap:   { name: "Otherworldly Leap",          minLevel: 2,  text: "Cast Jump on yourself free, at will." },
    pactOfTheBlade:     { name: "Pact of the Blade",          minLevel: 1,  text: "Bonus Action: conjure or bond a Simple or Martial Melee weapon. You're proficient with it, can use it as a Spellcasting Focus, attack with Charisma, and choose Necrotic, Psychic, or Radiant damage instead of its normal type." },
    pactOfTheChain:     { name: "Pact of the Chain",          minLevel: 1,  text: "Cast Find Familiar free as a Magic action, with Imp, Pseudodragon, Quasit, Skeleton, Slaad Tadpole, Sphinx of Wonder, Sprite, and Venomous Snake added to the form list. You can forgo one of your attacks to let the familiar attack with its Reaction." },
    pactOfTheTome:      { name: "Pact of the Tome",           minLevel: 1,  text: "Conjure a Book of Shadows after each rest holding three cantrips and two level 1 Ritual spells from any class list — all prepared as Warlock spells while you carry it, and the book works as a Spellcasting Focus." },
    repellingBlast:     { name: "Repelling Blast",            minLevel: 2,  repeatable: true, text: "One chosen attack-roll Warlock cantrip pushes a Large or smaller target 10 ft. away on a hit." },
    thirstingBlade:     { name: "Thirsting Blade",            minLevel: 5,  requires: "pactOfTheBlade", text: "Extra Attack with your pact weapon only: attack twice with it on the Attack action." },
    visionsDistantRealms:{ name: "Visions of Distant Realms", minLevel: 9,  text: "Cast Arcane Eye free, at will." },
    whispersOfTheGrave: { name: "Whispers of the Grave",      minLevel: 7,  text: "Cast Speak with Dead free, at will." },
    witchSight:         { name: "Witch Sight",                minLevel: 15, text: "Truesight out to 30 ft." }
  },

  features: {
    1: [
      { name: "Eldritch Invocations", text: "One invocation now, growing to ten by level 19, and you can swap one whenever you gain a Warlock level — as long as it isn't a prerequisite for another you hold. Invocations with a level prerequisite unlock at that Warlock level." },
      { name: "Pact Magic", text: "Cast Warlock spells using Charisma with an Arcane Focus. Your Pact Magic slots are few but all the same level and come back on a Short Rest as well as a Long Rest. 2 cantrips (3 at level 4, 4 at level 10) and a growing prepared list, swapping one cantrip and one spell per level-up." }
    ],
    2: [
      { name: "Magical Cunning", text: "A 1-minute rite restores expended Pact Magic slots up to half your maximum (rounded up). Once per Long Rest." }
    ],
    9: [
      { name: "Contact Patron", text: "Contact Other Plane is always prepared; cast it free to reach your patron and auto-succeed on its save. Once per Long Rest." }
    ],
    11: [
      { name: "Mystic Arcanum", text: "Choose a level 6 Warlock spell and cast it free once per Long Rest. You add a level 7 spell at 13, a level 8 at 15, and a level 9 at 17, and can swap one arcanum spell per level-up." }
    ],
    20: [
      { name: "Eldritch Master", text: "Magical Cunning now restores all your expended Pact Magic slots." }
    ]
  },

  subclasses: {
    archfey: {
      name: "Archfey Patron",
      blurb: "Fey trickery, teleportation, and glamour",
      spellsByLevel: {
        3: ["Calm Emotions", "Faerie Fire", "Misty Step", "Phantasmal Force", "Sleep"],
        5: ["Blink", "Plant Growth"],
        7: ["Dominate Beast", "Greater Invisibility"],
        9: ["Dominate Person", "Seeming"]
      },
      features: {
        3: [
          { name: "Archfey Spells", text: "The listed spells are always prepared." },
          { name: "Steps of the Fey", text: "Cast Misty Step free, uses = Charisma modifier (min 1) per Long Rest. Each casting can add Refreshing Step (you or a creature within 10 ft. gains 1d10 Temporary HP) or Taunting Step (creatures within 5 ft. of the space you left make a Wis save or have Disadvantage attacking anyone but you until your next turn)." }
        ],
        6: [{ name: "Misty Escape", text: "Cast Misty Step as a Reaction to taking damage, and gain two more Steps of the Fey options: Disappearing Step (Invisible until your next turn or until you attack, damage, or cast) and Dreadful Step (creatures within 5 ft. of either space make a Wis save or take 2d10 Psychic damage)." }],
        10: [{ name: "Beguiling Defenses", text: "Immune to the Charmed condition. Reaction when a creature you can see hits you: halve the damage and force a Wis save, dealing the attacker Psychic damage equal to what you took on a failure. Once per Long Rest, or spend a Pact Magic slot." }],
        14: [{ name: "Bewitching Magic", text: "Right after casting an Enchantment or Illusion spell with an action and a slot, cast Misty Step free as part of the same action." }]
      }
    },
    celestial: {
      name: "Celestial Patron",
      blurb: "Radiant healing light drawn from the Upper Planes",
      spellsByLevel: {
        3: ["Aid", "Cure Wounds", "Guiding Bolt", "Lesser Restoration", "Light", "Sacred Flame"],
        5: ["Daylight", "Revivify"],
        7: ["Guardian of Faith", "Wall of Fire"],
        9: ["Greater Restoration", "Summon Celestial"]
      },
      features: {
        3: [
          { name: "Celestial Spells", text: "The listed spells are always prepared." },
          { name: "Healing Light", text: "A pool of d6s numbering 1 + your Warlock level. Bonus Action: spend up to your Charisma modifier (min 1) of them to heal yourself or a creature within 60 ft. by the total rolled. Refills on a Long Rest." }
        ],
        6: [{ name: "Radiant Soul", text: "Resistance to Radiant damage, and once per turn a spell of yours dealing Radiant or Fire damage adds your Charisma modifier against one target." }],
        10: [{ name: "Celestial Resilience", text: "Using Magical Cunning or finishing any rest grants you your Warlock level + Charisma modifier in Temporary HP, and up to five creatures you can see each get half your Warlock level + your Charisma modifier." }],
        14: [{ name: "Searing Vengeance", text: "When you or an ally within 60 ft. is about to make a Death Saving Throw, the creature instead regains half its HP maximum and can stand up. Creatures of your choice within 30 ft. of it take 2d8 + your Charisma modifier Radiant damage and are Blinded until the end of the turn. Once per Long Rest." }]
      }
    },
    fiend: {
      name: "Fiend Patron",
      blurb: "A bargain struck with the Lower Planes",
      spellsByLevel: {
        3: ["Burning Hands", "Command", "Scorching Ray", "Suggestion"],
        5: ["Fireball", "Stinking Cloud"],
        7: ["Fire Shield", "Wall of Fire"],
        9: ["Geas", "Insect Plague"]
      },
      features: {
        3: [
          { name: "Dark One's Blessing", text: "Reducing an enemy to 0 HP — or an ally doing so within 10 ft. of you — grants you your Charisma modifier + Warlock level in Temporary HP (min 1)." },
          { name: "Fiend Spells", text: "The listed spells are always prepared." }
        ],
        6: [{ name: "Dark One's Own Luck", text: "Add 1d10 to an ability check or save, after seeing the roll but before its effects. Uses = Charisma modifier (min 1) per Long Rest, once per roll." }],
        10: [{ name: "Fiendish Resilience", text: "After each rest choose a damage type other than Force; you have Resistance to it until you choose another." }],
        14: [{ name: "Hurl Through Hell", text: "Once per turn on a hit, the target makes a Cha save or vanishes through the Lower Planes: 8d10 Psychic damage unless it's a Fiend, and Incapacitated until the end of your next turn, when it returns. Once per Long Rest, or spend a Pact Magic slot." }]
      }
    },
    greatOldOne: {
      name: "Great Old One Patron",
      blurb: "Forbidden lore from an indifferent elder being",
      spellsByLevel: {
        3: ["Detect Thoughts", "Dissonant Whispers", "Phantasmal Force", "Tasha's Hideous Laughter"],
        5: ["Clairvoyance", "Hunger of Hadar"],
        7: ["Confusion", "Summon Aberration"],
        9: ["Modify Memory", "Telekinesis"]
      },
      features: {
        3: [
          { name: "Awakened Mind", text: "Bonus Action: open two-way telepathy with a creature within 30 ft., good out to your Charisma modifier in miles (min 1) and lasting minutes equal to your Warlock level. Ends early if you link someone else." },
          { name: "Great Old One Spells", text: "The listed spells are always prepared." },
          { name: "Psychic Spells", text: "Change any damaging Warlock spell's damage type to Psychic, and cast Warlock Enchantment and Illusion spells without Verbal or Somatic components." }
        ],
        6: [{ name: "Clairvoyant Combatant", text: "On forming an Awakened Mind bond, force a Wis save: on a failure the creature has Disadvantage attacking you and you have Advantage attacking it for the bond's duration. Once per Short or Long Rest, or spend a Pact Magic slot." }],
        10: [
          { name: "Eldritch Hex", text: "Hex is always prepared, and its chosen ability also gives the target Disadvantage on saves of that ability." },
          { name: "Thought Shield", text: "Your thoughts can't be read without consent, you have Resistance to Psychic damage, and a creature dealing you Psychic damage takes the same amount." }
        ],
        14: [{ name: "Create Thrall", text: "Summon Aberration can drop its Concentration requirement to last 1 minute, and the Aberration arrives with your Warlock level + Charisma modifier in Temporary HP. Its first hit each turn on a Hexed creature adds that spell's bonus damage as Psychic damage." }]
      }
    }
  }
};
