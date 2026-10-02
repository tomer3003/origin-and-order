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

   COVERAGE: every cantrip, level 1 and level 2 spell in the 2024 PHB
   (34 + 64 + 63), parsed from the PDF text and then repaired by hand where
   the PDF loses glyphs (see PROGRESS.md). Levels 3-9 are still to come. */

export const SPELLS = {
  /* ---------------- Cantrips ---------------- */
  acidSplash: {
    name: "Acid Splash", level: 0, school: "Evocation", classes: ["sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "You create an acidic bubble at a point within range, where it explodes in a 5-foot-radius Sphere. Each creature in that Sphere must succeed on a Dexterity saving throw or take 1d6 Acid damage.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "dex", damage: "1d6 Acid", effect: null
  },
  bladeWard: {
    name: "Blade Ward", level: 0, school: "Abjuration", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "Self", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "Whenever a creature makes an attack roll against you before the spell ends, the attacker subtracts 1d4 from the attack roll.",
    roll: "none", saveAbility: null, damage: null, effect: "Attackers subtract 1d4 from attack rolls against you."
  },
  chillTouch: {
    name: "Chill Touch", level: 0, school: "Necromancy", classes: ["sorcerer","warlock","wizard"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "Channeling the chill of the grave, make a melee spell attack against a target within reach. On a hit, the target takes 1d10 Necrotic damage, and it can't regain Hit Points until the end of your next turn.",
    higherLevel: "The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).",
    roll: "attack", saveAbility: null, damage: "1d10 Necrotic", effect: "Target can't regain HP until the end of your next turn."
  },
  dancingLights: {
    name: "Dancing Lights", level: 0, school: "Illusion", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "120 feet", components: "V, S, M (a bit of phosphorus)", duration: "Concentration, up to 1 minute",
    text: "You create up to four torch-size lights within range, making them appear as torches, lanterns, or glowing orbs that hover for the duration. Alternatively, you combine the four lights into one glowing Medium form that is vaguely humanlike. Whichever form you choose, each light sheds Dim Light in a 10-foot radius. As a Bonus Action, you can move the lights up to 60 feet to a space within range. A light must be within 20 feet of another light created by this spell, and a light vanishes if it exceeds the spell's range.",
    roll: "none", saveAbility: null, damage: null, effect: "Light and misdirection only, no damage."
  },
  druidcraft: {
    name: "Druidcraft", level: 0, school: "Transmutation", classes: ["druid"],
    time: "Action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    text: "Whispering to the spirits of nature, you create one of the following effects within range. Weather Sensor. You create a Tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. The effect might manifest as a golden orb for clear skies, a cloud for rain, falling snowflakes for snow, and so on. This effect persists for 1 round. Bloom. You instantly make a flower blossom, a seed pod open, or a leaf bud bloom. Sensory Effect. You create a harmless sensory effect, such as falling leaves, spectral dancing fairies, a gentle breeze, the sound of an animal, or the faint odor of skunk. The effect must fit in a 5-foot Cube. Fire Play. You light or snuff out a candle, a torch, or a campfire.",
    roll: "none", saveAbility: null, damage: null, effect: "Purely flavor/utility, choose one of four listed effects."
  },
  eldritchBlast: {
    name: "Eldritch Blast", level: 0, school: "Evocation", classes: ["warlock"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You hurl a beam of crackling energy. Make a ranged spell attack against one creature or object in range. On a hit, the target takes 1d10 Force damage.",
    higherLevel: "The spell creates two beams at level 5, three beams at level 11, and four beams at level 17. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.",
    roll: "attack", saveAbility: null, damage: "1d10 Force per beam", effect: null,
    cantripScaleNote: "One more beam at character levels 5, 11, and 17 (up to 4 total), each aimable at a different target — not a bigger die like other cantrips.",
    noCantripScale: true
  },
  elementalism: {
    name: "Elementalism", level: 0, school: "Transmutation", classes: ["druid","sorcerer","wizard"],
    time: "Action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    text: "You exert control over the elements, creating one of the following effects within range. Beckon Air. You create a breeze strong enough to ripple cloth, stir dust, rustle leaves, and close open doors and shutters, all in a 5foot Cube. Doors and shutters being held open by someone or something aren't affected. Beckon Earth. You create a thin shroud of dust or sand that covers surfaces in a 5-foot-square area, or you cause a single word to appear in your handwriting in a patch of dirt or sand. Beckon Fire. You create a thin cloud of harmless embers and colored, scented smoke in a 5-foot Cube. You choose the color and scent, and the embers can light candles, torches, or lamps in that area. The smoke's scent lingers for 1 minute. Beckon Water. You create a spray of cool mist that lightly dampens creatures and objects in a 5-foot Cube. Alternatively, you create 1 cup of clean water either in an open container or on a surface, and the water evaporates in 1 minute. Sculpt Element. You cause dirt, sand, fire, smoke, mist, or water that can fit in a 1-foot Cube to assume a crude shape (such as that of a creature) for 1 hour.",
    roll: "none", saveAbility: null, damage: null, effect: "Purely elemental flavor/utility — the 2024 PHB's consolidated replacement for the old Control Flames/Create Bonfire/Frostbite/Gust cantrips, none of which are in this book."
  },
  fireBolt: {
    name: "Fire Bolt", level: 0, school: "Evocation", classes: ["sorcerer","wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You hurl a mote of fire at a creature or an object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 Fire damage. A flammable object hit by this spell starts burning if it isn't being worn or carried.",
    higherLevel: "The damage increases by 1d10 when you reach levels 5 (2d10), 11 (3d10), and 17 (4d10).",
    roll: "attack", saveAbility: null, damage: "1d10 Fire", effect: "Can ignite flammable objects that aren't worn or carried."
  },
  friends: {
    name: "Friends", level: 0, school: "Enchantment", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "10 feet", components: "S, M (some makeup)", duration: "Concentration, up to 1 minute",
    text: "You magically emanate a sense of friendship toward one creature you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The target succeeds automatically if it isn't a Humanoid, if you're fighting it, or if you have cast this spell on it within the past 24 hours. The spell ends early if the target takes damage or if you make an attack roll, deal damage, or force anyone to make a saving throw. When the spell ends, the target knows it was Charmed by you.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, Charmed for the duration; ends early on damage/hostile act, and the target knows it was charmed once the spell ends."
  },
  guidance: {
    name: "Guidance", level: 0, school: "Divination", classes: ["cleric","druid"],
    time: "Action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "You touch a willing creature and choose a skill. Until the spell ends, the creature adds 1d4 to any ability check using the chosen skill.",
    roll: "none", saveAbility: null, damage: null, effect: "+1d4 to one chosen skill's ability checks for the duration."
  },
  lightCantrip: {
    name: "Light", level: 0, school: "Evocation", classes: ["bard","cleric","sorcerer","wizard"],
    time: "Action", range: "Touch", components: "V, M (a firefly or phosphorescent moss)", duration: "1 hour",
    text: "You touch one Large or smaller object that isn't being worn or carried by someone else. Until the spell ends, the object sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. The light can be colored as you like. Covering the object with something opaque blocks the light. The spell ends if you cast it again.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility light source only."
  },
  mageHand: {
    name: "Mage Hand", level: 0, school: "Conjuration", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "30 feet", components: "V, S", duration: "1 minute",
    text: "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. When you cast the spell, you can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. As a Magic action on your later turns, you can control the hand thus again. As part of that action, you can move the hand up to 30 feet. The hand can't attack, activate magic items, or carry more than 10 pounds.",
    roll: "none", saveAbility: null, damage: null, effect: "No damage; remote manipulation only, up to 10 lb."
  },
  mending: {
    name: "Mending", level: 0, school: "Transmutation", classes: ["bard","cleric","druid","sorcerer","wizard"],
    time: "1 minute", range: "Touch", components: "V, S, M (two lodestones)", duration: "Instantaneous",
    text: "This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage. This spell can physically repair a magic item, but it can't restore magic to such an object.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility repair only."
  },
  message: {
    name: "Message", level: 0, school: "Transmutation", classes: ["bard","druid","sorcerer","wizard"],
    time: "Action", range: "120 feet", components: "S, M (a copper wire)", duration: "1 round",
    text: "You point toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear. You can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence; 1 foot of stone, metal, or wood; or a thin sheet of lead blocks the spell.",
    roll: "none", saveAbility: null, damage: null, effect: "Private one-round two-way whisper."
  },
  mindSliver: {
    name: "Mind Sliver", level: 0, school: "Enchantment", classes: ["sorcerer","warlock","wizard"],
    time: "Action", range: "60 feet", components: "V", duration: "1 round",
    text: "You try to temporarily sliver the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 Psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "int", damage: "1d6 Psychic", effect: "On a failed save, the target also subtracts 1d4 from its next saving throw before the end of your next turn."
  },
  minorIllusion: {
    name: "Minor Illusion", level: 0, school: "Illusion", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "30 feet", components: "S, M (a bit of fleece)", duration: "1 minute",
    text: "You create a sound or an image of an object within range that lasts for the duration. See the descriptions below for the effects of each. The illusion ends if you cast this spell again. If a creature takes a Study action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature. Sound. If you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends. Image. If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot Cube. The image can't create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, since things can pass through it.",
    roll: "none", saveAbility: null, damage: null, effect: "Investigation check against your spell DC to see through it; no simultaneous sound+image."
  },
  poisonSpray: {
    name: "Poison Spray", level: 0, school: "Necromancy", classes: ["druid","sorcerer","warlock","wizard"],
    time: "Action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    text: "You spray toxic mist at a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d12 Poison damage.",
    higherLevel: "The damage increases by 1d12 when you reach levels 5 (2d12), 11 (3d12), and 17 (4d12).",
    roll: "attack", saveAbility: null, damage: "1d12 Poison", effect: null
  },
  prestidigitation: {
    name: "Prestidigitation", level: 0, school: "Transmutation", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "10 feet", components: "V, S", duration: "Up to 1 hour",
    text: "You create a magical effect within range. Choose the effect from the options below. If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time. Sensory Effect. You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor. Fire Play. You instantaneously light or snuff out a candle, a torch, or a small campfire. Clean or Soil. You instantaneously clean or soil an object no larger than 1 cubic foot. Minor Sensation. You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour. Magic Mark. You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour. Minor Creation. You create a nonmagical trinket or an illusory image that can fit in your hand. It lasts until the end of your next turn. A trinket can deal no damage and has no monetary worth.",
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
    name: "Ray of Frost", level: 0, school: "Evocation", classes: ["sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 Cold damage, and its Speed is reduced by 10 feet until the start of your next turn.",
    higherLevel: "The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
    roll: "attack", saveAbility: null, damage: "1d8 Cold", effect: "On a hit, target's Speed is reduced by 10 ft. until the start of your next turn."
  },
  resistance: {
    name: "Resistance", level: 0, school: "Abjuration", classes: ["cleric","druid"],
    time: "Action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "You touch a willing creature and choose a damage type: Acid, Bludgeoning, Cold, Fire, Lightning, Necrotic, Piercing, Poison, Radiant, Slashing, or Thunder. When the creature takes damage of the chosen type before the spell ends, the creature reduces the total damage taken by 1d4. A creature can benefit from this spell only once per turn.",
    roll: "none", saveAbility: null, damage: null, effect: "One willing creature reduces damage of a chosen type by 1d4, once per turn."
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
    cantripScaleNote: "The weapon's damage die itself grows at levels 5 (d10), 11 (d12), and 17 (2d6) — not an extra die like other cantrips.",
    noCantripScale: true
  },
  shockingGrasp: {
    name: "Shocking Grasp", level: 0, school: "Evocation", classes: ["sorcerer","wizard"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "Lightning springs from you to a creature that you try to touch. Make a melee spell attack against the target. On a hit, the target takes 1d8 Lightning damage, and it can't make Opportunity Attacks until the start of its next turn.",
    higherLevel: "The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
    roll: "attack", saveAbility: null, damage: "1d8 Lightning", effect: "Target can't make Opportunity Attacks until the start of its next turn."
  },
  sorcerousBurst: {
    name: "Sorcerous Burst", level: 0, school: "Evocation", classes: ["sorcerer"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You cast sorcerous energy at one creature or object within range. Make a ranged attack roll against the target. On a hit, the target takes 1d8 damage of a type you choose: Acid, Cold, Fire, Lightning, Poison, Psychic, or Thunder. If you roll an 8 on a d8 for this spell, you can roll another d8, and add it to the damage. When you cast this spell, the maximum number of these d8s you can add to the spell's damage equals your spellcasting ability modifier.",
    higherLevel: "The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
    roll: "attack", saveAbility: null, damage: "1d8 of a type you choose", effect: "Choose the damage type (Acid, Cold, Fire, Lightning, Poison, Psychic, or Thunder); each 8 rolled adds another d8, up to your spellcasting modifier in extra dice."
  },
  spareTheDying: {
    name: "Spare the Dying", level: 0, school: "Necromancy", classes: ["cleric","druid"],
    time: "Action", range: "15 feet", components: "V, S", duration: "Instantaneous",
    text: "Choose a creature within range that has 0 Hit Points and isn't dead. The creature becomes Stable.",
    higherLevel: "The range doubles when you reach levels 5 (30 feet), 11 (60 feet), and 17 (120 feet).",
    roll: "none", saveAbility: null, damage: null, effect: "Stabilizes a dying creature; no healing.",
    cantripScaleNote: "The range doubles at character levels 5 (30 ft.), 11 (60 ft.), and 17 (120 ft.) — this cantrip scales range, not damage.",
    noCantripScale: true
  },
  starryWisp: {
    name: "Starry Wisp", level: 0, school: "Evocation", classes: ["bard","druid"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "You launch a mote of light at one creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d8 Radiant damage, and until the end of your next turn, it emits Dim Light in a 10-foot radius and can't benefit from the Invisible condition.",
    higherLevel: "The damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
    roll: "attack", saveAbility: null, damage: "1d8 Radiant", effect: "On a hit the target sheds Dim Light and can't benefit from being Invisible until the end of your next turn."
  },
  thaumaturgy: {
    name: "Thaumaturgy", level: 0, school: "Transmutation", classes: ["cleric"],
    time: "Action", range: "30 feet", components: "V", duration: "Up to 1 minute",
    text: "You manifest a minor wonder within range. You create one of the effects below within range. If you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time. Altered Eyes. You alter the appearance of your eyes for 1 minute. Booming Voice. Your voice booms up to three times as loud as normal for 1 minute. For the duration, you have Advantage on Charisma (Intimidation) checks. Fire Play. You cause flames to flicker, brighten, dim, or change color for 1 minute. Invisible Hand. You instantaneously cause an unlocked door or window to fly open or slam shut. Phantom Sound. You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers. Tremors. You cause harmless tremors in the ground for 1 minute.",
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
    name: "Thunderclap", level: 0, school: "Evocation", classes: ["bard","druid","sorcerer","warlock","wizard"],
    time: "Action", range: "Self", components: "S", duration: "Instantaneous",
    text: "Each creature in a 5-foot Emanation originating from you must succeed on a Constitution saving throw or take 1d6 Thunder damage. The spell's thunderous sound can be heard up to 100 feet away.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "con", damage: "1d6 Thunder", effect: "Affects every creature in a 5-ft. Emanation around you; audible to 100 ft."
  },
  tollTheDead: {
    name: "Toll the Dead", level: 0, school: "Necromancy", classes: ["cleric","warlock","wizard"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "You point at one creature you can see within range, and the single chime of a dolorous bell is audible within 10 feet of the target. The target must succeed on a Wisdom saving throw or take 1d8 Necrotic damage. If the target is missing any of its Hit Points, it instead takes 1d12 Necrotic damage.",
    higherLevel: "The damage increases by one die when you reach levels 5 (2d8 or 2d12), 11 (3d8 or 3d12), and 17 (4d8 or 4d12).",
    roll: "save", saveAbility: "wis", damage: "1d8 Necrotic", effect: "1d12 instead if the target is missing any Hit Points."
  },
  trueStrike: {
    name: "True Strike", level: 0, school: "Divination", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "Self", components: "S, M (a weapon with which you have proficiency and that is worth 1+ CP)", duration: "Instantaneous",
    text: "Guided by a flash of magical insight, you make one attack with the weapon used in the spell's casting. The attack uses your spellcasting ability for the attack and damage rolls instead of using Strength or Dexterity. If the attack deals damage, it can be Radiant damage or the weapon's normal damage type (your choice).",
    higherLevel: "Whether you deal Radiant damage or the weapon's normal damage type, the attack deals extra Radiant damage when you reach levels 5 (1d6), 11 (2d6), and 17 (3d6).",
    roll: "attack", saveAbility: null, damage: "Your weapon's normal damage (Radiant or the weapon's type, your choice)", effect: "Uses your spellcasting ability for the attack/damage roll instead of Str/Dex.",
    cantripScaleNote: "Adds extra Radiant damage at character levels 5 (1d6), 11 (2d6), and 17 (3d6), on top of the weapon's own damage.",
    noCantripScale: true
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
    time: "Action", range: "Self", components: "V, M (a sunburst token)", duration: "Instantaneous",
    text: "Burning radiance erupts from you in a 5-foot Emanation. Each creature of your choice that you can see in it must succeed on a Constitution saving throw or take 1d6 Radiant damage.",
    higherLevel: "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
    roll: "save", saveAbility: "con", damage: "1d6 Radiant", effect: "Affects every creature of your choice in a 5-ft. Emanation around you."
  },

  /* ---------------- Level 1 ---------------- */
  alarm: {
    name: "Alarm", level: 1, school: "Abjuration", classes: ["ranger","wizard"], ritual: true,
    time: "1 minute or Ritual", range: "30 feet", components: "V, S, M (a bell and silver wire)", duration: "8 hours",
    text: "You set an alarm against intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot Cube. Until the spell ends, an alarm alerts you whenever a creature touches or enters the warded area. When you cast the spell, you can designate creatures that won't set off the alarm. You also choose whether the alarm is audible or mental: Audible Alarm. The alarm produces the sound of a handbell for 10 seconds within 60 feet of the warded area. Mental Alarm. You are alerted by a mental ping if you are within 1 mile of the warded area. This ping awakens you if you're asleep.",
    roll: "none", saveAbility: null, damage: null, effect: "Pure warning/utility; no damage.",
    scaling: "No change when cast with a higher-level slot."
  },
  animalFriendship: {
    name: "Animal Friendship", level: 1, school: "Enchantment", classes: ["bard","druid","ranger"],
    time: "Action", range: "30 feet", components: "V, S, M (a morsel of food)", duration: "24 hours",
    text: "Target a Beast that you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. If you or one of your allies deals damage to the target, the spell ends.",
    higherLevel: "You can target one additional Beast for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save the beast is Charmed for the duration (ends if you or an ally damages it).",
    scaling: "+1 target Beast per slot level above 1st."
  },
  armorOfAgathys: {
    name: "Armor of Agathys", level: 1, school: "Abjuration", classes: ["warlock"],
    time: "Bonus Action", range: "Self", components: "V, S, M (a shard of blue glass)", duration: "1 hour",
    text: "Protective magical frost surrounds you. You gain 5 Temporary Hit Points. If a creature hits you with a melee attack roll before the spell ends, the creature takes 5 Cold damage. The spell ends early if you have no Temporary Hit Points.",
    higherLevel: "The Temporary Hit Points and the Cold damage both increase by 5 for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: "5 Cold (to melee attackers)", effect: "5 Temporary Hit Points; a creature that hits you with a melee attack takes 5 Cold damage while they last.",
    scaling: "The Temporary Hit Points and the Cold damage both increase by 5 for each spell slot level above 1."
  },
  armsOfHadar: {
    name: "Arms of Hadar", level: 1, school: "Conjuration", classes: ["warlock"],
    time: "Action", range: "Self", components: "V, S", duration: "Instantaneous",
    text: "Invoking Hadar, you cause tendrils to erupt from yourself. Each creature in a 10-foot Emanation originating from you makes a Strength saving throw. On a failed save, a target takes 2d6 Necrotic damage and can't take Reactions until the start of its next turn. On a successful save, a target takes half as much damage only.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "save", saveAbility: "str", damage: "2d6 Necrotic", effect: "Each creature in a 10-ft. Emanation; on a failure it also can't take Reactions until its next turn. Half damage on a success.",
    scaling: "+1d6 damage per slot level above 1st."
  },
  bane: {
    name: "Bane", level: 1, school: "Enchantment", classes: ["bard","cleric","warlock"],
    time: "Action", range: "30 feet", components: "V, S, M (a drop of blood)", duration: "Concentration, up to 1 minute",
    text: "Up to three creatures of your choice that you can see within range must each make a Charisma saving throw. Whenever a target that fails this save makes an attack roll or a saving throw before the spell ends, the target must subtract 1d4 from the attack roll or save.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "save", saveAbility: "cha", damage: null, effect: "On a failed save, subtract 1d4 from attack rolls and saving throws for the duration.",
    scaling: "+1 target per slot level above 1st."
  },
  bless: {
    name: "Bless", level: 1, school: "Enchantment", classes: ["cleric","paladin"],
    time: "Action", range: "30 feet", components: "V, S, M (a Holy Symbol worth 5+ GP)", duration: "Concentration, up to 1 minute",
    text: "You bless up to three creatures within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target adds 1d4 to the attack roll or save.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Each target adds 1d4 to attack rolls and saving throws for the duration.",
    scaling: "+1 target per slot level above 1st."
  },
  burningHands: {
    name: "Burning Hands", level: 1, school: "Evocation", classes: ["sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S", duration: "Instantaneous",
    text: "A thin sheet of flames shoots forth from you. Each creature in a 15-foot Cone makes a Dexterity saving throw, taking 3d6 Fire damage on a failed save or half as much damage on a successful one. Flammable objects in the Cone that aren't being worn or carried start burning.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "save", saveAbility: "dex", damage: "3d6 Fire", effect: "Half damage on a successful save; can ignite flammable objects in the area.",
    scaling: "+1d6 per slot level above 1st."
  },
  charmPerson: {
    name: "Charm Person", level: 1, school: "Enchantment", classes: ["bard","druid","sorcerer","warlock","wizard"],
    time: "Action", range: "30 feet", components: "V, S", duration: "1 hour",
    text: "One Humanoid you can see within range makes a Wisdom saving throw. It does so with Advantage if you or your allies are fighting it. On a failed save, the target has the Charmed condition until the spell ends or until you or your allies damage it. The Charmed creature is Friendly to you. When the spell ends, the target knows it was Charmed by you.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, Charmed (and Friendly to you) until the spell ends or you/allies damage it; it knows it was charmed once the spell ends.",
    scaling: "+1 target per slot level above 1st."
  },
  chromaticOrb: {
    name: "Chromatic Orb", level: 1, school: "Evocation", classes: ["sorcerer","wizard"],
    time: "Action", range: "90 feet", components: "V, S, M (a diamond worth 50+ GP)", duration: "Instantaneous",
    text: "You hurl an orb of energy at a target within range. Choose Acid, Cold, Fire, Lightning, Poison, or Thunder for the type of orb you create, and then make a ranged spell attack against the target. On a hit, the target takes 3d8 damage of the chosen type. If you roll the same number on two or more of the d8s, the orb leaps to a different target of your choice within 30 feet of the target. Make an attack roll against the new target, and make a new damage roll. The orb can't leap again unless you cast the spell with a level 2+ spell slot.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 1. The orb can leap a maximum number of times equal to the level of the slot expended, and a creature can be targeted only once by each casting of this spell.",
    roll: "attack", saveAbility: null, damage: "3d8 of chosen type (Acid/Cold/Fire/Lightning/Poison/Thunder)", effect: "On matching damage dice, the orb leaps to a new target within 30 ft. (leap count = slot level).",
    scaling: "+1d8 per slot level above 1st; also leaps up to (slot level) times instead of once."
  },
  colorSpray: {
    name: "Color Spray", level: 1, school: "Illusion", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S, M (a pinch of colorful sand)", duration: "Instantaneous",
    text: "You launch a dazzling array of flashing, colorful light. Each creature in a 15-foot Cone originating from you must succeed on a Constitution saving throw or have the Blinded condition until the end of your next turn.",
    roll: "save", saveAbility: "con", damage: null, effect: "On a failed save, Blinded until the end of your next turn.",
    scaling: "No change when cast with a higher-level slot."
  },
  command: {
    name: "Command", level: 1, school: "Enchantment", classes: ["bard","cleric","paladin"],
    time: "Action", range: "60 feet", components: "V", duration: "Instantaneous",
    text: "You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. Choose the command from these options: Approach. The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you. Drop. The target drops whatever it is holding and then ends its turn. Flee. The target spends its turn moving away from you by the fastest available means. Grovel. The target has the Prone condition and then ends its turn. Halt. On its turn, the target doesn't move and takes no action or Bonus Action.",
    higherLevel: "You can affect one additional creature for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, the target obeys the chosen one-word command on its next turn.",
    scaling: "+1 target per slot level above 1st."
  },
  compelledDuel: {
    name: "Compelled Duel", level: 1, school: "Enchantment", classes: ["paladin"],
    time: "Bonus Action", range: "30 feet", components: "V", duration: "Concentration, up to 1 minute",
    text: "You try to compel a creature into a duel. One creature that you can see within range makes a Wisdom saving throw. On a failed save, the target has Disadvantage on attack rolls against creatures other than you, and it can't willingly move to a space that is more than 30 feet away from you. The spell ends if you make an attack roll against a creature other than the target, if you cast a spell on an enemy other than the target, if an ally of yours damages the target, or if you end your turn more than 30 feet away from the target.",
    roll: "save", saveAbility: "wis", damage: null, effect: "Target has Disadvantage attacking anyone but you and can't willingly move more than 30 ft. away from you.",
    scaling: "No change when cast with a higher-level slot."
  },
  comprehendLanguages: {
    name: "Comprehend Languages", level: 1, school: "Divination", classes: ["bard","sorcerer","warlock","wizard"], ritual: true,
    time: "Action or Ritual", range: "Self", components: "V, S, M (a pinch of soot and salt)", duration: "1 hour",
    text: "For the duration, you understand the literal meaning of any language that you hear or see signed. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text. This spell doesn't decode symbols or secret messages.",
    roll: "none", saveAbility: null, damage: null, effect: "Comprehension only, not fluency in speaking or writing; doesn't decode ciphers.",
    scaling: "No change when cast with a higher-level slot."
  },
  createOrDestroyWater: {
    name: "Create or Destroy Water", level: 1, school: "Transmutation", classes: ["cleric","druid"],
    time: "Action", range: "30 feet", components: "V, S, M (a mix of water and sand)", duration: "Instantaneous",
    text: "You do one of the following: Create Water. You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot Cube within range, extinguishing exposed flames there. Destroy Water. You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot Cube within range.",
    higherLevel: "You create or destroy 10 additional gallons of water, or the size of the Cube increases by 5 feet, for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only.",
    scaling: "+10 gallons created/destroyed, or the Cube's size +5 ft., per slot level above 1st."
  },
  cureWounds: {
    name: "Cure Wounds", level: 1, school: "Abjuration", classes: ["bard","cleric","druid","paladin","ranger"],
    time: "Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "A creature you touch regains a number of Hit Points equal to 2d8 plus your spellcasting ability modifier.",
    higherLevel: "The healing increases by 2d8 for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Heal 2d8 + spellcasting modifier; no note in the book of any Undead/Construct exclusion for this printing.",
    scaling: "+2d8 healing per slot level above 1st."
  },
  detectEvilAndGood: {
    name: "Detect Evil and Good", level: 1, school: "Divination", classes: ["cleric","paladin"],
    time: "Action", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes",
    text: "For the duration, you sense the location of any Aberration, Celestial, Elemental, Fey, Fiend, or Undead within 30 feet of yourself. You also sense whether the Hallow spell is active there and, if so, where. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only; blocked by stone/metal/lead barriers.",
    scaling: "No change when cast with a higher-level slot."
  },
  detectMagic: {
    name: "Detect Magic", level: 1, school: "Divination", classes: ["bard","cleric","druid","paladin","ranger","sorcerer","warlock","wizard"], ritual: true,
    time: "Action or Ritual", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes",
    text: "For the duration, you sense the presence of magical effects within 30 feet of yourself. If you sense such effects, you can take the Magic action to see a faint aura around any visible creature or object in the area that bears the magic, and if an effect was created by a spell, you learn the spell's school of magic. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only; blocked by stone/metal/lead barriers.",
    scaling: "No change when cast with a higher-level slot."
  },
  detectPoisonAndDisease: {
    name: "Detect Poison and Disease", level: 1, school: "Divination", classes: ["cleric","druid","paladin","ranger"], ritual: true,
    time: "Action or Ritual", range: "Self", components: "V, S, M (a yew leaf)", duration: "Concentration, up to 10 minutes",
    text: "For the duration, you sense the location of poisons, poisonous or venomous creatures, and magical contagions within 30 feet of yourself. You sense the kind of poison, creature, or contagion in each case. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
    roll: "none", saveAbility: null, damage: null, effect: "Detection only; blocked by stone/metal/lead barriers.",
    scaling: "No change when cast with a higher-level slot."
  },
  disguiseSelf: {
    name: "Disguise Self", level: 1, school: "Illusion", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S", duration: "1 hour",
    text: "You make yourself—including your clothing, armor, weapons, and other belongings on your person—look different until the spell ends. You can seem 1 foot shorter or taller and can appear heavier or lighter. You must adopt a form that has the same basic arrangement of limbs as you have. Otherwise, the extent of the illusion is up to you. The changes wrought by this spell fail to hold up to physical inspection. For example, if you use this spell to add a hat to your outfit, objects pass through the hat, and anyone who touches it would feel nothing. To discern that you are disguised, a creature must take the Study action to inspect your appearance and succeed on an Intelligence (Investigation) check against your spell save DC.",
    roll: "none", saveAbility: null, damage: null, effect: "Cosmetic illusion; an Investigation (Study action) check against your spell DC can reveal it.",
    scaling: "No change when cast with a higher-level slot."
  },
  dissonantWhispers: {
    name: "Dissonant Whispers", level: 1, school: "Enchantment", classes: ["bard"],
    time: "Action", range: "60 feet", components: "V", duration: "Instantaneous",
    text: "One creature of your choice that you can see within range hears a discordant melody in its mind. The target makes a Wisdom saving throw. On a failed save, it takes 3d6 Psychic damage and must immediately use its Reaction, if available, to move as far away from you as it can, using the safest route. On a successful save, the target takes half as much damage only.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: "3d6 Psychic", effect: "On a failure the target must use its Reaction to flee from you. Half damage on a success.",
    scaling: "+1d6 damage per slot level above 1st."
  },
  divineFavor: {
    name: "Divine Favor", level: 1, school: "Transmutation", classes: ["paladin"],
    time: "Bonus Action", range: "Self", components: "V, S", duration: "1 minute",
    text: "Until the spell ends, your attacks with weapons deal an extra 1d4 Radiant damage on a hit.",
    roll: "none", saveAbility: null, damage: "+1d4 Radiant on weapon hits", effect: "Applies to every weapon hit for the duration.",
    scaling: "No change when cast with a higher-level slot."
  },
  divineSmite: {
    name: "Divine Smite", level: 1, school: "Evocation", classes: ["paladin"],
    time: "Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike", range: "Self", components: "V", duration: "Instantaneous",
    text: "The target takes an extra 2d8 Radiant damage from the attack. The damage increases by 1d8 if the target is a Fiend or an Undead.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: "2d8 Radiant", effect: "Bonus Action after hitting: extra Radiant damage, +1d8 against Fiends and Undead.",
    scaling: "+1d8 damage per slot level above 1st."
  },
  ensnaringStrike: {
    name: "Ensnaring Strike", level: 1, school: "Conjuration", classes: ["ranger"],
    time: "Bonus Action, which you take immediately after hitting a creature with a weapon", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    text: "As you hit the target, grasping vines appear on it, and it makes a Strength saving throw. A Large or larger creature has Advantage on this save. On a failed save, the target has the Restrained condition until the spell ends. On a successful save, the vines shrivel away, and the spell ends. While Restrained, the target takes 1d6 Piercing damage at the start of each of its turns. The target or a creature within reach of it can take an action to make a Strength (Athletics) check against your spell save DC. On a success, the spell ends.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "save", saveAbility: "str", damage: "1d6 Piercing", effect: "Bonus Action after hitting: target is Restrained and takes 1d6 Piercing each turn; Large or bigger targets have Advantage on the save.",
    scaling: "+1d6 damage per slot level above 1st."
  },
  entangle: {
    name: "Entangle", level: 1, school: "Conjuration", classes: ["druid","ranger"],
    time: "Action", range: "90 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "Grasping plants sprout from the ground in a 20-foot square within range. For the duration, these plants turn the ground in the area into Difficult Terrain. They disappear when the spell ends. Each creature (other than you) in the area when you cast the spell must succeed on a Strength saving throw or have the Restrained condition until the spell ends. A Restrained creature can take an action to make a Strength (Athletics) check against your spell save DC. On a success, it frees itself from the grasping plants and is no longer Restrained by them.",
    roll: "save", saveAbility: "str", damage: null, effect: "On a failed save, Restrained for the duration (Strength/Athletics check to escape); area becomes Difficult Terrain.",
    scaling: "No change when cast with a higher-level slot."
  },
  expeditiousRetreat: {
    name: "Expeditious Retreat", level: 1, school: "Transmutation", classes: ["sorcerer","warlock","wizard"],
    time: "Bonus Action", range: "Self", components: "V, S", duration: "Concentration, up to 10 minutes",
    text: "You take the Dash action, and until the spell ends, you can take that action again as a Bonus Action.",
    roll: "none", saveAbility: null, damage: null, effect: "Dash now, then Dash as a Bonus Action each turn.",
    scaling: "No change when cast with a higher-level slot."
  },
  faerieFire: {
    name: "Faerie Fire", level: 1, school: "Evocation", classes: ["bard","druid"],
    time: "Action", range: "60 feet", components: "V", duration: "Concentration, up to 1 minute",
    text: "Objects in a 20-foot Cube within range are outlined in blue, green, or violet light (your choice). Each creature in the Cube is also outlined if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed Dim Light in a 10-foot radius and can't benefit from the Invisible condition. Attack rolls against an affected creature or object have Advantage if the attacker can see it.",
    roll: "save", saveAbility: "dex", damage: null, effect: "On a failed save, outlined for the duration: attacks against it have Advantage, and it can't benefit from Invisible.",
    scaling: "No change when cast with a higher-level slot."
  },
  falseLife: {
    name: "False Life", level: 1, school: "Necromancy", classes: ["sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S, M (a drop of alcohol)", duration: "Instantaneous",
    text: "You gain 2d4 + 4 Temporary Hit Points.",
    higherLevel: "You gain 5 additional Temporary Hit Points for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Gain 2d4 + 4 Temporary HP.",
    scaling: "+5 Temporary HP per slot level above 1st."
  },
  featherFall: {
    name: "Feather Fall", level: 1, school: "Transmutation", classes: ["bard","sorcerer","wizard"],
    time: "Reaction, which you take when you or a creature you can see within 60 feet of you falls", range: "60 feet", components: "V, M (a small feather or piece of down)", duration: "1 minute",
    text: "Choose up to five falling creatures within range. A falling creature's rate of descent slows to 60 feet per round until the spell ends. If a creature lands before the spell ends, the creature takes no damage from the fall, and the spell ends for that creature.",
    roll: "none", saveAbility: null, damage: null, effect: "Fall damage negated for up to 5 affected creatures for the duration.",
    scaling: "No change when cast with a higher-level slot."
  },
  findFamiliar: {
    name: "Find Familiar", level: 1, school: "Conjuration", classes: ["wizard"], ritual: true,
    time: "1 hour or Ritual", range: "10 feet", components: "V, S, M (burning incense worth 10+ GP, which the spell consumes)", duration: "Instantaneous",
    text: "You gain the service of a familiar, a spirit that takes an animal form you choose: Bat, Cat, Frog, Hawk, Lizard, Octopus, Owl, Rat, Raven, Spider, Weasel, or another Beast that has a Challenge Rating of 0. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form (see appendix B), though it is a Celestial, Fey, or Fiend (your choice) instead of a Beast. Your familiar acts independently of you, but it obeys your commands. Telepathic Connection. While your familiar is within 100 feet of you, you can communicate with it telepathically. Additionally, as a Bonus Action, you can see through the familiar's eyes and hear what it hears until the start of your next turn, gaining the benefits of any special senses it has. Finally, when you cast a spell with a range of touch, your familiar can deliver the touch. Your familiar must be within 100 feet of you, and it must take a Reaction to deliver the touch when you cast the spell. Combat. The familiar is an ally to you and your allies. It rolls its own Initiative and acts on its own turn. A familiar can't attack, but it can take other actions as normal. Disappearance of the Familiar. When the familiar drops to 0 Hit Points, it disappears. It reappears after you cast this spell again. As a Magic action, you can temporarily dismiss the familiar to a pocket dimension. Alternatively, you can dismiss it forever. As a Magic action while it is temporarily dismissed, you can cause it to reappear in an unoccupied space within 30 feet of you. Whenever the familiar drops to 0 Hit Points or disappears into the pocket dimension, it leaves behind in its space anything it was wearing or carrying. One Familiar Only. You can't have more than one familiar at a time. If you cast this spell while you have a familiar, you instead cause it to adopt a new eligible form.",
    roll: "none", saveAbility: null, damage: null, effect: "Grants a scouting/utility companion; can't attack; you can see/hear through it as a Bonus Action.",
    scaling: "No change when cast with a higher-level slot."
  },
  fogCloud: {
    name: "Fog Cloud", level: 1, school: "Conjuration", classes: ["druid","ranger","sorcerer","wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Concentration, up to 1 hour",
    text: "You create a 20-foot-radius Sphere of fog centered on a point within range. The Sphere is Heavily Obscured. It lasts for the duration or until a strong wind (such as one created by Gust of Wind) disperses it.",
    higherLevel: "The fog's radius increases by 20 feet for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Battlefield-control obscurement; no damage.",
    scaling: "Radius +20 ft. per slot level above 1st."
  },
  goodberry: {
    name: "Goodberry", level: 1, school: "Conjuration", classes: ["druid","ranger"],
    time: "Action", range: "Self", components: "V, S, M (a sprig of mistletoe)", duration: "24 hours",
    text: "Ten berries appear in your hand and are infused with magic for the duration. A creature can take a Bonus Action to eat one berry. Eating a berry restores 1 Hit Point, and the berry provides enough nourishment to sustain a creature for one day. Uneaten berries disappear when the spell ends.",
    roll: "none", saveAbility: null, damage: null, effect: "Minor healing (1 HP each) plus a day's food per berry, not a combat heal.",
    scaling: "No change when cast with a higher-level slot."
  },
  grease: {
    name: "Grease", level: 1, school: "Conjuration", classes: ["sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a bit of pork rind or butter)", duration: "1 minute",
    text: "Nonflammable grease covers the ground in a 10-foot square centered on a point within range and turns it into Difficult Terrain for the duration. When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or have the Prone condition. A creature that enters the area or ends its turn there must also succeed on that save or fall Prone.",
    roll: "save", saveAbility: "dex", damage: null, effect: "10-ft. square of Difficult Terrain; creatures in it fall Prone on a failed save.",
    scaling: "No change when cast with a higher-level slot."
  },
  guidingBolt: {
    name: "Guiding Bolt", level: 1, school: "Evocation", classes: ["cleric"],
    time: "Action", range: "120 feet", components: "V, S", duration: "1 round",
    text: "You hurl a bolt of light toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 4d6 Radiant damage, and the next attack roll made against it before the end of your next turn has Advantage.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "attack", saveAbility: null, damage: "4d6 Radiant", effect: "The next attack roll against the target before the end of your next turn has Advantage.",
    scaling: "+1d6 per slot level above 1st."
  },
  hailOfThorns: {
    name: "Hail of Thorns", level: 1, school: "Conjuration", classes: ["ranger"],
    time: "Bonus Action, which you take immediately after hitting a creature with a Ranged weapon", range: "Self", components: "V", duration: "Instantaneous",
    text: "As you hit the creature, this spell creates a rain of thorns that sprouts from your Ranged weapon or ammunition. The target of the attack and each creature within 5 feet of it make a Dexterity saving throw, taking 1d10 Piercing damage on a failed save or half as much damage on a successful one.",
    higherLevel: "The damage increases by 1d10 for each spell slot level above 1.",
    roll: "save", saveAbility: "dex", damage: "1d10 Piercing", effect: "Bonus Action after a ranged hit: the target and creatures within 5 ft. of it save. Half damage on a success.",
    scaling: "+1d10 damage per slot level above 1st."
  },
  healingWord: {
    name: "Healing Word", level: 1, school: "Abjuration", classes: ["bard","cleric","druid"],
    time: "Bonus Action", range: "60 feet", components: "V", duration: "Instantaneous",
    text: "A creature of your choice that you can see within range regains Hit Points equal to 2d4 plus your spellcasting ability modifier.",
    higherLevel: "The healing increases by 2d4 for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Heal 2d4 + spellcasting modifier; Bonus Action, so it's fast but smaller than Cure Wounds.",
    scaling: "+2d4 healing per slot level above 1st."
  },
  hellishRebuke: {
    name: "Hellish Rebuke", level: 1, school: "Evocation", classes: ["warlock"],
    time: "Reaction, which you take in response to taking damage from a creature that you can see within 60 feet of yourself", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "The creature that damaged you is momentarily surrounded by green flames. It makes a Dexterity saving throw, taking 2d10 Fire damage on a failed save or half as much damage on a successful one.",
    higherLevel: "The damage increases by 1d10 for each spell slot level above 1.",
    roll: "save", saveAbility: "dex", damage: "2d10 Fire", effect: "Reaction when a creature damages you. Half damage on a success.",
    scaling: "+1d10 damage per slot level above 1st."
  },
  heroism: {
    name: "Heroism", level: 1, school: "Enchantment", classes: ["bard","paladin"],
    time: "Action", range: "Touch", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "A willing creature you touch is imbued with bravery. Until the spell ends, the creature is immune to the Frightened condition and gains Temporary Hit Points equal to your spellcasting ability modifier at the start of each of its turns.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Immune to Frightened; gains Temporary HP = spellcasting modifier at the start of each of its turns.",
    scaling: "+1 target per slot level above 1st."
  },
  hex: {
    name: "Hex", level: 1, school: "Enchantment", classes: ["warlock"],
    time: "Bonus Action", range: "90 feet", components: "V, S, M (the petrified eye of a newt)", duration: "Concentration, up to 1 hour",
    text: "You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 Necrotic damage to the target whenever you hit it with an attack roll. Also, choose one ability when you cast the spell. The target has Disadvantage on ability checks made with the chosen ability. If the target drops to 0 Hit Points before this spell ends, you can take a Bonus Action on a later turn to curse a new creature.",
    higherLevel: "Your Concentration can last longer with a spell slot of level 2 (up to 4 hours), 3–4 (up to 8 hours), or 5+ (24 hours).",
    roll: "none", saveAbility: null, damage: "1d6 Necrotic", effect: "Extra 1d6 Necrotic on each of your hits against the target, and Disadvantage on checks with one ability; move it to a new target when the old one drops to 0 HP.",
    scaling: "Your Concentration can last longer with a spell slot of level 2 (up to 4 hours), 3–4 (up to 8 hours), or 5+ (24 hours)."
  },
  huntersMark: {
    name: "Hunter's Mark", level: 1, school: "Divination", classes: ["ranger"],
    time: "Bonus Action", range: "90 feet", components: "V", duration: "Concentration, up to 1 hour",
    text: "You magically mark one creature you can see within range as your quarry. Until the spell ends, you deal an extra 1d6 Force damage to the target whenever you hit it with an attack roll. You also have Advantage on any Wisdom (Perception or Survival) check you make to find it. If the target drops to 0 Hit Points before this spell ends, you can take a Bonus Action to move the mark to a new creature you can see within range.",
    higherLevel: "Your Concentration can last longer with a spell slot of level 3–4 (up to 8 hours) or 5+ (up to 24 hours).",
    roll: "none", saveAbility: null, damage: "+1d6 Force on weapon hits against the marked target", effect: "Advantage on Wisdom (Perception/Survival) to find the target; can be re-marked on a new target if the first drops.",
    scaling: "Doesn't add damage — a higher slot only extends how long you can Concentrate on it (up to 8 hours at 3rd-4th, 24 hours at 5th+)."
  },
  iceKnife: {
    name: "Ice Knife", level: 1, school: "Conjuration", classes: ["druid","sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "S, M (a drop of water or a piece of ice)", duration: "Instantaneous",
    text: "You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 Piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 Cold damage.",
    higherLevel: "The Cold damage increases by 1d6 for each spell slot level above 1.",
    roll: "attack", saveAbility: null, damage: "1d10 Piercing", effect: "1d10 Piercing on a hit, then the shard bursts: target and creatures within 5 ft. save against 2d6 Cold.",
    scaling: "+1d6 Cold damage per slot level above 1st."
  },
  identify: {
    name: "Identify", level: 1, school: "Divination", classes: ["bard","wizard"], ritual: true,
    time: "1 minute or Ritual", range: "Touch", components: "V, S, M (a pearl worth 100+ GP)", duration: "Instantaneous",
    text: "You touch an object throughout the spell's casting. If the object is a magic item or some other magical object, you learn its properties and how to use them, whether it requires Attunement, and how many charges it has, if any. You learn whether any ongoing spells are affecting the item and what they are. If the item was created by a spell, you learn that spell's name. If you instead touch a creature throughout the casting, you learn which ongoing spells, if any, are currently affecting it.",
    roll: "none", saveAbility: null, damage: null, effect: "Pure information about one item's (or creature's) magic.",
    scaling: "No change when cast with a higher-level slot."
  },
  illusoryScript: {
    name: "Illusory Script", level: 1, school: "Illusion", classes: ["bard","warlock","wizard"], ritual: true,
    time: "1 minute or Ritual", range: "Touch", components: "S, M (ink worth 10+ GP, which the spell consumes)", duration: "10 days",
    text: "You write on parchment, paper, or another suitable material and imbue it with an illusion that lasts for the duration. To you and any creatures you designate when you cast the spell, the writing appears normal, seems to be written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown or magical script that is unintelligible. Alternatively, the illusion can alter the meaning, handwriting, and language of the text, though the language must be one you know. If the spell is dispelled, the original script and the illusion both disappear. A creature that has Truesight can read the hidden message.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility/deception only.",
    scaling: "No change when cast with a higher-level slot."
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
    name: "Jump", level: 1, school: "Transmutation", classes: ["druid","ranger","sorcerer","wizard"],
    time: "Bonus Action", range: "Touch", components: "V, S, M (a grasshopper's hind leg)", duration: "1 minute",
    text: "You touch a willing creature. Once on each of its turns until the spell ends, that creature can jump up to 30 feet by spending 10 feet of movement.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "Movement utility only.",
    scaling: "+1 target per slot level above 1st."
  },
  longstrider: {
    name: "Longstrider", level: 1, school: "Transmutation", classes: ["bard","druid","ranger","wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a pinch of dirt)", duration: "1 hour",
    text: "You touch a creature. The target's Speed increases by 10 feet until the spell ends.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: null, effect: "+10 ft. Speed for the duration.",
    scaling: "+1 target per slot level above 1st."
  },
  mageArmor: {
    name: "Mage Armor", level: 1, school: "Abjuration", classes: ["sorcerer","wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a piece of cured leather)", duration: "8 hours",
    text: "You touch a willing creature who isn't wearing armor. Until the spell ends, the target's base AC becomes 13 plus its Dexterity modifier. The spell ends early if the target dons armor.",
    roll: "none", saveAbility: null, damage: null, effect: "AC becomes 13 + Dex modifier for the duration.",
    scaling: "No change when cast with a higher-level slot."
  },
  magicMissile: {
    name: "Magic Missile", level: 1, school: "Evocation", classes: ["sorcerer","wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You create three glowing darts of magical force. Each dart strikes a creature of your choice that you can see within range. A dart deals 1d4 + 1 Force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.",
    higherLevel: "The spell creates one more dart for each spell slot level above 1.",
    roll: "none", saveAbility: null, damage: "1d4+1 Force per dart (3 darts)", effect: "No attack roll — the darts never miss.",
    scaling: "+1 dart per slot level above 1st."
  },
  protectionFromEvilAndGood: {
    name: "Protection from Evil and Good", level: 1, school: "Abjuration", classes: ["cleric","druid","paladin","warlock","wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a flask of Holy Water worth 25+ GP, which the spell consumes)", duration: "Concentration, up to 10 minutes",
    text: "Until the spell ends, one willing creature you touch is protected against creatures that are Aberrations, Celestials, Elementals, Fey, Fiends, or Undead. The protection grants several benefits. Creatures of those types have Disadvantage on attack rolls against the target. The target also can't be possessed by or gain the Charmed or Frightened conditions from them. If the target is already possessed, Charmed, or Frightened by such a creature, the target has Advantage on any new saving throw against the relevant effect.",
    roll: "none", saveAbility: null, damage: null, effect: "Named creature types have Disadvantage attacking the target; target resists their Charm/Fright/possession.",
    scaling: "No change when cast with a higher-level slot."
  },
  purifyFoodAndDrink: {
    name: "Purify Food and Drink", level: 1, school: "Transmutation", classes: ["cleric","druid","paladin"], ritual: true,
    time: "Action or Ritual", range: "10 feet", components: "V, S", duration: "Instantaneous",
    text: "You remove poison and rot from nonmagical food and drink in a 5-foot-radius Sphere centered on a point within range.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only.",
    scaling: "No change when cast with a higher-level slot."
  },
  rayOfSickness: {
    name: "Ray of Sickness", level: 1, school: "Necromancy", classes: ["sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
    text: "You shoot a greenish ray at a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 2d8 Poison damage and has the Poisoned condition until the end of your next turn.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 1.",
    roll: "attack", saveAbility: null, damage: "2d8 Poison", effect: "On a hit the target is also Poisoned until the end of your next turn.",
    scaling: "+1d8 damage per slot level above 1st."
  },
  sanctuary: {
    name: "Sanctuary", level: 1, school: "Abjuration", classes: ["cleric"],
    time: "Bonus Action", range: "30 feet", components: "V, S, M (a shard of glass from a mirror)", duration: "1 minute",
    text: "You ward a creature within range. Until the spell ends, any creature who targets the warded creature with an attack roll or a damaging spell must succeed on a Wisdom saving throw or either choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from areas of effect. The spell ends if the warded creature makes an attack roll, casts a spell, or deals damage.",
    roll: "save", saveAbility: "wis", damage: null, effect: "Attacker fails the save → must retarget or lose the attack/spell; doesn't stop area effects; ends if the warded creature acts aggressively.",
    scaling: "No change when cast with a higher-level slot."
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
    name: "Shield", level: 1, school: "Abjuration", classes: ["sorcerer","wizard"],
    time: "Reaction, which you take when you are hit by an attack roll or targeted by the Magic Missile spell", range: "Self", components: "V, S", duration: "1 round",
    text: "An imperceptible barrier of magical force protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from Magic Missile.",
    roll: "none", saveAbility: null, damage: null, effect: "+5 AC until the start of your next turn (including the triggering attack); immune to Magic Missile.",
    scaling: "No change when cast with a higher-level slot."
  },
  shieldOfFaith: {
    name: "Shield of Faith", level: 1, school: "Abjuration", classes: ["cleric","paladin"],
    time: "Bonus Action", range: "60 feet", components: "V, S, M (a prayer scroll)", duration: "Concentration, up to 10 minutes",
    text: "A shimmering field surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
    roll: "none", saveAbility: null, damage: null, effect: "+2 AC for the duration.",
    scaling: "No change when cast with a higher-level slot."
  },
  silentImage: {
    name: "Silent Image", level: 1, school: "Illusion", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a bit of fleece)", duration: "Concentration, up to 10 minutes",
    text: "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot Cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn't accompanied by sound, smell, or other sensory effects. As a Magic action, you can cause the image to move to any spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image. For example, if you create an image of a creature and move it, you can alter the image so that it appears to be walking. Physical interaction with the image reveals it to be an illusion, since things can pass through it. A creature that takes a Study action to examine the image can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the creature can see through the image.",
    roll: "none", saveAbility: null, damage: null, effect: "No sound; an Investigation check against your spell DC reveals it as an illusion.",
    scaling: "No change when cast with a higher-level slot."
  },
  sleep: {
    name: "Sleep", level: 1, school: "Enchantment", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a pinch of sand or rose petals)", duration: "Concentration, up to 1 minute",
    text: "Each creature of your choice in a 5-foot-radius Sphere centered on a point within range must succeed on a Wisdom saving throw or have the Incapacitated condition until the end of its next turn, at which point it must repeat the save. If the target fails the second save, the target has the Unconscious condition for the duration. The spell ends on a target if it takes damage or someone within 5 feet of it takes an action to shake it out of the spell's effect. Creatures that don't sleep, such as elves, or that have Immunity to the Exhaustion condition automatically succeed on saves against this spell.",
    roll: "save", saveAbility: "wis", damage: null, effect: "Fail once: Incapacitated until end of next turn, then re-save. Fail twice in a row: Unconscious for the duration. Damage or a helper's action ends it early. Elves and Exhaustion-immune creatures auto-succeed.",
    scaling: "No change when cast with a higher-level slot."
  },
  speakWithAnimals: {
    name: "Speak with Animals", level: 1, school: "Divination", classes: ["bard","druid","ranger","warlock"], ritual: true,
    time: "Action or Ritual", range: "Self", components: "V, S", duration: "10 minutes",
    text: "For the duration, you can comprehend and verbally communicate with Beasts, and you can use any of the Influence action's skill options with them. Most Beasts have little to say about topics that don't pertain to survival or companionship, but at minimum, a Beast can give you information about nearby locations and monsters, including whatever it has perceived within the past day.",
    roll: "none", saveAbility: null, damage: null, effect: "Communication only; doesn't make beasts friendly.",
    scaling: "No change when cast with a higher-level slot."
  },
  tashasHideousLaughter: {
    name: "Tasha's Hideous Laughter", level: 1, school: "Enchantment", classes: ["bard","warlock","wizard"],
    time: "Action", range: "30 feet", components: "V, S, M (a tart and a feather)", duration: "Concentration, up to 1 minute",
    text: "One creature of your choice that you can see within range makes a Wisdom saving throw. On a failed save, it has the Prone and Incapacitated conditions for the duration. During that time, it laughs uncontrollably if it's capable of laughter, and it can't end the Prone condition on itself. At the end of each of its turns and each time it takes damage, it makes another Wisdom saving throw. The target has Advantage on the save if the save is triggered by damage. On a successful save, the spell ends.",
    higherLevel: "You can target one additional creature for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: null, effect: "On a failed save, Prone + Incapacitated for the duration; re-saves each turn/on damage (Advantage if from damage).",
    scaling: "+1 target per slot level above 1st."
  },
  tensersFloatingDisk: {
    name: "Tenser's Floating Disk", level: 1, school: "Conjuration", classes: ["wizard"], ritual: true,
    time: "Action or Ritual", range: "30 feet", components: "V, S, M (a drop of mercury)", duration: "1 hour",
    text: "This spell creates a circular, horizontal plane of force, 3 feet in diameter and 1 inch thick, that floats 3 feet above the ground in an unoccupied space of your choice that you can see within range. The disk remains for the duration and can hold up to 500 pounds. If more weight is placed on it, the spell ends, and everything on the disk falls to the ground. The disk is immobile while you are within 20 feet of it. If you move more than 20 feet away from it, the disk follows you so that it remains within 20 feet of you. It can move across uneven terrain, up or down stairs, slopes and the like, but it can't cross an elevation change of 10 feet or more. For example, the disk can't move across a 10-foot-deep pit, nor could it leave such a pit if it was created at the bottom. If you move more than 100 feet from the disk (typically because it can't move around an obstacle to follow you), the spell ends.",
    roll: "none", saveAbility: null, damage: null, effect: "Hauling utility only, up to 500 lb.",
    scaling: "No change when cast with a higher-level slot."
  },
  thunderousSmite: {
    name: "Thunderous Smite", level: 1, school: "Evocation", classes: ["paladin"],
    time: "Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike", range: "Self", components: "V", duration: "Instantaneous",
    text: "Your strike rings with thunder that is audible within 300 feet of you, and the target takes an extra 2d6 Thunder damage from the attack. Additionally, if the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and have the Prone condition.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "save", saveAbility: "str", damage: "2d6 Thunder", effect: "Bonus Action after hitting: extra Thunder damage; a creature failing the save is pushed 10 ft. and knocked Prone.",
    scaling: "+1d6 damage per slot level above 1st."
  },
  thunderwave: {
    name: "Thunderwave", level: 1, school: "Evocation", classes: ["bard","druid","sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S", duration: "Instantaneous",
    text: "You unleash a wave of thunderous energy. Each creature in a 15-foot Cube originating from you makes a Constitution saving throw. On a failed save, a creature takes 2d8 Thunder damage and is pushed 10 feet away from you. On a successful save, a creature takes half as much damage only. In addition, unsecured objects that are entirely within the Cube are pushed 10 feet away from you, and a thunderous boom is audible within 300 feet.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 1.",
    roll: "save", saveAbility: "con", damage: "2d8 Thunder", effect: "On a failed save the target is also pushed 10 ft. away from you; unsecured objects in the area are pushed 10 ft. too.",
    scaling: "+1d8 per slot level above 1st."
  },
  unseenServant: {
    name: "Unseen Servant", level: 1, school: "Conjuration", classes: ["bard","warlock","wizard"], ritual: true,
    time: "Action or Ritual", range: "60 feet", components: "V, S, M (a bit of string and of wood)", duration: "1 hour",
    text: "This spell creates an Invisible, mindless, shapeless, Medium force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 Hit Point, and a Strength of 2, and it can't attack. If it drops to 0 Hit Points, the spell ends. Once on each of your turns as a Bonus Action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring drinks. Once you give the command, the servant performs the task to the best of its ability until it completes the task, then waits for your next command. If you command the servant to perform a task that would move it more than 60 feet away from you, the spell ends.",
    roll: "none", saveAbility: null, damage: null, effect: "Utility only; AC 10, 1 HP, Str 2, can't attack.",
    scaling: "No change when cast with a higher-level slot."
  },
  witchBolt: {
    name: "Witch Bolt", level: 1, school: "Evocation", classes: ["sorcerer","warlock","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a twig struck by lightning)", duration: "Concentration, up to 1 minute",
    text: "A beam of crackling energy lances toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against it. On a hit, the target takes 2d12 Lightning damage. On each of your subsequent turns, you can take a Bonus Action to deal 1d12 Lightning damage to the target automatically, even if the first attack missed. The spell ends if the target is ever outside the spell's range or if it has Total Cover from you.",
    higherLevel: "The initial damage increases by 1d12 for each spell slot level above 1.",
    roll: "attack", saveAbility: null, damage: "2d12 Lightning on the initial hit, then 1d12 (Bonus Action, each of your later turns)", effect: "The follow-up damage needs a Bonus Action each turn — it isn't automatic upkeep; ends if the target leaves range or gets Total Cover.",
    scaling: "+1d12 to the initial hit per slot level above 1st (the Bonus-Action follow-up damage doesn't increase)."
  },
  wrathfulSmite: {
    name: "Wrathful Smite", level: 1, school: "Necromancy", classes: ["paladin"],
    time: "Bonus Action, which you take immediately after hitting a creature with a Melee weapon or an Unarmed Strike", range: "Self", components: "V", duration: "1 minute",
    text: "The target takes an extra 1d6 Necrotic damage from the attack, and it must succeed on a Wisdom saving throw or have the Frightened condition until the spell ends. At the end of each of its turns, the Frightened target repeats the save, ending the spell on itself on a success.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 1.",
    roll: "save", saveAbility: "wis", damage: "1d6 Necrotic", effect: "Bonus Action after hitting: extra Necrotic damage, and the target is Frightened on a failed save (it repeats the save each turn).",
    scaling: "+1d6 damage per slot level above 1st."
  },

  /* ---------------- Level 2 ---------------- */
  aid: {
    name: "Aid", level: 2, school: "Abjuration", classes: ["bard","cleric","druid","paladin","ranger"],
    time: "Action", range: "30 feet", components: "V, S, M (a strip of white cloth)", duration: "8 hours",
    text: "Choose up to three creatures within range. Each target's Hit Point maximum and current Hit Points increase by 5 for the duration.",
    higherLevel: "Each target's Hit Points increase by 5 for each spell slot level above 2.",
    roll: "none", saveAbility: null, damage: null, effect: "Up to three creatures gain +5 to current and maximum Hit Points for 8 hours.",
    scaling: "Each target's Hit Points increase by 5 for each spell slot level above 2."
  },
  alterSelf: {
    name: "Alter Self", level: 2, school: "Transmutation", classes: ["sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S", duration: "Concentration, up to 1 hour",
    text: "You alter your physical form. Choose one of the following options. Its effects last for the duration, during which you can take a Magic action to replace the option you chose with a different one. Aquatic Adaptation. You sprout gills and grow webs between your fingers. You can breathe underwater and gain a Swim Speed equal to your Speed. Change Appearance. You alter your appearance. You decide what you look like, including your height, weight, facial features, sound of your voice, hair length, coloration, and other distinguishing characteristics. You can make yourself appear as a member of another species, though none of your statistics change. You can't appear as a creature of a different size, and your basic shape stays the same; if you're bipedal, you can't use this spell to become quadrupedal, for instance. For the duration, you can take a Magic action to change your appearance in this way again. Natural Weapons. You grow claws (Slashing), fangs (Piercing), horns (Piercing), or hooves (Bludgeoning). When you use your Unarmed Strike to deal damage with that new growth, it deals 1d6 damage of the type in parentheses instead of dealing the normal damage for your Unarmed Strike, and you use your spellcasting ability modifier for the attack and damage rolls rather than using Strength.",
    roll: "none", saveAbility: null, damage: null, effect: "Choose aquatic adaptation, changed appearance, or natural weapons; switch between them as a Magic action.",
    scaling: "No change when cast with a higher-level slot."
  },
  animalMessenger: {
    name: "Animal Messenger", level: 2, school: "Enchantment", classes: ["bard","druid","ranger"], ritual: true,
    time: "Action or Ritual", range: "30 feet", components: "V, S, M (a morsel of food)", duration: "24 hours",
    text: "A Tiny Beast of your choice that you can see within range must succeed on a Charisma saving throw, or it attempts to deliver a message for you (if the target's Challenge Rating isn't 0, it automatically succeeds). You specify a location you have visited and a recipient who matches a general description, such as \"a person dressed in the uniform of the town guard\" or \"a red-haired dwarf wearing a pointed hat.\" You also communicate a message of up to twenty-five words. The Beast travels for the duration toward the specified location, covering about 25 miles per 24 hours or 50 miles if the Beast can fly. When the Beast arrives, it delivers your message to the creature that you described, mimicking your communication. If the Beast doesn't reach its destination before the spell ends, the message is lost, and the Beast returns to where you cast the spell.",
    higherLevel: "The spell's duration increases by 48 hours for each spell slot level above 2.",
    roll: "save", saveAbility: "cha", damage: null, effect: "A Tiny Beast carries a message of up to 25 words to a recipient at a place you've visited.",
    scaling: "The spell's duration increases by 48 hours for each spell slot level above 2."
  },
  arcaneLock: {
    name: "Arcane Lock", level: 2, school: "Abjuration", classes: ["wizard"],
    time: "Action", range: "Touch", components: "V, S, M (gold dust worth 25+ GP, which the spell consumes)", duration: "Until dispelled",
    text: "You touch a closed door, window, gate, container, or hatch and magically lock it for the duration. This lock can't be unlocked by any nonmagical means. You and any creatures you designate when you cast the spell can open and close the object despite the lock. You can also set a password that, when spoken within 5 feet of the object, unlocks it for 1 minute.",
    roll: "none", saveAbility: null, damage: null, effect: "Magically locks a door, window, or container; others need a DC +10 to break it or pick it.",
    scaling: "No change when cast with a higher-level slot."
  },
  arcaneVigor: {
    name: "Arcane Vigor", level: 2, school: "Abjuration", classes: ["sorcerer","wizard"],
    time: "Bonus Action", range: "Self", components: "V, S", duration: "Instantaneous",
    text: "You tap into your life force to heal yourself. Roll one or two of your unexpended Hit Point Dice, and regain a number of Hit Points equal to the roll's total plus your spellcasting ability modifier. Those dice are then expended.",
    higherLevel: "The number of unexpended Hit Dice you can roll increases by one for each spell slot level above 2.",
    roll: "none", saveAbility: null, damage: null, effect: "Spend one or two Hit Point Dice and heal their total plus your spellcasting modifier.",
    scaling: "The number of unexpended Hit Dice you can roll increases by one for each spell slot level above 2."
  },
  augury: {
    name: "Augury", level: 2, school: "Divination", classes: ["cleric","druid","wizard"], ritual: true,
    time: "1 minute or Ritual", range: "Self", components: "V, S, M (specially marked sticks, bones, cards, or other divinatory tokens worth 25+ GP)", duration: "Instantaneous",
    text: "You receive an omen from an otherworldly entity about the results of a course of action that you plan to take within the next 30 minutes. The DM chooses the omen from the Omens table. Omens: Weal (results will be good), Woe (bad), Weal and woe (good and bad), or Indifference (neither good nor bad). The spell doesn't account for circumstances, such as other spells, that might change the results. If you cast the spell more than once before finishing a Long Rest, there is a cumulative 25 percent chance for each casting after the first that you get no answer.",
    roll: "none", saveAbility: null, damage: null, effect: "Get an omen (weal, woe, both, or neither) about a plan within the next 30 minutes.",
    scaling: "No change when cast with a higher-level slot."
  },
  barkskin: {
    name: "Barkskin", level: 2, school: "Transmutation", classes: ["druid","ranger"],
    time: "Bonus Action", range: "Touch", components: "V, S, M (a handful of bark)", duration: "1 hour",
    text: "You touch a willing creature. Until the spell ends, the target's skin assumes a bark-like appearance, and the target has an Armor Class of 17 if its AC is lower than that.",
    roll: "none", saveAbility: null, damage: null, effect: "A willing creature's AC can't be lower than 17.",
    scaling: "No change when cast with a higher-level slot."
  },
  beastSense: {
    name: "Beast Sense", level: 2, school: "Divination", classes: ["druid","ranger"], ritual: true,
    time: "Action or Ritual", range: "Touch", components: "S", duration: "Concentration, up to 1 hour",
    text: "You touch a willing Beast. For the duration, you can perceive through the Beast's senses as well as your own. When perceiving through the Beast's senses, you benefit from any special senses it has.",
    roll: "none", saveAbility: null, damage: null, effect: "Perceive through a willing Beast's senses.",
    scaling: "No change when cast with a higher-level slot."
  },
  blindnessDeafness: {
    name: "Blindness/Deafness", level: 2, school: "Transmutation", classes: ["bard","cleric","sorcerer","wizard"],
    time: "Action", range: "120 feet", components: "V", duration: "1 minute",
    text: "One creature that you can see within range must succeed on a Constitution saving throw, or it has the Blinded or Deafened condition (your choice) for the duration. At the end of each of its turns, the target repeats the save, ending the spell on itself on a success.",
    higherLevel: "You can target one additional creature for each spell slot level above 2.",
    roll: "save", saveAbility: "con", damage: null, effect: "Target is Blinded or Deafened (your choice), repeating the save each turn.",
    scaling: "+1 target per slot level above 2nd."
  },
  blur: {
    name: "Blur", level: 2, school: "Illusion", classes: ["sorcerer","wizard"],
    time: "Action", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    text: "Your body becomes blurred. For the duration, any creature has Disadvantage on attack rolls against you. An attacker is immune to this effect if it perceives you with Blindsight or Truesight.",
    roll: "none", saveAbility: null, damage: null, effect: "Attackers have Disadvantage against you unless they have Blindsight or Truesight.",
    scaling: "No change when cast with a higher-level slot."
  },
  calmEmotions: {
    name: "Calm Emotions", level: 2, school: "Enchantment", classes: ["bard","cleric"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "Each Humanoid in a 20-foot-radius Sphere centered on a point you choose within range must succeed on a Charisma saving throw or be affected by one of the following effects (choose for each creature): The creature has Immunity to the Charmed and Frightened conditions until the spell ends. If the creature was already Charmed or Frightened, those conditions are suppressed for the duration. The creature becomes Indifferent about creatures of your choice that it's Hostile toward. This indifference ends if the target takes damage or witnesses its allies taking damage. When the spell ends, the creature's attitude returns to normal.",
    roll: "save", saveAbility: "cha", damage: null, effect: "Humanoids in a 20-ft. Sphere either become immune to Charmed and Frightened, or stop being Hostile toward chosen creatures.",
    scaling: "No change when cast with a higher-level slot."
  },
  cloudOfDaggers: {
    name: "Cloud of Daggers", level: 2, school: "Conjuration", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a sliver of glass)", duration: "Concentration, up to 1 minute",
    text: "You conjure spinning daggers in a 5-foot Cube centered on a point within range. Each creature in that area takes 4d4 Slashing damage. A creature also takes this damage if it enters the Cube or ends its turn there or if the Cube moves into its space. A creature takes this damage only once per turn. On your later turns, you can take a Magic action to teleport the Cube up to 30 feet.",
    higherLevel: "The damage increases by 2d4 for each spell slot level above 2.",
    roll: "none", saveAbility: null, damage: "4d4 Slashing", effect: "A 5-ft. Cube of daggers damages anyone in it or entering it; move it as a Magic action.",
    scaling: "+2d4 damage per slot level above 2nd."
  },
  continualFlame: {
    name: "Continual Flame", level: 2, school: "Evocation", classes: ["cleric","druid","wizard"],
    time: "Action", range: "Touch", components: "V, S, M (ruby dust worth 50+ GP, which the spell consumes)", duration: "Until dispelled",
    text: "A flame springs from an object that you touch. The effect casts Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. It looks like a regular flame, but it creates no heat and consumes no fuel. The flame can be covered or hidden but not smothered or quenched.",
    roll: "none", saveAbility: null, damage: null, effect: "A heatless, permanent flame on an object: Bright Light 20 ft., Dim Light 20 ft. more.",
    scaling: "No change when cast with a higher-level slot."
  },
  cordonOfArrows: {
    name: "Cordon of Arrows", level: 2, school: "Transmutation", classes: ["ranger"],
    time: "Action", range: "Touch", components: "V, S, M (an ornamental braid)", duration: "8 hours",
    text: "You touch up to four nonmagical Arrows or Bolts and plant them in the ground in your space. Until the spell ends, the ammunition can't be physically uprooted, and whenever a creature other than you enters a space within 30 feet of the ammunition for the first time on a turn or ends its turn there, one piece of ammunition flies up to strike it. The creature must succeed on a Dexterity saving throw or take 2d4 Piercing damage. The piece of ammunition is then destroyed. The spell ends when none of the ammunition remains planted in the ground. When you cast this spell, you can designate any creatures you choose, and the spell ignores them.",
    higherLevel: "The amount of ammunition that can be affected increases by two for each spell slot level above 2.",
    roll: "save", saveAbility: "dex", damage: "2d4 Piercing", effect: "Plant up to four pieces of ammunition that shoot creatures coming within 30 ft. (1d6 Piercing each on a failed Dex save).",
    scaling: "The amount of ammunition that can be affected increases by two for each spell slot level above 2."
  },
  crownOfMadness: {
    name: "Crown of Madness", level: 2, school: "Enchantment", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "One creature that you can see within range must succeed on a Wisdom saving throw or have the Charmed condition for the duration. The creature succeeds automatically if it isn't Humanoid. A spectral crown appears on the Charmed target's head, and it must use its action before moving on each of its turns to make a melee attack against a creature other than itself that you mentally choose. The target can act normally on its turn if you choose no creature or if no creature is within its reach. The target repeats the save at the end of each of its turns, ending the spell on itself on a success. On your later turns, you must take the Magic action to maintain control of the target, or the spell ends.",
    roll: "save", saveAbility: "wis", damage: null, effect: "A Charmed Humanoid must attack a creature you choose on each of its turns.",
    scaling: "No change when cast with a higher-level slot."
  },
  darkness: {
    name: "Darkness", level: 2, school: "Evocation", classes: ["sorcerer","warlock","wizard"],
    time: "Action", range: "60 feet", components: "V, M (bat fur and a piece of coal)", duration: "Concentration, up to 10 minutes",
    text: "For the duration, magical Darkness spreads from a point within range and fills a 15-foot-radius Sphere. Darkvision can't see through it, and nonmagical light can't illuminate it. Alternatively, you cast the spell on an object that isn't being worn or carried, causing the Darkness to fill a 15-foot Emanation originating from that object. Covering that object with something opaque, such as a bowl or helm, blocks the Darkness. If any of this spell's area overlaps with an area of Bright Light or Dim Light created by a spell of level 2 or lower, that other spell is dispelled.",
    roll: "none", saveAbility: null, damage: null, effect: "Magical Darkness in a 15-ft. Sphere that Darkvision can't penetrate.",
    scaling: "No change when cast with a higher-level slot."
  },
  darkvision: {
    name: "Darkvision", level: 2, school: "Transmutation", classes: ["druid","ranger","sorcerer","wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a dried carrot)", duration: "8 hours",
    text: "For the duration, a willing creature you touch has Darkvision with a range of 150 feet.",
    roll: "none", saveAbility: null, damage: null, effect: "A willing creature gains 150-ft. Darkvision for 8 hours.",
    scaling: "No change when cast with a higher-level slot."
  },
  detectThoughts: {
    name: "Detect Thoughts", level: 2, school: "Divination", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S, M (1 Copper Piece)", duration: "Concentration, up to 1 minute",
    text: "You activate one of the effects below. Until the spell ends, you can activate either effect as a Magic action on your later turns. Sense Thoughts. You sense the presence of thoughts within 30 feet of yourself that belong to creatures that know languages or are telepathic. You don't read the thoughts, but you know that a thinking creature is present. The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead. Read Thoughts. Target one creature you can see within 30 feet of yourself or one creature within 30 feet of yourself that you detected with the Sense Thoughts option. You learn what is most on the target's mind right now. If the target doesn't know any languages and isn't telepathic, you learn nothing. As a Magic action on your next turn, you can try to probe deeper into the target's mind. If you probe deeper, the target makes a Wisdom saving throw. On a failed save, you discern the target's reasoning, emotions, and something that looms large in its mind (such as a worry, love, or hate). On a successful save, the spell ends. Either way, the target knows that you are probing into its mind, and until you shift your attention away from the target's mind, the target can take an action on its turn to make an Intelligence (Arcana) check against your spell save DC, ending the spell on a success.",
    roll: "save", saveAbility: "wis", damage: null, effect: "Sense thinking creatures within 30 ft., or read one creature's surface thoughts; probing deeper allows a Wisdom save.",
    scaling: "No change when cast with a higher-level slot."
  },
  dragonsBreath: {
    name: "Dragon's Breath", level: 2, school: "Transmutation", classes: ["sorcerer","wizard"],
    time: "Bonus Action", range: "Touch", components: "V, S, M (a hot pepper)", duration: "Concentration, up to 1 minute",
    text: "You touch one willing creature, and choose Acid, Cold, Fire, Lightning, or Poison. Until the spell ends, the target can take a Magic action to exhale a 15-foot Cone. Each creature in that area makes a Dexterity saving throw, taking 3d6 damage of the chosen type on a failed save or half as much damage on a successful one.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 2.",
    roll: "save", saveAbility: "dex", damage: "3d6 of the chosen type", effect: "A willing creature can exhale a 15-ft. Cone of a damage type you choose as a Magic action.",
    scaling: "+1d6 damage per slot level above 2nd."
  },
  enhanceAbility: {
    name: "Enhance Ability", level: 2, school: "Transmutation", classes: ["bard","cleric","druid","ranger","sorcerer","wizard"],
    time: "Action", range: "Touch", components: "V, S, M (fur or a feather)", duration: "Concentration, up to 1 hour",
    text: "You touch a creature and choose Strength, Dexterity, Intelligence, Wisdom, or Charisma. For the duration, the target has Advantage on ability checks using the chosen ability.",
    higherLevel: "You can target one additional creature for each spell slot level above 2. You can choose a different ability for each target.",
    roll: "none", saveAbility: null, damage: null, effect: "Advantage on ability checks with one chosen ability.",
    scaling: "You can target one additional creature for each spell slot level above 2. You can choose a different ability for each target."
  },
  enlargeReduce: {
    name: "Enlarge/Reduce", level: 2, school: "Transmutation", classes: ["bard","druid","sorcerer","wizard"],
    time: "Action", range: "30 feet", components: "V, S, M (a pinch of powdered iron)", duration: "Concentration, up to 1 minute",
    text: "For the duration, the spell enlarges or reduces a creature or an object you can see within range (see the chosen effect below). A targeted object must be neither worn nor carried. If the target is an unwilling creature, it can make a Constitution saving throw. On a successful save, the spell has no effect. Everything that a targeted creature is wearing and carrying changes size with it. Any item it drops returns to normal size at once. A thrown weapon or piece of ammunition returns to normal size immediately after it hits or misses a target. Enlarge. The target's size increases by one category—from Medium to Large, for example. The target also has Advantage on Strength checks and Strength saving throws. The target's attacks with its enlarged weapons or Unarmed Strikes deal an extra 1d4 damage on a hit. Reduce. The target's size decreases by one category—from Medium to Small, for example. The target also has Disadvantage on Strength checks and Strength saving throws. The target's attacks with its reduced weapons or Unarmed Strikes deal 1d4 less damage on a hit (this can't reduce the damage below 1).",
    roll: "save", saveAbility: "con", damage: null, effect: "Grow or shrink a creature or object one size; Enlarge adds 1d4 to its weapon damage, Reduce subtracts 1d4.",
    scaling: "No change when cast with a higher-level slot."
  },
  enthrall: {
    name: "Enthrall", level: 2, school: "Enchantment", classes: ["bard","warlock"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "You weave a distracting string of words, causing creatures of your choice that you can see within range to make a Wisdom saving throw. Any creature you or your companions are fighting automatically succeeds on this save. On a failed save, a target has a −10 penalty to Wisdom (Perception) checks and Passive Perception until the spell ends.",
    roll: "save", saveAbility: "wis", damage: null, effect: "Creatures that fail have -10 to Perception checks and Passive Perception.",
    scaling: "No change when cast with a higher-level slot."
  },
  findSteed: {
    name: "Find Steed", level: 2, school: "Conjuration", classes: ["paladin"],
    time: "Action", range: "30 feet", components: "V, S", duration: "Instantaneous",
    text: "You summon an otherworldly being that appears as a loyal steed in an unoccupied space of your choice within range. This creature uses the Otherworldly Steed stat block. If you already have a steed from this spell, the steed is replaced by the new one. The steed resembles a Large, rideable animal of your choice, such as a horse, a camel, a dire wolf, or an elk. Whenever you cast the spell, choose the steed's creature type—Celestial, Fey, or Fiend—which determines certain traits in the stat block. Combat. The steed is an ally to you and your allies. In combat, it shares your Initiative count, and it functions as a controlled mount while you ride it (as defined in the rules on mounted combat). If you have the Incapacitated condition, the steed takes its turn immediately after yours and acts independently, focusing on protecting you. Disappearance of the Steed. The steed disappears if it drops to 0 Hit Points or if you die. When it disappears, it leaves behind anything it was wearing or carrying. If you cast this spell again, you decide whether you summon the steed that disappeared or a different one. Stat block — Otherworldly Steed Large Celestial, Fey, or Fiend (Your Choice), Neutral AC 10 + 1 per spell level HP 5 + 10 per spell level (the steed has a number of Hit Dice [d10s] equal to the spell's level) Speed 60 ft., Fly 60 ft. (requires level 4+ spell) Mod STR 18 +4 DEX 12 +1 CON 14 +2 Save +4 +1 +2 Mod INT 6 −2 WIS 12 +1 CHA 8 −1 Save −2 +1 −1 Senses Passive Perception 11 Languages Telepathy 1 mile (works only with you) CR None (XP 0; PB equals your Proficiency Bonus) Traits Life Bond. When you regain Hit Points from a level 1+ spell, the steed regains the same number of Hit Points if you're within 5 feet of it. Actions Otherworldly Slam. Melee Attack Roll: Bonus equals your spell attack modifier, reach 5 ft. Hit: 1d8 plus the spell's level of Radiant (Celestial), Psychic (Fey), or Necrotic (Fiend) damage. Bonus Actions Fell Glare (Fiend Only; Recharges after a Long Rest). Wisdom Saving Throw: DC equals your spell save DC, one creature within 60 feet the steed can see. Failure: The target has the Frightened condition until the end of your next turn. Fey Step (Fey Only; Recharges after a Long Rest). The steed teleports, along with its rider, to an unoccupied space of your choice up to 60 feet away from itself. Healing Touch (Celestial Only; Recharges after a Long Rest). One creature within 5 feet of the steed regains a number of Hit Points equal to 2d8 plus the spell's level.",
    higherLevel: "Use the spell slot's level for the spell's level in the stat block.",
    roll: "none", saveAbility: null, damage: null, effect: "Summon a loyal Large steed (Celestial, Fey, or Fiend) that fights with you; uses the Otherworldly Steed stat block.",
    scaling: "Use the spell slot's level for the spell's level in the stat block."
  },
  findTraps: {
    name: "Find Traps", level: 2, school: "Divination", classes: ["cleric","druid","ranger"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You sense any trap within range that is within line of sight. A trap, for the purpose of this spell, includes any object or mechanism that was created to cause damage or other danger. Thus, the spell would sense the Alarm or Glyph of Warding spell or a mechanical pit trap, but it wouldn't reveal a natural weakness in the floor, an unstable ceiling, or a hidden sinkhole. This spell reveals that a trap is present but not its location. You do learn the general nature of the danger posed by a trap you sense.",
    roll: "none", saveAbility: null, damage: null, effect: "Sense whether a trap is within range and line of sight, though not its location.",
    scaling: "No change when cast with a higher-level slot."
  },
  flameBlade: {
    name: "Flame Blade", level: 2, school: "Evocation", classes: ["druid","sorcerer"],
    time: "Bonus Action", range: "Self", components: "V, S, M (a sumac leaf)", duration: "Concentration, up to 10 minutes",
    text: "You evoke a fiery blade in your free hand. The blade is similar in size and shape to a scimitar, and it lasts for the duration. If you let go of the blade, it disappears, but you can evoke it again as a Bonus Action. As a Magic action, you can make a melee spell attack with the fiery blade. On a hit, the target takes Fire damage equal to 3d6 plus your spellcasting ability modifier. The flaming blade sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 2.",
    roll: "attack", saveAbility: null, damage: "3d6 Fire + spellcasting modifier", effect: "A fiery scimitar you attack with as a Magic action: 3d6 Fire plus your spellcasting modifier on a hit.",
    scaling: "+1d6 damage per slot level above 2nd."
  },
  flamingSphere: {
    name: "Flaming Sphere", level: 2, school: "Conjuration", classes: ["druid","sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a ball of wax)", duration: "Concentration, up to 1 minute",
    text: "You create a 5-foot-diameter sphere of fire in an unoccupied space on the ground within range. It lasts for the duration. Any creature that ends its turn within 5 feet of the sphere makes a Dexterity saving throw, taking 2d6 Fire damage on a failed save or half as much damage on a successful one. As a Bonus Action, you can move the sphere up to 30 feet, rolling it along the ground. If you move the sphere into a creature's space, that creature makes the save against the sphere, and the sphere stops moving for the turn. When you move the sphere, you can direct it over barriers up to 5 feet tall and jump it across pits up to 10 feet wide. Flammable objects that aren't being worn or carried start burning if touched by the sphere, and it sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 2.",
    roll: "save", saveAbility: "dex", damage: "2d6 Fire", effect: "A rolling 5-ft. sphere of fire you move as a Bonus Action; creatures ending a turn near it save. Half damage on a success.",
    scaling: "+1d6 damage per slot level above 2nd."
  },
  gentleRepose: {
    name: "Gentle Repose", level: 2, school: "Necromancy", classes: ["cleric","paladin","wizard"], ritual: true,
    time: "Action or Ritual", range: "Touch", components: "V, S, M (2 Copper Pieces, which the spell consumes)", duration: "10 days",
    text: "You touch a corpse or other remains. For the duration, the target is protected from decay and can't become Undead. The spell also effectively extends the time limit on raising the target from the dead, since days spent under the influence of this spell don't count against the time limit of spells such as Raise Dead.",
    roll: "none", saveAbility: null, damage: null, effect: "Stops a corpse decaying or becoming Undead; the time doesn't count against raising it.",
    scaling: "No change when cast with a higher-level slot."
  },
  gustOfWind: {
    name: "Gust of Wind", level: 2, school: "Evocation", classes: ["druid","ranger","sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S, M (a legume seed)", duration: "Concentration, up to 1 minute",
    text: "A Line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the duration. Each creature in the Line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the Line. A creature that ends its turn in the Line must make the same save. Any creature in the Line must spend 2 feet of movement for every 1 foot it moves when moving closer to you. The gust disperses gas or vapor, and it extinguishes candles and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them. As a Bonus Action on your later turns, you can change the direction in which the Line blasts from you.",
    roll: "save", saveAbility: "str", damage: null, effect: "A 60-ft. Line of wind pushes creatures 15 ft. on a failed save and disperses gas or vapor.",
    scaling: "No change when cast with a higher-level slot."
  },
  heatMetal: {
    name: "Heat Metal", level: 2, school: "Transmutation", classes: ["bard","druid"],
    time: "Action", range: "60 feet", components: "V, S, M (a piece of iron and a flame)", duration: "Concentration, up to 1 minute",
    text: "Choose a manufactured metal object, such as a metal weapon or a suit of Heavy or Medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 Fire damage when you cast the spell. Until the spell ends, you can take a Bonus Action on each of your later turns to deal this damage again if the object is within range. If a creature is holding or wearing the object and takes the damage from it, the creature must succeed on a Constitution saving throw or drop the object if it can. If it doesn't drop the object, it has Disadvantage on attack rolls and ability checks until the start of your next turn.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 2.",
    roll: "save", saveAbility: "con", damage: "2d8 Fire", effect: "A metal object glows hot, burning whoever touches it; Bonus Action to deal the damage again.",
    scaling: "+1d8 damage per slot level above 2nd."
  },
  holdPerson: {
    name: "Hold Person", level: 2, school: "Enchantment", classes: ["bard","cleric","druid","sorcerer","warlock","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a straight piece of iron)", duration: "Concentration, up to 1 minute",
    text: "Choose a Humanoid that you can see within range. The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration. At the end of each of its turns, the target repeats the save, ending the spell on itself on a success.",
    higherLevel: "You can target one additional Humanoid for each spell slot level above 2.",
    roll: "save", saveAbility: "wis", damage: null, effect: "A Humanoid is Paralyzed, repeating the save each turn.",
    scaling: "You can target one additional Humanoid for each spell slot level above 2."
  },
  invisibility: {
    name: "Invisibility", level: 2, school: "Illusion", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "Touch", components: "V, S, M (an eyelash in gum arabic)", duration: "Concentration, up to 1 hour",
    text: "A creature you touch has the Invisible condition until the spell ends. The spell ends early immediately after the target makes an attack roll, deals damage, or casts a spell.",
    higherLevel: "You can target one additional creature for each spell slot level above 2.",
    roll: "none", saveAbility: null, damage: null, effect: "One touched creature is Invisible until it attacks, deals damage, or casts a spell.",
    scaling: "+1 creature per slot level above 2nd."
  },
  knock: {
    name: "Knock", level: 2, school: "Transmutation", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V", duration: "Instantaneous",
    text: "Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access. A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked. If the target is held shut by Arcane Lock, that spell is suppressed for 10 minutes, during which time the target can be opened and closed. When you cast the spell, a loud knock, audible up to 300 feet away, emanates from the target.",
    roll: "none", saveAbility: null, damage: null, effect: "Unlocks a mundane lock or suppresses Arcane Lock for 10 minutes; makes a loud knock.",
    scaling: "No change when cast with a higher-level slot."
  },
  lesserRestoration: {
    name: "Lesser Restoration", level: 2, school: "Abjuration", classes: ["bard","cleric","druid","paladin","ranger"],
    time: "Bonus Action", range: "Touch", components: "V, S", duration: "Instantaneous",
    text: "You touch a creature and end one condition on it: Blinded, Deafened, Paralyzed, or Poisoned.",
    roll: "none", saveAbility: null, damage: null, effect: "End Blinded, Deafened, Paralyzed, or Poisoned on one creature.",
    scaling: "No change when cast with a higher-level slot."
  },
  levitate: {
    name: "Levitate", level: 2, school: "Transmutation", classes: ["sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a metal spring)", duration: "Concentration, up to 10 minutes",
    text: "One creature or loose object of your choice that you can see within range rises vertically up to 20 feet and remains suspended there for the duration. The spell can levitate an object that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected. The target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target's altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can take a Magic action to move the target, which must remain within the spell's range. When the spell ends, the target floats gently to the ground if it is still aloft.",
    roll: "save", saveAbility: "con", damage: null, effect: "A creature or object up to 500 lb. rises up to 20 ft. and hangs there.",
    scaling: "No change when cast with a higher-level slot."
  },
  locateAnimalsOrPlants: {
    name: "Locate Animals or Plants", level: 2, school: "Divination", classes: ["bard","druid","ranger"], ritual: true,
    time: "Action or Ritual", range: "Self", components: "V, S, M (fur from a bloodhound)", duration: "Instantaneous",
    text: "Describe or name a specific kind of Beast, Plant creature, or nonmagical plant. You learn the direction and distance to the closest creature or plant of that kind within 5 miles, if any are present.",
    roll: "none", saveAbility: null, damage: null, effect: "Learn the direction and distance to the nearest named kind of Beast or plant within 5 miles.",
    scaling: "No change when cast with a higher-level slot."
  },
  locateObject: {
    name: "Locate Object", level: 2, school: "Divination", classes: ["bard","cleric","druid","paladin","ranger","wizard"],
    time: "Action", range: "Self", components: "V, S, M (a forked twig)", duration: "Concentration, up to 10 minutes",
    text: "Describe or name an object that is familiar to you. You sense the direction to the object's location if that object is within 1,000 feet of you. If the object is in motion, you know the direction of its movement. The spell can locate a specific object known to you if you have seen it up close—within 30 feet—at least once. Alternatively, the spell can locate the nearest object of a particular kind, such as a certain kind of apparel, jewelry, furniture, tool, or weapon. This spell can't locate an object if any thickness of lead blocks a direct path between you and the object.",
    roll: "none", saveAbility: null, damage: null, effect: "Sense the direction to a familiar object within 1,000 ft.; blocked by lead.",
    scaling: "No change when cast with a higher-level slot."
  },
  magicMouth: {
    name: "Magic Mouth", level: 2, school: "Illusion", classes: ["bard","wizard"], ritual: true,
    time: "1 minute or Ritual", range: "30 feet", components: "V, S, M (jade dust worth 10+ GP, which the spell consumes)", duration: "Until dispelled",
    text: "You implant a message within an object in range—a message that is uttered when a trigger condition is met. Choose an object that you can see and that isn't being worn or carried by another creature. Then speak the message, which must be 25 words or fewer, though it can be delivered over as long as 10 minutes. Finally, determine the circumstance that will trigger the spell to deliver your message. When that trigger occurs, a magical mouth appears on the object and recites the message in your voice and at the same volume you spoke. If the object you chose has a mouth or something that looks like a mouth (for example, the mouth of a statue), the magical mouth appears there, so the words appear to come from the object's mouth. When you cast this spell, you can have the spell end after it delivers its message, or it can remain and repeat its message whenever the trigger occurs. The trigger can be as general or as detailed as you like, though it must be based on visual or audible conditions that occur within 30 feet of the object. For example, you could instruct the mouth to speak when any creature moves within 30 feet of the object or when a silver bell rings within 30 feet of it.",
    roll: "none", saveAbility: null, damage: null, effect: "An object speaks a message of up to 25 words when its trigger condition is met.",
    scaling: "No change when cast with a higher-level slot."
  },
  magicWeapon: {
    name: "Magic Weapon", level: 2, school: "Transmutation", classes: ["paladin","ranger","sorcerer","wizard"],
    time: "Bonus Action", range: "Touch", components: "V, S", duration: "1 hour",
    text: "You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls. The spell ends early if you cast it again.",
    higherLevel: "The bonus increases to +2 with a level 3–5 spell slot. The bonus increases to +3 with a level 6+ spell slot.",
    roll: "none", saveAbility: null, damage: null, effect: "A nonmagical weapon becomes +1 to attack and damage rolls.",
    scaling: "The bonus increases to +2 with a level 3–5 spell slot. The bonus increases to +3 with a level 6+ spell slot."
  },
  melfsAcidArrow: {
    name: "Melf's Acid Arrow", level: 2, school: "Evocation", classes: ["wizard"],
    time: "Action", range: "90 feet", components: "V, S, M (powdered rhubarb leaf)", duration: "Instantaneous",
    text: "A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 Acid damage and 2d4 Acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage only.",
    higherLevel: "The damage (both initial and later) increases by 1d4 for each spell slot level above 2.",
    roll: "attack", saveAbility: null, damage: "4d4 Acid", effect: "On a hit: 4d4 Acid now and 2d4 Acid at the end of its next turn; half the initial damage on a miss.",
    scaling: "The damage (both initial and later) increases by 1d4 for each spell slot level above 2."
  },
  mindSpike: {
    name: "Mind Spike", level: 2, school: "Divination", classes: ["sorcerer","warlock","wizard"],
    time: "Action", range: "120 feet", components: "S", duration: "Concentration, up to 1 hour",
    text: "You drive a spike of psionic energy into the mind of one creature you can see within range. The target makes a Wisdom saving throw, taking 3d8 Psychic damage on a failed save or half as much damage on a successful one. On a failed save, you also always know the target's location until the spell ends, but only while the two of you are on the same plane of existence. While you have this knowledge, the target can't become hidden from you, and if it has the Invisible condition, it gains no benefit from that condition against you.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 2.",
    roll: "save", saveAbility: "wis", damage: "3d8 Psychic", effect: "On a failure you also know the target's location while you're on the same plane. Half damage on a success.",
    scaling: "+1d8 damage per slot level above 2nd."
  },
  mirrorImage: {
    name: "Mirror Image", level: 2, school: "Illusion", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "Self", components: "V, S", duration: "1 minute",
    text: "Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. Each time a creature hits you with an attack roll during the spell's duration, roll a d6 for each of your remaining duplicates. If any of the d6s rolls a 3 or higher, one of the duplicates is hit instead of you, and the duplicate is destroyed. The duplicates otherwise ignore all other damage and effects. The spell ends when all three duplicates are destroyed. A creature is unaffected by this spell if it has the Blinded condition, Blindsight, or Truesight.",
    roll: "none", saveAbility: null, damage: null, effect: "Three duplicates; each hit may land on a duplicate instead (d6 roll), destroying it.",
    scaling: "No change when cast with a higher-level slot."
  },
  mistyStep: {
    name: "Misty Step", level: 2, school: "Conjuration", classes: ["sorcerer","warlock","wizard"],
    time: "Bonus Action", range: "Self", components: "V", duration: "Instantaneous",
    text: "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space you can see.",
    roll: "none", saveAbility: null, damage: null, effect: "Bonus Action teleport up to 30 ft. to a space you can see.",
    scaling: "No change when cast with a higher-level slot."
  },
  moonbeam: {
    name: "Moonbeam", level: 2, school: "Evocation", classes: ["druid"],
    time: "Action", range: "120 feet", components: "V, S, M (a moonseed leaf)", duration: "Concentration, up to 1 minute",
    text: "A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high Cylinder centered on a point within range. Until the spell ends, Dim Light fills the Cylinder, and you can take a Magic action on later turns to move the Cylinder up to 60 feet. When the Cylinder appears, each creature in it makes a Constitution saving throw. On a failed save, a creature takes 2d10 Radiant damage, and if the creature is shape-shifted (as a result of the Polymorph spell, for example), it reverts to its true form and can't shape-shift until it leaves the Cylinder. On a successful save, a creature takes half as much damage only. A creature also makes this save when the spell's area moves into its space and when it enters the spell's area or ends its turn there. A creature makes this save only once per turn.",
    higherLevel: "The damage increases by 1d10 for each spell slot level above 2.",
    roll: "save", saveAbility: "con", damage: "2d10 Radiant", effect: "A 5-ft.-radius Cylinder of moonlight you can move; shapechangers have Disadvantage and revert. Half damage on a success.",
    scaling: "+1d10 damage per slot level above 2nd."
  },
  nystulsMagicAura: {
    name: "Nystul's Magic Aura", level: 2, school: "Illusion", classes: ["wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a small square of silk)", duration: "24 hours",
    text: "With a touch, you place an illusion on a willing creature or an object that isn't being worn or carried. A creature gains the Mask effect below, and an object gains the False Aura effect below. The effect lasts for the duration. If you cast the spell on the same target every day for 30 days, the illusion lasts until dispelled. Mask (Creature). Choose a creature type other than the target's actual type. Spells and other magical effects treat the target as if it were a creature of the chosen type. False Aura (Object). You change the way the target appears to spells and magical effects that detect magical auras, such as Detect Magic. You can make a nonmagical object appear magical, make a magic item appear nonmagical, or change the object's aura so that it appears to belong to a school of magic you choose.",
    roll: "none", saveAbility: null, damage: null, effect: "Hide a creature's type or give an object a false magical aura against detection magic.",
    scaling: "No change when cast with a higher-level slot."
  },
  passWithoutTrace: {
    name: "Pass without Trace", level: 2, school: "Abjuration", classes: ["druid","ranger"],
    time: "Action", range: "Self", components: "V, S, M (ashes from burned mistletoe)", duration: "Concentration, up to 1 hour",
    text: "You radiate a concealing aura in a 30-foot Emanation for the duration. While in the aura, you and each creature you choose have a +10 bonus to Dexterity (Stealth) checks and leave no tracks.",
    roll: "none", saveAbility: null, damage: null, effect: "You and chosen creatures in a 30-ft. Emanation get +10 to Stealth checks and leave no tracks.",
    scaling: "No change when cast with a higher-level slot."
  },
  phantasmalForce: {
    name: "Phantasmal Force", level: 2, school: "Illusion", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a bit of fleece)", duration: "Concentration, up to 1 minute",
    text: "You attempt to craft an illusion in the mind of a creature you can see within range. The target makes an Intelligence saving throw. On a failed save, you create a phantasmal object, creature, or other phenomenon that is no larger than a 10-foot Cube and that is perceivable only to the target for the duration. The phantasm includes sound, temperature, and other stimuli. The target can take a Study action to examine the phantasm with an Intelligence (Investigation) check against your spell save DC. If the check succeeds, the target realizes that the phantasm is an illusion, and the spell ends. While affected by the spell, the target treats the phantasm as if it were real and rationalizes any illogical outcomes from interacting with it. For example, if the target steps through a phantasmal bridge and survives the fall, it believes the bridge exists and something else caused it to fall. An affected target can even take damage from the illusion if the phantasm represents a dangerous creature or hazard. On each of your turns, such a phantasm can deal 2d8 Psychic damage to the target if it is in the phantasm's area or within 5 feet of the phantasm. The target perceives the damage as a type appropriate to the illusion.",
    roll: "save", saveAbility: "int", damage: "2d8 Psychic", effect: "Only the target perceives an illusion, which deals 2d8 Psychic damage on each of your turns if it's harmful.",
    scaling: "No change when cast with a higher-level slot."
  },
  prayerOfHealing: {
    name: "Prayer of Healing", level: 2, school: "Abjuration", classes: ["cleric","paladin"],
    time: "10 minutes", range: "30 feet", components: "V", duration: "Instantaneous",
    text: "Up to five creatures of your choice who remain within range for the spell's entire casting gain the benefits of a Short Rest and also regain 2d8 Hit Points. A creature can't be affected by this spell again until that creature finishes a Long Rest.",
    higherLevel: "The healing increases by 1d8 for each spell slot level above 2.",
    roll: "none", saveAbility: null, damage: null, effect: "Up to five creatures get the benefits of a Short Rest and regain 2d8 Hit Points.",
    scaling: "+1d8 healing per slot level above 2nd."
  },
  protectionFromPoison: {
    name: "Protection from Poison", level: 2, school: "Abjuration", classes: ["cleric","druid","paladin","ranger"],
    time: "Action", range: "Touch", components: "V, S", duration: "1 hour",
    text: "You touch a creature and end the Poisoned condition on it. For the duration, the target has Advantage on saving throws to avoid or end the Poisoned condition, and it has Resistance to Poison damage.",
    roll: "none", saveAbility: null, damage: null, effect: "Ends Poisoned; Advantage on saves against Poisoned and Resistance to Poison damage.",
    scaling: "No change when cast with a higher-level slot."
  },
  rayOfEnfeeblement: {
    name: "Ray of Enfeeblement", level: 2, school: "Necromancy", classes: ["warlock","wizard"],
    time: "Action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "A beam of enervating energy shoots from you toward a creature within range. The target must make a Constitution saving throw. On a successful save, the target has Disadvantage on the next attack roll it makes until the start of your next turn. On a failed save, the target has Disadvantage on Strength-based D20 Tests for the duration. During that time, it also subtracts 1d8 from all its damage rolls. The target repeats the save at the end of each of its turns, ending the spell on a success.",
    roll: "save", saveAbility: "con", damage: null, effect: "On a failure the target has Disadvantage on Strength-based D20 Tests; on a success, on its next attack roll.",
    scaling: "No change when cast with a higher-level slot."
  },
  ropeTrick: {
    name: "Rope Trick", level: 2, school: "Transmutation", classes: ["wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a segment of rope)", duration: "1 hour",
    text: "You touch a rope. One end of it hovers upward until the rope hangs perpendicular to the ground or the rope reaches a ceiling. At the rope's upper end, an Invisible 3-foot-by-5-foot portal opens to an extradimensional space that lasts until the spell ends. That space can be reached by climbing the rope, which can be pulled into or dropped out of it. The space can hold up to eight Medium or smaller creatures. Attacks, spells, and other effects can't pass into or out of the space, but creatures inside it can see through the portal. Anything inside the space drops out when the spell ends.",
    roll: "none", saveAbility: null, damage: null, effect: "A rope leads to an invisible extradimensional space that holds up to eight Medium creatures.",
    scaling: "No change when cast with a higher-level slot."
  },
  scorchingRay: {
    name: "Scorching Ray", level: 2, school: "Evocation", classes: ["sorcerer","wizard"],
    time: "Action", range: "120 feet", components: "V, S", duration: "Instantaneous",
    text: "You hurl three fiery rays. You can hurl them at one target within range or at several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 Fire damage.",
    higherLevel: "You create one additional ray for each spell slot level above 2.",
    roll: "attack", saveAbility: null, damage: "2d6 Fire", effect: "Three rays, each its own ranged spell attack.",
    scaling: "You create one additional ray for each spell slot level above 2."
  },
  seeInvisibility: {
    name: "See Invisibility", level: 2, school: "Divination", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "Self", components: "V, S, M (a pinch of talc)", duration: "1 hour",
    text: "For the duration, you see creatures and objects that have the Invisible condition as if they were visible, and you can see into the Ethereal Plane. Creatures and objects there appear ghostly.",
    roll: "none", saveAbility: null, damage: null, effect: "See Invisible creatures and objects and into the Ethereal Plane.",
    scaling: "No change when cast with a higher-level slot."
  },
  shatter: {
    name: "Shatter", level: 2, school: "Evocation", classes: ["bard","sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a chip of mica)", duration: "Instantaneous",
    text: "A loud noise erupts from a point of your choice within range. Each creature in a 10-foot-radius Sphere centered there makes a Constitution saving throw, taking 3d8 Thunder damage on a failed save or half as much damage on a successful one. A Construct has Disadvantage on the save. A nonmagical object that isn't being worn or carried also takes the damage if it's in the spell's area.",
    higherLevel: "The damage increases by 1d8 for each spell slot level above 2.",
    roll: "save", saveAbility: "con", damage: "3d8 Thunder", effect: "Each creature in a 10-ft. Sphere; Constructs have Disadvantage. Half damage on a success.",
    scaling: "+1d8 damage per slot level above 2nd."
  },
  shiningSmite: {
    name: "Shining Smite", level: 2, school: "Transmutation", classes: ["paladin"],
    time: "Bonus Action, which you take immediately after hitting a creature with a Melee weapon or an Unarmed Strike", range: "Self", components: "V", duration: "Concentration, up to 1 minute",
    text: "The target hit by the strike takes an extra 2d6 Radiant damage from the attack. Until the spell ends, the target sheds Bright Light in a 5-foot radius, attack rolls against it have Advantage, and it can't benefit from the Invisible condition.",
    higherLevel: "The damage increases by 1d6 for each spell slot level above 2.",
    roll: "none", saveAbility: null, damage: "2d6 Radiant", effect: "Bonus Action after hitting: extra Radiant damage; the target glows, attacks against it have Advantage, and it can't be Invisible.",
    scaling: "+1d6 damage per slot level above 2nd."
  },
  silence: {
    name: "Silence", level: 2, school: "Illusion", classes: ["bard","cleric","ranger"], ritual: true,
    time: "Action or Ritual", range: "120 feet", components: "V, S", duration: "Concentration, up to 10 minutes",
    text: "For the duration, no sound can be created within or pass through a 20-foot-radius Sphere centered on a point you choose within range. Any creature or object entirely inside the Sphere has Immunity to Thunder damage, and creatures have the Deafened condition while entirely inside it. Casting a spell that includes a Verbal component is impossible there.",
    roll: "none", saveAbility: null, damage: null, effect: "No sound in a 20-ft. Sphere: creatures inside are Deafened and can't cast spells with Verbal components.",
    scaling: "No change when cast with a higher-level slot."
  },
  spiderClimb: {
    name: "Spider Climb", level: 2, school: "Transmutation", classes: ["sorcerer","warlock","wizard"],
    time: "Action", range: "Touch", components: "V, S, M (a drop of bitumen and a spider)", duration: "Concentration, up to 1 hour",
    text: "Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and along ceilings, while leaving its hands free. The target also gains a Climb Speed equal to its Speed.",
    higherLevel: "You can target one additional creature for each spell slot level above 2.",
    roll: "none", saveAbility: null, damage: null, effect: "A willing creature can climb walls and ceilings, with a Climb Speed equal to its Speed.",
    scaling: "+1 target per slot level above 2nd."
  },
  spikeGrowth: {
    name: "Spike Growth", level: 2, school: "Transmutation", classes: ["druid","ranger"],
    time: "Action", range: "150 feet", components: "V, S, M (seven thorns)", duration: "Concentration, up to 10 minutes",
    text: "The ground in a 20-foot-radius Sphere centered on a point within range sprouts hard spikes and thorns. The area becomes Difficult Terrain for the duration. When a creature moves into or within the area, it takes 2d4 Piercing damage for every 5 feet it travels. The transformation of the ground is camouflaged to look natural. Any creature that can't see the area when the spell is cast must take a Search action and succeed on a Wisdom (Perception or Survival) check against your spell save DC to recognize the terrain as hazardous before entering it.",
    roll: "none", saveAbility: null, damage: "2d4 Piercing", effect: "A 20-ft. Sphere of Difficult Terrain; 2d4 Piercing for every 5 ft. a creature moves through it.",
    scaling: "No change when cast with a higher-level slot."
  },
  spiritualWeapon: {
    name: "Spiritual Weapon", level: 2, school: "Evocation", classes: ["cleric"],
    time: "Bonus Action", range: "60 feet", components: "V, S", duration: "Concentration, up to 1 minute",
    text: "You create a floating, spectral force that resembles a weapon of your choice and lasts for the duration. The force appears within range in a space of your choice, and you can immediately make one melee spell attack against one creature within 5 feet of the force. On a hit, the target takes Force damage equal to 1d8 plus your spellcasting ability modifier. As a Bonus Action on your later turns, you can move the force up to 20 feet and repeat the attack against a creature within 5 feet of it.",
    higherLevel: "The damage increases by 1d8 for every slot level above 2.",
    roll: "none", saveAbility: null, damage: "1d8 Force + spellcasting modifier", effect: "A floating weapon: melee spell attack for 1d8 plus your spellcasting modifier Force damage; Bonus Action to move it and attack again.",
    scaling: "The damage increases by 1d8 for every slot level above 2."
  },
  suggestion: {
    name: "Suggestion", level: 2, school: "Enchantment", classes: ["bard","sorcerer","warlock","wizard"],
    time: "Action", range: "30 feet", components: "V, M (a drop of honey)", duration: "Concentration, up to 8 hours",
    text: "You suggest a course of activity—described in no more than 25 words—to one creature you can see within range that can hear and understand you. The suggestion must sound achievable and not involve anything that would obviously deal damage to the target or its allies. For example, you could say, \"Fetch the key to the cult's treasure vault, and give the key to me.\" Or you could say, \"Stop fighting, leave this library peacefully, and don't return.\" The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration or until you or your allies deal damage to the target. The Charmed target pursues the suggestion to the best of its ability. The suggested activity can continue for the entire duration, but if the suggested activity can be completed in a shorter time, the spell ends for the target upon completing it.",
    roll: "save", saveAbility: "wis", damage: null, effect: "A creature that fails follows a reasonable suggestion of up to 25 words.",
    scaling: "No change when cast with a higher-level slot."
  },
  summonBeast: {
    name: "Summon Beast", level: 2, school: "Conjuration", classes: ["druid","ranger"],
    time: "Action", range: "90 feet", components: "V, S, M (a feather, tuft of fur, and fish tail inside a gilded acorn worth 200+ GP)", duration: "Concentration, up to 1 hour",
    text: "You call forth a bestial spirit. It manifests in an unoccupied space that you can see within range and uses the Bestial Spirit stat block. When you cast the spell, choose an environment: Air, Land, or Water. The creature resembles an animal of your choice that is native to the chosen environment, which determines certain details in its stat block. The creature disappears when it drops to 0 Hit Points or when the spell ends. The creature is an ally to you and your allies. In combat, the creature shares your Initiative count, but it takes its turn immediately after yours. It obeys your verbal commands (no action required by you). If you don't issue any, it takes the Dodge action and uses its movement to avoid danger. Stat block — Bestial Spirit Small Beast, Neutral AC 11 + the spell's level HP 20 (Air only) or 30 (Land and Water only) + 5 for each spell level above 2 Speed 30 ft.; Climb 30 ft. (Land only); Fly 60 ft. (Air only); Swim 30 ft. (Water only) Mod STR 18 +4 DEX 11 +0 CON 16 +3 Save +4 +0 +3 Mod INT 4 –3 WIS 14 +2 CHA 5 −3 Save –3 +2 −3 Senses Darkvision 60 ft., Passive Perception 12 Languages understands the languages you know CR None (XP 0; PB equals your Proficiency Bonus) Traits Flyby (Air Only). The spirit doesn't provoke Opportunity Attacks when it flies out of an enemy's reach. Pack Tactics (Land and Water Only). The spirit has Advantage on an attack roll against a creature if at least one of the spirit's allies is within 5 feet of the creature and the ally doesn't have the Incapacitated condition. Water Breathing (Water Only). The spirit can breathe only underwater. Actions Multiattack. The spirit makes a number of Rend attacks equal to half this spell's level (round down). Rend. Melee Attack Roll: Bonus equals your spell attack modifier, reach 5 ft. Hit: 1d8 + 4 + the spell's level Piercing damage.",
    higherLevel: "Use the spell slot's level for the spell's level in the stat block.",
    roll: "none", saveAbility: null, damage: null, effect: "Summon a Bestial Spirit (Air, Land, or Water) that fights for you; uses the Bestial Spirit stat block.",
    scaling: "Use the spell slot's level for the spell's level in the stat block."
  },
  wardingBond: {
    name: "Warding Bond", level: 2, school: "Abjuration", classes: ["cleric","paladin"],
    time: "Action", range: "Touch", components: "V, S, M (a pair of platinum rings worth 50+ GP each, which you and the target must wear for the duration)", duration: "1 hour",
    text: "You touch another creature that is willing and create a mystic connection between you and the target until the spell ends. While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has Resistance to all damage. Also, each time it takes damage, you take the same amount of damage. The spell ends if you drop to 0 Hit Points or if you and the target become separated by more than 60 feet. It also ends if the spell is cast again on either of the connected creatures.",
    roll: "none", saveAbility: null, damage: null, effect: "A willing creature gets +1 AC, +1 to saves and Resistance to all damage, but you take the same damage it takes.",
    scaling: "No change when cast with a higher-level slot."
  },
  web: {
    name: "Web", level: 2, school: "Conjuration", classes: ["sorcerer","wizard"],
    time: "Action", range: "60 feet", components: "V, S, M (a bit of spiderweb)", duration: "Concentration, up to 1 hour",
    text: "You conjure a mass of sticky webbing at a point within range. The webs fill a 20-foot Cube there for the duration. The webs are Difficult Terrain, and the area within them is Lightly Obscured. If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet. The first time a creature enters the webs on a turn or starts its turn there, it must succeed on a Dexterity saving throw or have the Restrained condition while in the webs or until it breaks free. A creature Restrained by the webs can take an action to make a Strength (Athletics) check against your spell save DC. If it succeeds, it is no longer Restrained. The webs are flammable. Any 5-foot Cube of webs exposed to fire burns away in 1 round, dealing 2d4 Fire damage to any creature that starts its turn in the fire.",
    roll: "save", saveAbility: "dex", damage: null, effect: "A 20-ft. Cube of webs: Difficult Terrain, Lightly Obscured, and Restrains creatures that fail a Dex save.",
    scaling: "No change when cast with a higher-level slot."
  },
  zoneOfTruth: {
    name: "Zone of Truth", level: 2, school: "Enchantment", classes: ["bard","cleric","paladin"],
    time: "Action", range: "60 feet", components: "V, S", duration: "10 minutes",
    text: "You create a magical zone that guards against deception in a 15-foot-radius Sphere centered on a point within range. Until the spell ends, a creature that enters the spell's area for the first time on a turn or starts its turn there makes a Charisma saving throw. On a failed save, a creature can't speak a deliberate lie while in the radius. You know whether a creature succeeds or fails on this save. An affected creature is aware of the spell and can avoid answering questions to which it would normally respond with a lie. Such a creature can be evasive yet must be truthful.",
    roll: "save", saveAbility: "cha", damage: null, effect: "Creatures in a 15-ft. Sphere that fail can't deliberately lie.",
    scaling: "No change when cast with a higher-level slot."
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
