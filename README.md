# 💸 MicroImpulso – Plataforma de Micropréstamos

---

## 📦 Estructura del Repositorio

Este repositorio contiene tanto la interfaz web como el backend de **MicroImpulso**, una plataforma para gestionar solicitudes de microcréditos.

```
/               → Frontend en Next.js (aplicación principal)
/backend/       → Backend desacoplado (Node.js, Express, etc.)
```

---

## 🚀 Inicio Rápido – Frontend

### Requisitos Previos

- Node.js ≥ 16.x
- Yarn o npm

### Pasos para ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/your-org/microimpulso.git
cd microimpulso
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

> 💡 La interfaz carga correctamente sin backend, pero las funcionalidades dependerán de una API activa.

---

## 🛠 Backend – Subproyecto

El backend, ubicado en la carpeta `/backend`, contiene:

- Lógica de autenticación
- Gestión de solicitudes
- Asignación automática de asesores
- Generación de documentos y contratos
- Paneles de administración y alertas

### Cómo ejecutarlo

Consulta las instrucciones en [`/backend/README.md`](./backend/README.md).

> El backend **no se ejecuta** con `npm run dev` desde la raíz. Es un servicio independiente.

---

## 🧩 Funcionalidades Clave

- Registro y login de usuarios
- Simulador de préstamos
- Envío de solicitud
- Seguimiento del estado
- Generación de documentos (milestone 5)
- Reportes y alertas (milestone 6)

---

## 🌐 Variables de entorno (Frontend)

```env
NEXT_PUBLIC_API_URL=https://api.microimpulso.com
MAX_LOAN_AMOUNT=500000
MAX_LOAN_TERM_MONTHS=3
```

---

## ☁️ Despliegue

La aplicación será desplegada en **AWS Lightsail**, utilizando Node.js y Nginx o PM2, con configuración HTTPS vía Let's Encrypt.

---

## 👥 Equipo

- **Henry Gomez** – Líder Técnico / Backend
- **Yulman** – Frontend
- **Felipe** – Lógica de negocio

---

> ⚠️ Proyecto en desarrollo activo. Cualquier contribución debe ajustarse a los hitos planificados.

---

# 🌍 MicroImpulso – Microloan Web Platform

> ⚠️ **Note:** This file includes both **Spanish** and **English** documentation for bilingual/international teams. Spanish comes first.

---

## 📦 Repository Structure

This monorepo includes both the **frontend** and a decoupled **backend** for the MicroImpulso platform.

```
/               → Next.js frontend (main app)
/backend/       → Node.js/Express-based backend API (runs independently)
```

---


> ⚠️ This is an active development project. All contributions should align with our sprint and milestone roadmap.
