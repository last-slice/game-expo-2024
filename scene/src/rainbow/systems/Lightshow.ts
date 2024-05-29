import { Entity, Schemas, engine } from "@dcl/sdk/ecs"
import { turnOffRainbow, turnOffRainbowBand, turnOnRainbow, turnOnRainbowBand } from "../components/animations"
import { activeLightShows, allOff, lightShows, presets } from "../components/lightshow"
import { utils } from "../helpers/libraries"
import { getRandomIntInclusive, getRandomString } from "../helpers/functions"
import { playGameSound } from "../components/sounds"
import { onGround } from "../components/environment"

export const LightshowComponent = engine.defineComponent("game::expo::rainbow::lightshow::component", {
    show:Schemas.String,
    active:Schemas.Boolean,
    index:Schemas.Int
})

export function createRandomLightShows(entity:Entity){
    activeLightShows.delete(entity)
    let numPresets = getRandomIntInclusive(1, presets.length)
    let sets:any[] = []

    for(let i = 0; i < numPresets; i++){
        let random = getRandomIntInclusive(0, presets.length - 1)
        sets.push({...allOff})
        sets.push({...presets[random]})
    }

    playRainbowLightShow(entity, getRandomString(7), {index:0, presets:[...sets], newRandom:true})
}

export function playRainbowLightShow(entity:Entity, name:string, data?:any){
    // if(activeLightShows.has(entity)){
    //     activeLightShows.delete(entity)
    //     console.log('entity already has light show running')
    // }

    activeLightShows.delete(entity)

    let show:any = {}

    let lightshow:any = {...lightShows.find(show => show.name === name)}

    // console.log('data is', lightshow)

    if(lightshow.hasOwnProperty("index")){
        // console.log('found lightshow template')
        show.index = lightshow.index
        show.presets = []
        lightshow.presets.forEach((preset:any)=>{
            show.presets.push({...preset})
        })
        show.newRandom = lightshow.newRandom
    }else{
        // console.log('no light show template')
        show.index = data.index
        show.presets = []
        data.presets.forEach((preset:any)=>{
            show.presets.push({...preset})
        })
        show.newRandom = data.newRandom
    }
    // console.log('show is', name, show)
    activeLightShows.set(entity, show)
}

export function RainbowLightshowSystem(dt:number){
    activeLightShows.forEach((show:any, entity:Entity)=>{
        // console.log('show is', show)
        if(show.index >= show.presets.length){
            // console.log('show is over')
            activeLightShows.delete(entity)
            if(show.newRandom){
                createRandomLightShows(entity)
                // console.log('need new random show', entity)//
            }
        }
        else{
            let preset:any = show.presets[show.index]
            // console.log('preset is', preset)
            if(preset.index >= preset.animations.length){
                show.index++
            }
            else{
                if(preset.timer > 0){
                    preset.timer -= dt
                }else{
                    if(preset.delay){
                        preset.index = 500
                    }
                    else{
                        let animation = preset.animations[preset.index]
                        if(animation.sound && !onGround){
                            playGameSound(animation.sound)
                        }
                        if(animation.light){
                            if(animation.index){
                                if(animation.index < 0){
                                    turnOnRainbow(entity)
                                }else{
                                    turnOnRainbowBand(entity, animation.index)
                                }
                            }
                        }else{
                            if(animation.index){
                                if(animation.index < 0){
                                    turnOffRainbow(entity)
                                }else{
                                    turnOffRainbowBand(entity, animation.index)
                                }
                            }
                        }
                        preset.timer = (animation.time ? animation.time : 100) / 1000
                        preset.index += 1
                    }
                }
            }
        }
    })
}

//

// export function RainbowLightshowSystem(dt:number){//
//     for (const [entity] of engine.getEntitiesWith(RainbowLightshowComponent)) {
//         let show = RainbowLightshowComponent.getMutable(entity)
//         if(show.indexes.length === 0){
//             RainbowLightshowComponent.deleteFrom(entity)
//         }else{
//             if(show.timer > 0){
//                 show.timer -= dt
//             }else{
//                 let direction = show.lights.shift()
//                 let index = show.indexes.shift()
//                 let time = show.times.shift()
//                 if(direction){
//                     if(index){
//                         if(index < 0){
//                             turnOnRainbow(entity)
//                         }else{
//                             turnOnRainbowBand(entity, index)
//                         }
//                     }
//                 }else{
//                     if(index){
//                         if(index < 0){
//                             turnOffRainbow(entity)
//                         }else{
//                             turnOffRainbowBand(entity, index)
//                         }
//                     }
//                 }
//                 show.timer = time ? time : 100
//             }
//         }
//     }
// }