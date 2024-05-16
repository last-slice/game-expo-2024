import { Animator, Billboard, BillboardMode, ColliderLayer, EasingFunction, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, Schemas, TextShape, Transform, Tween, TweenLoop, TweenSequence, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Color4, Vector3, Quaternion } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { gameRoom, sendServerMessage } from "./server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { getRandomIntInclusive } from "../helpers/functions"
import { createObjects } from "./objects"
import resources, { colors } from "../helpers/resources"
import { podPositions } from "./game"
import { addPigTrainSystem, removePigTrainSystem } from "../systems/PigTrain"
import { createSound, startAudioFader } from "./sounds"
import { createRandomLightShows } from "../systems/Lightshow"
import { stopAllGroundRainbows, turnOffAllGroundRainbows } from "./animations"
import { activeLightShows } from "./lightshow"
import { createLeaderboard } from "./leaderboards"

export const PigTrainComponent = engine.defineComponent("game::expo::pig::train::component", {})

export const GroundRainbowComponent = engine.defineComponent("game::expo::ground::rainbow::component", {
    time:Schemas.Number
})

const spacing:number = 2
const zPosition:number = 24
let xPosition:number = 39
let ground:Entity


export let sceneYPosition:number = 27
export let activationPods:any[] = []
export let sceneParent:Entity

export let onGround:boolean = true
export let mainRainbow:Entity

const animatedCloud = 'models/cloudVerticalElevator.glb'
const sceneCenter = Vector3.create(32, 0, 32)

const animatedClouds = 'models/cloudHover.glb'

const rainbowTransforms = [
    { position: Vector3.create(32, 6.75, 62), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25)},
    { position: Vector3.create(3, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.5) },
    { position: Vector3.create(32, 6.75, 2), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(62, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
]

const carouselPositions = [
    Vector3.create(13, 1, 13),
    Vector3.create(51, 1, 51),
    Vector3.create(13, 1, 51),
    Vector3.create(51, 1, 13)
];

export async function createEnvironment(){
    await createBase()
    await createLeaderboard("High Score")
    await createLeaderboard("Fastest Time")
    await createSound()
    await createObjects()
    await createsStartPods()
}

function createBase(){
    sceneParent = engine.addEntity()
    Transform.create(sceneParent, {position: Vector3.create(0,sceneYPosition,0)})

    sceneYPosition > 0 ? createElevator() : null
    createGround()
    createCarousels()
    createRainbows()

    addPigTrainSystem()

    createClouds()
}

function createClouds(){
    const cloudEntity = engine.addEntity()
    GltfContainer.create(cloudEntity, {src: animatedCloud, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(cloudEntity, { position: sceneCenter})
    Animator.create(cloudEntity, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.1
            }
        ]
    })

    const cloudEntity2 = engine.addEntity()
    GltfContainer.create(cloudEntity2, {src: animatedCloud, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(cloudEntity2, { position: sceneCenter, rotation: Quaternion.fromEulerDegrees(0, 90, 0)})
    Animator.create(cloudEntity2, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.15
            }
        ]
    })

    const clouds1 = engine.addEntity()
    GltfContainer.create(clouds1, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(clouds1, {position: sceneCenter})
    Animator.create(clouds1, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.25
            }
        ]
    })
    const clouds2 = engine.addEntity()
    GltfContainer.create(clouds2, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(clouds2, {position: sceneCenter, rotation: Quaternion.fromEulerDegrees(0, 90, 0)})
    Animator.create(clouds2, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.1
            }
        ]
    })

    const clouds3 = engine.addEntity()
    GltfContainer.create(clouds3, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(clouds3, {position: sceneCenter, rotation: Quaternion.fromEulerDegrees(0, 180, 0)})
    Animator.create(clouds3, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.15
            }
        ]
    })

    const clouds4 = engine.addEntity()
    GltfContainer.create(clouds4, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(clouds4, {position: sceneCenter, rotation: Quaternion.fromEulerDegrees(0, 270, 0)})
    Animator.create(clouds4, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.05
            }
        ]
    })

    //elevator cloud
    const elevatorCloud = engine.addEntity()
    GltfContainer.create(elevatorCloud, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(elevatorCloud, {position: Vector3.create(40, 14, 30), rotation: Quaternion.fromEulerDegrees(0, 50, 0), scale: Vector3.create(0.8, 0.4, 0.6)})
    Animator.create(elevatorCloud, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.25
            }
        ]
    })



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

            //   startGroundAudioFader()//
        },
        ()=>{
            MeshCollider.setPlane(ground)
            Tween.deleteFrom(elevator)
            utils.timers.setTimeout(()=>{
                Transform.getMutable(elevator).position = Vector3.create(32,0,51)
            }, 1000 * 2)

            // endGroundAudioFader()
        }, Color4.Teal()
    )
}

function createGround(){
const sceneEntity = engine.addEntity()
    GltfContainer.create(sceneEntity, {
        src: resources.models.directory + resources.models.base,
        // visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
    })
    Transform.create(sceneEntity, {
        position: Vector3.create(32, 0, 32)
    })

    utils.triggers.addTrigger(
        sceneEntity, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 40, z: 0}, scale:{x:64, y:60,z:64}}],

        ()=>{
            onGround = false
            removePigTrainSystem()

            activeLightShows.clear()
            stopAllGroundRainbows()

            startAudioFader("sounds/playing_bg_loop.mp3", 0)//
        },
        ()=>{
            onGround = true
            console.log('left playing area')
            // playGroundSound()
            // endGroundAudioFader()//

            startAudioFader("sounds/ground_bg_loop.mp3", 1)
            addPigTrainSystem()

            turnOffAllGroundRainbows()

            for (const [entity] of engine.getEntitiesWith(GroundRainbowComponent)) {
                createRandomLightShows(entity)
            }


        }, Color4.Teal()
    )

    // create ground arrows
    const arrowModel = 'models/animatedArrow.glb'

    const arrow1 = engine.addEntity()
    GltfContainer.create(arrow1, {src: arrowModel})
    Transform.create(arrow1, {position: Vector3.create(32, 3, 52)})
    Animator.create(arrow1, {
        states: [
            {
                clip: 'play',
                playing: true,
                
            }
        ]
    })

    const arrow2 = engine.addEntity()
    GltfContainer.create(arrow2, {src: arrowModel})
    Transform.create(arrow2, {position: Vector3.create(32, 15, 52)})
    Animator.create(arrow2, {
        states: [
            {
                clip: 'play',
                playing: true,
                
            }
        ]
    })
}

function createsStartPods(){
    // enableBuilderHUD(true)
    for(let i = 0; i < podPositions.length; i++){
        let pod = engine.addEntity()
        let pos = podPositions[i]
        Transform.create(pod, {position: Vector3.create(pos.x, 0, pos.z), parent:sceneParent})
        // addBuilderHUDAsset(pod, 'pod-' + i)

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

       // activation pod animations:
       const yellowPod = engine.addEntity()
       GltfContainer.create(yellowPod, {src: 'models/activationPods/yellowPod.glb'})
       Transform.create(yellowPod, {position: sceneCenter})
       Animator.create(yellowPod, {states: [
           {
               clip: 'play',
               playing: true, 
               speed: 0.5
               
           }
       ]})

       const greenPod = engine.addEntity()
       GltfContainer.create(greenPod, {src: 'models/activationPods/greenPod.glb'})
       Transform.create(greenPod, {position: sceneCenter})
       Animator.create(greenPod, {states: [
           {
               clip: 'play',
               playing: true, 
               speed: 0.45
               
           }
       ]})


       const bluePod = engine.addEntity()
       GltfContainer.create(bluePod, {src: 'models/activationPods/bluePod.glb'})
       Transform.create(bluePod, {position: sceneCenter})
       Animator.create(bluePod, {states: [
           {
               clip: 'play',
               playing: true, 
               speed: 0.4
               
           }
       ]})

       const indigoPod = engine.addEntity()
       GltfContainer.create(indigoPod, {src: 'models/activationPods/indigoPod.glb'})
       Transform.create(indigoPod, {position: sceneCenter})
       Animator.create(indigoPod, {states: [
           {
               clip: 'play',
               playing: true, 
               speed: 0.35
               
           }
       ]})

       const violetPod = engine.addEntity()
       GltfContainer.create(violetPod, {src: 'models/activationPods/violetPod.glb'})
       Transform.create(violetPod, {position: sceneCenter})
       Animator.create(violetPod, {states: [
           {
               clip: 'play',
               playing: true, 
               speed: 0.3
               
           }
       ]})

       const pinkPod = engine.addEntity()
       GltfContainer.create(pinkPod, {src: 'models/activationPods/pinkPod.glb'})
       Transform.create(pinkPod, {position: sceneCenter})
       Animator.create(pinkPod, {states: [
           {
               clip: 'play',
               playing: true, 
               speed: 0.35
               
           }
       ]})

       const redPod = engine.addEntity()
       GltfContainer.create(redPod, {src: 'models/activationPods/redPod.glb'})
       Transform.create(redPod, {position: sceneCenter})
       Animator.create(redPod, {states: [
           {
               clip: 'play',
               playing: true, 
               speed: 0.4
               
           }
       ]})

       const orangePod = engine.addEntity()
       GltfContainer.create(orangePod, {src: 'models/activationPods/orangePod.glb'})
       Transform.create(orangePod, {position: sceneCenter})
       Animator.create(orangePod, {states: [
           {
               clip: 'play',
               playing: true, 
               speed: 0.45
               
           }
       ]})
}

function createCarousels(){


        //carousel clouds -- could we pull these out at game time for performance?
        const carouselCloud1 = engine.addEntity()
        GltfContainer.create(carouselCloud1, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
        Transform.create(carouselCloud1, {position: Vector3.create(13, -3, 5), rotation: Quaternion.fromEulerDegrees(0, 45, 0), scale: Vector3.create(0.25, 0.25, 0.25)})
        Animator.create(carouselCloud1, {
            states: [
                {
                    clip: 'play',
                    playing: true,
                    speed: 0.3
                }
            ]
        })

        const carouselCloud2 = engine.addEntity()
        GltfContainer.create(carouselCloud2, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
        Transform.create(carouselCloud2, {position: Vector3.create(58, -3, 52), rotation: Quaternion.fromEulerDegrees(0, -45, 0), scale: Vector3.create(0.25, 0.25, 0.25)})
        Animator.create(carouselCloud2, {
            states: [
                {
                    clip: 'play',
                    playing: true,
                    speed: 0.5
                }
            ]
        })
    
        const carouselCloud3 = engine.addEntity()
        GltfContainer.create(carouselCloud3, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
        Transform.create(carouselCloud3, {position: Vector3.create(8, -3, 46), rotation: Quaternion.fromEulerDegrees(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.25)})
        Animator.create(carouselCloud3, {
            states: [
                {
                    clip: 'play',
                    playing: true,
                    speed: 0.4
                }
            ]
        })

        const carouselCloud4 = engine.addEntity()
        GltfContainer.create(carouselCloud4, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
        Transform.create(carouselCloud4, {position: Vector3.create(56, -3, 18), rotation: Quaternion.fromEulerDegrees(0, -90, 0), scale: Vector3.create(0.25, 0.25, 0.25)})
        Animator.create(carouselCloud4, {
            states: [
                {
                    clip: 'play',
                    playing: true,
                    speed: 0.2
                }
            ]
        })
   
    
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
    mainRainbow = engine.addEntity();
    GltfContainer.create(mainRainbow, {
        src: resources.models.directory + resources.models.rainbow, 
        // visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
    })
    Transform.create(mainRainbow,{ position: Vector3.create(32, 53, 32)})
    addRainbowAnimations(mainRainbow)
    
    rainbowTransforms.forEach(({ position, rotation, scale }, i:number) => {
        const rainbowEntity = engine.addEntity();
        GltfContainer.create(rainbowEntity, {
            src: resources.models.directory + resources.models.rainbow, 
            // visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
        })
        Transform.create(rainbowEntity, {
            position: position, 
            rotation: Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z),
            scale: scale
        })

        addRainbowAnimations(rainbowEntity)
        GroundRainbowComponent.create(rainbowEntity, {time: getRandomIntInclusive(100, 300) / 1000})

        createRandomLightShows(rainbowEntity)
    })
}

function addRainbowAnimations(entity:Entity){
    Animator.create(entity, {
        states:[
            {clip:"RedOff", playing:true,  loop:true, weight:0.0555},
            {clip:"PinkOff",  playing:true,  loop:true, weight:0.0555},
            {clip:"VioletOff", playing:true,  loop:true,weight:0.0555 },
            {clip:"BlueOff",   playing:true,  loop:true, weight:0.0555},
            {clip:"IndigoOff", playing:true,  loop:true, weight:0.0555},
            {clip:"YellowOff",   playing:true,  loop:true, weight:0.0555},
            {clip:"OrangeOff",  playing:true,  loop:true, weight:0.0555},
            {clip:"GreenOff",   playing:true,  loop:true, weight:0.0555},

            {clip:"RedOn", playing:false,  loop:true,weight:0.0555 },
            {clip:"PinkOn",  playing:false,  loop:true, weight:0.0555},
            {clip:"VioletOn", playing:false,  loop:true,weight:0.0555 },
            {clip:"BlueOn",   playing:false,  loop:true,weight:0.0555 },
            {clip:"IndigoOn", playing:false,  loop:true,weight:0.0555 },
            {clip:"YellowOn",   playing:false,  loop:true,weight:0.0555 },
            {clip:"OrangeOn",  playing:false,  loop:true, weight:0.0555},
            {clip:"GreenOn",   playing:false,  loop:true, weight:0.0555},

            // {clip:"AllOn",  playing:false,  loop:true, weight:0.0555},
            // {clip:"AllOff",   playing:false,  loop:true, weight:0.0555},
        ]
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
    // console.log('resetting pod', index)
    let pod = activationPods[index]
    if(pod && pod.lockedModel){
        VisibilityComponent.createOrReplace(pod.lockedModel, {visible:false})
        // console.log('pod to reset is found')
        if(Tween.has(pod.lockedModel)){
            // console.log('found pod lock tweent')
            let tween = Tween.getMutable(pod.lockedModel)
            tween.playing = false
            Tween.deleteFrom(pod.lockedModel)
        }
            
        let transform = Transform.getMutableOrNull(pod.lockedModel)
        if(transform){
            // console.log('found transform pod to reset')
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
}

