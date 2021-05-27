import {Component, Input, OnInit} from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {switchMap, tap} from 'rxjs/operators';
import {SessionStorageService} from 'angular-web-storage';
import {SpotifyRequestService} from './spotify-request.service';
import {AuthenticateService} from './authenticate.service';

export interface SpotifySongResponse {
  spotify_link: string;
  song: string;
  artist: string;
  image_link: string;
}

@Component({
  selector: 'ng-song-widget',
  templateUrl: './song-widget.component.html',
  styleUrls: ['./song-widget.component.scss']
})
export class SongWidgetComponent implements OnInit {

  favoriteSongs: string; // actually a concat of these song's IDs
  favoriteArtists: string; // ditto
  songs: SpotifySongResponse[];

  spotify_link: string;
  image_link: string;
  song: string;
  long_song: boolean; // calculate whether to bump down font size
  artist: string;


  private _authToken: string;
  get authToken(): string {
    return this._authToken;
  }
  @Input()
  set authToken(value: string) {
    this._authToken = value;
  }


  constructor(private sessionStorage: SessionStorageService,
              private httpClient: HttpClient,
              private spotifyService: SpotifyRequestService,
              private authService: AuthenticateService) { }

  ngOnInit(): void {
    console.log('Auth token: ' + this.authToken);

    // check if refresh token available
    if (!!this.sessionStorage.get('refresh_token')) {
      console.log(this.sessionStorage.get('refresh_token'));
      this.retrieveSongRefresh()
    }
    else {
      this.retrieveSong();
    }

  }

  private retrieveSong() {
    this.authService.getAccessToken(this.authToken).pipe(
      tap(data =>
        this.setAuthTokens(data)),
      switchMap(() => this.spotifyService.getFavoriteSongs(this.authToken)),
      tap(response =>
        this.setFavoriteSongs(response)),
      switchMap(() => this.spotifyService.getFavoriteArtists(this.authToken)),
      tap(artists =>
        this.setFavoriteArtists(artists)),
      switchMap(() =>
        this.spotifyService.getSongRecommendations(this.authToken, this.favoriteSongs, this.favoriteArtists)),
      tap(value => {
        this.setSongData(value);
      })
    ).subscribe();
  }

  private retrieveSongRefresh() {
    this.authService.refreshAccessToken(this.sessionStorage.get('refresh_token')).pipe(
      tap(data =>
        this.setAuthTokens(data)),
      switchMap(() => this.spotifyService.getFavoriteSongs(this.authToken)),
      tap(response =>
        this.setFavoriteSongs(response)),
      switchMap(() => this.spotifyService.getFavoriteArtists(this.authToken)),
      tap(artists =>
        this.setFavoriteArtists(artists)),
      switchMap(() =>
        this.spotifyService.getSongRecommendations(this.authToken, this.favoriteSongs, this.favoriteArtists)),
      tap(value => {
        this.setSongData(value);
      })
    ).subscribe();
  }

  private setAuthTokens(data: any) {
    this.authToken = data.authToken;
    this.sessionStorage.set('refresh_token', data.refresh);
  }

  // once I make this modular, take in a number for this
  private setFavoriteSongs(response: any) {
    this.favoriteSongs =
      response.items[0].id + '%2C' + response.items[1].id + '%2C' + response.items[2].id;
  }

  // once I make this modular, take in a number for this
  private setFavoriteArtists(artists: any) {
    this.favoriteArtists = artists.items[0].id;
  }

  private setSongData(values: SpotifySongResponse[]) {
    this.songs = values;
    this.spotify_link = values[0].spotify_link;
    this.image_link = values[0].image_link;
    this.song = values[0].song;
    this.long_song = values[0].song.length > 20;
    this.artist = values[0].artist;
  }

}