const fs = require("fs");
const R = require("ramda");
const randomSeed = require("random-seed");
const parseCsv = require("csv-parse/lib/sync");
const crypto = require("crypto");

const lottery = require("./lottery");
const statistics = require("./statistics");

const FILE = process.argv[2];
const SEED = (process.argv[3] && Number(process.argv[3])) || Math.random();
const SALT_SEED = (process.argv[4] && Number(process.argv[4])) || Math.random();
const MASK_MAILS = process.env.MASK_MAILS === "1";

console.log("SEED", SEED);
const random = randomSeed(SEED);

console.log("SALT_SEED", SALT_SEED);
const salt_random = randomSeed(SALT_SEED);

const maybeMaskMail = applicant =>
  !MASK_MAILS
    ? applicant
    : {
        ...applicant,
        id: crypto
          .pbkdf2Sync(
            applicant.id,
            `socratesdayber2018_${salt_random.random()}`,
            1000,
            32,
            "sha512"
          )
          .toString("hex")
      };

const rowToApplicant = row => {
  return {
    id: row.Email,
    signed_up_at: new Date(row["Date Signed Up"]),
    diversity:
      row.Ticket === "Diversity Ticket (free with deposit)" ||
      row.Ticket === "Journeyperson & Diversity Ticket (free with deposit)",
    journey:
      row.Ticket === "Journeyperson Ticket (free with deposit)" ||
      row.Ticket === "Journeyperson & Diversity Ticket (free with deposit)"
  };
};

const applicants = R.pipe(
  file => fs.readFileSync(file).toString(),
  content => parseCsv(content, { columns: true }),
  R.map(rowToApplicant),
  R.sortBy(applicant => applicant.signed_up_at.getTime())
)(FILE);

// Check for duplicates
if (R.uniqBy(R.prop("id"), applicants).length !== applicants.length) {
  throw new Error("Duplicate applicant found!");
}

const ticketsAvailable = { default: 30, diversity: 10, journey: 5 };
console.log("Tickets available", ticketsAvailable);

statistics(random => lottery(applicants, ticketsAvailable, random), 50);

const winners = lottery(applicants, ticketsAvailable, random);
const not_winners = R.reject(
  applicant => R.any(R.propEq("id", applicant.id), winners),
  applicants
);

console.log("Winners", winners.map(maybeMaskMail).map(a => JSON.stringify(a)));
console.log(
  "Not Winners",
  not_winners.map(maybeMaskMail).map(a => JSON.stringify(a))
);

const ticketsSpent = R.map(R.length, R.groupBy(R.prop("won_through"), winners));
const ticketsLeft = R.mergeWith(R.subtract, ticketsAvailable, ticketsSpent);

console.log("Tickets spent", ticketsSpent);
console.log("Tickets left", ticketsLeft);
