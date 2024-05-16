
import { AudioSource, Entity, GltfContainer, Material, MeshRenderer, Transform, engine } from '@dcl/sdk/ecs';
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import * as CANNON from 'cannon/build/cannon'
import { ballPhysicsMaterial, loadPhysicsWorld } from './world';
import { BallComponent } from '../components/game';
import { localPlayer } from '../components/player';
import { PhysicsUpdateSystem } from '../systems/Physics';
import resources, { colors } from '../helpers/resources';

export let ballBodies:Map<Entity, any> = new Map()
export let world:CANNON.World 
export let velocity:number = 25
export let mass = 5

let size:number = .1
let ballCount = 2

export function createPhysics(){
    world = new CANNON.World()
    world.gravity.set(0, -9.82, 0) // m/s²

    loadPhysicsWorld(world)

    engine.addSystem(PhysicsUpdateSystem)
}

export function checkOverlap(bodyA:any, bodyB:any) {
    var aabbA = new CANNON.AABB();
    var aabbB = new CANNON.AABB();
    bodyA.computeAABB();
    bodyB.computeAABB();
    aabbA.copy(bodyA.aabb);
    aabbB.copy(bodyB.aabb);

    return aabbA.overlaps(aabbB);
}

export function removeBall(entity:Entity){
    let object = ballBodies.get(entity)
      if(object){
        world.remove(object.pBody)
      }

    ballBodies.delete(entity)    
    engine.removeEntity(entity)
}

export function createBall(info:any){
    let pos = info.pos
    let direction = info.direction

    let entity = engine.addEntity()
    // MeshRenderer.setSphere(entity)//
    // Material.setPbrMaterial(entity, {albedoColor: colors[info.id], emissiveColor: colors[info.id], emissiveIntensity: 2})
    Transform.createOrReplace(entity, {position: Vector3.create(pos.x, pos.y + 0.5, pos.z), scale: Vector3.create(size, size, size), rotation:Quaternion.fromEulerDegrees(0, direction.y, 0)})
    GltfContainer.create(entity, {src: resources.models.directory + resources.models.pigDirectory + resources.models.pigs[info.id]})

    const ballTransform = Transform.get(entity)

    const ballBody: CANNON.Body = new CANNON.Body({
      mass: mass, // kg//
      position: new CANNON.Vec3(ballTransform.position.x, ballTransform.position.y, ballTransform.position.z), // m
      shape: new CANNON.Sphere(size) // m (Create sphere shaped body with a radius of 1)
    })

    ballBody.material = ballPhysicsMaterial // Add bouncy material to ball body
    ballBody.linearDamping = 0.4 // Round will keep translating even with friction so you need linearDamping
    ballBody.angularDamping = 0.4 // Round bodies will keep rotating even with friction so you need angularDamping

    world.addBody(ballBody)
    ballBodies.set(entity, {pBody:ballBody, userId: localPlayer.userId})

    ballBody.velocity.set(direction.x * velocity, direction.y * velocity, direction.z * velocity)


    // ballBody.applyImpulse(
    //     new CANNON.Vec3(forwardVector.x * vectorScale, forwardVector.y * vectorScale, forwardVector.z * vectorScale),
    //     // Applies impulse based on the player's position and where they click on the ball
    //     new CANNON.Vec3(pos.x, 1, pos.z)
    //   )

    BallComponent.create(entity)
    // syncEntity(entity, [Transform.componentId], ballCount)
    ballCount++

    AudioSource.createOrReplace(entity, {audioClipUrl:"sounds/8bit_jump.mp3", playing:true, volume:.2})
}