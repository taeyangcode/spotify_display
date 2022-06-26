import express from "express";
import { Authorization } from "../spotify/authorization.js";
export class Server {
    _PORT;
    _APP;
    constructor(port) {
        this._PORT = port;
    }
    publicDirectoryPath() {
        return `${process.cwd()}/build/public`;
    }
    createServer() {
        this._APP = express();
        this._APP.listen(this._PORT, () => {
            console.log(`spotify_display working on port: ${this._PORT}`);
        });
        this._APP.use(express.static(this.publicDirectoryPath()));
        this.homeEndpoint(this._APP);
        this.handlerEndpoint(this._APP);
    }
    homeEndpoint(app) {
        app.get("/", (request, response) => {
            Authorization.requestOAuthData(response);
        });
    }
    handlerEndpoint(app) {
        app.get("/handler", async (request, response) => {
            const data = await Authorization.getOAuthData(request);
            response.cookie("spotify_access_token", data["access_token"]);
            response.redirect("http://localhost:3000/home.html");
        });
    }
}
//# sourceMappingURL=server.js.map