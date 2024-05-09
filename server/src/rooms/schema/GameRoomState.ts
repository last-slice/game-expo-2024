import { Schema, MapSchema,ArraySchema, type } from "@colyseus/schema";
import { Player } from "../../Objects/Player";
import { RoomHandler } from "../handlers/RoomHandler";
import { GameManager } from "../../Objects/GameManager";
import { TargetSystem } from "../../Objects/TargetSystem";

let initialPositions:any[] = [
  {x:39, y:2, z:24 + 5},
  {x:37, y:2, z:24 + 5},
  {x:35, y:2, z:24 + 5},
  {x:33, y:2, z:24 + 5},
  {x:31, y:2, z:24 + 5},
  {x:29, y:2, z:24 + 5},
]

export class GameTarget extends Schema{
  @type("number") id:number
  @type("number") x:number = 0
  @type("number") y:number = 0
  @type("number") z:number = 0
  @type("number") targetTick:number = 0

  resetTarget(){
    this.x = 0
    this.y = 0
    this.z = 0
    this.targetTick = 0//
  }

  setInitialPosition(id:number){
    let pos = initialPositions[id]
    this.x = pos.x
    this.y = pos.y
    this.z = pos.z
    this.targetTick = 0
  }
}

export class GamePod extends Schema{
  @type("string") name:string
  @type("string") id:string
  @type("boolean") locked:boolean = false
  @type("number") score:number = 0
  @type(GameTarget) target: GameTarget = new GameTarget()
  targetSystem:TargetSystem = new TargetSystem()
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
