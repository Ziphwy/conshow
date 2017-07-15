const directives = {
  clear: '\x1b[0m',
  underline: '\x1b[4m',
  inverse: '\x1b[7m',
  hide: '\x1b[8m',
};

const shortMap = {
  c: 'clear',
  u: 'underline',
  i: 'inverse',
  h: 'hide',
};

// directive regexp
const expressReg = /(?:@[\w-]+)+\((?:.|\n)*?\)/g;
const parseReg = /((?:@[\w-]+)+)\(((?:.|\n)*?)\)/;
const directiveReg = /@([\w-]+)/g;

function addDirective(key, callback, short) {
  if (!key || !callback) throw new Error('[conshow] directive or callback is undefined.');
  directives[key] = callback;
  if (short) shortMap[short] = key;
}

function directiveParser(str, option) {
  return str.replace(expressReg, express =>
    express.replace(parseReg, ($0, directiveStr, content) =>
      `${getDirective(directiveStr, content, option)}${directives.clear}`));
}

function getDirective(directiveStr, content, option) {
  let _content = content;
  const modify = directiveStr.replace(directiveReg, ($0, name) => {
    const directive = directives[shortMap[name]] || directives[name];
    if (!directive) {
      throw Error(`[conshow] the directive "@${name}" is not undefined.`);
    }
    if (typeof directive === 'function') {
      _content = directive(_content, option);
      return '';
    }
    return directive;
  });
  return modify + _content;
}


module.exports.directiveParser = directiveParser;
module.exports.addDirective = addDirective;
