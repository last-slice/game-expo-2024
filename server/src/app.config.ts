import config from "@colyseus/tools";
import cors from 'cors'
import bodyParser from "body-parser";
import { playground } from "@colyseus/playground";
import { router } from "./Objects/Routers/Router";
import { GameRoom } from "./rooms/GameRoom";
import { monitor } from "@colyseus/monitor";

export default config({

    initializeGameServer: (gameServer) => {
        // initPlayFab()

        gameServer.define('game-expo', GameRoom)
        .filterBy(['world'])
    },

    initializeExpress: (app) => {

        app.use(cors({origin: true}))
        app.options('*', cors());
        app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
        app.use(bodyParser.json({ limit: '150mb' }));
        app.use("/", router);

        // ...
        app.use("/playground", playground);
        app.use("/colyseus", monitor())
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});