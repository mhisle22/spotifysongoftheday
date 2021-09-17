import { Injectable } from "@angular/core";
import { config, DynamoDB } from 'aws-sdk';
import Config from '../../config.json';


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
        TableName: 'SpotifySongsOfTheDay',
        Key: {
        'username' : 'mhisle22' ,
        'timestamp': '14:05:30 09-16-2021',
        }
      };

      this.docClient.get(params, function(err: any, data: any) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
    }

}