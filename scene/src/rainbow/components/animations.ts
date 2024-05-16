import { Animator, Entity, engine } from "@dcl/sdk/ecs"
import { testobject } from "../tests"
import { GroundRainbowComponent, mainRainbow } from "./environment"
import { utils } from "../helpers/libraries"
import { activeLightShows, allOff, lightShows, presets, winningAnimation } from "./lightshow"
import { getRandomString } from "../helpers/functions"
import { playRainbowLightShow } from "../systems/Lightshow"


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

// export function PlayWinnerSystem(dt:number){
//     if(count < 10){
//         if(time > 0){
//             time -= dt
//         }else{
//             if(status === "off"){
//                 status = "on"
//                 turnOnRainbowBand(rainbow, index)
//                 time = 300 / 1000
//             }else{
//                 status =  "off"
//                 turnOffRainbowBand(rainbow, index)
//                 time = 150 / 1000
//             }
//             count++
//         }
//     }else{
//         engine.removeSystem(PlayWinnerSystem)
//         playResetLightshow(1)
//     }
// }

// export function playResetLightshow(direction:number){
//     turnOffRainbow(rainbow)

//     crecendo = direction
//     ctime = 100 / 1000

//     if(direction < 2){
//         switch(crecendo){
//             case 0:
//                 position = 0
//                 engine.addSystem(RainbowCrecendoSystem)
//                 break;
    
//             case 1:
//                 position = 8
//                 engine.addSystem(RainbowCrecendoSystem)
//                 break;
//         }
//     }else{
//         // console.log('done rainbow system')
//     }

// }


// let crecendo:number = 0
// let position:number = 0
// let ctime:number = 100 / 1000

// export function RainbowCrecendoSystem(dt:number){
//     // console.log(crecendo, position, ctime)
//     if(crecendo < 2){
//         if(ctime > 0){
//             ctime -= dt
//         }else{
//             // console.log('inside system')
//             ctime = 100 / 1000
//             switch(crecendo){
//                 case 0:
//                     if(position < 8){
//                         turnOnRainbowBand(rainbow, position)
//                         position++
//                     }else{
//                         engine.removeSystem(RainbowCrecendoSystem)
//                         playResetLightshow(1)
//                     }
//                     break;
        
//                 case 1:
//                     if(position >= 0){
//                         turnOnRainbowBand(rainbow, 8 - position)
//                         position--
//                     }else{
//                         engine.removeSystem(RainbowCrecendoSystem)
//                         playResetLightshow(2)
//                     }
//                     break;
        
//                 default:
//                     console.log('done')
//                     break;
//             }
//         }
//     }
//     else{
//         engine.removeSystem(RainbowCrecendoSystem)
//     }
// }