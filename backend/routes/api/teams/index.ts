import type { Response, Request } from "express"

import {GetAllTeams} from "../../../utils/files.ts";

/**
 *
 * @param req
 * @param res
 *
 * This is a get method on the /api/teams route.
 * It allows for the teams of all teams to be retrieved.
 *
 * @returns void (sends a response to a client)
 *
 */

export const get = async (req: Request, res: Response) => {

    const Teams = await GetAllTeams();

    res.json({
        Scores: Teams
    });

}