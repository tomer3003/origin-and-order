#!/usr/bin/perl
# For every subclass feature: flag numbers/dice/distances in our summary
# that don't appear in the PHB text, and check each subclass's spellsByLevel
# against the book's "<X> Spells" table.
#   perl tools/subclass-number-check.pl subclasses.json js/data/classes/*.js
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
my ($bookPath, @classFiles) = @ARGV;
open my $bf, '<', $bookPath or die; my $book = JSON::PP->new->utf8->decode(do { local $/; <$bf> }); close $bf;
sub norm { my $s = lc shift; $s =~ s/[\x{2019}']/'/g; $s =~ s/[^a-z0-9']+/ /g; $s =~ s/^\s+|\s+$//g; return $s; }
# Numbers as they'd appear in the book; spelled-out numbers count too.
my %words = (one => 1, two => 2, three => 3, four => 4, five => 5, six => 6, seven => 7, eight => 8, nine => 9, ten => 10, twice => 2, half => 'half');
sub nums {
  my $t = shift;
  my %n;
  $n{lc $1}++ while $t =~ /\b(\d+d\d+)\b/gi;
  (my $u = $t) =~ s/\b\d+d\d+\b//gi;
  $n{$1}++ while $u =~ /(?<![\w.])(\d+)(?![\w])/g;
  return \%n;
}
my ($flags, $spellFlags) = (0, 0);
for my $file (@classFiles) {
  open my $c, '<:utf8', $file or die; my $js = do { local $/; <$c> }; close $c;
  my ($obj) = $js =~ /export const \w+ = (\{.*\});/s or next;
  my $cls = JSON::PP->new->decode(jsToJson($obj));
  my $bc = $book->{ $cls->{name} } or next;
  for my $sk (sort keys %{ $cls->{subclasses} || {} }) {
    my $sub = $cls->{subclasses}{$sk};
    my ($bname) = grep { norm($_) eq norm($sub->{name}) || index(norm($_), norm($sub->{name})) >= 0 } keys %$bc;
    my %bookFeat = map { norm($_->{name}) => $_ } @{ $bc->{$bname} || [] };
    for my $lvl (sort { $a <=> $b } keys %{ $sub->{features} || {} }) {
      for my $f (@{ $sub->{features}{$lvl} }) {
        my $b = $bookFeat{ norm($f->{name}) } or next;
        my $bt = $b->{text};
        $bt =~ s/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/$words{lc $1}/gie;
        my $bn = nums($bt); my $on = nums($f->{text});
        my @bad = grep { !$bn->{$_} } sort keys %$on;
        # Our own convention: "Uses = X modifier (min 1)" etc. and level numbers
        # of the feature itself are fine.
        @bad = grep { $_ ne $lvl } @bad;
        if (@bad) { $flags++; print "$cls->{name}/$sub->{name} L$lvl $f->{name}: [@bad] not in book\n    ours: $f->{text}\n"; }
      }
    }
    # Spell list vs the book's "<X> Spells" table.
    my ($spellFeat) = grep { $_->{name} =~ / Spells$/ } @{ $bc->{$bname} || [] };
    if ($sub->{spellsByLevel} && $spellFeat) {
      my $t = $spellFeat->{text}; $t =~ s/\n/ /g; $t =~ s/[\x{2019}]/'/g;
      for my $lvl (keys %{ $sub->{spellsByLevel} }) {
        for my $sp (@{ $sub->{spellsByLevel}{$lvl} }) {
          (my $q = $sp) =~ s/[\x{2019}]/'/g;
          unless (index(lc $t, lc $q) >= 0) { $spellFlags++; print "SPELL $cls->{name}/$sub->{name} L$lvl: \"$sp\" not in book table\n"; }
        }
      }
    } elsif ($spellFeat && !$sub->{spellsByLevel}) {
      $spellFlags++; print "SPELL $cls->{name}/$sub->{name}: book has \"$spellFeat->{name}\" but we have no spellsByLevel\n";
    }
  }
}
print "\nnumber flags: $flags, spell-list flags: $spellFlags\n";

sub jsToJson {
  my $src = shift; my $o = ''; my $i = 0; my $n = length $src;
  while ($i < $n) {
    my $ch = substr($src, $i, 1);
    if ($ch eq '"') {
      my $k = $i + 1;
      while ($k < $n) { my $d = substr($src, $k, 1); if ($d eq '\\') { $k += 2; next; } last if $d eq '"'; $k++; }
      $o .= substr($src, $i, $k - $i + 1); $i = $k + 1; next;
    }
    if (substr($src, $i, 2) eq '/*') { $i = index($src, '*/', $i + 2) + 2; next; }
    if (substr($src, $i, 2) eq '//') { $i = index($src, "\n", $i); next; }
    if ($ch =~ /\w/ && $o =~ /[{,]\s*$/) {
      my ($id) = substr($src, $i) =~ /^(\w+)\s*:/;
      if (defined $id) { $o .= "\"$id\""; $i += length $id; next; }
    }
    $o .= $ch; $i++;
  }
  $o =~ s/,(\s*[}\]])/$1/g;
  return $o;
}
