#!/usr/bin/env node

var fs = require('fs');
var plist = require('plist');

var FILEPATH = 'platforms/ios/Qelf/Qelf-Info.plist';

var xml = fs.readFileSync(FILEPATH, 'utf8');
var obj = plist.parse(xml);

obj.LSApplicationQueriesSchemes = [
  'fbapi',
  'fbapi20130214',
  'fbapi20130410',
  'fbapi20130702',
  'fbapi20131010',
  'fbapi20131219',
  'fbapi20140410',
  'fbapi20140116',
  'fbapi20150313',
  'fbapi20150629',
  'fbauth',
  'fbauth2',
  'fb-messenger-api20140430'
];

xml = plist.build(obj);
fs.writeFileSync(FILEPATH, xml, { encoding: 'utf8' });
