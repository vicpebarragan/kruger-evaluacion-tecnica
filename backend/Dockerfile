# Stage 1: Build the application using Maven wrapper
FROM eclipse-temurin:17-jdk-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy Maven wrapper and project configuration
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Grant execution permissions to Maven wrapper
RUN chmod +x mvnw

# Pre-download dependencies to optimize builds
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src src

# Build the application (skip tests for faster build)
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the final runtime image
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Create a directory for application logs
RUN mkdir -p /var/log/krugerlogs

# Copy the compiled JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port (set via environment variable)
EXPOSE ${SERVER_PORT}

# Define the entry point to run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
