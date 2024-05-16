import { AudioSource, Entity, Transform, engine } from "@dcl/sdk/ecs"
import { utils } from "../helpers/libraries"
import { getRandomIntInclusive } from "../helpers/functions"
import { sounds } from "../helpers/resources"
import { playSound } from "@dcl-sdk/utils"

export let groundFaderInterval:any
let faderCount = 0

let bgMusicEntity:Entity

export function startAudioFader(toPlay:string, direction:number){
    endFader()

    groundFaderInterval = utils.timers.setInterval(()=>{
        if(faderCount <= 1){
            faderCount += .1
            let audio = AudioSource.getMutableOrNull(bgMusicEntity)
            if(audio && audio.volume){
                if(direction === 1){
                    audio.volume += .005
                }else{
                    audio.volume -= .005
                }
            }
        }else{
            console.log('done fading music, need to start playing top music')
            endFader()
            playBGSound(toPlay)
        }
    }, 100)
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
}


// export function startGroundAudioFader(){
//     console.log('starting ground fader')
//     groundFaderInterval = utils.timers.setInterval(()=>{
//         if(faderCount <= 1){
//             faderCount += .1
//             let audio = AudioSource.getMutableOrNull(bgMusicEntity)
//             if(audio){
//                 audio.volume ? audio.volume -= .005 : 0.05
//             }
//         }else{
//             console.log('done fading music, need to start playing top music')
//             endGroundAudioFader()
//             playPlayingSound()
//         }
//     }, 100)
// }

// export function startPlayingAudioFader(){
//     groundFaderInterval = utils.timers.setInterval(()=>{
//         if(faderCount < 1){
//             faderCount += .1
//             let audio = AudioSource.getMutableOrNull(bgMusicEntity)
//             if(audio){
//                 audio.volume ? audio.volume += .005 : 0.05
//             }
//         }else{
//             console.log('done fading music, need to start playing top music')
//             endGroundAudioFader()
//         }
//     }, 100)
// }

export function createSound(){//
    bgMusicEntity = engine.addEntity()
    Transform.create(bgMusicEntity, {parent:engine.PlayerEntity})
    AudioSource.createOrReplace(bgMusicEntity, {audioClipUrl:"sounds/ground_bg_loop.mp3", playing:true, loop:true, volume:0.1})
}


// export function playPlayingSound(){
//     console.log('playing playing sound')
//     let audio = AudioSource.getMutableOrNull(bgMusicEntity)
//     if(audio){
//         audio.playing = false
//     }
//     AudioSource.createOrReplace(bgMusicEntity, {audioClipUrl:"sounds/playing_bg_loop.mp3", playing:true, loop:true, volume:0})
//     startPlayingAudioFader()
// }

// export function playGroundSound(){
//     let audio = AudioSource.getMutableOrNull(bgMusicEntity)
//     if(audio){
//         audio.playing = false
//     }
//     AudioSource.createOrReplace(bgMusicEntity, {audioClipUrl:"sounds/ground_bg_loop.mp3", playing:true, loop:true, volume:0.1})
// }