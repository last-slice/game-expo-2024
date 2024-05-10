import { EasingFunction, Entity, InputAction, MeshCollider, MeshRenderer, TextShape, Transform, Tween, VisibilityComponent, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { resetAllGamingUI } from "../ui/createGamingUI";
import { displayGamingBorderUI } from "../ui/gamingborderUI";
import { activationPods, sceneParent, sceneYPosition } from "./environment";
import { gameRoom, sendServerMessage } from "./server";
import { Vector3 } from "@dcl/sdk/math";
import { SERVER_MESSAGE_TYPES } from "../helpers/types";
import { resetRacingObjects } from "./objects";
import { displayLeaderboardUI } from "../ui/leaderboardUI";
import * as CANNON from 'cannon/build/cannon'
import { localPlayer } from "./player";
import { removeBall, world } from "../cannon";
import { addInputSystem, removeInputSystem } from "../systems/ClickSystem";

export const BallComponent = engine.defineComponent("game::expo::ball::component", {})

export let podPositions:any[] = [
    {x:43.5, y:28, z:40.5},
    {x:36.6, y:28, z:45.9},
    {x:27.1, y:28, z:46.1},
    {x:19.8, y:28, z:41.1},
    {x:20, y:28, z:23},
    {x:27, y:28, z:18},
    {x:36.55, y:28, z:18.3},
    {x:43.7, y:28, z:23},
]

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
    let pTarget:any
    let userId:any

    if(pod.locked && pod.id === localPlayer.userId){
        MeshRenderer.setBox(target)
        MeshCollider.setBox(target)
    
        let pos = Transform.get(activationPods[i].pod).position
        Transform.create(target, {position: Vector3.create(pos.x, sceneYPosition + 2, pos.z + 5)})
    
        // pointerEventsSystem.onPointerDown({entity:target,
        //     opts:{button: InputAction.IA_POINTER, maxDistance: 30, showFeedback:false, hoverText:"click me"}
        // },()=>{
        //     console.log('clicked target')
        //     sendServerMessage(SERVER_MESSAGE_TYPES.HIT_TARGET, i)
        // })

        let targetPosition = Transform.get(target).position

        pTarget = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
            position: new CANNON.Vec3(targetPosition.x, targetPosition.y, targetPosition.z),
            collisionFilterGroup:2,
            collisionFilterMask:0
          })
          world.addBody(pTarget)
          userId = localPlayer.userId
    }

    gameTargets.push({target:target, pTarget:pTarget, userId: userId})
}

export function hideStartPods(resetName?:boolean){
    activationPods.forEach((info)=>{
        resetName ? TextShape.getMutable(info.nameEntity).text = "" : null
        VisibilityComponent.getMutable(info.lockedModel).visible = false
    })
}

export function resetTargets(){
    gameTargets.forEach((gameTarget:any)=>{
        engine.removeEntity(gameTarget.target)
        if(gameTarget.pTarget){
            world.remove(gameTarget.pTarget)
        }
    })
    gameTargets.length = 0
}

export function startGame(){
    displayLeaderboardUI(true)
    gameTargets.forEach((objects:any)=>{
        if(objects.userId === localPlayer.userId){
            addInputSystem()
        }
    })
    //add systems
    //do other things//
}

export function endGame(){
    removeInputSystem()
    resetTargets()
    hideStartPods(true)
}

export function resetGame(testing?:boolean){
    resetRacingObjects()
    if(testing){}
    else{
        displayLeaderboardUI(false)
    }
}

export function setPodPosition(id:number){

}

export function moveTarget(id:number){
    if(gameRoom.state.started){
        let target = gameTargets[id].target
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
}

export function animateLightShow(){

}

export function sendScore(entity:Entity, target?:any){
    removeBall(entity, target)
    sendServerMessage(SERVER_MESSAGE_TYPES.HIT_TARGET, {})
}