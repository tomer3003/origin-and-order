#!/usr/bin/perl
# Verify wikidot's equipment tables against the PHB raw extract.
#   perl tools/equipment-verify.pl phb-raw.txt <dir with weapon.json armor.json tool.json adventuring-gear.json>
# The PHB's tables come out column-major in the raw extract (all of one
# column, then the next), page by page, but row order within a column holds.
# So: ordered comparison for the clean single-token columns (weapon mastery,
# weight, cost; armor AC/strength/stealth/weight/cost), multiset comparison
# for the rest (damage, names), set membership for tools and gear.
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
my ($rawPath, $dir) = @ARGV;
open my $r, '<:utf8', $rawPath or die; my $raw = do { local $/; <$r> }; close $r;
$raw =~ s/\f//g; $raw =~ s/[\x{2018}\x{2019}]/'/g; $raw =~ s/[\x{2013}\x{2014}\x{2212}]/-/g;
sub load { open my $f, '<', shift or die; my $d = JSON::PP->new->utf8->decode(do { local $/; <$f> }); close $f; return $d; }
sub clean { my $s = shift // ''; $s =~ s/&#160;/ /g; $s =~ s/\s+/ /g; $s =~ s/^\s+|\s+$//g; $s =~ s/[\x{2013}\x{2014}]/-/g; return $s; }
my $fail = 0;
sub cmpSeq {
  my ($label, $book, $wiki) = @_;
  my $b = join ' | ', @$book; my $w = join ' | ', @$wiki;
  if ($b eq $w) { printf "OK   %-28s %d values in order\n", $label, scalar @$wiki; return; }
  $fail++; printf "DIFF %-28s\n  book: %s\n  wiki: %s\n", $label, $b, $w;
}
sub cmpBag { my ($label, $book, $wiki) = @_; cmpSeq("$label (unordered)", [sort @$book], [sort @$wiki]); }

# ---------------- Weapons ----------------
my @wt = grep { @{ $_->{rows} } && $_->{rows}[0][0] eq 'Name' } @{ load("$dir/weapon.json") };
my @weapons = map { my @r = @{ $_->{rows} }; shift @r; map { [ map { clean($_) } @$_ ] } @r } @wt;
my ($ws) = $raw =~ /(Simple Melee Weapons.*?)Mastery Properties/s; die "no weapons region" unless $ws;
my ($pre) = $raw =~ /(.{0,1500})Simple Melee Weapons/s;   # page 1's Name/Damage columns sit just before
my $region = $pre . $ws;
my @mast = $region =~ /\b(Cleave|Graze|Nick|Push|Sap|Slow|Topple|Vex)\b/g;
cmpSeq("weapon mastery", \@mast, [ map { $_->[3] } @weapons ]);
my @wgt = $region =~ /(\d+(?:\/\d+)? lb\.|(?<![\w-])-(?![\w-]))/g;   # a lone "—" is the Sling's weight
cmpSeq("weapon weight", \@wgt, [ map { $_->[4] } @weapons ]);
my @cost = $region =~ /(\d+ (?:CP|SP|GP))/g;
cmpSeq("weapon cost", \@cost, [ map { $_->[5] } @weapons ]);
(my $flat = $region) =~ s/\s+/ /g;
my @dmg = $flat =~ /\b(\d+(?:d\d+)? (?:Bludgeoning|Piercing|Slashing))\b/g;
cmpBag("weapon damage", \@dmg, [ map { $_->[1] } @weapons ]);
my %names = map { $_ => 1 } ($flat =~ /([A-Z][a-z]+(?: [A-Z][a-z]+)*)/g);
my @missingNames = grep { index($flat, $_->[0]) < 0 } @weapons;
printf "%s weapon names: %d/%d found in the PHB table%s\n", (@missingNames ? "DIFF" : "OK  "), @weapons - @missingNames, scalar @weapons,
  @missingNames ? " — missing: " . join(", ", map { $_->[0] } @missingNames) : "";
$fail++ if @missingNames;

# ---------------- Armor ----------------
my @at = @{ load("$dir/armor.json") };
my @armor = map { map { [ map { clean($_) } @$_ ] } @{ $_->{rows} } } @at;
my ($as) = $raw =~ /(Light Armor \(1 Minute to Don or Doff\).*?)(?:Getting Into and Out of Armor|Armor Training)/s; die "no armor region" unless $as;
(my $aflat = $as) =~ s/\s+/ /g;
for my $a (@armor) {
  my @missing = grep { $_ ne '-' && index($aflat, $_) < 0 } @$a;
  printf "%s armor %-20s %s\n", (@missing ? "DIFF" : "OK  "), $a->[0], @missing ? "not in PHB: @missing" : "";
  $fail++ if @missing;
}
my @acost = $as =~ /(\d{1,3}(?:,\d{3})* GP)/g;   # Plate Armor is "1,500 GP" cmpSeq("armor cost", \@acost, [ map { $_->[5] } @armor ]);
my @aw = $as =~ /(\d+ lb\.)/g; cmpSeq("armor weight", \@aw, [ map { $_->[4] } @armor ]);

# ---------------- Tools and gear: name/cost/weight present ----------------
for my $file ('tool', 'adventuring-gear') {
  my @rows = map { map { [ map { clean($_) } @$_ ] } @{ $_->{rows} } } @{ load("$dir/$file.json") };
  my ($bad, $n) = (0, 0);
  for my $row (@rows) {
    next unless $row->[0] && $row->[0] !~ /^(Item|Artisan Tool|Other Tool|Gaming Set|Musical Instrument)$/;
    $n++;
    (my $name = $row->[0]) =~ s/\s*\(.*\)$//;
    my $ok = index(lc($flat . $raw), lc $name) >= 0;
    unless ($ok) { $bad++; print "DIFF $file: \"$row->[0]\" not found in PHB\n"; }
  }
  printf "%s %s: %d/%d names found in the PHB\n", ($bad ? "DIFF" : "OK  "), $file, $n - $bad, $n;
  $fail += $bad;
}
print "\n", ($fail ? "$fail difference(s)" : "all equipment tables match the PHB"), "\n";
