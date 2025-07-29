terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "ecs_optimized" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }
}

# Random string for unique resource names
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# Local values
locals {
  name_prefix = "leafwheels"
  environment = "prod"

  common_tags = {
    Project     = "LeafWheels"
    Environment = local.environment
    ManagedBy   = "terraform"
  }
}

# Modules
module "vpc" {
  source = "./modules/vpc"

  name_prefix        = local.name_prefix
  environment        = local.environment
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 2)

  tags = local.common_tags
}

module "iam" {
  source = "./modules/iam"

  name_prefix = local.name_prefix
  environment = local.environment

  tags = local.common_tags
}

module "ecr" {
  source = "./modules/ecr"

  name_prefix = local.name_prefix
  environment = local.environment

  tags = local.common_tags
}

module "s3" {
  source = "./modules/s3"

  name_prefix = local.name_prefix
  environment = local.environment
  suffix      = random_string.suffix.result

  tags = local.common_tags
}

module "alb" {
  source = "./modules/alb"

  name_prefix = local.name_prefix
  environment = local.environment

  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.public_subnet_ids
  alb_security_group_id = module.vpc.alb_security_group_id

  tags = local.common_tags
}

# Generate random password for database
resource "random_password" "db_password" {
  length  = 16
  special = true
}

# Generate random JWT secret
resource "random_password" "jwt_secret" {
  length  = 64
  special = false
}

module "efs" {
  source = "./modules/efs"

  name_prefix = local.name_prefix
  environment = local.environment

  subnet_ids        = module.vpc.private_subnet_ids
  security_group_id = module.vpc.efs_security_group_id

  tags = local.common_tags
}

module "ecs" {
  source = "./modules/ecs"

  name_prefix = local.name_prefix
  environment = local.environment

  vpc_id               = module.vpc.vpc_id
  subnet_ids           = module.vpc.private_subnet_ids
  ecs_instance_profile = module.iam.ecs_instance_profile_name
  ecs_security_group   = module.vpc.ecs_security_group_id

  backend_target_group_arn  = module.alb.backend_target_group_arn
  frontend_target_group_arn = module.alb.frontend_target_group_arn

  backend_image  = "${module.ecr.backend_repository_url}:latest"
  frontend_image = "${module.ecr.frontend_repository_url}:latest"

  database_username = "user"
  database_password = random_password.db_password.result

  efs_file_system_id = module.efs.efs_file_system_id

  jwt_secret = random_password.jwt_secret.result

  aws_region = var.aws_region

  ami_id = data.aws_ami.ecs_optimized.id

  min_capacity     = var.min_capacity
  max_capacity     = var.max_capacity
  desired_capacity = var.desired_capacity
  instance_type    = var.instance_type

  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  ecs_task_role_arn           = module.iam.ecs_task_role_arn

  tags = local.common_tags
}

# AWS Lex Chatbot Module
module "lex" {
  source = "./modules/lex"

  name_prefix = local.name_prefix
  environment = local.environment

  # Bot configuration
  idle_session_ttl_seconds = 300
  enable_code_hook        = true

  tags = local.common_tags
}