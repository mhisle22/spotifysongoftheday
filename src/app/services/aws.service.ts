import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { SpotifySongResponse } from "../song-widget/interfaces/spotify-song-response.interface";

const table = 'SpotifySongsOfTheDay';
const datepipe: DatePipe = new DatePipe('en-US');

const baseUrl: string = 'https://7p4eiid6ch.execute-api.us-east-2.amazonaws.com/v1/spotifysongoftheday';

@Injectable()
export class AWSService {

    requestHeader: HttpHeaders = new HttpHeaders();

    constructor(private readonly httpClient: HttpClient) {}

    setHeaders() {
        // will update once infra setup
        this.requestHeader = new HttpHeaders({ 'x-api-key': '' , 'Content-Type': 'application/json'});
    }

    public query(username: string): Observable<any> {
        this.setHeaders();
        console.log('ran');
        return this.httpClient.get<any>(baseUrl, { headers: this.requestHeader });

        /*
        const params = {
        TableName: table,
        ExpressionAttributeValues: {
          ':username' : btoa(username),
        },
        KeyConditionExpression: 'username = :username',
        ProjectionExpression: 'username, URI, artist, link, song, suggestTime',
      };

      return this.docClient.query(params).promise();
      */
    }

    public insertSongs(songs: SpotifySongResponse[], id: string, limit: number): Observable<any> {
        this.setHeaders();
        return this.httpClient.post<any>(baseUrl, songs, { headers: this.requestHeader });

        // below code will be ported to Lambda

        /* const time = datepipe.transform(Date.now(), 'YYYY-MM-d HH:mm:ss');
        
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
        this.docClient.batchWrite(params, function(err: any) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                return;
            }
        }); */

    }

}
