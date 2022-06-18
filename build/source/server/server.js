"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../spotify/authorization");
class Server {
    _PORT;
    _APP;
    constructor(port) {
        this._PORT = port;
    }
    createServer() {
        this._APP = (0, express_1.default)();
        this._APP.listen(this._PORT, () => {
            console.log(`spotify_display working on port: ${this._PORT}`);
        });
        this.homeEndpoint(this._APP);
    }
    homeEndpoint(app) {
        app.get("/", (request, response) => {
            authorization_1.Authorization.requestOAuthData(response);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map