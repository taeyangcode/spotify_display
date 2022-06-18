import { EnvHelper } from "../env/env-helper";
import crypto from "crypto";
import { Response } from "express";

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
            redirect_uri: "http://localhost:3000/next/"
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
}