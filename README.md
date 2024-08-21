# Song Of The Day
Web app to suggest music based on the public Spotify API's data.

## URL

**CURRENT WEBSITE URL**: https://d2fd856v8ttd1y.cloudfront.net (Cloudfront hosted site)

The old Github Pages url is no longer supported, as that library has unresolved security issues and Cloudfront is significantly more stable.

## Start your day with a new song recommendation

This Angular-based web app was inspired by my (Mark Hisle) desire to liven up my daily commute with a fresh new song recommended by Spotify's publicly available API. [This API](https://developer.spotify.com/documentation/web-api/) is a free-to-use data source that constantly updates itself based upon your past music consumption on the app, as well as Spotify's algorithms designed to determine which songs they believe best match your current styles and preferences.

**Disclaimer:** I have no affiliation with the Spotify company itself, nor have any control over your data- everything this app shows you is the extent of what I can see

## Feature Schedule

Below is a list of a few features I plan to implement into this application:

* v1.0.0: Basic song suggestion based on user authentication :ballot_box_with_check:
* v1.1.0: Multiple suggestion scrolling :ballot_box_with_check:
    * Scroll through 5 additional songs
    * Added test data loading for streamlined UI testing
    * Small UI updates and fixes
    * Node package updates
* v1.2.0: Historical suggestion data tracking and playlist creation via AWS DynamoDB and AWS Lambda :ballot_box_with_check:
    * New playlist page retrieving data from SpotifySongsOfTheDay table
    * Option to add a playlist to your spotify accounts
    * Lambda function added to trim user's playlist songs stored in DynamoDB to less than 40
    * Various bug fixes and CSS improvements
* v1.3.0: Advanced song queries based on built-in variables (danceability, genre, etc.)
* v1.4.0: Email notifications at a set time each day with AWS EventBridge and SNS, with subscribe link in app

## Software Stack

* Node.js (20.11.1)
* Angular (17.3.1)
* Terraform (1.9.2)
* AWS DynamoDB
* AWS Lambda
* AWS Cloudfront and S3, for hosting
* AWS IAM and CloudWatch for development

All commits are analyzed for security flaws by GitHub Advanced Security.

All of the AWS infrastructure is built via Terraform scripts under the terraform folder. Each new build is hosted on Cloudfront via an invalidation of the previous build. See the `terraform_build.sh` file for more details.

# Getting started

I recommend using yarn for any Node package management, although standard npm is fine.

1. Go to project folder and install dependencies:
 ```bash
 yarn install
 ```

2. Launch development server, and open `localhost:4200` in your browser:
 ```bash
 yarn start
 ```

3. Load in sample data for UI testing on the main page (skips any login pages):
 ```bash
 yarn run qa
 ```

4. Public users can no longer redeploy the app themselves- if you have any suggestions, please contact me and I will run the terraform build scripts using my own credentials.
 
