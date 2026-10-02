#!/usr/bin/perl
# Normalize parsed spells (low.jsonl) and write normalized.json keyed by our
# camelCase key. Also prints which keys are new vs the existing spells.js.
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
my ($in, $existingJs, $out) = @ARGV;
open my $fh, '<:utf8', $in or die; my @rows = map { decode_json_utf8($_) } <$fh>; close $fh;
sub decode_json_utf8 { my $l = shift; return JSON::PP->new->utf8(0)->decode($l); }

open my $ej, '<:utf8', $existingJs or die; my $js = do { local $/; <$ej> }; close $ej;
my %existing = map { $_ => 1 } ($js =~ /^  ([a-zA-Z]+): \{/mg);

my %out;
for my $s (@rows) {
  my $key = keyOf($s->{name});
  $key = 'lightCantrip' if $s->{name} eq 'Light';
  for (qw(time range components duration text higherLevel)) { $s->{$_} =~ s/\x{2019}/'/g; $s->{$_} =~ s/[\x{201C}\x{201D}]/"/g; }
  $s->{name} =~ s/\x{2019}/'/g;
  $s->{duration} =~ s/up to(\d)/up to $1/; $s->{duration} =~ s/^Concentration up to/Concentration, up to/;
  $s->{text} =~ s/\s*\x{2191}\s*[A-Z' ]+$//;          # trailing art caption
  if ($s->{higherLevel} =~ /^(Use the spell slot's level for the spell's level in the stat block\.)\s*(.*)$/s) {
    $s->{higherLevel} = $1;
    $s->{text} .= " Stat block — $2";
  }
  $s->{key} = $key;
  $s->{isNew} = $existing{$key} ? JSON::PP::false : JSON::PP::true;
  $out{$key} = $s;
}
open my $o, '>:utf8', $out or die; print $o JSON::PP->new->canonical->pretty->encode(\%out); close $o;
my @new = sort grep { $out{$_}{isNew} } keys %out;
print scalar(@new), " new: ", join(" ", map { "$_(L$out{$_}{level})" } @new), "\n";
my @gone = grep { !$out{$_} } keys %existing;
print "existing keys not found in parse: @gone\n";

sub keyOf {
  my $n = shift; $n =~ s/[\x{2019}']//g; $n =~ s/[\/-]/ /g;
  my @w = split /\s+/, $n;
  my $k = lc(shift @w); $k .= ucfirst(lc $_) for @w;
  $k =~ s/[^a-zA-Z]//g; return $k;
}
