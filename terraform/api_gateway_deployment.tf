# signup
resource "aws_api_gateway_deployment" "signup_deployment" {
  depends_on = [
    aws_api_gateway_integration.signup_integration,
    aws_api_gateway_integration.signup_options_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.signup_api.id
}

# confirmation email
resource "aws_api_gateway_deployment" "confirm_email_deployment" {
  depends_on = [
    aws_api_gateway_integration.confirm_email_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.confirm_email_api.id
}

resource "aws_api_gateway_stage" "confirm_email_stage" {
  deployment_id = aws_api_gateway_deployment.confirm_email_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.confirm_email_api.id
  stage_name    = "prod"
}

# login 
resource "aws_apigatewayv2_stage" "login_stage" {
  api_id      = aws_apigatewayv2_api.login_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_stage" "add_bike_stage" {
  api_id = aws_apigatewayv2_api.add_bike_api.id
  name   = "$default"
  auto_deploy = true
}



resource "aws_apigatewayv2_stage" "book_bike_stage" {
  api_id      = aws_apigatewayv2_api.book_bike_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_stage" "get_feedback" {
  api_id      = aws_apigatewayv2_api.feedback_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_stage" "submit_feedback" {
  api_id      = aws_apigatewayv2_api.API_SUBMIT_FEEDBACK.id
  name        = "$default"
  auto_deploy = true
}


resource "aws_apigatewayv2_stage" "user_stats" {
  api_id      = aws_apigatewayv2_api.user_stats.id
  name        = "$default"
  auto_deploy = true
}



