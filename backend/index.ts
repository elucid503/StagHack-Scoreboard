// Scoreboard for the StagHack Competition, 2024

import { EventEmitter } from "events";

import express from 'express';
import ws from 'express-ws';

import { router } from "express-file-routing";

import cors from 'cors';

import { port } from "./config.json"

const ScoreOrTeamChangedEmitter = new EventEmitter();

const { app } = ws(express());

app.use(express.static('../frontend/')); // For serving HTML files

// Always send CORS headers

app.use(cors());

// Log route requests (before they are handled)

app.use((req, _res, next) => {

    console.log(`INFO: ${req.method} request to ${req.path}`);

    next();

});

app.use("/", await router({ additionalMethods: ["ws"] })); // For serving files from the "routes" folder

console.log("INFO: Loaded all routes from the /routes directory.");

app.listen(port, () => {

    console.log(`INFO: Server started on port ${port}`);

});

// Define a 404 route (after all other routes)

app.use((_req, res) => {

    res.status(404).json({

        Error: "404: Not Found"

    });

});

export { ScoreOrTeamChangedEmitter }; // Export the event emitter for use in other files




