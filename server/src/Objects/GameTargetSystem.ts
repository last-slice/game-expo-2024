import { Schema, MapSchema,ArraySchema, type } from "@colyseus/schema";
import { GameRoom } from "../rooms/GameRoom";
import { GameTarget } from "../rooms/schema/GameRoomState";

let startAmount:number = 4

export class TargetSystem extends Schema {
    
    room:GameRoom
    targets:GameTarget[] = []

    self:any

    constructor(room:GameRoom){
        super()
        this.self = this
        this.room = room
    }

    init(){
        for(let i = 0; i < startAmount; i++){
            this.addTarget(1, false)
        }
    }

    moveInitTargets(){
        this.room.state.targets.forEach((target)=>{
            target.move = true
            target.startCountdown(target.movementCountdownBase)
        })
    }

    stop(){
        this.room.state.targets.forEach((target)=>{
            target.clearTimers()
        })
        this.room.state.targets.clear()
    }

    createTarget(){
        let multiplier = 1
        this.addTarget(multiplier, true)
    }

    addTarget(multiplier:number, move:boolean){
        this.room.state.targets.push(new GameTarget(this.self, multiplier, move))
    }

    deleteTarget(id:string){
        let index = this.room.state.targets.findIndex(target => target.id === id)    
        if(index >= 0){
            this.room.state.targets.splice(index, 1)
            this.createTarget()
        }
    }

    targetExists(id:string){
        return this.targets.filter(target => target.id === id).length > 0 ? true : false
    }
}