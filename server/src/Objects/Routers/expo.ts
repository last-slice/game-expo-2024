import { GameRoom } from "../../rooms/GameRoom";
import { updateServerEnabled } from "../../utils/config";
import { endGame, gameRooms, getServerConfig } from "../Admin";
import { authenticate } from "./Router";

export function expoRouter(router:any){
    router.get("/game/:auth/admin/getserverconfig/", async (req: any, res: any) => {
        console.log('admin trying to updae game config', req.params.room)
        if(!req.params.auth || req.params.auth !== process.env.ADMIN_AUTH){
            return res.status(200).json({valid:false, message: 'Invalid Authorization' });
        }
        res.status(200).send({valid:true})
        await getServerConfig()
    });  

    router.get("/game/:auth/end/:room/", async (req: any, res: any) => {
        console.log('admin trying to force end game for room', req.params.room)
        if(!req.params.auth || req.params.auth !== process.env.ADMIN_AUTH){
            return res.status(200).json({valid:false, message: 'Invalid Authorization' });
        }

        if(req.params.room){
            endGame(req.params.room)
        }
        res.status(200).send({valid:true})
    });   

    router.get("/game/:auth/enable/", async (req: any, res: any) => {
        console.log('admin trying to enable game mode')
        if(!req.params.auth || req.params.auth !== process.env.ADMIN_AUTH){
            return res.status(200).json({valid:false, message: 'Invalid Authorization' });
        }
        updateServerEnabled(true)
        res.status(200).send({valid:true})
    });   

    router.get("/game/:auth/disable/", async (req: any, res: any) => {
        console.log('admin trying to disable game mode')
        if(!req.params.auth || req.params.auth !== process.env.ADMIN_AUTH){
            return res.status(200).json({valid:false, message: 'Invalid Authorization' });
        }
        updateServerEnabled(false)
        gameRooms.forEach((room:GameRoom)=>{
            room.disconnect()
        })
        res.status(200).send({valid:true})
    });   
}