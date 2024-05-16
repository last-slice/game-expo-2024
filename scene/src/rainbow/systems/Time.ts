import { getWorldTime } from '~system/Runtime'
import { playGameSound } from '../components/sounds'
import { engine } from '@dcl/sdk/ecs'
import { utils } from '../helpers/libraries'

let night:boolean = true
let timer:number = 10

export async function checkTime(){
    utils.timers.setTimeout(async ()=>{
        night = await getTime()
        if(night){
            playGameSound('inNightMode')
        }else{
            playGameSound('suggestNightMode')//
        }
        engine.addSystem(TimeSystem)
    }, 1000 * 5)

}

async function getTime(){
    let time = await getWorldTime({})
    if (time && time.seconds < 6.25 * 60 * 60 || time.seconds > 19.85 * 60 * 60) {
      return true
    } else {
        return false
    }
}

async function updateTime(){
    let isNight = await getTime()
    if(!night && isNight){
        console.log('user switched to night mode')
        playGameSound('inNightMode')
    }
}

export function TimeSystem(dt:number){
    if(timer > 0){
        timer -= dt
    }else{
        updateTime()
        timer = 10
    }
}