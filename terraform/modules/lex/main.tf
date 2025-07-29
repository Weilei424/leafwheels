data "aws_iam_policy_document" "lex_bot_assume_role_policy" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lexv2.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lex_bot_role" {
  name               = "${var.name_prefix}-lex-bot-role"
  assume_role_policy = data.aws_iam_policy_document.lex_bot_assume_role_policy.json

  tags = var.tags
}

# Create custom IAM policy for Lex V2 bot service permissions
resource "aws_iam_role_policy" "lex_bot_service_policy" {
  name = "${var.name_prefix}-lex-bot-service-policy"
  role = aws_iam_role.lex_bot_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "polly:SynthesizeSpeech"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lex_bot_custom_policy" {
  name = "${var.name_prefix}-lex-bot-custom-policy"
  role = aws_iam_role.lex_bot_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_lexv2models_bot" "leafwheels_bot" {
  name     = "${var.name_prefix}-chatbot"
  role_arn = aws_iam_role.lex_bot_role.arn

  data_privacy {
    child_directed = false
  }

  idle_session_ttl_in_seconds = var.idle_session_ttl_seconds

  tags = var.tags
}

resource "aws_lexv2models_bot_locale" "en_us" {
  bot_id      = aws_lexv2models_bot.leafwheels_bot.id
  bot_version = "DRAFT"
  locale_id   = "en_US"

  n_lu_intent_confidence_threshold = 0.40

  voice_settings {
    voice_id = "Joanna"
    engine   = "neural"
  }

  depends_on = [aws_lexv2models_bot.leafwheels_bot]
}
