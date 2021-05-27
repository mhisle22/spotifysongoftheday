import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SessionStorageService} from 'angular-web-storage';

const CLIENT_ID = '5afa66ec3eda4ecbb2e3d82139819866';
const uri = 'https://mhisle22.github.io/SongOfTheDay/';

const httpHeader = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
}

export interface SpotifyAuthResponse {
  authToken: string;
  tokenType: string;
  expires_in: number;
  refresh: string;
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
      .set('code', authToken)
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
