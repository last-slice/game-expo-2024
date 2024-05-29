import { GameRoom } from "../rooms/GameRoom";
import { GamePod } from "../rooms/schema/GameRoomState";
import { SERVER_MESSAGE_TYPES } from "../utils/types";
import { TargetSystem } from "./GameTargetSystem";
import { Player } from "./Player";
import { pushPlayfabEvent } from "./PlayfabEvents";
import { PLAYFAB_DATA_ACCOUNT, getLeaderboard } from "../utils/Playfab";

export class GameManager {

    room:GameRoom

    minPlayers:number = 1
    maxPlayers:number = 8
    numPlayers:number = 0

    pods:any[] = []

    countdownTimer:any
    countdownInterval:any
    countdownBase:number = 10
    countdownTime:number = this.countdownBase

    gameTimeBase:number = 20
    gameResetTimeBase:number = 12

    targetSystem:TargetSystem

    haveMinPlayers:boolean = false

    freezeTimer:any
    freezeTimeBase:number = 5
    freezeTime:number = this.freezeTimeBase

    leaderboards:Map<string, any> = new Map()

    leaderboardInterval:any
    leaderboardIntervalTime:number = 13

    constructor(gameRoom:GameRoom){
        this.room = gameRoom

        this.targetSystem = new TargetSystem(gameRoom)

        this.initPods()

        this.leaderboardInterval = setInterval(()=>{
            this.refreshLeaderBoards()
        }, 1000 * this.leaderboardIntervalTime)
        this.refreshLeaderBoards()
    }

    async refreshLeaderBoards(){
        try{
            let scoreRes = await getLeaderboard({
                MaxResultsCount:10,
                StartPosition:0,
                StatisticName:"Score"
            })
            console.log('pig leaderboard is', scoreRes)
    
            let pigRes = await getLeaderboard({
                MaxResultsCount:10,
                StartPosition:0,
                StatisticName:"Pigs Flown"
            })
            console.log('pig leaderboard is', pigRes)
    
            let winRes = await getLeaderboard({
                MaxResultsCount:10,
                StartPosition:0,
                StatisticName:"Wins"
            })
    
            let targetsRes = await getLeaderboard({
                MaxResultsCount:10,
                StartPosition:0,
                StatisticName:"Targets Hit"
            })
    
            this.leaderboards.set("Pigs Flown", pigRes.Leaderboard)
            this.leaderboards.set("Wins", winRes.Leaderboard)
            this.leaderboards.set("Targets Hit", targetsRes.Leaderboard)
            this.leaderboards.set("Score", scoreRes.Leaderboard)
        }
        catch(e){
            console.log('refresh leaderboard error', e)
        }
    }
    
    garbageCollect(){
        this.clearCountdown()
        clearInterval(this.leaderboardInterval)
    }

    removePlayer(player:Player){
        if(this.room.state.started){
            let pod = this.room.state.pods[player.pod]
            if(pod){
                pod.resetPod()
            }
            this.checkRemainingPlayers()
        }
    }

    checkRemainingPlayers(){
        let playing = 0
        this.room.state.pods.forEach((pod)=>{
            pod.locked ? playing++ : null
        })

        if(playing === 0){
            this.endGame()
        }
    }

    initPods(){
        for(let i = 0; i < 8; i++){
            this.room.state.pods.push(new GamePod({locked:false, score:0, name:"", id:"", index:i}))
        }
    }

    lockPod(podIndex:number, playerData:any){
        if(!this.room.state.started && !this.room.state.startingSoon){
            let pod = this.room.state.pods[podIndex]
            pod.locked = true
            pod.id = playerData.userId
            pod.name = playerData.name
            this.numPlayers++
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
            
            if(this.haveMinPlayers){
                this.clearCountdown()
            }else{
                this.haveMinPlayers = true
            }

            this.countdownTimer = setTimeout(()=>{
                this.room.state.startingSoon = true
                this.startGameCountdown()
              }, 1000 * 5)
        }
    }

    clearCountdown(){
        clearTimeout(this.countdownTimer)
        clearInterval(this.countdownInterval)

        clearTimeout(this.freezeTimer)
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
        console.log('starting game')

        let gameType = this.numPlayers === 8 ? SERVER_MESSAGE_TYPES.FULL_GAME : this.numPlayers > 1 ? SERVER_MESSAGE_TYPES.MP_GAME : SERVER_MESSAGE_TYPES.SOLO_GAME
        pushPlayfabEvent(gameType, PLAYFAB_DATA_ACCOUNT, {})
       
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
        this.startForceEndTimer()
    }

    async endGame(){
        this.room.state.ended = true
        this.clearCountdown()

        this.targetSystem.stop()

        this.room.state.pods.forEach((pod)=>{
            let player = this.room.state.players.get(pod.id)
            if(player){
                player.playing = false
                player.sendPlayerMessage(SERVER_MESSAGE_TYPES.PLAYER_SCORES, {pigs: pod.pigsFlown, targets: pod.targetsHit})
            }
        })

        pushPlayfabEvent(SERVER_MESSAGE_TYPES.GAME_FINISHED, PLAYFAB_DATA_ACCOUNT, {})

        await this.determineWinner()

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
        let winnerId = ""
        this.room.state.pods.forEach((pod, i:number)=>{
            if(pod.locked){
                if(pod.score === highscore){
                    winner = "tie"
                    pushPlayfabEvent(SERVER_MESSAGE_TYPES.GAME_TIED, PLAYFAB_DATA_ACCOUNT, {})
                }else{
                    if(pod.score > highscore){
                        highscore = pod.score
                        winner = pod.name
                        winnerId = pod.id
                    }
                }
            }
        })
        this.room.state.winner = winner
        this.room.state.winnerId = winnerId

        if(winner !== "tie"){
            let player = this.room.state.players.get(winnerId)
            if(player && this.numPlayers > 1){
                player.increaseValueInMap(player.stats, SERVER_MESSAGE_TYPES.WIN_GAME, 1)
            }
        }
    }

    resetPlayers(){
        this.room.state.players.forEach((player)=>{
            player.reset()
        })
    }

    resetGame(){
        this.clearPods()
        this.resetPlayers()
        this.numPlayers = 0
        this.haveMinPlayers = false
        this.room.state.reset = true
        this.room.state.winner = ""
        this.room.state.winnerId = ""

        this.countdownTime = this.gameResetTimeBase
        this.countdownTimer = setTimeout(()=>{
            this.clearCountdown()
            this.room.state.started = false
            this.room.state.ended = false
            this.room.state.startingSoon = false
            this.countdownTime = this.countdownBase
          }, 1000 * this.countdownTime)
    }

    isGameLive(){
        return this.room.state.started && !this.room.state.ended
    }

    startForceEndTimer(){
        this.countdownTime = this.gameTimeBase
        this.countdownTimer = setTimeout(()=>{
            this.room.state.gameCountdown = -500

            console.log('Game ended early because no one hit a target')
            pushPlayfabEvent(SERVER_MESSAGE_TYPES.GAME_FINISHED_EARLY, PLAYFAB_DATA_ACCOUNT, {})

            this.clearCountdown()
            this.endGame()
          }, 1000 * this.countdownTime)
    }

    resetForceEndTimer(){
        this.clearCountdown()
        this.startForceEndTimer()
    }

    attemptScore(client:any, info:any){
        // console.log('player is', client.userData.userId)
        if(this.isGameLive()){
            let target = this.room.state.targets.find(target => target.id === info.id)
            if(target && target.enabled){
                if(target.multiplier === 6){
                    target.enabled = false
                }

                let player:Player = this.room.state.players.get(client.userData.userId)
                if(player && player.playing){
                    let pod = this.room.state.pods.find(pod => pod.id === client.userData.userId)
                    if(pod){
                        this.resetForceEndTimer()

                        if(target.multiplier === 6){
                            target.startDelete()
                            this.enableFreeze(player)
                        }else{
                        // console.log('adding score ', (pod.factor * target.multiplier))
                        player.increaseValueInMap(player.stats, SERVER_MESSAGE_TYPES.TARGETS_HIT, 1)
                        let score = (pod.factor * target.multiplier)
                        pod.score += score

                        player.increaseValueInMap(player.stats, SERVER_MESSAGE_TYPES.PLAYER_SCORED, score)

                        this.room.state.pods[player.pod].targetsHit++

                        this.room.broadcast(SERVER_MESSAGE_TYPES.HIT_TARGET, target.id)
                        
                        this.advanceObject(pod)
                        }
                    }else{
                        // console.log('couldnt find pod')
                    }
                }else{
                    // console.log('player is not playing, cheating?', client.userData.userId)
                }
            }
            // else{
            //     console.log('target doesnt exist, player cheating?', info.id,  client.userData.userId)
            // }
        }
        else{
            console.log('game isnt live')
        }
    }

    advanceObject(pod:GamePod){
        // console.log('advancing object')
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
                // console.log('stage 4')
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
        player.increaseValueInMap(player.stats, SERVER_MESSAGE_TYPES.PIGS_FLEW, 1)
        this.room.state.pods[player.pod].pigsFlown++
        this.room.broadcast(SERVER_MESSAGE_TYPES.CREATE_BALL, info)
    }

    enableFreeze(player:Player){
        pushPlayfabEvent(
            SERVER_MESSAGE_TYPES.PLAYER_FROZEN, player, {}
        )

        this.room.state.frozen = true
        this.room.state.pods.forEach((pod:GamePod, key:number)=>{
            // if(pod.locked && pod.id !== player.dclData.userId){
                player.frozen = true
            // }
        })

        this.freezeTimer = setTimeout(()=>{
            clearTimeout(this.freezeTimer)
            this.disableFreeze()
        }, 1000 * this.freezeTime)
    }

    disableFreeze(){
        this.room.state.frozen = false
        this.room.state.pods.forEach((pod:GamePod, key:number)=>{
            if(pod.locked){
                let player = this.room.state.players.get(pod.id)
                    player.frozen = false
            }
        })
    }
}