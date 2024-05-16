import { Animator, Entity, engine } from "@dcl/sdk/ecs"
import { testobject } from "../tests"
import { GroundRainbowComponent, mainRainbow } from "./environment"
import { utils } from "../helpers/libraries"


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
    allOff ? turnOffAllRainbows() : null
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

export function stopAllRainbows(){
    for (const [entity] of engine.getEntitiesWith(GroundRainbowComponent)) {
        Animator.stopAllAnimations(entity)
    }
}


export function turnOffAllRainbows(){
    for (const [entity] of engine.getEntitiesWith(GroundRainbowComponent)) {
        turnOffRainbow(entity)
    }
}

let status:string = "off"
let time = 300 / 1000
let rainbow:Entity
let index:number = 0
let count = 0

export function playWinner(i:number, test:boolean){    
    rainbow = test ? testobject : mainRainbow
    index = i
    playResetLightshow(0)
}

export function PlayWinnerSystem(dt:number){
    if(count < 10){
        if(time > 0){
            time -= dt
        }else{
            if(status === "off"){
                status = "on"
                turnOnRainbowBand(rainbow, index)
                time = 300 / 1000
            }else{
                status =  "off"
                turnOffRainbowBand(rainbow, index)
                time = 150 / 1000
            }
            count++
        }
    }else{
        engine.removeSystem(PlayWinnerSystem)
        playResetLightshow(0)
    }
}

export function playResetLightshow(direction:number){
    turnOffRainbow(rainbow)

    crecendo = direction
    ctime = 100 / 1000

    if(direction < 2){
        switch(crecendo){
            case 0:
                position = 0
                engine.addSystem(RainbowCrecendoSystem)
                break;
    
            case 1:
                position = 8
                engine.addSystem(RainbowCrecendoSystem)
                break;
        }
    }else{
        console.log('done rainbow system')
    }

}


let crecendo:number = 0
let position:number = 0
let ctime:number = 100 / 1000

export function RainbowCrecendoSystem(dt:number){
    console.log(crecendo, position, ctime)
    if(crecendo < 2){
        if(ctime > 0){
            ctime -= dt
        }else{
            console.log('inside system')
            ctime = 100 / 1000
            switch(crecendo){
                case 0:
                    if(position < 8){
                        turnOnRainbowBand(rainbow, position)
                        position++
                    }else{
                        engine.removeSystem(RainbowCrecendoSystem)
                        playResetLightshow(1)
                    }
                    break;
        
                case 1:
                    if(position >= 0){
                        turnOnRainbowBand(rainbow, 8 - position)
                        position--
                    }else{
                        engine.removeSystem(RainbowCrecendoSystem)
                        playResetLightshow(2)
                    }
                    break;
        
                default:
                    console.log('done')
                    break;
            }
        }
    }
    else{
        engine.removeSystem(RainbowCrecendoSystem)
    }
}