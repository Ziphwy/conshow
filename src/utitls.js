const { getRealLength } = require('./parser');

function transformInput(str) {
  let _str = '';
  if (str === null) {
    _str = 'null';
  } else if (str === undefined) {
    _str = 'undefined';
  } else if (/string/i.test(Object.prototype.toString.call(str))) {
    _str = str.toString();
  } else {
    _str = JSON.stringify(str) || str.toString();
  }
  return _str;
}

function fill(str, len, placeholder, align) {
  const _str = transformInput(str);

  let leftPad,
    rightPad;
  switch (align) {
    case 'center':
      leftPad = Math.floor((len - getRealLength(_str)) / 2);
      rightPad = len - leftPad;
      break;
    case 'right':
      leftPad = len - getRealLength(_str) - 1;
      rightPad = 1;
      break;
    default:
      leftPad = 1;
      rightPad = len - getRealLength(_str) - 1;
  }
  return `${placeholder.repeat(leftPad)}${_str}${placeholder.repeat(rightPad)}`;
}

module.exports = {
  fill,
};
