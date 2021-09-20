import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { config, DynamoDB } from 'aws-sdk';
import Config from '../../config.json';
import { SpotifySongResponse } from "../song-widget/interfaces/spotify-song-response.interface";

const table = 'SpotifySongsOfTheDay';
const datepipe: DatePipe = new DatePipe('en-US');

@Injectable()
export class AWSService {

    docClient: DynamoDB.DocumentClient;

    constructor() {
      config.update({
          region: Config.region,
          accessKeyId: Config.accessKeyId,
          secretAccessKey: Config.secretAccessKey
      });

      this.docClient = new DynamoDB.DocumentClient();
    }

    public query() {
      // Set the parameters
      const params = {
        TableName: table,
        Key: {
          'username' : 'mhisle22' ,
          'timestamp': '14:05:30 09-16-2021',
        }
      };

      this.docClient.get(params, function(err, data) {
        if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
      });
    }

    public insertSongs(songs: SpotifySongResponse[], id: string) {
      
      const time = datepipe.transform(Date.now(), 'd-MM-YYYY HH:mm:ss');

      // Set the parameters
      const params = {
        TableName: table,
        Item: {
          'username': id, // PK
          'timestamp': time, // SortKey
          'artist': songs[0].artist,
          'link': songs[0].spotify_link,
          'song': songs[0].song,
          'URI': 'sample',
        }
      };

      this.docClient.put(params, function(err, data) {
        if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
        }
      });
    }

}