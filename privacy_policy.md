#Privacy Policy

**_tl:dr;_** this app physically can't store your data so I don't ever see it.

This Angular-based web app was inspired by my (Mark Hisle) desire to liven up my daily commute with a fresh new song recommended by Spotify's publicly available API. [This API](https://developer.spotify.com/documentation/web-api/) is a free-to-use data source that constantly updates itself based upon your past music consumption on the app, as well as Spotify's algorithms designed to determine which songs they believe best match your current styles and preferences.

<br />

Spotify "Song of the day" temporarily requests an access token from Spotify's secure servers to allow this app to query your top 3 favorite songs and favorite artist. Using this information, it then makes a request back to Spotify to see what song it would recommend you based on random indices that are similar to those 4 pieces of information.

While I eventually plan to create a feature to anonymously store the song suggestions for the user of this app to create private playlists, it **does not** at this time have any means of permanently recording your data. This app does not and will not have any means to look into the personal data of your profilen and additionally has no authorization from Spotify to even do so.

Any song suggestion you see from your app is local to your browser only, and any data loaded is immediately deleted once you close the tab displaying this application. Additionally, the access token to your account retrieved by this app expires about 4 seconds after you have stopped requesting data from Spotify in this app. I have no way of viewing/storing this token and will never be able to use it with Spotify on my own.

This app is used only for entertainment purposes, and I have no intention of ever using it to make money.
