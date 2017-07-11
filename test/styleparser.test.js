const parser = require('../src/parser');
const should = require('should');

const directives = {
  b_black: '\x1b[40m',
  b_blue: '\x1b[44m',
  b_darkgreen: '\x1b[46m',
  b_green: '\x1b[42m',
  b_purple: '\x1b[45m',
  b_red: '\x1b[41m',
  b_yellow: '\x1b[43m',
  clear: '\x1b[0m',
  f_black: '\x1b[30m',
  f_blue: '\x1b[34m',
  f_darkgreen: '\x1b[36m',
  f_green: '\x1b[32m',
  f_purple: '\x1b[35m',
  f_red: '\x1b[31m',
  f_yellow: '\x1b[33m',
  hide: '\x1b[8m',
  inverse: '\x1b[7m',
  underline: '\x1b[4m',
};

const shortMap = {
  c: 'clear',
  u: 'underline',
  i: 'inverse',
  h: 'hide',
  f_b: 'f_black',
  b_b: 'b_black',
  f_r: 'f_red',
  b_r: 'b_red',
  f_g: 'f_green',
  b_g: 'b_green',
  f_y: 'f_yellow',
  b_y: 'b_yellow',
  f_bl: 'f_blue',
  b_bl: 'b_blue',
  f_p: 'f_purple',
  b_p: 'b_purple',
  f_dg: 'f_darkgreen',
  b_dg: 'b_darkgreen',
};

describe('single directive', () => {
  it('no directive', () => {
    parser.directiveParser('test').should.be.exactly('test');
  });

  Object.keys(directives).forEach((key) => {
    it(`@${key} normal`, () => {
      parser.directiveParser(`@${key}(test)`).should.be.exactly(`${directives[key]}test\x1b[0m`);
    });
    it(`@${key} except`, () => {
      parser.directiveParser(`@${key}(test@f) test`).should.be.exactly(`${directives[key]}test@f\x1b[0m test`);
    });
    it(`@${key} except`, () => {
      parser.directiveParser(`@${key}(test()) test`).should.be.exactly(`${directives[key]}test(\x1b[0m) test`);
    });
  });

  Object.keys(shortMap).forEach((key) => {
    it(`@${key} normal`, () => {
      parser.directiveParser(`@${key}(test)`).should.be.exactly(`${directives[shortMap[key]]}test\x1b[0m`);
    });
    it(`@${key} except`, () => {
      parser.directiveParser(`@${key}(test@f) test`).should.be.exactly(`${directives[shortMap[key]]}test@f\x1b[0m test`);
    });
    it(`@${key} except`, () => {
      parser.directiveParser(`@${key}(test()) test`).should.be.exactly(`${directives[shortMap[key]]}test(\x1b[0m) test`);
    });
  });
});

describe('double directive', () => {
  Object.keys(directives).forEach((key1) => {
    Object.keys(directives).forEach((key2) => {
      it(`@${key1}@${key2}`, () => {
        parser.directiveParser(`test @${key1}@${key2}(test) test`).should.be.exactly(`test ${directives[key1]}${directives[key2]}test\x1b[0m test`);
      });
      it(`@${key1} + @${key2}`, () => {
        parser.directiveParser(`test @${key1}(test)placeholder@${key2}(test) test`).should.be.exactly(`test ${directives[key1]}test\x1b[0mplaceholder${directives[key2]}test\x1b[0m test`);
      });
    });
  });
});

