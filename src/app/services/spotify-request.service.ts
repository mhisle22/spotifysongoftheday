import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'angular-web-storage';
import { SpotifySongResponse } from "../song-widget/interfaces/spotify-song-response.interface";
import { UsersPlaylistSong } from '../song-widget/interfaces/users-playlist-song.interface';


@Injectable()
export class SpotifyRequestService {

  constructor(private localStorage: LocalStorageService,
              private httpClient: HttpClient) {
  }

  public getFavoriteSongs(authToken: string) {
    const url = 'https://api.spotify.com/v1/me/top/tracks?limit=3';

    const curlHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authToken
      })
    };

    return this.httpClient.get<any>(url, curlHeader);
  }

  public getFavoriteArtists(authToken: string) {
    const url = 'https://api.spotify.com/v1/me/top/artists?limit=1';

    const curlHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authToken
      })
    };

    return this.httpClient.get<any>(url, curlHeader);
  }

  public getUserID(authToken: string) {
    const url = 'https://api.spotify.com/v1/me';

    const curlHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authToken
      })
    };

    return this.httpClient.get<any>(url, curlHeader);
  }

  public getSongRecommendations(authToken: string, favoriteTracks: string, favoriteArtists: string, limitSongs: number) {
    const url =
      'https://api.spotify.com/v1/recommendations?limit=' + limitSongs +
      '&market=US&seed_artists=' + favoriteArtists + 
      '&seed_genres=*&seed_tracks=' + favoriteTracks +
      '&min_popularity=55&max_popularity=80';

    const curlHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authToken
      })
    };

    return this.httpClient.get<any>(url, curlHeader)
      .pipe(map( value => {
        return value.tracks.map( (track: any) => { return {
          spotify_link: track.external_urls.spotify,
          song: track.name,
          artist: track.artists[0].name,
          image_link: track.album.images[0].url,
          uri: track.uri
        };
        }) as SpotifySongResponse[];}))
  }

  public createPlaylist(authToken: string, username: string) {

    const url = 'https://api.spotify.com/v1/users/' + username + '/playlists';

    const options = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authToken
      })
    ;

    const body = {
        'name': 'SpotifySongOfTheDay Playlist ' + new Date().toLocaleDateString(),
        'description': 'All your songs suggested by the Spotify Song of the Day app!',
        'public': false
    };

    return this.httpClient.post<any>(url, body, {headers: options});
  }

  public addToPlaylist(authToken: string, songs: UsersPlaylistSong[], playlistName: string) {

    let url = 'https://api.spotify.com/v1/playlists/' + playlistName + '/tracks';

    let playlist: String[] = [];

    // add all formerly suggested songs
    songs.forEach(song => {
      playlist.push(song.URI);
    });

    // send this as a body, since the spotify API has a nasty habit of cutting the query off if it's too big
    const body = {'uris': playlist};

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authToken
      })
    };

    return this.httpClient.post<any>(url, body, options);
  }

}
