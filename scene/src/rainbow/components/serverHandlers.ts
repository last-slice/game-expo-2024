import { Room } from "colyseus.js";
import { SERVER_MESSAGE_TYPES } from "../helpers/types";
import { addPodTarget, animateTarget, endGame, explodeTarget, lockPod, moveTarget, prepGame, removeTarget, resetGame, resetPods, setPodPosition, startGame } from "./game";
import { displayGamingCountdown, levelCountdownTimer } from "../ui/gamingCountdown";
import { racingObjects, setRacingPosition, setRacingRotation } from "./objects";
import { displayWinnerUI } from "../ui/winnerUI";
import { localPlayer } from "./player";
import { displayReservationUI, updateReservationCounter } from "../ui/reservationUI";
import { updateLeaderboard } from "../ui/leaderboardUI";
import { gameRoom } from "./server";
import { createBall } from "../cannon";
import { mainRainbow, onGround } from "./environment";
import { displayStartingSoonUI } from "../ui/startingSoonUI";
import { playSound } from "@dcl-sdk/utils";
import { attachWinnerAnimation, playWinner, turnOffRainbow, turnOffRainbowBand, turnOnRainbow, turnOnRainbowBand } from "./animations";
import { playGameSound } from "./sounds";
import { Animator } from "@dcl/sdk/ecs";

export function createServerHandlers(room:Room){
    room.onMessage(SERVER_MESSAGE_TYPES.POD_COUNTDOWN, (info:any)=>{
        // console.log(SERVER_MESSAGE_TYPES.POD_COUNTDOWN + " received", info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.CREATE_BALL, (info:any)=>{
        // console.log(SERVER_MESSAGE_TYPES.CREATE_BALL + " received", info)
        createBall(info)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.EXPLODE_TARGET, (info:any)=>{
        // console.log(SERVER_MESSAGE_TYPES.EXPLODE_TARGET + " received", info)
        explodeTarget(info.id)
    })

    room.onMessage(SERVER_MESSAGE_TYPES.HIT_TARGET, (info:any)=>{
        // console.log(SERVER_MESSAGE_TYPES.EXPLODE_TARGET + " received", info)
        animateTarget(info)
    })

    room.state.listen("gameCountdown", (c:any, p:any)=>{
        // console.log('game countodown', p, c)
        if(p !== undefined && (c !== -500 || c !== 0)){
            if(!onGround){
                displayGamingCountdown(true)
                levelCountdownTimer.setNumber(c)
                playSound("sounds/countdown.mp3", false)
            }else{
                displayGamingCountdown(false)
            }

            if(c < 9 && c >= 0){
                turnOnRainbowBand(mainRainbow, 8 - c)
            }
        }

        if(c === -500){
            displayGamingCountdown(false, 0)
        }
    })

    room.state.listen("startingSoon", (c:any, p:any)=>{
        console.log('starting soon variable', p, c)
        if(c){
            prepGame()
        }else{
            if(!gameRoom.state.started && !gameRoom.state.ended && gameRoom.state.reset){
                playGameSound('playAgain')
                resetPods()
            }
        }
    })

    room.state.listen("started", (c:any, p:any)=>{
        console.log('started variable', p, c)
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
        if(c !== ""){
            displayWinnerUI(true)

            if(gameRoom.state.winnerId === localPlayer.userId){
                playGameSound("winner")
                playGameSound("winSongs")//
            }else{
                playGameSound("gameOver")
            }

            turnOffRainbow(mainRainbow)

            if(gameRoom.state.winner !== "tie"){
                gameRoom.state.pods.forEach((pod:any, key:number)=>{
                    if(pod.id === gameRoom.state.winnerId){
                        attachWinnerAnimation(gameRoom.state.winnerId)
                        playWinner(key, false)
                        Animator.playSingleAnimation(racingObjects[key].object, "Win", true)
                        Animator.playSingleAnimation(racingObjects[key].object2, "Win", true)
                    }else{
                        Animator.playSingleAnimation(racingObjects[key].object, "Lose", true)
                        Animator.playSingleAnimation(racingObjects[key].object2, "Lose", true)
                    }
                })   
            }
        }else{
            displayWinnerUI(false)
        }
    })

    room.state.pods.onAdd((pod:any, key:any) => {
        // console.log('pod added', key, pod)

        if(!gameRoom.state.started && pod.locked){
            lockPod(pod)
            playSound("sounds/8bit_select.mp3", false)
        }

        pod.listen("score", (c:any, p:any)=>{
            // console.log('pod score changed', p, c)
            // if(c < 180){//
            //     rotateRacingObject(key, (c - (p === undefined ? 0 : p)))//
            // }else if(c >= 180){
            //     console.log('greater thamn 180')
            //     rotateRacingObject(key, 180)
            // }//////
            if(!room.state.reset && p !== undefined){
                // rotateRacingObject(key, (c - (p === undefined ? 0 : p)))
                // advanceObject(key, pod.factor)
                updateLeaderboard()
            }

            if(pod.id === localPlayer.userId){
                playSound("sounds/ui_click_go.mp3", false)
            }

            // if(!onGround){
               
            // }            
        })

        pod.listen("locked", (c:any, p:any)=>{
            // console.log('pod locked changed', p, c)
            if(c && p !== undefined){
                lockPod(pod)

                if(!gameRoom.state.started){
                    displayStartingSoonUI(true, "WAITING ON MORE PLAYERS")
                }
            }

            if(!c && gameRoom.state.started){
                updateLeaderboard()
            }
        })

        // pod.target.listen("targetTick", (c:any, p:any)=>{
        //     // console.log('pod target tick changed', key, p, c)
        //     if(gameRoom.state.started && c !== -500){
        //         setPodPosition(pod, key)
        //     }
        // })

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
                displayReservationUI(player.pod, c)
            })

            player.listen("podCountdown", (c:any, p:any)=>{
                console.log('countdown is', p, c, player.pod)
                updateReservationCounter(player.pod, c)
            })
        }
    })

    room.state.targets.onAdd((target:any, key:any) => {
        addPodTarget(target)
        if(gameRoom.state.started && target.multiplier > 1){
            playGameSound("powerup")
        }
    })

    room.state.targets.onRemove((target:any, key:any) => {
        removeTarget(target.id)
    })
}
