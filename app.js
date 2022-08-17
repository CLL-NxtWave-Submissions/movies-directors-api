const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json()); // To parse json object in request body

const moviesDataFilePath = path.join(__dirname, "moviesData.db");
const sqliteDBDriver = sqlite3.Database;

let moviesDBConnectionObj = null;

const initializeDBAndServer = () => {
  try {
    moviesDBConnectionObj = open({
      filename: moviesDataFilePath,
      driver: sqliteDBDriver,
    });

    app.listen(3000, () => {
      console.log("Server running and listening on port 3000 !");
    });
  } catch (exception) {
    console.log(`Error initializing DB and Server: ${exception.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
