const Routes = {

    GetScore: { Url: "http://localhost:1337/api/score", Method: "GET", Args: 0 },
    IncrementScore: { Url: "http://localhost:1337/api/score", Method: "PATCH", Args: 1 },
    ChangeScore: { Url: "http://localhost:1337/api/score", Method: "POST", Args: 1 },

}

async function MakeRequestToBackend(Route, Argument = null){

    const response = await fetch(`${Route.Url}${Argument ? `/${Argument}` : ""}`, {

        method: Route.Method,
        headers: { "Content-Type": "application/json" },

    }).catch((error) => {

        console.error(error);

        console.log(`REQUEST ERR: ${error}`);

    });

    return await response?.json().catch((error) => {

        console.log(`REQ PARSE ERR: ${error}`);

    });

}

// Update with current teams

const Elements = {

    Score: $("#teams"),
    Increment: $(".button.increment"),

}

function ValidateResponse(Response){

    if (Response?.Error) {

        Elements.Score.text(Response.Error);
        return;

    }

    else if (Response.Score === undefined) {

        Elements.Score.text("Error: Score is Unavailable");
        return;

    }

    Elements.Score.text(Response.Score);

}

async function GetScore(){

    const response = await MakeRequestToBackend(Routes.GetScore);

    ValidateResponse(response);

}

async function IncrementScore(Direction = "Forward"){

    const response = await MakeRequestToBackend(Routes.IncrementScore, Direction);

    ValidateResponse(response);

}

// Not used, yet

// async function ChangeScore(NewScore = 0){
//
//     const response = await MakeRequestToBackend(Routes.ChangeScore, NewScore);
//
//     if (response?.error) {
//
//         Elements.Score.text(response.Error);
//         return;
//
//     }

//     else if (!response?.Score) {

//         Elements.Score.text("Error: Score is Unavailable");

//         return;

//     }
//
//     Elements.Score.text(response.Score);
//
// }

// Update Score

GetScore().then(() => {});

// Event listeners
Elements.Increment.each((index, element) => {

    $(element).click(async (event) => {

        const target = $(event.target);

        await IncrementScore(target.attr("data-direction"));

    });

});






