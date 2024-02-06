const Routes = {

    GetAllScores: { Url: "http://localhost:1337/api/teams", Method: "GET" },
    UpdateTeamScore: { Url: "http://localhost:1337/api/teams/update", Method: "PATCH" },

    CreateTeam: { Url: "http://localhost:1337/api/teams/create", Method: "POST" },
    DeleteTeam: { Url: "http://localhost:1337/api/teams/delete", Method: "POST" }, // Should be a delete method but using post for now

}

const Elements = {

    Teams: $(".teams"),
    Increment: $(".button.increment"),

    ErrorMessage: $(".error-container"),
    ErrorBackdrop: $(".error-backdrop"),

    NoTeams: $(".no-teams"),

}

function ShowError(Message) {

    Elements.ErrorBackdrop.fadeIn(500);
    Elements.ErrorMessage.fadeIn(500);

    const ErrorMessage = Elements.ErrorMessage.find(".error-text");

    ErrorMessage.text(Message);

    setTimeout(() => {

        Elements.ErrorBackdrop.fadeOut(500);
        Elements.ErrorMessage.fadeOut(500);

    }, 3000);

}

async function MakeRequestToBackend(Route, Body){

    const response = await fetch(`${Route.Url}`, {

        method: Route.Method,
        headers: { "Content-Type": "application/json" },
        body: Body ? JSON.stringify(Body) : null,

    }).catch((error) => {

        console.error(error);
        console.log(`REQUEST ERR: ${error}`);

    });

    return await response?.json().catch((error) => {

        console.log(`REQ PARSE ERR: ${error}`);

    });

}

async function IncrementTeamScore(TeamID, Direction) {

    const response = await MakeRequestToBackend(Routes.UpdateTeamScore, { TeamID: TeamID, Direction: Direction });

    if (!response) {

        ShowError("Failed to update team score.");
        return;

    }

    return response;

}

async function CreateTeam(TeamName) {

    const response = await MakeRequestToBackend(Routes.CreateTeam, { TeamName: TeamName });

    if (!response) {

        ShowError("Failed to create team.");
        return;

    }

    return response;

}

async function DeleteTeam(TeamID) {

    const response = await MakeRequestToBackend(Routes.DeleteTeam, { TeamID: TeamID });

    if (!response) {

        ShowError("Failed to delete team.");
        return;

    }

    return response;

}

function HandleTeamsUpdate(Teams) {

    $(".team").remove();

    Teams.sort((a, b) => b.CurrentScore - a.CurrentScore);

    Teams.forEach((team) => {

        let HTML = `<div class="team-name">${team.TeamName}</div>
            <div class="team-score">${team.CurrentScore}</div>`

        if (window.IsControl) {

            HTML += `<div class="score-controls">
                <div class="button increment" data-team-id="${team.TeamID}">Add</div>
                <div class="button delete" data-team-id="${team.TeamID}">Subtract</div>
            </div>`;

        }

        const Element = document.createElement("div");
        Element.className = "team";
        Element.dataset.score = team.CurrentScore;
        Element.id = team.TeamID;

        Element.innerHTML = HTML;

        Elements.Teams.append(Element);

        if (window.IsControl) {

            Element.style.height = "100px";

        }

    });

    if (Teams.length < 1) {

        Elements.NoTeams.show();

    }

    else {

        Elements.NoTeams.hide();

    }

    StyleTeams();

}

// connect to websocket to listen for updates

function InitWebSocket() {

    const socket = new WebSocket("ws://localhost:1337/api/listen");

    socket.onopen = () => {

        console.log("Connected to websocket");

    }

    socket.onmessage = (event) => {

        // Assume new teams are added, updated or received

        const data = JSON.parse(event.data);

        if (data.Teams) {

            HandleTeamsUpdate(data.Teams);

        }

    }

}

InitWebSocket();

function StyleTeams() { // Assumes all teams are placed

    const Teams = $(".team");

    // Loop through all teams

    const TeamsWithScores = [];

    Teams.each((index, team) => {

        const score = parseInt(team.dataset.score || "0");

        TeamsWithScores.push({ Element: team, Score: score });

    });

    // Get top 3

    TeamsWithScores.sort((a, b) => b.Score - a.Score);

    if (TeamsWithScores.length < 3) return;

    const Top3 = TeamsWithScores.slice(0, 3);

    // Style top 3

    const First = $(Top3[0].Element);
    const Second = $(Top3[1].Element);
    const Third = $(Top3[2].Element);

    // Adjust for gold, bronze, silver box shadow

    First.css("box-shadow", "0 0 50px 2px rgba(255, 245, 0, 0.1)");
    Second.css("box-shadow", "0 0 50px 2px rgba(192, 192, 192, 0.2)");
    Third.css("box-shadow", "0 0 50px 2px rgba(205, 127, 60, 0.15)");

}

function CreateClickableList(contents, ids) {

    const X = (window.innerWidth / 2) - 100;
    const Y = (window.innerHeight) - 380;

    const List = document.createElement("div");

    List.className = "list-container";
    List.style.display = "none";

    List.innerHTML = `<div class="list-contents">`;

    contents.forEach((content) => {

        const ID = ids[contents.indexOf(content)];

        List.innerHTML += `<div class="list-item" data-id="${ID}">${content}</div>`;

    });

    List.innerHTML += `</div>`;

    document.body.appendChild(List);

    List.style.left = `${X}px`;
    List.style.top = `${Y}px`;

    List.style.display = "block";

    return List;

}

StyleTeams();

// Admin Button Listeners

if (window.IsControl) {

    Elements.Teams.on("click", ".button.increment", async (event) => {

        const TeamID = event.target.dataset.teamId;

        await IncrementTeamScore(TeamID, "up");

    });

    Elements.Teams.on("click", ".button.delete", async (event) => {

        const TeamID = event.target.dataset.teamId;

        await IncrementTeamScore(TeamID, "down");

    });

    $(".button.add-team").on("click", async () => {

        if (!TeamName) return;

        await CreateTeam(TeamName);

    });

    $(".button.rm-team").on("click", async () => {

        const OtherLists = $(".list-container");
        let ToReturn = false;

        OtherLists.each((index, list) => {

            list.remove();
            ToReturn = true;

        });

        if (ToReturn) return;

        // Show list of teams

        const Teams = $(".team");

        const TeamNames = [];
        const TeamIDs = [];

        Teams.each((index, team) => {

            const Name = team.querySelector(".team-name").innerText;
            const ID = team.id;

            TeamNames.push(Name);
            TeamIDs.push(ID);

        });

        const List = CreateClickableList(TeamNames, TeamIDs);

        List.addEventListener("click", async (event) => {

            const TeamID = event.target.dataset.id;

            if (!TeamID) return;

            await DeleteTeam(TeamID);

            List.remove();

        });

    });

}

