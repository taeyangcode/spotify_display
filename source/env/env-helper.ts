import { config } from "dotenv";

export class EnvHelper {
    private constructor() { }

    public static envConfig(envFileName: string): void {
        const path: string = `${process.cwd()}/environment/${envFileName}`;
        config({ path });
    }

    private static getValue(variable: string): string | never {
        const data: string | undefined = process.env[variable];
        if (typeof data === "undefined") {
            throw Error(`${variable} environment variable was not supplied.`);
        }
        return data;
    }

    public static getSpotifyClientId(): string {
        return this.getValue("SPOTIFY_CLIENT_ID");
    } 

    public static getSpotifyClientSecret(): string | undefined {
        return this.getValue("SPOTIFY_CLIENT_SECRET");
    }
}