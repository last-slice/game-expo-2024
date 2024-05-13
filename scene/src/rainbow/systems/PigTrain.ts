import { engine, tweenSystem } from "@dcl/sdk/ecs"
import { PigTrainComponent, createPigTrain } from "../components/environment"


let added = false
let time = 1

export function addPigTrainSystem(){
    if(!added){
        added = true
        time = 1
        engine.addSystem(PigTrainSystem)
        engine.addSystem(PigRemovalSystem)
    }
}

export function removePigTrainSystem(){
    engine.removeSystem(PigTrainSystem)
    engine.removeSystem(PigRemovalSystem)
    added = false
}

export function PigTrainSystem(dt:number){
    if(time > 0){
        time -= dt
    }else{
        createPigTrain()
        time = 1
    }
}

export function PigRemovalSystem(){
    for (const [entity] of engine.getEntitiesWith(PigTrainComponent)) {
        const tweenCompleted = tweenSystem.tweenCompleted(entity)
        if (tweenCompleted) {
            engine.removeEntity(entity)
        }
    }
}