const draw = require("./draw");

const drawAndPartition = (applicants, n, random) => {
  const drawnApplicants = draw(applicants, n, random);

  return [
    drawnApplicants,
    applicants.filter(elem => !drawnApplicants.includes(elem))
  ];
};

module.exports = (applicants, pools, random) => {
  // first draw from the default pool;
  const [drawnDefault, leftDefault] = drawAndPartition(
    applicants,
    pools.default,
    random
  );

  let allDrawn = [...drawnDefault];
  let currentLeft = leftDefault;
  // Go through the other pools
  for (const pool in pools) {
    if (pool === "default") continue;

    const qualifiedApplicants = applicants.filter(applicant => applicant[pool]);

    const [drawnExtra, rest] = drawAndPartition(
      qualifiedApplicants,
      pools[pool],
      random
    );
    currentLeft = rest;
    allDrawn = allDrawn.concat(drawnExtra);
  }

  return allDrawn;
};
