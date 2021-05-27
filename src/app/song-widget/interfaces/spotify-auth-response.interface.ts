export interface SpotifyAuthResponse {
  authToken: string;
  tokenType: string;
  expires_in: number;
  refresh: string;
}
