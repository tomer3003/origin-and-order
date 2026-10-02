#!/usr/bin/perl
# Parse level 0-9 spells out of pdftotext's raw (non-layout) PHB extract.
# Usage: perl parse-spells.pl phb-raw.txt > spells.tsv
# Output: one JSON object per line.
use strict; use warnings; use utf8;
binmode STDIN, ':utf8'; binmode STDOUT, ':utf8';
open my $fh, '<:utf8', $ARGV[0] or die;
my @lines = <$fh>; close $fh;
chomp @lines;

# Start at the spell chapter body: first "Acid Arrow"/"Acid Splash" header region.
my $start = 0;
for my $i (0..$#lines) {
  if ($lines[$i] =~ /^Acid Splash\s*$/ && $lines[$i+1] =~ /Cantrip \(/) { $start = $i; last; }
}
die "no start" unless $start;

# Drop page furniture.
my @clean;
for my $l (@lines[$start..$#lines]) {
  next if $l =~ m{^https://www\.dndbeyond\.com};
  next if $l =~ m{^\d+/803\s*$};
  next if $l =~ m{^\d+/\d+/\d+, \d+:\d+ [AP]M};
  next if $l =~ /^Player.s Handbook\s*$/;
  $l =~ s/\s*Player\x{2019}s Handbook\s*/ /g;
  $l =~ s/\s*Player's Handbook\s*$//;
  next if $l =~ /^\s*$/;
  next if $l =~ /^Spells \([A-Z]\)\s*$/;
  next if $l =~ /ARTIST:/;
  next if $l =~ /^\s*$/;
  # All-caps art captions.
  next if length($l) > 15 && $l !~ /[a-z]/;
  push @clean, $l;
}

my $hdr = qr/^(?:Level ([1-9]) (Abjuration|Conjuration|Divination|Enchantment|Evocation|Illusion|Necromancy|Transmutation)|(Abjuration|Conjuration|Divination|Enchantment|Evocation|Illusion|Necromancy|Transmutation) Cantrip) \(([^)]*)\)\s*(.*)$/;

my @heads;
for my $i (1..$#clean) {
  push @heads, $i if $clean[$i] =~ $hdr;
}

my %lists = map { $_ => lc $_ } qw(Bard Cleric Druid Paladin Ranger Sorcerer Warlock Wizard);

for my $n (0..$#heads) {
  my $i = $heads[$n];
  my $name = $clean[$i-1];
  $name =~ s/\s+$//;
  my $end = $n < $#heads ? $heads[$n+1] - 1 : scalar(@clean);   # next spell's name line
  $clean[$i] =~ $hdr;
  my ($level, $school) = defined $1 ? ($1, $2) : (0, $3);
  my $classes = $4;
  my $rest = $5;
  my @body = ($rest, @clean[$i+1 .. $end-1]);
  # Stop at chapter end.
  my $joined = join("\n", grep { defined && length } @body);
  $joined =~ s/\n(?:Appendix|Chapter) .*//s;

  my ($time, $range, $comp, $dur);
  my $flat = $joined; $flat =~ s/\n/ \x{1} /g;   # keep paragraph marks
  $flat =~ s/^\s*Casting Time:\s*(.*?)\s*(?:\x{1}\s*)?Range:\s*//s and $time = $1;
  $flat =~ s/^(.*?)\s*(?:\x{1}\s*)?Components?:\s*//s and $range = $1;
  $flat =~ s/^(.*?)\s*(?:\x{1}\s*)?Duration:\s*//s and $comp = $1;
  if ($flat =~ s/^((?:Concentration,? up to ?|Up to )?(?:\d+|One|one) (?:round|minute|hour|day|year)s?|Instantaneous|Special|Until dispelled(?: or triggered)?|Instantaneous or \d+ hours?)\s*//) { $dur = $1; }
  for ($time, $range, $comp) { next unless defined; s/\s*\x{1}\s*/ /g; s/\s+/ /g; }

  my $higher = '';
  my $label = $level == 0 ? 'Cantrip Upgrade\.' : 'Using a Higher-Level Spell Slot\.';
  if ($flat =~ s/\s*(?:\x{1}\s*)?$label\s*(.*)$//s) { $higher = $1; $higher =~ s/\s*\x{1}\s*/ /g; }
  my $text = $flat; $text =~ s/^\s*\x{1}\s*//; $text =~ s/\s*\x{1}\s*/ /g; $text =~ s/\s+/ /g; $text =~ s/\s+$//;
  $higher =~ s/\s+/ /g; $higher =~ s/\s+$//;

  my @cl = map { s/^\s+|\s+$//gr } split /,/, $classes;
  my @keys = map { $lists{$_} // "?$_" } @cl;

  my $esc = sub { my $s = shift // ''; $s =~ s/\\/\\\\/g; $s =~ s/"/\\"/g; return "\"$s\""; };
  print "{", join(", ",
    "\"name\": " . $esc->($name),
    "\"level\": $level",
    "\"school\": " . $esc->($school),
    "\"classes\": [" . join(", ", map { $esc->($_) } @keys) . "]",
    "\"time\": " . $esc->($time),
    "\"range\": " . $esc->($range),
    "\"components\": " . $esc->($comp),
    "\"duration\": " . $esc->($dur),
    "\"text\": " . $esc->($text),
    "\"higherLevel\": " . $esc->($higher)
  ), "}\n";
}
