/* Spells — 2024 rules, transcribed from the user's own Player's Handbook
   (chapter 7) — NOT from trained knowledge, and NOT from the 2014 rules.
   The 2024 PHB rewrote several spells' core mechanics (Sleep, Color Spray,
   and Inflict Wounds all changed from attack/fixed-pool mechanics to
   different ones; Cure Wounds and Healing Word doubled their dice; several
   cantrips from Tasha's Cauldron — Control Flames, Create Bonfire,
   Frostbite, Gust — were REMOVED and replaced by one consolidated cantrip,
   Elementalism) — so anything sourced from memory of 5e in general is
   exactly the trap this file fell into once already. Every entry below was
   checked line-by-line against the actual chapter text.

   `text` is the FULL spell description (the user wants the whole thing
   readable in the tooltip, not a paraphrase — SRD-licensed spell text is
   freely reproducible under CC-BY-4.0 with attribution, given at the bottom
   of this file and surfaced in the UI). `higherLevel` is the spell's real
   "Using a Higher-Level Spell Slot" / "Cantrip Upgrade" paragraph, kept
   separate so the UI can label it distinctly, the way the book does.

   `classes` lists every class list (by `listKey`) a spell appears on —
   shared spells are defined once, not duplicated per class.

   `roll`/`saveAbility`/`scaling` are still here as short structured facts
   that drive the auto-generated TL;DR (see spellTLDR in app.js):
     "attack" — a spell attack roll (ranged or melee)
     "save"   — the target makes a saving throw against your spell DC
     "none"   — no attack roll or save
   `scaling` is a short paraphrase of `higherLevel` for the TL;DR line;
   omit it only when a spell genuinely has no `higherLevel` text at all.

   COVERAGE NOTE (breadth-first, matches the rest of the build): cantrips
   and level-1 spells only, for the lists that have them. NOT the full
   ~350-spell book — levels 2-9 are Phase D. */

export const SPELLS = {
  /* ---------------- Cantrips ---------------- */
  acidSplash: {
    name: "Acid Splash", level: 0, school: "Conjuration", classes: ["sorcerer", "wizard"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "You create an acidic bubble at a point within range, where it explodes in a 5-foot-radius Sphere. Each creature in that Sphere must succeed on a Dexterity saving throw or take 1d6 Acid damage.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "dex", damage: "1d6 Acid", effect: null
  },
  chillTouch: {
    name: "Chill Touch", level: 0, school: "Necromancy", classes: ["sorcerer", "warlock", "wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "Channeling the chill of the grave, make a melee spell attack against a target within reach. On a hit, the target takes 1d10 Necrotic damage, and it can't regain Hit Points until the end of your next turn.",
    higherLevel: "The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).",
    roll: "attack", saveAbility: null, damage: "1d10 Necrotic", effect: "Target can't regain HP until the end of your next turn."
  },
  dancingLights: {
    name: "Dancing Lights", level: 0, school: "Illusion", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "120 feet", components: "V, S, M (a bit of phosphorus)", duration: "Concentration, up to 1 minute",
    text: "You create up to four torch-size lights within range, making them appear as torches, lanterns, or glowing orbs that hover for the duration. Alternatively, you combine the four lights into one glowing Medium form that is vaguely humanlike. Whichever form you choose, each light sheds Dim Light in a 10-foot radius. As a Bonus Action, you can move the lights up to 60 feet to a space within range. A light must be within 20 feet of another light created by this spell, and a light vanishes if it exceeds the spell's range.",
    roll: "none", saveAbility: null, damage: null, effect: "Light and misdirection only, no damage."
  },
  druidcraft: {
    name: "Druidcraft", level: 0, school: "Transmutation", classes: ["druid"],
    time: "Action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    text: "Whispering to the spirits of nature, you create one of the following effects within range. Weather Sensor. You create a Tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. Bloom. You instantly make a flower blossom, a seed pod open, or a leaf bud bloom. Sensory Effect. You create a harmless sensory effect, such as falling leaves, spectral dancing fairies, a gentle breeze, the sound of an animal, or the faint odor of skunk. The effect must fit in a 5-foot Cube. Fire Play. You light or snuff out a candle, a torch, or a campfire.",
    roll: "none", saveAbility: null, damage: null, effect: "Purely flavor/utility, choose one of four listed effects."
  },
  eldritchBlast: {
    name: "Eldritch Blast", level: 0, school: "Evocation", classes: ["warlock"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You hurl a beam of crackling energy. Make a ranged spell attack against one creature or object in range. On a hit, the target takes 1d10 Force damage.",
    higherLevel: "The spell creates two beams at level 5, three beams at level 11, and four beams at level 17. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.",
    roll: "attack", saveAbility: null, damage: "1d10 Force per beam", effect: null,
    noCantripScale: true,
    cantripScaleNote: "One more beam at character levels 5, 11, and 17 (up to 4 total), each aimable at a different target — not a bigger die like other cantrips."
  },
  elementalism: {
    name: "Elementalism", level: 0, school: "Transmutation", classes: ["druid", "sorcerer", "wizard"],
    time: "Action", range: "30 feet", components: "V, S", duration: "Instantaneous or 1 hour",
    text: "You exert control over the elements, creating one of several minor effects within range: conjuring a breeze that ripples cloth and stirs dust, forming a small cloud that lightly wets a creature or object, causing a light dusting of frost or a small vibration in the ground, or a similarly minor elemental flourish. If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at once.",
    roll: "none", saveAbility: null, damage: null, effect: "Purely elemental flavor/utility — the 2024 PHB's consolidated replacement for the old Control Flames/Create Bonfire/Frostbite/Gust cantrips, none of which are in this book."
  },
  fireBolt: {
    name: "Fire Bolt", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You hurl a mote of fire at a creature or an object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 Fire damage. A flammable object hit by this spell starts burning if it isn't being worn or carried.",
    higherLevel: "The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).",
    roll: "attack", saveAbility: null, damage: "1d10 Fire", effect: "Can ignite flammable objects that aren't worn or carried."
  },
  friends: {
    name: "Friends", level: 0, school: "Enchantment", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "10 feet", components: "S, M (some makeup)", duration: "Concentration, up to 1 minute",
    text: "You magically emanate a sense of friendship toward one creature you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target succeeds automatically if it isn't a Humanoid, if you're fighting it, or if you have cast this spell on it within the past 24 hours. The spell ends early if the target takes damage or if you make an attack roll, deal damage, or force anyone to make a saving throw. When the spell ends, the target knows it was Charmed by you.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, Charmed for the duration; ends early on damage/hostile act, and the target knows it was charmed once the spell ends."
  },
  guidance: {
    name: "Guidance", level: 0, school: "Divination", classes: ["cleric", "druid"],
    time: "Action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "You touch a willing creature and choose a skill. Until the spell ends, the creature adds 1d4 to any ability check using the chosen skill.",
    roll: "none", saveAbility: null, damage: null, effect: "+1d4 to one chosen skill's ability checks for the duration."
  },
  lightCantrip: {
    name: "Light", level: 0, school: "Evocation", classes: ["bard", "cleric", "sorcerer", "wizard"],
    time: "Action", range: "Touch", components: "V, M (a firefly or phosphorescent moss)", duration: "1 hour",
    text: "You touch one Large or smaller object that isn't being worn or carried by someone else. Until the spell ends, the object sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The light can be colored as you like. Covering the object with something opaque blocks the light. The spell ends if you cast it again.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility light source only."
  },
  mageHand: {
    name: "Mage Hand", level: 0, school: "Conjuration", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "30 feet", components: "V, S", duration: "1 minute",
    text: "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. When you cast the spell, you can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. As a Magic action on your later turns, you can control the hand thus again, and as part of that action you can move the hand up to 30 feet. The hand can't attack, activate magic items, or carry more than 10 pounds.",
    roll: "none", saveAbility: null, damage: null, effect: "No damage; remote manipulation only, up to 10 lb."
  },
  mending: {
    name: "Mending", level: 0, school: "Transmutation", classes: ["bard", "cleric", "druid", "sorcerer", "wizard"],
    time: "1 minute", range: "Touch", components: "V, S, M (two lodestones)", duration: "Instantaneous",
    text: "This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage. This spell can physically repair a magic item, but it can't restore magic to such an object.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility repair only."
  },
  message: {
    name: "Message", level: 0, school: "Transmutation", classes: ["bard", "druid", "sorcerer", "wizard"],
    time: "Action", range: "120 feet", components: "S, M (a copper wire)", duration: "1 round",
    text: "You point toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear. You can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence; 1 foot of stone, metal, or wood; or a thin sheet of lead blocks the spell.",
    roll: "none", saveAbility: null, damage: null, effect: "Private one-round two-way whisper."
  },
  mindSliver: {
    name: "Mind Sliver", level: 0, school: "Enchantment", classes: ["sorcerer", "warlock", "wizard"],
    time: "Action", range: "60 feet", components: "V", duration: "1 round",
    text: "You try to temporarily sliver the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 Psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "int", damage: "1d6 Psychic", effect: "On a failed save, the target also subtracts 1d4 from its next saving throw before the end of your next turn."
  },
  minorIllusion: {
    name: "Minor Illusion", level: 0, school: "Illusion", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "30 feet", components: "S, M (a bit of fleece)", duration: "1 minute",
    text: "You create a sound or an image of an object within range that lasts for the duration. The illusion ends if you cast this spell again. If a creature takes a Study action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature. Sound. If you create a sound, its volume can range from a whisper to a scream. Image. If you create an image of an object it must be no larger than a 5-foot Cube; the image can't create sound, light, smell, or any other sensory effect, and physical interaction with the image reveals it to be an illusion.",
    roll: "none", saveAbility: null, damage: null, effect: "Investigation check against your spell DC to see through it; no simultaneous sound+image."
  },
  poisonSpray: {
    name: "Poison Spray", level: 0, school: "Necromancy", classes: ["druid", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    text: "You spray toxic mist at a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d12 Poison damage.",
    higherLevel: "The damage increases by 1d12 when you reach levels 5 (2d12), 11 (3d12), and 17 (4d12).",
    roll: "attack", saveAbility: null, damage: "1d12 Poison", effect: null
  },
  prestidigitation: {
    name: "Prestidigitation", level: 0, school: "Transmutation", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "10 feet", components: "V, S", duration: "Up to 1 hour",
    text: "You create a magical effect within range. Choose the effect from the options below. If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time. Sensory Effect. An instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor. Fire Play. Instantaneously light or snuff out a candle, a torch, or a small campfire. Clean or Soil. Instantaneously clean or soil an object no larger than 1 cubic foot. Minor Sensation. Chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour. Magic Mark. Make a color, small mark, or symbol appear on an object or surface for 1 hour. Minor Creation. Create a nonmagical trinket or an illusory image that can fit in your hand, lasting until the end of your next turn; a trinket can deal no damage and has no monetary worth.",
    roll: "none", saveAbility: null, damage: null, effect: "Choose one small effect from a fixed menu; no combat use."
  },
  produceFlame: {
    name: "Produce Flame", level: 0, school: "Conjuration", classes: ["druid"],
    time: "Bonus Action", range: "Self", components: "V, S", duration: "10 minutes",
    text: "A flickering flame appears in your hand and remains there for the duration. While there, the flame emits no heat and ignites nothing, and it sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The spell ends if you cast it again. Until the spell ends, you can take a Magic action to hurl fire at a creature or an object within 60 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 Fire damage.",
    higherLevel: "The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
    roll: "attack", saveAbility: null, damage: "1d8 Fire", effect: "Also works as a hand-held light source (20 ft. Bright/20 ft. Dim) until thrown or dismissed."
  },
  rayOfFrost: {
    name: "Ray of Frost", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 Cold damage, and its Speed is reduced by 10 feet until the start of your next turn.",
    higherLevel: "The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
    roll: "attack", saveAbility: null, damage: "1d8 Cold", effect: "On a hit, target's Speed is reduced by 10 ft. until the start of your next turn."
  },
  sacredFlame: {
    name: "Sacred Flame", level: 0, school: "Evocation", classes: ["cleric"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 Radiant damage. The target gains no benefit from Half Cover or Three-Quarters Cover for this save.",
    higherLevel: "The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
    roll: "save", saveAbility: "dex", damage: "1d8 Radiant", effect: "Target gains no benefit from Half or Three-Quarters Cover for this save."
  },
  shillelagh: {
    name: "Shillelagh", level: 0, school: "Transmutation", classes: ["druid"],
    time: "Bonus Action", range: "Self", components: "V, S, M (mistletoe)", duration: "1 minute",
    text: "A Club or Quarterstaff you are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8. If the attack deals damage, it can be Force damage or the weapon's normal damage type (your choice). The spell ends early if you cast it again or if you let go of the weapon.",
    higherLevel: "The damage die changes when you reach levels 5 (d10), 11 (d12), and 17 (2d6).",
    roll: "none", saveAbility: null, damage: "1d8 (weapon die), Wisdom-based, Force or the weapon's normal type", effect: "Also counts as magical for overcoming resistance.",
    noCantripScale: true,
    cantripScaleNote: "The weapon's damage die itself grows at levels 5 (d10), 11 (d12), and 17 (2d6) — not an extra die like other cantrips."
  },
  shockingGrasp: {
    name: "Shocking Grasp", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "Lightning springs from you to a creature that you try to touch. Make a melee spell attack against the target. On a hit, the target takes 1d8 Lightning damage, and it can't make Opportunity Attacks until the start of its next turn.",
    higherLevel: "The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
    roll: "attack", saveAbility: null, damage: "1d8 Lightning", effect: "Target can't make Opportunity Attacks until the start of its next turn."
  },
  spareTheDying: {
    name: "Spare the Dying", level: 0, school: "Necromancy", classes: ["cleric", "druid"],
    time: "Action", range: "15 feet", components: "V, S", duration: "Instantaneous",
    text: "Choose a creature within range that has 0 Hit Points and isn't dead. The creature becomes Stable.",
    higherLevel: "The range doubles when you reach levels 5 (30 feet), 11 (60 feet), and 17 (120 feet).",
    roll: "none", saveAbility: null, damage: null, effect: "Stabilizes a dying creature; no healing.",
    noCantripScale: true,
    cantripScaleNote: "The range doubles at character levels 5 (30 ft.), 11 (60 ft.), and 17 (120 ft.) — this cantrip scales range, not damage."
  },
  thaumaturgy: {
    name: "Thaumaturgy", level: 0, school: "Transmutation", classes: ["cleric"],
    time: "Action", range: "30 feet", components: "V", duration: "Up to 1 minute",
    text: "You manifest a minor wonder within range. You create one of the effects below. If you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time. Altered Eyes. You alter the appearance of your eyes for 1 minute. Booming Voice. Your voice booms up to three times as loud as normal for 1 minute, and you have Advantage on Charisma (Intimidation) checks for the duration. Fire Play. You cause flames to flicker, brighten, dim, or change color for 1 minute. Invisible Hand. You instantaneously cause an unlocked door or window to fly open or slam shut. Phantom Sound. You create an instantaneous sound that originates from a point of your choice within range. Tremors. You cause harmless tremors in the ground for 1 minute.",
    roll: "none", saveAbility: null, damage: null, effect: "Choose one small effect from a fixed menu; no combat use."
  },
  thornWhip: {
    name: "Thorn Whip", level: 0, school: "Transmutation", classes: ["druid"],
    time: "Action", range: "30 feet", components: "V, S, M (the stem of a thorny plant)", duration: "Instantaneous",
    text: "You create a vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. On a hit, the target takes 1d6 Piercing damage, and if it is Large or smaller, you can pull it up to 10 feet closer to you.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "attack", saveAbility: null, damage: "1d6 Piercing", effect: "On a hit, if the target is Large or smaller, pull it up to 10 ft. closer to you."
  },
  thunderclap: {
    name: "Thunderclap", level: 0, school: "Evocation", classes: ["bard", "druid", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "Self (5-foot Emanation)", components: "S", duration: "Instantaneous",
    text: "Each creature in a 5-foot Emanation originating from you must succeed on a Constitution saving throw or take 1d6 Thunder damage. The spell's thunderous sound can be heard up to 100 feet away.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "con", damage: "1d6 Thunder", effect: "Affects every creature in a 5-ft. Emanation around you; audible to 100 ft."
  },
  trueStrike: {
    name: "True Strike", level: 0, school: "Divination", classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "Self", components: "S, M (a weapon with which you have proficiency and that is worth 1+ CP)", duration: "Instantaneous",
    text: "Guided by a flash of magical insight, you make one attack with the weapon used in the spell's casting. The attack uses your spellcasting ability for the attack and damage rolls instead of using Strength or Dexterity. If the attack deals damage, it can be Radiant damage or the weapon's normal damage type (your choice).",
    higherLevel: "Whether you deal Radiant damage or the weapon's normal damage type, the attack deals extra Radiant damage when you reach levels 5 (1d6), 11 (2d6), and 17 (3d6).",
    roll: "attack", saveAbility: null, damage: "Your weapon's normal damage (Radiant or the weapon's type, your choice)", effect: "Uses your spellcasting ability for the attack/damage roll instead of Str/Dex.",
    noCantripScale: true,
    cantripScaleNote: "Adds extra Radiant damage at character levels 5 (1d6), 11 (2d6), and 17 (3d6), on top of the weapon's own damage."
  },
  viciousMockery: {
    name: "Vicious Mockery", level: 0, school: "Enchantment", classes: ["bard"],
    time: "Action", range: "60 feet", components: "V", duration: "Instantaneous",
    text: "You unleash a string of insults laced with subtle enchantments at one creature you can see or hear within range. The target must succeed on a Wisdom saving throw or take 1d6 Psychic damage and have Disadvantage on the next attack roll it makes before the end of its next turn.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "wis", damage: "1d6 Psychic", effect: "On a failed save, the target also has Disadvantage on its next attack roll before the end of its next turn."
  },
  wordOfRadiance: {
    name: "Word of Radiance", level: 0, school: "Evocation", classes: ["cleric"],
    time: "Action", range: "Self (5-foot Emanation)", components: "V, M (a sunburst token)", duration: "Instantaneous",
    text: "Burning radiance erupts from you in a 5-foot Emanation. Each creature of your choice that you can see in it must succeed on a Constitution saving throw or take 1d6 Radiant damage.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "con", damage: "1d6 Radiant", effect: "Affects every creature of your choice in a 5-ft. Emanation around you."
  },

  /* ---------------- Level 1 ---------------- */
  alarm: {
    name: "Alarm", level: 1, school: "Abjuration", ritual: true, classes: ["ranger", "wizard"],
    time: "1 minute or Ritual", range: "30 feet", components: "V, S, M (a bell and silver wire)", duration: "8 hours",
    text: "You set an alarm against intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot Cube. Until the spell ends, an alarm alerts you whenever a creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is audible or mental: Audible Alarm. The alarm produces the sound of a handbell for 10 seconds within 60 feet of the warded area. Mental Alarm. You are alerted by a mental ping if you are within 1 mile of the warded area. This ping awakens you if you're asleep.",
    roll: "none", saveAbility: null, damage: null, effect: "Pure warning/utility; no damage."
  },
  animalFriendship: {
    name: "Animal Friendship", level: 1, school: "Enchantment", classes: ["bard", "druid", "ranger"],
    time: "Action", range: "30 feet", components: "V, S, M (a morsel of food)", duration: "24 hours",
    text: "Target a Beast that you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. If you or one of your allies deals damage to the target, the spell ends.",
    higherLevel: "You can target one additional Beast for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save the beast is Charmed for the duration (ends if you or an ally damages it).",
    scaling: "+1 target Beast per slot level above 1st."
  },
  bane: {
    name: "Bane", level: 1, school: "Enchantment", classes: ["bard", "cleric", "warlock"],
    time: "Action", range: "30 feet", components: "V, S, M (a drop of blood)", duration: "Concentration, up to 1 minute",
    text: "Up to three creatures of your choice that you can see within range must each make a Charisma saving throw. Whenever a target that fails this save makes an attack roll or a saving throw before the spell ends, the target must subtract 1d4 from the attack roll or save.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "save", saveAbility: "cha", damage: null, effect: "On a failed save, subtract 1d4 from attack rolls and saving throws for the duration.",
    scaling: "+1 target per slot level above 1st."
  },
  bless: {
    name: "Bless", level: 1, school: "Enchantment", classes: ["cleric", "paladin"],
    time: "Action", range: "30 feet", components: "V, S, M (a Holy Symbol worth 5+ GP)", duration: "Concentration, up to 1 minute",
    text: "You bless up to three creatures within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target adds 1d4 to the attack roll or save.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Each target adds 1d4 to attack rolls and saving throws for the duration.",
    scaling: "+1 target per slot level above 1st."
  },
  burningHands: {
    name: "Burning Hands", level: 1, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Self (15-foot Cone)", components: "V, S", duration: "Instantaneous",
    text: "A thin sheet of flames shoots forth from you. Each creature in a 15-foot Cone makes a Dexterity saving throw, taking 3d6 Fire damage on a failed save or half as much damage on a successful one. Flammable objects in the Cone that aren't being worn or carried start burning.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "save", saveAbility: "dex", damage: "3d6 Fire", effect: "Half damage on a successful save; can ignite flammable objects in the area.",
    scaling: "+1d6 per slot level above 1st."
  },
  charmPerson: {
    name: "Charm Person", level: 1, school: "Enchantment", classes: ["bard", "druid", "sorcerer", "warlock", "wizard"],
    time: "Action", range: "30 feet", components: "V, S", duration: "1 hour",
    text: "One Humanoid you can see within range makes a Wisdom saving throw. It does so with Advantage if you or your allies are fighting it. On a failed save, the target has the Charmed condition until the spell ends or until you or your allies damage it. The Charmed creature is Friendly to you. When the spell ends, the target knows it was Charmed by you.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, Charmed (and Friendly to you) until the spell ends or you/allies damage it; it knows it was charmed once the spell ends.",
    scaling: "+1 target per slot level above 1st."
  },
  chromaticOrb: {
    name: "Chromatic Orb", level: 1, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "90 feet", components: "V, S, M (a diamond worth 50+ GP)", duration: "Instantaneous",
    text: "You hurl an orb of energy at a target within range. Choose Acid, Cold, Fire, Lightning, Poison, or Thunder for the type of orb you create, and then make a ranged spell attack against the target. On a hit, the target takes 3d8 damage of the chosen type. If you roll the same number on two or more of the d8s, the orb leaps to a different target of your choice within 30 feet of the target. Make an attack roll against the new target, and make a new damage roll. The orb can't leap again unless you cast the spell with a level 2+ spell slot.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 1. The orb can leap a maximum number of times equal to the level of the slot expended, and a creature can be targeted only once by each casting of this spell.",
    roll: "attack", saveAbility: null, damage: "3d8 of chosen type (Acid/Cold/Fire/Lightning/Poison/Thunder)", effect: "On matching damage dice, the orb leaps to a new target within 30 ft. (leap count = slot level).",
    scaling: "+1d8 per slot level above 1st; also leaps up to (slot level) times instead of once."
  },
  colorSpray: {
    name: "Color Spray", level: 1, school: "Illusion", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Self (15-foot Cone)", components: "V, S, M (a pinch of colorful sand)", duration: "Instantaneous",
    text: "You launch a dazzling array of flashing, colorful light. Each creature in a 15-foot Cone originating from you must succeed on a Constitution saving throw or have the Blinded condition until the end of your next turn.",
    roll: "save", saveAbility: "con", damage: null, effect: "On a failed save, Blinded until the end of your next turn."
  },
  command: {
    name: "Command", level: 1, school: "Enchantment", classes: ["bard", "cleric", "paladin"],
    time: "Action", range: "60 feet", components: "V", duration: "Instantaneous",
    text: "You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. Choose the command from these options: Approach — the target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you. Drop — the target drops whatever it is holding and then ends its turn. Flee — the target spends its turn moving away from you by the fastest available means. Grovel — the target has the Prone condition and then ends its turn. Halt — on its turn, the target doesn't move and takes no action or Bonus Action.",
    higherLevel: "You can affect one additional creature for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, the target obeys the chosen one-word command on its next turn.",
    scaling: "+1 target per slot level above 1st."
  },
  comprehendLanguages: {
    name: "Comprehend Languages", level: 1, school: "Divination", ritual: true, classes: ["bard", "sorcerer", "warlock", "wizard"],
    time: "Action or Ritual", range: "Self", components: "V, S, M (a pinch of soot and salt)", duration: "1 hour",
    text: "For the duration, you understand the literal meaning of any language that you hear or see signed. You also understand any written language that you see, but you must be touching the surface on which the words are written; it takes about 1 minute to read one page of text. This spell doesn't decode symbols or secret messages.",
    roll: "none", saveAbility: null, damage: null, effect: "Comprehension only, not fluency in speaking or writing; doesn't decode ciphers."
  },
  createOrDestroyWater: {
    name: "Create or Destroy Water", level: 1, school: "Transmutation", classes: ["cleric", "druid"],
    time: "Action", range: "30 feet", components: "V, S, M (a mix of water and sand)", duration: "Instantaneous",
    text: "You do one of the following: Create Water. You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot Cube within range, extinguishing exposed flames there. Destroy Water. You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot Cube within range.",
    higherLevel: "You create or destroy 10 additional gallons of water, or the size of the Cube increases by 5 feet, for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only.",
    scaling: "+10 gallons created/destroyed, or the Cube's size +5 ft., per slot level above 1st."
  },
  cureWounds: {
    name: "Cure Wounds", level: 1, school: "Abjuration", classes: ["bard", "cleric", "druid", "paladin", "ranger"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "A creature you touch regains a number of Hit Points equal to 2d8 plus your spellcasting ability modifier.",
    higherLevel: "The healing increases by 2d8 for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Heal 2d8 + spellcasting modifier; no note in the book of any Undead/Construct exclusion for this printing.",
    scaling: "+2d8 healing per slot level above 1st."
  },
  detectEvilAndGood: {
    name: "Detect Evil and Good", level: 1, school: "Divination", classes: ["cleric", "paladin"],
    time: "Action", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes",
    text: "For the duration, you sense the location of any Aberration, Celestial, Elemental, Fey, Fiend, or Undead within 30 feet of yourself. You also sense whether the Hallow spell is active there and, if so, where. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only; blocked by stone/metal/lead barriers."
  },
  detectMagic: {
    name: "Detect Magic", level: 1, school: "Divination", ritual: true, classes: ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"],
    time: "Action or Ritual", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes",
    text: "For the duration, you sense the presence of magical effects within 30 feet of yourself. If you sense such effects, you can take the Magic action to see a faint aura around any visible creature or object in the area that bears the magic, and if an effect was created by a spell, you learn the spell's school of magic. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only; blocked by stone/metal/lead barriers."
  },
  detectPoisonAndDisease: {
    name: "Detect Poison and Disease", level: 1, school: "Divination", ritual: true, classes: ["cleric", "druid", "paladin", "ranger"],
    time: "Action or Ritual", range: "Self", components: "V, S, M (a yew leaf)", duration: "Concentration, up to 10 minutes",
    text: "For the duration, you sense the location of poisons, poisonous or venomous creatures, and magical contagions within 30 feet of yourself. You sense the kind of poison, creature, or contagion in each case. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only; blocked by stone/metal/lead barriers."
  },
  disguiseSelf: {
    name: "Disguise Self", level: 1, school: "Illusion", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "Self", components: "V, S", duration: "1 hour",
    text: "You make yourself — including your clothing, armor, weapons, and other belongings on your person — look different until the spell ends. You can seem 1 foot shorter or taller and can appear heavier or lighter. You must adopt a form that has the same basic arrangement of limbs as you have. The changes fail to hold up to physical inspection — for example, objects pass through an illusory added hat. To discern that you are disguised, a creature must take the Study action to inspect your appearance and succeed on an Intelligence (Investigation) check against your spell save DC.",
    roll: "none", saveAbility: null, damage: null, effect: "Cosmetic illusion; an Investigation (Study action) check against your spell DC can reveal it."
  },
  divineFavor: {
    name: "Divine Favor", level: 1, school: "Transmutation", classes: ["paladin"],
    time: "Bonus Action", range: "Self", components: "V, S", duration: "1 minute",
    text: "Until the spell ends, your attacks with weapons deal an extra 1d4 Radiant damage on a hit.",
    roll: "none", saveAbility: null, damage: "+1d4 Radiant on weapon hits", effect: "Applies to every weapon hit for the duration."
  },
  entangle: {
    name: "Entangle", level: 1, school: "Conjuration", classes: ["druid", "ranger"],
    time: "Action", range: "90 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "Grasping plants sprout from the ground in a 20-foot square within range. For the duration, these plants turn the ground in the area into Difficult Terrain and disappear when the spell ends. Each creature (other than you) in the area when you cast the spell must succeed on a Strength saving throw or have the Restrained condition until the spell ends. A Restrained creature can take an action to make a Strength (Athletics) check against your spell save DC, freeing itself on a success.",
    roll: "save", saveAbility: "str", damage: null, effect: "On a failed save, Restrained for the duration (Strength/Athletics check to escape); area becomes Difficult Terrain."
  },
  faerieFire: {
    name: "Faerie Fire", level: 1, school: "Evocation", classes: ["bard", "druid"],
    time: "Action", range: "60 feet", components: "V", duration: "Concentration, up to 1 minute",
    text: "Objects in a 20-foot Cube within range are outlined in blue, green, or violet light (your choice). Each creature in the Cube is also outlined if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed Dim Light in a 10-foot radius and can't benefit from the Invisible condition. Attack rolls against an affected creature or object have Advantage if the attacker can see it.",
    roll: "save", saveAbility: "dex", damage: null, effect: "On a failed save, outlined for the duration: attacks against it have Advantage, and it can't benefit from Invisible."
  },
  falseLife: {
    name: "False Life", level: 1, school: "Necromancy", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Self", components: "V, S, M (a drop of alcohol)", duration: "Instantaneous",
    text: "You gain 2d4 + 4 Temporary Hit Points.",
    higherLevel: "You gain 5 additional Temporary Hit Points for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Gain 2d4 + 4 Temporary HP.",
    scaling: "+5 Temporary HP per slot level above 1st."
  },
  featherFall: {
    name: "Feather Fall", level: 1, school: "Transmutation", classes: ["bard", "sorcerer", "wizard"],
    time: "Reaction, which you take when you or a creature you can see within 60 feet of you falls", range: "60 feet", components: "V, M (a small feather or piece of down)", duration: "1 minute",
    text: "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If a creature lands before the spell ends, the creature takes no damage from the fall, and the spell ends for that creature.",
    roll: "none", saveAbility: null, damage: null, effect: "Fall damage negated for up to 5 affected creatures for the duration."
  },
  findFamiliar: {
    name: "Find Familiar", level: 1, school: "Conjuration", ritual: true, classes: ["wizard"],
    time: "1 hour or Ritual", range: "10 feet", components: "V, S, M (burning incense worth 10+ GP, which the spell consumes)", duration: "Instantaneous",
    text: "You gain the service of a familiar, a spirit that takes an animal form you choose: Bat, Cat, Frog, Hawk, Lizard, Octopus, Owl, Rat, Raven, Spider, Weasel, or another Beast that has a Challenge Rating of 0. The familiar has the statistics of the chosen form, though it is a Celestial, Fey, or Fiend (your choice) instead of a Beast; it acts independently but obeys your commands. Telepathic Connection. While within 100 feet of you, you can communicate with it telepathically, and as a Bonus Action you can see through its eyes and hear what it hears until the start of your next turn. It can also deliver touch spells for you (Reaction, within 100 feet). Combat. The familiar rolls its own Initiative and acts on its own turn; it can't attack. Disappearance. When it drops to 0 HP, it disappears and reappears after you cast this spell again; you can also dismiss it (temporarily or forever) as a Magic action.",
    roll: "none", saveAbility: null, damage: null, effect: "Grants a scouting/utility companion; can't attack; you can see/hear through it as a Bonus Action."
  },
  fogCloud: {
    name: "Fog Cloud", level: 1, school: "Conjuration", classes: ["druid", "ranger", "sorcerer", "wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Concentration, up to 1 hour",
    text: "You create a 20-foot-radius Sphere of fog centered on a point within range. The Sphere is Heavily Obscured. It lasts for the duration or until a strong wind (such as one created by Gust of Wind) disperses it.",
    higherLevel: "The fog's radius increases by 20 feet for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Battlefield-control obscurement; no damage.",
    scaling: "Radius +20 ft. per slot level above 1st."
  },
  goodberry: {
    name: "Goodberry", level: 1, school: "Conjuration", classes: ["druid", "ranger"],
    time: "Action", range: "Self", components: "V, S, M (a sprig of mistletoe)", duration: "24 hours",
    text: "Ten berries appear in your hand and are infused with magic for the duration. A creature can take a Bonus Action to eat one berry. Eating a berry restores 1 Hit Point, and the berry provides enough nourishment to sustain a creature for one day. Uneaten berries disappear when the spell ends.",
    roll: "none", saveAbility: null, damage: null, effect: "Minor healing (1 HP each) plus a day's food per berry, not a combat heal."
  },
  guidingBolt: {
    name: "Guiding Bolt", level: 1, school: "Evocation", classes: ["cleric"],
    time: "Action", range: "120 feet", components: "V, S", duration: "1 round",
    text: "You hurl a bolt of light toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 4d6 Radiant damage, and the next attack roll made against it before the end of your next turn has Advantage.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "attack", saveAbility: null, damage: "4d6 Radiant", effect: "The next attack roll against the target before the end of your next turn has Advantage.",
    scaling: "+1d6 per slot level above 1st."
  },
  healingWord: {
    name: "Healing Word", level: 1, school: "Abjuration", classes: ["bard", "cleric", "druid"],
    time: "Bonus Action", range: "60 feet", components: "V", duration: "Instantaneous",
    text: "A creature of your choice that you can see within range regains Hit Points equal to 2d4 plus your spellcasting ability modifier.",
    higherLevel: "The healing increases by 2d4 for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Heal 2d4 + spellcasting modifier; Bonus Action, so it's fast but smaller than Cure Wounds.",
    scaling: "+2d4 healing per slot level above 1st."
  },
  heroism: {
    name: "Heroism", level: 1, school: "Enchantment", classes: ["bard", "paladin"],
    time: "Action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to the Frightened condition and gains Temporary Hit Points equal to your spellcasting ability modifier at the start of each of its turns.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Immune to Frightened; gains Temporary HP = spellcasting modifier at the start of each of its turns.",
    scaling: "+1 target per slot level above 1st."
  },
  huntersMark: {
    name: "Hunter's Mark", level: 1, school: "Divination", classes: ["ranger"],
    time: "Bonus Action", range: "90 feet", components: "V", duration: "Concentration, up to 1 hour",
    text: "You magically mark one creature you can see within range as your quarry. Until the spell ends, you deal an extra 1d6 Force damage to the target whenever you hit it with an attack roll. You also have Advantage on any Wisdom (Perception or Survival) check you make to find it. If the target drops to 0 Hit Points before this spell ends, you can take a Bonus Action to move the mark to a new creature you can see within range.",
    higherLevel: "Your Concentration can last longer with a spell slot of level 3-4 (up to 8 hours) or 5+ (up to 24 hours).",
    roll: "none", saveAbility: null, damage: "+1d6 Force on weapon hits against the marked target", effect: "Advantage on Wisdom (Perception/Survival) to find the target; can be re-marked on a new target if the first drops.",
    scaling: "Doesn't add damage — a higher slot only extends how long you can Concentrate on it (up to 8 hours at 3rd-4th, 24 hours at 5th+)."
  },
  identify: {
    name: "Identify", level: 1, school: "Divination", ritual: true, classes: ["bard", "wizard"],
    time: "1 minute or Ritual", range: "Touch", components: "V, S, M (a pearl worth 100+ GP)", duration: "Instantaneous",
    text: "You touch an object throughout the spell's casting. If the object is a magic item or some other magical object, you learn its properties and how to use them, whether it requires Attunement, and how many charges it has, if any. You learn whether any ongoing spells are affecting the item and what they are. If the item was created by a spell, you learn that spell's name. If you instead touch a creature throughout the casting, you learn which ongoing spells, if any, are currently affecting it.",
    roll: "none", saveAbility: null, damage: null, effect: "Pure information about one item's (or creature's) magic."
  },
  illusoryScript: {
    name: "Illusory Script", level: 1, school: "Illusion", ritual: true, classes: ["bard", "warlock", "wizard"],
    time: "1 minute or Ritual", range: "Touch", components: "S, M (ink worth 10+ GP, which the spell consumes)", duration: "10 days",
    text: "You write on parchment, paper, or another suitable material and imbue it with an illusion that lasts for the duration. To you and any creatures you designate when you cast the spell, the writing appears normal, seems to be written in your hand, and conveys whatever meaning you intended. To all others, the writing appears as if written in an unknown or magical script that is unintelligible; alternatively, the illusion can alter the meaning, handwriting, and language of the text, though the language must be one you know. If the spell is dispelled, the original script and the illusion both disappear. A creature with Truesight can read the hidden message.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility/deception only."
  },
  inflictWounds: {
    name: "Inflict Wounds", level: 1, school: "Necromancy", classes: ["cleric"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "A creature you touch makes a Constitution saving throw, taking 2d10 Necrotic damage on a failed save or half as much damage on a successful one.",
    higherLevel: "The damage increases by 1d10 for each spell slot level above 1.",
    roll: "save", saveAbility: "con", damage: "2d10 Necrotic", effect: "Half damage on a successful save.",
    scaling: "+1d10 per slot level above 1st."
  },
  jump: {
    name: "Jump", level: 1, school: "Transmutation", classes: ["druid", "ranger", "sorcerer", "wizard"],
    time: "Bonus Action", range: "Touch", components: "V, S, M (a grasshopper's hind leg)", duration: "1 minute",
    text: "You touch a willing creature. Once on each of its turns until the spell ends, that creature can jump up to 30 feet by spending 10 feet of movement.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Movement utility only.",
    scaling: "+1 target per slot level above 1st."
  },
  longstrider: {
    name: "Longstrider", level: 1, school: "Transmutation", classes: ["bard", "druid", "ranger", "wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a pinch of dirt)", duration: "1 hour",
    text: "You touch a creature. The target's Speed increases by 10 feet until the spell ends.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "+10 ft. Speed for the duration.",
    scaling: "+1 target per slot level above 1st."
  },
  mageArmor: {
    name: "Mage Armor", level: 1, school: "Abjuration", classes: ["sorcerer", "wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a piece of cured leather)", duration: "8 hours",
    text: "You touch a willing creature who isn't wearing armor. Until the spell ends, the target's base AC becomes 13 plus its Dexterity modifier. The spell ends early if the target dons armor.",
    roll: "none", saveAbility: null, damage: null, effect: "AC becomes 13 + Dex modifier for the duration."
  },
  magicMissile: {
    name: "Magic Missile", level: 1, school: "Evocation", classes: ["sorcerer", "wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You create three glowing darts of magical force. Each dart strikes a creature of your choice that you can see within range. A dart deals 1d4 + 1 Force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.",
    higherLevel: "The spell creates one more dart for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: "1d4+1 Force per dart (3 darts)", effect: "No attack roll — the darts never miss.",
    scaling: "+1 dart per slot level above 1st."
  },
  protectionFromEvilAndGood: {
    name: "Protection from Evil and Good", level: 1, school: "Abjuration", classes: ["cleric", "druid", "paladin", "warlock", "wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a flask of Holy Water worth 25+ GP, which the spell consumes)", duration: "Concentration, up to 10 minutes",
    text: "Until the spell ends, one willing creature you touch is protected against creatures that are Aberrations, Celestials, Elementals, Fey, Fiends, or Undead. The protection grants several benefits: creatures of those types have Disadvantage on attack rolls against the target, and the target can't be possessed by or gain the Charmed or Frightened conditions from them. If the target is already possessed, Charmed, or Frightened by such a creature, the target has Advantage on any new saving throw against the relevant effect.",
    roll: "none", saveAbility: null, damage: null, effect: "Named creature types have Disadvantage attacking the target; target resists their Charm/Fright/possession."
  },
  purifyFoodAndDrink: {
    name: "Purify Food and Drink", level: 1, school: "Transmutation", ritual: true, classes: ["cleric", "druid", "paladin"],
    time: "Action or Ritual", range: "10 feet", components: "V, S", duration: "Instantaneous",
    text: "You remove poison and rot from nonmagical food and drink in a 5-foot-radius Sphere centered on a point within range.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only."
  },
  sanctuary: {
    name: "Sanctuary", level: 1, school: "Abjuration", classes: ["cleric"],
    time: "Bonus Action", range: "30 feet", components: "V, S, M (a shard of glass from a mirror)", duration: "1 minute",
    text: "You ward a creature within range. Until the spell ends, any creature who targets the warded creature with an attack roll or a damaging spell must succeed on a Wisdom saving throw or either choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from areas of effect. The spell ends if the warded creature makes an attack roll, casts a spell, or deals damage.",
    roll: "save", saveAbility: "wis", damage: null, effect: "Attacker fails the save → must retarget or lose the attack/spell; doesn't stop area effects; ends if the warded creature acts aggressively."
  },
  searingSmite: {
    name: "Searing Smite", level: 1, school: "Evocation", classes: ["paladin"],
    time: "Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike", range: "Self", components: "V", duration: "1 minute",
    text: "As you hit the target, it takes an extra 1d6 Fire damage from the attack. At the start of each of its turns until the spell ends, the target takes 1d6 Fire damage and then makes a Constitution saving throw. On a failed save, the spell continues. On a successful save, the spell ends.",
    higherLevel: "All the damage increases by 1d6 for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: "+1d6 Fire on the triggering hit, then 1d6 Fire at the start of each of the target's turns", effect: "Target makes a Constitution save each of its turns to end the ongoing burning.",
    scaling: "+1d6 to both the initial hit and the ongoing burn per slot level above 1st."
  },
  shield: {
    name: "Shield", level: 1, school: "Abjuration", classes: ["sorcerer", "wizard"],
    time: "Reaction, which you take when you are hit by an attack roll or targeted by the Magic Missile spell", range: "Self", components: "V, S", duration: "1 round",
    text: "An imperceptible barrier of magical force protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from Magic Missile.",
    roll: "none", saveAbility: null, damage: null, effect: "+5 AC until the start of your next turn (including the triggering attack); immune to Magic Missile."
  },
  shieldOfFaith: {
    name: "Shield of Faith", level: 1, school: "Abjuration", classes: ["cleric", "paladin"],
    time: "Bonus Action", range: "60 feet", components: "V, S, M (a prayer scroll)", duration: "Concentration, up to 10 minutes",
    text: "A shimmering field surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
    roll: "none", saveAbility: null, damage: null, effect: "+2 AC for the duration."
  },
  silentImage: {
    name: "Silent Image", level: 1, school: "Illusion", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a bit of fleece)", duration: "Concentration, up to 10 minutes",
    text: "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot Cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn't accompanied by sound, smell, or other sensory effects. As a Magic action, you can cause the image to move to any spot within range, altering its appearance so its movements appear natural. Physical interaction with the image reveals it to be an illusion. A creature that takes a Study action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC; if a creature discerns the illusion for what it is, the creature can see through the image.",
    roll: "none", saveAbility: null, damage: null, effect: "No sound; an Investigation check against your spell DC reveals it as an illusion."
  },
  sleep: {
    name: "Sleep", level: 1, school: "Enchantment", classes: ["bard", "sorcerer", "wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a pinch of sand or rose petals)", duration: "Concentration, up to 1 minute",
    text: "Each creature of your choice in a 5-foot-radius Sphere centered on a point within range must succeed on a Wisdom saving throw or have the Incapacitated condition until the end of its next turn, at which point it must repeat the save. If the target fails the second save, the target has the Unconscious condition for the duration. The spell ends on a target if it takes damage or someone within 5 feet of it takes an action to shake it out of the spell's effect. Creatures that don't sleep, such as elves, or that have Immunity to the Exhaustion condition automatically succeed on saves against this spell.",
    roll: "save", saveAbility: "wis", damage: null, effect: "Fail once: Incapacitated until end of next turn, then re-save. Fail twice in a row: Unconscious for the duration. Damage or a helper's action ends it early. Elves and Exhaustion-immune creatures auto-succeed."
  },
  speakWithAnimals: {
    name: "Speak with Animals", level: 1, school: "Divination", ritual: true, classes: ["bard", "druid", "ranger", "warlock"],
    time: "Action or Ritual", range: "Self", components: "V, S", duration: "10 minutes",
    text: "For the duration, you can comprehend and verbally communicate with Beasts, and you can use any of the Influence action's skill options with them. Most Beasts have little to say about topics that don't pertain to survival or companionship, but at minimum, a Beast can give you information about nearby locations and monsters, including whatever it has perceived within the past day.",
    roll: "none", saveAbility: null, damage: null, effect: "Communication only; doesn't make beasts friendly."
  },
  tashasHideousLaughter: {
    name: "Tasha's Hideous Laughter", level: 1, school: "Enchantment", classes: ["bard", "warlock", "wizard"],
    time: "Action", range: "30 feet", components: "V, S, M (a tart and a feather)", duration: "Concentration, up to 1 minute",
    text: "One creature of your choice that you can see within range makes a Wisdom saving throw. On a failed save, it has the Prone and Incapacitated conditions for the duration. During that time, it laughs uncontrollably if it's capable of laughter, and it can't end the Prone condition on itself. At the end of each of its turns and each time it takes damage, it makes another Wisdom saving throw (with Advantage if triggered by damage). On a successful save, the spell ends.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, Prone + Incapacitated for the duration; re-saves each turn/on damage (Advantage if from damage).",
    scaling: "+1 target per slot level above 1st."
  },
  tensersFloatingDisk: {
    name: "Tenser's Floating Disk", level: 1, school: "Conjuration", ritual: true, classes: ["wizard"],
    time: "Action or Ritual", range: "30 feet", components: "V, S, M (a drop of mercury)", duration: "1 hour",
    text: "This spell creates a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice within range. The disk remains for the duration and can hold up to 500 pounds; if more weight is placed on it, the spell ends and everything on the disk falls. The disk is immobile while you are within 20 feet of it; otherwise it follows you to remain within 20 feet, but can't cross an elevation change of 10 feet or more. If you move more than 100 feet from the disk, the spell ends.",
    roll: "none", saveAbility: null, damage: null, effect: "Hauling utility only, up to 500 lb."
  },
  thunderwave: {
    name: "Thunderwave", level: 1, school: "Evocation", classes: ["bard", "druid", "sorcerer", "wizard"],
    time: "Action", range: "Self (15-foot Cube)", components: "V, S", duration: "Instantaneous",
    text: "You unleash a wave of thunderous energy. Each creature in a 15-foot Cube originating from you makes a Constitution saving throw. On a failed save, a creature takes 2d8 Thunder damage and is pushed 10 feet away from you; on a successful save, a creature takes half as much damage only. Unsecured objects entirely within the Cube are also pushed 10 feet away from you, and a thunderous boom is audible within 300 feet.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 1.",
    roll: "save", saveAbility: "con", damage: "2d8 Thunder", effect: "On a failed save the target is also pushed 10 ft. away from you; unsecured objects in the area are pushed 10 ft. too.",
    scaling: "+1d8 per slot level above 1st."
  },
  unseenServant: {
    name: "Unseen Servant", level: 1, school: "Conjuration", ritual: true, classes: ["bard", "warlock", "wizard"],
    time: "Action or Ritual", range: "60 feet", components: "V, S, M (a bit of string and of wood)", duration: "1 hour",
    text: "This spell creates an Invisible, mindless, shapeless, Medium force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 Hit Point, and a Strength of 2, and it can't attack; if it drops to 0 Hit Points, the spell ends. Once on each of your turns as a Bonus Action, you can mentally command the servant to move up to 15 feet and interact with an object; it can fetch things, clean, mend, fold clothes, light fires, serve food, and pour drinks, performing the task to the best of its ability until done, then waiting for your next command. If you command it to move more than 60 feet away from you, the spell ends.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only; AC 10, 1 HP, Str 2, can't attack."
  },
  witchBolt: {
    name: "Witch Bolt", level: 1, school: "Evocation", classes: ["sorcerer", "warlock", "wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a twig struck by lightning)", duration: "Concentration, up to 1 minute",
    text: "A beam of crackling energy lances toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against it. On a hit, the target takes 2d12 Lightning damage. On each of your subsequent turns, you can take a Bonus Action to deal 1d12 Lightning damage to the target automatically, even if the first attack missed. The spell ends if the target is ever outside the spell's range or if it has Total Cover from you.",
    higherLevel: "The initial damage increases by 1d12 for each spell slot level above 1.",
    roll: "attack", saveAbility: null, damage: "2d12 Lightning on the initial hit, then 1d12 (Bonus Action, each of your later turns)", effect: "The follow-up damage needs a Bonus Action each turn — it isn't automatic upkeep; ends if the target leaves range or gets Total Cover.",
    scaling: "+1d12 to the initial hit per slot level above 1st (the Bonus-Action follow-up damage doesn't increase)."
  }
};

export const SPELL_KEYS = Object.keys(SPELLS);

/* Every spell between `minLevel` and `maxLevel` (inclusive) that's on
   `listKey`'s list, sorted by level then name. Cantrips are level 0. */
export function spellsForList(listKey, minLevel, maxLevel) {
  return SPELL_KEYS
    .filter((k) => SPELLS[k].classes.includes(listKey) && SPELLS[k].level >= minLevel && SPELLS[k].level <= maxLevel)
    .sort((a, b) => SPELLS[a].level - SPELLS[b].level || SPELLS[a].name.localeCompare(SPELLS[b].name));
}

/* Spell text above is drawn from the 2024 D&D Player's Handbook and/or the
   D&D 5.2 SRD (CC-BY-4.0). Portions of this content are licensed under the
   Creative Commons Attribution 4.0 International License, available at
   https://creativecommons.org/licenses/by/4.0/legalcode. */
export const SRD_ATTRIBUTION =
  "Spell text adapted from the D&D 5.2 SRD, available under CC-BY-4.0 (creativecommons.org/licenses/by/4.0).";
