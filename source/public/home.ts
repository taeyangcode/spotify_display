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

interface PlayerElements {
    albumCover: HTMLImageElement;
    trackTitle: HTMLSpanElement;
    trackArtists: HTMLSpanElement;
};

function getPlayerElements(): PlayerElements | never {
    const albumCover: HTMLImageElement | null = document.querySelector("#album-cover-image");
    const trackTitle: HTMLSpanElement | null = document.querySelector("#track-title");
    const trackArtists: HTMLSpanElement | null = document.querySelector("#track-artists");

    if (!albumCover || !trackTitle || !trackArtists) {
        throw Error("Could not locate Player Element(s)!");
    }
    return {
        albumCover,
        trackTitle,
        trackArtists
    };
}

function changeTrackDetails(albumImageLink: string, trackTitle: string, trackArtists: string[]): void { 
    const playerElements: PlayerElements = getPlayerElements();
    playerElements.albumCover.src = albumImageLink;
    playerElements.trackTitle.textContent = trackTitle;
    playerElements.trackArtists.textContent = trackArtists.join(", ");
}

function observeTrackState(state: Spotify.PlaybackState): void {
    if (state.track_window.current_track.id === null || state.paused) {
        return;
    }

    const albumImageLink: string = state.track_window.current_track.album.images[0].url;
    const trackName: string = state.track_window.current_track.name;
    const trackArtists: string[] = state.track_window.current_track.artists.map((artist: Spotify.Artist) => artist.name);
    changeTrackDetails(albumImageLink, trackName, trackArtists);
}

window.onSpotifyWebPlaybackSDKReady = async (): Promise<void> => {
    const player: Spotify.Player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken(cb: (token: string) => any): void {
            cb(getSpotifyToken());
        },
        volume: 0.5
    });

    player.on("ready", (): void => {
        console.log("Spotify Player Ready");
    });

    player.on("player_state_changed", (state: Spotify.PlaybackState): void => {
        observeTrackState(state);
    });

    await player.connect();
};