const readline = require('readline');
const crypto = require('crypto');
const parser = require('./parser');

const SIGN = {
  LOAD: '░',
  COMPLETE: '▓',
  SPACE: ' ',
  CORNER: '+',
  ROW: '-',
  COL: '|',
  // NODE: "├",
  NODE: '└',
  DASH: '─',
  COLORS: [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'purple',
    'darkGreen',
    'white',
  ],
};

/**
 * @constructor
 */
function Conshow() {
  this.terminalCache = {};
  this.indexes = [];
  this.isRefreshTask = false;
  this.newLog();
}

/**
 * turn next page
 */
Conshow.prototype.newLog = function () {
  // process.stdout.write('\x1b[s');
  const blank = '\n\n'.repeat(process.stdout.rows);
  process.stdout.write(blank);
};

/**
 * clear the console without clearing the cache
 */
Conshow.prototype.clear = function () {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};

/**
 * clear the console and clear the cache
 */
Conshow.prototype.reset = function () {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};

/**
 * refresh the cache to console
 */
Conshow.prototype.refresh = function () {
  this.clear();
  const _terminalCache = this.terminalCache;
  this.indexes.forEach((id) => {
    process.stdout.write(_terminalCache[id]);
  });
};

/**
 * output the 
 * 
 * @param {String} msg
 * @param {String} id
 */
Conshow.prototype.out = function (msg, id) {
  const self = this;
  if (!id) {
    id = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
  }
  if (!self.terminalCache[id]) {
    this.indexes.push(id);
    Object.defineProperty(self.terminalCache, id, {
      set(value) {
        this[`_${id}`] = value;
        if (!self.refreshTask) {
          process.nextTick(() => {
            self.refresh();
          });
        }
      },
      get() {
        return this[`_${id}`];
      },
    });
  }
  self.terminalCache[id] = `\x1b[0m${parser.directiveParser(msg)}`;
};

/**
 * @description help delete the log
 * @param {String|Array} ids
 */
Conshow.prototype.delete = function (ids) {
  if (!/Array/.test(Object.prototype.toString(ids))) {
    ids = [ids];
  }
  let index;
  ids.forEach((id) => {
    delete this.terminalCache[id];
    index = this.indexes.indexOf(id);
    this.indexes.splice(index, 1);
  });
  this.refresh();
};

/**
 * @description help output a line with '\n'
 * @param {String} msg
 * @param {String} id
 */
Conshow.prototype.outln = function (msg, id) {
  this.out(`${msg}\n`, id);
};

Conshow.prototype.tag = function (tagName, msg, color, id) {
  this.out(`\x1b[7m${tagName}\t${msg}`, id);
};

/**
 * @description help create a progress, default styles: ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░
 * @param {Number} percent
 * @param {String} id
 */
Conshow.prototype.progress = function (percent, id) {
  if (percent > 100 || percent < 0) {
    return;
  }
  const total = 40;
  const complete = Math.ceil((percent / 100) * total);
  const msg = `${SIGN.COMPLETE.repeat(complete)}${SIGN.LOAD.repeat(total - complete)}`;
  this.out(msg, id);
  return this;
};

/**
 * @description help create a table
 * @param {Array} table
 * @param {String} id
 */
Conshow.prototype.table = function (table, id) {
  let outline = SIGN.CORNER;

  for (let i = 0, ilen = table[0].length; i < ilen; i++) {
    let maxLen = 6;

    for (let j = 0, jlen = table.length; j < jlen; j++) {
      maxLen = Math.max(maxLen, JSON.stringify(table[j][i]).length);
    }

    for (let j = 0, jlen = table.length; j < jlen; j++) {
      const col = JSON.stringify(table[j][i]);
      const colLen = col.replace(/(?:@+[\w-]+)+\(((?:.|\n)*?)\)/g, '$1').length;
      if (colLen === maxLen) {
        table[j][i] = ` ${col} ${SIGN.COL}`;
      } else {
        table[j][i] = ` ${col}${' '.repeat((maxLen - colLen) + 1)}${SIGN.COL}`;
      }
    }

    outline += `${SIGN.ROW.repeat(maxLen + 2)}${SIGN.CORNER}`;
  }

  let msg = table.reduce((last, row) => `${last}|${row.join('')}\n`, '');

  msg = `\n${outline}\n${msg}${outline}\n`;

  this.out(msg, id);
  return this;
};

Conshow.prototype.tree = function (tree, id) {
  const msg = (function parseObject(tree, deep) {
    return Object.keys(tree).reduce((last, key) => {
      if (typeof tree[key] === 'object') {
        return `${last}${' '.repeat(deep * 5)}${SIGN.NODE}${SIGN.DASH.repeat(3)} ${key} \n${parseObject(tree[key], deep + 1)}`;
      }
      return `${last}${' '.repeat(deep * 5)}${SIGN.NODE}${SIGN.DASH.repeat(3)} ${key}: ${tree[key]}\n`;
    }, '');
  }(tree, 0));
  this.out(msg, id);
  return this;
};

module.exports = Conshow;
