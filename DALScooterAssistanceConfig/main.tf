
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Variables for deployment flexibility
variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "bot_name" {
  description = "Name of the Lex bot"
  type        = string
  default     = "DALScooterAssistant"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "lambda_function_name" {
  description = "Name of the Lambda function for code hooks"
  type        = string
  default     = "DALScooterLexHandler"
}

variable "bedrock_model_arn" {
  description = "Bedrock model ARN for generative AI"
  type        = string
  default     = "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "DALScooterAssistant"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Local values
locals {
  bot_name_with_env = "${var.bot_name}-${var.environment}"
  account_id        = data.aws_caller_identity.current.account_id
  region           = data.aws_region.current.name
}

# IAM Role for Lex Bot
resource "aws_iam_role" "lex_bot_role" {
  name = "${local.bot_name_with_env}-lex-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lexv2.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# IAM Policy for Lex Bot
resource "aws_iam_role_policy" "lex_bot_policy" {
  name = "${local.bot_name_with_env}-lex-policy"
  role = aws_iam_role.lex_bot_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = "arn:aws:lambda:${local.region}:${local.account_id}:function:${var.lambda_function_name}*"
      },
      {
        Effect = "Allow"
        Action = [
          "polly:SynthesizeSpeech"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "comprehend:DetectSentiment",
          "comprehend:DetectSyntax",
          "comprehend:DetectEntities",
          "comprehend:DetectKeyPhrases"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel"
        ]
        Resource = var.bedrock_model_arn
      }
    ]
  })
}

# Lex Bot
resource "aws_lexv2models_bot" "dalscooter_assistant" {
  name        = local.bot_name_with_env
  description = "This is a pet project created to understand Lex 2 and in fulfillment of serverless applications mini project"
  role_arn    = aws_iam_role.lex_bot_role.arn

  idle_session_ttl_in_seconds = 300

  data_privacy {
    child_directed = false
  }

  tags = var.tags
}

# Bot Locale
resource "aws_lexv2models_bot_locale" "english_us" {
  bot_id      = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version = "DRAFT"
  locale_id   = "en_US"
  
  n_lu_intent_confidence_threshold = 0.4
  
  voice_settings {
    voice_id = "Danielle"
    engine   = "neural"
  }

  # Generative AI Settings
  generative_ai_settings {
    buildtime_settings {
      descriptive_bot_builder {
        enabled = true
        bedrock_model_specification {
          model_arn = var.bedrock_model_arn
        }
      }
    }
  }

  depends_on = [aws_lexv2models_bot.dalscooter_assistant]
}

resource "aws_lexv2models_intent" "submit_concern" {
  bot_id      = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version = aws_lexv2models_bot_locale.english_us.bot_version
  locale_id   = aws_lexv2models_bot_locale.english_us.locale_id
  intent_name = "SubmitConcern"

  sample_utterances {
    utterance = "I have an issue with my booking {ReferenceNumber}"
  }
  sample_utterances {
    utterance = "Report a problem with {ReferenceNumber}"
  }
  sample_utterances {
    utterance = "I want to submit a concern"
  }
  sample_utterances {
    utterance = "I have a concern"
  }
  sample_utterances {
    utterance = "I need to report an issue"
  }
  sample_utterances {
    utterance = "I want to report a problem"
  }
  sample_utterances {
    utterance = "I have a problem"
  }
  sample_utterances {
    utterance = "Submit a concern"
  }
  sample_utterances {
    utterance = "Report an issue"
  }
  sample_utterances {
    utterance = "I need help with my booking"
  }
  sample_utterances {
    utterance = "There's an issue with my scooter"
  }
  sample_utterances {
    utterance = "I want to file a complaint"
  }
  sample_utterances {
    utterance = "I have a complaint"
  }
  sample_utterances {
    utterance = "Something is wrong with my booking"
  }
  sample_utterances {
    utterance = "I need to report a concern"
  }
  sample_utterances {
    utterance = "Help me submit a concern"
  }
  sample_utterances {
    utterance = "I want to submit a concern about reference {ReferenceNumber}"
  }
  sample_utterances {
    utterance = "I have a problem with reference {ReferenceNumber}"
  }
  sample_utterances {
    utterance = "There's an issue with booking {ReferenceNumber}"
  }
  sample_utterances {
    utterance = "I want to report a problem with {ReferenceNumber}"
  }

  # Dialog Code Hook
  dialog_code_hook {
    enabled = true
  }

  # Fulfillment Code Hook
  fulfillment_code_hook {
    enabled = true
    post_fulfillment_status_specification {
      success_next_step {
        dialog_action {
          type = "CloseIntent"
        }
      }
      failure_next_step {
        dialog_action {
          type = "CloseIntent"
        }
      }
      timeout_next_step {
        dialog_action {
          type = "CloseIntent"
        }
      }
    }
  }

  initial_response_setting {
    next_step {
      dialog_action {
        type            = "ElicitSlot"
        slot_to_elicit = "ReferenceNumber"
      }
    }
  }

  # Intent Closing Setting
  intent_closing_setting {
    closing_response {
      message_group {
        message {
          plain_text_message {
            value = "Thank you for submitting your concern. We will look into this matter."
          }
        }
      }
    }
    next_step {
      dialog_action {
        type = "EndConversation"
      }
    }
  }

  depends_on = [aws_lexv2models_bot_locale.english_us]
}

resource "aws_lexv2models_slot" "submit_concern_reference_number" {
  bot_id      = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version = aws_lexv2models_bot_locale.english_us.bot_version
  locale_id   = aws_lexv2models_bot_locale.english_us.locale_id
  intent_id   = aws_lexv2models_intent.submit_concern.id
  slot_name   = "ReferenceNumber"
  description = "Please share reference number or access code"
  slot_type_id = "AMAZON.AlphaNumeric"

  value_elicitation_setting {
    slot_constraint = "Required"
    
    prompt_specification {
      max_retries                = 4
      allow_interrupt           = true
      message_selection_strategy = "Random"
      
      message_groups_list {
        message {
          plain_text_message {
            value = "What is your booking reference number or access code?"
          }
        }
      }

      prompt_attempts_specification {
        map_block_key = "Initial"
        allowed_input_types {
          allow_audio_input = true
          allow_dtmf_input  = true
        }
        audio_and_dtmf_input_specification {
          start_timeout_ms = 4000
          audio_specification {
            max_length_ms = 15000
            end_timeout_ms = 640
          }
          dtmf_specification {
            max_length = 513
            end_timeout_ms = 5000
            deletion_character = "*"
            end_character = "#"
          }
        }
        text_input_specification {
          start_timeout_ms = 30000
        }
        allow_interrupt = true
      }
    }

    slot_capture_setting {
      capture_next_step {
        dialog_action {
          type = "InvokeDialogCodeHook"
        }
      }
      failure_next_step {
        intent {
          name = "FallbackIntent"
        }
        dialog_action {
          type = "StartIntent"
        }
      }
      code_hook {
        enable_code_hook_invocation = true
        active = true
        post_code_hook_specification {
          success_next_step {
            dialog_action {
              type            = "ElicitSlot"
              slot_to_elicit = "IssueDescription"
            }
          }
          failure_next_step {
            dialog_action {
              type = "EndConversation"
            }
          }
          timeout_next_step {
            dialog_action {
              type = "EndConversation"
            }
          }
        }
      }
      elicitation_code_hook {
        enable_code_hook_invocation = true
      }
    }
  }

  depends_on = [aws_lexv2models_intent.submit_concern]
}

# Slot: IssueDescription for SubmitConcern Intent
resource "aws_lexv2models_slot" "submit_concern_issue_description" {
  bot_id      = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version = aws_lexv2models_bot_locale.english_us.bot_version
  locale_id   = aws_lexv2models_bot_locale.english_us.locale_id
  intent_id   = aws_lexv2models_intent.submit_concern.id
  slot_name   = "IssueDescription"
  slot_type_id = "AMAZON.AlphaNumeric"

  value_elicitation_setting {
    slot_constraint = "Required"
    
    prompt_specification {
      max_retries                = 4
      allow_interrupt           = true
      message_selection_strategy = "Random"
      
      message_groups_list {
        message {
          plain_text_message {
            value = "Please describe your issue"
          }
        }
      }

      prompt_attempts_specification {
        map_block_key = "Initial"
        allowed_input_types {
          allow_audio_input = true
          allow_dtmf_input  = true
        }
        audio_and_dtmf_input_specification {
          start_timeout_ms = 4000
          audio_specification {
            max_length_ms = 15000
            end_timeout_ms = 640
          }
          dtmf_specification {
            max_length = 513
            end_timeout_ms = 5000
            deletion_character = "*"
            end_character = "#"
          }
        }
        text_input_specification {
          start_timeout_ms = 30000
        }
        allow_interrupt = true
      }
    }

    slot_capture_setting {
      capture_next_step {
        dialog_action {
          type = "FulfillIntent"
        }
      }
      failure_next_step {
        intent {
          name = "FallbackIntent"
        }
        dialog_action {
          type = "StartIntent"
        }
      }
      elicitation_code_hook {
        enable_code_hook_invocation = true
      }
    }
  }

  depends_on = [aws_lexv2models_intent.submit_concern]
}

# Intent: BikeAccessCode
resource "aws_lexv2models_intent" "bike_access_code" {
  bot_id      = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version = aws_lexv2models_bot_locale.english_us.bot_version
  locale_id   = aws_lexv2models_bot_locale.english_us.locale_id
  intent_name = "BikeAccessCode"

  sample_utterances {
    utterance = "What's my bike access code?"
  }
  sample_utterances {
    utterance = "I need my access code for booking {ReferenceNumber}"
  }
  sample_utterances {
    utterance = "Get access code for {ReferenceNumber}"
  }

  # Dialog Code Hook
  dialog_code_hook {
    enabled = true
  }

  # Fulfillment Code Hook
  fulfillment_code_hook {
    enabled = true
    post_fulfillment_status_specification {
      success_next_step {
        dialog_action {
          type = "CloseIntent"
        }
      }
      failure_next_step {
        dialog_action {
          type = "CloseIntent"
        }
      }
      timeout_next_step {
        dialog_action {
          type = "CloseIntent"
        }
      }
    }
  }

  # Initial Response Setting
  initial_response_setting {
    code_hook {
      active = true
      enable_code_hook_invocation = true
      post_code_hook_specification {
        success_next_step {
          dialog_action {
            type            = "ElicitSlot"
            slot_to_elicit = "ReferenceNumber"
          }
        }
        failure_next_step {
          dialog_action {
            type = "EndConversation"
          }
        }
        timeout_next_step {
          dialog_action {
            type = "EndConversation"
          }
        }
      }
    }
    next_step {
      dialog_action {
        type = "InvokeDialogCodeHook"
      }
    }
  }

  # Intent Confirmation Setting
  intent_confirmation_setting {
    prompt_specification {
      max_retries                = 4
      allow_interrupt           = true
      message_selection_strategy = "Random"
      
      message_groups_list {
        message {
          plain_text_message {
            value = "Can I go ahead with your request?"
          }
        }
      }

      prompt_attempts_specification {
        map_block_key = "Initial"
        allowed_input_types {
          allow_audio_input = true
          allow_dtmf_input  = true
        }
        audio_and_dtmf_input_specification {
          start_timeout_ms = 4000
          audio_specification {
            max_length_ms = 15000
            end_timeout_ms = 640
          }
          dtmf_specification {
            max_length = 513
            end_timeout_ms = 5000
            deletion_character = "*"
            end_character = "#"
          }
        }
        text_input_specification {
          start_timeout_ms = 30000
        }
        allow_interrupt = true
      }
    }

    declination_response {
      message_group {
        message {
          plain_text_message {
            value = "Okay. Your request will not be submitted."
          }
        }
      }
      allow_interrupt = true
    }

    confirmation_next_step {
      dialog_action {
        type = "FulfillIntent"
      }
    }

    declination_next_step {
      dialog_action {
        type = "EndConversation"
      }
    }

    failure_next_step {
      intent {
        name = "FallbackIntent"
      }
      dialog_action {
        type = "StartIntent"
      }
    }

    elicitation_code_hook {
      enable_code_hook_invocation = true
    }
  }

  # Intent Closing Setting
  intent_closing_setting {
    closing_response {
      message_group {
        message {
          plain_text_message {
            value = "Thank you."
          }
        }
      }
      allow_interrupt = true
    }
    next_step {
      dialog_action {
        type = "EndConversation"
      }
    }
  }

  depends_on = [aws_lexv2models_bot_locale.english_us]
}

# Slot: ReferenceNumber for BikeAccessCode Intent
resource "aws_lexv2models_slot" "bike_access_code_reference_number" {
  bot_id      = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version = aws_lexv2models_bot_locale.english_us.bot_version
  locale_id   = aws_lexv2models_bot_locale.english_us.locale_id
  intent_id   = aws_lexv2models_intent.bike_access_code.id
  slot_name   = "ReferenceNumber"
  slot_type_id = "AMAZON.AlphaNumeric"

  value_elicitation_setting {
    slot_constraint = "Required"
    
    prompt_specification {
      max_retries                = 4
      allow_interrupt           = true
      message_selection_strategy = "Random"
      
      message_groups_list {
        message {
          plain_text_message {
            value = "What is your booking reference number?"
          }
        }
      }

      prompt_attempts_specification {
        map_block_key = "Initial"
        allowed_input_types {
          allow_audio_input = true
          allow_dtmf_input  = true
        }
        audio_and_dtmf_input_specification {
          start_timeout_ms = 4000
          audio_specification {
            max_length_ms = 15000
            end_timeout_ms = 640
          }
          dtmf_specification {
            max_length = 513
            end_timeout_ms = 5000
            deletion_character = "*"
            end_character = "#"
          }
        }
        text_input_specification {
          start_timeout_ms = 30000
        }
        allow_interrupt = true
      }
    }

    slot_capture_setting {
      capture_next_step {
        dialog_action {
          type = "InvokeDialogCodeHook"
        }
      }
      failure_next_step {
        intent {
          name = "FallbackIntent"
        }
        dialog_action {
          type = "StartIntent"
        }
      }
      code_hook {
        enable_code_hook_invocation = true
        invocation_label = "DALScooterLexHandler"
        active = true
        post_code_hook_specification {
          success_next_step {
            dialog_action {
              type = "ConfirmIntent"
            }
          }
          failure_next_step {
            dialog_action {
              type = "EndConversation"
            }
          }
          timeout_next_step {
            dialog_action {
              type = "EndConversation"
            }
          }
        }
      }
      elicitation_code_hook {
        enable_code_hook_invocation = true
      }
    }
  }

  depends_on = [aws_lexv2models_intent.bike_access_code]
}

# Intent: NavigationHelp
resource "aws_lexv2models_intent" "navigation_help" {
  bot_id      = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version = aws_lexv2models_bot_locale.english_us.bot_version
  locale_id   = aws_lexv2models_bot_locale.english_us.locale_id
  intent_name = "NavigationHelp"

  sample_utterances {
    utterance = "How to register?"
  }
  sample_utterances {
    utterance = "How do I sign up?"
  }
  sample_utterances {
    utterance = "Where can I find registration?"
  }
  sample_utterances {
    utterance = "Help with navigation"
  }

  # Fulfillment Code Hook
  fulfillment_code_hook {
    enabled = true
    post_fulfillment_status_specification {
      success_next_step {
        dialog_action {
          type = "EndConversation"
        }
      }
      failure_next_step {
        dialog_action {
          type = "EndConversation"
        }
      }
      timeout_next_step {
        dialog_action {
          type = "EndConversation"
        }
      }
    }
  }

  # Initial Response Setting
  initial_response_setting {
    code_hook {
      active = true
      enable_code_hook_invocation = true
      post_code_hook_specification {
        success_next_step {
          dialog_action {
            type = "FulfillIntent"
          }
        }
        failure_next_step {
          dialog_action {
            type = "EndConversation"
          }
        }
        timeout_next_step {
          dialog_action {
            type = "EndConversation"
          }
        }
      }
    }
    next_step {
      dialog_action {
        type = "InvokeDialogCodeHook"
      }
    }
  }

  depends_on = [aws_lexv2models_bot_locale.english_us]
}

# Intent: FallbackIntent
resource "aws_lexv2models_intent" "fallback_intent" {
  bot_id               = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version          = aws_lexv2models_bot_locale.english_us.bot_version
  locale_id            = aws_lexv2models_bot_locale.english_us.locale_id
  intent_name          = "FallbackIntent"
  description          = "Default intent when no other intent matches"
  parent_intent_signature = "AMAZON.FallbackIntent"

  # Initial Response Setting
  initial_response_setting {
    code_hook {
      active = true
      enable_code_hook_invocation = true
      post_code_hook_specification {
        success_next_step {
          dialog_action {
            type = "EndConversation"
          }
        }
        failure_next_step {
          dialog_action {
            type = "EndConversation"
          }
        }
        timeout_next_step {
          dialog_action {
            type = "EndConversation"
          }
        }
      }
    }
    next_step {
      dialog_action {
        type = "InvokeDialogCodeHook"
      }
    }
  }

  depends_on = [aws_lexv2models_bot_locale.english_us]
}

# Bot Version
resource "aws_lexv2models_bot_version" "dalscooter_assistant_version" {
  bot_id      = aws_lexv2models_bot.dalscooter_assistant.id
  description = "Production version of DALScooterAssistant"
  
  locale_specification = {
    (aws_lexv2models_bot_locale.english_us.locale_id) = {
      source_bot_version = aws_lexv2models_bot_locale.english_us.bot_version
    }
  }

  depends_on = [
    aws_lexv2models_intent.submit_concern,
    aws_lexv2models_intent.bike_access_code,
    aws_lexv2models_intent.navigation_help,
    aws_lexv2models_intent.fallback_intent,
    aws_lexv2models_slot.submit_concern_reference_number,
    aws_lexv2models_slot.submit_concern_issue_description,
    aws_lexv2models_slot.bike_access_code_reference_number
  ]
}

# Bot Alias
resource "aws_lexv2models_bot_alias" "dalscooter_assistant_alias" {
  bot_alias_name = "${var.environment}-alias"
  bot_id         = aws_lexv2models_bot.dalscooter_assistant.id
  bot_version    = aws_lexv2models_bot_version.dalscooter_assistant_version.bot_version
  description    = "Alias for ${var.environment} environment"

  bot_alias_locale_settings {
    locale_id = aws_lexv2models_bot_locale.english_us.locale_id
    enabled   = true
    
    code_hook_specification {
      lambda_code_hook {
        lambda_arn                = "arn:aws:lambda:${local.region}:${local.account_id}:function:${var.lambda_function_name}"
        code_hook_interface_version = "1.0"
      }
    }
  }

  tags = var.tags

  depends_on = [aws_lexv2models_bot_version.dalscooter_assistant_version]
}

# Lambda Permission for Lex to invoke Lambda
resource "aws_lambda_permission" "lex_invoke_lambda" {
  statement_id  = "AllowExecutionFromLex"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "lexv2.amazonaws.com"
  source_arn    = "${aws_lexv2models_bot.dalscooter_assistant.arn}/*"
}

# Outputs
output "bot_id" {
  description = "ID of the created Lex bot"
  value       = aws_lexv2models_bot.dalscooter_assistant.id
}

output "bot_arn" {
  description = "ARN of the created Lex bot"
  value       = aws_lexv2models_bot.dalscooter_assistant.arn
}

output "bot_alias_id" {
  description = "ID of the bot alias"
  value       = aws_lexv2models_bot_alias.dalscooter_assistant_alias.id
}

output "bot_alias_arn" {
  description = "ARN of the bot alias"
  value       = aws_lexv2models_bot_alias.dalscooter_assistant_alias.arn
}

output "lambda_function_name" {
  description = "Name of the Lambda function used for code hooks"
  value       = var.lambda_function_name
}

output "deployment_instructions" {
  description = "Instructions for deploying the bot"
  value = <<-EOT
    Deployment Instructions:
    1. Ensure your Lambda function '${var.lambda_function_name}' exists
    2. Run: terraform init
    3. Run: terraform plan
    4. Run: terraform apply
    5. Test the bot in the AWS Console or integrate with your application
    
    Bot Console URL: https://console.aws.amazon.com/lexv2/home?region=${local.region}#bot/${aws_lexv2models_bot.dalscooter_assistant.id}
  EOT
}