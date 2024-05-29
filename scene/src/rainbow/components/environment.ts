import { Animator, Billboard, BillboardMode, ColliderLayer, EasingFunction, Entity, GltfContainer, Material, MeshCollider, MeshRenderer, Schemas, TextShape, Transform, Tween, TweenLoop, TweenSequence, VisibilityComponent, engine } from "@dcl/sdk/ecs"
import { Color4, Vector3, Quaternion } from "@dcl/sdk/math"
import { utils } from "../helpers/libraries"
import { gameRoom, sendServerMessage } from "./server"
import { SERVER_MESSAGE_TYPES } from "../helpers/types"
import { getRandomIntInclusive } from "../helpers/functions"
import { createObjects } from "./objects"
import resources, { colors, podAnimations } from "../helpers/resources"
import { podPositions } from "./game"
import { addPigTrainSystem, removePigTrainSystem } from "../systems/PigTrain"
import { createSound, playGameSound, startAudioFader } from "./sounds"
import { createRandomLightShows } from "../systems/Lightshow"
import { stopAllGroundRainbows, turnOffAllGroundRainbows } from "./animations"
import { activeLightShows } from "./lightshow"
import { createLeaderboard } from "./leaderboards"
import { createTutorial, disableTutorial, enableTutorial } from "./tutorial"
import { updateUITravelButton } from "../ui/travelButtonUI"

export const PigTrainComponent = engine.defineComponent("game::expo::pig::train::component", {})

export const GroundRainbowComponent = engine.defineComponent("game::expo::ground::rainbow::component", {
    time:Schemas.Number
})


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
    { position: Vector3.create(32, 6.75, 61), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25)},
    { position: Vector3.create(3.5, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(32, 6.75, 4), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(61, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
]

const carouselPositions = [
    // Vector3.create(13, 1.3, 13),
    Vector3.create(51, 1.55, 50),
    Vector3.create(13, 1.55, 50),
    Vector3.create(50, 1.55, 15)
];

export async function createEnvironment(){
    await createBase()
    await createLeaderboard("leaderboard")
    // await createLeaderboard("High Score")
    // await createLeaderboard("Fastest Time")//
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
    createTutorial()

    addPigTrainSystem()

    createClouds()
}

function createClouds(){

    //horizontal cloud for players to jump on
    const horizontalCloud = 'models/cloudHorizontalElevator.glb'

    const hCloud1 = engine.addEntity()
    GltfContainer.create(hCloud1, {src: horizontalCloud, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(hCloud1, {position: Vector3.create(32, 38, 6)})
    Animator.create(hCloud1, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.09
            }
        ]
    })

    const hCloud2 = engine.addEntity()
    GltfContainer.create(hCloud2, {src: horizontalCloud, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(hCloud2, {position: Vector3.create(32, 38, 56)})
    Animator.create(hCloud2, {
        states: [
            {
                clip: 'play',
                playing: true,
                speed: 0.05
            }
        ]
    })

    
    const cloudEntity = engine.addEntity()
    GltfContainer.create(cloudEntity, {src: animatedCloud, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(cloudEntity, { position: Vector3.create(32, 0, 32)})
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
    

}
const elevatorShape = 'models/elevator.glb'
function createElevator(){
    let elevator = engine.addEntity()
    GltfContainer.create(elevator, {src: elevatorShape, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    //MeshCollider.setCylinder(elevator)
    //MeshRenderer.setCylinder(elevator)
    Transform.create(elevator, {position: Vector3.create(32,0,32), scale: Vector3.create(1, 1, 1), rotation: Quaternion.fromEulerDegrees(0,0,0)})


    utils.triggers.addTrigger(
        elevator, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 4, z: 19}, scale:{x:5, y:5,z:5}}],

        ()=>{
            MeshCollider.deleteFrom(ground)
            Tween.createOrReplace(elevator, {
                mode: Tween.Mode.Move({
                  start: Vector3.create(32,0,32),
                  end: Vector3.create(32,24.25,32),
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
                Transform.getMutable(elevator).position = Vector3.create(32,0,32)
            }, 500)

            // endGroundAudioFader()
        }, Color4.Teal()
        
    )
}
//

function createGround(){
const sceneEntity = engine.addEntity()
    GltfContainer.create(sceneEntity, {
        src: resources.models.directory + resources.models.base,
    })
    Transform.create(sceneEntity, {
        position: Vector3.create(32, 0, 32)
    })

    utils.triggers.addTrigger(
        sceneEntity, utils.NO_LAYERS, utils.LAYER_1,
        [{type: 'box', position: {x: 0, y: 40, z: 0}, scale:{x:64, y:60,z:64}}],

        ()=>{
            disableGround()
        },
        ()=>{
            enableGround()
        }, Color4.Teal()
    )

    // create ground arrows
    const arrowModel = 'models/animatedArrow.glb'

    const arrow1 = engine.addEntity()
    GltfContainer.create(arrow1, {src: arrowModel})
    Transform.create(arrow1, {position: Vector3.create(32, 5, 52)})
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
    Transform.create(arrow2, {position: Vector3.create(32, 17, 52)})
    Animator.create(arrow2, {
        states: [
            {
                clip: 'play',
                playing: true,
                
            }
        ]
    })

    //arrow above pig npc 
    const arrowPig = engine.addEntity()
    GltfContainer.create(arrowPig, {src: arrowModel})
    Transform.create(arrowPig, {position: Vector3.create(22, 4, 22), rotation: Quaternion.fromEulerDegrees(180, 70, 0), scale: Vector3.create(0.25, 0.25, 0.25)})
    Animator.create(arrowPig, {
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
    // utils.triggers.enableDebugDraw(true)
    let speed = 0.5

    for(let i = 0; i < podPositions.length; i++){
        let pod = engine.addEntity()
        let pos = podPositions[i]
        Transform.create(pod, {position: Vector3.create(pos.x, 0, pos.z), parent:sceneParent})
        // addBuilderHUDAsset(pod, 'pod-' + i)


        let podModel = engine.addEntity()
        Transform.create(podModel, {position: sceneCenter})
        GltfContainer.create(podModel, {src: resources.models.directory + "activationPods/" + podAnimations[i]})
        Animator.create(podModel, {states: [
            {
                clip: 'play',
                playing: true, 
                loop:true,
                speed: speed
                
            }
        ]})

        utils.triggers.addTrigger(
            pod, utils.NO_LAYERS, utils.LAYER_1,
            [{type: 'box', position: {x: 0, y: 2, z: 0}, scale:{x:3, y:4,z:3 }}],

            ()=>{
                if(gameRoom){
                    if(!gameRoom.state.started){
                        if(!gameRoom.state.pods[i].locked){
                            sendServerMessage(SERVER_MESSAGE_TYPES.ENTERED_POD, {pod:i})
                        }else{
                            console.log('pod occupied')
                            playGameSound("choosePod")
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

        let nameEntity = engine.addEntity()
        Transform.create(nameEntity, {position: Vector3.create(0,5,0), parent:pod})
        TextShape.createOrReplace(nameEntity, {text:"Name " + i, fontSize:3, textColor:Color4.create(241/255, 31/255, 211/255), outlineColor:Color4.create(241/255, 31/255, 211/255), outlineWidth:.4})
        VisibilityComponent.createOrReplace(nameEntity, {visible:false})
        Billboard.create(nameEntity, {billboardMode: BillboardMode.BM_Y})

        activationPods.push({pod:pod, podModel:podModel, nameEntity:nameEntity, })//, lockedEntity:lockedEntity, lockedModel:lockedModel})

        speed -= 0.05
    }
}

function createCarousels(){
        const carouselCloud2 = engine.addEntity()
        GltfContainer.create(carouselCloud2, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_NONE})
        Transform.create(carouselCloud2, {position: Vector3.create(58, -2.7, 50), rotation: Quaternion.fromEulerDegrees(0, -45, 0), scale: Vector3.create(0.25, 0.25, 0.25)})
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
        GltfContainer.create(carouselCloud3, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_NONE})
        Transform.create(carouselCloud3, {position: Vector3.create(8, -2.7, 45), rotation: Quaternion.fromEulerDegrees(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.25)})
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
        GltfContainer.create(carouselCloud4, {src: animatedClouds, invisibleMeshesCollisionMask: ColliderLayer.CL_NONE})
        Transform.create(carouselCloud4, {position: Vector3.create(55, -2.7, 19.5), rotation: Quaternion.fromEulerDegrees(0, -90, 0), scale: Vector3.create(0.25, 0.25, 0.25)})
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
            invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
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
    })
    Transform.create(mainRainbow,{ position: Vector3.create(32, 53, 32)})
    addRainbowAnimations(mainRainbow)
    
    rainbowTransforms.forEach(({ position, rotation, scale }, i:number) => {
        const rainbowEntity = engine.addEntity();
        GltfContainer.create(rainbowEntity, {
            src: resources.models.directory + resources.models.rainbow, 
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

export function addRainbowAnimations(entity:Entity){
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
    let random = getRandomIntInclusive(0,resources.models.pigs.length-1)

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

      utils.timers.setTimeout(()=>{
        engine.removeEntityWithChildren(parent)
      }, 1000 * 7)


      PigTrainComponent.createOrReplace(parent)
}


function disableGround(){
    onGround = false
    removePigTrainSystem()

    activeLightShows.clear()
    stopAllGroundRainbows()

    startAudioFader("sounds/playing_bg_loop.mp3", 0)

    disableTutorial()

    updateUITravelButton("ground")
}

function enableGround(){
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

    enableTutorial()

    updateUITravelButton("game")
}