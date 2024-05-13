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
    Color4.Red(),
    Color4.create(1, 119/255, 0),
    Color4.Yellow(),
    Color4.Green(),

    Color4.Teal(),
    Color4.Purple(),
    Color4.create(203/255, 0/255, 206/255),
    Color4.create(253/255, 108/255, 225/255),
]

export default {
    DEBUG: true,
    noServer: false,

    slug:"game::jam::2024",
    multiplayerRoom: 'game-expo',

    models:{
        directory: "src/rainbow/models/",
        base: "rainbow-2.glb",
    },


    endpoints:{
        wsTest: "ws://localhost:2551",
        wsProd: "wss://dcl-iwb.co/toolset",

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