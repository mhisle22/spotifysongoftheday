// this environment is used to pass in preset data and directly test the song-widget UI
// only accessed when running the npm qa/ng serve --configuration=qa command

import { EnvironmentInterface } from "./environment.interface";

export const environment: EnvironmentInterface = {
  production: false,
  version: 'qa',
  accessToken: 'sampleaccesstokentest1234',
  songs: [{
    song: 'Suspirium',
    spotify_link: 'https://open.spotify.com/track/4Y1igB1GDncJvt7ezbV3cW',
    artist: 'Thom Yorke',
    image_link: 'https://i.scdn.co/image/ab67616d0000b2732cb0db99d7cf0db7c1546e5c'
  } ,
  {
    song: 'Baby Hotline',
    spotify_link: 'https://open.spotify.com/track/1R8kvV2AgNPCA2Pp4Im1Ao',
    artist: 'Jack Staubers Micropop',
    image_link: 'https://i.scdn.co/image/ab67616d0000b273a5566f88ef20c171cee29578',
  } ,
  {
    song: 'Street Spirit (Fade Out)',
    spotify_link: 'https://open.spotify.com/track/2QwObYJWyJTiozvs0RI7CF',
    artist: 'Radiohead',
    image_link: 'https://i.scdn.co/image/ab67616d0000b2739293c743fa542094336c5e12',
  } ]

};
