import { Animator, AvatarShape, EasingFunction, Entity, GltfContainer, TextShape, Transform, Tween, engine } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import resources, { targets } from "../helpers/resources";
import { getRandomIntInclusive } from "../helpers/functions";
import { utils } from "../helpers/libraries";
import { PigTrainComponent } from "./environment";
import * as npc from 'dcl-npc-toolkit'

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
let tutorialNPC:Entity


export let tutorialDialog:npc.Dialog[] = [
    {text: "Hey there! Wanna learn Where Pigs Fly??", audio: "sounds/tutorials/hey_there.mp3"},
    {text: "Awesome! Let's show you around!", audio: "sounds/tutorials/awesome_show_around.mp3"},
    {text: "Start by going up the elevator", audio: "sounds/tutorials/start_elevator.mp3"},
    {text: "Then, pick a color!", audio: "sounds/tutorials/pick_color.mp3"},
    {text: "Wait for others to join or play solo!", audio: "sounds/tutorials/wait_join.mp3"},
    {text: "Hold the mouse button to fly the pigs!", audio: "sounds/tutorials/hold_mouse_button.mp3"},
    {text: "Aim at the targets for points!", audio: "sounds/tutorials/aim_targets_points.mp3"},
    {text: "Targets have different point multipliers!", audio: "sounds/tutorials/targets_multipliers.mp3"},
    {text: "Points move your pig across the rainbow!", audio: "sounds/tutorials/points_across_rainbow.mp3"},
    {text: "First pig to the other side of the rainbow wins!", audio: "sounds/tutorials/first_pig_wins.mp3"},
    {text: "Now you're ready to play! Good luck!", audio: "sounds/tutorials/ready_to_play.mp3", isEndOfDialog:true},
]

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
    utils.triggers.enableDebugDraw(true)

    let entry = engine.addEntity()
    Transform.create(entry, {position: Vector3.create(13, 2, 15), rotation: Quaternion.fromEulerDegrees(0,0,0)})
    utils.triggers.addTrigger(
        entry, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 0, z: 0}, scale:{x:20, y:10,z:20}}],

        ()=>{
            startNPC()
        },
        ()=>{
            stopNPC()
        }, Color4.Teal()
    )

    tutorialNPC = npc.create(
		{
			position: Vector3.create(13, 2, 15),
			rotation: Quaternion.Zero(),
			scale: Vector3.create(1, 1, 1),
		},
		//NPC Data Object
		{
			type: npc.NPCType.CUSTOM,
			model: '',
            onlyExternalTrigger:true,
            faceUser:true,
            reactDistance:10,
			onActivate: () => {
				console.log('npc activated')
                npc.talk(tutorialNPC, tutorialDialog)
			},
		}
	)

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

    let fakePlayer = engine.addEntity()
    Transform.create(fakePlayer, {position: Vector3.create(13,1,20), rotation:Quaternion.fromEulerDegrees(0,180,0)})
    AvatarShape.create(fakePlayer)

    enableTutorial()
}

function startNPC(){
    npc.activate(tutorialNPC, -500 as Entity)

}
function stopNPC(){
    // npc.closeDialogWindow(tutorialNPC)
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