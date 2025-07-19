variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type for ECS cluster"
  type        = string
  default     = "t2.micro"
}

variable "min_capacity" {
  description = "Minimum number of instances in ECS cluster"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of instances in ECS cluster"
  type        = number
  default     = 1
}

variable "desired_capacity" {
  description = "Desired number of instances in ECS cluster"
  type        = number
  default     = 1
}