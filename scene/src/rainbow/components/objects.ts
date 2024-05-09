import { Entity, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { sceneParent } from "./environment";

// Parameters
// Parameters
const initialX = -16; // Initial x position for the first object
const spacing = 2; // Spacing of 1 meter between each object
const numObjects = 8; // number of objects

export let racingObjects:any[] = []
// export let parent:Entity

export function createObjects(){

    for(let i = 0; i < 8; i++){
        let radius = initialX - i * spacing
        let parent = engine.addEntity()
        Transform.create(parent, {position: Vector3.create(32,1,32), parent:sceneParent})

        let ent = engine.addEntity()
        MeshRenderer.setBox(ent)

        Transform.create(ent, {position: Vector3.create(radius, 0, 0), parent: parent})

        racingObjects.push({object:ent, r:radius, parent:parent})
    }
}

export function rotateRacingObject(index:number, amount:number){
    console.log('rotating racing object', index)
    let object = racingObjects[index]
    let parent = object.parent
    let transform = Transform.getMutable(parent)
    let rotation = Quaternion.toEulerAngles(transform.rotation)
    rotation.z += (-1 * amount)
    // if(rotation.z >= 180){
    //     rotation.z = 180
    // }//

    transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)

    let objectTransform = Transform.getMutable(object.object)
    let objectRotation = Quaternion.toEulerAngles(objectTransform.rotation)
    objectRotation.z = -Quaternion.toEulerAngles(transform.rotation).z
    objectTransform.rotation = Quaternion.fromEulerDegrees(objectRotation.x, objectRotation.y, objectRotation.z)
}

export function resetRacingObjects(){
    console.log('resetting racing objects')
    racingObjects.forEach((object)=>{
        let parent = object.parent
        let transform = Transform.getMutable(parent)
        let rotation = Quaternion.toEulerAngles(transform.rotation)
        rotation.z = 0
        transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)
    
        let objectTransform = Transform.getMutable(object.object)
        let objectRotation = Quaternion.toEulerAngles(objectTransform.rotation)
        objectRotation.z = -Quaternion.toEulerAngles(transform.rotation).z
        objectTransform.rotation = Quaternion.fromEulerDegrees(objectRotation.x, objectRotation.y, objectRotation.z)
    })
}