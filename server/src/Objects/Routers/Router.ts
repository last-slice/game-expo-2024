import express, {Request} from "express";
import { expoRouter } from "./expo";

export const router = express.Router();

router.get("/hello_world", (req: any, res: any) => {
    console.log('hello world server')
    res.send("It's time to kick ass and chew bubblegum!");
});

expoRouter(router)




