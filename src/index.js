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

const seed = (process.argv[3] && Number(process.argv[3])) || Math.random();
console.log('Seed is', seed);
const random = randomSeed(seed);
const applicants = parseCsv(fs.readFileSync(FILE).toString(), {
  columns: true
}).map(rowToApplicant);

// Check for duplicates
if(R.uniqBy(R.prop('id'), applicants).length !== applicants.length) {
  throw new Error("Duplicate applicant found!");
}

const ticketsAvailable = { default: 30, diversity: 10, journey: 5 };

statistics(random => lottery(applicants, ticketsAvailable, random), 50);

const winners = lottery(applicants, ticketsAvailable, random);
const not_winners = R.reject(applicant => R.any(R.propEq('id', applicant.id), winners), applicants)

console.log("Winners", winners.map(a => JSON.stringify(a)));
console.log("Not Winners", not_winners.map(a => JSON.stringify(a)));

const ticketsSpent = R.map(R.length, R.groupBy(R.prop("won_through"), winners));
const ticketsLeft = R.mergeWith(R.subtract, ticketsAvailable, ticketsSpent)

console.log('Tickets spent', ticketsSpent);
console.log('Tickets left', ticketsLeft);
