# ProjDesp
# Gestor de Tareas

Este proyecto es una aplicación web de gestión de tareas desarrollada con **React** en el frontend, **FastAPI** en el backend y **NGINX** como proxy inverso y balanceador de carga. Se ejecuta en contenedores Docker.

---

## Características principales

### Frontend (React)

* Formulario para crear nuevas tareas con:

  * Título
  * Descripción
  * Listado de tareas existentes
  * Botones para:
    * Editar tarea
    * Eliminar tarea

* Estilo centrado y responsive

### Backend (FastAPI)

* Endpoints RESTful:

  * `GET /api/tareas/`: listar tareas
  * `POST /api/tareas/`: crear tarea
  * `GET /api/tareas/{id}`: ver tarea
  * `PUT /api/tareas/{id}`: editar tarea
  * `DELETE /api/tareas/{id}`: eliminar tarea
  
* Validación de campos obligatorios

### NGINX

* Balanceo de carga entre `backend1` y `backend2` (round-robin por defecto)
* Configurado para permitir:

  * Redirección HTTP → HTTPS
  * Rate limiting (`limit_req`)
  * Comentado el uso de `least_conn` e `ip_hash` (no activados)
  * Cache estática básica para frontend
* Uso de certificados SSL autofirmados

### Docker

* Contenedores para:

  * `frontend`: aplica `vite build` y sirve el estático con NGINX
  * `backend1` y `backend2`: instancias FastAPI
  * `nginx`: proxy inverso + balanceo

---

## Ejecución del proyecto

1. **Clona el repositorio:**

   ```bash
   git clone <repo_url>
   cd <carpeta_proyecto>
   ````

2. **Construye los contenedores:**

   ```bash
   docker compose build
   ```

3. **Inicia los servicios:**

   ```bash
   docker compose up
   ```

4. **Accede a la app:**
   Abre tu navegador en:

   ```
   https://localhost:82
   ```

   (Acepta el certificado no confiable si es autofirmado)

---

## Notas adicionales

* Los cambios del frontend deben compilarse con `npm run build` y copiarse en `nginx/dist`.
* La configuración de `default.conf` se encuentra en `nginx/default.conf`
* Puedes modificar el método de balanceo activando `least_conn` o `ip_hash` en la sección `upstream`.

---

## Tecnologías usadas

* React
* FastAPI
* Docker
* NGINX
* SSL (autofirmado)

---

© 2025. Proyecto educativo para aprendizaje de arquitecturas con Docker y NGINX.
