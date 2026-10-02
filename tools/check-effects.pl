#!/usr/bin/perl
# Cross-check hand-written effect lines against the book text in a generated
# spells.js: "Half damage on a success" must match the text, and every dice
# expression an effect mentions must appear in the text or higher-level text.
use strict; use warnings; use utf8;
binmode STDOUT, ':utf8';
open my $f, '<:utf8', $ARGV[0] or die; my $js = do { local $/; <$f> }; close $f;
my $str = qr/"((?:[^"\\]|\\.)*)"/;
while ($js =~ /^  (\w+): \{\n(.*?)\n  \}/msg) {
  my ($k, $body) = ($1, $2);
  my ($eff) = $body =~ /effect: $str/; $eff //= '';
  my ($tx) = $body =~ /text: $str/; $tx //= '';
  my ($hl) = $body =~ /higherLevel: $str/; $hl //= '';
  if ($eff =~ /Half damage on a success/ && $tx !~ /half as much/i) { print "HALF claimed, not in text: $k\n"; }
  if ($eff && $eff !~ /Half damage/ && $tx =~ /half as much damage on a successful one/ && $eff =~ /damage|Fire|Cold|Radiant|Necrotic/) { print "text has half-on-success, effect doesn't say: $k\n"; }
  for my $d ($eff =~ /(\d+d\d+(?: ?\+ ?\d+)?)/g) {
    (my $dn = $d) =~ s/\s//g;
    (my $all = "$tx $hl") =~ s/\s//g;
    print "dice $d not in text: $k\n" unless index($all, $dn) >= 0;
  }
}
