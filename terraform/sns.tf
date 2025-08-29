# SNS Topic for email notifications
resource "aws_sns_topic" "notification_topic" {
  name = "dal-scooter-notifications"
}

# SNS Topic Policy
resource "aws_sns_topic_policy" "notification_topic_policy" {
  arn = aws_sns_topic.notification_topic.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = [
          "sns:Publish"
        ]
        Resource = aws_sns_topic.notification_topic.arn
      }
    ]
  })
}

# Email subscription (you'll need to confirm this email)
resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.notification_topic.arn
  protocol  = "email"
  endpoint  = "vn820085@dal.ca"  
} 