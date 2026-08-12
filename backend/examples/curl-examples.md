# Enterprise LMS Curl Examples

Start dependencies and services after packaging:

```bash
mvn clean package -DskipTests
docker compose up --build
```

Login with the seeded Admin user:

```bash
curl -X POST http://localhost:8080/api/iam/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "11111111-1111-1111-1111-111111111111",
    "email": "admin@lms.local",
    "password": "AdminChangeMe123!"
  }'
```

Create a university:

```bash
TOKEN="paste-login-token"

curl -X POST http://localhost:8080/api/organisations/universities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Xebia University",
    "type": "UNIVERSITY",
    "officialContactName": "Registrar",
    "officialContactEmail": "registrar@example.edu",
    "officialContactPhone": "+911234567890"
  }'
```

Create a course:

```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Enterprise Java","description":"Spring Boot microservices","published":true}'
```

Create an approval request:

```bash
curl -X POST http://localhost:8080/api/approvals/requests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"actionCode":"DELETE","resourceType":"COURSE","resourceId":"sample-course-id","payloadJson":"{}"}'
```
