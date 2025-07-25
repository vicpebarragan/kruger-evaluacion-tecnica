# Instrucciones para ejecutar el backend y frontend

## Opción 1: Usando Docker Compose (Recomendado)

### Requisitos previos
- Docker
- Docker Compose

### Ejecución con Docker Compose

1. Clona el repositorio:
   ```bash
   git clone https://github.com/vicpebarragan/kruger-evaluacion-tecnica.git
   cd kruger-evaluacion-tecnica
   ```

2. Levanta los contenedores:
   ```bash
   docker-compose up -d
   ```

Esto iniciará:
- PostgreSQL en `localhost:5432`
- Backend en `http://localhost:8080/ktestfull`
- Frontend en `http://localhost:3001`

Para detener los servicios:
```bash
docker-compose down
```

## Opción 2: Ejecución Local

## Backend (Spring Boot)

### Requisitos previos
- Java 17+
- Maven 3.8+
- Base de datos postgresSQL

### Ejecución local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/kruger-evaluacion-tecnica.git
   cd kruger-evaluacion-tecnica/backend
   ```
2. Configurar las variables de entorno en el archivo `application.properties`

2. Ejecuta la aplicación:
   ```bash
   mvn spring-boot:run
   ```
   La API estará disponible en: `http://localhost:8080/ktestfull`

4. Accede a la documentación Swagger:
   - [http://localhost:8080/ktestfull/swagger-ui.html](http://localhost:8080/ktestfull/swagger-ui.html)

#### (Opcional) Ejecución con Docker (previamente configurar variables de entorno o incluir en comando docker)
```bash
docker build -t kruger-backend .
docker run -p 8080:8080 kruger-backend
```

---

## Frontend (React + Next.js)

### Requisitos previos
- Node.js 18+
- npm

### Ejecución local

1. Ve a la carpeta del frontend:
   ```bash
   cd ../frontend
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Ejecuta la aplicación:
   ```bash
   npm run dev
   ```
   La app estará disponible en: `http://localhost:3001`

---

## Credenciales preconfiguradas

| Rol   | Usuario        | Contraseña |
|-------|---------------|------------|
| ADMIN | kruger@test.com | kruger   |

> Puedes usar estas credenciales para probar el login y los endpoints protegidos.

---

## Estructura del Proyecto

```
kruger-evaluacion-tecnica/
├── backend/                  # Proyecto Spring Boot
├── frontend/                 # Proyecto Next.js
├── db/
│   └── init.sql              # Script inicial de base de datos
├── docker-compose.yml        # Configuración de Docker Compose
└── README.md                 # Documentación para el proyecto
```

---

## Notas adicionales

### Configuración de Base de datos
- Cuando se usa Docker Compose, se utiliza PostgreSQL
  - Host: localhost
  - Puerto: 5432
  - Base de datos: ktestfulldb
  - Usuario: ktestfull
  - Contraseña: ktestpassfull

### Configuración de la aplicación
- El backend implementa JWT para autenticación. El token se obtiene al hacer login y debe enviarse en el header `Authorization: Bearer <token>`.
- Solo el usuario con rol ADMIN puede crear nuevos usuarios.
- El frontend está configurado para consumir la API en `http://localhost:8080/ktestfull`.
- Si cambias el puerto o la URL del backend, actualiza:
  - En ejecución local: el archivo `.env.local` del frontend
  - En Docker Compose: la variable `NEXT_PUBLIC_API_URL` en el docker-compose.yml

---

Contacto: victor.pena@sasf.net
