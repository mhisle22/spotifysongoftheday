import { Component, Inject, Input, OnInit } from '@angular/core';
import { trigger, style, animate, transition, state, AnimationEvent } from "@angular/animations";
import { switchMap, tap, catchError } from 'rxjs/operators';
import { SessionStorageService } from 'angular-web-storage';
import { SpotifyRequestService } from '../services/spotify-request.service';
import { AuthenticateService } from '../services/authenticate.service';
import { SpotifySongResponse } from './interfaces/spotify-song-response.interface';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { AWSService } from '../services/aws.service';
import { Router } from '@angular/router';

const limitSongs: number = 5; // 0 < limitsSongs < 25, since DynamoDB can only add 25 at once

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
        animate('1s 0.5s'),
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
  id: string;

  errorMessage: string;

  // animation bools
  isIn: boolean = true;
  showTitle: boolean = true;
  showUp: boolean = false;
  showDown: boolean = true;
  top: boolean = false;
  bottom: boolean = false;

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
              private spotifyService: SpotifyRequestService,
              private authService: AuthenticateService,
              private awsService: AWSService,
              private router: Router) { }

  ngOnInit(): void {
    if (environment.version === 'qa') {
      this.setSongData(environment.songs, 0);
      this.storeSongs(environment.songs, environment.userID);
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
      switchMap(() => this.spotifyService.getUserID(this.authToken)),
      tap(profile =>
          this.setID(profile)),  
      switchMap(() =>
        this.spotifyService.getSongRecommendations(this.authToken, this.favoriteSongs, this.favoriteArtists, limitSongs)),
      tap(value => {
        this.setSongData(value, this.position);
        this.storeSongs(value, this.id);
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
      switchMap(() => this.spotifyService.getUserID(this.authToken)),
      tap(profile =>
          this.setID(profile)),
      switchMap(() =>
        this.spotifyService.getSongRecommendations(this.authToken, this.favoriteSongs, this.favoriteArtists, limitSongs)),
      tap(value => {
        this.setSongData(value, this.position);
        this.storeSongs(value, this.id);
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

  private setID(response: any) {
    this.id = response.id;
  }

  private setSongData(values: SpotifySongResponse[], index: number) {
    this.songs = values;
    this.spotify_link = values[index].spotify_link;
    this.image_link = values[index].image_link;
    this.song = values[index].song;
    this.long_song = values[index].song.length > 20;
    this.artist = values[index].artist;
  }

  private storeSongs(values: SpotifySongResponse[], id: string) {
    // add to dynamodb table for user
    this.awsService.insertSongs(values, id, limitSongs);
  }

  back() {
    this.sessionStorage.set('refresh_token', null); // uncommon, but delete token if they deny after previously accepting
    this.document.location.href = 'https://mhisle22.github.io/spotifysongoftheday/';
  }

  // ----------------------------------------------
  // --- song scrolling animation functions below ---

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
        this.bottom = true;
      }
      else if (this.position == 0) { // top
        this.top = true;
      }
      else { // middle
        this.showDown = true;
        this.showUp = true;
        this.top = false;
        this.bottom = false;
      }
    }
  }

  goToPlaylist() {
    this.isIn = false;
    this.router.navigate(['/playlist'], {state: { data: {'id': this.id} }});
  }

}
