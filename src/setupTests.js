const randomSeed = require('random-seed');
const R = require('ramda');

beforeEach(() => {
  expect.randomSeed = Math.random();
  expect.random = randomSeed(expect.randomSeed);
})

expect.extend({
  toProbablyContain(fn, element, expected_p, e = 0.005, n = 100000) {
    let found = 0;
    for (let i = 0; i < n; i++) {
      if (R.contains(element, fn(expect.random))) {
        found++;
      }
    }

    const actual_p = found / n;
    const pass = Math.abs(actual_p - expected_p) <= e;
    if (pass) {
      return {
        message: () =>
          `expected ${fn} to not yield ${element} with p = ${expected_p}, but was ${
            actual_p
          } (seed was ${expect.randomSeed})`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `expected ${fn} to yield ${element} with p = ${expected_p}, but was ${
            actual_p
          } (seed was ${expect.randomSeed})`,
        pass: false
      };
    }
  }
});
