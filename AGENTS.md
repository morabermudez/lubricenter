# Lubricenter Pro — AGENTS.md

## Stack
React 19 + TypeScript + Vite 6 + Tailwind v4 + Express 4 + Mercado Pago SDK.

## Comandos
- `npm install` — instalar dependencias
- `npm run dev` — arranca server Express + Vite en `http://localhost:3000` (usa `tsx server.ts`)
- `npm run build` — `vite build`
- `npm run lint` — `tsc --noEmit` (solo typecheck, sin linter)
- `npm run preview` — `vite preview`
- `npm run clean` — borra `dist/`

## Arquitectura
- **Backend**: Express en `server.ts` que corre Vite en modo middleware (`middlewareMode: true`). Sirve SPA + APIs.
- **Frontend**: React SPA. Sin React Router — navegación por estado (`currentView` en `App.tsx`).
- **Persistencia**: JSON filesystem (`data/appointments.json`). No hay base de datos.
- **Pagos**: Mercado Pago con token de test hardcodeado en `server.ts:16` (`TEST-7483...`).
- **Auth**: Simulada por rol (`none`/`client`/`employee`). No hay autenticación real.

## APIs (Express, puerto 3000)
- `GET/POST /api/appointments` — listar/crear turnos
- `DELETE/PATCH /api/appointments/:id` — eliminar/actualizar turno
- `POST /api/create_preference` — crea preferencia de pago en Mercado Pago

## Vistas (navegación)
Strings de `currentView`: `landing`, `home`, `booking`, `inventory`, `checkout`, `confirmation`, `admin`, `admin-booking`, `login`, `register`.
Los componentes reciben `onNavigate` para cambiar de vista. Usar `App.tsx:BookingData` para datos de reserva.

## Convenciones
- Tailwind v4 con plugin `@tailwindcss/vite` (sin archivo `tailwind.config.js`)
- Animaciones con `motion` (antes framer-motion)
- Alias `@` → raíz del proyecto (tanto en código como en imports TypeScript)
- `allowJs: true` — conviven `.tsx` y `.jsx`/`.js`
- `bookingService.ts` es el único archivo en `src/services/` — funciones CRUD hacia `/api/appointments`
- Los turnos legacy están en `src/data/turnos.json` (schema distinto); los activos en `data/appointments.json`

## Entorno
- `GEMINI_API_KEY` requerida (inyectada por AI Studio, o desde `.env`)
- `APP_URL` para callbacks/OAuth
- `.env*` ignorados por git (excepto `.env.example`)
- HMR desactivable vía `DISABLE_HMR=true` (útil en AI Studio)

## Notas
- No hay tests configurados en el proyecto
- No hay CI/CD (no existe `.github/workflows/`)
- El server corre en `0.0.0.0:3000` (no solo localhost)
- La rama actual es `feature/SCRUM-36-Perfil-de-jefe` con convención de branches estilo SCRUM
