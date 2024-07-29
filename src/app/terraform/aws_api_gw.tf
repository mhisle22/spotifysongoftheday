resource "aws_api_gateway_rest_api" "spotifysongoftheday_api" {
  name        = "SpotifySongOfTheDayAPI"
  description = "API Gateway for Spotify Song of the Day"

  body = templatefile("openapi_spotifysongoftheday_spec.json",
    {
      apiHandler = aws_lambda_function.api_handler.invoke_arn
    }
  )

  depends_on = [ aws_s3_bucket.spotifysongoftheday_deployment_bucket, aws_lambda_function.api_handler ]
}

resource "aws_api_gateway_deployment" "spotifysongoftheday_api_deployment" {
  depends_on = [aws_api_gateway_rest_api.spotifysongoftheday_api]

  rest_api_id = aws_api_gateway_rest_api.spotifysongoftheday_api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.spotifysongoftheday_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "spotifysongoftheday_api_stage" {
  deployment_id = aws_api_gateway_deployment.spotifysongoftheday_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.spotifysongoftheday_api.id
  stage_name    = "v1"
}

resource "aws_api_gateway_api_key" "spotifysongoftheday_api_key" {
  name = "spotifysongoftheday_api_key"
  description = "Key"
  value = substr(md5(format("%s-%s", "spotify", "songoftheday")), 0, 34)
  depends_on = [ aws_s3_bucket.spotifysongoftheday_deployment_bucket ]
}
