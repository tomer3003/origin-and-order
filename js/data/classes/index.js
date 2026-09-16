/* All 12 classes, collected. Import CLASSES from here; never reach into
   the individual class modules from the UI layer. */

import { barbarian } from "./barbarian.js";
import { bard }      from "./bard.js";
import { cleric }    from "./cleric.js";
import { druid }     from "./druid.js";
import { fighter }   from "./fighter.js";
import { monk }      from "./monk.js";
import { paladin }   from "./paladin.js";
import { ranger }    from "./ranger.js";
import { rogue }     from "./rogue.js";
import { sorcerer }  from "./sorcerer.js";
import { warlock }   from "./warlock.js";
import { wizard }    from "./wizard.js";

export const CLASSES = {
  barbarian, bard, cleric, druid, fighter, monk,
  paladin, ranger, rogue, sorcerer, warlock, wizard
};

/* Display order for the class picker: alphabetical, which is also the
   order the PHB uses. */
export const CLASS_KEYS = Object.keys(CLASSES);

/* Which classes contribute to the multiclass caster-level calculation, and
   how much. Subclass-driven third casters are handled separately because
   they only count once that subclass has been chosen. */
export const CASTER_WEIGHT = {
  bard: 1, cleric: 1, druid: 1, sorcerer: 1, wizard: 1,
  paladin: 0.5, ranger: 0.5
};

/* Subclass keys that make their class a third caster. */
export const THIRD_CASTER_SUBCLASSES = {
  fighter: "eldritchKnight",
  rogue: "arcaneTrickster"
};
