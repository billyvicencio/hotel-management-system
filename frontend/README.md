# Staywise Room Manager

This repository contains a React/Vite frontend and a Laravel 12 JSON API.

## Deploy the database on Supabase

1. Create a Supabase project.
2. In the Supabase dashboard, open **Connect** and choose the **Session pooler** connection string (port `5432`).
3. Keep the `sslmode=require` query parameter and replace any reserved characters in the database password with URL-encoded values.

Use this full connection string as `DB_URL` in Render. The database URL is only used by Laravel; do not add it to Vercel or frontend code.

## Deploy the API on Render

1. Connect this repository to Render and create a **Blueprint** using the root `render.yaml` file.
2. When prompted, set `DB_URL` to the Supabase Session pooler URL.
3. Set `APP_KEY` to the output of `cd backend && php artisan key:generate --show` (run locally after `composer install`).
4. After Vercel is deployed, set Render's `FRONTEND_URL` to the Vercel production origin, such as `https://your-project.vercel.app`, then redeploy the API.

The Render Docker image installs PHP's PostgreSQL driver, runs migrations and the idempotent sample-room seeder, and starts Laravel. The `/up` health endpoint is configured for Render.

## Deploy the frontend on Vercel

1. Import this repository into Vercel.
2. Set **Root Directory** to `frontend` and use the Vite defaults: build command `npm run build`, output directory `dist`.
3. Add `VITE_API_URL` with the Render API URL ending in `/api`, for example `https://your-api.onrender.com/api`.
4. Deploy. The `frontend/vercel.json` rewrite keeps React Router paths working when refreshed.

## Local development

In one terminal:

```sh
cd backend
composer install
php artisan migrate --seed
php artisan serve
```

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://127.0.0.1:8000` locally. Leave `VITE_API_URL` unset in local development.

## Demo sign-in

- Username: `pms_admin`
- Password: `hotelpms2026`

The demo sign-in is checked in the frontend.
