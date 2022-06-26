import { config } from "dotenv";
export class EnvHelper {
    constructor() { }
    static envConfig(envFileName) {
        const path = `${process.cwd()}/environment/${envFileName}`;
        config({ path });
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
//# sourceMappingURL=env-helper.js.map