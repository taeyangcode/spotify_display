import { EnvHelper } from "../env/env-helper.js";
import crypto from "crypto";
import fetch from "cross-fetch";
;
export class Authorization {
    constructor() { }
    static randomString(length) {
        return crypto.randomBytes(length / 2).toString("hex");
        // https://stackoverflow.com/a/27747377
    }
    static oauthParameters() {
        return {
            scope: "user-read-currently-playing",
            state: this.randomString(16),
            client_id: EnvHelper.getSpotifyClientId(),
            response_type: "code",
            redirect_uri: "http://localhost:3000/handler/"
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
    static async OAuthCallback(request, response) {
        const code = request.query["code"]?.toString();
        const state = request.query["state"]?.toString();
        if (code === "undefined") {
            throw Error("Invalid Spotify query code.");
        }
        if (state === "undefined") {
            throw Error("Invalid Spotify query state.");
        }
        const client_id = EnvHelper.getSpotifyClientId();
        const client_secret = EnvHelper.getSpotifyClientSecret();
        const authorization = Buffer.from(client_id + ":" + client_secret).toString("base64");
        const headers = {
            "Authorization": authorization,
            "Content-Type": "application/x-www-form-urlencoded"
        };
        const url = "https://accounts.spotify.com/api/token";
        const body = new URLSearchParams();
        body.append("grant_type", "authorization_code");
        body.append("code", code);
        body.append("redirect_uri", "http://localhost:3000/handler/");
        const options = {
            method: "POST",
            headers,
            body: body.toString()
        };
        console.log(await fetch(url, options));
    }
}
//# sourceMappingURL=authorization.js.map