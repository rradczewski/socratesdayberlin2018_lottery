const lottery = require("./lottery");
const statistics = require("./statistics");

it("should give someone with a diversity |/& journey ticket a higher chance", () => {
  const pools = { default: 30, journey: 5, diversity: 10 };
  const applicants = [
    ...Array(40)
      .fill({})
      .map((_, i) => ({ id: `R_${i}` })),
    ...Array(10)
      .fill({})
      .map((_, i) => ({ id: `D_${i}`, diversity: true })),
    ...Array(10)
      .fill({})
      .map((_, i) => ({ id: `J_${i}`, journey: true })),
    ...Array(10)
      .fill({})
      .map((_, i) => ({ id: `DJ_${i}`, diversity: true, journey: true }))
  ];

  const drawLottery = random => lottery(applicants, pools, random);

  const result = statistics(drawLottery, 1000);

  expect(result.RD).toBeGreaterThan(result.R);
  expect(result.RJ).toBeGreaterThan(result.R);
  expect(result.RD).toBeGreaterThan(result.RJ);

  expect(result.RDJ).toBeGreaterThan(result.RD);
  expect(result.RDJ).toBeGreaterThan(result.RJ);
});
