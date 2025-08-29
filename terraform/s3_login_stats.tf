resource "random_id" "login_bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "login_stats_bucket" {
  bucket = "dalscooter-login-stats-${random_id.login_bucket_suffix.hex}"

  tags = {
    Name        = "LoginStatsBucket"
    Environment = "Dev"
  }
}


resource "aws_s3_bucket_public_access_block" "login_stats_block" {
  bucket = aws_s3_bucket.login_stats_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.login_stats_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "AllowPublicRead",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.login_stats_bucket.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.login_stats_block]
}