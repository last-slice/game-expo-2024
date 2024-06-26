import { InputAction, PointerEventType, PointerLock, Transform, engine, inputSystem } from "@dcl/sdk/ecs"
import { createBall, velocity } from "../cannon"
import { sendServerMessage } from "../components/server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { forwardVector } from "./Physics"
import { localPlayer } from "../components/player"

export let added = false
export let factor = 10
export let time = 0
export let started = false

export let pointerLocked:boolean = false

export function addInputSystem(){
    if(!added){
        console.log('added input system')//
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

    pointerLocked = PointerLock.get(engine.CameraEntity).isPointerLocked

    if(!pointerLocked){
        clicked = false
    }else{
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
            const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
            // console.log('result is', result)//
            clicked = true
            started = true
        }
    
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_UP)) {
            const result = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
            // console.log('result is', result)
            clicked = false
        }
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

        let pos = Transform.get(engine.PlayerEntity).position
        sendServerMessage(SERVER_MESSAGE_TYPES.CREATE_BALL, {pos:pos, direction:forwardVector, vector:Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation), rot: Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation).y})

        // createBall({id:1, userId:localPlayer.userId, pos:pos, direction:forwardVector, vector:Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation), rot: Quaternion.toEulerAngles(Transform.get(engine.CameraEntity).rotation).y})
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