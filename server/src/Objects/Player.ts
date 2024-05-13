import {MapSchema, Schema, type} from "@colyseus/schema";
import {Client} from "@colyseus/core";
import {SCENE_MODES, SERVER_MESSAGE_TYPES} from "../utils/types";
import {abortFileUploads, fetchPlayfabFile, fetchPlayfabMetadata, fetchUserMetaData, finalizeUploadFiles, initializeUploadPlayerFiles, playfabLogin, setTitleData, updatePlayerData, uploadPlayerFiles} from "../utils/Playfab";
import { GameRoom } from "../rooms/GameRoom";
import { pushPlayfabEvent } from "./PlayfabEvents";

export class Player extends Schema {
  @type("string") id:string;
  @type("string") address:string
  @type("string") name:string 
  @type("boolean") podCountingDown:boolean
  @type("number") podCountdown:number = 3
  @type("number") pod:number = -500

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

  scoreFactor:number = .5

  playing:boolean

  constructor(room:GameRoom, client:Client){
    super()
    this.room = room
    this.client = client

    this.playFabData = client.auth.playfab
    this.dclData = client.userData
    this.address = client.userData.userId
    this.name = client.userData.name
    this.ip = client.userData.ip

    this.startTime = Math.floor(Date.now()/1000)
  }

  startPodLockCountdown(pod:number){
    this.pod = pod
    this.podCountingDown = true

    this.clearTimeouts()

    this.podTimer = setTimeout(()=>{
      this.clearTimeouts()

      if(this.enteredPod){
        this.podLocked = true
        this.podCountingDown = false
        this.room.state.gameManager.lockPod(this.pod, this.dclData)
      }
    }, 1000 * this.podCountdown)

    // this.sendPlayerMessage(SERVER_MESSAGE_TYPES.POD_COUNTDOWN, this.podCountdown)

    this.podLockInterval = setInterval(()=>{
      this.podCountdown--
      // this.sendPlayerMessage(SERVER_MESSAGE_TYPES.POD_COUNTDOWN, this.podCountdown)
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
      //  console.log('need to initialize stats')
       // updatePlayerStatistic({
       //   PlayFabId: this.playFabData.PlayFabId,
       //   Statistics:initManager.pDefaultStats
       // })
 
      //  stats = initManager.pDefaultStats
      //  this.playFabData.InfoResultPayload.PlayerStatistics = initManager.pDefaultStats
     }
 
    //  initManager.pDefaultStats.forEach((d:any)=>{
    //   // if(stats.filter((stat)=> stat.StatisticName === d.StatisticName).length > 0){
    //      this.stats.set(d.pKey, stats.filter((stat)=> stat.StatisticName === d.StatisticName)[0].Value)
    //   // }
    //  })
    }
    catch(e){
     console.log('error setting player stats', this.dclData.name)
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
    await this.recordPlayerTime()
    await this.saveToDB()

    this.clearPlayer()
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
    // let stats:any = []
    // this.stats.forEach((stat,key)=>{
    //   stats.push({StatisticName:initManager.pDefaultStats.filter((stat)=> stat.pKey === key)[0].StatisticName, Value:stat})
    // })

    // try{
    //   // const chunkSize = 10;
    //   // const chunks = [];
    //   // for (let i = 0; i < stats.length; i += chunkSize) {
    //   //   chunks.push(stats.slice(i, i + chunkSize));
    //   // }
  
    //   // chunks.forEach(async (chunk) => {
    //   //   await updatePlayerStatistic({
    //   //     PlayFabId: this.playFabData.PlayFabId,
    //   //     Statistics: chunk
    //   //   })
    //   // });

    //   let assets:any[] = []
    //   this.assets.forEach((value,key)=>{
    //     assets.push(value)
    //   })

    //   const playerData:any = {
    //     "Settings":JSON.stringify(this.settings),
    //     "Scenes":JSON.stringify(assets)
    //   }

    //   console.log('player data to save is' ,playerData)
  
    //   await updatePlayerData({
    //     PlayFabId: this.playFabData.PlayFabId,
    //     Data: playerData
    //   })
    // }
    // catch(e){
    //   console.log('saving player info to db error ->', e)
    // }
  }

}