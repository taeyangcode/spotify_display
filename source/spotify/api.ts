import fetch from "node-fetch";

export async function currentTrackData(token: string): Promise<Record<string, any>> {
    const endpoint: string = "https://api.spotify.com/v1/me/player/currently-playing";
    const headers: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    return await (await fetch(endpoint, { method: "GET", headers })).json() as Record<string, any>;
}