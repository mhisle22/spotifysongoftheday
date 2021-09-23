import { UsersPlaylistSong } from "src/app/song-widget/interfaces/users-playlist-song.interface";
import { SpotifySongResponse } from "src/app/song-widget/interfaces/spotify-song-response.interface";

export interface EnvironmentInterface {
  production: boolean;
  version: string;
  accessToken: string;
  userID: string;
  songs: SpotifySongResponse[];
  playlistSongs: UsersPlaylistSong[];
}
