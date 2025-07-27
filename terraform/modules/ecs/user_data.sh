#!/bin/bash
echo ECS_CLUSTER=${cluster_name} >> /etc/ecs/ecs.config
echo ECS_BACKEND_HOST= >> /etc/ecs/ecs.config
echo ECS_ENABLE_TASK_IAM_ROLE=true >> /etc/ecs/ecs.config
echo ECS_ENABLE_TASK_IAM_ROLE_NETWORK_HOST=true >> /etc/ecs/ecs.config

# Install additional packages
yum update -y
yum install -y aws-cli

# Configure Docker daemon
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "awslogs",
  "log-opts": {
    "awslogs-group": "/ecs/${cluster_name}",
    "awslogs-region": "${aws_region}",
    "awslogs-stream-prefix": "ecs"
  }
}
EOF

systemctl restart docker
systemctl restart ecs