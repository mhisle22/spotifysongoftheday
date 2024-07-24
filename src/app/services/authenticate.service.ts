import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SessionStorageService} from 'angular-web-storage';
import { SpotifyAuthResponse } from "../song-widget/interfaces/spotify-auth-response.interface";

const CLIENT_ID = '5afa66ec3eda4ecbb2e3d82139819866'; // ref for Spotify's api
const uri = 'https://d2fd856v8ttd1y.cloudfront.net/spotifysongoftheday/'; // Cloudfront url

const httpHeader = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

@Injectable()
export class AuthenticateService {

  constructor(private sessionStorage: SessionStorageService,
              private httpClient: HttpClient) {
  }

  public getAccessToken(authToken: string) {
    const body = new HttpParams()
      .set('client_id', CLIENT_ID)
      .set('grant_type', 'authorization_code')
      .set('code', authToken) // as an FYI, they are handling the code verifier checking, no need for me to do it
      .set('code_verifier', this.sessionStorage.get('verifier'))
      .set('redirect_uri', uri);

    return this.httpClient
      .post<any>('https://accounts.spotify.com/api/token', body, httpHeader)
      .pipe(map(response => ({
        authToken: response.access_token,
        refresh: response.refresh_token
      }) as SpotifyAuthResponse));

  }

  public refreshAccessToken(refreshToken: string) {
    const body = new HttpParams()
      .set('client_id', CLIENT_ID)
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);

    return this.httpClient
      .post<any>('https://accounts.spotify.com/api/token', body, httpHeader)
      .pipe(map(response => ({
        authToken: response.access_token,
        refresh: response.refresh_token
      }) as SpotifyAuthResponse));

  }

}
