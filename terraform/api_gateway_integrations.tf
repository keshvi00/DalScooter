# signup
resource "aws_api_gateway_integration" "signup_integration" {
  rest_api_id = aws_api_gateway_rest_api.signup_api.id
  resource_id = aws_api_gateway_resource.signup_resource.id
  http_method = aws_api_gateway_method.signup_post.http_method
  type        = "AWS_PROXY"
  integration_http_method = "POST"
  uri         = aws_lambda_function.signup.invoke_arn
}

# confirmation email
resource "aws_api_gateway_integration" "confirm_email_integration" {
  rest_api_id             = aws_api_gateway_rest_api.confirm_email_api.id
  resource_id             = aws_api_gateway_resource.confirm_email_resource.id
  http_method             = aws_api_gateway_method.confirm_email_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.confirm_email.invoke_arn
}

# signup OPTIONS integration
resource "aws_api_gateway_integration" "signup_options_integration" {
  rest_api_id             = aws_api_gateway_rest_api.signup_api.id
  resource_id             = aws_api_gateway_resource.signup_resource.id
  http_method             = aws_api_gateway_method.signup_options.http_method
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

# confirm email OPTIONS integration
resource "aws_api_gateway_integration" "confirm_email_options_integration" {
  rest_api_id             = aws_api_gateway_rest_api.confirm_email_api.id
  resource_id             = aws_api_gateway_resource.confirm_email_resource.id
  http_method             = aws_api_gateway_method.confirm_email_options.http_method
  type                    = "MOCK"
  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

# login
resource "aws_apigatewayv2_integration" "login_integration" {
  api_id                   = aws_apigatewayv2_api.login_api.id
  integration_type         = "AWS_PROXY"
  integration_uri          = aws_lambda_function.login_lambda.invoke_arn
  integration_method       = "POST"
  payload_format_version   = "2.0"
}

# verify security question 
resource "aws_apigatewayv2_integration" "verify_integration" {
  api_id                 = aws_apigatewayv2_api.login_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.verify_security_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# caeser cipher 
resource "aws_apigatewayv2_integration" "verify_caesar_integration" {
  api_id                 = aws_apigatewayv2_api.login_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.verify_caesar_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# confirm email for HTTP API
resource "aws_apigatewayv2_integration" "confirm_email_http_integration" {
  api_id                 = aws_apigatewayv2_api.login_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.confirm_email.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# Notification integration
resource "aws_apigatewayv2_integration" "notification_integration" {
  api_id                 = aws_apigatewayv2_api.login_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.notification_lambda.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.add_bike_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.add_bike.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_bikes_integration" {
  api_id                = aws_apigatewayv2_api.add_bike_api.id
  integration_type      = "AWS_PROXY"
  integration_uri       = aws_lambda_function.get_bikes.invoke_arn
  payload_format_version = "2.0"
  # Do NOT set integration_method here, or set to "POST"
}

resource "aws_apigatewayv2_integration" "book_bike_lambda_integration" {
  api_id                 = aws_apigatewayv2_api.book_bike_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.book_bike.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_book_bike_lambda_integration" {
  api_id                 = aws_apigatewayv2_api.book_bike_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_book_bike.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "update_book_bike_lambda_integration" {
  api_id                 = aws_apigatewayv2_api.book_bike_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.update_book_bike.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_feedback_lambda_integration" {
  api_id                 = aws_apigatewayv2_api.feedback_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_feedback.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_feedback_again_lambda_integration" {
  api_id                 = aws_apigatewayv2_api.API_SUBMIT_FEEDBACK.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.get_feedback_again.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "submit_feedback_lambda_integration" {
  api_id                 = aws_apigatewayv2_api.API_SUBMIT_FEEDBACK.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.submit_feedback.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "user_stats_lambda_integration" {
  api_id                 = aws_apigatewayv2_api.user_stats.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.user_stats.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}





