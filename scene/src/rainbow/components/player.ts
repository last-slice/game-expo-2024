import { Player } from "../helpers/types"



// export let localUserId: string
export let localPlayer: Player
export let players: Map<string, Player> = new Map<string, Player>()

export async function addLocalPlayer(data:any){
    localPlayer = data
}

export async function addPlayer(userId: string, local: boolean, data?: any[]){

    let playerData:any = {
        dclData:null,
        name:"",
        userId:""
    }

    // players.set(localUserId, playerData)
}