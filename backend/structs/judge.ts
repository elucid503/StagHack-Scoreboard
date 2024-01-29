import Bun from "bun";

export class Judge {

    public Username: string;
    public ID: string;

    constructor(username: string, id: string) {

        this.Username = username;
        this.ID = id;

    }

    async Save(): Promise<boolean> {

        const StorageFile = Bun.file("./storage/judges.json");

        const StoredJudges = await StorageFile.json().catch(() => { return []; });

        StoredJudges.push(JSON.stringify(this)); // This structure does not contain any circular refs, but this must be changed if it does

        return await Bun.write(StorageFile, JSON.stringify(StoredJudges)).catch(() => { return false; }).then(() => { return true; });

    }

    async Load(): Promise<boolean> {

        const StorageFile = Bun.file("./storage/judges.json");

        const StoredJudges = await StorageFile.json().catch(() => { return []; });

        const Judge = StoredJudges.find((Judge: string) => { return JSON.parse(Judge).ID == this.ID; });

        if (!Judge) return false;

        const JudgeObject = JSON.parse(Judge);

        // Deep assign the properties

        for (let property in JudgeObject) {

            this[property as keyof Judge] = JudgeObject[property];

        }

        return true;

    }

}