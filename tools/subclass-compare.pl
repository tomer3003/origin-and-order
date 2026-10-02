#!/usr/bin/perl
# Side-by-side review of our subclass feature summaries vs the PHB text.
#   perl tools/subclass-parse... (see parse-subclasses.pl) > subclasses.json
#   perl tools/subclass-compare.pl subclasses.json js/data/classes/<class>.js
# Prints, per subclass and feature: our summary, then the book text, so each
# paraphrase can be checked for 2014-vs-2024 drift. Read-only.
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
my ($bookPath, $classPath) = @ARGV;
open my $bf, '<', $bookPath or die; my $book = JSON::PP->new->utf8->decode(do { local $/; <$bf> }); close $bf;
open my $c, '<:utf8', $classPath or die; my $js = do { local $/; <$c> }; close $c;
my ($obj) = $js =~ /export const \w+ = (\{.*\});/s or die "no class object";
my $cls = JSON::PP->new->decode(jsToJson($obj));
my $bc = $book->{ $cls->{name} } or die "class $cls->{name} not in book";
sub norm { my $s = lc shift; $s =~ s/[\x{2019}']/'/g; $s =~ s/[^a-z0-9']+/ /g; $s =~ s/^\s+|\s+$//g; return $s; }

for my $sk (sort keys %{ $cls->{subclasses} }) {
  my $sub = $cls->{subclasses}{$sk};
  my ($bname) = grep { norm($_) eq norm($sub->{name}) || index(norm($_), norm($sub->{name})) >= 0 } keys %$bc;
  print "\n################ $cls->{name} / $sub->{name} ($sk)\n";
  print "spellsByLevel: ", join(" | ", map { "$_: " . join(", ", @{ $sub->{spellsByLevel}{$_} }) } sort { $a <=> $b } keys %{ $sub->{spellsByLevel} }), "\n" if $sub->{spellsByLevel};
  my %ours;
  for my $lvl (keys %{ $sub->{features} || {} }) { $ours{ norm($_->{name}) } = { %$_, level => $lvl } for @{ $sub->{features}{$lvl} }; }
  for my $f (@{ $bc->{$bname} || [] }) {
    my $o = $ours{ norm($f->{name}) };
    (my $t = $f->{text}) =~ s/\n/ /g;
    print "\n[L$f->{level}] $f->{name}\n  OURS: ", ($o ? $o->{text} : "(missing)"), "\n  BOOK: $t\n";
  }
}

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
    if ($ch =~ /\w/ && $o =~ /[{,]\s*$/) {     # bare keys, including numeric ones (10: [...])
      my ($id) = substr($src, $i) =~ /^(\w+)\s*:/;
      if (defined $id) { $o .= "\"$id\""; $i += length $id; next; }
    }
    $o .= $ch; $i++;
  }
  $o =~ s/,(\s*[}\]])/$1/g;
  return $o;
}
