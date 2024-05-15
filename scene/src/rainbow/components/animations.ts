import { Animator, Entity, engine } from "@dcl/sdk/ecs"
import { testobject } from "../tests"
import { GroundRainbowComponent } from "./environment"


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

export function turnOnRainbow(entity:Entity, index:number, allOff?:boolean){
    allOff ? turnOffAllRainbows() : null
    let clip = Animator.getClip(entity, rainbows[index].on)
    clip.playing = true
    
    let clip2 = Animator.getClip(entity, rainbows[index].off)
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

export function turnOffAllRainbows(){
    for (const [entity] of engine.getEntitiesWith(GroundRainbowComponent)) {
        turnOffRainbow(entity)
    }
}

export function playWinner(index:number){
    

}