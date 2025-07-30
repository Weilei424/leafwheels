# Lex Module Outputs

output "bot_id" {
  description = "The unique identifier of the bot"
  value       = aws_lexv2models_bot.leafwheels_bot.id
}

output "bot_name" {
  description = "The name of the bot"
  value       = aws_lexv2models_bot.leafwheels_bot.name
}

output "bot_arn" {
  description = "The ARN of the bot"
  value       = aws_lexv2models_bot.leafwheels_bot.arn
}

output "bot_role_arn" {
  description = "The ARN of the IAM role for the bot"
  value       = aws_iam_role.lex_bot_role.arn
}

output "test_alias_id" {
  description = "The test alias ID (TSTALIASID for DRAFT version)"
  value       = "TSTALIASID"
}

output "locale_id" {
  description = "The locale ID for the bot"
  value       = aws_lexv2models_bot_locale.en_us.locale_id
}

# Configuration outputs for application use
output "bot_configuration" {
  description = "Bot configuration for Spring Boot application"
  value = {
    bot_id       = aws_lexv2models_bot.leafwheels_bot.id
    bot_alias_id = "TSTALIASID"
    locale_id    = aws_lexv2models_bot_locale.en_us.locale_id
    region       = data.aws_region.current.name
  }
}

# Data source for current region
data "aws_region" "current" {}