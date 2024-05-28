import { GameRoom } from "../rooms/GameRoom";
import { getTitleData } from "../utils/Playfab";

export let gameRooms:GameRoom[] = []
export let defaultStats:any[] = []
export let targetRarities:any[] = []
export let scoreFactor:number = 0.5
export let startTargetAmount:number = 8

export async function getServerConfig(){
    try{
        defaultStats.length = 0
        let res = await getTitleData({Keys: ["Init"]})
        let init = JSON.parse(res.Data.Init)
        if(init){
            defaultStats = init.stats
            targetRarities = init.targetRarities
            scoreFactor = init.scoreFactor
            startTargetAmount = init.startTargetAmount
        }
    }
    catch(e){
        console.log('error getting server config')
    }
}

export function endGame(roomId:string){
    let room = gameRooms.find(room => room.roomId === roomId)
    if(room){
        console.log('admin force ending game')
        room.state.gameManager.endGame()
    }
}

export function addGameRoom(room:GameRoom){
    gameRooms.push(room)
}

export function removeGameRoom(roomId:string){
    let roomIndex = gameRooms.findIndex(room => room.roomId === roomId)
    if(roomIndex >= 0){
        gameRooms.splice(roomIndex, 1)
    }
}