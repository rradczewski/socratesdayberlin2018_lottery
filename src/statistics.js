const randomSeed = require("random-seed");
const R = require("ramda");

const groupForApplicant = ({ diversity, journey }) =>
  `R${diversity ? "D" : ""}${journey ? "J" : ""}`;

module.exports = (fn, n = 10000) => {
  const seed = Math.random();
  const random = randomSeed(seed);

  const found = {};
  for (let i = 0; i < n; i++) {
    const drawnElems = fn(random);
    for (let drawnElem of drawnElems) {
      const group = `${groupForApplicant(drawnElem)}_${drawnElem.id}`;
      found[group] = (found[group] || 0) + 1;
    }
  }

  const p_values = R.map(v => v / n, found);
  const groups = R.groupBy(R.compose(R.head, R.split("_")), Object.keys(found));

  const groupsSum = R.mapObjIndexed(
    (members, group) => R.sum(R.props(members, p_values)) / members.length,
    groups
  );

  console.log(`Ran ${n} simulations:`, "\n", groupsSum);
  return groupsSum;
};
