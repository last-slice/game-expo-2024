import { ColliderLayer, GltfContainer, Transform, engine } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"


const carousel = 'models/carousel.glb'
const rainbow = 'models/thickRainbow.glb'
const scene = 'models/scene.glb'

const carouselPositions = [
    Vector3.create(14, 0.5, 14),
    Vector3.create(50, 0.5, 50),
    Vector3.create(14, 0.5, 50),
    Vector3.create(50, 0.5, 14)
];

const rainbowTransforms = [
    { position: Vector3.create(32, 6.75, 62), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25)},
    { position: Vector3.create(3, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.5) },
    { position: Vector3.create(32, 6.75, 2), rotation: Vector3.create(0, 0, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(62, 6.75, 32), rotation: Vector3.create(0, 90, 0), scale: Vector3.create(0.25, 0.25, 0.25) },
    { position: Vector3.create(32, 53, 32), rotation: Vector3.create(0, 0, 0), scale: Vector3.One() }

]

export function createGameModels() {
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