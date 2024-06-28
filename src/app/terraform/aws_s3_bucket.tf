resource "aws_s3_bucket" "spotifysongoftheday_deployment_bucket" {
  bucket = "spotify-song-of-the-day-deployment-bucket"

  tags = {
    Name = "Spotify Song of the Day Deployment Bucket"
    service = "spotifysongoftheday"
  }
}