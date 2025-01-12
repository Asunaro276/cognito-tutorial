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

data "aws_caller_identity" "current_account" {}

data "aws_region" "current_region" {}

terraform {
  backend "s3" {
    bucket = "tfstate-nakano"
    key    = "${var.prefix}/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
