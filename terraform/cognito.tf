resource "aws_cognito_user_pool" "main" {
  name = var.user_pool_name

  password_policy {
   minimum_length    = 8
    require_uppercase = false
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
  }

  auto_verified_attributes = ["email"]
  
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Verify your email for DalScooter"
    email_message        = "Your verification code is {####}"
  }

}

resource "aws_cognito_user_pool_client" "main_client" {
  name         = "dalscooter-client"
  user_pool_id = aws_cognito_user_pool.main.id
  generate_secret = false

  access_token_validity      = 60   
  id_token_validity          = 60  
  refresh_token_validity     = 30 
  auth_session_validity  = 5

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }  

  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}