export interface UsersPlaylistSong {
  username: string, // PK
  URI: string, // SortKey
  artist: string,
  link: string,
  song: string,
  timestamp: Date,
  position: number
}