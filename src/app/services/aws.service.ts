import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { SpotifySongResponse } from "../song-widget/interfaces/spotify-song-response.interface";


const baseUrl: string = 'https://7p4eiid6ch.execute-api.us-east-2.amazonaws.com/v1/spotifysongoftheday';

@Injectable()
export class AWSService {

    requestHeader: HttpHeaders = new HttpHeaders();

    constructor(private readonly httpClient: HttpClient) {}

    setHeaders(username: string = '') {
        // will update once infra setup
        this.requestHeader = new HttpHeaders({ 'x-api-key': '' , 'Content-Type': 'application/json', 'username': username});
    }

    public query(username: string): Observable<any> {
        this.setHeaders(username);
        return this.httpClient.get<any>(baseUrl, { headers: this.requestHeader }, );
    }

    public insertSongs(songs: SpotifySongResponse[], id: string, limit: number): Observable<any> {
        this.setHeaders();
        const body = {
            songs: songs,
            id: id,
            limit: limit
        }
        return this.httpClient.post<any>(baseUrl, body, { headers: this.requestHeader });
    }

}
