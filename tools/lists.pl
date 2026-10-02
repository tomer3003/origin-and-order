use strict; use warnings; use utf8; use JSON::PP; binmode STDOUT, ':utf8';
open my $nf, '<', ($ARGV[0] // 'normalized.json'); my $N = JSON::PP->new->utf8->decode(do { local $/; <$nf> });
open my $f, '<:utf8', 'phb8.txt'; my @L = <$f>; my $txt = join '', @L; $txt =~ s/\x{2019}/'/g;
my @lines = split /\n/, $txt;
for my $c (qw(Bard Cleric Druid Paladin Ranger Sorcerer Warlock Wizard)) {
  for my $n (0..9) {
    my $h = $n == 0 ? qr/Cantrips \(Level 0 $c Spells\)/ : qr/Level $n $c Spells/;
    my ($start) = grep { $lines[$_] =~ $h } 0..$#lines;
    next unless defined $start;
    my $end = $start + 1;
    $end++ while $end < $#lines && $lines[$end] !~ /(Level \d $c Spells|Cantrips \(Level 0)/ && $end - $start < 160;
    my $region = join "\n", @lines[$start..$end];
    my %book = map { $_ => 1 } grep { $N->{$_}{level} == $n && $region =~ /(?<![A-Za-z])\Q$N->{$_}{name}\E(?![A-Za-z]| of)/ } keys %$N;
    my %ours = map { $_ => 1 } grep { $N->{$_}{level} == $n && grep { $_ eq lc $c } @{$N->{$_}{classes}} } keys %$N;
    my @missing = grep { !$ours{$_} } sort keys %book; my @extra = grep { !$book{$_} } sort keys %ours;
    printf "%-8s L%d table %2d ours %2d%s%s\n", $c, $n, scalar(keys %book), scalar(keys %ours), (@missing ? "  table-only: @missing" : ""), (@extra ? "  header-only: @extra" : "");
  }
}
