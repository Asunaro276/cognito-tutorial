variable "prefix" {}

variable "github_access_token" {
  type = string
}

locals {
  repository_url = "https://github.com/asunaro276/cognito-tutorial"
}
