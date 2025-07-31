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

# Launch template not needed for Fargate
# resource "aws_launch_template" "ecs" {
#   name_prefix   = "${var.name_prefix}-ecs-"
#   image_id      = var.ami_id
#   instance_type = var.instance_type
#   key_name      = var.key_name
#
#   vpc_security_group_ids = [var.ecs_security_group]
#
#   iam_instance_profile {
#     name = var.ecs_instance_profile
#   }
#
#   user_data = base64encode(templatefile("${path.module}/user_data.sh", {
#     cluster_name = aws_ecs_cluster.main.name
#     aws_region   = var.aws_region
#   }))
#
#   tag_specifications {
#     resource_type = "instance"
#     tags = merge(var.tags, {
#       Name = "${var.name_prefix}-ecs-instance"
#     })
#   }
#
#   lifecycle {
#     create_before_destroy = true
#   }
# }

# Auto Scaling Group not needed for Fargate
# resource "aws_autoscaling_group" "ecs" {
#   name                      = "${var.name_prefix}-ecs-asg"
#   vpc_zone_identifier       = var.subnet_ids
#   min_size                  = var.min_capacity
#   max_size                  = var.max_capacity
#   desired_capacity          = var.desired_capacity
#   health_check_type         = "ELB"
#   health_check_grace_period = 300
#
#   launch_template {
#     id      = aws_launch_template.ecs.id
#     version = "$Latest"
#   }
#
#   tag {
#     key                 = "Name"
#     value               = "${var.name_prefix}-ecs-asg"
#     propagate_at_launch = false
#   }
#
#   tag {
#     key                 = "AmazonECSManaged"
#     value               = true
#     propagate_at_launch = false
#   }
#
#   dynamic "tag" {
#     for_each = var.tags
#     content {
#       key                 = tag.key
#       value               = tag.value
#       propagate_at_launch = false
#     }
#   }
#
#   lifecycle {
#     create_before_destroy = true
#   }
# }

# Capacity provider not needed for Fargate
# resource "aws_ecs_capacity_provider" "main" {
#   name = "${var.name_prefix}-capacity-provider"
#
#   auto_scaling_group_provider {
#     auto_scaling_group_arn         = aws_autoscaling_group.ecs.arn
#     managed_termination_protection = "DISABLED"
#
#     managed_scaling {
#       maximum_scaling_step_size = 1
#       minimum_scaling_step_size = 1
#       status                    = "ENABLED"
#       target_capacity           = 100
#     }
#   }
# }

# resource "aws_ecs_cluster_capacity_providers" "main" {
#   cluster_name = aws_ecs_cluster.main.name
#
#   capacity_providers = [aws_ecs_capacity_provider.main.name]
#
#   default_capacity_provider_strategy {
#     base              = 1
#     weight            = 100
#     capacity_provider = aws_ecs_capacity_provider.main.name
#   }
# }

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "cluster" {
  name              = "/ecs/${var.name_prefix}-cluster"
  retention_in_days = 7

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-cluster-logs"
  })
}

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
  family                   = "${var.name_prefix}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  container_definitions = jsonencode([{
    name      = "backend"
    image     = var.backend_image
    memory    = 512
    essential = true

    portMappings = [{
      containerPort = 8080
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
        "awslogs-group"         = aws_cloudwatch_log_group.backend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-backend-task"
  })
}

# ECS Task Definition for Frontend
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.name_prefix}-frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  container_definitions = jsonencode([{
    name      = "frontend"
    image     = var.frontend_image
    memory    = 256
    essential = true

    portMappings = [{
      containerPort = 3000
      protocol      = "tcp"
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
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
  launch_type                        = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.ecs_security_group]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "backend"
    container_port   = 8080
  }

  depends_on = [
    var.backend_target_group_arn,
    aws_ecs_service.postgres,
    aws_ecs_service.redis
  ]

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
  launch_type                        = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.ecs_security_group]
    assign_public_ip = false
  }

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
  family                   = "${var.name_prefix}-postgres"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  volume {
    name = "postgres-data"

    efs_volume_configuration {
      file_system_id     = var.efs_file_system_id
      root_directory     = "/"
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
      },
      {
        name  = "PGDATA"
        value = "/var/lib/postgresql/data/pgdata"
      }
    ]

    healthCheck = {
      command     = ["CMD-SHELL", "pg_isready -U ${var.database_username} -d ${var.database_name}"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }

    mountPoints = [{
      sourceVolume  = "postgres-data"
      containerPath = "/var/lib/postgresql/data"
      readOnly      = false
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.postgres.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-postgres-task"
  })
}

# ECS Task Definition for Redis
resource "aws_ecs_task_definition" "redis" {
  family                   = "${var.name_prefix}-redis"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  volume {
    name = "redis-data"

    efs_volume_configuration {
      file_system_id     = var.efs_file_system_id
      root_directory     = "/"
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
      protocol      = "tcp"
    }]

    command = ["redis-server", "--save", "60", "1", "--loglevel", "warning"]

    healthCheck = {
      command     = ["CMD-SHELL", "redis-cli ping"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 30
    }

    mountPoints = [{
      sourceVolume  = "redis-data"
      containerPath = "/data"
      readOnly      = false
    }]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.redis.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
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
  launch_type                        = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.ecs_security_group]
    assign_public_ip = false
  }

  service_registries {
    registry_arn   = aws_service_discovery_service.postgres.arn
    container_name = "postgres"
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
  launch_type                        = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.ecs_security_group]
    assign_public_ip = false
  }

  service_registries {
    registry_arn   = aws_service_discovery_service.redis.arn
    container_name = "redis"
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
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
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
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-discovery"
  })
}

# Service Discovery Service for Prometheus
resource "aws_service_discovery_service" "prometheus" {
  name = "prometheus"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 10
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-prometheus-discovery"
  })
}

# Service Discovery Service for Grafana
resource "aws_service_discovery_service" "grafana" {
  name = "grafana"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 10
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-grafana-discovery"
  })
}

# CloudWatch Log Groups for Monitoring
resource "aws_cloudwatch_log_group" "prometheus" {
  name              = "/ecs/${var.name_prefix}-prometheus"
  retention_in_days = 7

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-prometheus-logs"
  })
}

resource "aws_cloudwatch_log_group" "grafana" {
  name              = "/ecs/${var.name_prefix}-grafana"
  retention_in_days = 7

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-grafana-logs"
  })
}

# ECS Task Definition for Prometheus
resource "aws_ecs_task_definition" "prometheus" {
  family                   = "${var.name_prefix}-prometheus"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  # Remove EFS volume for now - use container local storage

  container_definitions = jsonencode([{
    name      = "prometheus"
    image     = "prom/prometheus:latest"
    memory    = 512
    essential = true

    portMappings = [{
      containerPort = 9090
      protocol      = "tcp"
    }]

    environment = [
      {
        name  = "PROMETHEUS_CONFIG_CONTENT"
        value = base64encode(file("${path.module}/prometheus.yml"))
      }
    ]

    entryPoint = ["sh", "-c"]
    command = [
      "echo $PROMETHEUS_CONFIG_CONTENT | base64 -d > /tmp/prometheus.yml && prometheus --config.file=/tmp/prometheus.yml --storage.tsdb.path=/prometheus --web.console.libraries=/etc/prometheus/console_libraries --web.console.templates=/etc/prometheus/consoles --storage.tsdb.retention.time=200h --web.enable-lifecycle"
    ]

    healthCheck = {
      command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:9090/-/healthy || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 30
    }

    # Use default prometheus data directory
    mountPoints = []

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.prometheus.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-prometheus-task"
  })
}

# ECS Task Definition for Grafana
resource "aws_ecs_task_definition" "grafana" {
  family                   = "${var.name_prefix}-grafana"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  # Remove EFS volume for now - use container local storage

  container_definitions = jsonencode([{
    name      = "grafana"
    image     = "grafana/grafana:latest"
    memory    = 512
    essential = true

    portMappings = [{
      containerPort = 3000
      protocol      = "tcp"
    }]

    environment = [
      {
        name  = "GF_SECURITY_ADMIN_USER"
        value = "admin"
      },
      {
        name  = "GF_SECURITY_ADMIN_PASSWORD"
        value = "admin"
      },
      {
        name  = "GF_USERS_ALLOW_SIGN_UP"
        value = "false"
      },
      {
        name  = "GF_SERVER_ROOT_URL"
        value = "%(protocol)s://%(domain)s:%(http_port)s/grafana/"
      },
      {
        name  = "GF_SERVER_SERVE_FROM_SUB_PATH"
        value = "true"
      }
    ]

    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }

    # Use default grafana data directory
    mountPoints = []

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.grafana.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-grafana-task"
  })
}

# ECS Service for Prometheus
resource "aws_ecs_service" "prometheus" {
  name            = "${var.name_prefix}-prometheus"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.prometheus.arn
  desired_count   = 1

  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0
  launch_type                        = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.ecs_security_group]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.prometheus_target_group_arn
    container_name   = "prometheus"
    container_port   = 9090
  }

  service_registries {
    registry_arn   = aws_service_discovery_service.prometheus.arn
    container_name = "prometheus"
  }

  depends_on = [
    var.prometheus_target_group_arn,
    aws_ecs_service.backend,
    aws_ecs_service.postgres,
    aws_ecs_service.redis
  ]

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-prometheus-service"
  })
}

# ECS Service for Grafana
resource "aws_ecs_service" "grafana" {
  name            = "${var.name_prefix}-grafana"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.grafana.arn
  desired_count   = 1

  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0
  launch_type                        = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.ecs_security_group]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.grafana_target_group_arn
    container_name   = "grafana"
    container_port   = 3000
  }

  service_registries {
    registry_arn   = aws_service_discovery_service.grafana.arn
    container_name = "grafana"
  }

  depends_on = [
    var.grafana_target_group_arn,
    aws_ecs_service.prometheus
  ]

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-grafana-service"
  })
}
