variable "aws_region" {
  default = "us-east-1"
}

variable "user_pool_name" {
  default = "dalscooter-user-pool"
}

variable "dynamodb_table_name" {
  default = "dalscooter-userdata"
}

variable "lambda_function_name" {
  default = "loginLambda"
}

variable "verify_lambda_function_name" {
  default = "verifySecurityQuestionLambda"
}

variable "caesar_lambda_function_name" {
  default = "verifyCaesarLambda"
}
