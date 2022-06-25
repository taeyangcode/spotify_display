import express, { Express, Request, Response } from "express";
import { currentTrackData } from "../spotify/api.js";
import { Authorization } from "../spotify/authorization.js";

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
        this.handlerEndpoint(this._APP);
    }

    private homeEndpoint(app: Express): void {
        app.get("/", (request: Request, response: Response): void => {
            Authorization.requestOAuthData(response);
        });
    }

    private handlerEndpoint(app: Express): void {
        app.get("/handler", async (request: Request, response: Response): Promise<void> => {
            const data = await Authorization.getOAuthData(request);
            await currentTrackData(data.access_token);
        });
    }
}