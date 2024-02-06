import type { Response, Request } from "express"

import { GetScore, UpdateScore } from "../../../utils/files.ts";

import { ScoreOrTeamChangedEmitter } from "../../../index.ts";

/**
 *
 * @param req
 * @param res
 *
 * This is a patch method on the /api/teams/update route.
 * It allows for the score of a team to be incremented or decremented.
 *
 * @returns void (sends a response to a client)
 *
 */

export const patch = async (req: Request, res: Response) => {

    const body = req.body as { TeamID: string, Direction: string } | null;

    const TeamID = body?.TeamID as string || null;
    const Direction: string | null = body?.Direction || null;

    if (!TeamID || !Direction) {

        res.json({
            Error: "No TeamID or Direction provided"
        });

        return;

    }

    let score = await GetScore(TeamID);

    let NewScore = Direction == "down" ? score - 1 : score + 1;

    let success = await UpdateScore(TeamID, NewScore);

    if (success) {

        ScoreOrTeamChangedEmitter.emit("ScoreOrTeamChanged", TeamID, NewScore);

        res.json({
            Score: NewScore
        });

    } else {

        res.json({
            Error: "Failed to update count"
        });

    }

}