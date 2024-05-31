import { Entity, GltfContainer, MeshRenderer, TextAlignMode, TextShape, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { sendServerMessage } from "./server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import resources, { alphabet } from "../helpers/resources"

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

    leaderboardEntities.forEach((entity)=>{
        engine.removeEntity(entity)
    })
    leaderboardEntities.length = 0

    updateVisibleBoard()
}

export function updateVisibleBoard(){
    console.log('visible board is', leaderboardKeys[leaderboardRefreshindex])
    let leaderboardView = leaderboardViews.get('leaderboard')
    let leaderboard = leaderboards.get(leaderboardKeys[leaderboardRefreshindex])
    
    if(leaderboardView && leaderboard){
        add3DText(leaderboardView.parent, (leaderboardRefreshindex === 1 ? "MP " : "") + leaderboardKeys[leaderboardRefreshindex], headerXStart, headerYStart, true)

        let yFactor = 4
        leaderboard.forEach((item:any, index:number)=>{
            if(item && item.DisplayName && item.StatValue){
                add3DText(leaderboardView.parent, item.DisplayName, -4, yFactor)
                add3DText(leaderboardView.parent, "" + item.StatValue, 2, yFactor)
                yFactor -= 0.8
            }
        })
    }
}


function add3DText(parent:Entity, text:string, xStart:number, yStart:number, center?:boolean){
    let digits = text.toLowerCase().split('')

    let offset = xStart
    if(center){
        let middle = digits.length / 2
        offset -= middle * 0.4

        console.log('middle is', middle)
        console.log('offset is', offset)
    }

    digits.forEach((digit:string, index:number)=>{
        if(digit === " "){
            offset += .3
        }else{
            let letterIndex = alphabet.findIndex(letter => letter === digit)
            if(letterIndex >= 0){
                let ent = engine.addEntity()
                // MeshRenderer.setBox(ent)
                GltfContainer.create(ent, {src: resources.models.directory + "alphaNum/" + alphabet[letterIndex] + ".glb"})
                Transform.create(ent, {parent:parent, scale:Vector3.create(1,1,1), position: Vector3.create(offset, yStart, 0), rotation:Quaternion.fromEulerDegrees(0,180,0)})
                offset += .4
                leaderboardEntities.push(ent)
            }
        }
    })
}