import type { Response, Request } from "express"

import { GetScore } from "../../../utils/files.ts";

/**
 *
 * @param req
 * @param res
 *
 * This is a get method on the /api/score route.
 * It allows for the score to be retrieved.
 *
 * @returns void (sends a response to a client)
 *
 */
export const get = async (req: Request, res: Response) => {

    let score = await GetScore();

    res.json({
        Score: score
    });

}