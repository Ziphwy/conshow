const parser = require('./parser');

parser.addDirective('progress', (percent, option = {}) => {
  const { total = 40, completeChar = '▓', loadChar = '░' } = option;
  if (percent > 100 || percent < 0) {
    throw new Error('\x1b[m[conshow] the percent must be in range between 0 and 100\x1b[0m');
  }
  const completed = Math.ceil((percent / 100) * total);
  const msg = `${completeChar.repeat(completed)}${loadChar.repeat(total - completed)}`;
  return msg;
});
