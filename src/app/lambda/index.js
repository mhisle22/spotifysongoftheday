'use strict';
var AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

async function queryItems(params){
  try {
    const data = await docClient.query(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

exports.handler = async (event, context, callback) => {

    let count = 0;
    let username;
    
    if(event.Records[0].eventName == 'INSERT') {
      username = JSON.stringify(event.Records[0].dynamodb.Keys.username.S).slice(1,-1);
    }
    
    event.Records.forEach((record) => {
        if(record.eventName == 'INSERT' && JSON.stringify(record.dynamodb.Keys.username.S).slice(1,-1) === username) {
          console.log('Stream record: ', JSON.stringify(record, null, 2));
          count++;
        }
    });
    
    if(count > 3) {
        
        // Set the parameters
        const params = {
          TableName: 'SpotifySongsOfTheDay',
          ExpressionAttributeValues: {
            ':username' : username,
          },
          KeyConditionExpression: 'username = :username',
          ProjectionExpression: 'username, URI, artist, link, song, suggestTime',
        };
        
        let playlist = [];
        
        try {
            const data = await queryItems(params);
            data.Items.forEach((element) => {
              playlist.push((
                {
                  URI: element.URI,
                  timestamp: element.suggestTime
                }
              ));
            });
          } catch (err) {
            console.log(err);
        }
        
        
        if (playlist.length > 30) {
          
          playlist = playlist.sort((a, b) => {
              let da = new Date(a.timestamp),
                  db = new Date(b.timestamp);
              return da - db;
          });
          
          const removedSongs = playlist.slice(0, 5); 
          
          let itemsArray = [];
          
          removedSongs.forEach((removedSong) => {
            const request = {
              DeleteRequest: {
                Key: {
                  'username': username, // PK
                  'URI': removedSong.URI // SortKey
                }
              }
            };
            itemsArray.push(request);
          });
          
          let deleteQueries = {
              RequestItems : {
                  'SpotifySongsOfTheDay' : itemsArray
              }
          };
          docClient.batchWrite(deleteQueries, function(err, data) {
              if (err) {
                  console.log('Batch delete unsuccessful ...');
                  console.log(err, err.stack); // an error occurred
              } else {
                  console.log('Batch delete successful ...');
                  console.log(removedSongs); // successful response
              }
          
          });
        }
    }
    
    
    callback(null, `Successfully processed ${event.Records.length} records.`);
};   
