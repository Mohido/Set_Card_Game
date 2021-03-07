import {Board, Selection_Result} from "./board.js";

export const Input_Mode = {      ///state machine to decide from where to get the input.
    PLAYER : 1, CARDS:2
}

export class Game {
    gameStatus = {};
    board = undefined;                   ///Board of the game
    inputFrom = Input_Mode.PLAYER;       ///for taking input when dealing with multi_players
    gameCount = 0;

    bestSolo3 = [];
    bestSolo4 = [];
    bestMulti = [];

    solo;
    players = [];                        ///players on board
    pendingPlayers = [];
    finishedPlayers = [];
    selectedPlayer;
    timeCounter;
    gameOver;

    constructor(gameStatus){
        this.gameOver = false;
        this.timeCounter = 0;
        this.gameStatus = gameStatus;
        this.players = gameStatus.players.map(pName => {    return {name: pName, score: 0, total: 0};   });
        this.pendingPlayers = gameStatus.players.map(pName => {   return {name: pName, score: 0, total: 0};   });
        this.solo = this.players.length == 1;

        this.bestSolo3 = [...JSON.parse(localStorage.getItem("bestSolo3")) || []];
        if( this.bestSolo3 == null || this.bestSolo3 == undefined) this.bestSolo3 = [];

        this.bestSolo4 = [...JSON.parse(localStorage.getItem("bestSolo4")) || []];
        if(this.bestSolo4 == null || this.bestSolo4 == undefined) this.bestSolo4 = [];

        this.bestMulti = [...JSON.parse(localStorage.getItem("bestMulti")) || []];
        if(this.bestMulti == null || this.bestMulti == undefined) this.bestMulti = [];    

        if(this.solo){
            this.finishedPlayers.push(this.players[0]);
            this.selectedPlayer = this.players[0].name;
        }
        this.board = new Board(gameStatus);

        if(gameStatus.AutoDraw){
            this.checkBoardAndDraw();
        }
        this.gameCount++;
    }

    rematch = () => {
        this.board = new Board(this.gameStatus);
        this.gameOver = false;
        this.timeCounter = 0;
        this.players = this.players.map(p => { return {name: p.name, score: 0, total: p.total};  });
        this.pendingPlayers = this.players.map(p => { return {name: p.name, score: 0, total: p.total}; });
        this.solo = this.players.length == 1;

        if(this.solo){
            this.finishedPlayers.push(this.players[0]);
            this.selectedPlayer = this.players[0].name;
        }

        if(this.gameStatus.AutoDraw){
            this.checkBoardAndDraw();
        }

    }

    selectPlayer = (playerName) => {
        if(this.inputFrom == Input_Mode.PLAYER){
            let mappedPending = this.pendingPlayers.map(pending => {
                return pending.name;
            });
            let pos = 0;
            while (pos < mappedPending.length && playerName != mappedPending[pos]){
                pos++;
            }let exists = pos < mappedPending.length;

            if(exists){
                this.pendingPlayers.splice(pos, 1);
                this.finishedPlayers.push(this.players.filter(player => {return player.name == playerName})[0]);
                this.selectedPlayer = this.players.filter(player => {return player.name == playerName})[0].name;
                this.timeCounter = 10;
            }
            this.inputFrom = Input_Mode.CARDS;
        }
    }

    selectCard = (cardID) => {
        if(this.inputFrom == Input_Mode.CARDS){
            let SelectM = this.board.selectCard(cardID); ///return the state of the selection. 

            let point = 0;
            if(SelectM == Selection_Result.Set){
                point++;
            }else if(SelectM == Selection_Result.N_Set){
                point--;
            }

            if(this.finishedPlayers.length > 0 && (SelectM == Selection_Result.N_Set || SelectM == Selection_Result.Set) ){
                if(this.selectedPlayer != null && this.selectedPlayer != undefined)
                    this.addPointToPlayer(this.selectedPlayer, point );
                if(!this.solo) {
                    this.inputFrom = Input_Mode.PLAYER;
                    this.timeCounter = 0;
                    this.selectedPlayer = null;
                }
                if(point > 0){
                    this.nextTurn();
                }
                return true; ///    true to re-update the leader-board screen.
            }

            return false;
        }
    }

    addPointToPlayer = (playerName , points) => {
        for(let i = 0 ; i < this.players.length; i++){
            if(playerName == this.players[i].name){
                this.players[i].score = (this.players[i].score + points);
                this.players[i].total = (this.players[i].total + points) ;
            }
        }
        ///! Important Note: If a set not found in the current board it draws 3 cards automatically but if a set is found in the turn after this, 
        ///! then the added cards will be descarded.
        if(points > 0){
            //after adding the point to the player
        }else if(points < 0 && this.finishedPlayers.length == this.players.length){ ///all players failed to get a set 
            if(!this.solo) this.board.drawThree(true);
            this.nextTurn();
        }
        this.checkBoardAndDraw(); 
    }

    nextTurn = () => {
        if(this.solo){
            
        }else{
            this.inputFrom = Input_Mode.PLAYER;
            this.board.clearSelectedCards();
            this.pendingPlayers = [...this.players];
            this.finishedPlayers = [];
            this.timeCounter = 0;
        }
    }

    checkBoardAndDraw = () => {
        if(!this.board.setExists() && this.board.getDeck().getCards().length > 0){
            this.board.drawThree(true); ///true -> force adding cards (even if the cards on the board are above 12)
            return this.checkBoardAndDraw();
        }else if(!this.board.setExists() && this.board.getDeck().getCards().length == 0){ ///Game Over.
            this.gameOver = true;
            if(this.gameStatus.Difficulty == "advance" && this.gameStatus.PlayersNumber == 1){
                this.bestSolo4.push(this.players[0]);
            }else if(this.gameStatus.Difficulty == "starter" && this.gameStatus.PlayersNumber == 1){
                this.bestSolo3.push(this.players[0]);
            }else if(this.gameStatus.PlayersNumber != 1){ 
                this.bestMulti.push(this.players);
            }
            localStorage.setItem('bestSolo3', JSON.stringify(this.bestSolo3));
            localStorage.setItem('bestSolo4', JSON.stringify(this.bestSolo4));
            localStorage.setItem('bestMulti', JSON.stringify(this.bestMulti));
            return false;
        }
        return true;
    }


    getPendingPlayer = () => {return this.pendingPlayers;}
    getBoard = () => {return this.board;}
    getPlayers = () => { return this.players;}
    getFinishedPlayers = () => {return this.finishedPlayers;}
    getTime = () => {
        if(this.solo){
            this.timeCounter++;
        }else if(!this.solo && this.timeCounter > 0){
            this.timeCounter--;
        }
        if(!this.solo && this.timeCounter <= 0){
            this.inputFrom = Input_Mode.PLAYER;
            if(this.finishedPlayers.length == 0) return -1;
            if(this.selectedPlayer != undefined && this.selectedPlayer != null){
                this.addPointToPlayer(this.selectedPlayer , -1);
                this.board.clearSelectedCards();
                this.selectedPlayer = null;
                return 0;
            } else {
                return -1;
            }
        }
        return this.timeCounter;
    }

    isSolo  = () => {return this.solo;}
    isGameOver = () => { return this.gameOver;}

    setInputFrom = (input) => {this.inputFrom = input;}


}