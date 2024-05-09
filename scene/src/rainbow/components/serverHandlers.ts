import { Room } from "colyseus.js";
import { SERVER_MESSAGE_TYPES } from "../helpers/types";
import { endGame, lockPod, movePod, prepGame, resetGame, startGame } from "./game";
import { displayGamingCountdown, levelCountdownTimer } from "../ui/gamingCountdown";
import { rotateRacingObject } from "./objects";
import { displayWinnerUI } from "../ui/winnerUI";
import { localPlayer } from "./player";
import { displayReservationUI, updateReservationCounter } from "../ui/reservationUI";
import { updateLeaderboard } from "../ui/leaderboardUI";


export function createServerHandlers(room:Room){
    room.onMessage(SERVER_MESSAGE_TYPES.POD_COUNTDOWN, (info:any)=>{
        console.log(SERVER_MESSAGE_TYPES.POD_COUNTDOWN + " received", info)
    })

    room.state.listen("gameCountdown", (c:any, p:any)=>{
        // console.log('game countodown', p, c)
        if(p !== undefined && (c !== -500 || c !== 0)){
            displayGamingCountdown(true)
            levelCountdownTimer.setNumber(c)
        }

        if(c === -500){
            displayGamingCountdown(false, 0)
        }
    })

    room.state.listen("startingSoon", (c:any, p:any)=>{
        // console.log('starting soon variable', p, c)//
        if(c === true){
            prepGame()
        }
    })

    room.state.listen("started", (c:any, p:any)=>{
        // console.log('started variable', p, c)//
        if(c && (p === undefined || !p)){
            startGame()
        }
    })

    room.state.listen("ended", (c:any, p:any)=>{
        // console.log('ended variable', p, c)//
        if(c && (p === undefined || !p)){
            endGame()
        }
    })

    room.state.listen("reset", (c:any, p:any)=>{
        console.log('reset variable', p, c)
        if(c){
            resetGame()
        }
    })

    room.state.listen("winner", (c:any, p:any)=>{
        console.log('winner variable', p, c)
        if(c !== ""){
            displayWinnerUI(true)
        }else{
            displayWinnerUI(false)
        }
    })

    room.state.pods.onAdd((pod:any, key:any) => {
        // console.log('pod added', key, pod)

        pod.listen("score", (c:any, p:any)=>{
            // console.log('pod score changed', p, c)
            // if(c < 180){
            //     rotateRacingObject(key, (c - (p === undefined ? 0 : p)))
            // }else if(c >= 180){
            //     console.log('greater thamn 180')
            //     rotateRacingObject(key, 180)
            // }//
            if(!room.state.reset){
                rotateRacingObject(key, (c - (p === undefined ? 0 : p)))
                updateLeaderboard()
            }
        })

        pod.listen("locked", (c:any, p:any)=>{
            // console.log('pod locked changed', p, c)
            if(c && p !== undefined){
                lockPod({pod:key, name:pod.name})
            }
        })

        pod.target.listen("targetTick", (c:any, p:any)=>{
            console.log('pod target y changed', key, p, c)
            // movePod(key)
        })
    })


    room.state.players.onAdd((player:any, key:any) => {
        if(player.address === localPlayer.userId){
            player.listen("podCountingDown", (c:any, p:any)=>{
                console.log('podCountingDown changed', p, c)
                displayReservationUI(c)
            })

            player.listen("podCountdown", (c:any, p:any)=>{
                console.log('countdown is', p, c)
                updateReservationCounter(c)
            })
        }
    })
}
