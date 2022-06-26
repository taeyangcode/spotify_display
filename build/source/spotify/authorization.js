import { EnvHelper } from "../env/env-helper.js";
import crypto from "crypto";
import fetch from "node-fetch";
import { URLSearchParams } from "url";
;
;
export class Authorization {
    constructor() { }
    static randomString(length) {
        return crypto.randomBytes(length / 2).toString("hex");
        // https://stackoverflow.com/a/27747377
    }
    static oauthParameters() {
        const scopes = "user-modify-playback-state user-read-playback-state user-read-currently-playing user-read-recently-played user-read-playback-position user-top-read app-remote-control streaming user-read-email user-read-private user-library-modify user-library-read";
        return {
            scope: scopes,
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
    static getAccessTokenRequestOptions(code) {
        const [client_id, client_secret] = [EnvHelper.getSpotifyClientId(), EnvHelper.getSpotifyClientSecret()];
        // Format: Basic {client_id}:{client_secret}
        const authorization = `Basic ${Buffer.from(client_id + ":" + client_secret).toString("base64")}`;
        const headers = {
            "Authorization": authorization,
            "Content-Type": "application/x-www-form-urlencoded"
        };
        const body = new URLSearchParams({
            "grant_type": "authorization_code",
            code,
            "redirect_uri": "http://localhost:3000/handler/"
        });
        return {
            method: "POST",
            headers,
            body
        };
    }
    static async oauthDataRequest(request) {
        const code = request.query["code"]?.toString();
        const state = request.query["state"]?.toString();
        if (typeof code === "undefined") {
            throw Error("Invalid Spotify query code.");
        }
        if (typeof state === "undefined") {
            throw Error("Invalid Spotify query state.");
        }
        const url = "https://accounts.spotify.com/api/token";
        const options = this.getAccessTokenRequestOptions(code);
        return await fetch(url, options);
    }
    static async getOAuthData(request) {
        const oauthResponse = await this.oauthDataRequest(request);
        const json = await oauthResponse.json();
        return {
            "access_token": json["access_token"],
            "token_type": json["token_type"],
            "scope": json["scope"],
            "expires_in": json["expires_in"],
            "refresh_token": json["refresh_token"]
        };
    }
}
//# sourceMappingURL=authorization.js.map