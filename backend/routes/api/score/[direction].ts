import type { Response, Request } from "express"

import { GetScore, UpdateScore } from "../../../utils/files.ts";

/**
 *
 * @param req
 * @param res
 *
 * This is a patch method on the /api/score/[direction] route.
 * It allows for the score to be incremented or decremented.
 *
 * @returns void (sends a response to a client)
 *
 */

export const patch = async (req: Request, res: Response) => {

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

}