const Routes = {
    GetAllScores: { Url: "http://localhost:1337/api/teams", Method: "GET" },
    UpdateTeamScore: { Url: "http://localhost:1337/api/teams/update", Method: "PATCH" },
    CreateTeam: { Url: "http://localhost:1337/api/teams/create", Method: "POST" },
    DeleteTeam: { Url: "http://localhost:1337/api/teams/delete", Method: "POST" }, // Make DELETE in the future
};

const Elements = {
    Teams: $(".teams"),
    Increment: $(".button.increment"),
    ErrorMessage: $(".error-container"),
    BlurBackdrop: $(".blur-backdrop"),
    NoTeams: $(".no-teams"),

    TeamAddDialog: $(".input-modal"),
    TeamAddInput: $(".input-modal input"),
};

async function MakeRequestToBackend(Route, Body = null) {

    try {

        const response = await fetch(Route.Url, {
            method: Route.Method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Body),
        });
        return await response.json();

    } catch (error) {

        console.error(`Error during ${Route.Method} request to ${Route.Url}:`, error);
        ShowError("Oops, we ran into an API-related error.");

        return null;

    }

}

function ShowError(Message, Override = false) {

    if (Override) {

        Elements.BlurBackdrop.css("z-index", "6");
        Elements.ErrorMessage.css("z-index", "7");

    }

    Elements.BlurBackdrop.fadeIn(500);
    Elements.ErrorMessage.fadeIn(500).find(".error-text").text(Message);

    setTimeout(() => {

        Elements.BlurBackdrop.fadeOut(500);
        Elements.ErrorMessage.fadeOut(500);

        if (Override) {

            // Reset to default z-index

            Elements.BlurBackdrop.css("z-index", "2");
            Elements.ErrorMessage.css("z-index", "5");

        }

    }, 3000);

}

function ShowPopupNotification(Message) {

    const Notif = $(".popup-notification");
    const Text = $(".popup-notification-text");

    Text.text(Message);

    Notif.fadeIn(250);

    setTimeout(() => Notif.fadeOut(250), 3000);

}

function ShowTeamAddDialog() {

    Elements.BlurBackdrop.fadeIn(100);
    Elements.TeamAddDialog.fadeIn(100);

}

function HideTeamAddDialog() {

    Elements.BlurBackdrop.fadeOut(100);
    Elements.TeamAddDialog.fadeOut(100);

}

async function UpdateTeamScore(TeamID, Direction) {
    return await MakeRequestToBackend(Routes.UpdateTeamScore, { TeamID, Direction });
}

async function CreateTeam(TeamName) {
    return await MakeRequestToBackend(Routes.CreateTeam, { TeamName });
}

async function DeleteTeam(TeamID) {
    return await MakeRequestToBackend(Routes.DeleteTeam, { TeamID });
}

function HandleTeamsUpdate(Teams) {

    $(".team").remove(); // Remove all existing teams

    Teams.sort((a, b) => b.CurrentScore - a.CurrentScore).forEach(team => {
        Elements.Teams.append(CreateTeamElement(team));
    });

}

function CreateTeamElement(team) {

    const teamElement = $(`<div class="team" data-score="${team.CurrentScore}" id="${team.TeamID}">
        <div class="team-name">${team.TeamName}</div>
        <div class="team-score">${team.CurrentScore}</div>
        ${window.IsControl ? CreateControlButtons(team.TeamID) : ''}
    </div>`);

    if (window.IsControl) teamElement.css("height", "100px"); // Add height for control buttons
    return teamElement;

}

function CreateControlButtons(TeamID) {

    return `<div class="score-controls">
        <div class="button increment" data-team-id="${TeamID}">Add</div>
        <div class="button delete" data-team-id="${TeamID}">Subtract</div>
    </div>`;

}

function InitWebSocket() {

    const socket = new WebSocket("ws://localhost:1337/api/listen");
    socket.onmessage = event => {
        const { Teams } = JSON.parse(event.data);
        if (Teams) HandleTeamsUpdate(Teams);
        StyleTeams();
    };
    socket.onerror = () => ShowError("We ran into a WebSocket-related error.");

}

function StyleTeams() {
    const teamsWithScores = $(".team").toArray().map(team => ({
        Element: team,
        Score: parseInt(team.dataset.score, 10)
    })).sort((a, b) => b.Score - a.Score);

    const [first, second, third] = teamsWithScores;
    if (first) $(first.Element).css("box-shadow", "0 0 50px 2px rgba(255, 245, 0, 0.1)");
    if (second) $(second.Element).css("box-shadow", "0 0 50px 2px rgba(192, 192, 192, 0.2)");
    if (third) $(third.Element).css("box-shadow", "0 0 50px 2px rgba(205, 127, 60, 0.15)");

    if (teamsWithScores.length === 0) Elements.NoTeams.show();
    else Elements.NoTeams.hide();

}

// Event handlers for dynamic elements
$(document).ready(() => {

    InitWebSocket();

    // Admin Button Listeners

    if (window.IsControl) {

        Elements.Teams.on("click", ".button.increment", async (event) => {

            const TeamID = event.target.dataset.teamId;

            await UpdateTeamScore(TeamID, "up");

        });

        Elements.Teams.on("click", ".button.delete", async (event) => {

            const TeamID = event.target.dataset.teamId;

            await UpdateTeamScore(TeamID, "down");

        });

        $(".button.add-team").on("click", async () => {

            ShowTeamAddDialog();

            $("#AddTeamConfirm").on("click", async () => {

                const TeamName = Elements.TeamAddInput.val();

                if (TeamName.length < 2) {

                    ShowError("Team name must be at least 2 characters long.", true);

                    return;

                }

                await CreateTeam(TeamName);
                HideTeamAddDialog();

            });

            $("#AddTeamCancel").on("click", () => HideTeamAddDialog());

        });

        $(".button.rm-team").on("click", async () => {

            ShowPopupNotification("Click on a team to remove it.");

            let clicked = false;
            let Removed = false;

            Elements.Teams.on("click", ".team", async (event) => {

                // Have them click again

                if (!clicked) {

                    ShowPopupNotification("Click again to confirm.");
                    clicked = true;

                    return;

                }

                const TeamID = event.target.id;

                await DeleteTeam(TeamID);

                Removed = true;

                ShowPopupNotification("Team removed.");

                Elements.Teams.off("click", ".team");

            });

            if (Removed) return;

            setTimeout(() => {

                Elements.Teams.off("click", ".team");
                ShowPopupNotification("Removal cancelled.");

            }, 5000);

        });

    }

});


