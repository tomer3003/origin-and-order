#!/usr/bin/perl
# Extract every subclass's features from the PHB raw extract:
#   perl tools/parse-subclasses.pl phb-raw.txt > subclasses.json
# Output: { "<Class>": { "<Subclass name>": [ {level, name, text}, ... ] } }
#
# Two passes. Pass 1 learns each class's subclass names from the all-caps
# "<NAME> SUBCLASS" art markers. Pass 2 starts a subclass at its plain title
# line ("Life Domain"), which — unlike the marker — comes BEFORE the
# subclass's spell list and features; features are the "Level N: Name"
# headings until the next title or the next class's "Level 1:" core feature.
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
open my $f, '<:utf8', shift or die; my @lines = <$f>; close $f; chomp @lines;

my @classes = qw(Barbarian Bard Cleric Druid Fighter Monk Paladin Ranger Rogue Sorcerer Warlock Wizard);
my %isClass = map { $_ => 1 } @classes;

sub clean {
  my $l = shift;
  $l =~ s/^\f+//;
  return undef if $l =~ m{dndbeyond\.com|^\d+/803\s*$|^\d+/\d+/\d+, \d+:\d+\s*[AP]M|^Player.s Handbook\s*$|ARTIST:};
  $l =~ s/\s*Player\x{2019}s Handbook\s*/ /g; $l =~ s/[\x{2018}\x{2019}]/'/g;
  # Dropped fi/fl ligatures (the PDF loses some glyphs).
  $l =~ s/\bPro ciencies\b/Proficiencies/g; $l =~ s/\bpro ciency\b/proficiency/g; $l =~ s/\bpro ciencies\b/proficiencies/g;
  $l =~ s/\bIn ltration\b/Infiltration/g; $l =~ s/\bRe exes\b/Reflexes/g; $l =~ s/\bre exes\b/reflexes/g;
  return $l;
}

# ---- Subclass names per class ----
# The PHB's 48 subclasses. (The all-caps "<NAME> SUBCLASS" art markers would
# be a neater source, but five subclasses have none in the PDF.)
my %SUBCLASSES = (
  Barbarian => ['Path of the Berserker', 'Path of the Wild Heart', 'Path of the World Tree', 'Path of the Zealot'],
  Bard      => ['College of Dance', 'College of Glamour', 'College of Lore', 'College of Valor'],
  Cleric    => ['Life Domain', 'Light Domain', 'Trickery Domain', 'War Domain'],
  Druid     => ['Circle of the Land', 'Circle of the Moon', 'Circle of the Sea', 'Circle of the Stars'],
  Fighter   => ['Battle Master', 'Champion', 'Eldritch Knight', 'Psi Warrior'],
  Monk      => ['Warrior of Mercy', 'Warrior of Shadow', 'Warrior of the Elements', 'Warrior of the Open Hand'],
  Paladin   => ['Oath of Devotion', 'Oath of Glory', 'Oath of the Ancients', 'Oath of Vengeance'],
  Ranger    => ['Beast Master', 'Fey Wanderer', 'Gloom Stalker', 'Hunter'],
  Rogue     => ['Arcane Trickster', 'Assassin', 'Soulknife', 'Thief'],
  Sorcerer  => ['Aberrant Sorcery', 'Clockwork Sorcery', 'Draconic Sorcery', 'Wild Magic Sorcery'],
  Warlock   => ['Archfey Patron', 'Celestial Patron', 'Fiend Patron', 'Great Old One Patron'],
  Wizard    => ['Abjurer', 'Diviner', 'Evoker', 'Illusionist'],
);
my (%names, $class);
for my $c (keys %SUBCLASSES) { $names{$c}{lc $_} = 1 for @{ $SUBCLASSES{$c} }; }

# ---- Pass 2: features ----
my (%out, $sub, $feat); undef $class;
for my $raw (@lines) {
  my $l = clean($raw); next unless defined $l;
  if ($l =~ /^Level 3: (\w+) Subclass\s*$/ && $isClass{$1}) { $class = $1; undef $sub; undef $feat; next; }
  # Chapter 4 ends the class chapter (the last subclass, Illusionist, has no
  # following "Level 1:" to stop it). "Chapter 3" also recurs as a header.
  if ($l =~ /^Chapter (\d+):/ && $1 >= 4) { undef $class; undef $sub; undef $feat; next; }
  next unless $class;
  (my $t = $l) =~ s/^\s+|\s+$//g;
  if ($names{$class}{lc $t} && $t =~ /[a-z]/) {          # plain title line, not the caps marker
    $sub = $t; $out{$class}{$sub} //= []; undef $feat; next;
  }
  next if $t =~ /^[A-Z][A-Z' ]+ SUBCLASS$/;
  if ($t =~ /^Level (\d+): (.+)$/) {
    my ($lvl, $name) = ($1, $2);
    if ($lvl == 1) { undef $sub; undef $feat; $class = undef; next; }   # next class's core features
    next unless $sub;
    # "<X> Spells" belongs to the subclass named X even when the PDF prints
    # it before that subclass's title (Celestial Spells, for one).
    if ($name =~ /^(.+) Spells$/) {
      my $pre = lc $1;
      my ($owner) = grep { lc($_) eq $pre || index(lc $_, "$pre ") == 0 } @{ $SUBCLASSES{$class} };
      if ($owner && $owner ne $sub) { $sub = $owner; $out{$class}{$sub} //= []; }
    }
    # Some headings are printed twice (Diviner, Evoker): keep the first.
    if (grep { $_->{level} == $lvl && $_->{name} eq $name } @{ $out{$class}{$sub} }) { undef $feat; next; }
    $feat = { level => 0 + $lvl, name => $name, text => '' };
    push @{ $out{$class}{$sub} }, $feat; next;
  }
  if ($feat && $t =~ /\S/) {
    next if length($t) > 15 && $t !~ /[a-z]/ && $t !~ /\d/;   # art captions
    $feat->{text} .= ($feat->{text} ? "\n" : '') . $t;
  }
}
print JSON::PP->new->canonical->pretty->encode(\%out);
