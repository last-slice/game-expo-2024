import { EasingFunction, Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, TextShape, Transform, Tween, VisibilityComponent, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
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
import resources, { colors } from "../helpers/resources";

export const BallComponent = engine.defineComponent("game::expo::ball::component", {})

export let podPositions:any[] = [
    {x:45.1, y:28, z:40.1},
    {x:37.9, y:28, z:45.1},
    {x:25.9, y:28, z:45.1},
    {x:18.8, y:28, z:40.2},
    {x:18.8, y:28, z:23.9},
    {x:25.9, y:28, z:18.9},
    {x:37.9, y:28, z:18.9},
    {x:45.1, y:28, z:23.9},
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
    let target = engine.addEntity()
    let pTarget:any
    let userId:any

    if(pod.locked && pod.id === localPlayer.userId){
        // console.log('adding target for pod', i)
        // MeshRenderer.setBox(target)
        // MeshCollider.setBox(target)
    
        let pos = Transform.get(activationPods[i].pod).position
        Transform.create(target, {position: Vector3.create(pos.x, sceneYPosition + 2, pos.z + 5)})
        // Material.setPbrMaterial(target, {albedoColor: colors[i], emissiveColor: colors[i], emissiveIntensity:2})
        GltfContainer.create(target, {src: resources.models.directory + resources.models.balloonDirectory + resources.models.balloons[i]})

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

export function setPodPosition(pod:any, id:number){
    let target = gameTargets[id]
    if(target.pTarget){
        target.pTarget.position.x = pod.target.x
        target.pTarget.position.y = pod.target.y
        target.pTarget.position.z = pod.target.z

        let targetPosition = Transform.getMutable(target.target).position
        targetPosition.x = pod.target.x
        targetPosition.y = pod.target.y
        targetPosition.z = pod.target.z
    }
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