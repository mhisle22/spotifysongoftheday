resource "aws_api_gateway_rest_api" "spotify_api" {
  name        = "SpotifySongOfTheDayAPI"
  description = "API Gateway for Spotify Song of the Day"

  body = file("openapi_spotifysongoftheday_spec.json")
}

resource "aws_api_gateway_deployment" "spotify_api_deployment" {
  depends_on = [aws_api_gateway_rest_api.spotify_api]

  rest_api_id = aws_api_gateway_rest_api.spotify_api.id
  stage_name  = "v1"
}

resource "aws_api_gateway_stage" "spotify_api_stage" {
  deployment_id = aws_api_gateway_deployment.spotify_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.spotify_api.id
  stage_name    = "v1"
}
