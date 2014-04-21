#!/usr/bin/env ruby
require 'text-hyphen'
hh = Text::Hyphen.new

abort "need a wurd, ya numpty" if ARGV[0].empty?
wurd = ARGV[0]

puts hh.visualise(wurd)
