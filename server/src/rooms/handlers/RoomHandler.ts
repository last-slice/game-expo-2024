import { generateId } from "colyseus";
import { Player } from "../../Objects/Player";
import { SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../utils/types";
import { GameRoom } from "../GameRoom";

export class RoomHandler {
    room:GameRoom

    constructor(room:GameRoom) {
        this.room = room

        room.onMessage(SERVER_MESSAGE_TYPES.ENTERED_POD, async(client, info)=>{
            console.log(SERVER_MESSAGE_TYPES.ENTERED_POD + " message", info)
            let player:Player = room.state.players.get(client.userData.userId)
            if(player){
                player.enteredPod = true    
                if(!player.podCountingDown && !player.podLocked){
                    player.startPodLockCountdown(info.pod)
                }   
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.EXIT_POD, async(client, info)=>{
            console.log(SERVER_MESSAGE_TYPES.EXIT_POD + " message", info)
            let player:Player = room.state.players.get(client.userData.userId)
            if(player){
                console.log('found player')
                player.enteredPod = false  
                if(player.podCountingDown && !player.podLocked){
                    player.clearPod()
                }
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.HIT_TARGET, async(client, info)=>{
            // console.log(SERVER_MESSAGE_TYPES.HIT_TARGET + " message", info)
            let player:Player = this.room.state.players.get(client.userData.userId)
            let pod = this.room.state.pods.filter(pod => pod.id === player.dclData.userId)[0]

            this.room.state.gameManager.attemptScore(player, pod)
        })
    }
}