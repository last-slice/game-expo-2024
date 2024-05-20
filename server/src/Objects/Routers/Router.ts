import express, {Request} from "express";
import { expoRouter } from "./expo";

export const router = express.Router();

router.get("/hello_world", (req: any, res: any) => {
    console.log('hello world server')
    res.send("It's time to kick ass and chew bubblegum!");
});

expoRouter(router)

export function authenticate(req:any, res:any, next:any){
    if(!req.params.auth || req.params.auth !== process.env.ADMIN_AUTH){
        return res.status(200).json({valid:false, message: 'Invalid Authorization' });
    }
    next()
}