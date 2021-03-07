import {Game,Input_Mode} from "./game.js"

/**
 * @module - Creating Main variables,
 *           and pre-setting the game, and adding  event listeners
 * @author - Mohammed Al-Mahdawi
 */
 ///default game status, this will be edited later after the game starts.
 var Game_States = {
    Difficulty:"advance",
    Mode: "practice",
    PlayersNumber: 1,
    Players: [],
    CheckSetButton : true,
    ShowSetButton: true,
    AutoDraw: false
};

///Menu variables area
const MenuPage = document.getElementById("menu_page");
const Difficulty = [...document.getElementsByName("difficulty")];              // contains 2 radio buttons starter and advance. Using [...] to transform the nodeList type to an array type, so we can use map and filter.
const Mode = [...document.getElementsByName("mode")];                          // array of the radio buttons of the Mode.
const PlayersCount = document.getElementById("players_count");                 // input element with value 1 by default.
const PlayersNamePanel = document.getElementById("players_names");             // empty div that will hold player names.
const startButton = document.getElementById("start_game");                     // start button at the end of the panel

///Menu Variable event listenr
Mode.map(btn => {
    btn.addEventListener("click", (ev) => { updateCostumDisplay(ev); });                /// updating the costum settings visibility
});
PlayersCount.addEventListener("change",(ev) => {renderPlayersNamePanel();} );           /// updating the names Panel
startButton.addEventListener("click", (ev) => {startGame(ev);} );


/// Costum Menu variables area.
const costumSettings = document.getElementById("costum");
const checkSetOption = [...document.getElementsByName("check_set")];
const showSetOption = [...document.getElementsByName("show_set")];
const drawCardOptoin = [...document.getElementsByName("draw_card")];
const best_solo_3 = document.getElementById("best_solo_3");
const best_solo_4 = document.getElementById("best_solo_4");
const best_multi = document.getElementById("best_multi");


/// displaying in the players Names Panel which the players inputs their name
renderPlayersNamePanel();  
updateScoresBoard();
///___________________________________Function Definitions area.________________________________________

/**
 * @function - Used for rendering the Names Panel in the Main Menu.
 * @author - Mohammed AL-Mahdawi
 */
function renderPlayersNamePanel(){
    PlayersNamePanel.innerHTML = "";
    for(let i = 1 ; i <= PlayersCount.value ; i++){
        PlayersNamePanel.innerHTML += "<label for=\"player" + i + "\"> Player "+ i + ": </label>" + 
        "<input type='text' class='players_input' id=\"player" + i + "\" value=\"player" + i + "\" />"+
        "<br>";
        if(i != PlayersCount.value ) 
            PlayersNamePanel.innerHTML += "<br>";
    }
}

/**
 * @function - Display or Hide the Costum Settings according to the Mode choice.
 * @author - Mohammed AL-Mahdawi
 */
function updateCostumDisplay(ev){
    let practice = ev.target.value == "practice";
    if(practice){
        costumSettings.style.display = "block";
    }else{
        costumSettings.style.display = "none";
    }
}


function updateScoresBoard(){
    best_solo_3.innerHTML = "";
    best_solo_4.innerHTML = "";
    best_multi.innerHTML = "";
    
    let recievedBestSolo3 = [...JSON.parse(localStorage.getItem("bestSolo3")) || []];
    if(recievedBestSolo3 != null){


        recievedBestSolo3.sort((a, b)=> { return a.total > b.total} );

        let text = "<h3>Best Solo 3 Properties:</h2>";
        for(let j = 0 ; j < recievedBestSolo3.length ; j++){
            text += "<ul><div>"+ (j+1) +")</div>";
            text += "<li>Name: " + recievedBestSolo3[j].name + "</li>";
            text += "<li>Score: " + recievedBestSolo3[j].total + "</li>"; 
            text += "</ul>";
        }
        best_solo_3.innerHTML = text;
    }

    
    let recievedBestSolo4 = [...JSON.parse(localStorage.getItem("bestSolo4")) || []];  
    if(recievedBestSolo4 != null){
        recievedBestSolo4.sort((a, b)=> { return a.total > b.total} );
        let text = "<h3>Best Solo 4 Properties:</h2>";
        for(let i = 0 ; i < recievedBestSolo4.length ; i++){
            text += "<ul><div>"+ (i+1) +")</div>";
            text += "<li>Name: " + recievedBestSolo4[i].name + "</li>";
            text += "<li>Score: " + recievedBestSolo4[i].total + "</li>"; 
            text += "</ul>";
        }
        best_solo_4.innerHTML = text;
    }


    let recievedBestMulti = [...JSON.parse(localStorage.getItem("bestMulti")) || []];
    if(recievedBestMulti != null){
        let text = "<h3>Last 10 multi-pLayer games:</h2>";
        for(let i = 0 ; i < 10 && i < recievedBestMulti.length ; i++){
            text += "<ul><div>"+ (i+1) +")</div>";
            for(let j = 0 ; j < recievedBestMulti[recievedBestMulti.length - 1 - i].length ; j++){
                text += "<li>Name: " + recievedBestMulti[recievedBestMulti.length - 1 - i][j].name + "</li>";
                text += "<li>Score: " + recievedBestMulti[recievedBestMulti.length - 1 - i][j].total + "</li>"; 
            }
            text += "</ul>";
        }
        best_multi.innerHTML = text;
    }
}

/**
 * @function - Validating the settings, and updating the games states. after this we will init the game with the states.
 * @author - Mohammed AL-Mahdawi
 */
function ValidateAndUpdate(){
    var tempMode = Mode.filter(btn => {return btn.checked})[0].value;        ///temporary variable => easier to deal with
    var tempPlayers = [];                                                   ///list of the player names only
    for(let i = 1 ; i <= PlayersCount.value; i++){
        tempPlayers.push(document.getElementById("player" + i).value );
    }

    ///Validating the player names Input fields
    for(let i = 0 ; i < tempPlayers.length; i++){              ///Empty characters input
        var found = tempPlayers[i].search("[a-zA-Z0_9]");
        if( found < 0 ){
            alert("Error: Empty Player name input");
            return false;
        }
    }
    for(let i = 0 ; i < tempPlayers.length - 1; i++){         ///Similar names validation
        for(let j = i + 1 ; j < tempPlayers.length; j++){
            if( tempPlayers[i] == tempPlayers[j] ){
                alert("Error: Same Player Names is not allowed.\nNames are:  " +  tempPlayers[i] + " and " +  tempPlayers[j] );
                return false;
            }
        }
    }

    ///updating the game_states
    if(tempMode == "competitive"){
        Game_States = {
            Difficulty: Difficulty.filter( btn => {return btn.checked;})[0].value,
            Mode : tempMode,
            PlayersNumber: PlayersCount.value,
            players : tempPlayers,
            CheckSetButton : false,
            ShowSetButton: false,
            AutoDraw: true
        }
        return true;
    }else{
        var checkset = checkSetOption.filter(btn => {return btn.checked;} )[0].value == "enable";
        var showset = showSetOption.filter(btn => {return btn.checked;} )[0].value == "enable";
        var autod = drawCardOptoin.filter(btn => {return btn.checked;} )[0].value == "enable";
        Game_States = {
            Difficulty: Difficulty.filter( btn => {return btn.checked;})[0].value,
            Mode : tempMode,
            PlayersNumber: PlayersCount.value,
            players : tempPlayers,
            CheckSetButton : checkset,
            ShowSetButton: showset,
            AutoDraw: autod
        }
        return true;
    }
}


/**
 * @function - Check if everything is alright in the input settings and start the game
 * @param {*} ev - Click event object
 * 
 * @author - Mohammed Al-Mahdawi
 */
function startGame(ev){
    ev.preventDefault();
    if(ValidateAndUpdate()){
        initGame(Game_States);
    }
}

//______________________________________________________________ In-Game functionality __________________________________________________

///Elements of the Html Page.
const gamePage = document.getElementById("game_page");
const newOutput = document.getElementById("news");
const cardsArea = document.getElementById("cards_area");
const buttonsArea = document.getElementById("buttons_area");
const PlayersArea = document.getElementById("players_buttons");
const backBtn = document.getElementById("back_btn");
const playersRank = document.getElementById("players_ranks");
var timer = undefined;
var seconds = 0;

///Events Area
buttonsArea.addEventListener("click", ev => {
    ev.preventDefault();
    if(ev.target.id == "setExistBtn" && game != undefined){
        if(game.getBoard().setExists()){
            renderNewsFeed("Yes, There is a set on the board!");
        }else{
            renderNewsFeed("No set found!");
        }
        renderCards(game.getBoard().getBoardCards(), game.getBoard().getSelectedCards());
    }

    if(ev.target.id == "setShowBtn" && game != undefined ){
        game.getBoard().showSet();
        renderCards(game.getBoard().getBoardCards(), game.getBoard().getSelectedCards());
        game.getBoard().clearSelectedCards();
    }
    
    if(ev.target.id == "setDrawBtn" && game != undefined){
        game.getBoard().drawThree(true);   ///false -> permenantly drawn and they will not be discarded if there was a new turn and a set is found.
        renderCards(game.getBoard().getBoardCards(), game.getBoard().getSelectedCards());
    }
});

backBtn.addEventListener("click", ev => {
    ev.preventDefault();
    killGame();
    gamePage.style.display = "none";
    MenuPage.style.display = "block";
    updateScoresBoard();
});

cardsArea.addEventListener("click", ev => {
    ev.preventDefault();
    if(ev.target.tagName.toLowerCase() == "img" && game != undefined){
        cardClicked(ev.target.id, game);
    }
});
PlayersArea.addEventListener("click" ,ev => {
    ev.preventDefault();
    if(ev.target.tagName.toLowerCase() == "input" && game != undefined){
        playerClicked(ev.target.value, game);
    }
});



////The Game Object
var game = undefined;
function initGame(gameStatus){
    seconds = 0;
    MenuPage.style.display = "none";
    gamePage.style.display = "flex";
    game = new Game(gameStatus);
    renderGamePage(game);
    renderTimer(seconds);
    renderPlayerCount(game.getPlayers().length);
    renderGameMode(Game_States.Mode);
    renderGameDifficulty(Game_States.Difficulty);
    renderLeaderboard(game.getPlayers());  
    ///if Solo player then he can press the event whenever he wants. else the event of pressing is defined after clicking on a player.
    if(game.getPlayers().length == 1){
        game.setInputFrom(Input_Mode.CARDS);
    }else{
        game.setInputFrom(Input_Mode.PLAYER);
    }
    timer = setInterval(()=>{
        seconds++;
        let gameTimer = game.getTime();
        if(gameTimer > 0){
            if(game.getPlayers().length > 1) renderNewsFeed("Time Left: " + gameTimer);
            renderTimer(gameTimer);
            renderLeaderboard(game.getPlayers());
        }else if ( gameTimer == 0){
            renderNewsFeed("Click Player to play");
            renderPlayer([]);
            renderPlayer(game.getPendingPlayer());
            renderTimer(gameTimer);
            renderCards(game.getBoard().getBoardCards());
            renderLeaderboard(game.getPlayers());
        }
    }, 1000);
    return true;
}


function requestRematch(){
    let r = confirm("Game is over, Do you want a rematch with the same players' details?");
    if(r){
        game.rematch();
        renderGamePage(game);
    }else{
        killGame();
        renderGameOver();
    }
}


function killGame(){
    game = undefined;
    clearInterval(timer);
}



function cardClicked(cardID, gameObj){
    if(gameObj.selectCard(cardID)){ ///selects a card and returns true if the leaderboard screen needs re-rendering... 
        renderLeaderboard(gameObj.getPlayers());
        renderPlayer(gameObj.getPendingPlayer());
        if(gameObj.getPlayers().length > 1) {
            renderNewsFeed("Please select a player and play!");
            renderTimer(0);
        }
        if(gameObj.isGameOver()){
            renderCards(gameObj.getBoard().getBoardCards(), gameObj.getBoard().getSelectedCards());
            requestRematch();
            return;
        }
    }
    renderCards(gameObj.getBoard().getBoardCards(), gameObj.getBoard().getSelectedCards());
}

function playerClicked(playerID, gameObj){
    gameObj.selectPlayer(playerID);
    renderPlayer(gameObj.getPendingPlayer()); 
    //setTimeout( () => {cardsArea.removeEventListener()});
}

//_____________________________________ Rendering Functions____________________________________________
////Render function for rendering the game
const renderGamePage = (gameObj) => {
    renderButtons(Game_States);
    renderCards(gameObj.getBoard().getBoardCards(), gameObj.getBoard().getSelectedCards());
    renderPlayer(gameObj.getPendingPlayer());
    renderNewsFeed("Game has Started!");
    return true;
}

/**
 * @function - rendering to the news feed 
 * @param {String} message - The message to be displayed
 * @author - Mohammed Al-Mahdawi
 */
function renderNewsFeed(message) {
    newOutput.innerHTML = "<h3>" + message + "</h3>";
}
function renderTimer(seconds){
    document.getElementById("game_states_timer").innerHTML = Math.floor(seconds / 60) + " m, " + (seconds % 60) + " s";
}
function renderPlayerCount(count){
    document.getElementById("game_states_players_count").innerHTML = count + " p";
}
function renderGameMode(mode){
    document.getElementById("game_states_mode").innerHTML = mode;
}
function renderGameDifficulty(dif){
    document.getElementById("game_states_difficulty").innerHTML = dif;
}
function renderLeaderboard(players){
    /* template of what would be inside the "playersRank"
        <div class="leaderBoard_player">
            <h3>1) playerName:</h3>
            <p>Current: 20</p>
            <p>Total: 30</p>
        </div>
     */
    let temp = [...players];
    temp = temp.sort((e1,e2) => {
        return e2.total - e1.total;
    });

    playersRank.innerHTML = "";
    for(let i = 0 ; i < players.length; i++){
        playersRank.innerHTML +=  "<div class=\"leaderBoard_player\">" +
                                        "<h3>1) playerName: "+ temp[i].name +"</h3>" +
                                        "<p>Current: "+ temp[i].score +"</p>" +
                                        "<p>Total: "+ temp[i].total +"</p>" +
                                    "</div>";
    }
}
function renderGameOver(){
    cardsArea.innerHTML = "";
    cardsArea.innerHTML += "<h1 class=\"gameover\"> GAME OVER ! </h1>";
    PlayersArea.innerHTML = "";
    renderNewsFeed("Game Over... Press 'back' to return to the settings");
}


/**
 * @function - render the cards to the board
 * @param {array< cards >} cards - The cards to be rendered
 * @param {array< cards >} selectedCards - The cards to be highlighted
 * @author - Mohammed Al-Mahdawi
 */
function renderCards(cards,selectedCards = []){
    cardsArea.innerHTML = "";
    for(let i = 0 ; i < cards.length ; i++){
        let highlight = false;
        let j = 0;
        while(j < selectedCards.length && selectedCards[j].id !=cards[i].id ){
            j++;
        }
        highlight = j >= selectedCards.length;

        if(highlight){
            cardsArea.innerHTML += "<img id=\"" + cards[i].id + "\" class=\"cards\" src=\"cards/" + cards[i].color +"/"+ cards[i].shape +"/" + cards[i].shading + "/" + cards[i].number + ".png" + "\" />";
        }else{
            cardsArea.innerHTML += "<img id=\"" + cards[i].id + "\" class=\"cards highlighted\" src=\"cards/" + cards[i].color +"/"+ cards[i].shape +"/" + cards[i].shading + "/" + cards[i].number + ".png" + "\" />";
        }
    }
}

/**
 * @function - render the Options buttons
 * @param {Game_States} gameStatus - The game Status in which rules of the game is identified
 * @author - Mohammed Al-Mahdawi
 */
function renderButtons(gameStatus){
    /*Template of the buttons area content 
            <input class="game_btn" type="button" value="Has Set?"/> */
    buttonsArea.innerHTML = "";
    if(gameStatus.CheckSetButton){
        buttonsArea.innerHTML += "<input id=\"setExistBtn\" class=\"game_btn\" type=\"button\" value=\"Exist Set\"/>";
        
    }else{
        buttonsArea.innerHTML += "<input id=\"setExistBtn\" class=\"game_btn\" type=\"button\" value=\"Exist Count\" disabled/>";
    }

    if(gameStatus.ShowSetButton){
        buttonsArea.innerHTML += "<input id=\"setShowBtn\" class=\"game_btn\" type=\"button\" value=\"Show Set\"/>";
        
    }else{
        buttonsArea.innerHTML += "<input id=\"setShowBtn\" class=\"game_btn\" type=\"button\" value=\"Show Set\" disabled/>";
    }

    if(!gameStatus.AutoDraw){
        buttonsArea.innerHTML += "<input id=\"setDrawBtn\" class=\"game_btn\" type=\"button\" value=\"Draw Cards\"/>";
       
    }else{
        buttonsArea.innerHTML += "<input id=\"setDrawBtn\" class=\"game_btn\" type=\"button\" value=\"Draw Cards\" disabled/>";
    }

}


/**
 * @function - render the Players Buttons to the board
 * @param {array <Game.Player> } playerObj - this is the players objects gotten from the game class. We will render only the available players to play.
 * @author - Mohammed Al-Mahdawi
 */
function renderPlayer(playersObj){
/*Template to be filled inside the player area
    <input type="button" class="game_btn" value="player1"/> */
    PlayersArea.innerHTML = "";

    for(let i = 0 ; i < playersObj.length ; i++){
        PlayersArea.innerHTML +=  "<input type=\"button\" class=\"players\" value=\"" + playersObj[i].name + "\"/>";
    }
}
