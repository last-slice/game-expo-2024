import {MapSchema, Schema, type} from "@colyseus/schema";
import {Client} from "@colyseus/core";
import {SCENE_MODES, SERVER_MESSAGE_TYPES} from "../utils/types";
import {abortFileUploads, fetchPlayfabFile, fetchPlayfabMetadata, fetchUserMetaData, finalizeUploadFiles, initializeUploadPlayerFiles, playfabLogin, setTitleData, updatePlayerData, updatePlayerStatistic, uploadPlayerFiles} from "../utils/Playfab";
import { GameRoom } from "../rooms/GameRoom";
import { pushPlayfabEvent } from "./PlayfabEvents";
import { defaultStats, scoreFactor } from "./Admin";
import { DEBUG } from "../utils/config";

export class Player extends Schema {
  @type("string") userId:string;
  @type("string") name:string 
  @type("boolean") podCountingDown:boolean
  @type("number") podCountdown:number = 3
  @type("number") pod:number = -500
  @type("boolean") playing:boolean = false
  @type("boolean") frozen:boolean = false


  playFabData:any
  dclData:any
  ip:string

  room:GameRoom
  roomId:string
  client:Client
  world:string = "main"

  startTime:any = 0
  
  podTimer:any
  podLockInterval:any
  enteredPod:boolean = false
  podLocked:boolean = false

  scoreFactor:number = 0

  stats:Map<string, number> = new Map()

  constructor(room:GameRoom, client:Client){
    super()
    this.room = room
    this.client = client

    this.playFabData = client.auth.playfab
    this.userId = client.userData.userId
    this.name = client.userData.name
    this.ip = client.userData.ip
    this.scoreFactor = scoreFactor

    this.startTime = Math.floor(Date.now()/1000)
    if(DEBUG){
      return
    }

    // console.log('playfab info is', this.playFabData)
    this.setStats(this.playFabData.InfoResultPayload.PlayerStatistics)
  }

  startPodLockCountdown(pod:number){
    console.log('starigng pod lockdown for', pod)
    this.pod = pod
    this.podCountingDown = true

    this.clearTimeouts()

    this.podTimer = setTimeout(()=>{
      this.clearTimeouts()

      if(this.enteredPod){
        this.podLocked = true
        this.podCountingDown = false
        this.frozen = false
        this.room.state.gameManager.lockPod(this.pod, {name:this.name, userId:this.userId})
      }
    }, 1000 * this.podCountdown)

    this.podLockInterval = setInterval(()=>{
      this.podCountdown--
    }, 1000)
  }

  sendPlayerMessage(type:string, data:any){
    console.log('sending playing message', type,data)
    this.client.send(type,data)
  }

  setStats(stats:any[]){
    // console.log('player stats are ', stats)
    try{
     if(stats.length == 0){
       console.log('need to initialize stats')
       updatePlayerStatistic({
         PlayFabId: this.playFabData.PlayFabId,
         Statistics:defaultStats
       })
 
       stats = defaultStats
       this.playFabData.InfoResultPayload.PlayerStatistics = defaultStats
     }
 
     defaultStats.forEach((d:any)=>{
      // if(stats.filter((stat)=> stat.StatisticName === d.StatisticName).length > 0){
         this.stats.set(d.pKey, stats.filter((stat)=> stat.StatisticName === d.StatisticName)[0].Value)
      // }
     })
    }
    catch(e){
     console.log('error setting player stats', this.name)
    }
   }

  increaseValueInMap(map:any, key:any, incrementAmount:number) {
    if (map.has(key)) {
      const currentValue = map.get(key);
      const newValue = currentValue + incrementAmount;
      map.set(key, newValue);
    } else {
    }
  }

  clearPod(){
    this.clearTimeouts()
    this.resetPod()

    console.log('cleared pod', this.podCountdown)
  }

  reset(){
    this.resetPod()
  }

  resetPod(){
    this.podCountdown = 3
    this.podCountingDown = false
    this.podLocked = false
    this.pod = -500
    this.playing = false
  }

  clearTimeouts(resetPod?:boolean){
    clearTimeout(this.podTimer)
    clearInterval(this.podLockInterval)

    if(resetPod){
      this.resetPod()
    }
  }

  clearPlayer(){
    this.clearTimeouts()
  }

  async saveCache(){
    this.clearPlayer()
    if(DEBUG){
      return
    }
    
    await this.recordPlayerTime()
    await this.saveToDB()
  }

  async recordPlayerTime(){
    let now = Math.floor(Date.now()/1000)
    let time = now - this.startTime

    pushPlayfabEvent(
      SERVER_MESSAGE_TYPES.PLAYTIME, 
      this, 
      [{playtime: time}]
  )
  }

  async saveToDB(){
    // console.log('saving player updates to db', this.dclData.userId)
    // await this.saveSetttingsDB()

    let stats:any = []
    this.stats.forEach((stat,key)=>{
      stats.push({StatisticName:defaultStats.filter((stat)=> stat.pKey === key)[0].StatisticName, Value:stat})
    })

    try{
      const chunkSize = 10;
      const chunks = [];
      for (let i = 0; i < stats.length; i += chunkSize) {
        chunks.push(stats.slice(i, i + chunkSize));
      }
  
      chunks.forEach(async (chunk) => {
        await updatePlayerStatistic({
          PlayFabId: this.playFabData.PlayFabId,
          Statistics: chunk
        })
      });

      // let assets:any[] = []
      // this.assets.forEach((value,key)=>{
      //   assets.push(value)
      // })

      // const playerData:any = {
      //   "Settings":JSON.stringify(this.settings),
      //   "Scenes":JSON.stringify(assets)
      // }

      // console.log('player data to save is' ,playerData)
  
      // await updatePlayerData({
      //   PlayFabId: this.playFabData.PlayFabId,
      //   Data: playerData
      // })
    }
    catch(e){
      console.log('saving player info to db error ->', e)
    }
  }

}