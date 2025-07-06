
export class Player
{
    constructor(name, symbol, game)
    {
        this.name = name;
        this.symbol = symbol;
        this.game = game;
        this.isBot = false;
        this.mySelf = true
    }
}