import { EnvHelper } from "../env/env-helper";
import crypto from "crypto";
import { Request, Response } from "express";

interface OAuthParameters {
    scope: string;
    state: string;
    client_id: string;
    response_type: string;
    redirect_uri: string;
};

export class Authorization {
    private constructor() { }

    private static randomString(length: number): string {
        return crypto.randomBytes(length / 2).toString("hex");
        // https://stackoverflow.com/a/27747377
    }

    private static oauthParameters(): OAuthParameters {
        return {
            scope: "user-read-currently-playing",
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

    private static toBase64(input: string): string {
        return Buffer.from(input).toString("base64");
    }

    public static async OAuthCallback(request: Request, response: Response): Promise<void | never> {
        const code: string | undefined = request.query["code"]?.toString(); 
        const state: string | undefined = request.query["state"]?.toString(); 

        if (code === "undefined") {
            throw Error("Invalid Spotify query code.");
        }
        if (state === "undefined") {
            throw Error("Invalid Spotify query state.")
        }

        const client_id: string = EnvHelper.getSpotifyClientId();
        const client_secret: string = EnvHelper.getSpotifyClientSecret();

        const authorization: string = `Basic ${this.toBase64(client_id + ":" + client_secret)}`;
        const content_type: string = "application/x-www-form-urlencoded";
        const headers: HeadersInit = {
            "Content-Type": content_type,
            "Authorization": authorization 
        };

        const url: string = "https://accounts.spotify.com/api/token";
        const body: URLSearchParams = new URLSearchParams();
        body.append("grant_type", "authorization_code");
        body.append("code", code!);
        body.append("redirect_uri", "http://localhost:3000/");


        const data = await fetch(url, {
            method: "POST",
            headers,
            body
        });
        console.log(data);
    }
}