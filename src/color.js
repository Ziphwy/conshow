const parser = require('./parser');

const colors = [
  { short: 'b', long: 'black' },
  { short: 'r', long: 'red' },
  { short: 'g', long: 'green' },
  { short: 'y', long: 'yellow' },
  { short: 'bl', long: 'blue' },
  { short: 'p', long: 'purple' },
  { short: 'dg', long: 'darkgreen' },
];

colors.forEach((colorObj, index) => {
  parser.addDirective(colorObj.long, `\x1b[3${index}m`, colorObj.short);
  parser.addDirective(`_${colorObj.long}`, `\x1b[4${index}m`, `_${colorObj.short}`);
});
