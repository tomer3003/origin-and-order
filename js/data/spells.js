/* Spells — 2024 rules. Descriptions are our own short paraphrase, never book
   prose (same discipline as classes/feats). `classes` lists every class list
   (by `listKey`, matching each class's `caster.listKey`) a spell appears on
   — many spells are shared, so each spell is defined once here and tagged
   with every list it belongs to, rather than duplicated per class.

   COVERAGE NOTE (breadth-first, matches the rest of the build): this is
   cantrips (level 0) and level-1 spells only, for the 6 lists that actually
   have spells in the 2024 PHB (Bard, Cleric, Druid, Sorcerer, Warlock,
   Wizard) plus the two half-caster lists (Paladin, Ranger) which start at
   level 1 spells with no cantrips. It is NOT the full ~350-spell book —
   levels 2-9 are Phase D. The picking flow, per-class filtering, and hover
   tooltips are all fully built against this data, so extending it later is
   purely adding more entries here, no code changes.

   `roll` drives the auto-generated TL;DR (see spellTLDR in app.js):
     "attack"   — a spell attack roll (ranged or melee)
     "save"     — the target makes a saving throw against your spell DC
     "none"     — no attack roll or save (utility, buff, summon, etc.)
   `saveAbility` only applies when roll === "save". `damage` is a short
   string like "1d10 Fire" or null. `effect` is any other notable mechanical
   effect worth calling out, kept separate from the damage line. */

export const SPELLS = {
  /* ---------------- Cantrips ---------------- */
  acidSplash: {
    name: "Acid Splash", level: 0, school: "Conjuration", classes: ["sorcerer", "wizard"],
    time: "Action", range: "60 ft.", components: "V, S", duration: "Instantaneous",
    text: "Hurl a bubble of acid at one or two creatures within 5 ft. of each other.",
    roll: "save", saveAbility: "dex", damage: "1d6 Acid (scales with level)", effect: null
  },
  chillTouch: {
    name: "Chill Touch", level: 0, school: "Necromancy", classes: ["sorcerer", "warlock", "wizard"],
    time: "Action", range: "120 ft.", components: "V, S", duration: "1 round",
    text: "A ghostly skeletal hand strikes a creature and clings to it.",
    roll: "attack", saveAbility: null, damage: "1d8 Necrotic (scales with level)", effect: "Target can't regain HP until the start of your next turn; against Undead, also Disadvantage on attacks against you."
  },
  controlFlames: {
    name: "Control Flames", level: 0, school: "Transmutation", classes: ["druid", "sorcerer", "wizard"],
    time: "Action", range: "60 ft.", components: "S", duration: "Instantaneous or 1 hour",
    text: "Manipulate a nonmagical flame — shrink, grow, change color, or shape it briefly, or snuff a small one out.",
    roll: "none", saveAbility: null, damage: null, effect: "Purely utility; no damage."
  },
  createBonfire: {
    name: "Create Bonfire", level: 0, school: "Conjuration", classes: ["druid", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "60 ft.", components: "V, S", duration: "Concentration, 1 minute",
    text: "Summon a fire in a 5-ft. cube that burns anything standing in it.",
    roll: "save", saveAbility: "dex", damage: "1d8 Fire (scales with level)", effect: "Damage repeats each turn a creature ends its turn in the fire."
  },
  dancingLights: {
    name: "Dancing Lights", level: 0, school: "Illusion", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "120 ft.", components: "V, S, M", duration: "Concentration, 1 minute",
    text: "Create up to four torch-sized lights that you move around as a Bonus Action, or merge into one dim humanoid shape.",
    roll: "none", saveAbility: null, damage: null, effect: "Light and misdirection only, no damage."
  },
  druidcraft: {
    name: "Druidcraft", level: 0, school: "Divination", classes: ["druid"],
    time: "Action", range: "30 ft.", components: "V, S", duration: "Instantaneous",
    text: "A small nature trick: predict the day's weather, make a flower bloom, create a sensory effect, or light/snuff a small flame.",
    roll: "none", saveAbility: null, damage: null, effect: "Purely flavor/utility."
  },
  eldritchBlast: {
    name: "Eldritch Blast", level: 0, school: "Evocation", classes: ["warlock"],
    time: "Action", range: "120 ft.", components: "V, S", duration: "Instantaneous",
    text: "A beam of crackling energy strikes one creature; at higher levels you fire more beams, each targetable separately.",
    roll: "attack", saveAbility: null, damage: "1d10 Force per beam (more beams at levels 5/11/17)", effect: null
  },
  fireBolt: {
    name: "Fire Bolt", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "120 ft.", components: "V, S", duration: "Instantaneous",
    text: "Hurl a mote of fire at a creature or object.",
    roll: "attack", saveAbility: null, damage: "1d10 Fire (scales with level)", effect: "Can ignite flammable objects that aren't worn or carried."
  },
  friends: {
    name: "Friends", level: 0, school: "Enchantment", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "Self", components: "S, M", duration: "Concentration, 1 minute",
    text: "Advantage on Charisma checks against one creature — but it knows you charmed it once the spell ends, and likely resents it.",
    roll: "none", saveAbility: null, damage: null, effect: "Advantage on Charisma checks against the target; social risk if discovered."
  },
  frostbite: {
    name: "Frostbite", level: 0, school: "Evocation", classes: ["druid", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "60 ft.", components: "V, S", duration: "Instantaneous",
    text: "Numbing frost sears a creature.",
    roll: "save", saveAbility: "con", damage: "1d6 Cold (scales with level)", effect: "On a failed save, the target also has Disadvantage on its next attack roll before your next turn."
  },
  guidance: {
    name: "Guidance", level: 0, school: "Divination", classes: ["cleric", "druid"],
    time: "Action", range: "Touch", components: "V, S", duration: "Concentration, 1 minute",
    text: "Touch a willing creature; once before the spell ends it can add 1d4 to one ability check.",
    roll: "none", saveAbility: null, damage: null, effect: "+1d4 to one ability check."
  },
  gust: {
    name: "Gust", level: 0, school: "Transmutation", classes: ["druid", "sorcerer", "wizard"],
    time: "Action", range: "30 ft.", components: "V, S", duration: "Instantaneous",
    text: "A gust of wind — either shove one creature 5 ft., fan away gas/vapor, or ripple cloth and flags.",
    roll: "save", saveAbility: "str", damage: null, effect: "On a failed save, push the target 5 ft."
  },
  light: {
    name: "Light", level: 0, school: "Evocation", classes: ["cleric", "sorcerer", "wizard"],
    time: "Action", range: "Touch", components: "V, M", duration: "1 hour",
    text: "Make an object shed bright light in a 20-ft. radius.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility light source only."
  },
  mageHand: {
    name: "Mage Hand", level: 0, school: "Conjuration", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "30 ft.", components: "V, S", duration: "1 minute",
    text: "A spectral hand that can manipulate objects, open unlocked doors/containers, and carry up to 10 lb.",
    roll: "none", saveAbility: null, damage: null, effect: "No damage; remote manipulation only."
  },
  mending: {
    name: "Mending", level: 0, school: "Transmutation", classes: ["cleric", "druid", "sorcerer", "wizard"],
    time: "1 minute", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    text: "Repair a single break or tear in an object you touch.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility repair only."
  },
  message: {
    name: "Message", level: 0, school: "Transmutation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "120 ft.", components: "V, S", duration: "1 round",
    text: "Whisper a message to one creature you can see; it can whisper back.",
    roll: "none", saveAbility: null, damage: null, effect: "Private one-round two-way whisper."
  },
  mindSliver: {
    name: "Mind Sliver", level: 0, school: "Enchantment", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "60 ft.", components: "V", duration: "Instantaneous",
    text: "A sliver of psychic energy cuts into a creature's mind.",
    roll: "save", saveAbility: "int", damage: "1d6 Psychic (scales with level)", effect: "On a failed save, the target subtracts 1d4 from its next saving throw before the end of your next turn."
  },
  minorIllusion: {
    name: "Minor Illusion", level: 0, school: "Illusion", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "30 ft.", components: "S, M", duration: "1 minute",
    text: "Create a harmless sound or a small visual illusion in one 5-ft. cube.",
    roll: "none", saveAbility: null, damage: null, effect: "Investigation check to see through it if interacted with."
  },
  poisonSpray: {
    name: "Poison Spray", level: 0, school: "Conjuration", classes: ["druid", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "10 ft.", components: "V, S", duration: "Instantaneous",
    text: "Project a puff of noxious gas at a creature.",
    roll: "save", saveAbility: "con", damage: "1d12 Poison (scales with level)", effect: null
  },
  prestidigitation: {
    name: "Prestidigitation", level: 0, school: "Transmutation", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "10 ft.", components: "V, S", duration: "Up to 1 hour",
    text: "A minor magic trick: a sensory effect, lighting/snuffing a small flame, cleaning/soiling an object, or similar.",
    roll: "none", saveAbility: null, damage: null, effect: "Choose one small effect from a fixed menu; no combat use."
  },
  produceFlame: {
    name: "Produce Flame", level: 0, school: "Conjuration", classes: ["druid"],
    time: "Action", range: "Self", components: "V, S", duration: "10 minutes",
    text: "A flame flickers in your hand, usable as a light source or thrown at a creature within 30 ft.",
    roll: "attack", saveAbility: null, damage: "1d8 Fire (scales with level)", effect: "Also works as a torch-equivalent light source until thrown or dismissed."
  },
  rayOfFrost: {
    name: "Ray of Frost", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "60 ft.", components: "V, S", duration: "Instantaneous",
    text: "A frigid beam of blue-white light streaks toward a creature.",
    roll: "attack", saveAbility: null, damage: "1d8 Cold (scales with level)", effect: "On a hit, target's Speed is reduced by 10 ft. until the start of your next turn."
  },
  sacredFlame: {
    name: "Sacred Flame", level: 0, school: "Evocation", classes: ["cleric"],
    time: "Action", range: "60 ft.", components: "V, S", duration: "Instantaneous",
    text: "Flame-like radiance descends on a creature.",
    roll: "save", saveAbility: "dex", damage: "1d8 Radiant (scales with level)", effect: "Target gains no benefit from Half or Three-Quarters Cover for this save."
  },
  shillelagh: {
    name: "Shillelagh", level: 0, school: "Transmutation", classes: ["druid"],
    time: "Bonus Action", range: "Touch", components: "V, S, M", duration: "1 minute",
    text: "Imbue a club or quarterstaff with nature's power; use Wisdom for its attack and damage rolls.",
    roll: "none", saveAbility: null, damage: "1d8 (weapon die), Wisdom-based", effect: "Also counts as magical for overcoming resistance."
  },
  shockingGrasp: {
    name: "Shocking Grasp", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "Lightning springs from your hand into a creature you touch, with Advantage if it's wearing metal armor.",
    roll: "attack", saveAbility: null, damage: "1d8 Lightning (scales with level)", effect: "Target can't take Reactions until the start of its next turn."
  },
  spareTheDying: {
    name: "Spare the Dying", level: 0, school: "Necromancy", classes: ["cleric"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "Touch a creature with 0 Hit Points to stabilize it.",
    roll: "none", saveAbility: null, damage: null, effect: "Stabilizes a dying creature; no healing."
  },
  thaumaturgy: {
    name: "Thaumaturgy", level: 0, school: "Divination", classes: ["cleric"],
    time: "Action", range: "30 ft.", components: "V", duration: "Up to 1 minute",
    text: "A minor supernatural sign: your voice booms, nearby flames flicker, or similar small omens.",
    roll: "none", saveAbility: null, damage: null, effect: "Choose one small effect from a fixed menu; no combat use."
  },
  thornWhip: {
    name: "Thorn Whip", level: 0, school: "Transmutation", classes: ["druid"],
    time: "Action", range: "30 ft.", components: "V, S, M", duration: "Instantaneous",
    text: "A vine-like whip of thorns lashes a creature and hauls it toward you.",
    roll: "attack", saveAbility: null, damage: "1d6 Piercing (scales with level)", effect: "On a hit, pull the target up to 10 ft. closer to you."
  },
  thunderclap: {
    name: "Thunderclap", level: 0, school: "Evocation", classes: ["bard", "druid", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "Self (5 ft.)", components: "S", duration: "Instantaneous",
    text: "A burst of thunderous force erupts from your hand.",
    roll: "save", saveAbility: "con", damage: "1d6 Thunder (scales with level)", effect: "Affects every creature in a 5-ft. radius around you."
  },
  trueStrike: {
    name: "True Strike", level: 0, school: "Divination", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "Self", components: "S", duration: "Instantaneous",
    text: "Channel magic through a weapon strike to guide your aim.",
    roll: "attack", saveAbility: null, damage: "Your weapon's normal damage (this spell just grants the attack)", effect: "Make one weapon attack, using your spellcasting ability for the attack roll instead of Strength/Dexterity."
  },
  viciousMockery: {
    name: "Vicious Mockery", level: 0, school: "Enchantment", classes: ["bard"],
    time: "Action", range: "60 ft.", components: "V", duration: "Instantaneous",
    text: "Unleash a string of withering insults laced with subtle magic.",
    roll: "save", saveAbility: "wis", damage: "1d6 Psychic (scales with level)", effect: "On a failed save, the target also has Disadvantage on its next attack roll before your next turn."
  },
  wordOfRadiance: {
    name: "Word of Radiance", level: 0, school: "Evocation", classes: ["cleric"],
    time: "Action", range: "Self (5 ft.)", components: "V, M", duration: "Instantaneous",
    text: "Radiant power bursts outward, searing nearby foes.",
    roll: "save", saveAbility: "con", damage: "1d6 Radiant (scales with level)", effect: "Affects every creature of your choice in a 5-ft. radius around you."
  },

  /* ---------------- Level 1 ---------------- */
  alarm: {
    name: "Alarm", level: 1, school: "Abjuration", ritual: true, classes: ["ranger", "wizard"],
    time: "1 minute", range: "30 ft.", components: "V, S, M", duration: "8 hours",
    text: "Set an audible or mental alarm on a 20-ft. cube that warns you if a creature enters it.",
    roll: "none", saveAbility: null, damage: null, effect: "Pure warning/utility; no damage."
  },
  animalFriendship: {
    name: "Animal Friendship", level: 1, school: "Enchantment", classes: ["bard", "druid", "ranger"],
    time: "Action", range: "30 ft.", components: "V, S, M", duration: "24 hours",
    text: "Convince a beast that you mean it no harm.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save the beast is Charmed for the duration (broken early if you or a companion harm it)."
  },
  bane: {
    name: "Bane", level: 1, school: "Enchantment", classes: ["bard", "cleric"],
    time: "Action", range: "30 ft.", components: "V, S, M", duration: "Concentration, 1 minute",
    text: "Up to three creatures are wracked with self-doubt.",
    roll: "save", saveAbility: "cha", damage: null, effect: "On a failed save, subtract 1d4 from attack rolls and saving throws for the duration."
  },
  bless: {
    name: "Bless", level: 1, school: "Enchantment", classes: ["cleric", "paladin"],
    time: "Action", range: "30 ft.", components: "V, S, M", duration: "Concentration, 1 minute",
    text: "Bless up to three creatures of your choice.",
    roll: "none", saveAbility: null, damage: null, effect: "Each target adds 1d4 to attack rolls and saving throws for the duration."
  },
  burningHands: {
    name: "Burning Hands", level: 1, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Self (15-ft. cone)", components: "V, S", duration: "Instantaneous",
    text: "A thin sheet of flame shoots from your fingertips.",
    roll: "save", saveAbility: "dex", damage: "3d6 Fire (scales with slot level)", effect: "Half damage on a successful save; can ignite flammable objects in the area."
  },
  charmPerson: {
    name: "Charm Person", level: 1, school: "Enchantment", classes: ["bard", "druid", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "30 ft.", components: "V, S", duration: "1 hour",
    text: "Attempt to charm a humanoid you can see.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save the target is Charmed for the duration, or until you/your allies harm it; it knows it was charmed once the spell ends."
  },
  chromaticOrb: {
    name: "Chromatic Orb", level: 1, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "90 ft.", components: "V, S, M", duration: "Instantaneous",
    text: "Hurl a 4-inch orb of energy in a damage type of your choice (Acid, Cold, Fire, Lightning, Poison, or Thunder).",
    roll: "attack", saveAbility: null, damage: "3d8 of chosen type (scales with slot level)", effect: "Choose the damage type when cast."
  },
  colorSpray: {
    name: "Color Spray", level: 1, school: "Illusion", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Self (15-ft. cone)", components: "V, S, M", duration: "1 round",
    text: "A dazzling array of flashing, colored light springs from your hand.",
    roll: "none", saveAbility: null, damage: null, effect: "Blinds creatures in the cone with a total of 6d10 Hit Points worth of effect (weakest affected first), scales with slot level."
  },
  command: {
    name: "Command", level: 1, school: "Enchantment", classes: ["cleric", "paladin"],
    time: "Action", range: "60 ft.", components: "V", duration: "1 round",
    text: "Speak a one-word command (Approach, Drop, Flee, Grovel, or Halt) to a creature you can see.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, the target obeys the command on its next turn."
  },
  comprehendLanguages: {
    name: "Comprehend Languages", level: 1, school: "Divination", ritual: true, classes: ["bard", "cleric", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "Self", components: "V, S, M", duration: "1 hour",
    text: "Understand the literal meaning of any spoken language you hear, and read any written language.",
    roll: "none", saveAbility: null, damage: null, effect: "Comprehension only, not fluency in speaking or writing."
  },
  createOrDestroyWater: {
    name: "Create or Destroy Water", level: 1, school: "Transmutation", classes: ["cleric", "druid"],
    time: "Action", range: "30 ft.", components: "V, S, M", duration: "Instantaneous",
    text: "Create up to 10 gallons of clean water, or destroy water in a 30-ft. cube of fog.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only; scales with slot level."
  },
  cureWounds: {
    name: "Cure Wounds", level: 1, school: "Abjuration", classes: ["bard", "cleric", "druid", "paladin", "ranger"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "A creature you touch regains Hit Points.",
    roll: "none", saveAbility: null, damage: null, effect: "Heal 1d8 + spellcasting modifier (scales with slot level); no effect on Undead or Constructs."
  },
  detectEvilAndGood: {
    name: "Detect Evil and Good", level: 1, school: "Divination", classes: ["cleric", "paladin"],
    time: "Action", range: "Self (30 ft.)", components: "V, S", duration: "Concentration, 10 minutes",
    text: "Sense the presence of Celestials, Fiends, Undead, and consecrated/desecrated ground within range.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only."
  },
  detectMagic: {
    name: "Detect Magic", level: 1, school: "Divination", ritual: true, classes: ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "wizard"],
    time: "Action", range: "Self (30 ft.)", components: "V, S", duration: "Concentration, 10 minutes",
    text: "Sense the presence of magic and, with a Study action, its school if you can see the source.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only."
  },
  detectPoisonAndDisease: {
    name: "Detect Poison and Disease", level: 1, school: "Divination", ritual: true, classes: ["cleric", "druid", "ranger"],
    time: "Action", range: "Self (30 ft.)", components: "V, S, M", duration: "Concentration, 10 minutes",
    text: "Sense the presence and location of poisons, poisonous creatures, and diseases in range.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only."
  },
  disguiseSelf: {
    name: "Disguise Self", level: 1, school: "Illusion", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "Self", components: "V, S", duration: "1 hour",
    text: "Change your appearance, including clothing and gear, until the spell ends or you dismiss it.",
    roll: "none", saveAbility: null, damage: null, effect: "Cosmetic illusion; an Investigation check can reveal it."
  },
  divineFavor: {
    name: "Divine Favor", level: 1, school: "Evocation", classes: ["paladin"],
    time: "Bonus Action", range: "Self", components: "V, S", duration: "Concentration, 1 minute",
    text: "Your weapon strikes flare with holy energy.",
    roll: "none", saveAbility: null, damage: "+1d4 Radiant on weapon hits", effect: "Applies to every weapon hit for the duration."
  },
  entangle: {
    name: "Entangle", level: 1, school: "Conjuration", classes: ["druid", "ranger"],
    time: "Action", range: "90 ft.", components: "V, S", duration: "Concentration, 1 minute",
    text: "Grasping weeds and vines sprout in a 20-ft. square.",
    roll: "save", saveAbility: "str", damage: null, effect: "On a failed save, Restrained for the duration; the area also becomes Difficult Terrain."
  },
  faerieFire: {
    name: "Faerie Fire", level: 1, school: "Evocation", classes: ["druid"],
    time: "Action", range: "60 ft.", components: "V", duration: "Concentration, 1 minute",
    text: "Outline creatures and objects in a 20-ft. cube with colored light.",
    roll: "save", saveAbility: "dex", damage: null, effect: "Failed-save creatures are outlined: attacks against them have Advantage, and they can't benefit from being Invisible, for the duration."
  },
  falseLife: {
    name: "False Life", level: 1, school: "Necromancy", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Self", components: "V, S, M", duration: "Instantaneous",
    text: "Bolster yourself with a necromantic buffer of vitality.",
    roll: "none", saveAbility: null, damage: null, effect: "Gain 1d4 + 4 Temporary HP (scales with slot level)."
  },
  featherFall: {
    name: "Feather Fall", level: 1, school: "Transmutation", classes: ["bard", "sorcerer", "wizard"],
    time: "Reaction", range: "60 ft.", components: "V, M", duration: "1 minute",
    text: "Choose up to five falling creatures; their rate of descent slows to 60 ft. per round.",
    roll: "none", saveAbility: null, damage: null, effect: "Fall damage negated for affected creatures for the duration."
  },
  findFamiliar: {
    name: "Find Familiar", level: 1, school: "Conjuration", ritual: true, classes: ["wizard"],
    time: "1 hour", range: "10 ft.", components: "V, S, M", duration: "Instantaneous",
    text: "Summon a spirit that takes the form of a small animal familiar to serve you.",
    roll: "none", saveAbility: null, damage: null, effect: "Grants a scouting/utility companion; you can see through its senses as an action."
  },
  fogCloud: {
    name: "Fog Cloud", level: 1, school: "Conjuration", classes: ["druid", "ranger", "sorcerer", "wizard"],
    time: "Action", range: "120 ft.", components: "V, S", duration: "Concentration, 1 hour",
    text: "Fill a 20-ft.-radius sphere with fog, heavily obscuring it.",
    roll: "none", saveAbility: null, damage: null, effect: "Battlefield-control obscurement; no damage."
  },
  goodberry: {
    name: "Goodberry", level: 1, school: "Conjuration", classes: ["druid", "ranger"],
    time: "Action", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    text: "Create ten berries, magical for 24 hours; each eaten berry restores 1 HP and provides a day's food.",
    roll: "none", saveAbility: null, damage: null, effect: "Minor healing (1 HP each) plus sustenance, not a combat heal."
  },
  guidingBolt: {
    name: "Guiding Bolt", level: 1, school: "Evocation", classes: ["cleric"],
    time: "Action", range: "120 ft.", components: "V, S", duration: "1 round",
    text: "A flash of light streaks toward a creature.",
    roll: "attack", saveAbility: null, damage: "4d6 Radiant (scales with slot level)", effect: "The next attack roll against the target before the end of your next turn has Advantage."
  },
  healingWord: {
    name: "Healing Word", level: 1, school: "Abjuration", classes: ["bard", "cleric", "druid"],
    time: "Bonus Action", range: "60 ft.", components: "V", duration: "Instantaneous",
    text: "A creature of your choice regains Hit Points.",
    roll: "none", saveAbility: null, damage: null, effect: "Heal 1d4 + spellcasting modifier (scales with slot level); Bonus Action, so it's fast but smaller than Cure Wounds."
  },
  heroism: {
    name: "Heroism", level: 1, school: "Enchantment", classes: ["bard", "paladin"],
    time: "Action", range: "Touch", components: "V, S", duration: "Concentration, 1 minute",
    text: "Touch a willing creature to fill it with bravery.",
    roll: "none", saveAbility: null, damage: null, effect: "Immune to Frightened and gains Temporary HP equal to your spellcasting modifier at the start of each of its turns, for the duration."
  },
  huntersMark: {
    name: "Hunter's Mark", level: 1, school: "Divination", classes: ["ranger"],
    time: "Bonus Action", range: "90 ft.", components: "V", duration: "Concentration, 1 hour",
    text: "Mark a creature as your quarry.",
    roll: "none", saveAbility: null, damage: "+1d6 on weapon hits against the marked target", effect: "Also gives Advantage on Wisdom (Perception/Survival) checks to find it; can be moved to a new target if the first drops or you re-mark."
  },
  identify: {
    name: "Identify", level: 1, school: "Divination", ritual: true, classes: ["bard", "wizard"],
    time: "1 minute", range: "Touch", components: "V, S, M", duration: "Instantaneous",
    text: "Learn a touched object's magical properties, or a creature's active spells/effects on it.",
    roll: "none", saveAbility: null, damage: null, effect: "Pure information."
  },
  illusoryScript: {
    name: "Illusory Script", level: 1, school: "Illusion", ritual: true, classes: ["bard", "warlock", "wizard"],
    time: "1 minute", range: "Touch", components: "S, M", duration: "10 days",
    text: "Write a message that only you and creatures you designate can read normally; anyone else sees illegible script or a false message.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility/deception only."
  },
  inflictWounds: {
    name: "Inflict Wounds", level: 1, school: "Necromancy", classes: ["cleric"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "Necrotic energy sears a creature you touch.",
    roll: "attack", saveAbility: null, damage: "3d10 Necrotic (scales with slot level)", effect: null
  },
  jump: {
    name: "Jump", level: 1, school: "Transmutation", classes: ["druid", "ranger", "sorcerer", "wizard"],
    time: "Bonus Action", range: "Touch", components: "V, S, M", duration: "1 minute",
    text: "Touch a creature; its jump distance triples for the duration.",
    roll: "none", saveAbility: null, damage: null, effect: "Movement utility only."
  },
  longstrider: {
    name: "Longstrider", level: 1, school: "Transmutation", classes: ["bard", "druid", "ranger", "wizard"],
    time: "Action", range: "Touch", components: "V, S, M", duration: "1 hour",
    text: "Touch a creature to imbue it with extra speed.",
    roll: "none", saveAbility: null, damage: null, effect: "+10 ft. Speed for the duration."
  },
  mageArmor: {
    name: "Mage Armor", level: 1, school: "Abjuration", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Touch", components: "V, S, M", duration: "8 hours",
    text: "A protective magical force surrounds a willing creature not wearing armor.",
    roll: "none", saveAbility: null, damage: null, effect: "AC becomes 13 + Dex modifier for the duration."
  },
  magicMissile: {
    name: "Magic Missile", level: 1, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "120 ft.", components: "V, S", duration: "Instantaneous",
    text: "Create three glowing darts of magical force; each automatically hits a target you choose.",
    roll: "none", saveAbility: null, damage: "1d4+1 Force per dart (one more dart per slot level above 1st)", effect: "No attack roll — the darts never miss."
  },
  protectionFromEvilAndGood: {
    name: "Protection from Evil and Good", level: 1, school: "Abjuration", classes: ["cleric", "paladin", "warlock", "wizard"],
    time: "Action", range: "Touch", components: "V, S, M", duration: "Concentration, 10 minutes",
    text: "Ward a willing creature against Aberrations, Celestials, Elementals, Fey, Fiends, and Undead.",
    roll: "none", saveAbility: null, damage: null, effect: "Those creature types have Disadvantage on attacks against the target, and the target can't be Charmed/Frightened/Possessed by them."
  },
  purifyFoodAndDrink: {
    name: "Purify Food and Drink", level: 1, school: "Transmutation", ritual: true, classes: ["cleric", "druid", "paladin"],
    time: "Action", range: "10 ft.", components: "V, S", duration: "Instantaneous",
    text: "Remove poison and spoilage from nonmagical food and drink in a 5-ft.-radius sphere.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only."
  },
  sanctuary: {
    name: "Sanctuary", level: 1, school: "Abjuration", classes: ["cleric"],
    time: "Bonus Action", range: "30 ft.", components: "V, S, M", duration: "1 minute",
    text: "Ward a creature against attack.",
    roll: "save", saveAbility: "wis", damage: null, effect: "A creature targeting the warded creature must succeed on the save or choose a new target; ends if the warded creature attacks or casts a harmful spell."
  },
  searingSmite: {
    name: "Searing Smite", level: 1, school: "Evocation", classes: ["paladin"],
    time: "Bonus Action", range: "Self", components: "V", duration: "Concentration, 1 minute",
    text: "Your next weapon hit flares with fire.",
    roll: "none", saveAbility: null, damage: "+1d6 Fire on your next hit, then 1d6 Fire at the end of each of the target's turns", effect: "Target can end the ongoing burning with a Constitution saving throw."
  },
  shield: {
    name: "Shield", level: 1, school: "Abjuration", classes: ["sorcerer", "wizard"],
    time: "Reaction", range: "Self", components: "V, S", duration: "1 round",
    text: "An invisible barrier of magical force springs into existence around you.",
    roll: "none", saveAbility: null, damage: null, effect: "+5 AC until the start of your next turn, including against the triggering attack, and you take no damage from Magic Missile."
  },
  shieldOfFaith: {
    name: "Shield of Faith", level: 1, school: "Abjuration", classes: ["cleric", "paladin"],
    time: "Bonus Action", range: "60 ft.", components: "V, S, M", duration: "Concentration, 10 minutes",
    text: "A shimmering field surrounds a creature of your choice.",
    roll: "none", saveAbility: null, damage: null, effect: "+2 AC for the duration."
  },
  silentImage: {
    name: "Silent Image", level: 1, school: "Illusion", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "60 ft.", components: "V, S, M", duration: "Concentration, 10 minutes",
    text: "Create a purely visual illusion of an object, creature, or phenomenon in a 15-ft. cube.",
    roll: "none", saveAbility: null, damage: null, effect: "No sound; an Investigation check against your spell DC reveals it as an illusion."
  },
  sleep: {
    name: "Sleep", level: 1, school: "Enchantment", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "90 ft.", components: "V, S, M", duration: "1 minute",
    text: "Send creatures in a 20-ft.-radius sphere into a magical slumber.",
    roll: "none", saveAbility: null, damage: null, effect: "5d8 Hit Points worth of creatures fall Unconscious, weakest/already-lowest-HP first (scales with slot level); Undead and Constructs are immune."
  },
  speakWithAnimals: {
    name: "Speak with Animals", level: 1, school: "Divination", ritual: true, classes: ["bard", "druid", "ranger"],
    time: "Action", range: "Self", components: "V, S", duration: "10 minutes",
    text: "Gain the ability to comprehend and verbally communicate with beasts for the duration.",
    roll: "none", saveAbility: null, damage: null, effect: "Communication only; doesn't make beasts friendly."
  },
  tashasHideousLaughter: {
    name: "Tasha's Hideous Laughter", level: 1, school: "Enchantment", classes: ["bard", "wizard"],
    time: "Action", range: "30 ft.", components: "V, S, M", duration: "Concentration, 1 minute",
    text: "A creature is overcome with mirth and collapses into gales of laughter.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save the target has the Prone and Incapacitated conditions for the duration; it repeats the save when it takes damage."
  },
  tensersFloatingDisk: {
    name: "Tenser's Floating Disk", level: 1, school: "Conjuration", ritual: true, classes: ["wizard"],
    time: "Action", range: "30 ft.", components: "V, S, M", duration: "1 hour",
    text: "Create a horizontal disk of force that carries up to 500 lb. and follows you at 30 ft.",
    roll: "none", saveAbility: null, damage: null, effect: "Hauling utility only."
  },
  thunderwave: {
    name: "Thunderwave", level: 1, school: "Evocation", classes: ["bard", "druid", "sorcerer", "wizard"],
    time: "Action", range: "Self (15-ft. cube)", components: "V, S", duration: "Instantaneous",
    text: "A wave of thunderous force sweeps out from you.",
    roll: "save", saveAbility: "con", damage: "2d8 Thunder (scales with slot level)", effect: "On a failed save the target is also pushed 10 ft. away from you; unsecured objects in the area are pushed 10 ft. too."
  },
  unseenServant: {
    name: "Unseen Servant", level: 1, school: "Conjuration", ritual: true, classes: ["bard", "warlock", "wizard"],
    time: "Action", range: "60 ft.", components: "V, S, M", duration: "1 hour",
    text: "Create an invisible, mindless force that performs simple labor tasks on your command.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only; can't attack or take damage meaningfully (1 HP)."
  },
  witchBolt: {
    name: "Witch Bolt", level: 1, school: "Evocation", classes: ["sorcerer", "warlock", "wizard"],
    time: "Action", range: "30 ft.", components: "V, S, M", duration: "Concentration, 1 minute",
    text: "A beam of crackling energy lances toward a creature, forming a sustained arc of lightning.",
    roll: "attack", saveAbility: null, damage: "3d12 Lightning on the initial hit (scales with slot level), then 1d12 automatically each turn you maintain it", effect: "Requires Concentration each turn to keep dealing the follow-up damage; target can end it early by moving far enough away."
  }
};

export const SPELL_KEYS = Object.keys(SPELLS);

/* Every spell between `minLevel` and `maxLevel` (inclusive) that's on
   `listKey`'s list, sorted by level then name — the shape every spell
   picker in app.js consumes. Cantrips are level 0: pass minLevel 0 maxLevel
   0 for a cantrip pool, or minLevel 1 for a level-1+ pool that must NOT
   leak cantrips in alongside it. */
export function spellsForList(listKey, minLevel, maxLevel) {
  return SPELL_KEYS
    .filter((k) => SPELLS[k].classes.includes(listKey) && SPELLS[k].level >= minLevel && SPELLS[k].level <= maxLevel)
    .sort((a, b) => SPELLS[a].level - SPELLS[b].level || SPELLS[a].name.localeCompare(SPELLS[b].name));
}
