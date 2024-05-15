import { engine } from "@dcl/sdk/ecs";
import { GroundRainbowComponent } from "../components/environment";
import { getRandomIntInclusive } from "../helpers/functions";
import { rainbows, turnOnRainbow } from "../components/animations";

export function RainbowLightSystem(dt: number): void {
    for (const [entity] of engine.getEntitiesWith(GroundRainbowComponent)) {
        let rainbow = GroundRainbowComponent.getMutable(entity)
        if(rainbow.time > 0){
            rainbow.time -= dt
        }else{
            let random = getRandomIntInclusive(0, rainbows.length - 1)
            turnOnRainbow(entity, random, true)
            rainbow.time = getRandomIntInclusive(100, 300) / 1000
        }
    }
  }