resource "aws_cognito_user_pool" "pool" {
  alias_attributes           = null
  auto_verified_attributes   = ["email"]
  deletion_protection        = "INACTIVE"
  email_verification_message = null
  email_verification_subject = null
  mfa_configuration          = "OFF"
  name                       = "cms-challenge-production-user-pool"
  sms_authentication_message = null
  sms_verification_message   = null
  tags                       = {}
  tags_all                   = {}
  user_pool_tier             = "ESSENTIALS"
  username_attributes        = []
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }
  admin_create_user_config {
    allow_admin_create_user_only = false
  }
  email_configuration {
    configuration_set      = null
    email_sending_account  = "COGNITO_DEFAULT"
    from_email_address     = null
    reply_to_email_address = null
    source_arn             = null
  }
  password_policy {
    minimum_length                   = 8
    password_history_size            = 0
    require_lowercase                = false
    require_numbers                  = false
    require_symbols                  = false
    require_uppercase                = false
    temporary_password_validity_days = 7
  }
  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = false
    name                     = "email"
    required                 = true
    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }
  sign_in_policy {
    allowed_first_auth_factors = ["PASSWORD"]
  }
  username_configuration {
    case_sensitive = false
  }
  verification_message_template {
    default_email_option  = "CONFIRM_WITH_CODE"
    email_message         = null
    email_message_by_link = null
    email_subject         = null
    email_subject_by_link = null
    sms_message           = null
  }
}

resource "aws_cognito_user_pool_client" "client" {
  access_token_validity                         = 60
  allowed_oauth_flows                           = ["code"]
  allowed_oauth_flows_user_pool_client          = true
  allowed_oauth_scopes                          = ["openid", "email", "profile"]
  auth_session_validity                         = 3
  callback_urls                                 = ["https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com"]
  default_redirect_uri                          = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com"
  enable_propagate_additional_user_context_data = false
  enable_token_revocation                       = true
  explicit_auth_flows                           = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_PASSWORD_AUTH"]
  generate_secret                               = false
  id_token_validity                             = 60
  logout_urls                                   = ["https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.amplify_app.id}.amplifyapp.com"]
  name                                          = "cognito-oidc-tutorial-client"
  prevent_user_existence_errors                 = "ENABLED"
  read_attributes                               = ["email", "name", "preferred_username"]
  refresh_token_validity                        = 30
  supported_identity_providers                  = ["COGNITO"]
  user_pool_id                                  = aws_cognito_user_pool.pool.id
  write_attributes                              = []
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}

resource "aws_cognito_user_pool_domain" "main" {
  certificate_arn = null
  domain          = "oidc-tutorial-auth"
  user_pool_id    = aws_cognito_user_pool.pool.id
}
