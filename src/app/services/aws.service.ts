import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { AWSError, config, DynamoDB } from 'aws-sdk';
import { QueryOutput } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";
import { SpotifySongResponse } from "../song-widget/interfaces/spotify-song-response.interface";

const table = 'SpotifySongsOfTheDay';
const datepipe: DatePipe = new DatePipe('en-US');

@Injectable()
export class AWSService {

    docClient: DynamoDB.DocumentClient;

    constructor() {
      config.update({
          region: 'us-east-2', // shoutout Ohio
          accessKeyId: 'process.env.ACCESSKEYID',
          secretAccessKey: 'process.env.SECRETACCESSKEY'
      });

      //this.docClient = new DynamoDB.DocumentClient();
    }

    public query(username: string): Promise<PromiseResult<QueryOutput, AWSError>> {
      // Set the parameters
      const params = {
        TableName: table,
        ExpressionAttributeValues: {
          ':username' : btoa(username),
        },
        KeyConditionExpression: 'username = :username',
        ProjectionExpression: 'username, URI, artist, link, song, suggestTime',
      };

      return this.docClient.query(params).promise();
     }

    public insertSongs(songs: SpotifySongResponse[], id: string, limit: number) {
      
      const time = datepipe.transform(Date.now(), 'YYYY-MM-d HH:mm:ss');
      
      const itemsArray = [];

      // add songs up to limit
      // NOTE: limited up to 25
      for (let i = 0; i < limit; i++) {
        const request = {
          PutRequest: {
            Item: {
              'username': btoa(id), // PK
              'URI': songs[i].uri, // SortKey
              'artist': songs[i].artist,
              'link': songs[i].spotify_link,
              'song': songs[i].song,
              'suggestTime': time // to be used in v1.2.1, with playlist trimming
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
      this.docClient.batchWrite(params, function(err) {
        if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          return;
        }
      });

    }

}