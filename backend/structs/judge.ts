import Bun from "bun";

/**
 *
 * This is the (very simple) judge structure. It contains the username and ID of the judge.
 *
 * @param {string} Username The username of the judge
 * @param {string} ID The ID of the judge
 *
 * @returns {Judge} The judge object
 *
 **/

export class Judge {

    public Username: string;
    public ID: string;

    constructor(username: string, id: string) {

        this.Username = username;
        this.ID = id;

    }

    /**
    *
    * This is a very simple way to store data, but it works for this project.
    *
    * @returns {boolean} Whether the save was successful
    *
    * */

    async Save(): Promise<boolean> {

        const StorageFile = Bun.file("./storage/judges.json");

        const StoredJudges = await StorageFile.json().catch(() => { return []; });

        StoredJudges.push(JSON.stringify(this)); // This structure does not contain any circular refs, but this must be changed if it does

        return await Bun.write(StorageFile, JSON.stringify(StoredJudges)).catch(() => { return false; }).then(() => { return true; });

    }

    /**
     *
     * This loads the judge from the storage file and deep-assigns the properties.
     * This isn't really useful yet, but good to have.
     *
     * @returns {boolean} Whether the load was successful
     *
     */

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