# signup
resource "aws_api_gateway_resource" "signup_resource" {
  rest_api_id = aws_api_gateway_rest_api.signup_api.id
  parent_id   = aws_api_gateway_rest_api.signup_api.root_resource_id
  path_part   = "signup"
}

# confirmation email
resource "aws_api_gateway_resource" "confirm_email_resource" {
  rest_api_id = aws_api_gateway_rest_api.confirm_email_api.id
  parent_id   = aws_api_gateway_rest_api.confirm_email_api.root_resource_id
  path_part   = "confirm"
}