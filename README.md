# LeafWheels Local Docker Environment Setup Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Running the Application](#running-the-application)
4. [Accessing Services](#accessing-services)


## Overview

LeafWheels uses Docker Compose to orchestrate a multi-service containerized environment including:

- **Backend API**: Spring Boot application (Java 17)
- **Frontend**: React SPA with Vite
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Monitoring**: Prometheus + Grafana stack

## Prerequisites

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 8 GB | 16 GB |
| **Disk Space** | 10 GB free | 20 GB free |
| **CPU** | 4 cores | 8 cores |

### Required Software

#### For All Operating Systems:
- **Git** (latest version)
- **Docker Desktop** or **Docker Engine** + **Docker Compose**
- **Text Editor/IDE** (VS Code, IntelliJ IDEA, etc.)

### Network Requirements
- Ports **3000**, **8080**, **5432**, **6379**, **9090**, **3001** must be available
- Internet connection for Docker image downloads

## Running the Application

### Step 1: Initial Setup and Build
```bash
# Navigate to project directory
cd leafwheels

# Pull and build all services (first time setup)
docker compose build

# Start all services in detached mode
docker compose up -d
```

### Step 2: Wait for Services to Initialize
The complete startup process takes approximately **2-3 minutes**:

1. **Database services** (postgres, redis) start first (~30 seconds)
2. **Backend** builds and starts (~60-90 seconds)
3. **Frontend** starts (~30 seconds)
4. **Monitoring services** (prometheus, grafana) start (~60 seconds)

## Accessing Services

### Application Services

| Service | URL | Purpose | Credentials |
|---------|-----|---------|-------------|
| **Frontend** | http://localhost:3000 | React SPA - Main application | N/A |
| **Backend API** | http://localhost:8080 | Spring Boot REST API | N/A |
| **API Documentation** | http://localhost:8080/swagger-ui.html | OpenAPI/Swagger docs | N/A |

### Database Services

| Service | Connection Details | Management Tool |
|---------|-------------------|-----------------|
| **PostgreSQL** | Host: localhost<br/>Port: 5432<br/>Database: leafwheels<br/>Username: user<br/>Password: password | pgAdmin, DBeaver |
| **Redis** | Host: localhost<br/>Port: 6379<br/>No password | RedisInsight |

### Monitoring Services

| Service | URL | Purpose | Credentials |
|---------|-----|---------|-------------|
| **Prometheus** | http://localhost:9090 | Metrics collection and queries | N/A |
| **Grafana** | http://localhost:3001 | Monitoring dashboards | admin / admin |

Please Manually import the Grafana dashboards from `./monitoring/grafana/dashboards`. 
> Also note that when first time importing the dashboards to Grafana, please click on edit for each panel and refresh. Otherwise the pannels will not be loaded. A running version on AWS of the dashboards is [here](http://leafwheels-alb-1205016128.us-east-1.elb.amazonaws.com/grafana).
