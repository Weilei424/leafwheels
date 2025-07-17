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

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.public_subnet_ids

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
  alb_target_group_arn = module.alb.target_group_arn

  ami_id = data.aws_ami.ecs_optimized.id

  tags = local.common_tags
}