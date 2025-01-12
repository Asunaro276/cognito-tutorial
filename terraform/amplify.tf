resource "aws_amplify_app" "tutorial" {
  name = {var.prefix}
  repository = local.repository_url

  access_token = var.github_access_token
}
