const Card_Choices = {
    shading: ["filled", "empty" , "stripped"],
    color:   ["purple", "green", "red"],
    shape:   ["elipse", "diamond", "wavy"],
    number:  ["1", "2", "3"]
}


export default class Deck{
    cards = [];
    count = 0;
    constructor(mode){
        this.Mode = mode;
        this.createDeck();
        this.shuffleDeck();
        console.log("Deck cards after shuffling: ", this.cards);
    }

    createDeck = () => {
        if(this.Mode == "starter"){
            for(let i = 0 ; i < 3; i++){//3*3*3 = 27
                for(let j = 0; j < 3 ; j++){
                    for(let x = 0 ; x < 3 ; x++){
                        this.cards.push( {
                                id : this.count,
                                shape: Card_Choices.shape[i],
                                color: Card_Choices.color[j],
                                shading: "filled",
                                number: Card_Choices.number[x]
                            });
                        this.count++;
                    }
                }
            }
        }
        else if(this.Mode == "advance"){ //3*3*3*3 = 81
            for(let i = 0 ; i < 3; i++){
                for(let j = 0; j < 3 ; j++){
                    for(let x = 0 ; x < 3 ; x++){
                       for(let y = 0; y < 3; y++){
                        this.cards.push({
                                id: this.count,
                                shape: Card_Choices.shape[i],
                                color: Card_Choices.color[j],
                                number: Card_Choices.number[x],
                                shading: Card_Choices.shading[y]
                            });
                        this.count++;
                       }
                       
                    }
                }
            }
        }
    }

    shuffleDeck = () => {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let tmp = this.cards[i];
            this.cards[i] = this.cards[randomIndex];
            this.cards[randomIndex] = tmp;
          }
    }


    drawCard = () => {return this.cards.pop();}
    getSize = () => { return this.cards.length;}
    getCards = () => {return this.cards;}
}