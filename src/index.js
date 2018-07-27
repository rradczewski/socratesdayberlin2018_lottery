const FILE = process.argv[2];

const fs = require("fs");
const R = require("ramda");

const randomSeed = require("random-seed");
const parseCsv = require("csv-parse/lib/sync");

const lottery = require("./lottery");
const statistics = require("./statistics");

const rowToApplicant = row => ({
  id: row.Email,
  diversity:
    row.Ticket === "Diversity Ticket (free with deposit)" ||
    row.Ticket === "Journeyperson & Diversity Ticket (free with deposit)",
  journey:
    row.Ticket === "Journeyperson Ticket (free with deposit)" ||
    row.Ticket === "Journeyperson & Diversity Ticket (free with deposit)"
});

const random = randomSeed();
const applicants = parseCsv(fs.readFileSync(FILE).toString(), {
  columns: true
}).map(rowToApplicant);

const pools = { default: 35, diversity: 10, journey: 5 };

statistics((random) => lottery(applicants, pools, random), 1000);

const winners = lottery(applicants, pools, random);
const loosers = R.without(winners, applicants);
console.log('Winners', winners.map(a => JSON.stringify(a)));
console.log('Loosers', loosers.map(a => JSON.stringify(a)));
