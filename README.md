### Spotify Display
---
Originally intended to be created as a Browser widget for OBS to display information about the current track being played, some issues appeared when connecting the local Web Player specifically within OBS. spotify_display fulfills its aforementioned purpose but rather simply within localhost.

*Note: spotify_display only works with Premium Spotify accounts per Spotify Web SDK requirements*

### How To Use
---
```
git clone https://github.com/taeyangcode/spotify_display/
cd spotify_display

# Add Spotify client credentials - Required fields can be found in environment/.env.spotify.example
touch environment/.env.spotify

# Compilation of program requires usage of copyfiles npm package
npm run build
npm start

# Navigate to http://localhost:3000/
```