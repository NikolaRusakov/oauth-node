"use strict";
import * as bodyParser from "body-parser";
import express from "express";
import {Routes} from "./routes/auth";
import passport from 'passport';
import cors from "cors";
// import helmet from "helmet";


/**
 * The server.
 *
 * @class Server
 */
class Server {

    public app: express.Application;
    public auth: Routes = new Routes();

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }


    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        this.app = express();
        this.config();
        this.auth.routes(this.app);
    }

    private config(): void {
        this.app.use(cors());
        this.app.set('view engine', 'ejs');

        /* this.app.use(helmet(
             {
                 contentSecurityPolicy: {
                     directives: {
                         frameAncestors: ["'none'"]
                     }
                 }
                 // frameguard: {
                 //     action: 'deny'
                 // }
             }
         ));*/

        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(passport.initialize());
        // const options:cors.CorsOptions = {
        //     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
        //     credentials: true,
        //     methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        //     origin: '*',
        //     preflightContinue: false
        // };

//use cors middleware
//         this.app.use(cors(options));
    }


}

export default new Server().app;
