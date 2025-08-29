resource "aws_api_gateway_stage" "signup_stage" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.signup_api.id
  deployment_id = aws_api_gateway_deployment.signup_deployment.id
}
