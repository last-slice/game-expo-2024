import { GameRoom } from "../rooms/GameRoom";
import { GamePod } from "../rooms/schema/GameRoomState";
import { SERVER_MESSAGE_TYPES } from "../utils/types";
import { Player } from "./Player";

export class GameManager {

    room:GameRoom

    minPlayers:number = 1
    maxPlayers:number = 8
    winThreshold:number = 180

    playing:boolean = false
    pods:any[] = []

    countdownTimer:any
    countdownInterval:any
    countdownBase:number = 5
    countdownTime:number = this.countdownBase

    gameTimeBase:number = 60
    gameResetTimeBase:number = 10

    constructor(gameRoom:GameRoom){
        this.room = gameRoom

        this.initPods()
    }
    
    garbageCollect(){
        this.clearCountdown()
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
            pod.name = ""
            pod.id = ""
            pod.score = 0
            pod.locked = false
            pod.target.resetTarget()
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
                pod.target.setInitialPosition(i)
                pod.targetSystem.start(pod.target)
            }
        })

        this.countdownTime = this.gameTimeBase
        this.countdownTimer = setTimeout(()=>{
            this.room.state.gameCountdown = -500
            this.clearCountdown()
            this.endGame()
          }, 1000 * this.countdownTime)
    }

    endGame(){
        this.clearCountdown()
        this.room.state.ended = true

        this.room.state.pods.forEach((pod)=>{
            let player = this.room.state.players.get(pod.id)
            if(player){
                player.playing = false
                pod.targetSystem.stop()
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

    attemptScore(player:Player, pod:GamePod){
        if(this.isGameLive() && player && player.playing && pod){
            pod.score += player.scoreFactor
            if(pod.score >= this.winThreshold){
                console.log('we have a winner, end game')
                this.endGame()
            }
        }else{
            console.log('game isnt live')
        }
    }
}