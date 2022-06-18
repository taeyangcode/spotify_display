import express, { Express, Request, Response } from "express";
import { Authorization } from "../spotify/authorization";

export class Server {
    private _PORT: number;

    private _APP: Express | undefined; 

    public constructor(port: number) {
        this._PORT = port;
    }

    public createServer(): void {
        this._APP = express();

        this._APP.listen(this._PORT, (): void => {
            console.log(`spotify_display working on port: ${this._PORT}`)
        });

        this.homeEndpoint(this._APP);
    }

    private homeEndpoint(app: Express): void {
        app.get("/", (request: Request, response: Response): void => {
            Authorization.requestOAuthData(response);
        });
    }
}