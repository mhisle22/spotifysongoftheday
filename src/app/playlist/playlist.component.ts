import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { AWSService } from '../services/aws.service';
import { UsersPlaylistSong } from '../song-widget/interfaces/users-playlist-song.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { SpotifyRequestService } from '../services/spotify-request.service';
import { AuthenticateService } from '../services/authenticate.service';
import { catchError, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {

  playlistSongs: UsersPlaylistSong[] = [];
  dataSource: MatTableDataSource<UsersPlaylistSong>;
  playlistName: string;
  isDone: boolean = false;

  displayedColumns: string[] = ['position', 'song', 'artist', 'timestamp'];
  @ViewChild(MatSort) sort: MatSort;

  private _authToken: string;
  get authToken(): string {
    return this._authToken;
  }
  @Input()
  set authToken(value: string) {
    this._authToken = value;
  }

  constructor(private AwsService: AWSService,
              private sessionStorage: SessionStorageService,
              private route: ActivatedRoute,
              private spotifyService: SpotifyRequestService,
              private authService: AuthenticateService) { 
  }

  ngOnInit() {
    if (environment.version === 'qa') {
      this.setSongs(environment.playlistSongs);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
    }
    else { 
      this.querySongs(this.route.snapshot.data['id']).then(data => {if (data.Items) {
        data.Items.forEach((element) => {
          this.playlistSongs.push({
            username: element.username,
            URI: element.URI,
            artist: element.artist,
            link: element.link,
            song: element.song,
            timestamp: element.suggestTime,
            position: 0
          } as UsersPlaylistSong);
        });

        this.setSongs(this.playlistSongs);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });

      }}).catch(console.error);
    }
  }

  sortData(): void {
    switch (this.sort.direction) {
      case 'asc':
        this.sort.direction = 'asc';
        break;
      case 'desc':
        this.sort.direction = 'desc';
        break;
      default:
        this.sort.direction = 'asc';
    }
  }

  setSongs(songs: UsersPlaylistSong[]) {
    // probably a prettier way to do this
    for (let i = 1; i <= songs.length; i++) {
      songs[i-1].position = i;
    }
    this.playlistSongs = songs;
    this.dataSource = new MatTableDataSource(this.playlistSongs);
  }

  querySongs(id: string) {
    return this.AwsService.query(id);
  }

  private setAuthTokens(data: any) {
    this.authToken = data.authToken;
    this.sessionStorage.set('refresh_token', data.refresh);
  }

  private setPlaylist(name: string) {
    this.playlistName = name;
  }

  private setDone(done: boolean) {
    this.isDone = done;
  }

  addPlaylist() {
    // at this point it should need a refresh so don't use original token
    this.authService.refreshAccessToken(this.sessionStorage.get('refresh_token')).pipe(
      tap(data =>
        this.setAuthTokens(data)),
      switchMap(() => 
        this.spotifyService.createPlaylist(this.authToken, this.route.snapshot.data['id'])),
      tap(playlistName =>
        this.setPlaylist(playlistName)),
      switchMap(() => 
        this.spotifyService.addToPlaylist(this.authToken, this.playlistSongs, this.playlistName)),
      tap(done =>
        this.setDone(true)),
      catchError(async (err) => console.log(err))
    ).subscribe();
  }

}
