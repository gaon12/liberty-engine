'use strict';

const LibertyParser = require('./LibertyParser');
const ParsingData = require('../ParsingData');
const LibertyParserSupporter = require('../ParserSupporter').LibertyParserSupporter;
const settings = require('../../../../config/settings.json');

const makeDefaultParsingData = () => new ParsingData({
  id: -1,
}, {
  WIKI_NAME: settings.WIKI_NAME,
  DOMAIN: settings.DOMAIN,
  LIBERTY_VERSION: global.LIBERTY_VERSION,
}, LibertyParserSupporter);

class WikitextParser extends LibertyParser {
  parseRender({ wikitext }) {
    return super.parseRender({ wikitext, parsingData: makeDefaultParsingData() });
  }
}

module.exports = WikitextParser;
