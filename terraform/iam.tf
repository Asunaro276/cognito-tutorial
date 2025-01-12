resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"] # GitHub OIDC Thumbprint
}

resource "aws_iam_role" "github_actions" {
  name = "${var.prefix}-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      },
      Action = "sts:AssumeRoleWithWebIdentity",
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:sub" = "repo:asunaro276/cognito-tutorial:ref:refs/heads/main"
        }
      }
    }]
  })

  # Attach necessary policies
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AdministratorAccess" # Adjust permissions as needed
  ]
}

# Output the IAM Role ARN for use in GitHub Actions
output "github_actions_role_arn" {
  description = "The ARN of the IAM role assumed by GitHub Actions"
  value       = aws_iam_role.github_actions.arn
}
