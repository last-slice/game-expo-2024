import { getWorldTime } from '~system/Runtime'
import { playGameSound } from '../components/sounds'
import { engine } from '@dcl/sdk/ecs'
import { utils } from '../helpers/libraries'

let night:boolean = true
let playedNight:boolean = false
let timer:number = 10

export async function checkTime(){
    utils.timers.setTimeout(async ()=>{
        night = await getTime()
        if(night){
            if(playedNight){
                engine.removeSystem(TimeSystem)
                return
            }

            playedNight = true
            playGameSound('inNightMode')
        }else{
            playGameSound('suggestNightMode')
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
    if(playedNight){
        engine.removeSystem(TimeSystem)
        return
    }

    if(!night && isNight){
        playedNight = true
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