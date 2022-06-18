"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = void 0;
const env_helper_1 = require("../env/env-helper");
const crypto_1 = __importDefault(require("crypto"));
;
class Authorization {
    constructor() { }
    static randomString(length) {
        return crypto_1.default.randomBytes(length / 2).toString("hex");
        // https://stackoverflow.com/a/27747377
    }
    static oauthParameters() {
        return {
            scope: "user-read-currently-playing",
            state: this.randomString(16),
            client_id: env_helper_1.EnvHelper.getSpotifyClientId(),
            response_type: "code",
            redirect_uri: "http://localhost:3000/next/"
        };
    }
    static searchParameters() {
        const result = new URLSearchParams();
        const parameters = this.oauthParameters();
        for (const [variable, value] of Object.entries(parameters)) {
            result.append(variable, value);
        }
        return result;
    }
    static requestOAuthData(response) {
        const parameters = this.searchParameters();
        const spotifyRedirectUrl = "https://accounts.spotify.com/authorize?";
        // Implement callback error check here!
        response.redirect(spotifyRedirectUrl + parameters.toString());
    }
}
exports.Authorization = Authorization;
//# sourceMappingURL=authorization.js.map