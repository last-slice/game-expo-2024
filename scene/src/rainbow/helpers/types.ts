

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
}

export enum POD_COLORS {
    RED,
    ORANGE,
    YELLOW,
    GREEN,
    BLUE,
    INDIGO,
    VIOLET,
    TEAL
}


export interface Player {
    userId:string
    name:string
    dclData:any
}