import { Billboard, BillboardMode, EasingFunction, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, TextShape, Transform, Tween, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { maxPlayers } from "./game"
import { Color4, Vector3, Quaternion } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { gameRoom, sendServerMessage } from "./server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { localPlayer } from "./player"
import { log } from "../helpers/functions"
import { createObjects } from "./objects"
import resources from "../helpers/resources"

const spacing:number = 2
const zPosition:number = 24
let xPosition:number = 39

let sceneYPosition:number = 27

// utils.triggers.enableDebugDraw(true)

export let activationPods:any[] = []
export let sceneParent:Entity
let ground:Entity

export function createEnvironment(){
    createBase()
    createObjects()
    createsStartPods()
}

function createBase(){
    sceneParent = engine.addEntity()
    Transform.create(sceneParent, {position: Vector3.create(0,sceneYPosition,0)})

    sceneYPosition > 0 ? createElevator() : null
    createGround()
    createWalls()
}

function createElevator(){
    // let cylinder = engine.addEntity()
    // MeshRenderer.setCylinder(cylinder)
    // Transform.create(cylinder, {position:Vector3.create(32,15,32), scale: Vector3.create(3, 30, 3)})
    // Material.setPbrMaterial(cylinder, {albedoColor: Color4.create(1,0,1,.5)})

    let elevator = engine.addEntity()
    MeshCollider.setPlane(elevator)
    MeshRenderer.setPlane(elevator)
    Transform.create(elevator, {position: Vector3.create(32,0,32), scale: Vector3.create(7,7,1), rotation: Quaternion.fromEulerDegrees(90,0,0)})


    utils.triggers.addTrigger(
        elevator, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 0, z: -1.5}, scale:{x:3, y:3,z:3}}],

        ()=>{
            // MeshCollider.deleteFrom(ground)
            Tween.createOrReplace(elevator, {
                mode: Tween.Mode.Move({
                  start: Vector3.create(32,0,32),
                  end: Vector3.create(32,27,32),
                }),
                duration: 3000,
                easingFunction: EasingFunction.EF_EASEOUTQUAD,
              })
        },
        ()=>{
            // MeshCollider.setPlane(ground)a
            Tween.deleteFrom(elevator)
            utils.timers.setTimeout(()=>{
                Transform.getMutable(elevator).position = Vector3.create(32,0,32)
            }, 1000 * 2)
        }, Color4.Teal()
    )
}

function createGround(){
    // let floor = engine.addEntity()
    // MeshRenderer.setPlane(floor)
    // Transform.create(floor, {position: Vector3.create(32,0,32), scale:Vector3.create(64,64,1), rotation: Quaternion.fromEulerDegrees(90,0,0)})
    // Material.setPbrMaterial(floor, {albedoColor: Color4.create(1,0,1,.5)})//

    // ground = engine.addEntity()
    // MeshRenderer.setPlane(ground)
    // Transform.create(ground, {position: Vector3.create(32,0,32), scale:Vector3.create(64,64,1), rotation: Quaternion.fromEulerDegrees(90,0,0), parent:sceneParent})


    let building = engine.addEntity()
    GltfContainer.create(building, {src: "models/rainbow-2.glb"})// resources.models.directory + resources.models.base})
    Transform.create(building, {position: Vector3.create(32,0,32), scale:Vector3.create(1,1,1), rotation: Quaternion.fromEulerDegrees(0,0,0)})


}

function createWalls(){
  // let top = engine.addEntity()
    // MeshRenderer.setPlane(top)
    // MeshCollider.setPlane(top)
    // Transform.create(top, {position: Vector3.create(32,64,32), scale:Vector3.create(64,64,1), rotation: Quaternion.fromEulerDegrees(90,0,0), parent:sceneParent})

    // let left = engine.addEntity()
    // MeshRenderer.setPlane(left)
    // MeshCollider.setPlane(left)
    // Transform.create(left, {position: Vector3.create(0,32,32), scale:Vector3.create(64,64,1), rotation: Quaternion.fromEulerDegrees(0,90,0)})

    // let right = engine.addEntity()
    // MeshRenderer.setPlane(right)
    // MeshCollider.setPlane(right)
    // Transform.create(right, {position: Vector3.create(64,32,32), scale:Vector3.create(64,64,1), rotation: Quaternion.fromEulerDegrees(0,90,0)})

    // let front = engine.addEntity()
    // MeshRenderer.setPlane(front)
    // MeshCollider.setPlane(front)
    // Transform.create(front, {position: Vector3.create(32,32,64), scale:Vector3.create(64,64,1), rotation: Quaternion.fromEulerDegrees(0,0,0)})


    // let back = engine.addEntity()
    // MeshRenderer.setPlane(back)
    // MeshCollider.setPlane(back)
    // Transform.create(back, {position: Vector3.create(32,32,64), scale:Vector3.create(64,64,1), rotation: Quaternion.fromEulerDegrees(0,90,0)})

}

function createsStartPods(){
    for(let i = 0; i < maxPlayers; i++){
        let pod = engine.addEntity()
        Transform.create(pod, {position: Vector3.create(xPosition, 0, zPosition), parent:sceneParent})

        let podModel = engine.addEntity()
        Transform.create(podModel, {parent:pod, scale:Vector3.create(1,.1,1)})
        MeshRenderer.setBox(podModel)
        xPosition -= spacing

        utils.triggers.addTrigger(
            pod, utils.NO_LAYERS, utils.LAYER_1,
            [{type: 'box', position: {x: 0, y: 2, z: 0}, scale:{x:1, y:4,z:1 }}],

            ()=>{
                if(gameRoom){
                    if(!gameRoom.state.started){
                        if(!gameRoom.state.pods[i].locked){
                            sendServerMessage(SERVER_MESSAGE_TYPES.ENTERED_POD, {pod:i})
                        }else{
                            console.log('pod occupied')
                        }
                    }else{
                        console.log('game not started')
                    }
                }
            },
            ()=>{
                if(gameRoom && !gameRoom.state.started){
                    sendServerMessage(SERVER_MESSAGE_TYPES.EXIT_POD, {pod:i})
                }
            }, Color4.Teal()
        )

        let lockedEntity = engine.addEntity()
        Transform.create(lockedEntity, {position: Vector3.create(0, 2,0), parent:pod})
        VisibilityComponent.createOrReplace(lockedEntity, {visible:false})

        let lockedModel = engine.addEntity()
        Transform.create(lockedModel, {position: Vector3.create(0, 0,0), parent:lockedEntity, scale: Vector3.create(1,4,1)})
        MeshRenderer.setBox(lockedModel)
        Material.setPbrMaterial(lockedModel, {albedoColor: Color4.create(1,0,0,.5)})
        VisibilityComponent.createOrReplace(lockedModel, {visible:false})

        let nameEntity = engine.addEntity()
        Transform.create(nameEntity, {position: Vector3.create(0,3,0), parent:pod})
        TextShape.createOrReplace(nameEntity, {text:"Name " + i, fontSize:3})
        VisibilityComponent.createOrReplace(nameEntity, {visible:false})
        Billboard.create(nameEntity, {billboardMode: BillboardMode.BM_Y})

        activationPods.push({pod:pod, nameEntity:nameEntity, lockedEntity:lockedEntity, lockedModel:lockedModel})
    }
}