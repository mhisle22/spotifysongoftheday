resource "aws_dynamodb_table" "spotify_songs_of_the_day" {
  name           = "SpotifySongsOfTheDay"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "username"
  range_key      = "URI"

  attribute {
    name = "username"
    type = "S"
  }

  attribute {
    name = "URI"
    type = "S"
  }

  tags = {
    Name = "SpotifySongsOfTheDay"
    Environment = "Production"
  }
}