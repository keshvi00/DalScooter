data "archive_file" "signup_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/signup.py"
  output_path = "${path.module}/zip/signup.zip"
}

data "archive_file" "confirm_email_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/confirm_email.py"
  output_path = "${path.module}/zip/confirm_email.zip"
}

data "archive_file" "login_handler_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/login_handler.py"
  output_path = "${path.module}/zip/login_handler.zip"
}

data "archive_file" "verify_security_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/verify_security_lambda.py"
  output_path = "${path.module}/zip/verify_security_lambda.zip"
}

data "archive_file" "verify_caesar_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/verify_caesar_lambda.py"
  output_path = "${path.module}/zip/verify_caesar_lambda.zip"
}

data "archive_file" "add_bike_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/add_bike.py"
  output_path = "${path.module}/zip/add_bike.zip"
}

data "archive_file" "get_bike_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/get_bike.py"
  output_path = "${path.module}/zip/get_bike.zip"
}

data "archive_file" "book_bike_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/book_bike.py"
  output_path = "${path.module}/zip/book_bike.zip"
}

data "archive_file" "get_book_bike_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/get_book_bike.py"
  output_path = "${path.module}/zip/get_book_bike.zip"
}

data "archive_file" "update_book_bike_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/update_book_bike.py"
  output_path = "${path.module}/zip/update_book_bike.zip"
}

data "archive_file" "get_feedback_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/get_feedback.py"
  output_path = "${path.module}/zip/get_feedback.zip"
}

data "archive_file" "submit_feedback_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/submit_feedback.py"
  output_path = "${path.module}/zip/submit_feedback.zip"
}


data "archive_file" "get_feedback_again_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/get_sentiment_analysis.py"
  output_path = "${path.module}/zip/get_sentiment_analysis.zip"
}

data "archive_file" "user_stats_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/user_stats.py"
  output_path = "${path.module}/zip/user_stats.zip"
}


data "archive_file" "notification_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/notification_lambda.py"
  output_path = "${path.module}/zip/notification_lambda.zip"
}

# Booking Queue Lambda
data "archive_file" "booking_queue_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../backend/booking_queue_lambda.py"
  output_path = "${path.module}/zip/booking_queue_lambda.zip"
}

data "archive_file" "chatbot_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../botfrontend/lambda_function.py"
  output_path = "${path.module}/zip/chatbot_lambda.zip"
}




























