"use strict";
function getCookie(variableName) {
    return ('; ' + document.cookie).split(`; ${variableName}=`).pop()?.split(';')[0];
}
// https://stackoverflow.com/a/59603055
function getSpotifyToken() {
    const token = getCookie("spotify_access_token");
    if (token) {
        return token;
    }
    throw Error("Cookie could not be found!");
}
;
let trackData = {
    paused: true,
    lastTrackID: null,
    currentTrackID: null
};
function observeTrackState(state) {
    const currentTrackID = state.track_window.current_track.id;
    if (state.paused) {
        trackData.paused = true;
    }
    if (trackData.currentTrackID !== currentTrackID) {
        trackData.lastTrackID = trackData.currentTrackID;
        trackData.currentTrackID = currentTrackID;
    }
}
window.onSpotifyWebPlaybackSDKReady = async () => {
    const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken(cb) {
            cb(getSpotifyToken());
        },
        volume: 0
    });
    player.on("ready", () => {
        console.log("READY");
    });
    player.on("player_state_changed", (state) => {
        console.log(state);
        // observeTrackState(state);
        // console.log(trackData);
    });
    await player.connect();
};
//# sourceMappingURL=home.js.map