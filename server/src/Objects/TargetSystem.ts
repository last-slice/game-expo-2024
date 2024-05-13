import { Schema, MapSchema,ArraySchema, type } from "@colyseus/schema";
import { GameRoom } from "../rooms/GameRoom";
import { GameTarget } from "../rooms/schema/GameRoomState";
import { getRandomIntInclusive } from "../utils/functions";

let xMin:number = 20
let xMax:number = 44

let yMin:number = 29
let yMax:number = 50

let zMin: number = 55
let zMax: number = 10

export class TargetSystem extends Schema {
    
    room:GameRoom
    target:GameTarget

    movementCountdownBase:number = 5
    movementCountdownRange:any[] = [3, 8]
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

    async moveTarget(){
        console.log('moving targer')
        await this.chooseNewLocation()
        this.target.targetTick === -500 ? this.target.targetTick = 0 : this.target.targetTick++
        this.startMovementCountdown(getRandomIntInclusive(this.movementCountdownRange[0], this.movementCountdownRange[1]))
    }

    stop(){
        this.clearTimers()
    }

    clearTimers(){
        clearTimeout(this.movementCountdown)
    }

    async chooseNewLocation(){
        this.target.x = getRandomIntInclusive(xMin, xMax)
        this.target.y = getRandomIntInclusive(yMin, yMax)
        this.target.z = getRandomIntInclusive(zMin, zMax)
        console.log('new location is', this.target.x, this.target.y, this.target.z)
    }

}