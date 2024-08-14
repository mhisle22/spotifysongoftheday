import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { AWSService } from '../services/aws.service';
import { UsersPlaylistSong } from '../song-widget/interfaces/users-playlist-song.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
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
  loaded: boolean = false;
  isDone: boolean = false;

  displayedColumns: string[] = ['position', 'song', 'artist', 'timestamp'];
  @ViewChild(MatSort) sort: MatSort;

  private _authToken: string;
  get authToken(): string {
    return this._authToken;
  }
  set authToken(value: string) {
    this._authToken = value;
  }

  constructor(private awsService: AWSService,
              private sessionStorage: SessionStorageService,
              private spotifyService: SpotifyRequestService,
              private authService: AuthenticateService) { 
  }

  ngOnInit() {
    if (environment.version === 'qa') {
      this.setSongs(environment.playlistSongs);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
    } else {
      this.awsService.query(this.sessionStorage.get('id')).subscribe({
        next: (data) => {
          if (data.Items) {
            data.Items.forEach((element: any) => {
              this.playlistSongs.push({
                username: atob(String(element.username)),
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
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
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
    // probably a prettier way to do this buuuuut
    for (let i = 1; i <= songs.length; i++) {
      songs[i-1].position = i;

      // need to format this the horrible way because of compatibility issues with Date objects
      let date = songs[i-1].timestamp.toString();
      date = date.substring(0, date.indexOf(' '));
      const nonYear = date.substring(date.indexOf('-') + 1);
      const year = date.substring(0, date.indexOf('-'));
      date = nonYear + '-' + year;
      songs[i-1].timestamp = date;

    }
    this.playlistSongs = songs;
    this.dataSource = new MatTableDataSource(this.playlistSongs);
    this.loaded = true;
  }

  querySongs(id: string) {
    return this.awsService.query(id);
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
        this.spotifyService.createPlaylist(this.authToken, this.sessionStorage.get('id'))),
      tap(playlistName =>
        this.setPlaylist(playlistName.id)),
      switchMap(() => 
        this.spotifyService.addToPlaylist(this.authToken, this.playlistSongs, this.playlistName)),
      tap(() =>
        this.setDone(true)),
      catchError(async (err) => console.log(err))
    ).subscribe();
  }

}
