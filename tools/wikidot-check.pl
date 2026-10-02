#!/usr/bin/perl
# Cross-check js/data/spells.js against dnd2024.wikidot.com's "All Spells"
# page (one table per level: name, school, spell lists, casting time, range,
# components, duration).
#   curl -s -L -o all.html https://dnd2024.wikidot.com/spell:all
#   perl tools/wikidot-check.pl all.html js/data/spells.js
# Wikidot also carries non-PHB spells (and the Artificer list); spells only
# on wikidot are reported as information, not errors.
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
my ($htmlPath, $jsPath) = @ARGV;

open my $h, '<:utf8', $htmlPath or die; my $html = do { local $/; <$h> }; close $h;
open my $j, '<:utf8', $jsPath or die; my $js = do { local $/; <$j> }; close $j;
my ($obj) = $js =~ /export const SPELLS = (\{.*?\n\});/s or die "no SPELLS";
my $ours = JSON::PP->new->decode(jsToJson($obj));

sub clean {
  my $s = shift // '';
  $s =~ s/<[^>]+>//g;
  $s =~ s/&nbsp;/ /g; $s =~ s/&amp;/&/g; $s =~ s/&#39;|&#039;/'/g; $s =~ s/&quot;/"/g;
  $s =~ s/[\x{2018}\x{2019}]/'/g; $s =~ s/[\x{2013}\x{2014}]/-/g;
  $s =~ s/\s+/ /g; $s =~ s/^\s+|\s+$//g;
  return $s;
}
sub norm { my $s = lc clean(shift); $s =~ s/[^a-z0-9]+/ /g; $s =~ s/^\s+|\s+$//g; return $s; }

# ---- Parse wikidot: the Nth table under #page-content is spell level N-1. ----
my ($content) = $html =~ /<div id="page-content">(.*)<div id="page-info-break">/s;
$content //= $html;
my @tables = $content =~ /(<table.*?<\/table>)/sg;
my %wd;   # norm(name) => {...}
for my $lvl (0 .. $#tables) {
  for my $row ($tables[$lvl] =~ /<tr>(.*?)<\/tr>/sg) {
    my @td = map { clean($_) } $row =~ /<td[^>]*>(.*?)<\/td>/sg;
    next unless @td >= 7;
    my ($name, $school, $lists, $time, $range, $comp, $dur) = @td;
    $wd{norm($name)} = { name => $name, level => $lvl, school => $school, lists => $lists,
      time => $time, range => $range, components => $comp, duration => $dur };
  }
}
printf "wikidot: %d spells in %d tables\n", scalar(keys %wd), scalar(@tables);

# ---- Compare. ----
my (@missingOnWd, @diffs);
my %ourNames;
for my $key (sort keys %$ours) {
  my $s = $ours->{$key};
  my $n = norm($s->{name}); $ourNames{$n} = 1;
  my $w = $wd{$n};
  unless ($w) { push @missingOnWd, "$s->{name} (L$s->{level})"; next; }
  my @d;
  push @d, "level ours $s->{level} / wd $w->{level}" if $s->{level} != $w->{level};
  push @d, "school ours $s->{school} / wd $w->{school}" if lc $s->{school} ne lc $w->{school};

  my %wl = map { lc($_) => 1 } grep { $_ ne 'Artificer' } map { clean($_) } split /,/, $w->{lists};
  my %ol = map { $_ => 1 } @{$s->{classes}};
  my $wls = join(',', sort keys %wl); my $ols = join(',', sort keys %ol);
  push @d, "lists ours [$ols] / wd [$wls]" if $wls ne $ols;

  # Casting time: wikidot abbreviates "or Ritual" as "or R" and may trim the
  # Reaction/Bonus Action trigger clause.
  my $ot = norm($s->{time}); my $wt = norm($w->{time});
  $wt =~ s/\bor r\b/or ritual/;
  push @d, "time ours \"$s->{time}\" / wd \"$w->{time}\"" unless $ot eq $wt || index($ot, $wt) == 0;

  push @d, "range ours \"$s->{range}\" / wd \"$w->{range}\"" unless norm($s->{range}) eq norm($w->{range});

  # Wikidot marks a costly material "M(C)" and a consumed costly one
  # "M(C*)"; check those against our component text rather than ignoring them.
  (my $oc = $s->{components}) =~ s/\s*\(.*\)\s*$//;
  (my $wc = $w->{components}) =~ s/\s*\((C\*?)\)//; my $mark = $1 // '';
  push @d, "components ours \"$oc\" / wd \"$w->{components}\"" unless norm($oc) eq norm($wc);
  my $costly = $s->{components} =~ /worth|\d+\+? ?GP/i;
  my $consumed = $s->{components} =~ /consume/i;
  push @d, "wd marks M(C) costly; ours: \"$s->{components}\"" if $mark && !$costly;
  push @d, "wd marks M(C*) consumed; ours: \"$s->{components}\"" if $mark eq 'C*' && !$consumed;
  push @d, "ours costly but wd unmarked: \"$s->{components}\"" if !$mark && $costly;
  push @d, "ours consumed but wd not C*: \"$s->{components}\"" if $mark ne 'C*' && $consumed;

  my $od = norm($s->{duration}); my $wdur = norm($w->{duration});
  $wdur =~ s/^c up to/concentration up to/; $wdur =~ s/^conc up to/concentration up to/;
  $wdur =~ s/^instantanous$/instantaneous/;   # wikidot typo (Befuddlement)
  push @d, "duration ours \"$s->{duration}\" / wd \"$w->{duration}\"" unless $od eq $wdur;

  push @diffs, "$s->{name} (L$s->{level}): " . join('; ', @d) if @d;
}
my @wdOnly = sort map { "$wd{$_}{name} (L$wd{$_}{level})" } grep { !$ourNames{$_} } keys %wd;

print "\nOurs but not found on wikidot (" . scalar(@missingOnWd) . "):\n  " . join("\n  ", @missingOnWd) . "\n";
print "\nField differences (" . scalar(@diffs) . "):\n  " . join("\n  ", @diffs) . "\n";
print "\nOn wikidot only — expected, other books (" . scalar(@wdOnly) . "):\n  " . join(", ", @wdOnly) . "\n";

sub jsToJson {
  my $src = shift; my $o = ''; my $i = 0; my $n = length $src;
  while ($i < $n) {
    my $c = substr($src, $i, 1);
    if ($c eq '"') {
      my $k = $i + 1;
      while ($k < $n) { my $d = substr($src, $k, 1); if ($d eq '\\') { $k += 2; next; } last if $d eq '"'; $k++; }
      $o .= substr($src, $i, $k - $i + 1); $i = $k + 1; next;
    }
    if (substr($src, $i, 2) eq '/*') { $i = index($src, '*/', $i + 2) + 2; next; }
    if (substr($src, $i, 2) eq '//') { $i = index($src, "\n", $i); next; }
    if ($c =~ /[A-Za-z_]/ && $o =~ /[{,]\s*$/) {
      my ($id) = substr($src, $i) =~ /^([A-Za-z_]\w*)\s*:/;
      if (defined $id) { $o .= "\"$id\""; $i += length $id; next; }
    }
    $o .= $c; $i++;
  }
  $o =~ s/,(\s*[}\]])/$1/g;
  return $o;
}
