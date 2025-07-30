output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = module.ecs.cluster_arn
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = module.alb.alb_zone_id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for images"
  value       = module.s3.bucket_name
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket for images"
  value       = module.s3.bucket_arn
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.s3.cloudfront_domain_name
}

output "backend_ecr_repository_url" {
  description = "URL of the backend ECR repository"
  value       = module.ecr.backend_repository_url
}

output "frontend_ecr_repository_url" {
  description = "URL of the frontend ECR repository"
  value       = module.ecr.frontend_repository_url
}

output "efs_file_system_id" {
  description = "EFS file system ID"
  value       = module.efs.efs_file_system_id
}

output "postgres_service_discovery_name" {
  description = "PostgreSQL service discovery DNS name"
  value       = "postgres.leafwheels.local"
}

output "redis_service_discovery_name" {
  description = "Redis service discovery DNS name"
  value       = "redis.leafwheels.local"
}

output "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = module.iam.ecs_task_execution_role_arn
}

output "ecs_task_role_arn" {
  description = "ARN of the ECS task role"
  value       = module.iam.ecs_task_role_arn
}

# Lex Chatbot Outputs
output "lex_bot_id" {
  description = "ID of the Lex bot"
  value       = module.lex.bot_id
}

output "lex_bot_name" {
  description = "Name of the Lex bot"
  value       = module.lex.bot_name
}

output "lex_test_alias_id" {
  description = "ID of the Lex test alias"
  value       = module.lex.test_alias_id
}

output "lex_bot_configuration" {
  description = "Lex bot configuration for Spring Boot application"
  value       = module.lex.bot_configuration
  sensitive   = false
}