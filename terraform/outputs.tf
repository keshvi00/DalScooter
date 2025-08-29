output "user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.main_client.id
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.user_data.name
}

output "signup_api_url" {
  value = "https://${aws_api_gateway_rest_api.signup_api.id}.execute-api.${var.aws_region}.amazonaws.com/prod/signup"
}

output "confirm_email_api_url" {
  value       = "https://${aws_api_gateway_rest_api.confirm_email_api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.confirm_email_stage.stage_name}/confirm"
}

output "login_api_url" {
  value = aws_apigatewayv2_api.login_api.api_endpoint
}

# SNS Topic Output
output "sns_topic_arn" {
  description = "ARN of the SNS notification topic"
  value       = aws_sns_topic.notification_topic.arn
}

# SQS Queue Output
output "sqs_queue_url" {
  description = "URL of the SQS booking queue"
  value       = aws_sqs_queue.booking_queue.url
}

# Notification API Output
output "notification_api_url" {
  description = "URL of the notification API endpoint"
  value       = "${aws_apigatewayv2_api.login_api.api_endpoint}/notify"
}

# Bike API Outputs
output "bike_api_url" {
  description = "URL of the bike management API"
  value       = aws_apigatewayv2_api.add_bike_api.api_endpoint
}

# Booking API Outputs
output "booking_api_url" {
  description = "URL of the booking management API"
  value       = aws_apigatewayv2_api.book_bike_api.api_endpoint
}

# Feedback DynamoDB Table Output
output "feedback_table_name" {
  description = "Name of the DynamoDB table storing customer feedback"
  value       = aws_dynamodb_table.feedback.name
}

# Login Stats S3 Bucket Output
output "login_stats_bucket_name" {
  description = "S3 bucket for storing login statistics CSV"
  value       = aws_s3_bucket.login_stats_bucket.bucket
}

output "login_stats_bucket_url" {
  description = "S3 public URL to access CSV files"
  value       = "https://${aws_s3_bucket.login_stats_bucket.bucket}.s3.amazonaws.com/"
}