import { Entity, MeshRenderer, TextAlignMode, TextShape, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { sendServerMessage } from "./server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { alphabet } from "../helpers/resources"

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

    let names:any[] = []
    let scores:any[] = []
    let yFactor:number = 5

    let item = engine.addEntity()
    Transform.create(item, {position: Vector3.create(0, yFactor, 0), parent: parent})
    TextShape.create(item, {text: "" + name, shadowColor:Color4.White(), shadowOffsetX:10, shadowOffsetY:10, textColor:Color4.create(51/255, 204/255, 223/255), outlineColor:Color4.create(51/255, 204/255, 223/255), outlineWidth:.3})   
    VisibilityComponent.create(item, {visible: false})

    yFactor -= 1

    for(let i = 0; i < 10; i++){
        let name = engine.addEntity()
        Transform.create(name, {position: Vector3.create(-4, yFactor, 0),scale:Vector3.create(0.5,0.5,0.5), parent: parent})
        TextShape.create(name, {text: "Long Name Here" + i, textAlign:TextAlignMode.TAM_MIDDLE_LEFT, textColor:Color4.create(51/255, 204/255, 223/255), outlineColor:Color4.create(51/255, 204/255, 223/255), outlineWidth:.4})
        names.push(name)
        VisibilityComponent.create(name, {visible: false})

        let score = engine.addEntity()
        Transform.create(score, {position: Vector3.create(2, yFactor, 0),scale:Vector3.create(0.5,0.5,0.5), parent: parent})
        TextShape.create(score, {text: "100000" + i, textColor:Color4.create(51/255, 204/255, 223/255), outlineColor:Color4.create(51/255, 204/255, 223/255), outlineWidth:.4})
        scores.push(score)
        VisibilityComponent.create(score, {visible: false})

        yFactor -= .8
    }

    leaderboardViews.set(name, {parent:parent, label:item, names:names, scores:scores})

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

    console.log('leaderboard is', leaderboard)

    VisibilityComponent.getMutable(leaderboardView.label).visible = false

    leaderboardView.names.forEach((name:any)=>{
        VisibilityComponent.getMutable(name).visible = false
    })

    leaderboardView.scores.forEach((name:any)=>{
        VisibilityComponent.getMutable(name).visible = false
    })
    
    if(leaderboardView && leaderboard){
        TextShape.getMutable(leaderboardView.label).text = "" + (leaderboardRefreshindex === 1 ? "MP " : "") + leaderboardKeys[leaderboardRefreshindex]
        VisibilityComponent.getMutable(leaderboardView.label).visible = true

        add3DText(leaderboardView.parent, (leaderboardRefreshindex === 1 ? "MP " : "") + leaderboardKeys[leaderboardRefreshindex], headerXStart, headerYStart, true)

        let yFactor = 4
        leaderboard.forEach((item:any, index:number)=>{
            if(item && item.DisplayName && item.StatValue){
                TextShape.getMutable(leaderboardView.names[index]).text = "" + item.DisplayName
                VisibilityComponent.getMutable(leaderboardView.names[index]).visible = true
    
    
                add3DText(leaderboardView.parent, item.DisplayName, -4, yFactor)
                add3DText(leaderboardView.parent, "" + item.StatValue, 2, yFactor)
                
    
                TextShape.getMutable(leaderboardView.scores[index]).text = "" + item.StatValue
                VisibilityComponent.getMutable(leaderboardView.scores[index]).visible = true
    
                yFactor -= 0.8
            }
        })
    }
}


function add3DText(parent:Entity, text:string, xStart:number, yStart:number, center?:boolean){
    let digits = text.toLowerCase().split('')

    let offset = xStart
    if(center){
        let size = 0.3 * digits.length
        let middle = digits.length / 2
        offset -= middle * 0.3

        console.log('size is', size)
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
                MeshRenderer.setBox(ent)
                Transform.create(ent, {parent:parent, scale:Vector3.create(.2,.2,.2), position: Vector3.create(offset, yStart, 0)})
                offset += .3
                leaderboardEntities.push(ent)
            }
        }
    })
}