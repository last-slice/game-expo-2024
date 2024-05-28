

export enum SERVER_MESSAGE_TYPES {
    INIT = 'init',
    ENTERED_POD = 'entered_pod',
    EXIT_POD = 'exit_pod',
    POD_COUNTDOWN = 'pod_countdown',
    POD_LOCKED = 'pod_locked',
    HIT_TARGET = 'hit_target',
    CREATE_BALL = 'create_ball',


    PLAYER_JOINED = 'player_joined',
    PLAYTIME = 'playtime',
    WIN_GAME = 'win_game',
    FULL_GAME = 'full_game',
    SOLO_GAME = 'solo_game',
    MP_GAME = 'mp_game',
    GAME_FINISHED = 'game_finished',
    PIGS_FLEW = 'pigs_flew',
    TARGETS_HIT = 'targets_hit',
    PLAYER_FROZEN = 'player_frozen',
    TUTORIAL_FINISHED = 'tutorial_finished',
    GAME_FINISHED_EARLY = 'game_finished_early',
    GAME_TIED = 'game_tied'
}


export enum SCENE_MODES {
    PLAYMODE,
    CREATE_SCENE_MODE,
    BUILD_MODE
}

export enum EDIT_MODES {
    GRAB,
    EDIT
}

export enum EDIT_MODIFIERS {
    POSITION,
    ROTATION,
    SCALE,
    TRANSFORM
}

export type PlayerData = {
    dclData:any | null,
    mode: SCENE_MODES,
    buildMode:number | null,
}

export enum COMPONENT_TYPES {
    VISBILITY_COMPONENT = "Visibility",
    IMAGE_COMPONENT = "Image",
    VIDEO_COMPONENT = 'Video',
    AUDIO_COMPONENT = "Audio",
    MATERIAL_COMPONENT = "Material",
    COLLISION_COMPONENT = "Collision",
    TRANSFORM_COMPONENT = "Transform",
    NFT_COMPONENT = "NFT",
    TEXT_COMPONENT = "Text",
    TRIGGER_COMPONENT = "Trigger",
    ACTION_COMPONENT = 'Action',
    TRIGGER_AREA_COMPONENT = "Trigger Area",
    CLICK_AREA_COMPONENT = "Click Area",
    ANIMATION_COMPONENT = "Animation",
    NPC_COMPONENT = 'NPC',
    DIALOG_COMPONENT = 'Dialog',
    REWARD_COMPONENT ='Reward'
}

export enum COLLISION_LAYERS {
    INVISIBLE = "invisible",
    VISIBLE = "visible"
}

export enum BLOCKCHAINS {
    ETH = "eth",
    POLYGON = "polygon"
}

// export type SceneData = {
//     id:string,
//     n:string, 
//     d:string,
//     o:string,
//     ona:string,
//     cat:string,
//     bpcl:string,
//     ass:any[],
//     bps:string[],
//     rat:string[],
//     rev:string[],
//     pcls:string[],
//     sp:string[],
//     cd:number,
//     upd:number,
//     si:number,
//     toc:number,
//     pc:number,
//     pcnt:number,
//     isdl:boolean,
//     e:boolean
// }

export enum ACTIONS {
    START_TWEEN = "start_tween",
    PLAY_SOUND = "play_sound",
    STOP_SOUND = "stop_sound",
    SET_VISIBILITY = "set_vis",
    ATTACH_PLAYER = "attach_player",
    DETACH_PLAYER = "detach_player",
    PLAY_VIDEO = 'play_video',
    TOGGLE_VIDEO = 'toggle_video',
    PLAYER_VIDEO_STREAM = 'play_video_stream',
    STOP_VIDEO = 'stop_video',
    STOP_VIDEO_STREAM = 'stop_video_stream',
    PLAY_AUDIO = 'play_audio',
    PLAY_AUDIO_STREAM = 'play_audio_stream',
    STOP_AUDIO = 'stop_audio',
    STOP_AUDIO_STREAM = 'stop_audio_stream',
    TELEPORT_PLAYER = 'telport',
    EMOTE = 'emote',
    OPEN_LINK = 'open_link',
    SHOW_TEXT = 'show_text',
    HIDE_TEXT = 'hide_text',
    SHOW_TOAST = 'show_toast',
    HIDE_TOAST = 'hide_toast',
    START_DELAY = 'start_delay',
    STOP_DELAY = 'stop_delay',
    START_LOOP = 'start_loop',
    STOP_LOOP = 'stop_loop',
    CLONE = 'clone',
    REMOVE = 'remove',
    SHOW_IMAGE = 'show_image',
    HIDE_IMAGE = 'hide_image',
    PLAY_ANIMATION = 'play_animation',
    STOP_ANIMATION = 'stop_animation',
    SHOW_DIALOG = 'show_dialog',
    GIVE_REWARD = 'give_reward'
}

export enum REWARD_TYPES {
    DCL_ITEM = 'dcl_item'
}