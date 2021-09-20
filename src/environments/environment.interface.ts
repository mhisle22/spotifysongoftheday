import { SpotifySongResponse } from "../app/song-widget/interfaces/spotify-song-response.interface";

export interface EnvironmentInterface {
  production: boolean;
  version: string;
  accessToken: string;
  userID: string;
  songs: SpotifySongResponse[];
}
