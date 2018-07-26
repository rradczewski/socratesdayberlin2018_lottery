const draw = require("./draw");

it("should draw everyone from a list smaller than N", () => {
  const list = [1, 2, 3];
  const drawnElements = draw(list, 4, null);

  expect(drawnElements.slice().sort()).toEqual(list);
});

it("should draw someone with a chance n/m", () => {
  const list = [1, 2, 3, 4, 5, 6];

  const drawFromList = random => draw(list, 3, random);

  expect(drawFromList).toProbablyContain(1, 0.5);
});
