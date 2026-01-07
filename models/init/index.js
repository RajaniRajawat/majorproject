const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../listing.js");  // fixed path

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to db");
    initDb();  // db seed ko call karo yahi pe
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  await Listing.deleteMany({});

  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "693b62c58863b96c6de65f04",
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("data was initialized ✅");
  mongoose.connection.close();
};
