#!/usr/bin/env ruby
require 'text-hyphen'

wurd = ARGV[0]
hh = Text::Hyphen.new
trans_wurds = hh.visualise(wurd)
puts trans_wurds
