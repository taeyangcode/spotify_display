import fetch from "node-fetch";
export async function currentTrackData(token) {
    const endpoint = "https://api.spotify.com/v1/me/player/currently-playing";
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
    return await (await fetch(endpoint, { method: "GET", headers })).json();
}
//# sourceMappingURL=api.js.map