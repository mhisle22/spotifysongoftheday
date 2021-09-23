// this environment is used to pass in preset data and directly test the song-widget UI
// only accessed when running the npm qa/ng serve --configuration=qa command

import { EnvironmentInterface } from "./environment.interface";

export const environment: EnvironmentInterface = {
  production: false,
  version: 'qa',
  accessToken: 'sampleaccesstokentest1234',
  userID: 'fakeUser1234',
  songs: [{
    song: 'Suspirium',
    spotify_link: 'https://open.spotify.com/track/4Y1igB1GDncJvt7ezbV3cW',
    artist: 'Thom Yorke',
    image_link: 'https://i.scdn.co/image/ab67616d0000b2732cb0db99d7cf0db7c1546e5c',
    uri: '4Y1igB1GDncJvt7ezbV3cW'
  } ,
  {
    song: 'Baby Hotline',
    spotify_link: 'https://open.spotify.com/track/1R8kvV2AgNPCA2Pp4Im1Ao',
    artist: 'Jack Staubers Micropop',
    image_link: 'https://i.scdn.co/image/ab67616d0000b273a5566f88ef20c171cee29578',
    uri: '1R8kvV2AgNPCA2Pp4Im1Ao'
  } ,
  {
    song: 'Street Spirit (Fade Out)',
    spotify_link: 'https://open.spotify.com/track/2QwObYJWyJTiozvs0RI7CF',
    artist: 'Radiohead',
    image_link: 'https://i.scdn.co/image/ab67616d0000b2739293c743fa542094336c5e12',
    uri: '2QwObYJWyJTiozvs0RI7CF'
  } ,
  {
    song: 'The Difference',
    spotify_link: 'https://open.spotify.com/track/4nlvKIIetOWGIMyhjQXgOZ',
    artist: 'Flume',
    image_link: 'https://i.scdn.co/image/ab67616d0000b273a8d74e789b99484e0e169001',
    uri: '4nlvKIIetOWGIMyhjQXgOZ'
  },
  {
    song: 'Choke',
    spotify_link: 'https://open.spotify.com/track/37mfTcSlX60JtAvAETytGs',
    artist: 'I DONT KNOW HOW BUT THEY FOUND ME',
    image_link: 'https://i.scdn.co/image/ab67616d0000b273e9774ee3932efbc4c3d68e6b',
    uri: '37mfTcSlX60JtAvAETytGs'
  } ],

  playlistSongs: [{
    username: 'fakeUser1234', // PK
    URI: '4Y1igB1GDncJvt7ezbV3cW', // SortKey
    artist: 'Thom Yorke',
    link: 'https://open.spotify.com/track/4Y1igB1GDncJvt7ezbV3cW',
    song: 'Suspirium',
    timestamp: new Date('2021-09-21'),
    position: 0
  },
  {
    username: 'fakeUser1234', // PK
    URI: '1R8kvV2AgNPCA2Pp4Im1Ao', // SortKey
    artist: 'Jack Staubers Micropop',
    link: 'https://open.spotify.com/track/1R8kvV2AgNPCA2Pp4Im1Ao',
    song: 'Baby Hotline',
    timestamp: new Date('2021-09-22'),
    position: 0
  },
  {
    username: 'fakeUser1234', // PK
    URI: '2QwObYJWyJTiozvs0RI7CF', // SortKey
    artist: 'Radiohead',
    link: 'https://open.spotify.com/track/2QwObYJWyJTiozvs0RI7CF',
    song: 'Street Spirit (Fade Out)',
    timestamp: new Date('2021-09-23'),
    position: 0
  },
  {
    username: 'fakeUser1234', // PK
    URI: '4nlvKIIetOWGIMyhjQXgOZ', // SortKey
    artist: 'Flume',
    link: 'https://open.spotify.com/track/4nlvKIIetOWGIMyhjQXgOZ',
    song: 'The Difference',
    timestamp: new Date('2021-09-24'),
    position: 0
  },
  {
    username: 'fakeUser1234', // PK
    URI: '37mfTcSlX60JtAvAETytGs', // SortKey
    artist: 'I DONT KNOW HOW BUT THEY FOUND ME',
    link: 'https://open.spotify.com/track/37mfTcSlX60JtAvAETytGs',
    song: 'Choke',
    timestamp: new Date('2021-09-24 12:12:12'),
    position: 0
  }]

};
