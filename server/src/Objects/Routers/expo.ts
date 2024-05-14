import { endGame } from "../Admin";

export function expoRouter(router:any){
    router.get("/game/:auth/end/:room/", async (req: any, res: any) => {
        console.log('admin trying to force end game for room', req.params.room)
        if(req.params.room){
            endGame(req.params.room)
        }
        res.status(200).send({valid:true})
    });
    
}