# JWT Authentication System Design

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Data Flow](#data-flow)
4. [Component Interactions](#component-interactions)
5. [Security Model](#security-model)
6. [API Usage Guide](#api-usage-guide)
7. [Database Schema](#database-schema)
8. [Configuration](#configuration)
9. [Testing Strategy](#testing-strategy)
10. [Future Considerations](#future-considerations)

## System Overview

The LeafWheels JWT Authentication System is a comprehensive, production-ready authentication solution built with Spring Boot and Spring Security. It implements industry-standard security practices with JWT tokens, Redis session management, and robust account protection mechanisms.

### Key Features
- **Stateless Authentication**: JWT-based token system
- **Dual Token Strategy**: Short-lived access tokens + long-lived refresh tokens
- **Account Security**: Lockout protection, password hashing, failed attempt tracking
- **Session Management**: Redis-based token storage with TTL
- **Password Recovery**: Secure token-based password reset flow
- **Backward Compatibility**: Legacy dev endpoints for existing integrations

## Architecture Design

### 1. Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  AuthController │  │ Other Controllers│                  │
│  │   (JWT Auth)    │  │  (Protected)     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     Security Layer                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ JWT Auth Filter │  │ Security Config  │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  AuthService    │  │   JwtService     │  │ UserDetails  │ │
│  │  (Business)     │  │   (Token Mgmt)   │  │   Service    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  PostgreSQL     │  │     Redis        │                  │
│  │ (User Data)     │  │ (Sessions/Tokens)│                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 2. Component Responsibilities

#### **AuthController**
- Handles HTTP requests for authentication endpoints
- Validates input DTOs
- Delegates business logic to AuthService
- Returns standardized API responses

#### **JwtAuthenticationFilter**
- Intercepts all HTTP requests
- Extracts JWT tokens from Authorization header
- Validates tokens and sets Spring Security context
- Skips auth endpoints and handles missing/invalid tokens

#### **AuthService**
- Core authentication business logic
- User registration and login workflows
- Token generation and refresh logic
- Password reset functionality
- Account lockout management

#### **JwtService**
- JWT token creation and validation
- Claims extraction and verification
- Token expiration management
- Cryptographic operations

#### **CustomUserDetailsService**
- Bridges User entity with Spring Security
- Loads user data for authentication
- Provides UserPrincipal with security context

## Data Flow

### 1. User Registration Flow

```
Client Request (POST /auth/signup)
         │
         ▼
   AuthController
         │
   ┌─────▼─────┐
   │Validate   │
   │Password   │
   │Match      │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Check Email│
   │Uniqueness │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Hash       │
   │Password   │
   │(BCrypt)   │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Save User  │
   │to DB      │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Generate   │
   │JWT Tokens │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Store      │
   │Refresh    │
   │Token Redis│
   └─────┬─────┘
         │
         ▼
   Return AuthResponse
   {
     accessToken,
     refreshToken,
     user
   }
```

### 2. User Login Flow

```
Client Request (POST /auth/signin)
         │
         ▼
   AuthController
         │
   ┌─────▼─────┐
   │Find User  │
   │by Email   │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Check      │
   │Account    │
   │Status     │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Spring     │
   │Security   │
   │Auth       │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Password   │
   │Validation │
   │(BCrypt)   │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Reset      │
   │Failed     │
   │Attempts   │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Update     │
   │Last Login │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Generate   │
   │JWT Tokens │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Store      │
   │Refresh    │
   │Token Redis│
   └─────┬─────┘
         │
         ▼
   Return AuthResponse
```

### 3. Protected Endpoint Access Flow

```
Client Request with Bearer Token
         │
         ▼
  JwtAuthenticationFilter
         │
   ┌─────▼─────┐
   │Extract    │
   │Token from │
   │Header     │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Validate   │
   │Token      │
   │Structure  │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Extract    │
   │Username   │
   │from Token │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Load User  │
   │Details    │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Verify     │
   │Token      │
   │Validity   │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Set        │
   │Security   │
   │Context    │
   └─────┬─────┘
         │
         ▼
   Continue to Controller
```

### 4. Token Refresh Flow

```
Client Request (POST /auth/refresh)
         │
         ▼
   AuthController
         │
   ┌─────▼─────┐
   │Extract    │
   │Username   │
   │from Token │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Retrieve   │
   │Stored     │
   │Token Redis│
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Compare    │
   │Tokens     │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Validate   │
   │Token      │
   │Expiry     │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Generate   │
   │New Tokens │
   └─────┬─────┘
         │
   ┌─────▼─────┐
   │Delete Old │
   │Store New  │
   │Redis      │
   └─────┬─────┘
         │
         ▼
   Return New Tokens
```

## Component Interactions

### 1. Spring Security Integration

```
HTTP Request
     │
     ▼
SecurityFilterChain
     │
┌────▼────┐
│ CORS    │
│ Filter  │
└────┬────┘
     │
┌────▼────┐
│ JWT     │
│ Auth    │
│ Filter  │
└────┬────┘
     │
┌────▼────┐
│Username │
│Password │
│Auth     │
│Filter   │
└────┬────┘
     │
     ▼
Controller
```

### 2. Service Dependencies

```
AuthController
     │
     ├─── AuthService
     │         │
     │         ├─── UserRepository
     │         ├─── PasswordEncoder
     │         ├─── JwtService
     │         ├─── AuthenticationManager
     │         ├─── UserMapper
     │         └─── RedisTemplate
     │
     └─── UserService (legacy)

JwtAuthenticationFilter
     │
     ├─── JwtService
     └─── UserDetailsService
              │
              └─── UserRepository
```

## Security Model

### 1. Authentication Layers

1. **JWT Token Validation**
   - Signature verification
   - Expiration checking
   - Claims validation

2. **User Account Validation**
   - Account enabled status
   - Account lock status
   - Account expiration

3. **Session Management**
   - Refresh token tracking
   - Concurrent session limits
   - Token blacklisting

### 2. Password Security

```
Raw Password
     │
     ▼
BCrypt.encode(password, saltRounds=12)
     │
     ▼
Hashed Password ($2a$12$...)
     │
     ▼
Store in Database
```

### 3. Account Protection

- **Failed Login Tracking**: Incremented on each failed attempt
- **Account Lockout**: Triggered after 5 failed attempts
- **Lockout Duration**: 5 minutes (configurable)
- **Unlock Mechanism**: Automatic expiry or password reset

### 4. Token Security

- **Access Token Lifespan**: 1 hour
- **Refresh Token Lifespan**: 7 days
- **Token Rotation**: New refresh token on each refresh
- **Secure Storage**: Redis with TTL
- **Token Blacklisting**: Immediate invalidation on logout

## API Usage Guide

### 1. User Registration

```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900000,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "USER"
  }
}
```

### 2. User Login

```bash
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}

Response: (Same as registration)
```

### 3. Using Protected Endpoints

```bash
GET /api/v1/vehicles
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: Vehicle data or 401 Unauthorized
```

### 4. Token Refresh

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: New token pair
```

### 5. Logout

```bash
POST /api/v1/auth/signout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response: 200 OK
```

### 6. Password Reset

```bash
# Step 1: Request reset
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john.doe@example.com"
}

# Step 2: Reset with token
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

## Database Schema

### User Entity Extensions

```sql
-- New columns added to existing users table
ALTER TABLE users ADD COLUMN account_enabled BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN account_locked BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN account_expired BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN password_reset_expires_at TIMESTAMP;

-- Note: Using Instant in Java maps to TIMESTAMP in database
-- Instant provides UTC-based time representation for better consistency
```

### Seed Data Updates

The UserLoader has been updated to:
- **Hash passwords** using BCryptPasswordEncoder
- **Set security fields** explicitly for testing scenarios
- **Create test accounts** with different states:
  - Active users with verified emails
  - User with unverified email (testing email verification)
  - User with failed login attempts (testing lockout mechanism)  
  - Locked account (testing locked account handling)
  - Admin users with full access

### Redis Schema

```
Key Pattern: refresh_token:{userId}
Value: JWT refresh token string
TTL: 7 days

Example:
refresh_token:550e8400-e29b-41d4-a716-446655440000
-> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Configuration

### Application Properties

```properties
# JWT Configuration
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.access-token-expiration=900000     # 15 minutes
jwt.refresh-token-expiration=604800000 # 7 days
jwt.issuer=leafwheels-api

# Security Configuration
security.max-login-attempts=5
security.account-lockout-duration=300000      # 5 minutes
security.password-reset-token-expiration=3600000 # 1 hour

# Redis Configuration
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.session.store-type=redis
```

### Security Configuration Highlights

```java
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    // Public endpoints (no authentication required)
    "/api/v1/auth/**"
    "/swagger-ui/**"
    "/actuator/**"
    
    // Protected endpoints (JWT required)
    All other endpoints
    
    // Session management
    SessionCreationPolicy.STATELESS
    
    // Authentication provider
    DaoAuthenticationProvider with BCrypt
}
```

## Testing Strategy

### 1. Unit Tests

- **JwtService**: Token generation, validation, expiration
- **AuthService**: Business logic, error handling, security flows
- **JwtAuthenticationFilter**: Request filtering, token extraction
- **CustomUserDetailsService**: User loading, permission mapping

### 2. Integration Tests

- **AuthController**: End-to-end authentication flows
- **Security Configuration**: Endpoint protection verification
- **Database Integration**: User persistence and retrieval
- **Redis Integration**: Token storage and retrieval

### 3. Security Tests

- **Token Tampering**: Modified token rejection
- **Expired Tokens**: Proper expiration handling
- **Account Lockout**: Failed attempt accumulation
- **Password Security**: Hashing verification

### 4. Performance Tests

- **Token Validation Speed**: Concurrent request handling
- **Redis Performance**: Session lookup efficiency
- **Database Queries**: User retrieval optimization

## Future Considerations

### 1. AWS Cognito Integration

The current architecture is designed to facilitate future migration to AWS Cognito:

```java
// Abstract authentication interface
public interface AuthenticationProvider {
    AuthResponseDto authenticate(SigninRequestDto request);
    AuthResponseDto register(SignupRequestDto request);
}

// Current implementation
@Service
public class JwtAuthenticationProvider implements AuthenticationProvider

// Future implementation
@Service
public class CognitoAuthenticationProvider implements AuthenticationProvider
```

### 2. Social Login Integration

- OAuth2 integration points identified
- User entity supports federated identity
- Token mapping for external providers

### 3. Multi-Factor Authentication

- User entity prepared for MFA settings
- Token structure supports additional claims
- Session management can track MFA status

### 4. Advanced Session Management

- Device tracking and management
- Geographic session monitoring
- Suspicious activity detection

### 5. API Rate Limiting

- Redis-based rate limiting implementation
- Per-user and per-endpoint limits
- Gradual backoff strategies

### 6. Audit Logging

- Security event tracking
- Authentication attempt logging
- Token usage analytics

## Troubleshooting Guide

### Common Issues

1. **Token Validation Failures**
   - Check JWT secret configuration
   - Verify token format and structure
   - Confirm system clock synchronization

2. **Account Lockout Issues**
   - Check failed attempt counter
   - Verify lockout duration settings
   - Use password reset to unlock

3. **Redis Connection Problems**
   - Verify Redis server status
   - Check connection configuration
   - Monitor Redis memory usage

4. **Database Migration Issues**
   - Run schema updates for new columns
   - Check column defaults and constraints
   - Verify existing user data compatibility

### Performance Optimization

1. **Token Validation Caching**
   - Cache user details for token duration
   - Implement token signature caching
   - Use Redis for distributed caching

2. **Database Query Optimization**
   - Index email column for user lookup
   - Optimize failed attempt queries
   - Consider read replicas for user data

3. **Redis Optimization**
   - Configure appropriate TTL values
   - Monitor memory usage and eviction
   - Consider Redis clustering for scale

This comprehensive design documentation provides a complete understanding of the JWT authentication system, enabling effective usage, maintenance, and future enhancements.
