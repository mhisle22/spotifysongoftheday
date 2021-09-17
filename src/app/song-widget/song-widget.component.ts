import { Component, Inject, Input, OnInit } from '@angular/core';
import { trigger, style, animate, transition, state, AnimationEvent } from "@angular/animations";
import { HttpClient } from '@angular/common/http';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { SessionStorageService } from 'angular-web-storage';
import { SpotifyRequestService } from '../services/spotify-request.service';
import { AuthenticateService } from '../services/authenticate.service';
import { SpotifySongResponse } from './interfaces/spotify-song-response.interface';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';

const limitSongs: number = 5;

@Component({
  selector: 'ng-song-widget',
  templateUrl: './song-widget.component.html',
  styleUrls: ['./song-widget.component.scss'],
  animations: [
    trigger('nextSong', [

      state('in', style({
        opacity: 1
      })),
      state('out', style({
        opacity: 0,
      })),

      transition('in => out', [
        animate('1s'),
      ]),
      transition('out => in', [
        animate('1s'),
      ])
    ])
  ]
})
export class SongWidgetComponent implements OnInit {

  favoriteSongs: string; // actually a concat of these song's IDs
  favoriteArtists: string; // ditto
  songs: SpotifySongResponse[];
  position: number = 0;

  spotify_link: string;
  image_link: string;
  song: string;
  long_song: boolean; // calculate whether to bump down font size
  artist: string;

  errorMessage: string;

  // animation bools
  isIn: boolean = true;
  showTitle: boolean = true;
  showUp: boolean = false;
  showDown: boolean = true;
  top: boolean = false;

  private _authToken: string;
  get authToken(): string {
    return this._authToken;
  }
  @Input()
  set authToken(value: string) {
    this._authToken = value;
  }


  constructor(@Inject(DOCUMENT) private document: Document,
              private sessionStorage: SessionStorageService,
              private httpClient: HttpClient,
              private spotifyService: SpotifyRequestService,
              private authService: AuthenticateService) { }

  ngOnInit(): void {
    if (environment.version === 'qa') {
      this.setSongData(environment.songs, 0);
    }
    else if (!!this.sessionStorage.get('refresh_token')) { // check if refresh token available
      this.retrieveSongRefresh();
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
        this.spotifyService.getSongRecommendations(this.authToken, this.favoriteSongs, this.favoriteArtists, limitSongs)),
      tap(value => {
        this.setSongData(value, this.position);
      }),
      catchError(err => this.errorMessage = err)
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
        this.spotifyService.getSongRecommendations(this.authToken, this.favoriteSongs, this.favoriteArtists, limitSongs)),
      tap(value => {
        this.setSongData(value, this.position);
      }),
      catchError(err => this.errorMessage = err)
    ).subscribe();
  }

  private setAuthTokens(data: any) {
    this.authToken = data.authToken;
    this.sessionStorage.set('refresh_token', data.refresh);
  }

  // once I make this modular, take in a number for this (v1.3)
  private setFavoriteSongs(response: any) {
    this.favoriteSongs =
      response.items[0].id + '%2C' + response.items[1].id + '%2C' + response.items[2].id;
  }

  // once I make this modular, take in a number for this (v1.3)
  private setFavoriteArtists(artists: any) {
    this.favoriteArtists = artists.items[0].id;
  }

  private setSongData(values: SpotifySongResponse[], index: number) {
    this.songs = values;
    this.spotify_link = values[index].spotify_link;
    this.image_link = values[index].image_link;
    this.song = values[index].song;
    this.long_song = values[index].song.length > 20;
    this.artist = values[index].artist;
  }

  back() {
    this.sessionStorage.set('refresh_token', null); // uncommon, but delete token if they deny after previously accepting
    this.document.location.href = 'https://mhisle22.github.io/spotifysongoftheday/';
  }

  // ----------------------------------------------
  // ---song scrolling animation functions below---

  goDown() {
    this.isIn = false;
    this.position++;
  }

  goUp() {
    this.isIn = false;
    this.position--;
  }

  nextSong(event: AnimationEvent) {
    // only run after the fadeout. Or in. You get the point
    if (event.fromState === 'in') {
      this.setSongData(this.songs, this.position);
      this.showTitle = false;
      this.isIn = true;

      if (this.position == limitSongs - 1) { // bottom
        this.showDown = false;
      }
      else if (this.position == 0) { // top
        this.top = true;
      }
      else { // middle
        this.showDown = true;
        this.showUp = true;
        this.top = false;
      }
    }
  }


}
