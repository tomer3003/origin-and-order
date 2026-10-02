#!/usr/bin/perl
# Build js/data/equipment.js from wikidot's equipment tables (verified
# against the PHB by tools/equipment-verify.pl).
#   perl tools/gen-equipment.pl phb-raw.txt <dir with weapon/armor/tool/adventuring-gear .json> > js/data/equipment.js
# Gear not found in the PHB (wikidot also lists other books' items) is left out.
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
my ($rawPath, $dir) = @ARGV;
open my $r, '<:utf8', $rawPath or die; my $raw = lc do { local $/; <$r> }; close $r;
$raw =~ s/[\x{2018}\x{2019}]/'/g;
sub load { open my $f, '<', shift or die; my $d = JSON::PP->new->utf8->decode(do { local $/; <$f> }); close $f; return $d; }
sub clean {
  my $s = shift // ''; $s =~ s/&#160;/ /g; $s =~ s/\x{bd}/.5/g; $s =~ s/[\x{2013}\x{2014}]/-/g;
  $s =~ s/\s+/ /g; $s =~ s/^\s+|\s+$//g; return $s;
}
sub keyOf {
  my $n = shift; $n =~ s/'//g; $n =~ s/[^A-Za-z0-9]+/ /g;
  my @w = split ' ', $n; my $k = lc(shift @w); $k .= ucfirst(lc $_) for @w; return $k;
}
sub weight {   # "2 lb.", "1/4 lb.", "1 1/2 lb.", "58.5 lb.", "—"
  my $s = clean(shift); return undef if $s eq '-' || $s eq 'Varies' || $s eq '';
  return $1 + $2 / $3 if $s =~ /^(\d+) (\d+)\/(\d+) lb/;
  return $1 / $2 if $s =~ /^(\d+)\/(\d+) lb/;
  my ($n) = $s =~ /([\d.]+)/; return defined $n ? 0 + $n : undef;
}
sub cost {   # -> copper pieces
  my $s = clean(shift); my ($n, $u) = $s =~ /([\d,]+)\s*(CP|SP|EP|GP|PP)/ or return undef;
  $n =~ s/,//g; my %m = (CP => 1, SP => 10, EP => 50, GP => 100, PP => 1000); return $n * $m{$u};
}
my $J = JSON::PP->new->canonical;
my $q = sub { my $v = shift; return defined $v ? $J->allow_nonref->encode($v) : 'null'; };

# ---------------- Weapons ----------------
my @wt = grep { @{ $_->{rows} } && $_->{rows}[0][0] eq 'Name' } @{ load("$dir/weapon.json") };
my @cats = (['simple', 'melee'], ['simple', 'ranged'], ['martial', 'melee'], ['martial', 'ranged']);
my @weapons;
for my $i (0 .. $#wt) {
  my ($cat, $type) = @{ $cats[$i] };
  my @rows = @{ $wt[$i]{rows} }; shift @rows;
  for my $row (@rows) {
    my ($name, $dmg, $props, $mastery, $wgt, $cst) = map { clean($_) } @$row;
    my ($die, $dtype) = $dmg =~ /^(\S+) (\w+)$/;
    my %w = (name => $name, category => $cat, type => $type, damage => $die, damageType => $dtype, mastery => $mastery,
             weight => weight($wgt), cost => cost($cst), propertiesText => ($props eq '-' ? '' : $props));
    my @p;
    for my $part (split /,\s*(?![^()]*\))/, $props) {
      next if $part eq '-' || $part eq '';
      if ($part =~ /^Thrown \(Range (\d+\/\d+)\)/) { push @p, 'Thrown'; $w{range} = $1; }
      elsif ($part =~ /^Ammunition \(Range (\d+\/\d+); (\w+)\)/) { push @p, 'Ammunition'; $w{range} = $1; $w{ammo} = $2; }
      elsif ($part =~ /^Versatile \((\S+)\)/) { push @p, 'Versatile'; $w{versatile} = $1; }
      elsif ($part =~ /^Two-?Handed/) { push @p, 'Two-Handed'; }
      else { push @p, $part; }
    }
    $w{properties} = \@p;
    push @weapons, [keyOf($name), \%w];
  }
}

# ---------------- Ammunition (amount per purchase, storage) ----------------
my @ammo;
for my $t (grep { @{ $_->{rows} } && $_->{rows}[0][0] =~ /^(Arrows|Bolts)/ || ($_->{headers}[0] // '') eq 'Type' } @{ load("$dir/weapon.json") }) {
  for my $row (@{ $t->{rows} }) {
    my ($name, $amount, $storage, $wgt, $cst) = map { clean($_) } @$row;
    next if $name eq 'Type';
    push @ammo, [keyOf($name), { name => $name, amount => 0 + $amount, storage => $storage, weight => weight($wgt), cost => cost($cst) }];
  }
}

# ---------------- Armor details (AC math stays in core.js ARMOR) ----------------
my %armorKey = ('Padded Armor' => 'padded', 'Leather Armor' => 'leather', 'Studded Leather Armor' => 'studded',
  'Hide Armor' => 'hide', 'Chain Shirt' => 'chainShirt', 'Scale Mail' => 'scaleMail', 'Breastplate' => 'breastplate',
  'Half Plate Armor' => 'halfPlate', 'Ring Mail' => 'ringMail', 'Chain Mail' => 'chainMail', 'Splint Armor' => 'splint',
  'Plate Armor' => 'plate', 'Shield' => 'shield');
my @armor;
for my $t (@{ load("$dir/armor.json") }) {
  my ($donDoff) = clean($t->{before}) =~ /\((.*)\)/;
  for my $row (@{ $t->{rows} }) {
    my ($name, $ac, $str, $stealth, $wgt, $cst) = map { clean($_) } @$row;
    my $k = $armorKey{$name} or die "unknown armor $name";
    push @armor, [$k, { name => $name, ac => $ac, strength => ($str eq '-' ? undef : $str), stealth => ($stealth eq '-' ? undef : $stealth),
                         weight => weight($wgt), cost => cost($cst), donDoff => $donDoff }];
  }
}

# ---------------- Tools ----------------
my %toolCat = ('Artisan Tool' => 'artisan', 'Other Tool' => 'other', 'Gaming Set' => 'gaming', 'Musical Instrument' => 'instrument');
my @tools;
for my $t (@{ load("$dir/tool.json") }) {
  my $cat = $toolCat{ $t->{headers}[0] } or next;
  for my $row (@{ $t->{rows} }) {
    my ($name, $ability, $wgt, $cst) = map { clean($_) } @$row;
    push @tools, [keyOf($name), { name => $name, category => $cat, ability => $ability, weight => weight($wgt), cost => cost($cst) }];
  }
}

# ---------------- Gear (PHB only) ----------------
my (@gear, @skipped);
for my $row (@{ load("$dir/adventuring-gear.json")->[0]{rows} }) {
  my ($name, $wgt, $cst, $fn) = map { clean($_) } @$row;
  next if $name eq 'Item';
  (my $look = lc $name) =~ s/\s*\(.*\)$//;
  unless (index($raw, $look) >= 0) { push @skipped, $name; next; }
  my %g = (name => $name, weight => weight($wgt), cost => cost($cst));
  if ($fn =~ /contains the following items: (.*)\.$/) {
    my $list = $1; $list =~ s/,? and /, /;
    $g{contents} = [ map { clean($_) } split /,\s*/, $list ];
  }
  push @gear, [keyOf($name), \%g];
}

# ---------------- Emit ----------------
sub table { my ($name, $rows) = @_; return "export const $name = {\n" . join(",\n", map { "  $_->[0]: " . $J->encode($_->[1]) } @$rows) . "\n};\n"; }
print <<'HEAD';
/* Equipment — 2024 PHB chapter 6, generated by tools/gen-equipment.pl from
   dnd2024.wikidot.com's tables after tools/equipment-verify.pl checked them
   against the PHB (weapon mastery/cost/weight in order, damage, armor,
   tool and gear names). Regenerate rather than hand-edit the tables.

   Costs are in copper pieces (1 GP = 100). Weights are in pounds; null
   where the book gives "—" or "Varies". Armor AC math lives in core.js
   ARMOR (same keys); ARMOR_DETAILS adds weight, cost, don/doff. Gear
   descriptions are not reproduced; packs list their contents.
   Shield's don/doff line carries the official errata wording. */

HEAD
print table('WEAPONS', \@weapons), "\n", table('AMMUNITION', \@ammo), "\n", table('ARMOR_DETAILS', \@armor), "\n", table('TOOLS', \@tools), "\n", table('GEAR', \@gear);
print "\n/* Left out — not in the PHB: ", join(", ", @skipped), ". */\n" if @skipped;
