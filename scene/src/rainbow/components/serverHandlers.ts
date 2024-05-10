import { Room } from "colyseus.js";
import { SERVER_MESSAGE_TYPES } from "../helpers/types";
import { endGame, lockPod, moveTarget, prepGame, resetGame, setPodPosition, startGame } from "./game";
import { displayGamingCountdown, levelCountdownTimer } from "../ui/gamingCountdown";
import { setRacingPosition, setRacingRotation } from "./objects";
import { displayWinnerUI } from "../ui/winnerUI";
import { localPlayer } from "./player";
import { displayReservationUI, updateReservationCounter } from "../ui/reservationUI";
import { updateLeaderboard } from "../ui/leaderboardUI";
import { gameRoom } from "./server";


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
        console.log('starting soon variable', p, c)//
        if(c === true){
            prepGame()
        }
    })

    room.state.listen("started", (c:any, p:any)=>{
        console.log('started variable', p, c)//
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
            // console.log('pod score changed', p, c)//
            // if(c < 180){//
            //     rotateRacingObject(key, (c - (p === undefined ? 0 : p)))
            // }else if(c >= 180){
            //     console.log('greater thamn 180')
            //     rotateRacingObject(key, 180)
            // }//////
            if(!room.state.reset && p !== undefined){
                // rotateRacingObject(key, (c - (p === undefined ? 0 : p)))
                // advanceObject(key, pod.factor)
                updateLeaderboard()
            }//
        })

        pod.listen("locked", (c:any, p:any)=>{
            // console.log('pod locked changed', p, c)
            if(c && p !== undefined){
                lockPod({pod:key, name:pod.name})
            }
        })

        pod.target.listen("targetTick", (c:any, p:any)=>{
            // console.log('pod target y changed', key, p, c)
            if(gameRoom.state.started && c === 0){
                // console.log('need to set pod position')
                // setPodPosition(key)
            }
        })

        pod.racingObject.listen("y", (c:any, p:any)=>{
            // console.log('pod target y changed', key, p, c)
            if(gameRoom.state.started && p !== undefined && pod.stage === 1 || pod.stage === 3 || pod.stage === 4){
                // console.log('need to set pod y position')
                setRacingPosition(key, pod.racingObject.y)
            }
        })

        pod.racingObject.listen("rz", (c:any, p:any)=>{
            // console.log('pod target y changed', key, p, c)//
            if(gameRoom.state.started && p !== undefined && pod.stage === 2){
                console.log('need to set pod rz position')
                setRacingRotation(key, pod.racingObject.rz)
            }

            if(gameRoom.state.started && p !== undefined && (pod.stage === 3 || pod.stage === 4)){
                setRacingRotation(key, 180)
            }

            if(gameRoom.state.started && p !== undefined && pod.stage === 1){
                setRacingRotation(key, 0)
            }
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
