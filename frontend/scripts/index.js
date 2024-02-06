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

function HandleTeamsUpdate(Teams) {

    Teams.sort((a, b) => b.CurrentScore - a.CurrentScore);

    Teams.forEach((team) => {

        const HTML = `<div class="team-name">${team.TeamName}</div>
            <div class="team-score">${team.CurrentScore}</div>`

        const Element = document.createElement("div");
        Element.className = "team";
        Element.dataset.score = team.CurrentScore;
        Element.id = team.TeamID;

        Element.innerHTML = HTML;

        Elements.Teams.append(Element);

    });

    if (Teams.length < 1) {

        Elements.NoTeams.show();

    }

    else {

        Elements.NoTeams.hide();

    }

    StyleTeams();

}

async function GetAllTeams() {

    const response = await MakeRequestToBackend(Routes.GetAllScores);

    if (!response) {

        ShowError("Failed to get initial scores from the API.");
        return;

    }

    const Teams = response.Teams;

    // Sort by score

    HandleTeamsUpdate(Teams);

}

GetAllTeams().then(() => {});

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

            Elements.Teams.empty();
            HandleTeamsUpdate(data.Teams);

        }

    }

}

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

StyleTeams();




