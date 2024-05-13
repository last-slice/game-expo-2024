import { Billboard, BillboardMode, ColliderLayer, EasingFunction, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, TextShape, Transform, Tween, TweenLoop, TweenSequence, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Color4, Vector3, Quaternion } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { gameRoom, sendServerMessage } from "./server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { localPlayer } from "./player"
import { getRandomIntInclusive, log } from "../helpers/functions"
import { createObjects } from "./objects"
import resources, { colors } from "../helpers/resources"
import { podPositions } from "./game"
import { addPigTrainSystem, removePigTrainSystem } from "../systems/PigTrain"
import { addBuilderHUDAsset } from "../../dcl-builder-hud"
import { enableBuilderHUD } from "../../dcl-builder-hud/ui/builderpanel"

export const PigTrainComponent = engine.defineComponent("game::expo::pig::train::component", {})


const spacing:number = 2
const zPosition:number = 24
let xPosition:number = 39
let ground:Entity

export let sceneYPosition:number = 27
export let activationPods:any[] = []
export let sceneParent:Entity

// utils.triggers.enableDebugDraw(true)

const rainbowTransforms = [
    { position: Vector3.create(32, 6.75, 62), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25)},
    { position: Vector3.create(3, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.5) },
    { position: Vector3.create(32, 6.75, 2), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(62, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(32, 53, 32), rotation: Vector3.create(0, 0, 0), scale: Vector3.One() }
]

const carouselPositions = [
    Vector3.create(14, 1, 14),
    Vector3.create(50, 1, 50),
    Vector3.create(14, 1, 50),
    Vector3.create(50, 1, 14)
];

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
    createCarousels()
    createRainbows()

    addPigTrainSystem()
}

function createElevator(){
    let elevator = engine.addEntity()
    MeshCollider.setCylinder(elevator)
    MeshRenderer.setCylinder(elevator)
    Transform.create(elevator, {position: Vector3.create(32,1,51), scale: Vector3.create(10,.1,10), rotation: Quaternion.fromEulerDegrees(0,0,0)})


    utils.triggers.addTrigger(
        elevator, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 0, z: -1.5}, scale:{x:3, y:5,z:3}}],

        ()=>{
            MeshCollider.deleteFrom(ground)
            Tween.createOrReplace(elevator, {
                mode: Tween.Mode.Move({
                  start: Vector3.create(32,0,51),
                  end: Vector3.create(32,27,51),
                }),
                duration: 4000,
                easingFunction: EasingFunction.EF_EASEOUTQUAD,
              })
        },
        ()=>{
            MeshCollider.setPlane(ground)
            Tween.deleteFrom(elevator)
            utils.timers.setTimeout(()=>{
                Transform.getMutable(elevator).position = Vector3.create(32,0,51)
            }, 1000 * 2)
        }, Color4.Teal()
    )
}

function createGround(){
const sceneEntity = engine.addEntity()
    GltfContainer.create(sceneEntity, {
        src: resources.models.directory + resources.models.base,
        visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
    })
    Transform.create(sceneEntity, {
        position: Vector3.create(32, 0, 32)
    })

    utils.triggers.addTrigger(
        sceneEntity, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 40, z: 0}, scale:{x:64, y:60,z:64}}],

        ()=>{
            removePigTrainSystem()
        },
        ()=>{
            addPigTrainSystem()
        }, Color4.Teal()
    )
}

function createsStartPods(){
    enableBuilderHUD(true)
    for(let i = 0; i < podPositions.length; i++){
        let pod = engine.addEntity()
        let pos = podPositions[i]
        Transform.create(pod, {position: Vector3.create(pos.x, 0, pos.z), parent:sceneParent})
        addBuilderHUDAsset(pod, 'pod-' + i)

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
        Transform.create(lockedModel, {position: Vector3.create(0, -2,0), parent:lockedEntity, scale: Vector3.create(1,0,1)})
        MeshRenderer.setCylinder(lockedModel)
        Material.setPbrMaterial(lockedModel, {albedoColor: colors[i]})

        let nameEntity = engine.addEntity()
        Transform.create(nameEntity, {position: Vector3.create(0,3,0), parent:pod})
        TextShape.createOrReplace(nameEntity, {text:"Name " + i, fontSize:3})
        VisibilityComponent.createOrReplace(nameEntity, {visible:false})
        Billboard.create(nameEntity, {billboardMode: BillboardMode.BM_Y})

        activationPods.push({pod:pod, nameEntity:nameEntity, lockedEntity:lockedEntity, lockedModel:lockedModel})
    }
}

function createCarousels(){
    carouselPositions.forEach(position => {
        const carouselEntity = engine.addEntity();
        GltfContainer.create(carouselEntity, {
            src: resources.models.directory + resources.models.carousel,
            visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
        });
        Transform.create(carouselEntity, {
            position: position,
            scale: Vector3.create(1.2, 1.2, 1.2)
        });

        Tween.create(carouselEntity, {
            mode: Tween.Mode.Rotate({
              start: Quaternion.fromEulerDegrees(0, 0, 0),
              end: Quaternion.fromEulerDegrees(0, 180, 0)
            }),
            duration: 10000,
            easingFunction: EasingFunction.EF_LINEAR
          })
          TweenSequence.create(carouselEntity, {
            loop: TweenLoop.TL_RESTART,
            sequence: [
              {
                mode: Tween.Mode.Rotate({
                  start: Quaternion.fromEulerDegrees(0, 180, 0),
                  end: Quaternion.fromEulerDegrees(0, 360, 0)
                }),
                duration: 10000,
                easingFunction: EasingFunction.EF_LINEAR
              }
            ]
          })
    });
}

function createRainbows(){
    rainbowTransforms.forEach(({ position, rotation, scale }) => {
        const rainbowEntity = engine.addEntity();
        GltfContainer.create(rainbowEntity, {
            src: resources.models.directory + resources.models.rainbow, 
            visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
        })
        Transform.create(rainbowEntity, {
            position: position, 
            rotation: Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z),
            scale: scale
        })
    })
}

export function createPigTrain(){
    let random = getRandomIntInclusive(0,resources.models.pigs.length-1)//

    let parent = engine.addEntity()
    Transform.create(parent, {position: Vector3.create(32, 1, 0)})

    let pig = engine.addEntity()
    Transform.create(pig, {position: Vector3.create(0, 0, 0), scale: Vector3.create(0.5, 0.5, 0.5), parent:parent})
    GltfContainer.create(pig, {src: resources.models.directory + resources.models.pigDirectory + resources.models.pigs[random]})

    Tween.create(parent, {
        mode: Tween.Mode.Move({
          start: Vector3.create(32, 1, 0),
          end: Vector3.create(32, 1, 44),
        }),
        duration: 1000 * 7,
        easingFunction: EasingFunction.EF_LINEAR,
      })

      Tween.create(pig, {
        mode: Tween.Mode.Move({
          start: Vector3.create(0, .5, 0),
          end: Vector3.create(0 -.5, 0),
        }),
        duration: 500,
        easingFunction: EasingFunction.EF_LINEAR,
      })
      TweenSequence.create(pig, { sequence: [], loop: TweenLoop.TL_YOYO })


      PigTrainComponent.createOrReplace(parent)
}

export function resetPodLock(index:number){
    console.log('resetting pod', index)
    let pod = activationPods[index]
    if(pod && pod.lockedModel){
        VisibilityComponent.createOrReplace(pod.lockedModel, {visible:false})
        console.log('pod to reset is found')
        if(Tween.has(pod.lockedModel)){
            console.log('found pod lock tweent')
            let tween = Tween.getMutable(pod.lockedModel)
            tween.playing = false
            Tween.deleteFrom(pod.lockedModel)
        }
            
        let transform = Transform.getMutableOrNull(pod.lockedModel)
        if(transform){
            console.log('found transform pod to reset')
            transform.position = Vector3.create(0,-2,0)
            transform.scale = Vector3.create(1,0,1)
        }
    }
}

export function expandPodLock(index:number, amount:number){
    let pod = activationPods[index]
    if(pod && pod.lockedModel){
        VisibilityComponent.createOrReplace(pod.lockedModel, {visible:true})
        if(!Tween.has(pod.lockedModel)){
            Tween.createOrReplace(pod.lockedModel, {
                mode: Tween.Mode.Scale({
                  start: Vector3.create(1, 0,1),
                  end: Vector3.create(1, 7, 1),
                }),
                duration: 1000 * 2,
                easingFunction: EasingFunction.EF_LINEAR,
              })
        }
    }

    // transform.position = Vector3.create(0, -2,0)
    // transform.scale = Vector3.create(1,0,1)
}