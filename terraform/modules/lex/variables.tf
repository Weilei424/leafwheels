# Lex Module Variables

variable "name_prefix" {
  description = "Prefix for naming resources"
  type        = string
  default     = "leafwheels"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "idle_session_ttl_seconds" {
  description = "The time in seconds that Amazon Lex should keep the session active"
  type        = number
  default     = 300
}

variable "enable_code_hook" {
  description = "Whether to enable code hook for fulfillment"
  type        = bool
  default     = true
}

variable "tags" {
  description = "A map of tags to assign to resources"
  type        = map(string)
  default     = {}
}