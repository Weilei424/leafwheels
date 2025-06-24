# LeafWheels Backend System — Full Guide

## What is Spring Boot?

**Spring Boot** is a Java-based framework that simplifies backend development. It automatically handles common tasks such as:
- Starting a web server
- Connecting to a database
- Handling API requests and responses
- Managing application security

In LeafWheels, we’re using Spring Boot to expose REST APIs that manage `Vehicle` and `User` and other backend data.

---

## Project Structure

![image](https://github.com/user-attachments/assets/6c740755-b457-40ba-93a8-2c0c4a42731c)


Let’s break it down:

### 1️⃣ **config/**
- `JpaConfig` — Custom configuration for JPA (Java Persistence API), which handles database operations.
- `SecurityConfig` — Configures authentication, authorization, and security rules for our APIs.

### 2️⃣ **constants/**
Holds all enum types:
- `BodyType`, `Condition`, `Make`, `Role`, `VehicleStatus` — Strictly defines valid values for our data models.

### 3️⃣ **domain/**
Contains entities (i.e. tables in the database):
- `BaseEntity` — A shared base class with fields like `createdAt`, `updatedAt`.
- `User` — Represents user data.
- `Vehicle` — Represents vehicle data.

### 4️⃣ **exception/**
Handles errors:
- Custom exceptions (`EntitiesNotMatchException`, `EntityNotFoundException`)
- `ApplicationExceptionHandler` — Converts exceptions into standardized error responses (`ErrorResponse`) for clients.

### 5️⃣ **repositories/**
Data access layer:
- `UserRepository` & `VehicleRepository` — Interfaces that communicate with the database using Spring Data JPA. You don’t need to write SQL queries — JPA generates them for you.

### 6️⃣ **services/**
Business logic layer:
- `AuthService` — Handles user authentication.
- `VehicleService` — Interface defining vehicle-related operations.
- `VehicleServiceImpl` — Actual implementation of vehicle operations.

### 7️⃣ **web/controllers/**
REST API layer:
- `AuthController` — User login, signup, authentication.
- `VehicleController` — Exposes endpoints to create, retrieve, update, and delete vehicles.

Example of `VehicleController`:

![image](https://github.com/user-attachments/assets/21ae3682-9966-4e4e-b4bc-996452c48fa8)


Endpoints:
| HTTP | URL | Description |
|------|-----|-------------|
| GET | `/api/v1/vehicle/{vehicleId}` | Retrieve a vehicle by ID |
| POST | `/api/v1/vehicle` | Create a new vehicle |
| PUT | `/api/v1/vehicle/{vehicleId}` | Update a vehicle |
| DELETE | `/api/v1/vehicle/{vehicleId}` | Delete a vehicle |
| GET | `/api/v1/vehicle/all` | Get all vehicles |

### 8️⃣ **web/mappers/**
Uses **MapStruct** to convert between:
- `Vehicle` (entity — database object)
- `VehicleDto` (DTO — Data Transfer Object sent over the API)

Mapping helps us keep internal database models separate from external API models.

### 9️⃣ **web/models/**
- `VehicleDto` — What we expose to clients via the API.

### 🔟 **resources/**
- `application.properties` — App configuration (database connection, security settings, etc.)

---

##  How components interact

Controller → Service → Repository → Database

---

- **Controller:** Receives HTTP requests.
- **Service:** Contains business logic.
- **Repository:** Talks to the database.
- **Mapper:** Converts between DTOs and Entities.
- **Exception handler:** Converts Java exceptions into HTTP responses.

---

## Dependencies Overview (pom.xml)

Let’s explain why each dependency exists:

| Dependency | Purpose |
|-------------|---------|
| `spring-boot-starter-data-jpa` | ORM (Object-Relational Mapping) with JPA for database access |
| `spring-boot-starter-web` | Build REST APIs |
| `spring-boot-starter-security` | Authentication & authorization |
| `com.h2database` | Lightweight in-memory database for local development/testing |
| `lombok` | Reduce boilerplate code (getters/setters, constructors, etc.) |
| `spring-boot-starter-test` | Testing support |
| `spring-security-test` | Testing security configurations |
| `spring-restdocs-mockmvc` | Generate API documentation from tests |
| `mapstruct` | Object mapping (DTO ↔ Entity conversion) |

### Build plugins:

| Plugin | Purpose |
|--------|---------|
| `maven-compiler-plugin` | Configures Java version, MapStruct & Lombok annotation processors |
| `asciidoctor-maven-plugin` | Generates API documentation automatically |
| `spring-boot-maven-plugin` | Package the app into an executable JAR |

---

## Running the Application

### Prerequisites

- Java 17+
- Maven 3.8+

### Start locally:

```bash
# From project root
./mvnw spring-boot:run
```

App will start on: `http://localhost:8080`

### Access API (example with curl):

```bash
# Get all vehicles
curl http://localhost:8080/api/v1/vehicle/all
```

