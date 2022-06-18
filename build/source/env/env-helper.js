"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvHelper = void 0;
const dotenv_1 = require("dotenv");
class EnvHelper {
    constructor() { }
    static envConfig(envFileName) {
        const path = `${process.cwd()}/environment/${envFileName}`;
        (0, dotenv_1.config)({ path });
    }
    static getValue(variable) {
        const data = process.env[variable];
        if (typeof data === "undefined") {
            throw Error(`${variable} environment variable was not supplied.`);
        }
        return data;
    }
    static getSpotifyClientId() {
        return this.getValue("SPOTIFY_CLIENT_ID");
    }
    static getSpotifyClientSecret() {
        return this.getValue("SPOTIFY_CLIENT_SECRET");
    }
}
exports.EnvHelper = EnvHelper;
//# sourceMappingURL=env-helper.js.map