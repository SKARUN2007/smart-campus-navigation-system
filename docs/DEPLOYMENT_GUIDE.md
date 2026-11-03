# Production Deployment Guide

This guide covers production deployment options for the Smart Campus Navigation System.

---

## Architecture Overview
- **Frontend & Server:** Next.js 15 (App Router, Node.js runtime)
- **Database:** PostgreSQL 16 (Managed via Prisma ORM)
- **Authentication:** JWT sessions + HTTP-Only secure cookies

---

## Option 1: Vercel + Managed PostgreSQL (Neon / Supabase)

### Step 1: Provision PostgreSQL Database
1. Create a project on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the pooled connection string:
   ```
   postgresql://user:password@ep-cool-campus.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Push Database Schema & Seed Data
From your local terminal, apply the database schema:
```bash
DATABASE_URL="<your_neon_url>" npx prisma db push
DATABASE_URL="<your_neon_url>" node prisma/seed.js
```

### Step 3: Deploy on Vercel
1. Import repository into [Vercel](https://vercel.com).
2. Set Environment Variables:
   - `DATABASE_URL`: Your managed PostgreSQL URL
   - `JWT_SECRET`: High-entropy 32+ character secret
   - `NEXTAUTH_URL`: `https://your-app.vercel.app`
   - `NODE_ENV`: `production`
3. Deploy! Vercel automatically runs `prisma generate && next build`.

---

## Option 2: Docker / Containerized VPS Deployment

The project includes an optimized multi-stage `Dockerfile` and `docker-compose.yml`.

### Step 1: Clone Repository onto Production Server
```bash
git clone https://github.com/your-org/smart-campus-nav.git /opt/smart-campus
cd /opt/smart-campus
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `POSTGRES_PASSWORD` and `JWT_SECRET` are customized with secure secrets.

### Step 3: Start Containers
```bash
docker compose up -d --build
```

### Step 4: Run Initial Migrations & Seed
```bash
docker compose exec app npx prisma db push
docker compose exec app node prisma/seed.js
```

The system will be live on `http://<your-server-ip>:3000`. Set up an NGINX reverse proxy with SSL via Let's Encrypt for HTTPS.

---

## Database Backup & Restoration

### Backup
```bash
pg_dump -U campus_admin -d smart_campus -F c -b -v -f campus_backup_$(date +%Y%m%d).dump
```

### Restore
```bash
pg_restore -U campus_admin -d smart_campus -v campus_backup_20261103.dump
```
