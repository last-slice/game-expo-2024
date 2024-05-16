import { engine, MeshRenderer, MeshCollider, Transform, pointerEventsSystem, InputAction, Material, GltfContainer, Animator, ColliderLayer, AudioSource, Entity } from "@dcl/sdk/ecs"

import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { playGameResetAnimation, playWinner, rainbows, turnOnRainbowBand } from "../components/animations"
import { playRainbowLightShow } from "../systems/Lightshow"
import { activeLightShows, allOff, lightShows } from "../components/lightshow"
import { getRandomIntInclusive, getRandomString } from "../helpers/functions"

export let testobject:Entity

export function createTests(){
    testobject = engine.addEntity()

    AudioSource.createOrReplace(testobject, {audioClipUrl: "sounds/countdown.mp3", loop:true})

    Transform.create(testobject, {position: Vector3.create(32, 15, 32), scale:Vector3.create(.5,.5,.5), rotation:Quaternion.fromEulerDegrees(0,0,0)})
    GltfContainer.create(testobject, {src:"models/rainbowAnimations/fullRainbowAnimation.glb", visibleMeshesCollisionMask:ColliderLayer.CL_POINTER})


    let anims:any[] = []
    rainbows.forEach((rainbow:any)=>{
        anims.push({clip:rainbow.on, playing:false,  loop:true, weight:0.0555})
        anims.push({clip:rainbow.off, playing:true,  loop:true, weight:0.0555})
    })

    Animator.create(testobject, {
        states:[
            {clip:"RedOff", playing:true,  loop:true, weight:0.0555},
            {clip:"PinkOff",  playing:true,  loop:true, weight:0.0555},
            {clip:"VioletOff", playing:true,  loop:true,weight:0.0555 },
            {clip:"BlueOff",   playing:true,  loop:true, weight:0.0555},
            {clip:"IndigoOff", playing:true,  loop:true, weight:0.0555},
            {clip:"YellowOff",   playing:true,  loop:true, weight:0.0555},
            {clip:"OrangeOff",  playing:true,  loop:true, weight:0.0555},
            {clip:"GreenOff",   playing:true,  loop:true, weight:0.0555},

            {clip:"RedOn", playing:false,  loop:true,weight:0.0555 },
            {clip:"PinkOn",  playing:false,  loop:true, weight:0.0555},
            {clip:"VioletOn", playing:false,  loop:true,weight:0.0555 },
            {clip:"BlueOn",   playing:false,  loop:true,weight:0.0555 },
            {clip:"IndigoOn", playing:false,  loop:true,weight:0.0555 },
            {clip:"YellowOn",   playing:false,  loop:true,weight:0.0555 },
            {clip:"OrangeOn",  playing:false,  loop:true, weight:0.0555},
            {clip:"GreenOn",   playing:false,  loop:true, weight:0.0555},

            // {clip:"AllOn",  playing:false,  loop:true, weight:0.0555},
            // {clip:"AllOff",   playing:false,  loop:true, weight:0.0555},
        ]
        // states:anims//
    })

    pointerEventsSystem.onPointerDown({entity:testobject,
        opts:{hoverText:"Run Test", button:InputAction.IA_POINTER, maxDistance:20}
    },()=>{

        // startcountdown()
        // playWinner(6, true)
        playGameResetAnimation(testobject)
        // playRainbowLightShow(testobject, "reset")
        // playRainbowLightShow(testobject, "reset")
    })
}