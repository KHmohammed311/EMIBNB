# ── Étape 1 : Build Maven ───────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copier pom.xml seul d'abord (cache des dépendances)
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copier les sources et builder
COPY src ./src
RUN mvn package -DskipTests -q

# ── Étape 2 : Image légère JRE ──────────────────────────────────
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
