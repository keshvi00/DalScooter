# signup
resource "aws_api_gateway_method_response" "signup_response_200" {
  rest_api_id = aws_api_gateway_rest_api.signup_api.id
  resource_id = aws_api_gateway_resource.signup_resource.id
  http_method = aws_api_gateway_method.signup_post.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "signup_integration_response_200" {
  rest_api_id = aws_api_gateway_rest_api.signup_api.id
  resource_id = aws_api_gateway_resource.signup_resource.id
  http_method = aws_api_gateway_method.signup_post.http_method
  status_code = aws_api_gateway_method_response.signup_response_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
  }

  depends_on = [aws_api_gateway_integration.signup_integration]
}

# confirmation email
resource "aws_api_gateway_method_response" "confirm_email_response_200" {
  rest_api_id = aws_api_gateway_rest_api.confirm_email_api.id
  resource_id = aws_api_gateway_resource.confirm_email_resource.id
  http_method = aws_api_gateway_method.confirm_email_post.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

resource "aws_api_gateway_integration_response" "confirm_email_integration_response_200" {
  rest_api_id = aws_api_gateway_rest_api.confirm_email_api.id
  resource_id = aws_api_gateway_resource.confirm_email_resource.id
  http_method = aws_api_gateway_method.confirm_email_post.http_method
  status_code = aws_api_gateway_method_response.confirm_email_response_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
  }

  depends_on = [aws_api_gateway_integration.confirm_email_integration]
}

# signup OPTIONS method
resource "aws_api_gateway_method_response" "signup_options_response" {
  rest_api_id = aws_api_gateway_rest_api.signup_api.id
  resource_id = aws_api_gateway_resource.signup_resource.id
  http_method = aws_api_gateway_method.signup_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "signup_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.signup_api.id
  resource_id = aws_api_gateway_resource.signup_resource.id
  http_method = aws_api_gateway_method.signup_options.http_method
  status_code = aws_api_gateway_method_response.signup_options_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# confirm email OPTIONS method
resource "aws_api_gateway_method_response" "confirm_email_options_response" {
  rest_api_id = aws_api_gateway_rest_api.confirm_email_api.id
  resource_id = aws_api_gateway_resource.confirm_email_resource.id
  http_method = aws_api_gateway_method.confirm_email_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration_response" "confirm_email_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.confirm_email_api.id
  resource_id = aws_api_gateway_resource.confirm_email_resource.id
  http_method = aws_api_gateway_method.confirm_email_options.http_method
  status_code = aws_api_gateway_method_response.confirm_email_options_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}
