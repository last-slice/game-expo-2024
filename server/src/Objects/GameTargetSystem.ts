import { Schema, MapSchema,ArraySchema, type } from "@colyseus/schema";
import { GameRoom } from "../rooms/GameRoom";
import { GameTarget } from "../rooms/schema/GameRoomState";

let startAmount:number = 8

let tierRarity:any[] = [
    {multiplier: 0, rarity:0},
    {multiplier: 1, rarity:0.85},
    {multiplier: 2, rarity:0.04},
    {multiplier: 3, rarity:0.03},
    {multiplier: 4, rarity:0.02},
    {multiplier: 5, rarity:0.01},
    {multiplier: 6, rarity:0.05}
    // {multiplier: 6, rarity:1}
]

export class TargetSystem extends Schema {
    
    room:GameRoom

    self:any

    constructor(room:GameRoom){
        super()
        this.self = this
        this.room = room
    }

    init(){
        for(let i = 0; i < startAmount; i++){
            this.addTarget(this.selectRarity(), false)
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
        let multiplier = this.selectRarity()
        this.addTarget(multiplier, true)
    }

    selectRarity(){
        const cumulativeDistribution: number[] = [];
        let cumulativeSum = 0;

        for (const target of tierRarity) {
            cumulativeSum += target.rarity;
            cumulativeDistribution.push(cumulativeSum);
        }

        // Generate a random number between 0 and 1
        const randomValue = Math.random();

        // Find the target corresponding to the random value
        for (let i = 0; i < cumulativeDistribution.length; i++) {
            if (randomValue < cumulativeDistribution[i]) {
            return tierRarity[i].multiplier;
            }
        }

        // Fallback in case of rounding errors
        return tierRarity[tierRarity.length - 1].multiplier;
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
}