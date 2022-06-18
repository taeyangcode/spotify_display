import express from "express";
import { Authorization } from "../spotify/authorization.js";
export class Server {
    _PORT;
    _APP;
    constructor(port) {
        this._PORT = port;
    }
    createServer() {
        this._APP = express();
        this._APP.listen(this._PORT, () => {
            console.log(`spotify_display working on port: ${this._PORT}`);
        });
        this.homeEndpoint(this._APP);
        this.handlerEndpoint(this._APP);
    }
    homeEndpoint(app) {
        app.get("/", (request, response) => {
            Authorization.requestOAuthData(response);
        });
    }
    handlerEndpoint(app) {
        app.get("/handler", (request, response) => {
            Authorization.OAuthCallback(request, response);
        });
    }
}
//# sourceMappingURL=server.js.map