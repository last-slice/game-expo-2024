import { generateId } from "colyseus";
import { Player } from "../../Objects/Player";
import { SCENE_MODES, SERVER_MESSAGE_TYPES } from "../../utils/types";
import { GameRoom } from "../GameRoom";
import { pushPlayfabEvent } from "../../Objects/PlayfabEvents";

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

        room.onMessage(SERVER_MESSAGE_TYPES.HIT_TARGET, (client, info)=>{
            // console.log(SERVER_MESSAGE_TYPES.HIT_TARGET + " message", client.userData.userId, info)
            this.room.state.gameManager.attemptScore(client, info)
        })

        room.onMessage(SERVER_MESSAGE_TYPES.CREATE_BALL, async(client, info)=>{
            // console.log(SERVER_MESSAGE_TYPES.CREATE_BALL + " message", info)
            let player:Player = this.room.state.players.get(client.userData.userId)
            if(player && player.playing && this.room.state.started){
                info.id = player.pod
                info.userId = player.userId
                this.room.state.gameManager.createBall(player, info)
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.TUTORIAL_FINISHED, async(client, info)=>{
            // console.log(SERVER_MESSAGE_TYPES.TUTORIAL_FINISHED + " message", info)
            let player:Player = this.room.state.players.get(client.userData.userId)
            if(player){
                pushPlayfabEvent(SERVER_MESSAGE_TYPES.TUTORIAL_FINISHED, player, {})
            }
        })

        room.onMessage(SERVER_MESSAGE_TYPES.LEADERBOARDS_UPDATES, async(client, info)=>{
            // console.log(SERVER_MESSAGE_TYPES.LEADERBOARDS_UPDATES + " message", info)
            client.send(SERVER_MESSAGE_TYPES.LEADERBOARDS_UPDATES, room.state.gameManager.leaderboards)
        })
    }
}