import { TextAlignMode, TextShape, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { sendServerMessage } from "./server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"

export let leaderboardViews:Map<string, any> = new Map()
export let selectedBoard:string = "High Score"

let leaderboardRefreshTime:number = 10
let leaderboardRefreshindex:number = 0
let leaderboardKeys:any[] = ["Score", "Wins", "Pigs Flown"]
let leaderboards:Map<string, any> = new Map()

export function createLeaderboard(name:string){
    let parent = engine.addEntity()
    Transform.create(parent, {position: Vector3.create(20.3, 7.5, 43), rotation: Quaternion.fromEulerDegrees(0, 315,0)})

    let names:any[] = []
    let scores:any[] = []
    let yFactor:number = 5

    let item = engine.addEntity()
    Transform.create(item, {position: Vector3.create(0, yFactor, 0), parent: parent})
    TextShape.create(item, {text: "" + name,  textColor:Color4.create(241/255, 31/255, 211/255), outlineColor:Color4.create(241/255, 31/255, 211/255), outlineWidth:.4})   
    VisibilityComponent.create(item, {visible: true})

    yFactor -= 1

    for(let i = 0; i < 10; i++){
        let name = engine.addEntity()
        Transform.create(name, {position: Vector3.create(-4, yFactor, 0),scale:Vector3.create(0.5,0.5,0.5), parent: parent})
        TextShape.create(name, {text: "Long Name Here" + i, textColor:Color4.create(241/255, 31/255, 211/255), textAlign:TextAlignMode.TAM_MIDDLE_LEFT, outlineColor:Color4.create(241/255, 31/255, 211/255), outlineWidth:.4})
        names.push(name)
        VisibilityComponent.create(name, {visible: true})

        let score = engine.addEntity()
        Transform.create(score, {position: Vector3.create(2, yFactor, 0),scale:Vector3.create(0.5,0.5,0.5), parent: parent})
        TextShape.create(score, {text: "100000" + i,  textColor:Color4.create(241/255, 31/255, 211/255), outlineColor:Color4.create(241/255, 31/255, 211/255), outlineWidth:.4})
        scores.push(score)
        VisibilityComponent.create(score, {visible: true})

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

        console.log('updated baord', name, board)

        leaderboards.set(name, board)
    }
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
        TextShape.getMutable(leaderboardView.label).text = "" + leaderboardKeys[leaderboardRefreshindex]
        VisibilityComponent.getMutable(leaderboardView.label).visible = true

        leaderboard.forEach((item:any, index:number)=>{
            TextShape.getMutable(leaderboardView.names[index]).text = "" + item.DisplayName
            VisibilityComponent.getMutable(leaderboardView.names[index]).visible = true

            TextShape.getMutable(leaderboardView.scores[index]).text = "" + item.StatValue
            VisibilityComponent.getMutable(leaderboardView.scores[index]).visible = true
        })
    }
}