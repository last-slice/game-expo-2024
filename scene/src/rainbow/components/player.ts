import { Player } from "../helpers/types"

export let localPlayer: Player
export let players: Map<string, Player> = new Map<string, Player>()

export async function addLocalPlayer(data:any){
    localPlayer = data
}