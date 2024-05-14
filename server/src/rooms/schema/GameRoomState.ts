import { Schema, MapSchema,ArraySchema, type } from "@colyseus/schema";
import { Player } from "../../Objects/Player";
import { RoomHandler } from "../handlers/RoomHandler";
import { GameManager } from "../../Objects/GameManager";
import { getRandomIntInclusive } from "../../utils/functions";
import { generateId } from "colyseus";
import { TargetSystem } from "../../Objects/GameTargetSystem";
import { SERVER_MESSAGE_TYPES } from "../../utils/types";

let xMin:number = 20
let xMax:number = 44

let yMin:number = 29
let yMax:number = 50

let zMin:number = 55
let zMax:number = 10

export class GameTarget extends Schema{
  @type("string") id:string
  @type("number") x:number
  @type("number") y:number
  @type("number") z:number
  @type("number") targetTick:number = -500
  @type("number") multiplier:number = 1
  @type("boolean") move:boolean = false
  @type("boolean") enabled:boolean = false

  targetSystem:TargetSystem

  movementCountdownBase:number = 5
  movementCountdownRange:any[] = [3, 8]
  movementCountdown:any

  constructor(targetSystem:TargetSystem, multiplier:number, shouldMove:boolean){
    super()
    this.id = generateId(5)

    this.targetSystem = targetSystem
    this.multiplier = multiplier
    this.move = shouldMove
    this.enabled = true

    this.chooseNewLocation()
    shouldMove ? this.startCountdown(this.movementCountdownBase) : null
  }

  async chooseNewLocation(){
    this.x = getRandomIntInclusive(xMin, xMax)
    this.y = getRandomIntInclusive(yMin, yMax)
    this.z = getRandomIntInclusive(zMin, zMax)
  }

  startCountdown(time:number){
    this.movementCountdown = setTimeout(()=>{
      this.clearTimers()
      this.startDelete()
    }, 1000 * time)
  }

  startDelete(){
    this.enabled = false
    this.targetSystem.room.broadcast(SERVER_MESSAGE_TYPES.EXPLODE_TARGET, {id: this.id})
    this.movementCountdown = setTimeout(()=>{
      this.clearTimers()
      this.targetSystem.deleteTarget(this.id)
    }, 1000)
  }


  clearTimers(){
    clearTimeout(this.movementCountdown)
  } 

  resetTarget(){
    this.x = 0
    this.y = 0
    this.z = 0
    this.targetTick = 0
  }
}

export class GameRacerObject extends Schema{
  @type("number") id:number
  @type("number") y:number = -22
  @type("number") rz:number = 0
  @type("number") targetTick:number = -500

  resetObject(){
    this.y = -22
    this.rz = 360
    this.targetTick = 0
  }

  setInitialPosition(id:number){
    this.y = -22
    this.rz  = 0
    this.targetTick = -500
  }
}

export class GamePod extends Schema{
  @type("string") name:string
  @type("string") id:string
  @type("boolean") locked:boolean = false
  @type("number") stage:number = 1
  @type("number") score:number = 0
  @type("number") factor:number = .1
  @type(GameRacerObject) racingObject: GameRacerObject = new GameRacerObject()

  resetPod(){
    console.log('resetting pod')
    this.name = ""
    this.id = ""
    this.score = 0
    this.factor = .1
    this.locked = false
    this.racingObject.resetObject()
  }
}

export class GameRoomState extends Schema {
  @type("string") world:string
  @type("number") gameCountdown:number
  @type("boolean") startingSoon:boolean = false
  @type("boolean") started:boolean = false
  @type("boolean") ended:boolean = false
  @type("boolean") reset:boolean = false
  @type("string") winner:string = ""

  @type([GamePod]) pods = new ArraySchema<GamePod>();
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([GameTarget]) targets = new ArraySchema<GameTarget>();

  handler: RoomHandler
  gameManager: GameManager
}