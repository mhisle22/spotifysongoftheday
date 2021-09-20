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

    public insertSongs(songs: SpotifySongResponse[], id: string, limit: number) {
      
      const time = datepipe.transform(Date.now(), 'd-MM-YYYY HH:mm:ss');
      
      const itemsArray = [];

      // add songs up to limit
      // NOTE: limited up to 25
      for (let i = 0; i < limit; i++) {
        const request = {
          PutRequest: {
            Item: {
              'username': id, // PK
              'URI': songs[i].uri, // SortKey
              'artist': songs[i].artist,
              'link': songs[i].spotify_link,
              'song': songs[i].song,
              'timestamp': time // to be used in v1.2.1, with playlist trimming
            }
          }
        }
        itemsArray.push(request);
      }

      const params = {
        RequestItems: { 
          'SpotifySongsOfTheDay': itemsArray
        }
      };

      // write using batch to avoid multiple network calls
      // and overwrites if same PK and SortKey to update timestamp
      this.docClient.batchWrite(params, function(err, data) {
        if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
        }
      });

    }

}