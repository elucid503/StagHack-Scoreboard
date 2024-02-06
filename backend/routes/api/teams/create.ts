import type { Response, Request } from "express"

import {RegisterTeam} from "../../../utils/files.ts";

/**
 *
 * @param req
 * @param res
 *
 * This is a post method on the /api/teams/create route.
 * It allows for a team to be created.
 *
 * @returns void (sends a response to a client)
 *
 */

export const post = async (req: Request, res: Response) => {

    const TeamName = req.body.TeamName || null as string | null;

    const GenerateID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const success = await RegisterTeam(GenerateID, TeamName);

    if (success) {

        res.json({
            TeamID: GenerateID,
            TeamName: TeamName
        });

    } else {

        res.json({
            Error: "Failed to create team"
        });

    }

}