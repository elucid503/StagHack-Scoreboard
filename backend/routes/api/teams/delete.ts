import type { Response, Request } from "express"

import { ScoreOrTeamChangedEmitter} from "../../../index.ts";

import {DeleteTeam} from "../../../utils/files.ts";

/**
 *
 * @param req
 * @param res
 *
 * This is a post method on the /api/teams/delete route.
 * It allows for a team to be deleted.
 *
 * @returns void (sends a response to a client)
 *
 */

export const post = async (req: Request, res: Response) => {

    const TeamID = req.body.TeamID || null as string | null;

    const success = await DeleteTeam(TeamID);

    if (success) {

        res.json({
            TeamID: TeamID
        });

        ScoreOrTeamChangedEmitter.emit("ScoreOrTeamChanged");

    } else {

        res.json({
            Error: "Failed to delete team"
        });

    }

}