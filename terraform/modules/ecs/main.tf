resource "aws_ecs_cluster" "main" {
  name = "${var.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-cluster"
  })
}

resource "aws_launch_template" "ecs" {
  name_prefix   = "${var.name_prefix}-ecs-"
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [var.ecs_security_group]

  iam_instance_profile {
    name = var.ecs_instance_profile
  }

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    cluster_name = aws_ecs_cluster.main.name
  }))

  tag_specifications {
    resource_type = "instance"
    tags = merge(var.tags, {
      Name = "${var.name_prefix}-ecs-instance"
    })
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "ecs" {
  name                      = "${var.name_prefix}-ecs-asg"
  vpc_zone_identifier       = var.subnet_ids
  min_size                  = var.min_capacity
  max_size                  = var.max_capacity
  desired_capacity          = var.desired_capacity
  health_check_type         = "ELB"
  health_check_grace_period = 300

  launch_template {
    id      = aws_launch_template.ecs.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.name_prefix}-ecs-asg"
    propagate_at_launch = false
  }

  tag {
    key                 = "AmazonECSManaged"
    value               = true
    propagate_at_launch = false
  }

  dynamic "tag" {
    for_each = var.tags
    content {
      key                 = tag.key
      value               = tag.value
      propagate_at_launch = false
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_ecs_capacity_provider" "main" {
  name = "${var.name_prefix}-capacity-provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.ecs.arn
    managed_termination_protection = "DISABLED"

    managed_scaling {
      maximum_scaling_step_size = 1
      minimum_scaling_step_size = 1
      status                    = "ENABLED"
      target_capacity           = 100
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = [aws_ecs_capacity_provider.main.name]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.main.name
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.name_prefix}-backend"
  retention_in_days = 7

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-logs"
  })
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.name_prefix}-frontend"
  retention_in_days = 7

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-frontend-logs"
  })
}

# ECS Task Definition for Backend
resource "aws_ecs_task_definition" "backend" {
  family                = "${var.name_prefix}-backend"
  requires_compatibilities = ["EC2"]
  network_mode         = "bridge"

  container_definitions = jsonencode([{
    name      = "backend"
    image     = var.backend_image
    memory    = 512
    essential = true

    portMappings = [{
      containerPort = 8080
      hostPort      = 0
      protocol      = "tcp"
    }]

    environment = [
      {
        name  = "SPRING_DATASOURCE_URL"
        value = "jdbc:postgresql://postgres.${var.name_prefix}.local:5432/${var.database_name}"
      },
      {
        name  = "SPRING_DATASOURCE_USERNAME"
        value = var.database_username
      },
      {
        name  = "SPRING_DATASOURCE_PASSWORD"
        value = var.database_password
      },
      {
        name  = "SPRING_DATA_REDIS_HOST"
        value = "redis.${var.name_prefix}.local"
      },
      {
        name  = "SPRING_DATA_REDIS_PORT"
        value = "6379"
      },
      {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      },
      {
        name  = "JWT_ACCESS_TOKEN_EXPIRATION"
        value = "900000"
      },
      {
        name  = "JWT_REFRESH_TOKEN_EXPIRATION"
        value = "604800000"
      },
      {
        name  = "JWT_ISSUER"
        value = "leafwheels-aws"
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"  = aws_cloudwatch_log_group.backend.name
        "awslogs-region" = var.aws_region
      }
    }
  }])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-task"
  })
}

# ECS Task Definition for Frontend
resource "aws_ecs_task_definition" "frontend" {
  family                = "${var.name_prefix}-frontend"
  requires_compatibilities = ["EC2"]
  network_mode         = "bridge"

  container_definitions = jsonencode([{
    name      = "frontend"
    image     = var.frontend_image
    memory    = 256
    essential = true

    portMappings = [{
      containerPort = 3000
      hostPort      = 0
      protocol      = "tcp"
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"  = aws_cloudwatch_log_group.frontend.name
        "awslogs-region" = var.aws_region
      }
    }
  }])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-frontend-task"
  })
}

# ECS Service for Backend
resource "aws_ecs_service" "backend" {
  name            = "${var.name_prefix}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "backend"
    container_port   = 8080
  }

  depends_on = [var.backend_target_group_arn]

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-service"
  })
}

# ECS Service for Frontend
resource "aws_ecs_service" "frontend" {
  name            = "${var.name_prefix}-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 2

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "frontend"
    container_port   = 3000
  }

  depends_on = [var.frontend_target_group_arn]

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-frontend-service"
  })
}

# ECS Task Definition for PostgreSQL
resource "aws_ecs_task_definition" "postgres" {
  family                = "${var.name_prefix}-postgres"
  requires_compatibilities = ["EC2"]
  network_mode         = "bridge"

  volume {
    name = "postgres-data"

    efs_volume_configuration {
      file_system_id     = var.efs_file_system_id
      root_directory     = "/postgres"
      transit_encryption = "ENABLED"
    }
  }

  container_definitions = jsonencode([{
    name      = "postgres"
    image     = "postgres:16"
    memory    = 512
    essential = true

    portMappings = [{
      containerPort = 5432
      hostPort      = 0
      protocol      = "tcp"
    }]

    environment = [
      {
        name  = "POSTGRES_DB"
        value = var.database_name
      },
      {
        name  = "POSTGRES_USER"
        value = var.database_username
      },
      {
        name  = "POSTGRES_PASSWORD"
        value = var.database_password
      }
    ]

    mountPoints = [{
      sourceVolume  = "postgres-data"
      containerPath = "/var/lib/postgresql/data"
      readOnly      = false
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"  = aws_cloudwatch_log_group.postgres.name
        "awslogs-region" = var.aws_region
      }
    }
  }])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres-task"
  })
}

# ECS Task Definition for Redis
resource "aws_ecs_task_definition" "redis" {
  family                = "${var.name_prefix}-redis"
  requires_compatibilities = ["EC2"]
  network_mode         = "bridge"

  volume {
    name = "redis-data"

    efs_volume_configuration {
      file_system_id     = var.efs_file_system_id
      root_directory     = "/redis"
      transit_encryption = "ENABLED"
    }
  }

  container_definitions = jsonencode([{
    name      = "redis"
    image     = "redis:7-alpine"
    memory    = 256
    essential = true

    portMappings = [{
      containerPort = 6379
      hostPort      = 0
      protocol      = "tcp"
    }]

    command = ["redis-server", "--save", "60", "1", "--loglevel", "warning"]

    mountPoints = [{
      sourceVolume  = "redis-data"
      containerPath = "/data"
      readOnly      = false
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"  = aws_cloudwatch_log_group.redis.name
        "awslogs-region" = var.aws_region
      }
    }
  }])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-task"
  })
}

# CloudWatch Log Group for PostgreSQL
resource "aws_cloudwatch_log_group" "postgres" {
  name              = "/ecs/${var.name_prefix}-postgres"
  retention_in_days = 7

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres-logs"
  })
}

# CloudWatch Log Group for Redis
resource "aws_cloudwatch_log_group" "redis" {
  name              = "/ecs/${var.name_prefix}-redis"
  retention_in_days = 7

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-logs"
  })
}

# ECS Service for PostgreSQL
resource "aws_ecs_service" "postgres" {
  name            = "${var.name_prefix}-postgres"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.postgres.arn
  desired_count   = 1

  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0

  service_registries {
    registry_arn   = aws_service_discovery_service.postgres.arn
    container_name = "postgres"
    container_port = 5432
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres-service"
  })
}

# ECS Service for Redis
resource "aws_ecs_service" "redis" {
  name            = "${var.name_prefix}-redis"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.redis.arn
  desired_count   = 1

  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0

  service_registries {
    registry_arn   = aws_service_discovery_service.redis.arn
    container_name = "redis"
    container_port = 6379
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-service"
  })
}

# Service Discovery Namespace
resource "aws_service_discovery_private_dns_namespace" "main" {
  name = "${var.name_prefix}.local"
  vpc  = var.vpc_id

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-service-discovery"
  })
}

# Service Discovery Service for PostgreSQL
resource "aws_service_discovery_service" "postgres" {
  name = "postgres"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 10
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }


  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres-discovery"
  })
}

# Service Discovery Service for Redis
resource "aws_service_discovery_service" "redis" {
  name = "redis"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 10
      type = "SRV"
    }

    routing_policy = "MULTIVALUE"
  }


  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-discovery"
  })
}
