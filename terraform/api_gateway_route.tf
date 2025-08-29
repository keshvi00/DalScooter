# login
resource "aws_apigatewayv2_route" "login_route" {
  api_id    = aws_apigatewayv2_api.login_api.id
  route_key = "POST /login"
  target    = "integrations/${aws_apigatewayv2_integration.login_integration.id}"
}

# fetch security question
resource "aws_apigatewayv2_route" "get_security_question_route" {
  api_id    = aws_apigatewayv2_api.login_api.id
  route_key = "GET /security-question"
  target    = "integrations/${aws_apigatewayv2_integration.verify_integration.id}"
}

# security question and answer
resource "aws_apigatewayv2_route" "verify_route" {
  api_id    = aws_apigatewayv2_api.login_api.id
  route_key = "POST /verify-security-question"
  target    = "integrations/${aws_apigatewayv2_integration.verify_integration.id}"
}

# caesar cipher
resource "aws_apigatewayv2_route" "verify_caesar_route" {
  api_id    = aws_apigatewayv2_api.login_api.id
  route_key = "POST /verify-caesar"
  target    = "integrations/${aws_apigatewayv2_integration.verify_caesar_integration.id}"
}

# fetch caesar cipher clue
resource "aws_apigatewayv2_route" "get_caesar_clue_route" {
  api_id    = aws_apigatewayv2_api.login_api.id
  route_key = "GET /verify-caesar"
  target    = "integrations/${aws_apigatewayv2_integration.verify_caesar_integration.id}"
}

# final login step - verify caesar and return user type
resource "aws_apigatewayv2_route" "login_step3_route" {
  api_id    = aws_apigatewayv2_api.login_api.id
  route_key = "POST /login-step3"
  target    = "integrations/${aws_apigatewayv2_integration.verify_caesar_integration.id}"
}

# confirm email route
resource "aws_apigatewayv2_route" "confirm_email_route" {
  api_id    = aws_apigatewayv2_api.login_api.id
  route_key = "POST /confirm"
  target    = "integrations/${aws_apigatewayv2_integration.confirm_email_http_integration.id}"
}

# Notification route
resource "aws_apigatewayv2_route" "notification_route" {
  api_id    = aws_apigatewayv2_api.login_api.id
  route_key = "POST /notify"
  target    = "integrations/${aws_apigatewayv2_integration.notification_integration.id}"
}

resource "aws_apigatewayv2_route" "post_bike_route" {
  api_id    = aws_apigatewayv2_api.add_bike_api.id
  route_key = "POST /add-bike"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "put_bike_route" {
  api_id    = aws_apigatewayv2_api.add_bike_api.id
  route_key = "PUT /add-bike/{bikeId}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "get_bikes_route" {
  api_id    = aws_apigatewayv2_api.add_bike_api.id
  route_key = "GET /bikes"
  target    = "integrations/${aws_apigatewayv2_integration.get_bikes_integration.id}"
}

resource "aws_apigatewayv2_route" "book_route" {
  api_id    = aws_apigatewayv2_api.book_bike_api.id
  route_key = "POST /book"
  target    = "integrations/${aws_apigatewayv2_integration.book_bike_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "get_book_route" {
  api_id    = aws_apigatewayv2_api.book_bike_api.id
  route_key = "GET /getbook"
  target    = "integrations/${aws_apigatewayv2_integration.get_book_bike_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "update_book_route" {
  api_id    = aws_apigatewayv2_api.book_bike_api.id
  route_key = "PUT /updatebook/{bookingId}"
  target    = "integrations/${aws_apigatewayv2_integration.update_book_bike_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "get_feedback" {
  api_id    = aws_apigatewayv2_api.feedback_api.id
  route_key = "GET /get-feedback-text"
  target    = "integrations/${aws_apigatewayv2_integration.get_feedback_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "get_feedback_again" {
  api_id    = aws_apigatewayv2_api.API_SUBMIT_FEEDBACK.id
  route_key = "GET /get-feedback"
  target    = "integrations/${aws_apigatewayv2_integration.get_feedback_again_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "submit_feedback" {
  api_id    = aws_apigatewayv2_api.API_SUBMIT_FEEDBACK.id
  route_key = "POST /submit-feedback"
  target    = "integrations/${aws_apigatewayv2_integration.submit_feedback_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "user_stats" {
  api_id    = aws_apigatewayv2_api.user_stats.id
  route_key = "POST /generate-user-stats"
  target    = "integrations/${aws_apigatewayv2_integration.user_stats_lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "user_count_route" {
  api_id    = aws_apigatewayv2_api.user_stats.id
  route_key = "GET /user-count"
  target    = "integrations/${aws_apigatewayv2_integration.user_stats_lambda_integration.id}"
}