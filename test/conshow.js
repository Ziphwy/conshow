const conshow = require('../index');
require('should');

describe('conshow', () => {
  it('test default progress', (done) => {
    let i = 0;
    const timer = setInterval(() => {
      if (i === 100) {
        clearInterval(timer);
        done();
      }
      conshow.log(`@i@g( test )\t@progress(${i}) ${i++}/100`, { id: '1' });
    }, 10);
  });

  it('test custom progress', (done) => {
    let i = 0;
    const timer = setInterval(() => {
      if (i === 100) {
        clearInterval(timer);
        done();
      }
      conshow.log(`@i@g( test )\t[ @progress(${i}) ] ${i++}/100`, {
        id: '2',
        completeChar: '#',
        loadChar: ' ',
      });
    }, 10);
  });

  it('test a table', () => {
    conshow.table({ x: 1, y: 2 });
  });

  it('test a table', () => {
    conshow.table([['name', 'sex', 'age'], ['Ben', 'male432423', '23'], ['Mary', 'female', '21']]);
  });

  it('test a tree', () => {
    conshow.tree([['name', 'sex', 'age'], ['Ben', 'male432423', '23'], ['Mary', 'female', '21']]);
  });
});

