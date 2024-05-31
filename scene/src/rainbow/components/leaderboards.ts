import { Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { sendServerMessage } from "./server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { add3DText, clear3DText } from "../helpers/functions"

export let leaderboardViews:Map<string, any> = new Map()
export let selectedBoard:string = "High Score"

let leaderboardRefreshTime:number = 10
let leaderboardRefreshindex:number = 0
let leaderboardKeys:any[] = ["Score", "Wins", "Pigs Flown"]
let leaderboards:Map<string, any> = new Map()
let leaderboardEntities:any[] = []
let headerXStart:number = 0
let headerYStart:number = 5

export function createLeaderboard(name:string){
    let parent = engine.addEntity()
    Transform.create(parent, {position: Vector3.create(20.3, 7.5, 43), rotation: Quaternion.fromEulerDegrees(0, 315,0)})

    leaderboardViews.set(name, {parent:parent})

    utils.timers.setInterval(()=>{
        leaderboardRefreshindex++
        if(leaderboardRefreshindex >= leaderboardKeys.length){
            leaderboardRefreshindex = 0
        }
        sendServerMessage(SERVER_MESSAGE_TYPES.LEADERBOARDS_UPDATES, {})
    }, 1000 * leaderboardRefreshTime)
    sendServerMessage(SERVER_MESSAGE_TYPES.LEADERBOARDS_UPDATES, {})
}

export function updateLeaderboards(boards:any){
    for(let name in boards){
        let board = boards[name]
        leaderboards.set(name, board)
    }

    clear3DText(leaderboardEntities)

    updateVisibleBoard()
}

export function updateVisibleBoard(){
    let leaderboardView = leaderboardViews.get('leaderboard')
    let leaderboard = leaderboards.get(leaderboardKeys[leaderboardRefreshindex])
    
    if(leaderboardView && leaderboard){
        add3DText(leaderboardEntities, leaderboardView.parent, (leaderboardRefreshindex === 1 ? "MP " : "") + leaderboardKeys[leaderboardRefreshindex], headerXStart, headerYStart, true)

        let yFactor = 4
        leaderboard.forEach(async (item:any, index:number)=>{
            if(item && item.DisplayName && item.StatValue){
                add3DText(leaderboardEntities,leaderboardView.parent, item.DisplayName, -4, yFactor)
                add3DText(leaderboardEntities,leaderboardView.parent, "" + item.StatValue, 1.5, yFactor)
                yFactor -= 0.8
            }
        })
    }
}