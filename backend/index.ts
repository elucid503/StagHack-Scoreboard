// Scoreboard for the StagHack Competition, 2024

import express from 'express';
import cors from 'cors';

import { readFile, writeFile } from 'fs/promises';

import { port } from "./config.json"

const app = express();

app.use(express.static('../frontend/')); // For serving HTML files

// Always send CORS headers

app.use(cors());

app.listen(port, () => {

    console.log(`INFO: Server started on port ${port}`);

});

// Static routes

app.get('/', (_req, res) => {

    res.sendFile('./html/index.html', { root: '../frontend/' });

});

app.get('/api', (_req, res) => {

    res.json({
        Message: "Hello World!"
    });

});

// Some helpful functions to read and write the score

async function UpdateScore(NewScore: number): Promise<boolean> {

    let data = await readFile("./scores.json", "utf8").catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!data) return false;

    let stored = JSON.parse(data);
    stored.CurrentScore = NewScore;

    await writeFile("./scores.json", JSON.stringify(stored));

    return true;

}

async function GetScore(): Promise<number> {

    let data = await readFile("./scores.json", "utf8").catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!data) return -1;

    let stored = JSON.parse(data);
    return stored.CurrentScore ?? -1; // ?? because || doesn't work for 0 (gotta love javascript!)

}

// Easy way to just get the number
app.get('/api/score', async (_req, res) => {

    let score = await GetScore();

    res.json({
        Score: score
    });

});

// Can send a patch to easily increment the score
app.patch('/api/score/:direction', async (req, res) => {

    let score = await GetScore();
    let direction: string | null = req.params.direction;

    let NewScore = direction == "down" ? score - 1 : score + 1;

    let success = await UpdateScore(NewScore);

    if (success) {

        res.json({
            Score: NewScore
        });

    } else {

        res.json({
            Error: "Failed to update score"
        });

    }

});

// Can send a post with a score url-param to overwrite the score

app.post('/api/score/:score', async (req, res) => {

    let score = parseInt(req.params.score);

    if (isNaN(score)) {

        res.json({
            Error: "Invalid number provided."
        });

        return;

    }

    let success = await UpdateScore(score);

    if (success) {

        res.json({
            Score: score
        });

    } else {

        res.json({
            Error: "Failed to update score"
        });

    }

});

// Define a 404 route (after all other routes)

app.use((_req, res) => {

    res.status(404).json({

        Error: "404: Not Found"

    });

});





