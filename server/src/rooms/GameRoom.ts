import {Client, Room} from "@colyseus/core";
import {Player} from "../Objects/Player";
import {SERVER_MESSAGE_TYPES} from "../utils/types";
import {playerLogin, updatePlayerDisplayName, updatePlayerInternalData} from "../utils/Playfab";
import { pushPlayfabEvent } from "../Objects/PlayfabEvents";
import { GameRoomState } from "./schema/GameRoomState";
import { RoomHandler } from "./handlers/RoomHandler";
import { GameManager } from "../Objects/GameManager";
import { addGameRoom, gameRooms, removeGameRoom } from "../Objects/Admin";

export class GameRoom extends Room<GameRoomState> {

    async onAuth(client: Client, options: any, req: any) {
        //check if player or ip is already added

        const ipAddress = req.headers['x-forwarded-for'] || req.socket.address().address;

        let ipAccounts = Object.values(this.state.players.toJSON()).filter((player:any) => player.ip === ipAddress).length
        if(ipAccounts > 3){
            console.log('too many ip logged in')
            return false
        }

        if(this.state.players.has(options.userId)){
            console.log('user already connected')
            return false
        }

        client.auth = {}
        client.auth.ip = ipAddress

        return true


        // return await this.doLogin(client, options, req)   
    }

    onCreate(options: any) {
        this.setState(new GameRoomState());
        addGameRoom(this)

        this.state.world = options.world

        this.state.gameManager = new GameManager(this)

        //add listeners
        this.state.handler = new RoomHandler(this) 
    }

    onJoin(client: Client, options: any) {
        try {
            // console.log(auth.userId, "joined! -", options.userData.name, "Realm -", auth.realm);

            client.userData = options.userData;
            client.userData.ip = client.auth.ip
            // client.userData.userId = auth.userId;
            // client.userData.realm = auth.realm;

            client.userData.roomId = this.roomId
            this.getPlayerInfo(client, options)
        } catch (e) {
            console.log('on join error', e)
        }
    }

    async onLeave(client: Client, consented: boolean) {
        let player:Player = this.state.players.get(client.userData.userId)
        if(player){

            await this.state.gameManager.removePlayer(player)

            this.state.players.delete(client.userData.userId)

            //if player is playing, handle leave

        //   setTimeout(()=>{
        //   //   console.log('player is not in another world, need to remove them from server')
        //     playerManager.removePlayer(player.dclData.userId)
        //     playerManager.savePlayerCache(player)
        //     this.broadcast(SERVER_MESSAGE_TYPES.PLAYER_LEAVE, {player: client.userData.userId})
        //   }, 1000 * 5)

        }
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
        //clear all timers
        this.state.gameManager.garbageCollect()

        removeGameRoom(this.roomId)
    }

    async getPlayerInfo(client: Client, options: any) {
        // client.send(SERVER_MESSAGE_TYPES.INIT, {
        //     catalog: itemManager.items,
        //     realmAssets: this.state.realmAssets,
        //     styles: iwbManager.styles,
        //     worlds: iwbManager.worlds,
        //     iwb: {v: iwbManager.version, updates:iwbManager.versionUpdates},
        //     tutorials: {
        //         videos: iwbManager.tutorials,
        //         cid: iwbManager.tutorialsCID
        //     }
        // })

        let player = new Player(this, client)
        this.state.players.set(options.userData.userId, player)

        pushPlayfabEvent(
            SERVER_MESSAGE_TYPES.PLAYER_JOINED, 
            player, 
            [{world:options.world}]
        )
    }

    // async doLogin(client: any, options: any, request: any) {
    //     // console.log('login options', options)
    //     return new Promise((resolve) => {
    //         setTimeout(async() => {
    //             // console.log('Timeout finished!');
    //             let info:any = false
    //             try {

    //                 const ipAddress = request.headers['x-forwarded-for'] || request.socket.address().address;
    //                 // console.log(`Client IP address: ${ipAddress}`);
    //                 const playfabInfo = await playerLogin(
    //                     {
    //                         CreateAccount: true,
    //                         ServerCustomId: options.userData.userId,
    //                         InfoRequestParameters: {
    //                             "UserDataKeys": [], "UserReadOnlyDataKeys": [],
    //                             "GetUserReadOnlyData": true,
    //                             "GetUserInventory": false,
    //                             "GetUserVirtualCurrency": false,
    //                             "GetPlayerStatistics": true,
    //                             "GetCharacterInventories": false,
    //                             "GetCharacterList": false,
    //                             "GetPlayerProfile": true,
    //                             "GetTitleData": false,
    //                             "GetUserAccountInfo": true,
    //                             "GetUserData": true,
    //                         },
    //                         CustomTags: {
    //                             ipAddress: ipAddress
    //                         }
    //                     })
        
    //                 if (playfabInfo.error) {
    //                  //    console.log('playfab login error => ', playfabInfo.error)
    //                 } else {
    //                    //  console.log('playfab login success')
    //                     client.auth = {}
    //                     client.auth.playfab = playfabInfo
    //                     client.auth.ip = ipAddress
    //                     // console.log('playfab info', playfabInfo)
        
    //                     if (playfabInfo.NewlyCreated) {
    //                         let [data, stats] = await this.initializeServerPlayerData(options, client.auth)
    //                         client.auth.playfab.InfoResultPayload.PlayerStatistics = stats
    //                         client.auth.playfab.InfoResultPayload.UserData = data
    //                         info = client.auth
    //                     } else {
    //                         //to do
    //                         // we have no stats yet
    //                         //   let stats = await this.checkInitStats(client.auth)
    //                         //   client.auth.InfoResultPayload.PlayerStatistics = stats
    //                         info = client.auth
    //                     }
    //                 }
    //             } catch (e) {
    //                 console.log('playfab connection error', e)
    //             }
    //             resolve(info); // Resolve the Promise with the data
    //           }, 2000); // Adjust the timeout duration as needed
    //         });
    // }

    // async initializeServerPlayerData(options: any, auth: any) {

    //     // console.log('options are', options)
    //     options.userData.name.replace(" ", "_").trim()

    //     //set new user display name
    //     const result = await updatePlayerDisplayName({
    //         DisplayName: options.userData.name === "Guest" ? 
    //         options.userData.name + options.userData.userId.substring(options.userData.userId.length - 5) : 
    //         options.userData.name,
            
    //         PlayFabId: auth.playfab.PlayFabId
    //     })
    //    //  console.log('setting player name res is', result)

    //     let def: any = {}
    //     def.address = options.userData.userId
    //     def.web3 = !options.userData.isGuest

    //     //set initial player data
    //     const initPlayerDataRes = await updatePlayerInternalData({
    //         Data: def,
    //         PlayFabId: auth.playfab.PlayFabId
    //     })
    //     // console.log('setting eth address result', initPlayerDataRes)

    //     let stats: any[] = []
    //     //we have no stats for now
    //     // initManager.pDefaultStats.forEach((stat,key)=>{
    //     //   stats.push({StatisticName:stat.StatisticName, Value:stat.Value})
    //     // })

    //     let data:any = {
    //       Settings:{
    //         Value:JSON.stringify(iwbManager.defaultPlayerSettings)
    //       },
    //       Assets:{
    //         Value:JSON.stringify([])
    //       },
    //       Scenes:{
    //         Value:JSON.stringify([])
    //       }
    //     }

    //     return [data, stats]
    // }
}
