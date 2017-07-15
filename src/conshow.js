const readline = require('readline');
const crypto = require('crypto');
const parser = require('./parser');

const SIGN = {
  SPACE: ' ',
  CORNER: '+',
  ROW: '-',
  COL: '|',
  NODE: '└',
  DASH: '─',
};

/**
 * @constructor
 */
function Conshow() {
  this.cache = {};
  this.indexes = [];
  this.id = 0;
  this.isRefreshTask = false;
  this.newLog();
}


/**
 * turn to next page
 */
Conshow.prototype.newLog = function () {
  const blank = '\n\n'.repeat(process.stdout.rows);
  process.stdout.write(blank);
};


/**
 * clear the console and clear the cache
 */
Conshow.prototype.clear = function () {
  this.cache = {};
  this.indexes = [];
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};


/**
 * refresh the cache to console
 */
Conshow.prototype.refresh = function () {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
  const _cache = this.cache;
  this.indexes.forEach((id) => {
    process.stdout.write(_cache[id]);
  });
};


/**
 * output the msg without enter('\n')
 *
 * @param {String} msg
 * @param {String} id
 * @return {Conshow}
 */
Conshow.prototype.out = function (msg, option = {}) {
  const self = this;
  const { id = crypto.createHash('md5').update(Math.random().toString()).digest('hex') } = option;
  if (!self.cache[id]) {
    this.indexes.push(id);
    Object.defineProperty(self.cache, id, {
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
  self.id = id;
  self.cache[id] = `\x1b[0m${parser.directiveParser(msg, option)}`;
  return this;
};


/**
 * @description help delete the log
 * @param {String|Array} ids
 *
 * @api public
 */
Conshow.prototype.delete = function (ids) {
  if (!/Array/.test(Object.prototype.toString(ids))) {
    ids = [ids];
  }
  let index;
  ids.forEach((id) => {
    delete this.cache[id];
    index = this.indexes.indexOf(id);
    this.indexes.splice(index, 1);
  });
  this.refresh();
  return this;
};


/**
 * @description help output a line with '\n'
 * @param {String} msg
 * @param {String} id
 */
Conshow.prototype.log = function (msg, option) {
  return this.out(`${msg}\n`, option);
};


/**
 * help create a table
 *
 * @param {Array} table
 * @param {String} id
 *
 * @return {Conshow}
 */
Conshow.prototype.table = function (table, option) {
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

  this.out(msg, option);
  return this;
};


/**
 * help create a json tree
 *
 * @param {any} tree the jsonObj
 * @param {any} id
 * @return {Conshow}
 */
Conshow.prototype.tree = function (jsonObj, option) {
  const msg = (function parseObject(tree, deep) {
    return Object.keys(tree).reduce((last, key) => {
      if (typeof tree[key] === 'object') {
        return `${last}${' '.repeat(deep * 5)}${SIGN.NODE}${SIGN.DASH.repeat(3)} ${key} \n${parseObject(tree[key], deep + 1)}`;
      }
      return `${last}${' '.repeat(deep * 5)}${SIGN.NODE}${SIGN.DASH.repeat(3)} ${key}: ${tree[key]}\n`;
    }, '');
  }(jsonObj, 0));
  return this.out(msg, option);
};


module.exports = Conshow;
