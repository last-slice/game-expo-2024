import { Schema, MapSchema,ArraySchema, type } from "@colyseus/schema";
import { Player } from "../../Objects/Player";
import { RoomHandler } from "../handlers/RoomHandler";
import { GameManager } from "../../Objects/GameManager";
import { TargetSystem } from "../../Objects/TargetSystem";

let initialPositions:any[] = [
  {x:19.8, y:28, z:41.1},
  {x:27.1, y:28, z:46.1},
  {x:36.6, y:28, z:45.9},
  {x:43.5, y:28, z:40.5},
  {x:43.7, y:28, z:23},
  {x:36.55, y:28, z:18.3},
  {x:27, y:28, z:18},
  {x:20, y:28, z:23},
]

export class GameTarget extends Schema{
  @type("number") id:number
  @type("number") x:number = 0
  @type("number") y:number = 0
  @type("number") z:number = 0
  @type("number") targetTick:number = -500

  resetTarget(){
    this.x = 0
    this.y = 0
    this.z = 0
    this.targetTick = 0
  }

  setInitialPosition(id:number){
    let pos = initialPositions[id]
    this.x = pos.x
    this.y = pos.y + 2
    this.z = pos.z
    this.targetTick = -500
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
  @type(GameTarget) target: GameTarget = new GameTarget()
  @type(GameRacerObject) racingObject: GameRacerObject = new GameRacerObject()
  targetSystem:TargetSystem = new TargetSystem()

  resetPod(){
    this.name = ""
    this.id = ""
    this.score = 0
    this.locked = false
    this.target.resetTarget()
    this.racingObject.resetObject()
    this.targetSystem.clearTimers()
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

  handler: RoomHandler
  gameManager: GameManager
}