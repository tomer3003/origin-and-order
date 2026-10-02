#!/usr/bin/perl
# Build js/data/spells.js from the PHB parse (normalized.json) plus the
# hand-written TL;DR fields already in the current spells.js, plus the
# effect lines below for spells new in this pass.
# Usage: perl gen.pl normalized.json current-spells.js > new-spells.js
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
my ($normPath, $curPath) = @ARGV;

open my $nf, '<', $normPath or die; my $norm = JSON::PP->new->utf8->decode(do { local $/; <$nf> }); close $nf;
open my $cf, '<:utf8', $curPath or die; my $cur = do { local $/; <$cf> }; close $cf;

# ---- Read the current SPELLS object literal as JSON. ----
my ($obj) = $cur =~ /export const SPELLS = (\{.*?\n\});/s or die "no SPELLS";
my $json = jsToJson($obj);
my $existing = JSON::PP->new->decode($json);

my %BOOK = map { $_ => 1 } qw(name level school classes time range components duration text higherLevel grantedOnly ritual);

# ---- Effect lines for spells new in this pass (our own words). ----
my %EFFECT = (
  bladeWard => "Attackers subtract 1d4 from attack rolls against you.",
  resistance => "One willing creature reduces damage of a chosen type by 1d4, once per turn.",
  sorcerousBurst => "Choose the damage type (Acid, Cold, Fire, Lightning, Poison, Psychic, or Thunder); each 8 rolled adds another d8, up to your spellcasting modifier in extra dice.",
  starryWisp => "On a hit the target sheds Dim Light and can't benefit from being Invisible until the end of your next turn.",
  tollTheDead => "1d12 instead if the target is missing any Hit Points.",
  armorOfAgathys => "5 Temporary Hit Points; a creature that hits you with a melee attack takes 5 Cold damage while they last.",
  armsOfHadar => "Each creature in a 10-ft. Emanation; on a failure it also can't take Reactions until its next turn. Half damage on a success.",
  compelledDuel => "Target has Disadvantage attacking anyone but you and can't willingly move more than 30 ft. away from you.",
  dissonantWhispers => "On a failure the target must use its Reaction to flee from you. Half damage on a success.",
  divineSmite => "Bonus Action after hitting: extra Radiant damage, +1d8 against Fiends and Undead.",
  ensnaringStrike => "Bonus Action after hitting: target is Restrained and takes 1d6 Piercing each turn; Large or bigger targets have Advantage on the save.",
  expeditiousRetreat => "Dash now, then Dash as a Bonus Action each turn.",
  grease => "10-ft. square of Difficult Terrain; creatures in it fall Prone on a failed save.",
  hailOfThorns => "Bonus Action after a ranged hit: the target and creatures within 5 ft. of it save. Half damage on a success.",
  hellishRebuke => "Reaction when a creature damages you. Half damage on a success.",
  hex => "Extra 1d6 Necrotic on each of your hits against the target, and Disadvantage on checks with one ability; move it to a new target when the old one drops to 0 HP.",
  iceKnife => "1d10 Piercing on a hit, then the shard bursts: target and creatures within 5 ft. save against 2d6 Cold.",
  rayOfSickness => "On a hit the target is also Poisoned until the end of your next turn.",
  thunderousSmite => "Bonus Action after hitting: extra Thunder damage; a creature failing the save is pushed 10 ft. and knocked Prone.",
  wrathfulSmite => "Bonus Action after hitting: extra Necrotic damage, and the target is Frightened on a failed save (it repeats the save each turn).",
  aid => "Up to three creatures gain +5 to current and maximum Hit Points for 8 hours.",
  alterSelf => "Choose aquatic adaptation, changed appearance, or natural weapons; switch between them as a Magic action.",
  animalMessenger => "A Tiny Beast carries a message of up to 25 words to a recipient at a place you've visited.",
  arcaneLock => "Magically locks a door, window, or container; others need a DC +10 to break it or pick it.",
  arcaneVigor => "Spend one or two Hit Point Dice and heal their total plus your spellcasting modifier.",
  augury => "Get an omen (weal, woe, both, or neither) about a plan within the next 30 minutes.",
  barkskin => "A willing creature's AC can't be lower than 17.",
  beastSense => "Perceive through a willing Beast's senses.",
  blindnessDeafness => "Target is Blinded or Deafened (your choice), repeating the save each turn.",
  blur => "Attackers have Disadvantage against you unless they have Blindsight or Truesight.",
  calmEmotions => "Humanoids in a 20-ft. Sphere either become immune to Charmed and Frightened, or stop being Hostile toward chosen creatures.",
  cloudOfDaggers => "A 5-ft. Cube of daggers damages anyone in it or entering it; move it as a Magic action.",
  continualFlame => "A heatless, permanent flame on an object: Bright Light 20 ft., Dim Light 20 ft. more.",
  cordonOfArrows => "Plant up to four pieces of ammunition that shoot creatures coming within 30 ft. (1d6 Piercing each on a failed Dex save).",
  crownOfMadness => "A Charmed Humanoid must attack a creature you choose on each of its turns.",
  darkness => "Magical Darkness in a 15-ft. Sphere that Darkvision can't penetrate.",
  darkvision => "A willing creature gains 150-ft. Darkvision for 8 hours.",
  dragonsBreath => "A willing creature can exhale a 15-ft. Cone of a damage type you choose as a Magic action.",
  enhanceAbility => "Advantage on ability checks with one chosen ability.",
  enlargeReduce => "Grow or shrink a creature or object one size; Enlarge adds 1d4 to its weapon damage, Reduce subtracts 1d4.",
  enthrall => "Creatures that fail have -10 to Perception checks and Passive Perception.",
  findSteed => "Summon a loyal Large steed (Celestial, Fey, or Fiend) that fights with you; uses the Otherworldly Steed stat block.",
  findTraps => "Sense whether a trap is within range and line of sight, though not its location.",
  flameBlade => "A fiery scimitar you attack with as a Magic action: 3d6 Fire plus your spellcasting modifier on a hit.",
  flamingSphere => "A rolling 5-ft. sphere of fire you move as a Bonus Action; creatures ending a turn near it save. Half damage on a success.",
  gentleRepose => "Stops a corpse decaying or becoming Undead; the time doesn't count against raising it.",
  gustOfWind => "A 60-ft. Line of wind pushes creatures 15 ft. on a failed save and disperses gas or vapor.",
  heatMetal => "A metal object glows hot, burning whoever touches it; Bonus Action to deal the damage again.",
  holdPerson => "A Humanoid is Paralyzed, repeating the save each turn.",
  knock => "Unlocks a mundane lock or suppresses Arcane Lock for 10 minutes; makes a loud knock.",
  lesserRestoration => "End Blinded, Deafened, Paralyzed, or Poisoned on one creature.",
  levitate => "A creature or object up to 500 lb. rises up to 20 ft. and hangs there.",
  locateAnimalsOrPlants => "Learn the direction and distance to the nearest named kind of Beast or plant within 5 miles.",
  locateObject => "Sense the direction to a familiar object within 1,000 ft.; blocked by lead.",
  magicMouth => "An object speaks a message of up to 25 words when its trigger condition is met.",
  magicWeapon => "A nonmagical weapon becomes +1 to attack and damage rolls.",
  melfsAcidArrow => "On a hit: 4d4 Acid now and 2d4 Acid at the end of its next turn; half the initial damage on a miss.",
  mindSpike => "On a failure you also know the target's location while you're on the same plane. Half damage on a success.",
  mirrorImage => "Three duplicates; each hit may land on a duplicate instead (d6 roll), destroying it.",
  moonbeam => "A 5-ft.-radius Cylinder of moonlight you can move; shapechangers have Disadvantage and revert. Half damage on a success.",
  nystulsMagicAura => "Hide a creature's type or give an object a false magical aura against detection magic.",
  passWithoutTrace => "You and chosen creatures in a 30-ft. Emanation get +10 to Stealth checks and leave no tracks.",
  phantasmalForce => "Only the target perceives an illusion, which deals 2d8 Psychic damage on each of your turns if it's harmful.",
  prayerOfHealing => "Up to five creatures get the benefits of a Short Rest and regain 2d8 Hit Points.",
  protectionFromPoison => "Ends Poisoned; Advantage on saves against Poisoned and Resistance to Poison damage.",
  rayOfEnfeeblement => "On a failure the target has Disadvantage on Strength-based D20 Tests; on a success, on its next attack roll.",
  ropeTrick => "A rope leads to an invisible extradimensional space that holds up to eight Medium creatures.",
  scorchingRay => "Three rays, each its own ranged spell attack.",
  seeInvisibility => "See Invisible creatures and objects and into the Ethereal Plane.",
  shatter => "Each creature in a 10-ft. Sphere; Constructs have Disadvantage. Half damage on a success.",
  shiningSmite => "Bonus Action after hitting: extra Radiant damage; the target glows, attacks against it have Advantage, and it can't be Invisible.",
  silence => "No sound in a 20-ft. Sphere: creatures inside are Deafened and can't cast spells with Verbal components.",
  spiderClimb => "A willing creature can climb walls and ceilings, with a Climb Speed equal to its Speed.",
  spikeGrowth => "A 20-ft. Sphere of Difficult Terrain; 2d4 Piercing for every 5 ft. a creature moves through it.",
  spiritualWeapon => "A floating weapon: melee spell attack for 1d8 plus your spellcasting modifier Force damage; Bonus Action to move it and attack again.",
  suggestion => "A creature that fails follows a reasonable suggestion of up to 25 words.",
  summonBeast => "Summon a Bestial Spirit (Air, Land, or Water) that fights for you; uses the Bestial Spirit stat block.",
  wardingBond => "A willing creature gets +1 AC, +1 to saves and Resistance to all damage, but you take the same damage it takes.",
  web => "A 20-ft. Cube of webs: Difficult Terrain, Lightly Obscured, and Restrains creatures that fail a Dex save.",
  zoneOfTruth => "Creatures in a 15-ft. Sphere that fail can't deliberately lie.",
);

# Damage strings the "XdY Type damage" pattern gets wrong or misses.
my %DAMAGE = (
  web => undef,
  sorcerousBurst => "1d8 of a type you choose",
  flameBlade => "3d6 Fire + spellcasting modifier",
  spiritualWeapon => "1d8 Force + spellcasting modifier",
  dragonsBreath => "3d6 of the chosen type",
  armorOfAgathys => "5 Cold (to melee attackers)",
);

# Book-text repairs the PDF needs.
sub fixText {
  my $t = shift // '';
  $t =~ s/\s*\x{2191}\s*[A-Z' ]*$//;                       # trailing art arrows / captions
  $t =~ s/\bthe rst\b/the first/g;                          # dropped "fi" ligature
  $t =~ s/\bthe spells ends\b/the spell ends/g;             # PDF typo
  $t =~ s/level about (\d)/level above $1/g;                # PDF typo
  $t =~ s/Omens Omen Weal Woe Weal and woe Indifference For Results That Will Be\.\.\. Good Bad Good and bad Neither good nor bad/Omens: Weal (results will be good), Woe (bad), Weal and woe (good and bad), or Indifference (neither good nor bad)./;
  $t =~ s/\s+/ /g; $t =~ s/^\s+|\s+$//g;
  return $t;
}

my $ord = sub { my $n = shift; return $n == 1 ? '1st' : $n == 2 ? '2nd' : $n == 3 ? '3rd' : "${n}th"; };
sub autoScaling {
  my ($h, $ord) = @_;
  return "No change when cast with a higher-level slot." unless $h;
  return "+$2 $1 damage per slot level above " . $ord->($3) . "."
    if $h =~ /^The (\w+(?: and \w+)?) damage increases? by (\d+d\d+) for each spell slot level above (\d)\.$/;
  return "+$1 damage per slot level above " . $ord->($2) . "."
    if $h =~ /^The damage increases by (\d+d\d+) for each spell slot level above (\d)\.$/;
  return "+$1 healing per slot level above " . $ord->($2) . "."
    if $h =~ /^The healing increases by (\d+d\d+) for each spell slot level above (\d)\.$/;
  return "+1 target per slot level above " . $ord->($1) . "."
    if $h =~ /^You can target one additional creature for each spell slot level above (\d)\.$/;
  return $h;
}

my %OUT;
for my $key (keys %$norm) {
  my $b = $norm->{$key};
  my $e = $existing->{$key} || {};
  my %s;
  $s{$_} = $b->{$_} for qw(name level school classes time range components duration);
  $s{text} = fixText($b->{text});
  my $hl = fixText($b->{higherLevel});
  $s{higherLevel} = $hl if length $hl;
  $s{ritual} = JSON::PP::true if $b->{time} =~ /Ritual/;

  # Hand-written fields from the existing entry win; otherwise derive them.
  my %hand = map { $_ => $e->{$_} } grep { !$BOOK{$_} } keys %$e;
  unless (exists $hand{roll}) {
    my $t = $s{text};
    my ($atk) = $t =~ /(make (?:a|an) (?:ranged|melee) (?:spell )?attack)/i;
    my ($sv) = $t =~ /(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) saving throw/;
    my $ai = defined $atk ? index($t, $atk) : 1e9; my $si = defined $sv ? index($t, "$sv saving throw") : 1e9;
    if ($ai < $si) { $hand{roll} = "attack"; $hand{saveAbility} = undef; }
    elsif (defined $sv) { $hand{roll} = "save"; $hand{saveAbility} = lc substr($sv, 0, 3); }
    else { $hand{roll} = "none"; $hand{saveAbility} = undef; }
    my ($dice, $type) = $t =~ /(\d+d\d+) (Acid|Bludgeoning|Cold|Fire|Force|Lightning|Necrotic|Piercing|Poison|Psychic|Radiant|Slashing|Thunder) damage/;
    $hand{damage} = defined $dice ? "$dice $type" : undef;
    $hand{effect} = $EFFECT{$key} // undef;
    warn "no effect line for $key\n" unless defined $EFFECT{$key};
  }
  $hand{scaling} = autoScaling($hl, $ord) if $s{level} > 0 && !exists $hand{scaling};
  $hand{damage} = $DAMAGE{$key} if exists $DAMAGE{$key};
  %s = (%s, %hand);
  $OUT{$key} = \%s;
}

# ---- Emit. ----
my @order = sort { $OUT{$a}{level} <=> $OUT{$b}{level} || $OUT{$a}{name} cmp $OUT{$b}{name} } keys %OUT;
my $J = JSON::PP->new->canonical->allow_nonref;
my $q = sub { my $v = shift; return 'null' unless defined $v; return $J->encode($v); };
my @fieldOrder = qw(name level school classes ritual time range components duration text higherLevel roll saveAbility damage effect scaling);

my ($head) = $cur =~ /^(.*?)export const SPELLS = \{/s;
my ($tail) = $cur =~ /\n\};\n(\nexport const SPELL_KEYS.*)$/s;
$head =~ s/   COVERAGE NOTE.*?\*\//   COVERAGE: every cantrip, level 1 and level 2 spell in the 2024 PHB\n   (34 + 64 + 63), parsed from the PDF text and then repaired by hand where\n   the PDF loses glyphs (see PROGRESS.md). Levels 3-9 are still to come. *\//s;

my $outStr = $head . "export const SPELLS = {";
my $lastLevel = -1; my @chunks;
for my $k (@order) {
  my $s = $OUT{$k};
  if ($s->{level} != $lastLevel) {
    $lastLevel = $s->{level};
    push @chunks, "\n  /* ---------------- " . ($lastLevel == 0 ? "Cantrips" : "Level $lastLevel") . " ---------------- */";
  }
  my @extra = sort grep { my $f = $_; !grep { $_ eq $f } @fieldOrder } keys %$s;
  my @lines;
  push @lines, "    name: " . $q->($s->{name}) . ", level: $s->{level}, school: " . $q->($s->{school}) . ", classes: " . $J->encode($s->{classes}) . ($s->{ritual} ? ", ritual: true" : "") . ",";
  push @lines, "    time: " . $q->($s->{time}) . ", range: " . $q->($s->{range}) . ", components: " . $q->($s->{components}) . ", duration: " . $q->($s->{duration}) . ",";
  push @lines, "    text: " . $q->($s->{text}) . ",";
  push @lines, "    higherLevel: " . $q->($s->{higherLevel}) . "," if defined $s->{higherLevel};
  push @lines, "    roll: " . $q->($s->{roll}) . ", saveAbility: " . $q->($s->{saveAbility}) . ", damage: " . $q->($s->{damage}) . ", effect: " . $q->($s->{effect}) . ",";
  push @lines, "    scaling: " . $q->($s->{scaling}) . "," if defined $s->{scaling};
  push @lines, "    $_: " . $q->($s->{$_}) . "," for @extra;
  $lines[-1] =~ s/,$//;
  push @chunks, "  $k: {\n" . join("\n", @lines) . "\n  },";
}
$chunks[-1] =~ s/,$//;
$outStr .= join("\n", @chunks) . "\n};\n" . $tail;
print $outStr;

# Minimal JS-object-literal → JSON: drop comments, quote bare keys, drop
# trailing commas — all only outside string literals.
sub jsToJson {
  my $src = shift; my $o = ''; my $i = 0; my $n = length $src;
  while ($i < $n) {
    my $c = substr($src, $i, 1);
    if ($c eq '"') {
      my $j = $i + 1;
      while ($j < $n) { my $d = substr($src, $j, 1); if ($d eq '\\') { $j += 2; next; } last if $d eq '"'; $j++; }
      $o .= substr($src, $i, $j - $i + 1); $i = $j + 1; next;
    }
    if (substr($src, $i, 2) eq '/*') { my $j = index($src, '*/', $i + 2); $i = $j + 2; next; }
    if (substr($src, $i, 2) eq '//') { my $j = index($src, "\n", $i); $i = $j; next; }
    if ($c =~ /[A-Za-z_]/ && $o =~ /[{,]\s*$/) {
      my ($id) = substr($src, $i) =~ /^([A-Za-z_]\w*)\s*:/;
      if (defined $id) { $o .= "\"$id\""; $i += length $id; next; }
    }
    $o .= $c; $i++;
  }
  $o =~ s/,(\s*[}\]])/$1/g;
  return $o;
}
