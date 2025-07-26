variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for EFS mount targets"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for EFS"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}