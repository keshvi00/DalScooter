# signup
resource "aws_api_gateway_rest_api" "signup_api" {
  name        = "signup-api"
  description = "API for handling user signup"
}

# confirmation email
resource "aws_api_gateway_rest_api" "confirm_email_api" {
  name        = "confirm-email-api"
  description = "API for confirming user email via Cognito"
}

# Login
resource "aws_apigatewayv2_api" "login_api" {
  name          = "login-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]  # Or specify your frontend domain
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    expose_headers = ["Access-Control-Allow-Origin"]
    max_age = 3600
  }
}


resource "aws_apigatewayv2_api" "add_bike_api" {
  name          = "AddBikeAPI"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS", "PUT", "DELETE"]
    allow_headers = ["Content-Type", "Authorization", "X-Api-Key"]
    expose_headers = ["*"]
    max_age        = 3600
  }
}

resource "aws_apigatewayv2_api" "book_bike_api" {
  name          = "book-bike-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["OPTIONS", "POST", "GET", "PUT"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_api" "feedback_api" {
  name          = "getfeedbackapi"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["OPTIONS", "POST", "GET", "PUT"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_api" "API_SUBMIT_FEEDBACK" {
  name          = "API_SUBMIT_FEEDBACK"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["OPTIONS", "POST", "GET", "PUT"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_api" "user_stats" {
  name          = "user_stats"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["OPTIONS", "POST", "GET", "PUT"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_api" "chatbot_api" {
  name          = "dalscooter-chatbot-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins  = ["*"]  # Update with your frontend domain in production
    allow_methods  = ["GET", "POST", "OPTIONS"]
    allow_headers  = ["Content-Type", "Authorization"]
    expose_headers = ["Access-Control-Allow-Origin"]
    max_age        = 3600
  }
}


