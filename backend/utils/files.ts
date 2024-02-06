import Bun from "bun";
import {Team} from "../structs/team.ts";

export async function UpdateScore(TeamID: string, NewScore: number): Promise<boolean> {

    const File = Bun.file("./storage/teams.json");

    const StoredTeams = await File.json().catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!StoredTeams) return false;

    StoredTeams[TeamID].CurrentScore = NewScore;

    return await Bun.write(File, JSON.stringify(StoredTeams)).catch(err => {

        console.log(`FILE ERR: ${err}`);
        return false;

    }).then(() => { return true; });

}

export async function GetScore(TeamID: string): Promise<number> {

    const File = Bun.file("./storage/teams.json");

    const Teams = await File.json().catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!Teams) return -1;

    return Teams[TeamID]?.CurrentScore ?? -1; // ?? because || doesn't work for 0 (gotta love javascript!)

}

export async function GetAllTeams(): Promise<Team[]> {

    const File = Bun.file("./storage/teams.json");

    const Teams = await File.json().catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!Teams) return [];

    return Object.values(Teams);

}

export async function RegisterTeam(TeamID: string, TeamName: string): Promise<boolean> {

    const File = Bun.file("./storage/teams.json");

    const StoredTeams = await File.json().catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!StoredTeams) return false;

    StoredTeams[TeamID] = {

        TeamID: TeamID,
        TeamName: TeamName,
        CurrentScore: 0,

    } satisfies Team;

    return await Bun.write(File, JSON.stringify(StoredTeams)).catch(err => {

        console.log(`FILE ERR: ${err}`);
        return false;

    }).then(() => { return true; });

}

export async function DeleteTeam(TeamID: string): Promise<boolean> {

    const File = Bun.file("./storage/teams.json");

    const StoredTeams = await File.json().catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!StoredTeams) return false;

    delete StoredTeams[TeamID];

    return await Bun.write(File, JSON.stringify(StoredTeams)).catch(err => {

        console.log(`FILE ERR: ${err}`);
        return false;

    }).then(() => { return true; });

}