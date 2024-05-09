import { Client, Room } from "colyseus.js"
import { isPreview, log } from "../helpers/functions"
import resources from "../helpers/resources"
import { localPlayer, players } from "./player"
import { createServerHandlers } from "./serverHandlers"


export let realm: string = ""
export let connected: boolean = false
export let sessionId: any
export let gameRoom: Room
export let client:Client


export function updateRealm(value: string) {
    realm = value
}

export async function joinServer(world?: any) {
    // !isPreview ? addLoadingScreen() :null
    if (connected) {
        gameRoom.removeAllListeners()
        gameRoom.leave(true)
        connected = false
    }
    // console.log('gameRoom is', gameRoom, world)

    let data:any = {...localPlayer}
    delete data.avatar
    delete data.wearables
    delete data.emotes

    await colyseusConnect(data, "", world)
}

export function sendServerMessage(type:any, data:any){
    gameRoom && gameRoom.send(type, data)
}

export async function colyseusConnect(data: any, token: string, world?: any) {
    connect(resources.multiplayerRoom, data, token, world).then((room: Room) => {
        log("Connected!");
        gameRoom = room
        sessionId = room.sessionId
        connected = true

        room.onLeave((code: number) => {
            log('left room with code', code)
            connected = false
            // displayPendingPanel(true, "disconnected")
        })

        createServerHandlers(room)

    }).catch((err) => {
        console.error('colyseus connection error', err)
    });
}

export async function connect(roomName: string, userData: any, token: string, world?:any) {

    let options: any = {token, userData}
    options.world = world ? world : "iwb"

    client = new Client(resources.DEBUG ? resources.endpoints.wsTest : resources.endpoints.wsProd)
    try {
        return await client.joinOrCreate(roomName, options);

    } catch (e) {
        log('error connecting colyseus', e)//
        throw e;
    }
}
