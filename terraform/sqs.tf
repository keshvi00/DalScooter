# SQS Queue for booking requests
resource "aws_sqs_queue" "booking_queue" {
  name = "dal-scooter-booking-queue"

  fifo_queue = false
  
  # Message retention (14 days)
  message_retention_seconds = 1209600
  
  # Visibility timeout
  visibility_timeout_seconds = 70
  
  # Receive message wait time
  receive_wait_time_seconds = 20
}

# Dead letter queue for failed messages
resource "aws_sqs_queue" "booking_dlq" {
  name = "dal-scooter-booking-dlq"
  
  fifo_queue = false
  message_retention_seconds = 1209600
}

# Redrive policy for main queue
resource "aws_sqs_queue_redrive_policy" "booking_queue_redrive" {
  queue_url = aws_sqs_queue.booking_queue.id
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.booking_dlq.arn
    maxReceiveCount     = 3
  })
}

# Queue policy for Lambda access
resource "aws_sqs_queue_policy" "booking_queue_policy" {
  queue_url = aws_sqs_queue.booking_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = [
          "sqs:SendMessage",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.booking_queue.arn
      }
    ]
  })
} 