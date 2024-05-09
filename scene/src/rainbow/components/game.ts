import { EasingFunction, InputAction, MeshCollider, MeshRenderer, TextShape, Transform, Tween, VisibilityComponent, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { resetAllGamingUI } from "../ui/createGamingUI";
import { displayGamingBorderUI } from "../ui/gamingborderUI";
import { activationPods } from "./environment";
import { gameRoom, sendServerMessage } from "./server";
import { Vector3 } from "@dcl/sdk/math";
import { SERVER_MESSAGE_TYPES } from "../helpers/types";
import { resetRacingObjects } from "./objects";
import { displayLeaderboardUI } from "../ui/leaderboardUI";

export const maxPlayers:number = 8

export let gameTargets:any[] = []

export function lockPod(info:any){
    let nameEntity = activationPods[info.pod].nameEntity
    TextShape.getMutable(nameEntity).text = info.name
    VisibilityComponent.createOrReplace(nameEntity, {visible:true})

    let lockedModel = activationPods[info.pod].lockedModel
    VisibilityComponent.createOrReplace(lockedModel, {visible:true})
}


export function initGame(){
    //reset ui
    resetAllGamingUI()
    displayGamingBorderUI(true)

    //display ui//
}

export function prepGame(){
    resetTargets()
    hideStartPods()

    gameRoom.state.pods.forEach((pod:any, i:number) => {
        addPodTarget(pod, i)
    });
}

export function addPodTarget(pod:any, i:number){
    console.log('adding target for pod', i)
    let target = engine.addEntity()
    gameTargets.push(target)

    if(pod.locked){
        MeshRenderer.setPlane(target)
        MeshCollider.setPlane(target)
    
        let pos = Transform.get(activationPods[i].pod).position
        Transform.create(target, {position: Vector3.create(pos.x, 2, pos.z + 5)})
    
    
        pointerEventsSystem.onPointerDown({entity:target,
            opts:{button: InputAction.IA_POINTER, maxDistance: 30, showFeedback:false, hoverText:"click me"}
        },()=>{
            console.log('clicked target')
            sendServerMessage(SERVER_MESSAGE_TYPES.HIT_TARGET, i)
        })
    }

}

export function hideStartPods(resetName?:boolean){
    activationPods.forEach((info)=>{
        resetName ? TextShape.getMutable(info.nameEntity).text = "" : null
        VisibilityComponent.getMutable(info.lockedModel).visible = false
    })
}

export function resetTargets(){
    gameTargets.forEach((target:any)=>{
        engine.removeEntity(target)
    })
    gameTargets.length = 0
}
export function startGame(){
    displayLeaderboardUI(true)
    //add systems
    //do other things//
}

export function endGame(){
    resetTargets()
    hideStartPods(true)
}

export function resetGame(){
    resetRacingObjects()
    displayLeaderboardUI(false)
}

export function movePod(id:number){
    if(gameRoom.state.started){
        let target = gameTargets[id]
        Tween.deleteFrom(target)

        let currentPosition = Transform.get(target).position
        let serverTarget = gameRoom.state.pods[id].target

        Tween.createOrReplace(target, {
            mode: Tween.Mode.Move({
            start: currentPosition,
            end: Vector3.create(serverTarget.x, serverTarget.y, serverTarget.z),
            }),
            duration: 2000,
            easingFunction: EasingFunction.EF_LINEAR,
        })
    }
}//