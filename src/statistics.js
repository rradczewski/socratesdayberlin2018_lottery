const randomSeed = require("random-seed");
const R = require("ramda");

const groupForApplicant = ({ id, diversity, journey }) =>
  `R${diversity ? "D" : ""}${journey ? "J" : ""}`;

module.exports = (fn, n = 10000) => {
  const seed = Math.random();
  const random = randomSeed(seed);

  const found = {};
  for (let i = 0; i < n; i++) {
    const drawnElems = fn(random);
    for (let drawnElem of drawnElems) {
      found[drawnElem.id] = (found[drawnElem.id] || 0) + 1;
    }
  }

  const p_values = R.map(v => v / n, found);

  const groups = R.groupBy(R.compose(R.head, R.split("_")), Object.keys(found));
  const groupsCnt = R.map(R.compose(R.length, R.values), groups);
  const groupsSum = R.mapObjIndexed(
    (members, group) => R.sum(R.props(members, p_values)) / groupsCnt[group],
    groups
  );

  console.log(`Ran ${n} simulations:`, "\n", groupsSum);
};
