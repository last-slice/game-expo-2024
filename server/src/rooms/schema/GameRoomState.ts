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
  @type("number") ry:number
  @type("number") targetTick:number = -500
  @type("number") multiplier:number
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
    this.ry = getRandomIntInclusive(0, 360)
  }

  startCountdown(time:number){
    this.movementCountdown = setTimeout(()=>{
      this.startDelete()
    }, 1000 * time)
  }

  startDelete(){
    this.enabled = false
    this.clearTimers()
    this.targetSystem.deleteTarget(this.id)
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
    this.rz = 0
    this.targetTick = -500
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
  @type("number") index:number
  @type("boolean") locked:boolean = false
  @type("number") stage:number = 1
  @type("number") score:number = 0
  @type("number") factor:number = .1
  @type(GameRacerObject) racingObject: GameRacerObject = new GameRacerObject()

  pigsFlown:number = 0
  targetsHit:number = 0

  resetPod(){
    this.name = ""
    this.id = ""
    this.score = 0
    this.stage = 1
    this.factor = .1
    this.locked = false
    this.racingObject.resetObject()
    this.pigsFlown = 0
    this.targetsHit = 0
  }
}

export class GameRoomState extends Schema {
  @type("string") world:string
  @type("number") gameCountdown:number
  @type("boolean") startingSoon:boolean = false
  @type("boolean") started:boolean = false
  @type("boolean") ended:boolean = false
  @type("boolean") reset:boolean = false
  @type("boolean") frozen:boolean = false
  @type("string") winner:string = ""
  @type("string") winnerId:string = ""

  @type([GamePod]) pods = new ArraySchema<GamePod>();
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([GameTarget]) targets = new ArraySchema<GameTarget>();

  handler: RoomHandler
  gameManager: GameManager
}