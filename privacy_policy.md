# Privacy Policy

This Angular-based web app was inspired by my (Mark Hisle) desire to liven up my daily commute with a fresh new song recommended by Spotify's publicly available API. [This API](https://developer.spotify.com/documentation/web-api/) is a free-to-use data source that constantly updates itself based upon your past music consumption on the app, as well as Spotify's algorithms designed to determine which songs they believe best match your current styles and preferences.

<br />

This app has been approved by the Spotify organization itself as safe and inline with their [current development guidlines](https://developer.spotify.com/policy/). If for whatever reason this app were to breach any of Spotify's privacy policies, it would immediately be taken down by their site.

Spotify "Song of the Day" temporarily requests an access token from Spotify's secure servers to allow this app to query your top 3 favorite songs and favorite artist. Using this information, it then makes a request back to Spotify to see what songs it would recommend you based on random indices that are similar to those 4 pieces of information.

The only data stored by this site are an encoded form of a user's username and the corresponding song suggestions created on this site. As the username is encoded, you cannot actually see which username corresponds to which songs. Other than the encoded username, there is no personal information on any user of this app sotred in any location, keeping you far from a compromised point, which would require your email (never seen) as well as a password and phone number, which cannot be accessed through the Spotify API. Additionally, all data is stored in the highly-secure Amazon Web Services DynamoDB system. Assuming that no one can break into Amazon, no one will be able to break into your information.

Any song suggestion you see from your app is local to your browser only, and any data loaded is immediately deleted once you close the tab displaying this application. Additionally, the access token to your account retrieved by this app expires about 4 seconds after you have stopped requesting data from Spotify in this app. I have no way of viewing/storing this token and will never be able to use it with Spotify on my own.

This app is used only for entertainment purposes, and I have no intention of ever using it to make money.
