#!/usr/bin/perl
# Dump every <table> on a downloaded wikidot page as JSON:
#   perl tools/wikidot-tables.pl page.html > tables.json
# [{ "before": "<nearest heading/text before the table>", "headers": [...], "rows": [[...], ...] }]
# Cells keep their text only; a row whose cells span the whole table (a
# sub-heading like "Simple Melee Weapons") comes through as a 1-cell row.
use strict; use warnings; use utf8; use JSON::PP;
binmode STDOUT, ':utf8';
open my $f, '<:utf8', shift or die; my $html = do { local $/; <$f> }; close $f;
my ($content) = $html =~ /<div id="page-content">(.*)/s; $content //= $html;
sub txt {
  my $s = shift // '';
  $s =~ s/<br\s*\/?>/ /gi; $s =~ s/<[^>]+>//g;
  $s =~ s/&nbsp;/ /g; $s =~ s/&amp;/&/g; $s =~ s/&quot;/"/g; $s =~ s/&#0?39;/'/g; $s =~ s/&lt;/</g; $s =~ s/&gt;/>/g;
  $s =~ s/[\x{2018}\x{2019}]/'/g; $s =~ s/[\x{2013}\x{2014}\x{2212}]/-/g;
  $s =~ s/\s+/ /g; $s =~ s/^\s+|\s+$//g;
  return $s;
}
my @out;
while ($content =~ /(.{0,600}?)(<table.*?<\/table>)/sg) {
  my ($pre, $t) = ($1, $2);
  my @heads = $pre =~ /<h\d[^>]*>(.*?)<\/h\d>/sg;
  my $before = @heads ? txt($heads[-1]) : txt(substr($pre, -200));
  my (@headers, @rows);
  for my $tr ($t =~ /<tr[^>]*>(.*?)<\/tr>/sg) {
    my @th = $tr =~ /<th[^>]*>(.*?)<\/th>/sg;
    my @td = $tr =~ /<td[^>]*>(.*?)<\/td>/sg;
    if (@th && !@td && !@headers) { @headers = map { txt($_) } @th; next; }
    push @rows, [ map { txt($_) } (@th, @td) ];
  }
  push @out, { before => $before, headers => \@headers, rows => \@rows };
}
print JSON::PP->new->canonical->pretty->encode(\@out);
