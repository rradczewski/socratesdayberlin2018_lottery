const draw = require("./draw");
const R = require("ramda");

module.exports = (applicants, pools, random) => {
  let allDrawn = [];
  let allLeft = applicants;

  // Go through the priority pools first
  for (const pool in pools) {
    if (pool === "default") continue;
    const qualifiedApplicants = allLeft.filter(applicant => applicant[pool]);
    const drawnExtra = draw(qualifiedApplicants, pools[pool], random);

    allLeft = R.without(drawnExtra, allLeft);
    allDrawn = allDrawn.concat(R.map(R.assoc("won_through", pool), drawnExtra));
  }

  // draw rest from the default pool;
  const drawnDefault = draw(allLeft, pools.default, random).map(
    R.assoc("won_through", "default")
  );

  return allDrawn.concat(drawnDefault);
};
