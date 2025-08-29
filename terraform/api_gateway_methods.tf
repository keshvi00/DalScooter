# signup
resource "aws_api_gateway_method" "signup_post" {
  rest_api_id   = aws_api_gateway_rest_api.signup_api.id
  resource_id   = aws_api_gateway_resource.signup_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# confirmation email
resource "aws_api_gateway_method" "confirm_email_post" {
  rest_api_id   = aws_api_gateway_rest_api.confirm_email_api.id
  resource_id   = aws_api_gateway_resource.confirm_email_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "signup_options" {
  rest_api_id   = aws_api_gateway_rest_api.signup_api.id
  resource_id   = aws_api_gateway_resource.signup_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "confirm_email_options" {
  rest_api_id   = aws_api_gateway_rest_api.confirm_email_api.id
  resource_id   = aws_api_gateway_resource.confirm_email_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}
