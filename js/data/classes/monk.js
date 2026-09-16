/* Monk — 2024 rules.
   Feature text is our own short mechanical paraphrase, never book prose. */

export const monk = {
  key: "monk",
  name: "Monk",
  tagline: "A martial artist who channels inner focus into speed and strikes",
  primary: "Dexterity and Wisdom",
  hitDie: 8,
  saves: ["str", "dex"],
  skillCount: 2,
  skillOptions: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"],
  weaponProf: "Simple weapons and Martial weapons with the Light property",
  armorTraining: "None",
  toolProf: "One type of Artisan's Tools or one Musical Instrument of your choice",
  multiclassGrants: "Hit Point Die only",
  equipment: [
    { key: "A", label: "Spear, 5 Daggers, your chosen Artisan's Tools or Musical Instrument, Explorer's Pack, 11 GP", armor: "none", shield: false },
    { key: "B", label: "50 GP to spend freely", armor: "none", shield: false }
  ],
  /* Unarmored Defense: 10 + Dex + Wis, and no Shield allowed. */
  unarmoredDefense: ["dex", "wis"],
  unarmoredDefenseNoShield: true,
  caster: null,
  asiLevels: [4, 8, 12, 16],
  epicBoonLevel: 19,
  subclassLevel: 3,
  subclassLabel: "Monk Subclass",

  tracks: [
    { label: "Martial Arts Die", byLevel: ["1d6", "1d6", "1d6", "1d6", "1d8", "1d8", "1d8", "1d8", "1d8", "1d8", "1d10", "1d10", "1d10", "1d10", "1d10", "1d10", "1d12", "1d12", "1d12", "1d12"] },
    { label: "Focus Points", byLevel: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
    { label: "Unarmored Movement", prefix: "+", suffix: " ft.", byLevel: [0, 10, 10, 10, 10, 15, 15, 15, 15, 20, 20, 20, 20, 25, 25, 25, 25, 30, 30, 30] }
  ],

  features: {
    1: [
      { name: "Martial Arts", text: "Unarmed and using only Monk weapons (Simple melee, or Martial melee with the Light property) with no armor or Shield: make an Unarmed Strike as a Bonus Action, roll your Martial Arts die in place of normal damage, and use Dexterity instead of Strength for those attacks and for Grapple and Shove DCs." },
      { name: "Unarmored Defense", text: "With no armor and no Shield, AC = 10 + Dex modifier + Wis modifier." }
    ],
    2: [
      { name: "Monk's Focus", text: "Focus Points equal to your Monk level (from level 2), all refilled on a Short or Long Rest, with a save DC of 8 + Wis modifier + Proficiency Bonus. Flurry of Blows — 1 point for two Unarmed Strikes as a Bonus Action. Patient Defense — Disengage as a Bonus Action free, or 1 point for Disengage plus Dodge. Step of the Wind — Dash as a Bonus Action free, or 1 point for Disengage plus Dash with doubled jump distance." },
      { name: "Unarmored Movement", text: "+10 ft. Speed with no armor or Shield, rising to +15/+20/+25/+30 ft. at levels 6/10/14/18." },
      { name: "Uncanny Metabolism", text: "On rolling Initiative, refill all Focus Points and regain your Monk level + one Martial Arts die in HP. Once per Long Rest." }
    ],
    3: [
      { name: "Deflect Attacks", text: "Reaction when a hit deals Bludgeoning, Piercing, or Slashing damage: reduce it by 1d10 + Dex modifier + Monk level. Reduce it to 0 and you can spend 1 Focus Point to force a Dex save on a creature within 5 ft. (melee) or 60 ft. (ranged) for two Martial Arts dice + Dex in the attack's damage type." }
    ],
    4: [
      { name: "Slow Fall", text: "Reaction when you fall: cut the fall damage by five times your Monk level." }
    ],
    5: [
      { name: "Extra Attack", text: "Attack twice when you take the Attack action." },
      { name: "Stunning Strike", text: "Once per turn on a Monk weapon or Unarmed Strike hit, spend 1 Focus Point: Con save or the target is Stunned until the start of your next turn. On a success its Speed is halved and the next attack against it has Advantage." }
    ],
    6: [
      { name: "Empowered Strikes", text: "Unarmed Strikes can deal Force damage instead of their normal type." }
    ],
    7: [
      { name: "Evasion", text: "On a Dexterity save for half damage, take none on a success and half on a failure. Not while Incapacitated." }
    ],
    9: [
      { name: "Acrobatic Movement", text: "With no armor or Shield, move along vertical surfaces and across liquids on your turn without falling." }
    ],
    10: [
      { name: "Heightened Focus", text: "Flurry of Blows makes three strikes. Patient Defense also grants two Martial Arts dice in Temporary HP. Step of the Wind can carry a willing Large-or-smaller creature within 5 ft. along with you, provoking nothing." },
      { name: "Self-Restoration", text: "End Charmed, Frightened, or Poisoned on yourself at the end of each of your turns, and going without food or drink no longer causes Exhaustion." }
    ],
    13: [
      { name: "Deflect Energy", text: "Deflect Attacks now works against any damage type." }
    ],
    14: [
      { name: "Disciplined Survivor", text: "Proficiency in all saving throws, and you can spend 1 Focus Point to reroll a failed save (taking the new roll)." }
    ],
    15: [
      { name: "Perfect Focus", text: "On rolling Initiative without using Uncanny Metabolism, top your Focus Points back up to 4 if you have 3 or fewer." }
    ],
    18: [
      { name: "Superior Defense", text: "At the start of your turn, spend 3 Focus Points for Resistance to all damage except Force for 1 minute or until Incapacitated." }
    ],
    20: [
      { name: "Body and Mind", text: "Dexterity and Wisdom each increase by 4, to a maximum of 25." }
    ]
  },

  subclasses: {
    mercy: {
      name: "Warrior of Mercy",
      blurb: "Hands that heal and hands that harm",
      features: {
        3: [
          { name: "Hand of Harm", text: "Once per turn on an Unarmed Strike hit, spend 1 Focus Point for extra Necrotic damage equal to one Martial Arts die + your Wisdom modifier." },
          { name: "Hand of Healing", text: "Magic action, 1 Focus Point: touch a creature to restore one Martial Arts die + your Wisdom modifier in HP. You can also swap one Flurry of Blows strike for it without paying the healing's point." },
          { name: "Implements of Mercy", text: "Gain Insight and Medicine proficiency and Herbalism Kit proficiency." }
        ],
        6: [{ name: "Physician's Touch", text: "Hand of Harm also Poisons the target until the end of your next turn. Hand of Healing also ends one of Blinded, Deafened, Paralyzed, Poisoned, or Stunned." }],
        11: [{ name: "Flurry of Healing and Harm", text: "Flurry of Blows can replace every strike with a free Hand of Healing, and a damaging Flurry strike can carry a free Hand of Harm (still once per turn). Uses = Wisdom modifier (min 1) per Long Rest." }],
        17: [{ name: "Hand of Ultimate Mercy", text: "Magic action, 5 Focus Points: touch a corpse dead under 24 hours to revive it with 4d10 + your Wisdom modifier HP, clearing Blinded, Deafened, Paralyzed, Poisoned, and Stunned. Once per Long Rest." }]
      }
    },
    shadow: {
      name: "Warrior of Shadow",
      blurb: "Shadowfell power turned to stealth and subterfuge",
      features: {
        3: [{ name: "Shadow Arts", text: "Spend 1 Focus Point to cast Darkness with no components, seeing inside it and moving its area 60 ft. at the start of each of your turns. You also gain 60 ft. of Darkvision (or +60 ft. if you had it) and know Minor Illusion, cast using Wisdom." }],
        6: [{ name: "Shadow Step", text: "While entirely in Dim Light or Darkness, Bonus Action: teleport 60 ft. to another such space and gain Advantage on your next melee attack this turn." }],
        11: [{ name: "Improved Shadow Step", text: "Spend 1 Focus Point to use Shadow Step from and to anywhere, and make an Unarmed Strike right after the teleport." }],
        17: [{ name: "Cloak of Shadows", text: "Magic action while in Dim Light or Darkness, 3 Focus Points: for 1 minute you have the Invisible condition, move through occupied spaces as Difficult Terrain, and use Flurry of Blows for free. Ends early if Incapacitated or if you end a turn in Bright Light." }]
      }
    },
    elements: {
      name: "Warrior of the Elements",
      blurb: "Elemental Chaos briefly tamed and worn",
      features: {
        3: [
          { name: "Elemental Attunement", text: "At the start of your turn, spend 1 Focus Point for 10 minutes of elemental energy: Unarmed Strike reach grows 10 ft., and those strikes can deal Acid, Cold, Fire, Lightning, or Thunder damage and force a Str save to move the target 10 ft. toward or away from you." },
          { name: "Manipulate Elements", text: "You know the Elementalism cantrip, cast using Wisdom." }
        ],
        6: [{ name: "Elemental Burst", text: "Magic action, 2 Focus Points: a 20-ft.-radius Sphere within 120 ft. forces a Dex save for three Martial Arts dice of Acid, Cold, Fire, Lightning, or Thunder damage, half on a success." }],
        11: [{ name: "Stride of the Elements", text: "While Elemental Attunement is active you also have a Fly Speed and Swim Speed equal to your Speed." }],
        17: [{ name: "Elemental Epitome", text: "While attuned: Resistance to one element, rechosen each turn; Step of the Wind adds +20 ft. Speed and deals one Martial Arts die of elemental damage to each chosen creature you move next to (once each per turn); and once per turn an Unarmed Strike deals an extra Martial Arts die of its own damage type." }]
      }
    },
    openHand: {
      name: "Warrior of the Open Hand",
      blurb: "Pure unarmed technique, pushing and toppling foes",
      features: {
        3: [{ name: "Open Hand Technique", text: "Each Flurry of Blows hit can Addle (no Opportunity Attacks until its next turn), Push (Str save or shoved 15 ft.), or Topple (Dex save or Prone)." }],
        6: [{ name: "Wholeness of Body", text: "Bonus Action: regain one Martial Arts die + your Wisdom modifier HP (min 1). Uses = Wisdom modifier (min 1) per Long Rest." }],
        11: [{ name: "Fleet Step", text: "Taking any Bonus Action other than Step of the Wind lets you use Step of the Wind straight after it." }],
        17: [{ name: "Quivering Palm", text: "On an Unarmed Strike hit, spend 4 Focus Points to plant vibrations lasting days equal to your Monk level. End them with an action (or by forgoing an attack) while on the same plane: Con save or 10d12 Force damage, half on a success. One target at a time; you can also end them harmlessly." }]
      }
    }
  }
};
