import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'angular-web-storage';


export interface SpotifySongResponse {
  spotify_link: string;
  song: string;
  artist: string;
  image_link: string;
}

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

  public getSongRecommendations(authToken: string, favoriteTracks: string, favoriteArtists: string) {
     const url =
      'https://api.spotify.com/v1/recommendations?limit=1&market=US&seed_artists='
      + favoriteArtists + '&seed_genres=*&seed_tracks=' + favoriteTracks;

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
          image_link: track.album.images[0].url
        };
        }) as SpotifySongResponse[];}))
  }


}