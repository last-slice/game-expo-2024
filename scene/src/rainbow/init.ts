import { engine, executeTask } from "@dcl/sdk/ecs"
import {getPlayer} from "@dcl/sdk/players";
import { createEnvironment } from "./components/environment"
import {getRealm} from "~system/Runtime";
import { setupUi } from "./ui/ui"
import { getPreview } from "./helpers/functions"
import { joinServer, realm, updateRealm } from "./components/server";
import { addLocalPlayer } from "./components/player";
import resources from "./helpers/resources";
import { createPhysics } from "./cannon";
import { createLightShows } from "./components/lightshow";
import { checkTime } from "./systems/Time";
import { AudioCompleteSystem } from "./components/sounds";
import { createTests } from "./tests";
import { addInputSystem } from "./systems/ClickSystem";

export async function init(){
  setupUi()

  await createLightShows()
  await createEnvironment()
  await checkTime()
  engine.addSystem(AudioCompleteSystem)

  // createTests()

  getPreview().then(()=>{
    const playerData = getPlayer()
    if(playerData){
      executeTask(async ()=>{
        await addLocalPlayer(playerData)

        if(resources.noServer){
          return
        }

        createPhysics()

        let realmData = await getRealm({})
        updateRealm(realmData.realmInfo ? realmData.realmInfo.realmName : "")


        joinServer(realm)
      })
    }
  })
}