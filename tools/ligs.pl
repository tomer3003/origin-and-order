#!/usr/bin/perl
# Find words in normalized.json whose "fi/fl/ff/ffi/ffl" ligature was dropped
# by the PDF (either deleted or replaced with a space), using the whole PHB
# as the vocabulary. Prints candidates "broken => fixed (counts)".
use strict; use warnings; use utf8;
binmode STDOUT, ':utf8';
my ($raw, $json) = @ARGV;
open my $r, '<:utf8', $raw or die; my $all = do { local $/; <$r> }; close $r;
my %f; $f{lc $1}++ while $all =~ /([A-Za-z]+)/g;
open my $j, '<:utf8', $json or die; my $js = do { local $/; <$j> }; close $j;
my @ligs = qw(fi fl ff ffi ffl);
my %seen;
# Single tokens with the ligature deleted.
while ($js =~ /\b([A-Za-z]+)\b/g) {
  my $t = $1; next if $seen{$t}++;
  my $lt = lc $t; my $ft = $f{$lt} // 0;
  for my $p (0 .. length($lt)) {
    for my $l (@ligs) {
      my $c = substr($lt, 0, $p) . $l . substr($lt, $p);
      my $fc = $f{$c} // 0;
      print "$t => $c ($ft vs $fc)\n" if $fc >= 3 && $fc > $ft * 2;
    }
  }
}
# Token pairs where the ligature became a space.
my %seenp;
while ($js =~ /\b([A-Za-z]+) ([A-Za-z]+)\b/g) {
  my ($a, $b) = ($1, $2); pos($js) -= length($b);
  next if $seenp{"$a $b"}++;
  for my $l (@ligs) {
    my $c = lc($a) . $l . lc($b);
    my $fc = $f{$c} // 0;
    my $fa = $f{lc $a} // 0; my $fb = $f{lc $b} // 0;
    print "'$a $b' => $c ($fa/$fb vs $fc)\n" if $fc >= 2 && ($fa < $fc || $fb < $fc);
  }
}
