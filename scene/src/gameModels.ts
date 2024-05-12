import { ColliderLayer, GltfContainer, Transform, engine } from "@dcl/sdk/ecs"
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

export function createGameModels() {

    const pinkPigigEntity = engine.addEntity()
    GltfContainer.create(pinkPigigEntity, { src: pinkPig, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(pinkPigigEntity, { position: pigPositions[0],scale: pigScale })

    const violetPigEntity = engine.addEntity()
    GltfContainer.create(violetPigEntity, { src: violetPig, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(violetPigEntity, { position: pigPositions[1],scale: pigScale })

    const bluePigEntity = engine.addEntity()
    GltfContainer.create(bluePigEntity, { src: bluePig, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(bluePigEntity, { position: pigPositions[2],scale: pigScale })

    const indigoPigEntity = engine.addEntity()
    GltfContainer.create(indigoPigEntity, { src: indigoPig, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(indigoPigEntity, { position: pigPositions[3],scale: pigScale })

    const greenPigEntity = engine.addEntity()
    GltfContainer.create(greenPigEntity, { src: greenPig, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(greenPigEntity, { position: pigPositions[4],scale: pigScale })

    const yellowPigEntity = engine.addEntity()
    GltfContainer.create(yellowPigEntity, { src: yellowPig, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(yellowPigEntity, { position: pigPositions[5],scale: pigScale })

    const orangePigigEntity = engine.addEntity()
    GltfContainer.create(orangePigigEntity, { src: orangePig, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(orangePigigEntity, { position: pigPositions[6],scale: pigScale })

    const redPigigEntity = engine.addEntity()
    GltfContainer.create(redPigigEntity, { src: redPig, invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS})
    Transform.create(redPigigEntity, { position: pigPositions[7],scale: pigScale })






    const sceneEntity = engine.addEntity()
    GltfContainer.create(sceneEntity, {
        src: scene,
        invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
    })
    Transform.create(sceneEntity, {
        position: Vector3.create(32, 0, 32)
    })
    carouselPositions.forEach(position => {
        const carouselEntity = engine.addEntity();
        GltfContainer.create(carouselEntity, {
            src: carousel,
            invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
        });
        Transform.create(carouselEntity, {
            position: position,
            scale: Vector3.create(1.2, 1.2, 1.2)
        });
    });

    rainbowTransforms.forEach(({ position, rotation, scale }) => {
        const rainbowEntity = engine.addEntity();
        GltfContainer.create(rainbowEntity, {
            src: rainbow, 
            invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
        })
        Transform.create(rainbowEntity, {
            position: position, 
            rotation: Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z),
            scale: scale
        })
    })
}