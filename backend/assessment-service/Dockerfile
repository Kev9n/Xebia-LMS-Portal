# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copy the entire backend directory (dockerContext is set to backend/)
COPY . .
# Build all modules to ensure common-lib is installed
RUN mvn clean install -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/assessment-service/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
