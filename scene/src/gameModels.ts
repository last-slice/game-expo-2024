import { Animator, ColliderLayer, GltfContainer, Transform, engine } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"


const carousel = 'models/carousel.glb'
const rainbow = 'models/thickRainbow.glb'
const scene = 'models/scene.glb'

const pinkPig = 'models/pigs/pinkPig.glb'
const violetPig = 'models/pigs/violetPig.glb'
const bluePig = 'models/pigs/bluePig.glb'
const indigoPig = 'models/pigs/indigoPig.glb'
const greenPig = 'models/pigs/greenPig.glb'
const yellowPig = 'models/pigs/yellowPig.glb'
const orangePig = 'models/pigs/orangePig.glb'
const redPig = 'models/pigs/redPig.glb'


const carouselPositions = [
    Vector3.create(14, 1, 14),
    Vector3.create(50, 1, 50),
    Vector3.create(14, 1, 50),
    Vector3.create(50, 1, 14)
];

const pigPositions = [
    Vector3.create(32, 1, 2),
    Vector3.create(32, 1, 4),
    Vector3.create(32, 1, 6),
    Vector3.create(32, 1, 8),
    Vector3.create(32, 1, 10),
    Vector3.create(32, 1, 12),
    Vector3.create(32, 1, 14),
    Vector3.create(32, 1, 16)
];
const pigScale = Vector3.create(0.5, 0.5, 0.5)

const rainbowTransforms = [
    { position: Vector3.create(32, 6.75, 62), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25)},
    { position: Vector3.create(3, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.5) },
    { position: Vector3.create(32, 6.75, 2), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(62, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(32, 53, 32), rotation: Vector3.create(0, 0, 0), scale: Vector3.One() }

]

const animatedCloud = 'models/cloudVerticalElevator.glb'
const sceneCenter = Vector3.create(32, 0, 32)

const animatedClouds = 'models/cloudHover.glb'

export function createGameModels() {

    /*
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
                speed: 0.15
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
                speed: 0.15
            }
        ]
    })
    */

}