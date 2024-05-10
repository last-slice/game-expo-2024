import { InputAction, PointerEventType, engine, inputSystem } from "@dcl/sdk/ecs"
import { createBall, velocity } from "../cannon"

export let added = false
export let factor = 10
export let time = 0
export let started = false

export function addInputSystem(){
    if(!added){
        console.log('added input system')
        added = true
        clicked = false
        engine.addSystem(InputListenSystem)
        engine.addSystem(AddBallSystem)
    }
}

export function removeInputSystem(){
    engine.removeSystem(InputListenSystem)
    engine.removeSystem(AddBallSystem)
    added = false
}

export function InputListenSystem(){
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        // console.log('result is', result)//
        clicked = true
        started = true
        createBall()
    }

    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_UP)) {
        const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
        // console.log('result is', result)
        clicked = false
    }
}

let clicked = false
export function AddBallSystem(dt:number){
    if(clicked){
        if(velocity < 50){
            if(time < .02){
                time += dt
            }else{
                time = 0
                // updateMass(factor)
            }
        }else{
            // updateMass(50, true)
        }
        createBall()
    }else{
        // if(mass >= 600000){
        //     if(time < .1){
        //         time += dt
        //     }else{
        //         time = 0
        //         updateMass(factor * -1)
        //     }
        // }   
    }
}