import { EnvHelper } from "../env/env-helper.js";
import crypto from "crypto";
import { Request, Response } from "express";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

interface OAuthParameters {
    scope: string;
    state: string;
    client_id: string;
    response_type: string;
    redirect_uri: string;
};

interface OAuthData {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
};

export class Authorization {
    private constructor() { }

    private static randomString(length: number): string {
        return crypto.randomBytes(length / 2).toString("hex");
        // https://stackoverflow.com/a/27747377
    }

    private static oauthParameters(): OAuthParameters {
        const scopes: string = "user-modify-playback-state user-read-playback-state user-read-currently-playing user-read-recently-played user-read-playback-position user-top-read app-remote-control streaming user-read-email user-read-private user-library-modify user-library-read"
        return {
            scope: scopes,
            state: this.randomString(16),
            client_id: EnvHelper.getSpotifyClientId(),
            response_type: "code",
            redirect_uri: "http://localhost:3000/handler/"
        };
    } 

    private static searchParameters(): URLSearchParams {
        const result: URLSearchParams = new URLSearchParams();
        const parameters: OAuthParameters = this.oauthParameters();

        for (const [variable, value] of Object.entries(parameters)) {
            result.append(variable, value);
        }
        return result;
    }

    public static requestOAuthData(response: Response): void {
        const parameters: URLSearchParams = this.searchParameters();

        const spotifyRedirectUrl: string = "https://accounts.spotify.com/authorize?";
        // Implement callback error check here!
        response.redirect(spotifyRedirectUrl + parameters.toString());
    }

    private static getAccessTokenRequestOptions(code: string): Object {
        const [client_id, client_secret]: [string, string] = [EnvHelper.getSpotifyClientId(), EnvHelper.getSpotifyClientSecret()];
        
        // Format: Basic {client_id}:{client_secret}
        const authorization: string = `Basic ${Buffer.from(client_id + ":" + client_secret).toString("base64")}`;

        const headers: HeadersInit = {
            "Authorization": authorization,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const body: URLSearchParams = new URLSearchParams({
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

    private static async oauthDataRequest(request: Request): Promise<Record<string, any>> {
        const code: string | undefined = request.query["code"]?.toString(); 
        const state: string | undefined = request.query["state"]?.toString(); 

        if (typeof code === "undefined") {
            throw Error("Invalid Spotify query code.");
        }
        if (typeof state === "undefined") {
            throw Error("Invalid Spotify query state.")
        }

        const url: string = "https://accounts.spotify.com/api/token";
        const options: Object = this.getAccessTokenRequestOptions(code);

        return await fetch(url, options);
    }

    public static async getOAuthData(request: Request): Promise<OAuthData> {
        const oauthResponse: Record<string, any> = await this.oauthDataRequest(request);
        const json: Record<string, any> = await oauthResponse.json();

        return {
            "access_token": json["access_token"],
            "token_type": json["token_type"],
            "scope": json["scope"],
            "expires_in": json["expires_in"],
            "refresh_token": json["refresh_token"]
        };
    }
}