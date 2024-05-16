import { Entity, Schemas, engine } from "@dcl/sdk/ecs"
import { turnOffRainbow, turnOffRainbowBand, turnOnRainbow, turnOnRainbowBand } from "../components/animations"
import { activeLightShows, allOff, lightShows, presets } from "../components/lightshow"
import { utils } from "../helpers/libraries"
import { getRandomIntInclusive, getRandomString } from "../helpers/functions"

export const LightshowComponent = engine.defineComponent("game::expo::rainbow::lightshow::component", {
    show:Schemas.String,
    active:Schemas.Boolean,
    index:Schemas.Int
})

export function createRandomLightShows(entity:Entity){
    console.log('presets are ', presets)
    activeLightShows.delete(entity)
    // console.log('creating light show for entity', entity)
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
    // console.log('show is', name, data)

    let show:any

    if(lightShows.has(name)){
        show = {...lightShows.get(name)}
    }else{
        show = {...data}
    }
    activeLightShows.set(entity, {...show})
}

export function RainbowLightshowSystem(dt:number){
    activeLightShows.forEach((show:any, entity:Entity)=>{
        if(show.index >= show.presets.length){
            // console.log('show is over')
            activeLightShows.delete(entity)
            if(show.newRandom){
                createRandomLightShows(entity)
                // console.log('need new random show', entity)
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
                    let animation = preset.animations[preset.index]
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
    })
}

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