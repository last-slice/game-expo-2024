import { InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem, executeTask } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import {getPlayer} from "@dcl/sdk/players";
import { createEnvironment } from "./components/environment"
import {getRealm} from "~system/Runtime";
import { initGame } from "./components/game"
import { setupUi } from "./ui/ui"
import { getPreview } from "./helpers/functions"
import { joinServer, realm, updateRealm } from "./components/server";
import { addLocalPlayer, addPlayer } from "./components/player";
import resources from "./helpers/resources";


export function init(){

  //setup ui
  setupUi()

  getPreview().then(()=>{
    const playerData = getPlayer()
    if(playerData){
      executeTask(async ()=>{
        await addLocalPlayer(playerData)
        createEnvironment()

        if(resources.noServer){
          return
        }

        let realmData = await getRealm({})
        updateRealm(realmData.realmInfo ? realmData.realmInfo.realmName : "")

        joinServer(realm)
      })
    }
  })

  //server connect//


  //create environment

  // createTest()
}

function createTest(){
  let ent = engine.addEntity()
  Transform.create(ent, {position: Vector3.create(32,3,16)})
  MeshRenderer.setBox(ent)
  MeshCollider.setBox(ent)
  pointerEventsSystem.onPointerDown({entity: ent,
    opts:{button: InputAction.IA_POINTER, maxDistance:25, hoverText:"Click"}
  },
  ()=>{
      initGame()
      // objects.forEach((object, i:number)=>{
      //   let parent = object.parent
      //   let transform = Transform.getMutable(parent)
      //   let rotation = Quaternion.toEulerAngles(transform.rotation)
      //   rotation.z += -1
      //   transform.rotation = Quaternion.fromEulerDegrees(rotation.x, rotation.y, rotation.z)

      //   let objectTransform = Transform.getMutable(object.object)
      //   let objectRotation = Quaternion.toEulerAngles(objectTransform.rotation)
      //   objectRotation.z = -Quaternion.toEulerAngles(transform.rotation).z
      //   objectTransform.rotation = Quaternion.fromEulerDegrees(objectRotation.x, objectRotation.y, objectRotation.z)
      // })
  })
}