import { getWorldTime } from '~system/Runtime'
import { playGameSound } from '../components/sounds'
import { engine } from '@dcl/sdk/ecs'
import { utils } from '../helpers/libraries'
import { getRandomIntInclusive } from '../helpers/functions'
import { gameRoom } from '../components/server'
import { localPlayer } from '../components/player'

let night:boolean = true
let timer:number = getRandomIntInclusive(10,15)

export function EncouragementTimeSystem(dt:number){
    if(timer > 0){
        timer -= dt
    }else{
        attemptEncouragement()
        timer = getRandomIntInclusive(10,15)
    }
}

function attemptEncouragement(){
    if(gameRoom && gameRoom.state.started){
         let player = gameRoom.state.players.get(localPlayer.userId)
         if(player && player.playing){
            playGameSound("encouragement")
         }
    }else{
        engine.removeSystem(EncouragementTimeSystem)
    }
}