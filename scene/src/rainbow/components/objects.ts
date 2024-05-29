import { Animator, Entity, GltfContainer, MeshCollider, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { sceneParent } from "./environment";
import { podPositions } from "./game";
import resources from "../helpers/resources";

// Parameters
// Parameters
let initialX = -26.2; // Initial x position for the first object
const spacing = 1.65; // Spacing of 1 meter between each object////

export let racingObjects:any[] = []

let animationStates:any[] = [
    {clip:"Win", playing:false, loop:true},
    {clip:"Lose", playing:false, loop:false},
    {clip:"Fly", playing:false, loop:true},
    {clip:"Idle", playing:true, loop:true},
]

export function createObjects(){
    for(let i = 0; i < podPositions.length; i++){ 
        let radius = initialX - i * spacing
        let parent = engine.addEntity()
        Transform.createOrReplace(parent, {position: Vector3.create(32,24,32), parent:sceneParent})

        let ent = engine.addEntity()
        GltfContainer.create(ent, {src: resources.models.directory + resources.models.pigDirectory + resources.models.pigs[i]})
        Transform.createOrReplace(ent, {position: Vector3.create(initialX, -22, -4.5), rotation: Quaternion.fromEulerDegrees(0,180,0), scale: Vector3.create(0.5, 0.5, 0.5), parent: parent})
        Animator.create(ent, {
            states: animationStates
        })

        let ent2 = engine.addEntity()
        GltfContainer.create(ent2, {src: resources.models.directory + resources.models.pigDirectory + resources.models.pigs[i]})
        Transform.createOrReplace(ent2, {position: Vector3.create(initialX, -22, 5), scale: Vector3.create(0.5,0.5,0.5), parent: parent})
        Animator.create(ent2, {
            states: animationStates
        })

        racingObjects.push({object:ent, object2:ent2, r:radius, parent:parent, stage:1})
        initialX += spacing
    }
}

export function setRacingPosition(index:number, amount:number){
    // console.log('moving racing objet')
    let object = racingObjects[index]

    let objectTransform = Transform.getMutable(object.object)
    objectTransform.position.y = amount

    let objectTransform2 = Transform.getMutable(object.object2)
    objectTransform2.position.y = amount

    // console.log('y is now', objectTransform2.position.y)
}

export function setRacingRotation(index:number, amount:number){
    let object = racingObjects[index]
    let parent = object.parent

    let parentTransform = Transform.getMutable(parent)
    let parentRotation = Quaternion.toEulerAngles(parentTransform.rotation)
    parentRotation.z = (-1 * amount)

    parentTransform.rotation = Quaternion.fromEulerDegrees(parentRotation.x, parentRotation.y, parentRotation.z)

    let objectTransform = Transform.getMutable(object.object)
    let objectRotation = Quaternion.toEulerAngles(objectTransform.rotation)
    objectRotation.z = - parentRotation.z
    objectTransform.rotation = Quaternion.fromEulerDegrees(objectRotation.x, objectRotation.y, objectRotation.z)

    let objectTransform2 = Transform.getMutable(object.object2)
    let objectRotation2 = Quaternion.toEulerAngles(objectTransform2.rotation)
    objectRotation2.z = -parentRotation.z
    objectTransform2.rotation = Quaternion.fromEulerDegrees(objectRotation2.x, objectRotation2.y, objectRotation2.z)
}

export function resetRacingObjects(){
    racingObjects.forEach((object, i:number)=>{
        object.stage = 1

        let parent = object.parent
        let transform = Transform.getMutable(parent)
        let rotation = Quaternion.toEulerAngles(transform.rotation)
        rotation.z = 0
        transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)
    
        let objectTransform = Transform.getMutable(object.object)
        objectTransform.position.y = -22
        let objectRotation = Quaternion.toEulerAngles(objectTransform.rotation)
        objectRotation.z = -Quaternion.toEulerAngles(transform.rotation).z
        objectTransform.rotation = Quaternion.fromEulerDegrees(objectRotation.x, objectRotation.y, objectRotation.z)

        let objectTransform2 = Transform.getMutable(object.object2)
        objectTransform2.position.y = -22
        let objectRotation2 = Quaternion.toEulerAngles(objectTransform2.rotation)
        objectRotation2.z = -Quaternion.toEulerAngles(transform.rotation).z
        objectTransform2.rotation = Quaternion.fromEulerDegrees(objectRotation2.x, objectRotation2.y, objectRotation2.z)

        Animator.playSingleAnimation(racingObjects[i].object, "Idle", true)
        Animator.playSingleAnimation(racingObjects[i].object2, "Idle", true)
    })
}