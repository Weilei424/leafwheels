# ECS Role
resource "aws_iam_role" "ecs_instance" {
  name = "${var.name_prefix}-ecs-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-ecs-instance-role"
  })
}

# ECS Profile
resource "aws_iam_instance_profile" "ecs_instance" {
  name = "${var.name_prefix}-ecs-instance-profile"
  role = aws_iam_role.ecs_instance.name

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-ecs-instance-profile"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_instance" {
  role       = aws_iam_role.ecs_instance.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.name_prefix}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-ecs-task-execution-role"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Role
resource "aws_iam_role" "ecs_task" {
  name = "${var.name_prefix}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-ecs-task-role"
    Purpose = "ECSTask"
  })
}

# Policy for S3 access
resource "aws_iam_policy" "s3_access" {
  name        = "${var.name_prefix}-s3-access-policy"
  description = "Policy for S3 access from ECS tasks"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.name_prefix}-images-*",
          "arn:aws:s3:::${var.name_prefix}-images-*/*"
        ]
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-s3-access-policy"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_s3" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.s3_access.arn
}

# Policy for CloudWatch Logs
resource "aws_iam_policy" "cloudwatch_logs" {
  name        = "${var.name_prefix}-cloudwatch-logs-policy"
  description = "Policy for CloudWatch Logs access from ECS tasks"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-cloudwatch-logs-policy"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_logs" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = aws_iam_policy.cloudwatch_logs.arn
}

# Policy for AWS Lex access
resource "aws_iam_policy" "lex_access" {
  name        = "${var.name_prefix}-lex-access-policy"
  description = "Policy for AWS Lex access from ECS tasks"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lex:PostText",
          "lex:PostContent",
          "lex:GetBot",
          "lex:GetBotAlias",
          "lex:GetBotVersions",
          "lex:GetIntent",
          "lex:GetSlotType"
        ]
        Resource = [
          "arn:aws:lex:*:*:bot:${var.name_prefix}-chatbot:*",
          "arn:aws:lex:*:*:intent:*",
          "arn:aws:lex:*:*:slottype:*"
        ]
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-lex-access-policy"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_lex" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.lex_access.arn
}

# Policy for ECR access
resource "aws_iam_policy" "ecr_access" {
  name        = "${var.name_prefix}-ecr-access-policy"
  description = "Policy for ECR access from ECS instances"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-ecr-access-policy"
  })
}

resource "aws_iam_role_policy_attachment" "ecs_instance_ecr" {
  role       = aws_iam_role.ecs_instance.name
  policy_arn = aws_iam_policy.ecr_access.arn
}
