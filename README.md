# Digital Business Card Platform

A full-stack Digital Business Card platform built with Laravel 11 (API) and Next.js 14+ (Frontend).

## Features
- **Authentication**: Secure Login/Register using Laravel Sanctum.
- **Dashboard**: Manage multiple digital cards.
- **Card Builder**: Create cards with business info, contact details, and theme customization.
- **Public Page**: SEO-friendly, responsive digital card profile accessible via unique slug.
- **QR Code Ready**: Structure ready for QR code integration.

## Project Structure
- `backend/`: Laravel 11 API
- `frontend/`: Next.js App Router Application

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL

### 1. Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
# Configure DB in .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```
Backend runs on `http://localhost:8000`

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install
# Ensure .env.local exists with NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```
Frontend runs on `http://localhost:3000`

## API Routes
- `POST /api/register`
- `POST /api/login`
- `GET /api/cards` (Protected)
- `POST /api/cards` (Protected)
- `GET /api/cards/{slug}` (Public)

## Tech Stack
- **Backend**: Laravel 11, MySQL, Sanctum
- **Frontend**: Next.js (App Router), Tailwind CSS v4, Axios, Lucide React
