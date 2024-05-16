import { engine } from "@dcl/sdk/ecs"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"

export let colorsLabels:string[] = [
    "Black",
    "Blue",
    "Gray",
    "Green",
    "Magenta",
    "Purple",
    "Red",
    "Teal",
    "Yellow",
    "White",
]

export let colors:Color4[] = [
    Color4.create(1,0,0,.5),
    Color4.create(1, 119/255, 0, .5),
    Color4.create(0,1,1,.5),
    Color4.create(0,1,0,.5),

    Color4.Teal(),
    Color4.create(1,0,1,.5),
    Color4.create(203/255, 0/255, 206/255, .5),
    Color4.create(253/255, 108/255, 225/255, .5),
]

export default {
    DEBUG: true,
    noServer: true,

    slug:"game::jam::2024",
    multiplayerRoom: 'game-expo',

    models:{
        directory: "models/",
        pigDirectory:"pigs/",
        balloonDirectory:"targets/",
        base: "scene.glb",
        rainbow:"rainbowAnimations/fullRainbowAnimation.glb",
        carousel:"carousel.glb",
        pigs:[
            "redPig.glb",
            "orangePig.glb",
            "yellowPig.glb",
            "greenPig.glb",
            "bluePig.glb",
            "indigoPig.glb",
            "violetPig.glb",
            "pinkPig.glb",
        ],
        balloons:[
            "redBalloon.glb",
            "orangeBalloon.glb",
            "yellowBalloon.glb",
            "greenBalloon.glb",
            "blueBalloon.glb",
            "indigoBalloon.glb",
            "violetBalloon.glb",
            "pinkBalloon.glb",
        ],
    },


    endpoints:{
        wsTest: "ws://localhost:2551",
        wsProd: "wss://lkdcl.co/game-expo",

        deploymentTest: "http://localhost:2551",
        deploymentProd: "https://deployment.dcl-iwb.co",

        toolsetTest: "http://localhost:3000/toolset",
        toolsetProd: "https://dcl-iwb.co/toolset",

        validateTest: "http://localhost:2551",

        assetSign: "/scene/sign",
        dclNamesGraph:"https://api.thegraph.com/subgraphs/name/decentraland/marketplace",
        dclLandGraph:"https://api.thegraph.com/subgraphs/name/decentraland/land-manager"
    },
    colors:{
        transparent: Color4.create(0,0,0,0),
        opaqueGreen: Color4.create(0,1,0,0.4)
    },

    textures:{
        atlas1:"assets/atlas1.png",
        atlas2:"assets/atlas2.png"
    },
}