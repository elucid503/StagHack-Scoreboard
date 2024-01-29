import Bun from "bun";

export async function UpdateScore(NewScore: number): Promise<boolean> {

    const File = Bun.file("./storage/scores.json");

    const StoredScores = await File.json().catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!StoredScores) return false;

    StoredScores.CurrentScore = NewScore;

    return await Bun.write(File, JSON.stringify(StoredScores)).catch(err => {

        console.log(`FILE ERR: ${err}`);
        return false;

    }).then(() => { return true; });

}

export async function GetScore(): Promise<number> {

    const File = Bun.file("./storage/scores.json");

    const Scores = await File.json().catch(err => {

        console.log(`FILE ERR: ${err}`);
        return null;

    });

    if (!Scores) return -1;

    return Scores.CurrentScore ?? -1; // ?? because || doesn't work for 0 (gotta love javascript!)

}
