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

const colors = [
  { short: 'b', long: 'black' },
  { short: 'r', long: 'red' },
  { short: 'g', long: 'green' },
  { short: 'y', long: 'yellow' },
  { short: 'bl', long: 'blue' },
  { short: 'p', long: 'purple' },
  { short: 'dg', long: 'darkgreen' },
];

function initColor() {
  colors.forEach((colorObj, index) => {
    directives[`f_${colorObj.long}`] = `\x1b[3${index}m`;
    directives[`b_${colorObj.long}`] = `\x1b[4${index}m`;
    shortMap[`f_${colorObj.short}`] = `f_${colorObj.long}`;
    shortMap[`b_${colorObj.short}`] = `b_${colorObj.long}`;
  });
}

initColor();

// directive regexp
const expressReg = /(?:@[\w-]+)+\((?:.|\n)*?\)/g;
const parseReg = /((?:@[\w-]+)+)\(((?:.|\n)*?)\)/;
const directiveReg = /@([\w-]+)/g;


function getDirective(directiveStr) {
  return directiveStr.replace(directiveReg, ($0, name) => {
    const directive = directives[shortMap[name]] || directives[name];
    if (!directive) {
      throw Error(`[conshow] the directive "@${name}" is not undefined.`);
    }
    if (typeof directive === 'function') {
      return directive();
    }
    return directive;
  });
}


function directiveParser(str) {
  return str.replace(expressReg, express =>
    express.replace(parseReg, ($0, directiveStr, content) =>
      `${getDirective(directiveStr)}${content}${directives.clear}`));
}


module.exports = {
  directiveParser,
};
