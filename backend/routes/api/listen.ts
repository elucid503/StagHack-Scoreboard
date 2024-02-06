import { WebSocket } from "ws";

import { ScoreOrTeamChangedEmitter } from "../../index.ts";

import {GetAllTeams} from "../../utils/files.ts";

/**
 *
 * @param ws (WebSocket) - The WebSocket object
 *
 * This allows for clients to listen for when a teams score changes, live.
 *
 * @returns void (sends a response to a client)
 *
 */

export const ws = async (ws: WebSocket) => {

    // Send all the teams on open

    const Teams = await GetAllTeams();

    ws.send(JSON.stringify({ Status: 200, Message: "Initial Connect", Teams: Teams }));

    // Listen for changes to the teams

    ScoreOrTeamChangedEmitter.on("ScoreOrTeamChanged", async () => {

        // Something happened, so send to any connected clients

        const Teams = await GetAllTeams();

        ws.send(JSON.stringify({ Status: 200, Message: "Score or Team Changed", Teams: Teams }));

    });

}