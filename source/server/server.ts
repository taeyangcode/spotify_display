import express, { Express, Request, Response } from "express";
import { Authorization } from "../spotify/authorization.js";

export class Server {
    private _PORT: number;

    private _APP: Express | undefined; 

    public constructor(port: number) {
        this._PORT = port;
    }

    private publicDirectoryPath(): string {
        return `${process.cwd()}/public`;
    }

    public createServer(): void {
        this._APP = express();

        this._APP.listen(this._PORT, (): void => {
            console.log(`spotify_display working on port: ${this._PORT}`)
        });

        this._APP.use(express.static(this.publicDirectoryPath()));

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
            response.cookie("spotify_access_token", data["access_token"]);
            response.redirect("http://localhost:3000/home.html");
        });
    }
}