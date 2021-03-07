import Deck from "./deck.js"

export const Selection_Result = {
    Set:1 , N_Set:2, NULL:3
}

export class Board{
    game_states = {};       ///Main game settings
    deck = undefined;       ///Deck object

    cardsOnBoard = [];
    cardsSelected = [];     ///selected cards from Board

    constructor(game_status){
        this.cardsOnBoard = [];
        this.cardsSelected = [];
        this.game_states = game_status; 
        this.deck = this.initDeck(game_status.Difficulty);
        this.initBoard();
    }

    initDeck = (mode) => {
        return (new Deck(mode));
    };

    initBoard = () => {
        for(let i = 0 ; i < 4 ; i++){
            for(let j = 0; j < 3 ; j++){
                this.cardsOnBoard.push(this.deck.drawCard());
            }
        }
    };

    /**
     * 
     *
     */
    drawThree = (forceDraw = false) => {
        if(this.cardsOnBoard.length < 12 || forceDraw){
            for(let i = 0 ; i < 3; i++){
                if(this.deck.getSize() > 0){
                    let card = this.deck.drawCard();
                    this.cardsOnBoard.push(card);
                }   
            }
        }
    }

    getSelectedCards = () => {return this.cardsSelected;}
    getBoardCards = () => {return this.cardsOnBoard;}

    clearSelectedCards = () => { this.cardsSelected = [];}


    /**
     * @method - it adds the selected card to the selected cards or removes it if it is already there. Furthermore, it returns true if a 3 cards selection happened.
     * @param {integer} cardID - the id of the card
     */
    selectCard = (cardID) => {
    //if it is already selected, remove it from the selected cards
        let i = 0;
        while( i < this.cardsSelected.length && cardID != this.cardsSelected[i].id){
            i++;
        }
        let alreadySelected = i < this.cardsSelected.length;
        if(alreadySelected){
            this.cardsSelected.splice(i,1);
            return Selection_Result.NULL;
        }

    //if it is not selected yet,
        //searching for the card in the board
        let mappedCards = this.cardsOnBoard.map((card) => {return card.id;});
        let pos = 0;
        while (pos < mappedCards.length && cardID != mappedCards[pos]){
            pos++;
        }
        let exists = cardID == mappedCards[pos];  //It should be always true but in case of the perfection.
        if(exists) {
            this.cardsSelected.push(this.cardsOnBoard[pos]);
        }
        ///checking if we found a set after selecting 3 different cards. we remove the cards from the board and draw 3 new cards.
        if(this.cardsSelected.length == 3){
            if(this.isSet()){
                this.cardsOnBoard = this.cardsOnBoard.filter(card => {
                    return (card.id != this.cardsSelected[0].id && 
                            card.id != this.cardsSelected[1].id &&
                            card.id != this.cardsSelected[2].id);
                });
                this.drawThree();
                this.clearSelectedCards();
                return Selection_Result.Set;
            }else{
                this.clearSelectedCards();
                return Selection_Result.N_Set;
            }
        }
        return Selection_Result.NULL;
        
    }

    isSet = () => {
        let colorRule = false;
        if (this.cardsSelected[0].color == this.cardsSelected[1].color 
            && this.cardsSelected[0].color==this.cardsSelected[2].color 
            && this.cardsSelected[1].color==this.cardsSelected[2].color) {
            colorRule = true;
        }else if (this.cardsSelected[0].color!=this.cardsSelected[1].color 
                  && this.cardsSelected[0].color!=this.cardsSelected[2].color 
                  && this.cardsSelected[1].color!=this.cardsSelected[2].color) {
            colorRule = true;
        }

        let shapeRule = false;
        if(this.cardsSelected[0].shape==this.cardsSelected[1].shape 
            && this.cardsSelected[0].shape==this.cardsSelected[2].shape 
            && this.cardsSelected[1].shape==this.cardsSelected[2].shape) {
            shapeRule =  true;
        }else if(this.cardsSelected[0].shape!=this.cardsSelected[1].shape 
            && this.cardsSelected[0].shape!=this.cardsSelected[2].shape 
            && this.cardsSelected[1].shape!=this.cardsSelected[2].shape) {
            shapeRule = true;
        }

        let shadingRule = false;
        if(this.cardsSelected[0].shading==this.cardsSelected[1].shading 
            && this.cardsSelected[0].shading==this.cardsSelected[2].shading 
            && this.cardsSelected[1].shading==this.cardsSelected[2].shading) {
                shadingRule =  true;
          } else if(this.cardsSelected[0].shading!=this.cardsSelected[1].shading 
            && this.cardsSelected[0].shading!=this.cardsSelected[2].shading 
            && this.cardsSelected[1].shading!=this.cardsSelected[2].shading) {
                shadingRule =  true;
          }

          let numberRule = false;
          if(this.cardsSelected[0].number==this.cardsSelected[1].number 
            && this.cardsSelected[0].number==this.cardsSelected[2].number 
            && this.cardsSelected[1].number==this.cardsSelected[2].number) {
                numberRule = true;
          } else if(this.cardsSelected[0].number!=this.cardsSelected[1].number
             && this.cardsSelected[0].number!=this.cardsSelected[2].number 
             && this.cardsSelected[1].number!=this.cardsSelected[2].number) {
                numberRule = true;
          }
        return (colorRule && numberRule && shadingRule && shapeRule);
    }

    setExists = () => {
        for(let i = 0 ; i < this.cardsOnBoard.length - 2 ; i++){
            for(let j = i+1 ; j < this.cardsOnBoard.length - 1 ; j++){
                for(let x = j+1 ; x < this.cardsOnBoard.length ; x++){
                    this.clearSelectedCards();
                    this.cardsSelected = [this.cardsOnBoard[i], this.cardsOnBoard[j], this.cardsOnBoard[x]];
                    if(this.isSet()){
                        this.cardsSelected = [];
                        return true;
                    }

                }
            }
        }
        this.cardsSelected = [];
        return false;
    }

    showSet = () => {
        for(let i = 0 ; i < this.cardsOnBoard.length - 2 ; i++){
            for(let j = i+1 ; j < this.cardsOnBoard.length - 1 ; j++){
                for(let x = j+1 ; x < this.cardsOnBoard.length ; x++){
                    this.clearSelectedCards();
                    this.cardsSelected = [this.cardsOnBoard[i], this.cardsOnBoard[j], this.cardsOnBoard[x]];
                    if(this.isSet()){
                        return true;
                    }
                }
            }
        }
        this.cardsSelected = [];
        return false;
    }


    getDeck = () => {return this.deck;}
    
}