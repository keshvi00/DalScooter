# signup
resource "aws_lambda_function" "signup" {
  function_name = "signup-handler"
  runtime       = "python3.9"
  handler       = "signup.lambda_handler"
  filename      = data.archive_file.signup_zip.output_path
  source_code_hash = data.archive_file.signup_zip.output_base64sha256
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"


  environment {
    variables = {
      DYNAMO_TABLE_NAME = aws_dynamodb_table.user_data.name
      COGNITO_USER_POOL_ID  = aws_cognito_user_pool.main.id
      COGNITO_CLIENT_ID     = aws_cognito_user_pool_client.main_client.id
      SNS_TOPIC_ARN         = aws_sns_topic.notification_topic.arn
    }
  }
}

# confirmation email
resource "aws_lambda_function" "confirm_email" {
  function_name = "confirm-email-handler"
  runtime       = "python3.9"
  handler       = "confirm_email.lambda_handler"
  filename      = data.archive_file.confirm_email_zip.output_path
  source_code_hash = data.archive_file.confirm_email_zip.output_base64sha256
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"


  environment {
    variables = {
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.main_client.id
      DYNAMO_TABLE_NAME = aws_dynamodb_table.user_data.name
      NOTIFICATION_API_URL = "${aws_apigatewayv2_api.login_api.api_endpoint}/notify"
    }
  }
}

# login
resource "aws_lambda_function" "login_lambda" {
  function_name = "login-handler"
  handler       = "login_handler.lambda_handler"
  runtime       = "python3.12"
  filename      = data.archive_file.login_handler_zip.output_path
  source_code_hash = data.archive_file.login_handler_zip.output_base64sha256
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"


  environment {
    variables = {
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.main_client.id
      DYNAMO_TABLE_NAME = aws_dynamodb_table.user_data.name
    }
  }
}

# security question and answer
resource "aws_lambda_function" "verify_security_lambda" {
  function_name = var.verify_lambda_function_name
  handler       = "verify_security_lambda.lambda_handler"
  filename      = data.archive_file.verify_security_lambda_zip.output_path
  source_code_hash = data.archive_file.verify_security_lambda_zip.output_base64sha256
  runtime       = "python3.12"
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"


  environment {
    variables = {
      DYNAMO_TABLE_NAME = aws_dynamodb_table.user_data.name
    }
  }
}

# caesar cipher
resource "aws_lambda_function" "verify_caesar_lambda" {
  function_name = "verifyCaesarLambda"
  handler       = "verify_caesar_lambda.lambda_handler"
  filename      = data.archive_file.verify_caesar_lambda_zip.output_path
  source_code_hash = data.archive_file.verify_caesar_lambda_zip.output_base64sha256
  runtime       = "python3.12"
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  environment {
    variables = {
      DYNAMO_TABLE_NAME = aws_dynamodb_table.user_data.name
      NOTIFICATION_API_URL = "${aws_apigatewayv2_api.login_api.api_endpoint}/notify"
    }
  }
}

resource "aws_lambda_function" "add_bike" {
  function_name = "AddBikeFunction"
  role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  handler       = "add_bike.lambda_handler"
  runtime       = "python3.11"
  filename      = data.archive_file.add_bike_lambda_zip.output_path
  timeout       = 10
}

resource "aws_lambda_function" "get_bikes" {
  filename         = data.archive_file.get_bike_lambda_zip.output_path
  function_name    = "GetBikesFunction"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  handler          = "get_bike.lambda_handler"
  runtime          = "python3.9"
  timeout          = 10
  source_code_hash = data.archive_file.get_bike_lambda_zip.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = "Bikes"
    }
  }
}

resource "aws_lambda_function" "book_bike" {
  function_name    = "BookBikeHandler"
  handler          = "book_bike.handler"
  runtime          = "python3.11"
  filename         = data.archive_file.book_bike_lambda_zip.output_path
  source_code_hash = data.archive_file.book_bike_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  
  environment {
    variables = {
      SQS_QUEUE_URL = aws_sqs_queue.booking_queue.url
    }
  }
}

resource "aws_lambda_function" "get_book_bike" {
  function_name    = "GetBookBikeHandler"
  handler          = "get_book_bike.handler"
  runtime          = "python3.11"
  filename         = data.archive_file.get_book_bike_lambda_zip.output_path
  source_code_hash = data.archive_file.get_book_bike_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

resource "aws_lambda_function" "update_book_bike" {
  function_name    = "UpdateBookBikeHandler"
  handler          = "update_book_bike.handler"
  runtime          = "python3.11"
  filename         = data.archive_file.update_book_bike_lambda_zip.output_path
  source_code_hash = data.archive_file.update_book_bike_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  
  environment {
    variables = {
      NOTIFICATION_API_URL = "${aws_apigatewayv2_api.login_api.api_endpoint}/notify"
    }
  }
}

# Notification Lambda Function
resource "aws_lambda_function" "notification_lambda" {
  function_name    = "NotificationHandler"
  handler          = "notification_lambda.lambda_handler"
  runtime          = "python3.11"
  filename         = data.archive_file.notification_lambda_zip.output_path
  source_code_hash = data.archive_file.notification_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  timeout          = 30

  environment {
    variables = {
      SNS_TOPIC_ARN = aws_sns_topic.notification_topic.arn
      DYNAMO_TABLE_NAME = aws_dynamodb_table.user_data.name
    }
  }
}

# Booking Queue Lambda Function
resource "aws_lambda_function" "booking_queue_lambda" {
  function_name    = "BookingQueueHandler"
  handler          = "booking_queue_lambda.lambda_handler"
  runtime          = "python3.11"
  filename         = data.archive_file.booking_queue_lambda_zip.output_path
  source_code_hash = data.archive_file.booking_queue_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  timeout          = 30

  environment {
    variables = {
      SQS_QUEUE_URL = aws_sqs_queue.booking_queue.url
      DYNAMO_TABLE_NAME = aws_dynamodb_table.user_data.name
      NOTIFICATION_API_URL = "${aws_apigatewayv2_api.login_api.api_endpoint}/notify"
    }
  }
}

resource "aws_lambda_function" "get_feedback" {
  function_name    = "GetFeedbackHandler"
  handler          = "get_feedback.lambda_handler"
  runtime          = "python3.11"
  filename         = data.archive_file.get_feedback_lambda_zip.output_path
  source_code_hash = data.archive_file.get_feedback_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

resource "aws_lambda_function" "submit_feedback" {
  function_name    = "SubmitFeedbackHandler"
  handler          = "submit_feedback.lambda_handler"
  runtime          = "python3.11"
  filename         = data.archive_file.submit_feedback_lambda_zip.output_path
  source_code_hash = data.archive_file.submit_feedback_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

resource "aws_lambda_function" "get_feedback_again" {
  function_name    = "get_sentiment_summary"
  handler          = "get_feedback_again.lambda_handler"
  runtime          = "python3.11"
  filename         = data.archive_file.get_feedback_again_lambda_zip.output_path
  source_code_hash = data.archive_file.get_feedback_again_lambda_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}

resource "aws_lambda_function" "user_stats" {
  function_name    = "user_stats"
  handler          = "user_stats.lambda_handler"
  runtime          = "python3.11"
  filename         = data.archive_file.user_stats_zip.output_path
  source_code_hash = data.archive_file.user_stats_zip.output_base64sha256
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
}