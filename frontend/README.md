# Staywise Room Manager

A small React app and Laravel API for room inventory. The app includes a demo sign-in, searchable room list, add-room form, and room details. Rooms are stored in Laravel’s database.

## Run locally

Install Node.js, PHP 8.2+, and Composer. Then open two terminals in the project folder:

**Terminal 1 — Laravel API**

```sh
cd backend
composer install
php artisan migrate --seed
php artisan serve
```

**Terminal 2 — React app**

```sh
npm install
npm run dev
```

Open the Vite URL shown in the second terminal. Vite forwards `/api` requests to Laravel at `http://127.0.0.1:8000`.

Laravel uses SQLite locally. To use a managed MySQL or PostgreSQL database, set the matching `DB_*` values in `backend/.env`, then run `php artisan migrate --seed`.

## Demo sign-in

- Username: `pms_admin`
- Password: `hotelpms2026`

The demo sign-in is checked in the frontend. Set `VITE_API_URL` to the deployed Laravel API base URL when building the frontend, and set `FRONTEND_URL` in the Laravel environment to the frontend origin for cross-origin API access.
