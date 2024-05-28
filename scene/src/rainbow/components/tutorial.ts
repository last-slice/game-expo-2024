import { Animator, AudioSource, AvatarShape, EasingFunction, Entity, GltfContainer, MeshCollider, MeshRenderer, TextShape, Transform, Tween, TweenLoop, TweenSequence, engine } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";
import resources, { podAnimations, targets } from "../helpers/resources";
import { getRandomIntInclusive } from "../helpers/functions";
import { utils } from "../helpers/libraries";
import { PigTrainComponent, addRainbowAnimations, sceneParent } from "./environment";
import * as npc from 'dcl-npc-toolkit'
import { movePlayerTo } from "~system/RestrictedActions";
import { podPositions } from "./game";
import { enableBuilderHUD } from "../../dcl-builder-hud/ui/builderpanel";
import { addBuilderHUDAsset } from "../../dcl-builder-hud";
import { closeDialog } from "dcl-npc-toolkit/dist/dialog";
import { sendServerMessage } from "./server";
import { SERVER_MESSAGE_TYPES } from "../helpers/types";

const targetPositions = [
    Vector3.create(13, 3, 13),
    Vector3.create(13, 3, 13),
    Vector3.create(13, 3, 13),
    Vector3.create(13, 3, 13),
    Vector3.create(13, 3, 13),
];

let targetX = 4
let targetY = 3
let offset = -5

// let tutorialTargets:Map<Entity, any> = new Map()
let tutorialTargets:any[] = []
let pigModel = getRandomIntInclusive(0, resources.models.pigs.length - 1)
let targetTrigger:any
let tutorialParent:Entity
let tutorialNPC:Entity
let tutorialAudio:Entity
let tutorialIndex:number = 0

export let tutorialDialog:any[] = [
    {text: "Hey there! Wanna learn Where Pigs Fly??", audio: "sounds/tutorials/hey_there.mp3", triggeredByNext:()=>{
        playTutorial()
    }},
    {text: "Awesome! Let's show you around!", audio: "sounds/tutorials/awesome_show_around.mp3", triggeredByNext:()=>{
        playTutorial({newRelativePosition:{x:26.2, y:1, z:14}, cameraTarget:{x:24.36, y:2, z:9.8}})
    }},
    {text: "Start by going up the elevator", audio: "sounds/tutorials/start_elevator.mp3", triggeredByNext:()=>{
        playTutorial({newRelativePosition:{x:18.73, y:1, z:2.73}, cameraTarget:{x:17, y:0, z:4}})
    }},
    {text: "Then, pick a color!", audio: "sounds/tutorials/pick_color.mp3", triggeredByNext:()=>{
        playTutorial()
    }},
    {text: "Wait for others to join or play solo!", audio: "sounds/tutorials/wait_join.mp3", triggeredByNext:()=>{
        playTutorial()
    }},
    {text: "When the game starts, run around, or climb on the clouds to fly your pigs!", audio: "sounds/tutorials/when_game_starts.mp3", triggeredByNext:()=>{
        playTutorial({newRelativePosition:{x:9.6, y:1, z:14.9}, cameraTarget:{x:20.26, y:3, z:18.78}})
    }},
    {text: "Hold the mouse button to fly the pigs!", audio: "sounds/tutorials/hold_mouse_button.mp3", triggeredByNext:()=>{
        playTutorial({newRelativePosition:{x:12.76, y:1, z:19}, cameraTarget:{x:20.59, y:2, z:18.5}})
    }},
    {text: "Aim at the targets for points!", audio: "sounds/tutorials/aim_target_points.mp3", triggeredByNext:()=>{
        playTutorial({newRelativePosition:{x:11, y:1, z:6}, cameraTarget:{x:4, y:2, z:10}})
    }},
    {text: "Targets have different point multipliers!", audio: "sounds/tutorials/targets_multipliers.mp3", triggeredByNext:()=>{
        playTutorial({newRelativePosition:{x:9.73, y:1, z:16.86}, cameraTarget:{x:13.6, y:4, z:24}})
    }},
    {text: "Points move your pig across the rainbow!", audio: "sounds/tutorials/points_across_rainbow.mp3", triggeredByNext:()=>{
        playTutorial()
    }},
    {text: "First pig to the other side of the rainbow wins!", audio: "sounds/tutorials/first_pig_wins.mp3", triggeredByNext:()=>{
        playTutorial({newRelativePosition:{x:25.16, y:1, z:24.43}, cameraTarget:{x:15.7, y:2, z:16}})
    }},
    {text: "Now you're ready to play! Good luck!", audio: "sounds/tutorials/ready_to_play.mp3", triggeredByNext:()=>{
        sendServerMessage(SERVER_MESSAGE_TYPES.TUTORIAL_FINISHED, {})
    }, isEndOfDialog:true},
]

function playTutorial(move?:any){
    if(move){
        movePlayerTo(move)
    }
    playTutorialAudio()
    tutorialIndex++
}

function playTutorialAudio(){
    let audio = AudioSource.getMutable(tutorialAudio)
    audio.playing = false

    audio.audioClipUrl = tutorialDialog[tutorialIndex].audio!
    audio.playing = true
}

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
    createTutorialPig()
}

export function createTutorial(){
    // utils.triggers.enableDebugDraw(true)

    tutorialParent = engine.addEntity()
    Transform.create(tutorialParent, {position: Vector3.create(14,0,14)})

    tutorialAudio = engine.addEntity()
    Transform.create(tutorialAudio, {parent:engine.PlayerEntity})
    AudioSource.create(tutorialAudio)

    let entry = engine.addEntity()
    Transform.create(entry, {position: Vector3.create(14, 2, 14), rotation: Quaternion.fromEulerDegrees(0,0,0)})
    utils.triggers.addTrigger(
        entry, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 0, z: 0}, scale:{x:28, y:10,z:28}}],

        ()=>{
            startNPC()
        },
        ()=>{
            stopNPC()
        }, Color4.Teal()
    )

    tutorialNPC = npc.create(
        {
            position: Vector3.create(22, 1, 22.),
            rotation: Quaternion.Zero(),
            scale: Vector3.create(.5,.5,.5),
        },
		//NPC Data Object
		{
			type: npc.NPCType.CUSTOM,
			model: '' + resources.models.directory + resources.models.pigDirectory + resources.models.pigs[getRandomIntInclusive(0, resources.models.pigs.length -1)],
            faceUser:true,
            onlyExternalTrigger:true,
            reactDistance:2,
			onActivate: () => {
				console.log('npc activated')
                npc.talk(tutorialNPC, tutorialDialog)
                playTutorialAudio()
                tutorialIndex++
			},
            // onWalkAway:()=>{
            //     tutorialIndex = 0
            // }
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
    Transform.create(ent, {position: Vector3.create(20.7, 3, 18), scale: Vector3.create(.7,.7,.7), rotation: Quaternion.fromEulerDegrees(0,90,0)})
    GltfContainer.createOrReplace(ent, {src: resources.models.directory + resources.models.balloonDirectory + targets[1]})
    Animator.create(ent,{states:[
        {clip:'play', playing: false, loop:true}
    ]})
    tutorialTargets.push(ent)

    let fakePlayer = engine.addEntity()
    Transform.create(fakePlayer, {position: Vector3.create(11.33, 1, 16), rotation:Quaternion.fromEulerDegrees(0,80,0)})
    AvatarShape.create(fakePlayer)


    let elevator = engine.addEntity()
    MeshCollider.setCylinder(elevator)
    MeshRenderer.setCylinder(elevator)
    Transform.create(elevator, {position: Vector3.create(24,0,9), scale: Vector3.create(2,.1,2), rotation: Quaternion.fromEulerDegrees(0,0,0)})
    Tween.create(elevator, {
        mode: Tween.Mode.Move({
          start: Vector3.create(24, 0, 9),
          end: Vector3.create(24, 8, 9),
        }),
        duration: 3000,
        easingFunction: EasingFunction.EF_LINEAR,
      })
      
      TweenSequence.create(elevator, { sequence: [], loop: TweenLoop.TL_YOYO })


    let parent = engine.addEntity()
    Transform.create(parent, {position: Vector3.create(11, -10.7, 8), scale: Vector3.create(.4,.4,.4)})
    // enableBuilderHUD(true)
    // addBuilderHUDAsset(parent, "parent")
    
    let speed = 0.5
    for(let i = 0; i < podPositions.length; i++){
        let podModel = engine.addEntity()
        Transform.create(podModel, {parent: parent})
        GltfContainer.create(podModel, {src: resources.models.directory + "activationPods/" + podAnimations[i]})
        Animator.create(podModel, {states: [
            {
                clip: 'play',
                playing: false, 
                loop:true,
                speed: speed
                
            }
        ]})
        speed -= 0.05
    }

    let tutorialRainbow = engine.addEntity();
    GltfContainer.create(tutorialRainbow, {
        src: resources.models.directory + resources.models.rainbow, 
    })
    Transform.create(tutorialRainbow,{ position: Vector3.create(13, 6, 23), scale: Vector3.create(0.25, 0.25, 0.25)})
    addRainbowAnimations(tutorialRainbow)

    // GroundRainbowComponent.create(rainbowEntity, {time: getRandomIntInclusive(100, 300) / 1000})


    enableTutorial()
}

function startNPC(){
    npc.activate(tutorialNPC, -500 as Entity)

}
function stopNPC(){
    console.log('left trigger box')
    // npc.closeDialogWindow(tutorialNPC)
    tutorialIndex = 0
    closeDialog(tutorialNPC)
}

function createTutorialPig(){
    let ent = engine.addEntity()
    GltfContainer.createOrReplace(ent, {src: resources.models.directory + resources.models.pigDirectory + resources.models.pigs[pigModel]})
    Transform.create(ent, {position: Vector3.create(11.3, 1.5, 16), scale:Vector3.create(0.3, 0.3, 0.3), rotation: Quaternion.fromEulerDegrees(0,90,0)})
    Tween.create(ent, {
        mode: Tween.Mode.Move({
          start: Vector3.create(11.3, 1.5, 16),
          end: Vector3.create(20.7, 3, 17),
        }),
        duration: 200,
        easingFunction: EasingFunction.EF_LINEAR,
      })

      PigTrainComponent.create(ent)
      utils.timers.setTimeout(()=>{
        engine.removeEntity(ent)
      }, 200)
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