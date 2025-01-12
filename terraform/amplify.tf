resource "aws_amplify_app" "amplify_app" {
  name = var.appname
  repository = local.repository_url

  access_token = var.github_access_token

  build_spec = <<EOF
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            # Bunをインストール
            - curl -fsSL https://bun.sh/install | bash
            - source /root/.bashrc
            - bun install
        build:
          commands:
            - bun run build
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOF
  enable_auto_branch_creation = true
  enable_branch_auto_build = true
  enable_branch_auto_deletion = true
  platform = "WEB_COMPUTE"

  iam_service_role_arn = aws_iam_role.amplify_iam_role.arn

  auto_branch_creation_config {
    enable_pull_request_preview = true
  }

  tags = {
    Name = var.appname
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.amplify_app.id
  branch_name = "main"

  enable_auto_build = true

  stage     = "PRODUCTION"
}
