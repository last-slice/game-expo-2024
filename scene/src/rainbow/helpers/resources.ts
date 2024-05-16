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

export let targets:any = {
    1: "pinkBalloon.glb",
    2: "yellowBalloon.glb",
    3: "blueBalloon.glb",
    4: "redBalloon.glb",
    5: "greenBalloon.glb",
}

export let podAnimations:any[] = [
    "redPod.glb",
    "orangePod.glb",
    "yellowPod.glb",
    "greenPod.glb",
    "bluePod.glb",
    "inidgoPod.glb",
    "violetPod.glb",
    "pinkPod.glb",
]

export let sounds:any = {
    starting:[
        "sounds/starting_soon.mp3",
        "sounds/game_starting.mp3",
        "sounds/get_ready.mp3",
    ],
    encouragement:[
        "sounds/great_job.mp3",
        "sounds/you_got_this.mp3",
        "sounds/keep_it_up.mp3",
        "sounds/almost_there.mp3",
        "sounds/you_on_roll.mp3",
    ],
    leader:[
        "sounds/in_lead_2.mp3",
        "sounds/in_lead.mp3"
    ],
    lostLead:[
        "sounds/lost_lead.mp3"
    ],
    winner:[
        "sounds/you_won.mp3"
    ],
    gameOver:[
        "sounds/great_game.mp3",
        "sounds/game_over_almost.mp3",
        "sounds/great_job.mp3",
        "sounds/nice_job.mp3",
        "sounds/game_over_rocked.mp3",
        "sounds/look_points.mp3",
    ],
    ui:[
        "sounds/ui_click_go.mp3"
    ],
    gameStart:[
        "sounds/8bit_beam.mp3"
    ],
    playAgain:[
        "sounds/lets_play_again.mp3",
        "sounds/new_game_sure.mp3",
        "sounds/who_wants_to_play.mp3",
    ],
    inNightMode:[
        "sounds/night_mode_best.mp3",
        "sounds/look_colors.mp3",
    ],
    suggestNightMode:[
        "sounds/night_mode.mp3",
    ],
    powerup:[
        "sounds/powerup.mp3",
    ],
    multiplier:[
        "sounds/woa_multiplier.mp3",
        "sounds/multiplier_alright.mp3",
    ],
    winSongs:[
        "sounds/win_synth.mp3"
    ],
    choosePod:[
        "sounds_choose_other_pod.mp3",
        "sounds/already_taken.mp3"
    ],
}

export default {
    DEBUG: true,
    noServer: false,//

    slug:"game::jam::2024",
    multiplayerRoom: 'game-expo',

    models:{
        directory: "models/",
        pigDirectory:"pigs/",
        balloonDirectory:"targets/",
        base: "scene.glb",
        rainbow:"rainbowAnimations/fullRainbowAnimation.glb",
        carousel:"carousel.glb",
        winningAnimation: 'winVFX.glb',
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