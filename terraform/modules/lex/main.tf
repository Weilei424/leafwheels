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

# Slot Types
resource "aws_lexv2models_slot_type" "vehicle_make" {
  bot_id      = aws_lexv2models_bot.leafwheels_bot.id
  bot_version = "DRAFT"
  locale_id   = aws_lexv2models_bot_locale.en_us.locale_id
  name        = "VehicleMake"

  value_selection_setting {
    resolution_strategy = "OriginalValue"
  }

  slot_type_values {
    sample_value {
      value = "Tesla"
    }
    synonyms {
      value = "TESLA"
    }
  }

  slot_type_values {
    sample_value {
      value = "BMW"
    }
    synonyms {
      value = "bmw"
    }
  }

  slot_type_values {
    sample_value {
      value = "Nissan"
    }
    synonyms {
      value = "NISSAN"
    }
  }

  slot_type_values {
    sample_value {
      value = "Ford"
    }
    synonyms {
      value = "FORD"
    }
  }

  slot_type_values {
    sample_value {
      value = "Audi"
    }
    synonyms {
      value = "AUDI"
    }
  }

  slot_type_values {
    sample_value {
      value = "Chevrolet"
    }
    synonyms {
      value = "CHEVROLET"
    }
    synonyms {
      value = "Chevy"
    }
  }

  slot_type_values {
    sample_value {
      value = "Kia"
    }
    synonyms {
      value = "KIA"
    }
  }

  slot_type_values {
    sample_value {
      value = "Hyundai"
    }
    synonyms {
      value = "HYUNDAI"
    }
  }

  slot_type_values {
    sample_value {
      value = "Mercedes"
    }
    synonyms {
      value = "MERCEDES_BENZ"
    }
    synonyms {
      value = "Mercedes-Benz"
    }
    synonyms {
      value = "Benz"
    }
  }

  slot_type_values {
    sample_value {
      value = "Volkswagen"
    }
    synonyms {
      value = "VOLKSWAGEN"
    }
    synonyms {
      value = "VW"
    }
  }

  slot_type_values {
    sample_value {
      value = "Toyota"
    }
    synonyms {
      value = "TOYOTA"
    }
  }

  slot_type_values {
    sample_value {
      value = "Rivian"
    }
    synonyms {
      value = "RIVIAN"
    }
  }

  slot_type_values {
    sample_value {
      value = "Lucid"
    }
    synonyms {
      value = "LUCID"
    }
  }

  depends_on = [aws_lexv2models_bot_locale.en_us]
}

# SearchVehicles Intent
resource "aws_lexv2models_intent" "search_vehicles" {
  bot_id      = aws_lexv2models_bot.leafwheels_bot.id
  bot_version = "DRAFT"
  locale_id   = aws_lexv2models_bot_locale.en_us.locale_id
  name        = "SearchVehicles"

  sample_utterance {
    utterance = "Show me {make} vehicles"
  }

  sample_utterance {
    utterance = "Find {make} cars"
  }

  sample_utterance {
    utterance = "Do you have {make} models"
  }

  sample_utterance {
    utterance = "Search for {make} {model}"
  }

  sample_utterance {
    utterance = "What {make} vehicles do you have"
  }

  sample_utterance {
    utterance = "Find vehicles under {maxPrice} dollars"
  }

  sample_utterance {
    utterance = "Show me electric vehicles"
  }

  sample_utterance {
    utterance = "What models do you have"
  }

  sample_utterance {
    utterance = "Find BMW vehicles"
  }

  sample_utterance {
    utterance = "Search for Tesla Model 3"
  }

  sample_utterance {
    utterance = "what ford vehicle do you have"
  }

  sample_utterance {
    utterance = "find bmw vehicles"
  }

  sample_utterance {
    utterance = "what is the price of nissan leaf"
  }

  depends_on = [aws_lexv2models_slot_type.vehicle_make]
}

# Note: Removing slots due to AWS Lex v2 API constraints on ID format
# The intent will work without explicit slots defined

# ViewCart Intent
resource "aws_lexv2models_intent" "view_cart" {
  bot_id      = aws_lexv2models_bot.leafwheels_bot.id
  bot_version = "DRAFT"
  locale_id   = aws_lexv2models_bot_locale.en_us.locale_id
  name        = "ViewCart"

  sample_utterance {
    utterance = "What's in my cart"
  }

  sample_utterance {
    utterance = "Show me my cart"
  }

  sample_utterance {
    utterance = "View cart"
  }

  sample_utterance {
    utterance = "Cart"
  }

  sample_utterance {
    utterance = "My shopping cart"
  }

  depends_on = [aws_lexv2models_bot_locale.en_us]
}

# LoanCalculation Intent
resource "aws_lexv2models_intent" "loan_calculation" {
  bot_id      = aws_lexv2models_bot.leafwheels_bot.id
  bot_version = "DRAFT"
  locale_id   = aws_lexv2models_bot_locale.en_us.locale_id
  name        = "LoanCalculation"

  sample_utterance {
    utterance = "Calculate loan payment"
  }

  sample_utterance {
    utterance = "Loan calculator"
  }

  sample_utterance {
    utterance = "Finance options"
  }

  sample_utterance {
    utterance = "Monthly payment calculator"
  }

  sample_utterance {
    utterance = "How much would monthly payments be"
  }

  depends_on = [aws_lexv2models_bot_locale.en_us]
}

# SearchAccessories Intent
resource "aws_lexv2models_intent" "search_accessories" {
  bot_id      = aws_lexv2models_bot.leafwheels_bot.id
  bot_version = "DRAFT"
  locale_id   = aws_lexv2models_bot_locale.en_us.locale_id
  name        = "SearchAccessories"

  sample_utterance {
    utterance = "Show me accessories"
  }

  sample_utterance {
    utterance = "What accessories do you have"
  }

  sample_utterance {
    utterance = "Browse accessories"
  }

  sample_utterance {
    utterance = "Vehicle accessories"
  }

  depends_on = [aws_lexv2models_bot_locale.en_us]
}

# ViewOrders Intent
resource "aws_lexv2models_intent" "view_orders" {
  bot_id      = aws_lexv2models_bot.leafwheels_bot.id
  bot_version = "DRAFT"
  locale_id   = aws_lexv2models_bot_locale.en_us.locale_id
  name        = "ViewOrders"

  sample_utterance {
    utterance = "Show my orders"
  }

  sample_utterance {
    utterance = "Order history"
  }

  sample_utterance {
    utterance = "My orders"
  }

  sample_utterance {
    utterance = "Purchase history"
  }

  depends_on = [aws_lexv2models_bot_locale.en_us]
}
