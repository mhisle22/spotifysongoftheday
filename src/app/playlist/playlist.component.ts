import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { AWSService } from '../services/aws.service';
import { UsersPlaylistSong } from '../song-widget/interfaces/users-playlist-song.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {

  playlistSongs: UsersPlaylistSong[] = [];
  dataSource: MatTableDataSource<UsersPlaylistSong>;

  displayedColumns: string[] = ['position', 'song', 'artist', 'timestamp'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private AwsService: AWSService) {
  }

  ngOnInit() {
    if (environment.version === 'qa') {
      this.setSongs(environment.playlistSongs);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
    }
    else {
      this.querySongs();
      setTimeout(() => {
        this.dataSource.sort = this.sort;
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

    //probably a prettier way to do this
    for (let i = 1; i <= songs.length; i++) {
      songs[i-1].position = i;
    }

    this.playlistSongs = songs;
    this.dataSource = new MatTableDataSource(this.playlistSongs);
  }

  querySongs() {
    this.AwsService.query();
  }

  addPlaylist() {
    console.log('ding');
  }

}
