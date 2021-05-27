# SongOfTheDay
Web app to suggest music based on public Spotify API

## Start your day with a new song recommendation

This Angular-based web app was inspired by my (Mark Hisle) desire to liven up my daily commute with a fresh new song recommended by Spotify's publicly available API. [This API](https://developer.spotify.com/documentation/web-api/) is a free-to-use data source that constantly updates itself based upon your past music consumption on the app, as well as Spotify's algorithms designed to determine which songs they believe best match your current styles and preferences.

**Disclaimer:** I have no affiliation with the Spotify company itself, nor have any control over your data- everything this app shows you is the extent of what I can see

## Feature Schedule

Below is a list of a few features I plan to implement into this application:

* v1.0.0: Basic song suggestion based on user authentication
* v1.1.0: Multiple suggestion scrolling
* v1.2.0: Advanced song queries based on built-in variables (danceability, genre, etc.)
* v1.3.0: Historical suggestion data tracking with AWS DynamoDB and playlist creation via AWS Lambda
* v1.4.0: Email notifications at a set time each day with Lambda and SNS, with subscribe link in app
* v1.?: AWS Kinesis Analytics? What can data science bring us here?

## Software Stack

* Node.js
* Angular
* AWS Lambda
* AWS SNS
* AWS DynamoDB

All commits are analyzed for security flaws by GitHub Advanced Security.

# Getting started

1. Go to project folder and install dependencies:
 ```bash
 npm install
 ```

2. Launch development server, and open `localhost:4200` in your browser:
 ```bash
 npm start
 ```

3. Build the project for Github pages
 ```bash
 ng build --prod --baseHref="https://mhisle22.github.io/SongOfTheDay/"
 ```
 
