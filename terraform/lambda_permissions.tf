# signup
resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvokeSignup"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.signup.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.signup_api.execution_arn}/*/*"
}

# confirmation email
resource "aws_lambda_permission" "api_gateway_permission_confirm_email" {
  statement_id  = "AllowAPIGatewayInvokeConfirmEmail"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.confirm_email.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.confirm_email_api.execution_arn}/*/*"
}

# confirmation email for HTTP API
resource "aws_lambda_permission" "api_gateway_permission_confirm_email_http" {
  statement_id  = "AllowHTTPAPIGatewayInvokeConfirmEmail"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.confirm_email.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.login_api.execution_arn}/*/*"
}

# Notification lambda permission
resource "aws_lambda_permission" "api_gateway_permission_notification" {
  statement_id  = "AllowHTTPAPIGatewayInvokeNotification"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.login_api.execution_arn}/*/*"
}

# login
resource "aws_lambda_permission" "api_gateway_login" {
  statement_id  = "AllowAPIGatewayInvokeLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.login_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.login_api.execution_arn}/*/*"
}

# security question and answer
resource "aws_lambda_permission" "api_gateway_verify" {
  statement_id  = "AllowAPIGatewayInvokeVerify"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.verify_security_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.login_api.execution_arn}/*/*"
}

# caesar cipher
resource "aws_lambda_permission" "caesar_api_permission" {
  statement_id  = "AllowCaesarInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.verify_caesar_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.login_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "allow_api" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.add_bike.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.add_bike_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_invoke_get_bikes" {
  statement_id  = "AllowExecutionFromAPIGatewayGetBikes"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_bikes.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.add_bike_api.execution_arn}/*/GET/bikes"
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowInvokeByAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.book_bike.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.book_bike_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_book_bike" {
  statement_id  = "AllowInvokeByAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_book_bike.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.book_bike_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "update_book_bike" {
  statement_id  = "AllowInvokeByAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.update_book_bike.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.book_bike_api.execution_arn}/*/*"
}

# SQS Event Source Mapping for Booking Queue Lambda
resource "aws_lambda_event_source_mapping" "booking_queue_mapping" {
  event_source_arn = aws_sqs_queue.booking_queue.arn
  function_name    = aws_lambda_function.booking_queue_lambda.function_name
  batch_size       = 1
  enabled          = true
}

# SNS Permission for Notification Lambda
resource "aws_lambda_permission" "sns_permission" {
  statement_id  = "AllowSNSPublish"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.notification_topic.arn
}

# Lambda-to-Lambda permissions for notification invocation
resource "aws_lambda_permission" "caesar_to_notification" {
  statement_id  = "AllowCaesarInvokeNotification"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_lambda.function_name
  principal     = "lambda.amazonaws.com"
  source_arn    = aws_lambda_function.verify_caesar_lambda.arn
}

resource "aws_lambda_permission" "confirm_email_to_notification" {
  statement_id  = "AllowConfirmEmailInvokeNotification"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_lambda.function_name
  principal     = "lambda.amazonaws.com"
  source_arn    = aws_lambda_function.confirm_email.arn
}

resource "aws_lambda_permission" "update_booking_to_notification" {
  statement_id  = "AllowUpdateBookingInvokeNotification"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notification_lambda.function_name
  principal     = "lambda.amazonaws.com"
  source_arn    = aws_lambda_function.update_book_bike.arn
}

resource "aws_lambda_permission" "get_feedback" {
  statement_id  = "AllowInvokeByAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_feedback.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.feedback_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "submit_feedback" {
  statement_id  = "AllowInvokeByAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.submit_feedback.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.API_SUBMIT_FEEDBACK.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_feedback_again" {
  statement_id  = "AllowInvokeByAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_feedback_again.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.API_SUBMIT_FEEDBACK.execution_arn}/*/*"
}

resource "aws_lambda_permission" "user_stats" {
  statement_id  = "AllowInvokeByAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_stats.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.user_stats.execution_arn}/*/*"
}