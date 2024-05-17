import { TextAlignMode, TextShape, Transform, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { addBuilderHUDAsset } from "../../dcl-builder-hud"
import { enableBuilderHUD } from "../../dcl-builder-hud/ui/builderpanel"


export let leaderboards:Map<string, any> = new Map()
export let selectedBoard:string = "High Score"

export function createLeaderboard(name:string){

    // enableBuilderHUD(true)

    let parent = engine.addEntity()
    Transform.create(parent, {position: Vector3.create(20.3, 7.5, 43), rotation: Quaternion.fromEulerDegrees(0, 315,0)})
    // VisibilityComponent.create(parent, {visible: false})

    let names:any[] = []
    let scores:any[] = []
    let yFactor:number = 5

    let item = engine.addEntity()
    Transform.create(item, {position: Vector3.create(0, yFactor, 0), parent: parent})
    TextShape.create(item, {text: "" + name})
    VisibilityComponent.create(item, {visible: true})

    yFactor -= 1

    for(let i = 0; i < 10; i++){
        let name = engine.addEntity()
        Transform.create(name, {position: Vector3.create(-4, yFactor, 0),scale:Vector3.create(0.5,0.5,0.5), parent: parent})
        TextShape.create(name, {text: "Long Name Here" + i, textAlign:TextAlignMode.TAM_MIDDLE_LEFT})
        names.push(name)
        VisibilityComponent.create(name, {visible: true})

        let score = engine.addEntity()
        Transform.create(score, {position: Vector3.create(2, yFactor, 0),scale:Vector3.create(0.5,0.5,0.5), parent: parent})
        TextShape.create(score, {text: "100000" + i})
        scores.push(score)
        VisibilityComponent.create(score, {visible: true})

        yFactor -= .8
    }
    addBuilderHUDAsset(parent, "" + name + "-leaderboard")

    leaderboards.set(name, {parent:parent, label:item, names:names, scores:scores})
    updateVisibleBoard()
}

function updateVisibleBoard(){
    leaderboards.forEach((board, key)=>{
        if(key !== selectedBoard){
            VisibilityComponent.getMutable(board.label).visible = false
        }

        board.names.forEach((name:any)=>{
            if(key !== selectedBoard){
                VisibilityComponent.getMutable(name).visible = false
            }
        })

        board.scores.forEach((score:any)=>{
            if(key !== selectedBoard){
                VisibilityComponent.getMutable(score).visible = false
            }
        })
    })
}