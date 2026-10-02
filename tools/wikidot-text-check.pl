#!/usr/bin/perl
# Word-level comparison of every spell's description (text + higherLevel) in
# js/data/spells.js against its dnd2024.wikidot.com page.
#   (download pages/<slug>.html first — see PROGRESS.md)
#   perl tools/wikidot-text-check.pl <pages-dir> js/data/spells.js [verbose]
# Prints each spell whose words differ, with the differing runs in context.
use strict; use warnings; use utf8;
binmode STDOUT, ':utf8';
my ($dir, $jsPath, $verbose) = @ARGV;
open my $j, '<:utf8', $jsPath or die; my $js = do { local $/; <$j> }; close $j;

my $str = qr/"((?:[^"\\]|\\.)*)"/;
my @spells;
while ($js =~ /^  (\w+): \{\n(.*?)\n  \}/msg) {
  my ($key, $body) = ($1, $2);
  my ($name) = $body =~ /name: $str/;
  my ($text) = $body =~ /text: $str/;
  my ($hl) = $body =~ /higherLevel: $str/;
  my ($level) = $body =~ /level: (\d)/;
  push @spells, { key => $key, name => $name, level => $level, text => $text // '', hl => $hl // '' };
}

sub words {
  my $s = shift // '';
  $s =~ s/\\"/"/g;
  $s =~ s/[\x{2018}\x{2019}]/'/g; $s =~ s/[\x{201C}\x{201D}]/"/g;
  $s =~ s/[\x{2013}\x{2014}\x{2212}]/ - /g;
  $s = lc $s;
  $s =~ s/'s\b/s/g; $s =~ s/'//g;
  $s =~ s/[^a-z0-9+]+/ /g;
  return grep { length } split / /, $s;
}
sub slug { my $s = lc shift; $s =~ s/[\x{2019}']/-/g; $s =~ s/[^a-z0-9]+/-/g; $s =~ s/-+/-/g; $s =~ s/^-|-$//g; return $s; }

# Classic LCS diff on word arrays; returns list of [op, words] runs.
sub diff {
  my ($a, $b) = @_;
  my ($n, $m) = (scalar @$a, scalar @$b);
  my @L; $L[$n][$_] = 0 for 0 .. $m;
  for (my $i = $n - 1; $i >= 0; $i--) {
    $L[$i][$m] = 0;
    for (my $k = $m - 1; $k >= 0; $k--) {
      $L[$i][$k] = $a->[$i] eq $b->[$k] ? $L[$i+1][$k+1] + 1
                 : ($L[$i+1][$k] >= $L[$i][$k+1] ? $L[$i+1][$k] : $L[$i][$k+1]);
    }
  }
  my @ops; my ($i, $k) = (0, 0);
  while ($i < $n || $k < $m) {
    if ($i < $n && $k < $m && $a->[$i] eq $b->[$k]) { push @ops, ['=', $a->[$i]]; $i++; $k++; }
    elsif ($k < $m && ($i >= $n || $L[$i][$k+1] >= $L[$i+1][$k])) { push @ops, ['+', $b->[$k]]; $k++; }
    else { push @ops, ['-', $a->[$i]]; $i++; }
  }
  return @ops;
}

my ($ok, $bad, $nopage) = (0, 0, 0);
for my $s (@spells) {
  my $file = "$dir/" . slug($s->{name}) . ".html";
  # Wikidot slugs some possessives "melfs-" and others "leomund-s-".
  (my $alt = $file) =~ s/-s-/s-/; $file = $alt if !-s $file && -s $alt;
  unless (-s $file) { print "NO PAGE: $s->{name} ($file)\n"; $nopage++; next; }
  open my $f, '<:utf8', $file or die; my $html = do { local $/; <$f> }; close $f;
  my ($c) = $html =~ /<div id="page-content">(.*?)(?:<div class="page-tags"|<div id="page-info-break")/s;
  $c //= '';
  $c =~ s/<script.*?<\/script>//sg; $c =~ s/<style.*?<\/style>//sg;
  $c =~ s/<[^>]+>/ /g; $c =~ s/&nbsp;/ /g; $c =~ s/&amp;/&/g; $c =~ s/&quot;/"/g; $c =~ s/&#0?39;/'/g;
  $c =~ s/&lt;/</g; $c =~ s/&gt;/>/g;
  # Description = everything after the Duration value.
  my @all = words($c);
  my $start = 0;
  for my $i (0 .. $#all) { if ($all[$i] eq 'duration') { $start = $i + 1; last; } }
  my @w = @all[$start .. $#all];
  # Drop the duration value itself (its first few words) by aligning on our text.
  my @o = (words($s->{text}), ($s->{hl} ? ('using', 'a', 'higher', 'level', 'spell', 'slot', words($s->{hl})) : ()));
  @o = (words($s->{text}), ($s->{hl} ? ('cantrip', 'upgrade', words($s->{hl})) : ())) if $s->{level} == 0;
  # Trim wiki words before our first word and after our last (lists, footers).
  my $first = $o[0] // ''; my $off = 0;
  for my $i (0 .. 12) { if (($w[$i] // '') eq $first) { $off = $i; last; } }
  @w = @w[$off .. $#w];
  my @ops = diff(\@o, \@w);
  # Trailing wiki-only words (spell lists line, footer) aren't differences.
  pop @ops while @ops && $ops[-1][0] eq '+';
  my @changed = grep { $_->[0] ne '=' } @ops;
  if (!@changed) { $ok++; next; }
  $bad++;
  # Summarize runs of changes with a little context.
  my @runs; my $cur;
  for my $idx (0 .. $#ops) {
    my ($op, $wd) = @{$ops[$idx]};
    if ($op eq '=') { if ($cur) { push @runs, $cur; undef $cur; } next; }
    $cur //= { at => $idx, del => [], add => [] };
    push @{ $op eq '-' ? $cur->{del} : $cur->{add} }, $wd;
  }
  push @runs, $cur if $cur;
  print "\n$s->{name}: " . scalar(@changed) . " word(s) differ\n";
  for my $r (@runs[0 .. ($#runs < 5 || $verbose ? $#runs : 5)]) {
    my $ctx = join ' ', map { $_->[1] } grep { $_->[0] eq '=' } @ops[($r->{at} > 4 ? $r->{at} - 4 : 0) .. $r->{at} - 1];
    printf "   ...%s  ours[%s]  wiki[%s]\n", $ctx, join(' ', @{$r->{del}}), join(' ', @{$r->{add}});
  }
  print "   (+" . (@runs - 6) . " more runs)\n" if @runs > 6 && !$verbose;
}
print "\nidentical: $ok, differing: $bad, no page: $nopage\n";
