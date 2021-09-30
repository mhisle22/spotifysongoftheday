# Lambda Files

This folder contains copies of the serverless code hosted on AWS Lambda that I use in this project. These are for reference only- please note that the builds created from the other files in this project don't actually contain this code.

As of v1.2.2, there is only one Lambda function, **trimPlaylists**, which sends a delete query to DynamoDB to remove the oldest 5 song suggestions once a user reaches mroe than 30 songs in their playlist.