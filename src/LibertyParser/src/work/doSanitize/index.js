'use strict';

const sanitizeHtml = require('sanitize-html');
const cheerio = require('cheerio');

const styleRegex = /expression|filter|accelerator|-o-link|-o-link-source|-o-replace|url|image|image-set/i;

const allowedTags = [
  'a', 'img', 'abbr', 'b', 'bdi', 'bdo', 'big', 'blockquote', 'br',
  'caption', 'center', 'cite', 'code', 'data', 'dd', 'del',
  'dfn', 'div', 'dl', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'hr', 'i', 'ins', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 'q',
  'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'small',
  'strong', 'sub', 'sup', 'span', 'table', 'td', 'th', 'time',
  'tr', 'tt', 'u', 'ul', 'var', 'wbr',
  'nowiki'
];

const allowedAttributes = {
  '*' : ['id', 'class', 'style'],
  table: ['align'],
  caption: ['align'],
  tr: ['align'],
  td: ['colspan', 'rowspan', 'align'],
  th: ['colspan', 'rowspan', 'align'],
  a: ['href', 'title'],
  sup: ['title'],
  img: ['src']
};

const allowedSchemes = [
  'http', 'https', 'ftp', 'sftp', 'gopher', 'telnet',
  'news', 'mailto', 'ed2k', 'irc', 'ssh', 'magnet'
];


const sanitizeOption = {
  allowedTags,
  allowedAttributes,
  selfClosing: [
    'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'
  ],
  allowedSchemes,
  allowedSchemesByTag: {}
};

module.exports = function(wikitext, parsingData) {
  let text = sanitizeHtml(wikitext.replace(/<p>\s*<\/p>/g, ''), sanitizeOption);
  let $ = cheerio.load(text, { decodeEntities: false, recognizeSelfClosing: true });
  $('[style]').each(function() {
    if (styleRegex.test($(this).attr('style'))) {
      $(this).attr('style', '/* insecure input */');
    }
  });
  $('p > div').each(function() {
    let $div = $(this).parent();
    $div.replaceWith($div.html());
  });
  return $.html();
};
