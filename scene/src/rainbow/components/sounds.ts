import { AudioSource, Entity, Transform, engine } from "@dcl/sdk/ecs"
import { utils } from "../helpers/libraries"
import { getRandomIntInclusive } from "../helpers/functions"
import { sounds } from "../helpers/resources"
import { playSound } from "@dcl-sdk/utils"
import { onGround } from "./environment"

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

    playBGSound(toPlay, onGround ? 0.05 : 0.1)
}

export function endFader(){
    utils.timers.clearInterval(groundFaderInterval)
    faderCount = 0
}

export function playBGSound(file:string, volume?:number){
    let audio = AudioSource.getMutableOrNull(bgMusicEntity)
    if(audio){
        audio.playing = false
    }
    AudioSource.createOrReplace(bgMusicEntity, {audioClipUrl:"" + file, playing:true, loop:true, volume: volume? volume : 0.05})
}

export function playGameSound(key:string, force?:number){
    let index = force ? force : getRandomIntInclusive(0, sounds[key].length -1)
    playSound(sounds[key][index])
}

export function AudioCompleteSystem(){
}

export function createSound(){//
    bgMusicEntity = engine.addEntity()
    Transform.create(bgMusicEntity, {parent:engine.PlayerEntity})
    AudioSource.createOrReplace(bgMusicEntity, {audioClipUrl:"sounds/ground_bg_loop.mp3", playing:true, loop:true, volume:0.1})
}