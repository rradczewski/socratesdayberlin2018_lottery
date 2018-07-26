const draw = require("./draw");
const R = require("ramda");

module.exports = (applicants, pools, random) => {
  let allDrawn = [];
  let allLeft = applicants;

  // Go through the other pools
  for (const pool in pools) {
    if (pool === "default") continue;
    const qualifiedApplicants = allLeft.filter(applicant => applicant[pool]);
    const drawnExtra = draw(qualifiedApplicants, pools[pool], random);

    allLeft = R.without(drawnExtra, allLeft);
    allDrawn = allDrawn.concat(drawnExtra);
  }

  // first draw from the default pool;
  const drawnDefault = draw(allLeft, pools.default, random);



  return allDrawn.concat(drawnDefault);
};
