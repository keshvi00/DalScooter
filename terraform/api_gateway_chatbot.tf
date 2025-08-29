resource "aws_apigatewayv2_integration" "chatbot_integration" {
  api_id                 = aws_apigatewayv2_api.chatbot_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.chatbot.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# Chatbot Route
resource "aws_apigatewayv2_route" "chatbot_route" {
  api_id    = aws_apigatewayv2_api.chatbot_api.id
  route_key = "POST /chat"
  target    = "integrations/${aws_apigatewayv2_integration.chatbot_integration.id}"
}

# Chatbot Stage
resource "aws_apigatewayv2_stage" "chatbot_stage" {
  api_id      = aws_apigatewayv2_api.chatbot_api.id
  name        = "$default"
  auto_deploy = true
}

# Lambda Permission for Chatbot
resource "aws_lambda_permission" "chatbot_api_permission" {
  statement_id  = "AllowChatbotAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chatbot.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.chatbot_api.execution_arn}/*/*"
}

resource "aws_lambda_function" "chatbot" {
  function_name    = "chatbot"
  handler          = "chatbot.handler"
  runtime          = "python3.11"
  filename         = data.archive_file.chatbot_lambda_zip.output_path
  source_code_hash = data.archive_file.chatbot_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

