function getCookie(variableName: string): string | undefined {
    return ("; " + document.cookie).split(`; ${variableName}=`).pop()?.split(";")[0];
}
// https://stackoverflow.com/a/59603055

function getSpotifyToken(): string | never {
    const token: string | undefined = getCookie("spotify_access_token");
    if (token) {
        return token;
    }
    throw Error("Cookie could not be found!");
}

interface TrackData {
    paused: boolean;
    lastTrackID: string | null;
    currentTrackID: string | null;
};

let trackData: TrackData = {
    paused: false,
    lastTrackID: null,
    currentTrackID: null
};

function observeTrackState(state: Spotify.PlaybackState): void {
    const currentTrackID: string | null = state.track_window.current_track.id;
    if (state.paused) {
        trackData.paused = true;
    }
    if (trackData.currentTrackID !== currentTrackID) {
        trackData.lastTrackID = trackData.currentTrackID;
        trackData.currentTrackID = currentTrackID;
    }
}

window.onSpotifyWebPlaybackSDKReady = async (): Promise<void> => {
    const player: Spotify.Player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken(cb: (token: string) => any): void {
            cb(getSpotifyToken());
        },
        volume: 0
    });

    player.on("ready", (): void => {
        console.log("Spotify Player Ready");
    });

    player.on("player_state_changed", (state: Spotify.PlaybackState): void => {
        console.log(state);
    });

    await player.connect();
};