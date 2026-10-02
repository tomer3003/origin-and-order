use strict; use warnings; use utf8; binmode STDOUT, ':utf8';
# perl tools/statblock-number-check.pl <wikidot pages dir> js/data/spells.js
# For stat-block spells, compare the multiset of numbers/dice in our text vs wikidot's.
my ($dir, $js) = @ARGV; open my $f, '<:utf8', $js or die; local $/; my $j = <$f>;
my $str = qr/"((?:[^"\\]|\\.)*)"/;
for my $name ("Find Steed","Summon Beast","Summon Fey","Summon Undead","Giant Insect","Summon Aberration","Summon Construct","Summon Elemental","Animate Objects","Summon Celestial","Summon Dragon","Summon Fiend") {
  my ($body) = $j =~ /name: "\Q$name\E"(.*?)\n  \}/s;
  (my $slug = lc $name) =~ s/[^a-z0-9]+/-/g;
  open my $p, '<:utf8', "$dir/$slug.html" or do { print "nopage $name\n"; next };
  my $h = <$p>; my ($c) = $h =~ /<div id="page-content">(.*?)<div class="page-tags"/s;
  $c =~ s/<script.*?<\/script>//sg; $c =~ s/<[^>]+>/ /g;
  my $nums = sub { my $s = shift; $s =~ s/[\x{2212}\x{2013}]/-/g; my %m; $m{$_}++ for $s =~ /([+-]?\d+(?:d\d+)?)/g; return \%m; };
  my ($tx) = $body =~ /text: $str/; my ($hl) = $body =~ /higherLevel: $str/; $hl //= '';
  my ($dur) = $body =~ /duration: $str/;
  my ($wd) = $c =~ /Duration:(.*)/s; $wd //= '';
  my $a = $nums->("$dur $tx $hl"); my $b = $nums->($wd);
  my @onlyO = map { "$_" . ($a->{$_} - ($b->{$_}//0) > 1 ? "x" . ($a->{$_} - ($b->{$_}//0)) : "") } grep { $a->{$_} > ($b->{$_}//0) } sort keys %$a;
  my @onlyW = map { "$_" . ($b->{$_} - ($a->{$_}//0) > 1 ? "x" . ($b->{$_} - ($a->{$_}//0)) : "") } grep { $b->{$_} > ($a->{$_}//0) } sort keys %$b;
  printf "%-20s ours-only[%s] wiki-only[%s]\n", $name, "@onlyO", "@onlyW";
}
