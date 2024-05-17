import { Animator, AvatarShape, EasingFunction, Entity, GltfContainer, TextShape, Transform, Tween, engine } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import resources, { targets } from "../helpers/resources";
import { getRandomIntInclusive } from "../helpers/functions";
import { utils } from "../helpers/libraries";
import { PigTrainComponent } from "./environment";


const targetPositions = [
    Vector3.create(13, 3, 13),
    Vector3.create(13, 3, 13),
    Vector3.create(13, 3, 13),
    Vector3.create(13, 3, 13),
    Vector3.create(13, 3, 13),
];

let targetX = 7
let targetY = 3
let offset = -5

// let tutorialTargets:Map<Entity, any> = new Map()
let tutorialTargets:any[] = []
let pigModel = getRandomIntInclusive(0, resources.models.pigs.length - 1)
let targetTrigger:any

export function disableTutorial(){
    tutorialTargets.forEach((target)=>{
        Animator.stopAllAnimations(target, true)
    })

    engine.removeSystem(TutorialTrainSystem)
}
export function enableTutorial(){
    tutorialTargets.forEach((target)=>{
        Animator.playSingleAnimation(target, "play", true)
    })
    engine.addSystem(TutorialTrainSystem)
    // createTutorialPig()
}

export function createTutorial(){
    targetPositions.forEach((position, i:number)=>{
        let ent = engine.addEntity()
        Transform.create(ent, {position: Vector3.create(targetX, targetY, position.z + offset), scale: Vector3.create(0.3,0.3,0.3), rotation: Quaternion.fromEulerDegrees(0,-90,0)})
        GltfContainer.createOrReplace(ent, {src: resources.models.directory + resources.models.balloonDirectory + targets[i+1]})
        Animator.create(ent,{states:[
            {clip:'play', playing: false, loop:true}
        ]})
        offset += 3
        tutorialTargets.push(ent)
        // tutorialTargets.set(entity)

        TextShape.create(ent, {text:"" + (i+1) + "X", fontSize:15})
    })


    let ent = engine.addEntity()
    Transform.create(ent, {position: Vector3.create(13, 3, 5), scale: Vector3.create(.7,.7,.7), rotation: Quaternion.fromEulerDegrees(0,0,0)})
    GltfContainer.createOrReplace(ent, {src: resources.models.directory + resources.models.balloonDirectory + targets[1]})
    Animator.create(ent,{states:[
        {clip:'play', playing: false, loop:true}
    ]})
    tutorialTargets.push(ent)
    // tutorialTargets.set(entity)

    let npc = engine.addEntity()
    Transform.create(npc, {position: Vector3.create(13,1,20), rotation:Quaternion.fromEulerDegrees(0,180,0)})
    AvatarShape.create(npc)

    enableTutorial()
}

function createTutorialPig(){
    let ent = engine.addEntity()
    GltfContainer.createOrReplace(ent, {src: resources.models.directory + resources.models.pigDirectory + resources.models.pigs[pigModel]})
    Transform.create(ent, {position: Vector3.create(13, 1.5, 20), scale:Vector3.create(0.3, 0.3, 0.3), rotation: Quaternion.fromEulerDegrees(0,180,0)})
    Tween.create(ent, {
        mode: Tween.Mode.Move({
          start: Vector3.create(13, 1.5, 20),
          end: Vector3.create(13, 3, 5),
        }),
        duration: 200,
        easingFunction: EasingFunction.EF_LINEAR,
      })

      PigTrainComponent.create(ent)
}

let time = 0
function TutorialTrainSystem(dt:number){
    if(time > 0){
        time -= dt
    }else{
        createTutorialPig()
        time = .1
    }
}