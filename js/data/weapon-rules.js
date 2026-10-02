/* Weapon properties and mastery properties — 2024 PHB chapter 6, in our
   own short words (never book prose). Shown in weapon tooltips and on the
   sheet's attack lines. */

export const WEAPON_PROPERTIES = {
  "Ammunition": "Ranged attacks need matching ammunition; each attack spends one. After a fight, a minute's search recovers half of what you used.",
  "Finesse": "Use your choice of Strength or Dexterity for the attack and damage rolls (the same one for both).",
  "Heavy": "Disadvantage on attacks with it if your Strength (melee) or Dexterity (ranged) is below 13.",
  "Light": "After attacking with it as part of the Attack action, you can attack with a different Light weapon as a Bonus Action, adding no ability modifier to that damage unless it's negative.",
  "Loading": "You fire only one piece of ammunition per action, Bonus Action, or Reaction, however many attacks you have.",
  "Range": "Normal/long range: attacks beyond normal range have Disadvantage, and you can't attack beyond long range.",
  "Reach": "Adds 5 feet to your reach for attacks and Opportunity Attacks.",
  "Thrown": "Throw it for a ranged attack, using the same ability modifier you'd use to attack with it in melee.",
  "Two-Handed": "Needs two hands to attack with it.",
  "Versatile": "Use one or two hands; the second damage die is for two-handed attacks."
};

export const WEAPON_MASTERIES = {
  "Cleave": "On a melee hit, once per turn, attack a second creature within 5 ft. of the first that's also in your reach; it takes the weapon's damage without your ability modifier (unless negative).",
  "Graze": "On a miss, the target still takes damage equal to the ability modifier you attacked with, of the weapon's damage type.",
  "Nick": "The Light property's extra attack becomes part of the Attack action instead of a Bonus Action (once per turn).",
  "Push": "On a hit, push a Large or smaller creature up to 10 ft. straight away from you.",
  "Sap": "On a hit, the target has Disadvantage on its next attack roll before the start of your next turn.",
  "Slow": "On a damaging hit, the target's Speed drops by 10 ft. until the start of your next turn (doesn't stack).",
  "Topple": "On a hit, the target makes a Constitution save (DC 8 + your attack's ability modifier + Proficiency Bonus) or falls Prone.",
  "Vex": "On a damaging hit, you have Advantage on your next attack roll against that creature before the end of your next turn."
};
