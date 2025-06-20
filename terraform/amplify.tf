resource "aws_amplify_app" "amplify_app" {
  name = var.appname

  # GitHubリポジトリ連携なしで手動デプロイを使用
  # repository = local.repository_url
  # access_token = var.github_access_token

  build_spec = <<EOF
    version: 1
    frontend:
      phases:
        build:
          commands:
            - echo "Building static site for Cognito OIDC tutorial"
      artifacts:
        baseDirectory: .
        files:
          - '**/*'
      cache:
        paths: []
  EOF

  platform = "WEB"

  tags = {
    Name = var.appname
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.amplify_app.id
  branch_name = "main"

  # 手動デプロイのため自動ビルドは無効
  enable_auto_build = false

  stage = "PRODUCTION"
}
