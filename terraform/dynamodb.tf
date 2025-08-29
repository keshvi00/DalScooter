resource "aws_dynamodb_table" "user_data" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "username"

  attribute {
    name = "username"
    type = "S"
  }
}

resource "aws_dynamodb_table" "bikes" {
  name           = "Bikes"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "bikeId"

  attribute {
    name = "bikeId"
    type = "S"
  }
}

# user login attempts
resource "aws_dynamodb_table" "user_logins" {
  name           = "UserLogins"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "username"
  range_key      = "login_timestamp"
 
  attribute {
    name = "username"
    type = "S"
  }
 
  attribute {
    name = "login_timestamp"
    type = "S"
  }
 
  tags = {
    Name = "UserLogins"
  }
}

resource "aws_dynamodb_table" "bookings" {
  name         = "BikeBookings"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "bookingId"

  attribute {
    name = "bookingId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "feedback" {
  name           = "Feedback"
  billing_mode   = "PAY_PER_REQUEST"  
  hash_key       = "feedback_id"

  attribute {
    name = "feedback_id"
    type = "S"
  }

}
