terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>5.0"
    }
  }
}

provider "aws" {}

provider "random" {}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

terraform {
  backend "s3" {
    bucket = "tfstate-nakano"
    key    = "cognito-tutorial/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
