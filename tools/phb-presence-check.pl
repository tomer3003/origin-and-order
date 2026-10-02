#!/usr/bin/perl
# Independent check that js/data/spells.js holds every spell in the PHB,
# using the LAYOUT extract (not the raw one parse-spells.pl reads):
#   pdftotext -layout -enc UTF-8 <PHB.pdf> phb8.txt
#   perl tools/phb-presence-check.pl phb8.txt js/data/spells.js
# 1. Every "Level N School (...)" / "School Cantrip (...)" description header
#    in chapter 7, named by the nearest title line above it.
# 2. Every spell named in a class chapter's "Level N <Class> Spells" table.
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
my ($phbPath, $jsPath) = @ARGV;
open my $p, '<:utf8', $phbPath or die; my @lines = <$p>; close $p;
chomp @lines; s/\x{2019}/'/g for @lines;
open my $j, '<:utf8', $jsPath or die; my $js = do { local $/; <$j> }; close $j;
my %ours; $ours{lc $1} = $2 while $js =~ /^    name: "([^"]+)", level: (\d)/mg;
printf "ours: %d spells\n", scalar keys %ours;

my $school = qr/Abjuration|Conjuration|Divination|Enchantment|Evocation|Illusion|Necromancy|Transmutation/;

# ---- 1. Description headers ----
my %hdr;
for my $i (0 .. $#lines) {
  next unless $lines[$i] =~ /^\s*(?:Level ([1-9]) ($school)|($school) Cantrip) \(/;
  my $lvl = $1 // 0;
  # Walk up past blank lines and page furniture to the title line.
  my $k = $i - 1;
  while ($k > 0 && ($lines[$k] =~ /^\s*$/ || $lines[$k] =~ m{dndbeyond\.com|^\s*\d+/\d+/\d+,|Player's Handbook\s*$|^\s*\d+/803\s*$|ARTIST:})) { $k--; }
  (my $name = $lines[$k]) =~ s/\s{2,}.*$//; $name =~ s/^\s+|\s+$//g;
  # A stat-block column printed beside the heading can push the title line
  # further up: fall back to the nearest line above that starts with a name.
  unless (exists $ours{lc $name}) {
    for my $b (1 .. 12) {
      last if $i - $b < 0;
      my ($cand) = $lines[$i - $b] =~ /^\s*(\S.*?)(?:\s{2,}|$)/;
      if (defined $cand && exists $ours{lc $cand}) { $name = $cand; last; }
    }
  }
  $hdr{lc $name} = { name => $name, level => $lvl };
}
printf "PHB description headers (layout extract): %d\n", scalar keys %hdr;
my @notOurs = grep { !exists $ours{$_} } sort keys %hdr;
my @notInHdr = grep { !exists $hdr{$_} } sort keys %ours;
my @lvlDiff = grep { exists $ours{$_} && $ours{$_} != $hdr{$_}{level} } sort keys %hdr;
print "  headers we don't have: ", (@notOurs ? join(", ", map { $hdr{$_}{name} } @notOurs) : "none"), "\n";
print "  ours with no header found: ", (@notInHdr ? join(", ", @notInHdr) : "none"), "\n";
print "  level mismatches: ", (@lvlDiff ? join(", ", @lvlDiff) : "none"), "\n";

# ---- 2. Class spell-list tables ----
my $text = join "\n", @lines;
my %inTables;
for my $c (qw(Bard Cleric Druid Paladin Ranger Sorcerer Warlock Wizard)) {
  for my $n (0 .. 9) {
    my $h = $n == 0 ? qr/Cantrips \(Level 0 $c Spells\)/ : qr/Level $n $c Spells/;
    my ($start) = grep { $lines[$_] =~ $h } 0 .. $#lines;
    next unless defined $start;
    my $end = $start + 1;
    $end++ while $end < $#lines && $lines[$end] !~ /(Level \d $c Spells|Cantrips \(Level 0|$c Subclasses)/ && $end - $start < 160;
    my $region = join "\n", @lines[$start .. $end];
    for my $lk (keys %ours) {
      next unless $ours{$lk} == $n;
      $inTables{$lk} = 1 if $region =~ /(?<![A-Za-z])\Q$lk\E(?![A-Za-z]| of| with)/i;
    }
  }
}
my @noTable = grep { !$inTables{$_} } sort keys %ours;
printf "On at least one class spell-list table: %d of %d\n", scalar(keys %inTables), scalar(keys %ours);
print "  not found on any class table: ", (@noTable ? join(", ", @noTable) : "none"), "\n";
