# 🚀 Guía Completa de Despliegue - TV UPEA CMS

## Paso 1: Desplegar Frontend en Vercel (Gratuito)

### 1.1 Crear cuenta en Vercel
- Accede a https://vercel.com
- Haz clic en **"Sign Up"**
- Selecciona **"Sign up with GitHub"**
- Autoriza la conexión

### 1.2 Crear proyecto en Vercel
1. En el dashboard, haz clic en **"New Project"**
2. Busca tu repositorio `tv-upea-cms`
3. Haz clic en **"Import"**

### 1.3 Configurar el proyecto
1. En **"Configure Project"**:
   - **Project Name**: `tv-upea-cms`
   - **Framework**: `Vite`
   - **Root Directory**: Cambia a `frontend`
   
2. Haz clic en **"Environment Variables"** y agrega:
   ```
   VITE_API_URL = https://tv-upea-cms-backend.onrender.com
   ```
   (Este será el URL de tu backend - lo actualizaremos después)

3. Haz clic en **"Deploy"**

✅ **Tu frontend estará disponible en**: `https://tv-upea-cms.vercel.app`

---

## Paso 2: Base de Datos PostgreSQL en Railway

### 2.1 Crear cuenta en Railway
- Accede a https://railway.app
- Haz clic en **"Start a New Project"**
- Selecciona **"Provision PostgreSQL"**

### 2.2 Configurar PostgreSQL
1. Espera a que Railway cree la base de datos (3-5 minutos)
2. Haz clic en la pestaña **"PostgreSQL"**
3. Ve a **"Data"** → **"Connect"**
4. Copia el **Connection URL** (ejemplo):
   ```
   postgresql://postgres:PASSWORD@host:5432/railway
   ```

### 2.3 Obtener las credenciales
En la pestaña **"Variables"**, verás:
- `PGHOST`: host de la base de datos
- `PGPORT`: 5432
- `PGDATABASE`: railway
- `PGUSER`: postgres
- `PGPASSWORD`: contraseña aleatoria

**Guarda estas credenciales, las necesitarás para el backend**

---

## Paso 3: Desplegar Backend en Render

### 3.1 Crear cuenta en Render
- Accede a https://render.com
- Haz clic en **"Sign up with GitHub"**
- Autoriza la conexión

### 3.2 Crear Web Service
1. En el dashboard, haz clic en **"New"** → **"Web Service"**
2. Busca tu repositorio `tv-upea-cms`
3. Haz clic en **"Connect"**

### 3.3 Configurar el servicio
Completa los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `tv-upea-cms-backend` |
| **Environment** | `Node` |
| **Region** | `Ohio (us-east)` o la más cercana |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node backend/src/app.js` |
| **Plan** | `Free` |

### 3.4 Agregar Environment Variables
En la sección **"Environment"**, agrega estas variables:

```
NODE_ENV=production
PORT=5000
API_URL=https://tv-upea-cms-backend.onrender.com
FRONTEND_URL=https://tv-upea-cms.vercel.app

# Database (reemplaza con tus credenciales de Railway)
DB_HOST=vpg-xxx.railway.app
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=tu_password_de_railway

# JWT
JWT_SECRET=tu_secret_random_aqui
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=tu_refresh_secret_random_aqui
JWT_REFRESH_EXPIRE=30d

# Archivos
ALLOWED_FILE_TYPES=video/*,image/*,audio/*,application/pdf
MAX_FILE_SIZE=10737418240

# AWS (opcional, si usas S3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_BUCKET_NAME=tv-upea-content
```

### 3.5 Hacer deploy
1. Haz clic en **"Deploy"**
2. Espera a que termine (5-10 minutos)
3. Copia el URL del backend (ejemplo): `https://tv-upea-cms-backend.onrender.com`

✅ **Tu backend estará disponible en**: `https://tv-upea-cms-backend.onrender.com`

---

## Paso 4: Actualizar URLs en Frontend

Una vez desplegado el backend, actualiza la variable en Vercel:

1. Accede a https://vercel.com
2. Selecciona tu proyecto `tv-upea-cms`
3. Ve a **"Settings"** → **"Environment Variables"**
4. Edita `VITE_API_URL`:
   ```
   VITE_API_URL=https://tv-upea-cms-backend.onrender.com
   ```
5. Haz clic en **"Save"**
6. Ve a **"Deployments"** y haz clic en los 3 puntos → **"Redeploy"**

---

## Paso 5: Obtener Dominio Gratis

### Opción 1: Dominio de Freenom (Gratis)
1. Ve a https://www.freenom.com
2. Busca tu dominio deseado (ej: `tvupea.tk`)
3. Elige uno gratuito (.tk, .ml, .ga, .cf)
4. Completa el registro
5. En configuración DNS, agrega:
   - Para Vercel:
     ```
     CNAME tvupea.vercel.app
     ```

### Opción 2: Usar subdominio de Vercel (Más fácil)
- Vercel te da automáticamente: `tv-upea-cms.vercel.app`
- No necesitas dominio externo

### Opción 3: Usar tu propio dominio
- Si tienes un dominio registrado, actualiza el DNS en la zona de DNS:
  ```
  CNAME tv-upea-cms.vercel.app (para frontend)
  ```

---

## ✅ Checklist Final

- [ ] Frontend en Vercel (https://tv-upea-cms.vercel.app)
- [ ] Backend en Render (https://tv-upea-cms-backend.onrender.com)
- [ ] Base de datos PostgreSQL en Railway
- [ ] Variables de entorno configuradas correctamente
- [ ] Backend y frontend conectados
- [ ] Dominio personalizado (opcional)

---

## 🔧 Troubleshooting

### El backend tarda mucho en iniciar
- Render duerme servicios gratuitos. Tarda más la primera vez
- Si no se inicia, revisa los logs en Render

### Error de conexión a base de datos
- Verifica las credenciales de Railway
- Asegúrate que `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` sean correctos
- Intenta: `psql -h tu_host -U postgres -d railway`

### El frontend no ve el backend
- Verifica `VITE_API_URL` en Vercel
- Redeploy el frontend después de cambiar variables

### CORS errors
- Agrega en backend `FRONTEND_URL=https://tv-upea-cms.vercel.app`
- Reinicia el backend

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render/Vercel
2. Verifica las variables de entorno
3. Asegúrate que todo está en `main` branch en GitHub

¡Listo! Tu aplicación está en la nube y accesible desde cualquier lugar. 🎉
