const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      `connected on ${conn.connection.host}, on ${conn.connection.name}`
    );
  } catch (err) {
    console.log(err);
  }
};
module.exports = dbConnection;
