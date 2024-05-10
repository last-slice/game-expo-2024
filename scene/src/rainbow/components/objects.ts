import { Entity, MeshCollider, MeshRenderer, Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { sceneParent } from "./environment";
import { podPositions } from "./game";

// Parameters
// Parameters
let initialX = -27.5; // Initial x position for the first object
const spacing = 1.9; // Spacing of 1 meter between each object//

export let racingObjects:any[] = []
// export let parent:Entity

export function createObjects(){
    for(let i = 0; i < podPositions.length; i++){ 
        let radius = initialX - i * spacing
        let parent = engine.addEntity()
        Transform.create(parent, {position: Vector3.create(32,24,32), parent:sceneParent})

        let ent = engine.addEntity()
        MeshRenderer.setBox(ent)
        Transform.create(ent, {position: Vector3.create(initialX, -22, -1.5), parent: parent})

        let ent2 = engine.addEntity()
        MeshRenderer.setBox(ent2)
        Transform.create(ent2, {position: Vector3.create(initialX, -22, 1.5), parent: parent})

        racingObjects.push({object:ent, object2:ent2, r:radius, parent:parent, stage:1})
        initialX += spacing
    }
}

export function advanceObject(index:number, amount:number){
    // console.log('advancing object', index, amount)
    let object = racingObjects[index]
    let oy1 = Transform.getMutable(object.object).position.y
    let oy2 = Transform.getMutable(object.object2).position.y

    let step:number

    switch(object.stage){
        case 1:
            // console.log('in stage one')
            step = amount + oy1

            // console.log('step is', step)

            if(step > 0){
                // console.log('advancing to stage 2')
                object.stage = 2
                oy1 = 22
                oy2 = 22
                rotateRacingObject(index, step)
            }else{
               moveRacingObject(index, amount)
            }
        break;

        case 2:
            console.log('in stage 2')
            let parent = object.parent
            let transform = Transform.getMutable(parent)
            let rotation = Quaternion.toEulerAngles(transform.rotation)

            console.log('parent roation is', rotation)

            step = rotation.z - amount

            console.log('rotation step is', step)

            if(step <= 180){
                console.log('advance to stage 3')
                object.stage = 3
                rotation.z = 180
                moveRacingObject(index, 180 - step)
            }else{
                rotateRacingObject(index, amount)
            }
        break;

        case 3:
            console.log('stage 3')
            step = oy1 + amount

            console.log('step is', step)

            if(step >= 22){
                console.log('advancing to stage 4')
                object.stage = 4
                oy1 = 22
                oy2 = 22
            }else{
               moveRacingObject(index, amount)
            }
        break;
    }
}

export function moveRacingObject(index:number, amount:number){
    console.log('moving racing objet', index, amount)
    let object = racingObjects[index]

    let objectTransform = Transform.getMutable(object.object)
    objectTransform.position.y += amount

    let objectTransform2 = Transform.getMutable(object.object2)
    objectTransform2.position.y += amount

    console.log('y is now', objectTransform2.position.y)
}

export function rotateRacingObject(index:number, amount:number){
    console.log('rotating racing object', index, amount)
    let object = racingObjects[index]
    let parent = object.parent
    let transform = Transform.getMutable(parent)
    let rotation = Quaternion.toEulerAngles(transform.rotation)
    rotation.z += (-1 * amount)
    // if(rotation.z >= 180){
    //     rotation.z = 180
    // }//

    console.log('parent rotation is', rotation.z)

    transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)

    let objectTransform = Transform.getMutable(object.object)
    let objectRotation = Quaternion.toEulerAngles(objectTransform.rotation)
    objectRotation.z = -Quaternion.toEulerAngles(transform.rotation).z
    objectTransform.rotation = Quaternion.fromEulerDegrees(objectRotation.x, objectRotation.y, objectRotation.z)

    let objectTransform2 = Transform.getMutable(object.object2)
    let objectRotation2 = Quaternion.toEulerAngles(objectTransform2.rotation)
    objectRotation2.z = -Quaternion.toEulerAngles(transform.rotation).z
    objectTransform2.rotation = Quaternion.fromEulerDegrees(objectRotation2.x, objectRotation2.y, objectRotation2.z)
}

export function setRacingPosition(index:number, amount:number){
    console.log('moving racing objet')
    let object = racingObjects[index]

    let objectTransform = Transform.getMutable(object.object)
    objectTransform.position.y = amount

    let objectTransform2 = Transform.getMutable(object.object2)
    objectTransform2.position.y = amount

    console.log('y is now', objectTransform2.position.y)
}

export function setRacingRotation(index:number, amount:number){
    console.log('rotating racing object', index, amount)
    let object = racingObjects[index]
    let parent = object.parent
    let transform = Transform.getMutable(parent)
    let rotation = Quaternion.toEulerAngles(transform.rotation)
    rotation.z = (-1 * amount)

    console.log('parent rotation is', rotation.z)//

    transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)

    let objectTransform = Transform.getMutable(object.object)
    let objectRotation = Quaternion.toEulerAngles(objectTransform.rotation)
    objectRotation.z = -Quaternion.toEulerAngles(transform.rotation).z
    objectTransform.rotation = Quaternion.fromEulerDegrees(objectRotation.x, objectRotation.y, objectRotation.z)

    let objectTransform2 = Transform.getMutable(object.object2)
    let objectRotation2 = Quaternion.toEulerAngles(objectTransform2.rotation)
    objectRotation2.z = -Quaternion.toEulerAngles(transform.rotation).z
    objectTransform2.rotation = Quaternion.fromEulerDegrees(objectRotation2.x, objectRotation2.y, objectRotation2.z)
}

export function resetRacingObjects(){
    racingObjects.forEach((object)=>{
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
    })
}