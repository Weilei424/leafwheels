# JWT Authentication System

## Overview

The LeafWheels API uses JWT (JSON Web Token) based authentication for secure access to protected endpoints.

## Authentication Flow

### 1. User Registration
- **Endpoint**: `POST /api/v1/auth/signup`
- **Description**: Register a new user account
- **Returns**: JWT access token and refresh token

### 2. User Login
- **Endpoint**: `POST /api/v1/auth/signin`
- **Description**: Authenticate existing user
- **Returns**: JWT access token and refresh token

### 3. Token Refresh
- **Endpoint**: `POST /api/v1/auth/refresh`
- **Description**: Generate new tokens using refresh token
- **Returns**: New JWT access token and refresh token

### 4. User Logout
- **Endpoint**: `POST /api/v1/auth/signout`
- **Description**: Invalidate refresh token and log out user

## Token Details

- **Access Token**: Valid for 15 minutes, used for API requests
- **Refresh Token**: Valid for 7 days, used to generate new access tokens
- **Token Type**: Bearer token
- **Storage**: Refresh tokens stored in Redis with TTL

## Using Authentication

### 1. Include Bearer Token
Add the access token to the Authorization header:
```
Authorization: Bearer <your-access-token>
```

### 2. Protected Endpoints
All endpoints except `/api/v1/auth/**` require authentication.

### 3. Token Expiration
When access token expires, use refresh token to get new tokens.

## Security Features

- **Account Lockout**: After 5 failed login attempts
- **Password Hashing**: BCrypt with salt
- **Token Blacklisting**: Refresh tokens invalidated on logout
- **Password Reset**: Secure token-based password reset
- **Session Management**: Redis-based session tracking

## Error Responses

- **401 Unauthorized**: Invalid or expired token
- **403 Forbidden**: Insufficient permissions
- **429 Too Many Requests**: Rate limiting applied

## Development Endpoints

For backward compatibility, development endpoints are available:
- `POST /api/v1/auth/dev/login` - Simple login without JWT
- `POST /api/v1/auth/dev/signup` - Simple signup without JWT

These endpoints should not be used in production.