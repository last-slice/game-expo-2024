import { Schema, MapSchema,ArraySchema, type } from "@colyseus/schema";
import { GameRoom } from "../rooms/GameRoom";
import { GameTarget } from "../rooms/schema/GameRoomState";

export class TargetSystem extends Schema {
    
    room:GameRoom
    target:GameTarget

    movementCountdownBase:number = 5
    movementCountdown:any


    start(target:GameTarget){
        this.target = target
        this.startMovementCountdown(this.movementCountdownBase)
    }

    startMovementCountdown(time:number){
        this.movementCountdown = setTimeout(()=>{
            this.clearTimers()
            this.moveTarget()
        }, 1000 * time)
    }

    moveTarget(){
        console.log('moving targer')
        this.target.targetTick++
        this.target.y = 5
    }

    stop(){
        this.clearTimers()
    }

    clearTimers(){
        clearTimeout(this.movementCountdown)
    }

}