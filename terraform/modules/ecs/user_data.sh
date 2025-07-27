#!/bin/bash
set -x
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting ECS configuration..."

# Configure ECS agent
echo ECS_CLUSTER=${cluster_name} >> /etc/ecs/ecs.config
echo ECS_BACKEND_HOST= >> /etc/ecs/ecs.config
echo ECS_ENABLE_TASK_IAM_ROLE=true >> /etc/ecs/ecs.config
echo ECS_ENABLE_TASK_IAM_ROLE_NETWORK_HOST=true >> /etc/ecs/ecs.config
echo ECS_ENABLE_CONTAINER_METADATA=true >> /etc/ecs/ecs.config

echo "ECS config written:"
cat /etc/ecs/ecs.config

yum update -y
yum install -y aws-cli

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

echo "Docker daemon config written:"
cat /etc/docker/daemon.json

systemctl restart docker
systemctl enable ecs
systemctl restart ecs

sleep 30

systemctl status ecs --no-pager
curl -s http://localhost:51678/v1/metadata || echo "ECS agent not responding"

echo "User data script completed"
