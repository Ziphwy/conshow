const parser = require('../src/parser');
const should = require('should');

describe('single directive', () => {
  it('no directive', () => {
    parser.directiveParser('test').should.be.exactly('test');
  });

  it('@underline directive', () => {
    parser.directiveParser('@underline(test)').should.be.exactly('\x1b[4mtest\x1b[0m');
    parser.directiveParser('@u(test)').should.be.exactly('\x1b[4mtest\x1b[0m');
  });

  it('@inverse directive', () => {
    parser.directiveParser('@inverse(test)').should.be.exactly('\x1b[7mtest\x1b[0m');
    parser.directiveParser('@i(test)').should.be.exactly('\x1b[7mtest\x1b[0m');
  });

  it('@hide directive', () => {
    parser.directiveParser('@underline(test)').should.be.exactly('\x1b[4mtest\x1b[0m');
    parser.directiveParser('@u(test)').should.be.exactly('\x1b[4mtest\x1b[0m');
  });

  it('@f_black directive', () => {
    parser.directiveParser('@f_black(test)').should.be.exactly('\x1b[30mtest\x1b[0m');
    parser.directiveParser('@f_b(test)').should.be.exactly('\x1b[30mtest\x1b[0m');
  });

  it('@b_black directive', () => {
    parser.directiveParser('@b_black(test)').should.be.exactly('\x1b[40mtest\x1b[0m');
    parser.directiveParser('@b_b(test)').should.be.exactly('\x1b[40mtest\x1b[0m');
  });
});

describe('composite directive', () => {
  it('@underline & @f_darkgreen', () => {
    parser.directiveParser('@u@f_dg(test)').should.be.exactly('\x1b[4m\x1b[36mtest\x1b[0m');
  });
});
