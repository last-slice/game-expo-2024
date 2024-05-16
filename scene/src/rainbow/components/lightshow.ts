import { Entity, engine } from "@dcl/sdk/ecs"
import { RainbowLightshowSystem } from "../systems/Lightshow"


export let outsideInOn:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:true, index:0},
        {time: 100, light:true, index:1},
        {time: 100, light:true, index:2},
        {time: 100, light:true, index:3},
        {time: 100, light:true, index:4},
        {time: 100, light:true, index:5},
        {time: 100, light:true, index:6},
        {time: 100, light:true, index:7},
    ],
    loop:false
}

export let outsideInOff:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:false, index:0},
        {time: 100, light:false, index:1},
        {time: 100, light:false, index:2},
        {time: 100, light:false, index:3},
        {time: 100, light:false, index:4},
        {time: 100, light:false, index:5},
        {time: 100, light:false, index:6},
        {time: 100, light:false, index:7},
    ],
    loop:false
}

export let insideOutOn:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:true, index:7},
        {time: 100, light:true, index:6},
        {time: 100, light:true, index:5},
        {time: 100, light:true, index:4},
        {time: 100, light:true, index:3},
        {time: 100, light:true, index:2},
        {time: 100, light:true, index:1},
        {time: 100, light:true, index:0},
    ],
    loop:false
}

export let allBlink:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 150, light:true, index:-500},
        {time: 150, light:false, index:-500},
        {time: 150, light:true, index:-500},
        {time: 150, light:false, index:-500},
        {time: 150, light:true, index:-500},
        {time: 150, light:false, index:-500},
        {time: 150, light:true, index:-500},
        {time: 150, light:false, index:-500},
        {time: 150, light:true, index:-500},
    ],
    loop:false
}

export let insideOutOff:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:false, index:7},
        {time: 100, light:false, index:6},
        {time: 100, light:false, index:5},
        {time: 100, light:false, index:4},
        {time: 100, light:false, index:3},
        {time: 100, light:false, index:2},
        {time: 100, light:false, index:1},
        {time: 100, light:false, index:0},
    ],
    loop:false
}

export let allOff:any = {
    timer: -10 / 1000,
    index:0,
    animations:[
        {time: 100, light:false, index:-500},
    ],
    loop:false
}

export let allOn:any = {
    timer: -10 / 1000,
    index:0,
    animations:[
        {time: 100, light:true, index:-500},
    ],
    loop:false
}

export let winningAnimation:any = {
    timer:100 / 1000,
    index:0,
    animations:[
        {time: 100, light:false, index:-500},
        {time: 200, light:true, index:6},
        {time: 100, light:false, index:5},
        {time: 100, light:true, index:4},
        {time: 100, light:false, index:3},
        {time: 100, light:true, index:2},
        {time: 100, light:false, index:1},
        {time: 100, light:true, index:0},
        {time: 100, light:false, index:1},
        {time: 100, light:true, index:0},
        {time: 100, light:false, index:1},
        {time: 100, light:true, index:0},
        {time: 100, light:false, index:1},
        {time: 100, light:true, index:0},
    ],
    loop:false
}

export let delay:any = {
    timer: 1000 / 1000,
    index:-500,
    delay:true,
    animations:[],
    loop:false
}

export let presets:any[] = [allBlink, outsideInOn, outsideInOff, insideOutOn, insideOutOff]
export let lightShows:any[] = []
export let activeLightShows:Map<Entity, any> = new Map()

export function createLightShows(){
    engine.addSystem(RainbowLightshowSystem)
    lightShows.push({name:"reset", index:0, presets:[outsideInOn, outsideInOff, insideOutOn, insideOutOff, allBlink, delay, allOff]})
    lightShows.push({name:"allOff", index:0, presets:[allOff]})
}