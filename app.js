const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The port is working");
    });
  } catch (e) {
    console.log(`DB ERROR :${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//GET METHOD
app.get("/players/", async (request, response) => {
  const getPlayersList = `SELECT *
    FROM cricket_team ;`;

  let playersList = await db.all(getPlayersList);
  const convertDbObjectToResponseObject = (dbObject) => {
    let { player_id, player_name, jersey_number, role } = dbObject;
    return {
      playerId: player_id,
      playerName: player_name,
      jerseyNumber: jersey_number,
      role: role,
    };
  };

  let result = playersList.map((ele) => convertDbObjectToResponseObject(ele));
  response.send(result);
});

//POST METHOD
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;

  const addPlayer = `INSERT INTO
     cricket_team(player_name,jersey_number,role)
     VALUES 
     ('${"Vishal"}',${17},'${"Bowler"}');`;

  let dbResponse = await db.run(addPlayer);
  response.send("Player Added to Team");
});

//GET BY ID METHOD
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersList = `SELECT *
    FROM cricket_team 
    WHERE player_id=${playerId};`;

  let player = await db.all(getPlayersList);
  const convertDbObjectToResponseObject = (dbObject) => {
    let { player_id, player_name, jersey_number, role } = dbObject;

    return {
      playerId: player_id,
      playerName: player_name,
      jerseyNumber: jersey_number,
      role: role,
    };
  };
  let result = convertDbObjectToResponseObject(...player);
  response.send(result);
});

//PUT METHOD
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;

  const updatePlayer = `UPDATE
     cricket_team
     SET 
     "player_name"="Maneesh",
        "jersey_number"= 54,
        "role"= "All-rounder"
    WHERE player_id=${playerId}`;

  let dbResponse = await db.run(updatePlayer);
  response.send("Player Details Updated");
});

//DELETE METHOD
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersList = `DElETE 
    FROM cricket_team 
    WHERE player_id=${playerId};`;

  await db.run(getPlayersList);
  response.send("Player Removed");
});

module.exports = express;
