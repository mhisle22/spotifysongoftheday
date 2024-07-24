resource "aws_s3_bucket" "spotifysongoftheday_deployment_bucket" {
  bucket = "spotify-song-of-the-day-deployment-bucket"

  tags = {
    Name = "Spotify Song of the Day Deployment Bucket"
    service = "spotifysongoftheday"
  }
}

resource "aws_s3_bucket_public_access_block" "website_bucket_public_access" {
  bucket                  = aws_s3_bucket.spotifysongoftheday_deployment_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_bucket_policy" {
  bucket = aws_s3_bucket.spotifysongoftheday_deployment_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.spotifysongoftheday_deployment_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "website_configuration" {
  bucket = aws_s3_bucket.spotifysongoftheday_deployment_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "null_resource" "upload_site_to_s3_bucket" {
  triggers = {
    always_run = "${timestamp()}"
  }

  depends_on = [ aws_s3_bucket.spotifysongoftheday_deployment_bucket, aws_cloudfront_distribution.s3_distribution ]

  provisioner "local-exec" {
    command = ".\\deploy_to_cloudfront.ps1"
    interpreter = ["PowerShell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File"]
  }
}

resource "aws_cloudfront_origin_access_identity" "ui_origin_id_new" {
  comment = "origin-access-id-for-spotifysongoftheday"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.spotifysongoftheday_deployment_bucket.bucket_domain_name
    origin_id   = aws_cloudfront_origin_access_identity.ui_origin_id_new.id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.ui_origin_id_new.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for my S3 bucket"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_cloudfront_origin_access_identity.ui_origin_id_new.id
    viewer_protocol_policy = "https-only"
    compress = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  custom_error_response {
    error_code = 403
    response_page_path = "/index.html"
    response_code = 200
    error_caching_min_ttl = 300
  }

  custom_error_response {
    error_code = 404
    response_page_path = "/index.html"
    response_code = 200
    error_caching_min_ttl = 300
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  depends_on = [ aws_cloudfront_origin_access_identity.ui_origin_id_new ]

  tags = {
    Name = "S3-CloudFront-Distribution"
  }
}
