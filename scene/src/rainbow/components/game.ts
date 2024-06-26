import { Animator, AudioSource, AvatarAnchorPointType, AvatarAttach, EasingFunction, Entity, GltfContainer, InputAction, Material, MeshCollider, MeshRenderer, TextShape, Transform, Tween, TweenLoop, TweenSequence, VisibilityComponent, engine, pointerEventsSystem } from "@dcl/sdk/ecs";
import { resetAllGamingUI } from "../ui/createGamingUI";
import { displayGamingBorderUI } from "../ui/gamingborderUI";
import { activationPods, mainRainbow, onGround } from "./environment";
import { gameRoom, sendServerMessage } from "./server";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import { SERVER_MESSAGE_TYPES } from "../helpers/types";
import { racingObjects, resetRacingObjects } from "./objects";
import { displayLeaderboardUI } from "../ui/leaderboardUI";
import * as CANNON from 'cannon/build/cannon'
import { localPlayer } from "./player";
import { ballBodies, removeBall, world } from "../cannon";
import { addInputSystem, removeInputSystem } from "../systems/ClickSystem";
import resources, { cannonBackpacks, sounds, targets } from "../helpers/resources";
import { displayStartingSoonUI } from "../ui/startingSoonUI";
import { setForwardVector } from "../systems/Physics";
import { playGameResetAnimation, turnOffRainbow, turnOnRainbowBand } from "./animations";
import { playSound } from "@dcl-sdk/utils";
import { add3DText, clear3DText, getRandomIntInclusive, playAnimation } from "../helpers/functions";
import { playGameSound } from "./sounds";
import { EncouragementTimeSystem } from "../systems/EncouragementTimer";
import { displayFrozenUI } from "../ui/frozenUI";
import { displayScoreUI } from "../ui/scoreUI";

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

export let pointerLocked:boolean = false

export function lockPod(pod:any){
    let nameEntity = activationPods[pod.index].nameEntity

    add3DText(activationPods[pod.index].textArray, nameEntity, pod.name, 0, 0, true)
    VisibilityComponent.createOrReplace(nameEntity, {visible:true})

    Animator.stopAllAnimations( activationPods[pod.index].podModel, true)
    VisibilityComponent.createOrReplace(activationPods[pod.index].podModel, {visible:false})

    turnOnRainbowBand(mainRainbow, pod.index)

    if(!onGround){
        playSound("sounds/8bit_select.mp3", false)
    }

    if(pod.id === localPlayer.userId){
        playSound("sounds/locked_in_f.mp3", false)
    }

    Animator.playSingleAnimation(racingObjects[pod.index].object, "Fly", true)
    Animator.playSingleAnimation(racingObjects[pod.index].object2, "Fly", true)

    let parent = engine.addEntity()
    AvatarAttach.create(parent, {
        avatarId: '' + pod.id,
        anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
    })

    let backpack = engine.addEntity()
    Transform.create(backpack, {parent:parent, position: Vector3.create(0,.8,0)})
    GltfContainer.create(backpack, {src: resources.models.directory + cannonBackpacks[pod.index]})
    activationPods[pod.index].backpack = parent

}



export function initGame(){
    resetAllGamingUI()
    displayGamingBorderUI(true)
}

export function prepGame(){
    setForwardVector()
    hideStartPods()
    displayStartingSoonUI(false, '')

    turnOffRainbow(mainRainbow)

    let random = getRandomIntInclusive(0, sounds.starting.length - 1)
    if(!onGround){
        playSound(sounds.starting[random], false)
    }
}

export function animateTarget(id:string){
    let target = gameTargets.find(t => t.id === id)
    if(target){
        playAnimation(target.target, "play",)
    }
}

export function addPodTarget(info:any){
    let target = engine.addEntity()
    let pTarget:any
    let userId:any

    Transform.createOrReplace(target, {position: Vector3.create(info.x, info.y, info.z), rotation:Quaternion.fromEulerDegrees(0, info.ry, 0)})
    GltfContainer.createOrReplace(target, {src: resources.models.directory + resources.models.balloonDirectory + targets[info.multiplier]})
    Animator.create(target,{states:[
        {clip:'play', playing: false, loop:false}
    ]})
    
    pTarget = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
        position: new CANNON.Vec3(info.x, info.y, info.z),
        collisionFilterGroup:2,
        collisionFilterMask:0
        })
        world.addBody(pTarget)
        userId = localPlayer.userId

        let pos = Vector3.create(info.x, info.y, info.z)

    Tween.create(target, {
        mode: Tween.Mode.Move({
            start: Vector3.create(pos.x, pos.y + .5, pos.z),
            end: Vector3.create(pos.x, pos.y - .5, pos.z),
        }),
        duration: 500,
        easingFunction: EasingFunction.EF_LINEAR,
    })
    TweenSequence.create(target, { sequence: [], loop: TweenLoop.TL_YOYO })//

    if(gameRoom.state.started && info.multiplier > 1 && !onGround){
        AudioSource.create(target, {audioClipUrl:sounds.powerup[getRandomIntInclusive(0, sounds.powerup.length - 1)], playing:true, loop:false})
    }

    gameTargets.push({id:info.id, target:target, pTarget:pTarget, userId: userId})
}

export function hideStartPods(resetName?:boolean){
    activationPods.forEach((info, index:number)=>{
        resetName ? TextShape.getMutable(info.nameEntity).text = "" : null

        Animator.stopAllAnimations(activationPods[index].podModel, true)
        VisibilityComponent.createOrReplace(activationPods[index].podModel, {visible:false})
    })
}

export function resetPods(){
    activationPods.forEach((info, index:number)=>{
        clear3DText(info.textArray)
        Animator.playSingleAnimation(activationPods[index].podModel, "play", true)
        VisibilityComponent.createOrReplace(activationPods[index].podModel, {visible:true})
    })
}

export function removeTarget(id:string){
    let index = gameTargets.findIndex(target => target.id === id)
    if(index >= 0){
        removeTargetObjects(gameTargets[index])
        gameTargets.splice(index, 1)
    }
}

export function removeTargetObjects(gameTarget:any){
    engine.removeEntity(gameTarget.target)
    if(gameTarget.pTarget){
        world.remove(gameTarget.pTarget)
    }
}

export function startGame(){
    displayLeaderboardUI(true)
    displayStartingSoonUI(false, "")
    playGameSound("gameStart")

    let player = gameRoom.state.players.get(localPlayer.userId)
    if(player && player.playing){
        addInputSystem()
        engine.addSystem(EncouragementTimeSystem)
    }

    turnOffRainbow(mainRainbow)

    gameRoom.state.pods.forEach((pod:any, i:number)=>{
        if(pod.locked){
            turnOnRainbowBand(mainRainbow, i)

            Animator.playSingleAnimation(racingObjects[pod.index].object, "Fly", true)
            Animator.playSingleAnimation(racingObjects[pod.index].object2, "Fly", true)
        }
        Animator.stopAllAnimations(activationPods[pod.index].podModel, true)
    })
}

export function endGame(){
    displayFrozenUI(false)
    removeInputSystem()
    engine.removeSystem(EncouragementTimeSystem)
    removePhysicsObjects()

    activationPods.forEach((pod:any)=>{
        engine.removeEntity(pod.backpack)
    })
}

function removePhysicsObjects(){
    ballBodies.forEach((object:any, entity:Entity)=>{
        removeBall(entity)
    })
}

export function resetGame(testing?:boolean){
    resetRacingObjects()
    if(testing){}
    else{
        playGameResetAnimation(mainRainbow)
        displayLeaderboardUI(false)
        displayScoreUI(false)
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

export function sendScore(entity:Entity, target:any){
    removeBall(entity)
    sendServerMessage(SERVER_MESSAGE_TYPES.HIT_TARGET, {id:target, user:localPlayer.userId})
}