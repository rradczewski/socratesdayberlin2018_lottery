const lottery = require("./lottery");

it("should give someone with a diversity ticket a higher chance", () => {
  const pools = { default: 6, diversity: 4, journey: 2 };
  const applicants = [
    ...Array(6)
      .fill({})
      .map((_, i) => ({ id: `R${i}` })),
    ...Array(6)
      .fill({})
      .map((_, i) => ({ id: `D${i}`, diversity: true }))
  ];

  const drawLottery = random => lottery(applicants, pools, random);

  expect(drawLottery).toProbablyContain(
    { id: "R1" },
    0.5,
    0.01,
    5000
  );

  expect(drawLottery).toProbablyContain(
    { id: "D1", diversity: true },
    0.5 + 0.5 * 2 / 3,
    0.01,
    5000
  );
});

it("should give someone with a diversity & journey ticket a higher chance", () => {
  const pools = { default: 30, diversity: 10, journey: 5 };
  const applicants = [
    ...Array(40)
      .fill({})
      .map((_, i) => ({ id: `R${i}` })),
    ...Array(10)
      .fill({})
      .map((_, i) => ({ id: `D${i}`, diversity: true })),
    ...Array(10)
      .fill({})
      .map((_, i) => ({ id: `J${i}`, journey: true })),
    ...Array(10)
      .fill({})
      .map((_, i) => ({ id: `DJ${i}`, diversity: true, journey: true }))
  ];

  const drawLottery = random => lottery(applicants, pools, random);

  const chanceOfWinningDefault = 30 / 70,
    chanceOfWinningDiversity = 10 / 20,
    chanceOfWinningJourney = 5 / 20;

  expect(drawLottery).toProbablyContain(
    { id: "R1" },
    chanceOfWinningDefault,
    0.01,
    10000
  );

  expect(drawLottery).toProbablyContain(
    { id: "D1", diversity: true },
    chanceOfWinningDefault +
      (1 - chanceOfWinningDefault) * chanceOfWinningDiversity,
    0.01,
    10000
  );

  expect(drawLottery).toProbablyContain(
    { id: "J1", journey: true },
    chanceOfWinningDefault +
      (1 - chanceOfWinningDefault) * chanceOfWinningJourney,
    0.01,
    10000
  );

  expect(drawLottery).toProbablyContain(
    { id: "DJ1", diversity: true, journey: true },
    chanceOfWinningDefault +
      (1 - chanceOfWinningDefault) *
        (chanceOfWinningDiversity +
          (1 - chanceOfWinningDiversity) * chanceOfWinningJourney),
    0.01,
    10000
  );

  expect(drawLottery).toProbablyContain(
    { id: "DJ1", diversity: true, journey: true },
    chanceOfWinningDefault +
      (1 - chanceOfWinningDefault) *
        (chanceOfWinningJourney +
          (1 - chanceOfWinningJourney) * chanceOfWinningDiversity),
    0.01,
    10000
  );
});
