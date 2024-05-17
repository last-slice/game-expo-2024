import { Animator, AvatarAnchorPointType, AvatarAttach, Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs"
import { testobject } from "../tests"
import { GroundRainbowComponent, mainRainbow } from "./environment"
import { utils } from "../helpers/libraries"
import { activeLightShows, allOff, lightShows, presets, winningAnimation } from "./lightshow"
import { getRandomString } from "../helpers/functions"
import { playRainbowLightShow } from "../systems/Lightshow"
import resources from "../helpers/resources"
import { enableBuilderHUD } from "../../dcl-builder-hud/ui/builderpanel"
import { Vector3 } from "@dcl/sdk/math"


export let rainbows:any[] = [
    {on:"RedOn", off:"RedOff", state:"off"},
    {on:"OrangeOn", off:"OrangeOff", state:"off"},
    {on:"YellowOn", off:"YellowOff", state:"off"},
    {on:"GreenOn", off:"GreenOff", state:"off"},
    {on:"BlueOn", off:"BlueOff", state:"off"},
    {on:"IndigoOn", off:"IndigoOff", state:"off"},
    {on:"VioletOn", off:"VioletOff", state:"off"},
    {on:"PinkOn", off:"PinkOff", state:"off"},
    // {on:"AllOn", off:"AllOff", state:"off"},
]

export function turnOnRainbowBand(entity:Entity, index:number, allOff?:boolean){
    allOff ? turnOffAllGroundRainbows() : null
    let clip = Animator.getClip(entity, rainbows[index].on)
    clip.playing = true
    
    let clip2 = Animator.getClip(entity, rainbows[index].off)
    clip2.playing = false
}

export function turnOffRainbowBand(entity:Entity, index:number){
    let clip = Animator.getClip(entity, rainbows[index].off)
    clip.playing = true
    
    let clip2 = Animator.getClip(entity,rainbows[index].on)
    clip2.playing = false
}

export function turnOffRainbow(entity:Entity){
    rainbows.forEach((rainbow:any, index:number)=>{
        let clip = Animator.getClip(entity, rainbow.off)
        clip.playing = true
        
        let clip2 = Animator.getClip(entity,rainbow.on)
        clip2.playing = false
    })
}

export function turnOnRainbow(entity:Entity){
    rainbows.forEach((rainbow:any, index:number)=>{
        let clip = Animator.getClip(entity, rainbow.on)
        clip.playing = true
        
        let clip2 = Animator.getClip(entity,rainbow.off)
        clip2.playing = false
    })
}

export function stopAllGroundRainbows(){
    for (const [entity] of engine.getEntitiesWith(GroundRainbowComponent)) {
        Animator.stopAllAnimations(entity)
    }
}


export function turnOffAllGroundRainbows(){
    for (const [entity] of engine.getEntitiesWith(GroundRainbowComponent)) {
        turnOffRainbow(entity)
    }
}

export function removeGroundLightShows(){
    for (const [entity] of engine.getEntitiesWith(GroundRainbowComponent)) {
        activeLightShows.delete(entity)
    }
}

let rainbow:Entity
export function playWinner(i:number, test:boolean){    
    console.log('playing winner', i, test)
    rainbow = test ? testobject : mainRainbow

    // activeLightShows.delete(rainbow)

    let winnerShow:any ={
        index:0,
        newRandom:false,
        presets:[]
    }

    let winnerPreset:any ={
        index:0, 
        timer: 100 / 1000,
        animations:[]
    }

    winnerShow.presets.push(winnerPreset)

    winningAnimation.animations.forEach((animation:any, ai:number)=>{
        let anim = {...animation}
        if(ai !== 0){
            anim.index = i
        }
        winnerPreset.animations.push({...anim})
    })

    playRainbowLightShow(rainbow, getRandomString(7), {index:0, presets:[winnerPreset], newRandom:false})
}

export function playGameResetAnimation(entity:Entity){
    let show:any = {}

    let lightshow:any = {...lightShows.find(show => show.name === "reset")}

    if(lightshow.hasOwnProperty("index")){
        console.log('found lightshow template')
        show.index = lightshow.index
        show.presets = []
        lightshow.presets.forEach((p:any)=>{
            let preset:any = {}

            let anims:any[] = []
            p.animations.forEach((animation:any)=>{
                let anim:any ={...animation}
                anim.sound = "ui"
                anims.push(anim)
            })
            preset = {...p}
            preset.animations = anims
            show.presets.push({...preset})
        })
    }
    console.log('show is', show)

    playRainbowLightShow(entity, "", {...show})

}

export function attachWinnerAnimation(winner:string){
    let ent = engine.addEntity()
    Transform.create(ent, {scale:Vector3.create(.05,.05,.05), position: Vector3.create(0,-6,0)})
    GltfContainer.create(ent, {src: resources.models.directory + resources.models.winningAnimation})

    AvatarAttach.create(ent, {
        avatarId: '' + winner,
        anchorPointId: AvatarAnchorPointType.AAPT_POSITION,
    })

    utils.timers.setTimeout(()=>{
        engine.removeEntity(ent)
    }, 1000 * 10)
}