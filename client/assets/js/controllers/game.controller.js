
export class Game
{
    async add_game_log(game_data)
    {
        const result = await (await fetch("/api/game/add-game-log", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(game_data)
        })).json()
        
        if(result.mode){
            console.log("Game log added successfully!")
        } else {
            console.error("Error adding game log: ", result.message)
        }
    }
}