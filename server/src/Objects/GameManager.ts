import { Client } from "colyseus";
import { GameRoom } from "../rooms/GameRoom";
import { GamePod } from "../rooms/schema/GameRoomState";
import { SERVER_MESSAGE_TYPES } from "../utils/types";
import { TargetSystem } from "./GameTargetSystem";
import { Player } from "./Player";

export class GameManager {

    room:GameRoom

    minPlayers:number = 2
    maxPlayers:number = 8
    winThreshold:number = 180

    pods:any[] = []

    countdownTimer:any
    countdownInterval:any
    countdownBase:number = 5
    countdownTime:number = this.countdownBase

    gameTimeBase:number = 300
    gameResetTimeBase:number = 10

    targetSystem:TargetSystem

    constructor(gameRoom:GameRoom){
        this.room = gameRoom

        this.targetSystem = new TargetSystem(gameRoom)

        this.initPods()
    }
    
    garbageCollect(){
        this.clearCountdown()
    }

    removePlayer(player:Player){
        if(this.room.state.started){
            console.log('removing player')
            let pod = this.room.state.pods[player.pod]
            if(pod){
                console.log('found pod')
                pod.resetPod()
            }
        }
    }

    initPods(){
        for(let i = 0; i < 8; i++){
            this.room.state.pods.push(new GamePod({locked:false, score:0, name:"", id:""}))
            this.pods.push(
                {occupied:false, color:"", id:"", score:""}
            )
        }
    }

    lockPod(podIndex:number, playerData:any){
        if(!this.room.state.started && !this.room.state.startingSoon){
            let pod = this.room.state.pods[podIndex]
            pod.locked = true
            pod.id = playerData.userId
            pod.name = playerData.name
            this.checkGameReady()
        }else{
            console.log('game already initializing')
        }
    }

    clearPods(){
        this.room.state.pods.forEach((pod)=>{
            pod.resetPod()
        })
    }

    checkGameReady(){
        if(this.room.state.pods.filter(pod => pod.locked).length >= this.minPlayers && !this.room.state.startingSoon){
            console.log("we have minimum players, begin game")
            this.countdownTimer = setTimeout(()=>{
                this.room.state.startingSoon = true
                this.startGameCountdown()
              }, 1000 * 3)
        }
    }

    clearCountdown(){
        clearTimeout(this.countdownTimer)
        clearInterval(this.countdownInterval)
    }

    startGameCountdown(){
        this.room.state.gameCountdown = this.countdownTime

        this.targetSystem.init()

        this.countdownTimer = setTimeout(()=>{
            this.room.state.gameCountdown = -500
            this.clearCountdown()
            this.startGame()
          }, 1000 * this.countdownTime)
            
          this.countdownInterval = setInterval(()=>{
            this.room.state.gameCountdown--
          }, 1000)
    }

    startGame(){
        this.room.state.reset = false
        this.room.state.ended = false
        this.room.state.started = true

        this.room.state.pods.forEach((pod:GamePod, i:number)=>{
            let player = this.room.state.players.get(pod.id)
            if(player){
                player.playing = true
            }
        })

        this.targetSystem.moveInitTargets()

        this.countdownTime = this.gameTimeBase
        this.countdownTimer = setTimeout(()=>{
            this.room.state.gameCountdown = -500
            this.clearCountdown()
            this.endGame()
          }, 1000 * this.countdownTime)
    }

    endGame(){
        this.room.state.ended = true
        this.clearCountdown()

        this.targetSystem.stop()

        this.room.state.pods.forEach((pod)=>{
            let player = this.room.state.players.get(pod.id)
            if(player){
                player.playing = false
            }
        })

        this.determineWinner()
        //clean up etc

        this.countdownTime = this.gameResetTimeBase
        this.countdownTimer = setTimeout(()=>{
            this.clearCountdown()
            this.resetGame()
          }, 1000 * this.countdownTime)

        console.log('game over')
    }

    determineWinner(){
        let highscore = 0
        let winner = ""
        this.room.state.pods.forEach((pod, i:number)=>{
            if(i === this.maxPlayers && highscore === pod.score){
                console.log('we have a tie!!')
                winner = "tie"
            }else{
                if(pod.locked && pod.score > highscore){
                    highscore = pod.score
                    winner = pod.name
                }
            }
        })
        this.room.state.winner = winner
    }

    resetPlayers(){
        this.room.state.players.forEach((player)=>{
            player.reset()
        })
    }

    resetGame(){
        this.clearPods()
        this.resetPlayers()
        this.room.state.started = false
        this.room.state.ended = false
        this.room.state.startingSoon = false
        this.room.state.reset = true
        this.room.state.winner = ""
        console.log('resetting a game')
    }

    isGameLive(){
        return this.room.state.started && !this.room.state.ended
    }

    attemptScore(client:Client, info:any){
        if(this.isGameLive()){
            // if(this.targetSystem.targetExists(info.id)){
                let player:Player = this.room.state.players.get(client.userData.userId)
                if(player && player.playing){
                    let pod = this.room.state.pods.filter(pod => pod.id === player.dclData.userId)[0]
                    if(pod){
                        pod.score += pod.factor
                        this.advanceObject(pod)
                    }
                }else{
                    console.log('player is not playing, cheating?', client.userData.userId)
                }
            // }
            // else{
            //     console.log('target doesnt exist, player cheating?', info.id,  client.userData.userId)
            // }
        }
        else{
            console.log('game isnt live')
        }
    }

    // checkPodWin(pod:GamePod){
    //     if(pod.stage === 4 &&  pod.racingObject.y >= ){
    //         console.log('we have a winner, end game')
    //         this.endGame()
    //     }
    // }

    advanceObject(pod:GamePod){
        console.log('advancing object')
        let step:number

        switch(pod.stage){
            case 1:
                // console.log('in stage one')
                step = pod.factor + pod.racingObject.y
    
                if(step > 0){
                    pod.stage = 2
                    pod.factor = 1
                    pod.racingObject.y = 22
                    this.rotateRacingObject(pod, step)
                }else{
                  this.moveRacingObject(pod, pod.factor)
                }
            break;
    
            case 2:
                // console.log('in stage 2')

                // console.log('rotation is', pod.racingObject.rz)
    
                step = pod.racingObject.rz + pod.factor
    
                // console.log('rotation step is', step)
    
                if(step >= 180){
                    // console.log('advance to stage 3')
                    pod.stage = 3
                    pod.factor = 0.1
                    pod.racingObject.y = 0

                    this.moveRacingObject(pod, step - pod.racingObject.rz)
                    pod.racingObject.rz = 180

                    // console.log('target position is', pod.racingObject.y)
                }else{
                    this.rotateRacingObject(pod, pod.factor)
                }
            break;
    
            case 3:
                // console.log('stage 3')
                // console.log('target position is', pod.racingObject.y)
                step = pod.racingObject.y + pod.factor

                // console.log('pod racingObject is ', pod.racingObject.y)
    
                // console.log('step is', step)
    
                if(step >= 22){
                    // console.log('advancing to stage 4')
                    pod.stage = 4
                    pod.racingObject.y = 22
                }else{
                   this.moveRacingObject(pod, pod.factor)
                }
            break;

            case 4:
                console.log('stage 4')
                this.endGame()
                break;
        }
    }

    moveRacingObject(pod:GamePod, amount:number){
        // console.log('moving object', amount)
        pod.racingObject.y += amount
    }

    rotateRacingObject(pod:GamePod, amount:number){
        pod.racingObject.rz += amount
    }

    createBall(player:Player, info:any){
        this.room.broadcast(SERVER_MESSAGE_TYPES.CREATE_BALL, info)
    }
}