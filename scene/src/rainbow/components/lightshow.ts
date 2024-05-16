import { Entity, engine } from "@dcl/sdk/ecs"
import { RainbowLightshowSystem } from "../systems/Lightshow"


export let outsideInOn:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:true, index:0, allOff:false},
        {time: 100, light:true, index:1, allOff:false},
        {time: 100, light:true, index:2, allOff:false},
        {time: 100, light:true, index:3, allOff:false},
        {time: 100, light:true, index:4, allOff:false},
        {time: 100, light:true, index:5, allOff:false},
        {time: 100, light:true, index:6, allOff:false},
        {time: 100, light:true, index:7, allOff:false},
    ],
    loop:false
}

export let outsideInOff:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:false, index:0, allOff:false},
        {time: 100, light:false, index:1, allOff:false},
        {time: 100, light:false, index:2, allOff:false},
        {time: 100, light:false, index:3, allOff:false},
        {time: 100, light:false, index:4, allOff:false},
        {time: 100, light:false, index:5, allOff:false},
        {time: 100, light:false, index:6, allOff:false},
        {time: 100, light:false, index:7, allOff:false},
    ],
    loop:false
}

export let insideOutOn:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:true, index:7, allOff:false},
        {time: 100, light:true, index:6, allOff:false},
        {time: 100, light:true, index:5, allOff:false},
        {time: 100, light:true, index:4, allOff:false},
        {time: 100, light:true, index:3, allOff:false},
        {time: 100, light:true, index:2, allOff:false},
        {time: 100, light:true, index:1, allOff:false},
        {time: 100, light:true, index:0, allOff:false},
    ],
    loop:false
}

export let allBlink:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 150, light:true, index:-500, allOff:false},
        {time: 150, light:false, index:-500, allOff:false},
        {time: 150, light:true, index:-500, allOff:false},
        {time: 150, light:false, index:-500, allOff:false},
        {time: 150, light:true, index:-500, allOff:false},
        {time: 150, light:false, index:-500, allOff:false},
        {time: 150, light:true, index:-500, allOff:false},
        {time: 150, light:false, index:-500, allOff:false},
        {time: 150, light:true, index:-500, allOff:false},
    ],
    loop:false
}


export let insideOutOff:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:false, index:7, allOff:false},
        {time: 100, light:false, index:6, allOff:false},
        {time: 100, light:false, index:5, allOff:false},
        {time: 100, light:false, index:4, allOff:false},
        {time: 100, light:false, index:3, allOff:false},
        {time: 100, light:false, index:2, allOff:false},
        {time: 100, light:false, index:1, allOff:false},
        {time: 100, light:false, index:0, allOff:false},
    ],
    loop:false
}

export let allOff:any = {
    timer: -10 / 1000,
    index:0,
    animations:[
        {time: 100, light:false, index:-500, allOff:false},
    ],
    loop:false
}

export let allOn:any = {
    timer: -10 / 1000,
    index:0,
    animations:[
        {time: 100, light:true, index:-500, allOff:false},
    ],
    loop:false
}

export let presets:any[] = [allBlink, outsideInOn, outsideInOff, insideOutOn, insideOutOff]
export let lightShows:Map<string, any> = new Map()
export let activeLightShows:Map<Entity, any> = new Map()

export function createLightShows(){
    engine.addSystem(RainbowLightshowSystem)
    lightShows.set("reset", {index:0, presets:[outsideInOn, outsideInOff, insideOutOn, insideOutOff, allBlink]})
}