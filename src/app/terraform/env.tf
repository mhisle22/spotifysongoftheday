variable "aws_region" { default = "us-east-2" }
variable "aws_key" {}
variable "aws_secret" {}

provider "aws" {
    region = var.aws_region
    access_key = var.aws_key
    secret_key = var.aws_secret

    default_tags {
      tags = {
        service = "spotifysongoftheday"
      }
    }
}