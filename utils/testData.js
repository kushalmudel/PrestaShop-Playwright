// Utility for generating dynamic test data using faker
const { faker } = require("@faker-js/faker");

function generateUser() {
  const gender = faker.helpers.arrayElement(["Mr", "Mrs"]);
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const password =
    faker.internet.password({ length: 12, memorable: true }) + "1!";
  const birthdate = faker.date.birthdate({
    min: 1950,
    max: 2002,
    mode: "year",
  });
  // Format birthdate as yyyy-mm-dd
  const birthdateStr = birthdate.toISOString().split("T")[0];
  return {
    gender,
    firstName,
    lastName,
    email,
    password,
    birthdate: birthdateStr,
  };
}

module.exports = { generateUser };
