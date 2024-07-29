resource "aws_lambda_function" "api_handler" {

    filename = "../backend/api_handler_source.zip"
    function_name = "spotifysongoftheday_api_handler"
    handler = "api_handler.lambda_handler"
    runtime = "python3.12"
    role = aws_iam_role.spotifysongoftheday_lambda_role.arn
    source_code_hash = filebase64sha256("../backend/api_handler_source.zip")
    timeout = 30
    memory_size = 128
    publish = true

    depends_on = [ aws_s3_bucket.spotifysongoftheday_deployment_bucket, aws_api_gateway_api_key.spotifysongoftheday_api_key ]
}

resource "aws_lambda_permission" "api_handler_gw_invoke" {

    statement_id = "AllowAPIGatewayInvoke"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.api_handler.function_name
    principal = "apigateway.amazonaws.com"

    source_arn = "${aws_api_gateway_rest_api.spotifysongoftheday_api.execution_arn}/*/*/*"

    depends_on = [ aws_s3_bucket.spotifysongoftheday_deployment_bucket, aws_api_gateway_deployment.spotifysongoftheday_api_deployment ]
}