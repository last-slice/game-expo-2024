import { AudioSource, Entity, Transform, engine } from "@dcl/sdk/ecs"
import { utils } from "../helpers/libraries"
import { getRandomIntInclusive } from "../helpers/functions"
import { sounds } from "../helpers/resources"
import { playSound } from "@dcl-sdk/utils"

export const GameSoundComponent = engine.defineComponent("game::expo::game::sound::component", {})

export let groundFaderInterval:any
let faderCount = 0

let bgMusicEntity:Entity

export function startAudioFader(toPlay:string, direction:number){
    endFader()

    let audio = AudioSource.getMutableOrNull(bgMusicEntity)
    if(audio){
        audio.playing = false
    }

    playBGSound(toPlay)

    // groundFaderInterval = utils.timers.setInterval(()=>{
    //     if(faderCount <= 1){
    //         faderCount += .1
    //         let audio = AudioSource.getMutableOrNull(bgMusicEntity)
    //         if(audio && audio.volume){
    //             if(direction === 1){
    //                 audio.volume += .005
    //             }else{
    //                 audio.volume -= .005
    //             }
    //         }
    //     }else{
    //         console.log('done fading music, need to start playing top music')
    //         endFader()
    //         playBGSound(toPlay)
    //     }
    // }, 100)
}

export function endFader(){
    utils.timers.clearInterval(groundFaderInterval)
    faderCount = 0
}

export function playBGSound(file:string, ){
    let audio = AudioSource.getMutableOrNull(bgMusicEntity)
    if(audio){
        audio.playing = false
    }
    AudioSource.createOrReplace(bgMusicEntity, {audioClipUrl:"" + file, playing:true, loop:true, volume:0.05})
}

export function playGameSound(key:string, force?:number){
    let index = force ? force : getRandomIntInclusive(0, sounds[key].length -1)
    playSound(sounds[key][index])
    // let ent = engine.addEntity()
    // Transform.create(ent, {parent: engine.PlayerEntity})
    // AudioSource.createOrReplace(ent, {audioClipUrl:"" + sounds[key][index], playing:true, loop:false, volume:0.5})
    // GameSoundComponent.create(ent)
}

export function AudioCompleteSystem(){
    // for (const [entity] of engine.getEntitiesWith(GameSoundComponent)) {
    // let audio = AudioSource.get(entity)
    // console.log('current time is', audio.playing)
    // }
}

export function createSound(){//
    bgMusicEntity = engine.addEntity()
    Transform.create(bgMusicEntity, {parent:engine.PlayerEntity})
    AudioSource.createOrReplace(bgMusicEntity, {audioClipUrl:"sounds/ground_bg_loop.mp3", playing:true, loop:true, volume:0.1})
}