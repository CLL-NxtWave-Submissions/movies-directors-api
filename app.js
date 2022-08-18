const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json()); // To parse json object in request body

const moviesDataFilePath = path.join(__dirname, "moviesData.db");
const sqliteDBDriver = sqlite3.Database;

let moviesDBConnectionObj = null;

const initializeDBAndServer = async () => {
  try {
    moviesDBConnectionObj = await open({
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

/*
    End-Point 1: GET /movies
    ------------
    To get all movie names
    from the movie table in
    sqlite database.
*/
app.get("/movies", async (req, res) => {
  const getAllMoviesQuery = `
    SELECT *
    FROM movie;
    `;

  const allMovieData = await moviesDBConnectionObj.all(getAllMoviesQuery);
  const processedMovieData = allMovieData.map((singleMovieData) => ({
    movieName: singleMovieData.movie_name,
  }));

  res.send(processedMovieData);
});

/*
    End-Point 2: POST /movies
    ------------
    To add new movie data to
    the movie table in sqlite
    database.
*/
app.post("/movies", async (req, res) => {
  const { directorId, movieName, leadActor } = req.body;

  const addNewMovieDataQuery = `
    INSERT INTO
        movie (director_id, movie_name, lead_actor)
    VALUES
        (${directorId}, '${movieName}', '${leadActor}');
    `;

  const addNewMovieDataDBResponse = await moviesDBConnectionObj.run(
    addNewMovieDataQuery
  );

  res.send("Movie Successfully Added");
});

/*
    End-Point 3: GET /movies/:movieId
    ------------
    To get data of specific movie with 
    id: movieId, from the movie table in
    sqlite database.
*/
app.get("/movies/:movieId", async (req, res) => {
  const { movieId } = req.params;
  const getSpecificMovieDataQuery = `
    SELECT *
    FROM movie
    WHERE movieId = ${movieId};
    `;

  const requestedMovieData = moviesDBConnectionObj.get(
    getSpecificMovieDataQuery
  );
  const processedMovieData = {
    movieId: requestedMovieData.movie_id,
    directorId: requestedMovieData.director_id,
    movieName: requestedMovieData.movie_name,
    leadActor: requestedMovieData.lead_actor,
  };

  res.send(processedMovieData);
});

module.exports = app;
