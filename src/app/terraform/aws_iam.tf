resource "aws_iam_role" "spotifysongoftheday_lambda_role" {
    name = "spotifysongoftheday_lambda_role"
    assume_role_policy = jsonencode({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "sts:AssumeRole",
                "Principal": {
                    "Service": [
                        "apigateway.amazonaws.com",
                        "lambda.amazonaws.com"
                    ]
                },
                "Effect": "Allow",
                "Sid": ""
            }
        ]
    })

    depends_on = [ aws_s3_bucket.spotifysongoftheday_deployment_bucket ]
}

resource "aws_iam_role_policy" "spotifysongoftheday_lambda_policy" {
    name = "spotifysongoftheday_lambda_policy"
    role = aws_iam_role.spotifysongoftheday_lambda_role.id

    policy = jsonencode({
        "Version": "2012-10-17",
        "Statement": [{
            "Action": [
                "apigateway:*",
                "cloudwatch:*",
                "lambda:*",
                "logs:*",
                "dynamodb:*",
                "iam:PassRole",
                "sts:GetCallerIdentity",
                "sts:GetServiceBearerToken",
                "sts:SetSourceIdentity",
                "sts:TagSession"
            ],
            "Effect": "Allow",
            "Resource": "*"
        }]
    })

    depends_on = [ aws_s3_bucket.spotifysongoftheday_deployment_bucket ]
}
