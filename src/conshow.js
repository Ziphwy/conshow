const readline = require('readline');
const crypto = require('crypto');
const parser = require('./parser');
const { fill } = require('./utitls');

const SIGN = {
  SPACE: ' ',
  CORNER: '+',
  ROW: '-',
  COL: '|',
  NODE: '└',
  DASH: '─',
};

const conshowBar = `\n\x1b[7;32m # Conshow ${' '.repeat(process.stdout.columns - 11)}\x1b[0m\n\n`;

/**
 * @constructor
 */
function Conshow() {
  this.cache = { conshowBar };
  this.indexes = ['conshowBar'];
  this.id = 0;
  this.isRefreshTask = false;
  this.newLog();
}


/**
 * turn to next page
 */
Conshow.prototype.newLog = function () {
  // const blank = '\n\n'.repeat(process.stdout.rows);
  // process.stdout.write(blank);
  process.stdout.write('\x1b[s');
};


/**
 * clear the console and clear the cache
 */
Conshow.prototype.clear = function () {
  this.cache = { conshowBar };
  this.indexes = ['conshowBar'];
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};


/**
 * refresh the cache to console
 */
Conshow.prototype.refresh = function () {
  // readline.cursorTo(process.stdout, 0, 0);
  // readline.clearScreenDown(process.stdout);
  process.stdout.write('\x1b[u');
  const _cache = this.cache;
  this.indexes.forEach((id) => {
    process.stdout.write(_cache[id]);
  });
  process.stdout.write('\n');
};


/**
 * print a string without '\n'.
 *
 * @param {String} msg
 * @param {String} id
 *
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
 * print a string with '\n'.
 *
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
Conshow.prototype.table = function (obj, option = {}) {
  const { colLen = 24 } = option;
  const format = str => fill(str, colLen, ' ');

  const unionObj = Object.keys(obj).reduce((last, rowKey) =>
    Object.assign({}, last, obj[rowKey]), {});

  const outline = `+${`${fill('', colLen, '-')}+`.repeat(Object.keys(unionObj).length + 1)}\n`;

  const title = `|${format('(index)')}|${Object.keys(unionObj).reduce((last, key) => `${last}${format(key)}|`, '')}\n`;

  const content = Object.keys(obj).reduce((lastRow, rowKey) => {
    const cols = Object.keys(unionObj).reduce((lastCol, colKey) => `${lastCol}${format(obj[rowKey][colKey])}|`, '');
    return `${lastRow}|${format(rowKey)}|${cols}\n`;
  }, '');

  this.out(`${outline}${title}${outline}${content}${outline}`, option);
};

/**
 * help create a json tree
 *
 * @param {any} tree the jsonObj
 * @param {any} id
 *
 * @return {Conshow}
 */
Conshow.prototype.tree = function (jsonObj, option) {
  const msg = (function parseObject(tree, deep) {
    return Object.keys(tree).reduce((last, key) => {
      if (typeof tree[key] === 'object') {
        return `${last}${' '.repeat(deep * 5)}${SIGN.NODE}${SIGN.DASH.repeat(3)} ${key} \n${parseObject(tree[key], deep + 1)}`;
      }
      return `${last}${' '.repeat(deep * 5)}${SIGN.NODE}${SIGN.DASH.repeat(3)} ${key}:\t${tree[key]}\n`;
    }, '');
  }(jsonObj, 0));
  return this.out(msg, option);
};


module.exports = Conshow;
