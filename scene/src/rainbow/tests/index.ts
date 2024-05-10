import { engine, MeshRenderer, MeshCollider, Transform, pointerEventsSystem, InputAction, Material } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { advanceObject, racingObjects } from "../components/objects"
import { endGame, resetGame } from "../components/game"


let timer:any
let counter:number = 0
let started = false
export function createTests(){
    let testobject = engine.addEntity()
    MeshRenderer.setPlane(testobject)
    MeshCollider.setPlane(testobject)
    Transform.create(testobject, {position: Vector3.create(26, 32, 18), rotation:Quaternion.fromEulerDegrees(0,0,0)})
    // addBuilderHUDAsset(testobject, "test")
    Material.setPbrMaterial(testobject, {albedoColor: Color4.Green()})

    pointerEventsSystem.onPointerDown({entity:testobject,
        opts:{hoverText:"Run Test", button:InputAction.IA_POINTER, maxDistance:20}
    },()=>{
        if(started){
            return
        }
        started = true

        counter = 0
        timer = utils.timers.setInterval(()=>{
            if(counter >= 223){
                utils.timers.clearInterval(timer)
                timer = utils.timers.setTimeout(()=>{
                    utils.timers.clearTimeout(timer)
                    utils.timers.clearInterval(timer)
                    resetGame(true)
                    started = false
                }, 1000 * 3)
            }else{
                counter += 5
                racingObjects.forEach((object, index:number)=>{
                    advanceObject(index, 5)
                    console.log('counter is now', counter)
                })
            }
        }, 300)
    })

    // let end = engine.addEntity()
    // MeshRenderer.setPlane(end)
    // MeshCollider.setPlane(end)
    // Transform.create(end, {position: Vector3.create(28, 32, 18), rotation:Quaternion.fromEulerDegrees(0,0,0)})
    // // addBuilderHUDAsset(testobject, "test")
    // Material.setPbrMaterial(end, {albedoColor: Color4.Red()})

    // pointerEventsSystem.onPointerDown({entity:end,
    //     opts:{hoverText:"Reset Test", button:InputAction.IA_POINTER, maxDistance:20}
    // },()=>{
    //     utils.timers.clearInterval(timer)
    // })
}