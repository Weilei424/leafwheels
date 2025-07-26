variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for ECS instances"
  type        = list(string)
}

variable "ecs_instance_profile" {
  description = "IAM instance profile for ECS instances"
  type        = string
}

variable "ecs_security_group" {
  description = "Security group for ECS instances"
  type        = string
}

variable "ami_id" {
  description = "AMI ID for ECS instances"
  type        = string
}

variable "instance_type" {
  description = "Instance type for ECS instances"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Key pair name for EC2 instances"
  type        = string
  default     = null
}

variable "min_capacity" {
  description = "Minimum number of instances"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of instances"
  type        = number
  default     = 1
}

variable "desired_capacity" {
  description = "Desired number of instances"
  type        = number
  default     = 1
}

variable "backend_target_group_arn" {
  description = "ARN of the ALB target group for backend"
  type        = string
}

variable "frontend_target_group_arn" {
  description = "ARN of the ALB target group for frontend"
  type        = string
}

variable "backend_image" {
  description = "Docker image for backend service"
  type        = string
}

variable "frontend_image" {
  description = "Docker image for frontend service"
  type        = string
}

variable "database_name" {
  description = "Database name"
  type        = string
  default     = "leafwheels"
}

variable "database_username" {
  description = "Database username"
  type        = string
  default     = "user"
}

variable "database_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "efs_file_system_id" {
  description = "EFS file system ID"
  type        = string
}


variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
