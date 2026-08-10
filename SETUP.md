# Vine & Clay — Platform Setup Guide

End-to-end instructions for deploying and running the **Vine & Clay** public site, companion admin dashboard, and Supabase / Prisma database layer.

---

## 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required keys:

```env
# Supabase Parameters
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Pooled & Direct Connections
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Stripe E-Commerce Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## 2. Database Migration & Seeding

Install dependencies:

```bash
npm install
```

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Seed initial Flagship Soho location, physical tables, menu items, and owner account:

```bash
npx prisma db seed
```

---

## 3. Apply Supabase Row Level Security (RLS) Policies

Execute the SQL script in `prisma/rls_policies.sql` inside your Supabase SQL Editor:

```bash
# Execute content of prisma/rls_policies.sql
```

This enforces role-based security (`owner`, `manager`, `staff`) directly in Postgres.

---

## 4. Run Development Server

Start Next.js App Router server:

```bash
npm run dev
```

- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Staff Login Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 5. Vercel Production Deployment

Deploy seamlessly to Vercel:

```bash
npx vercel
```

Ensure all environment variables from `.env.example` are configured in Vercel Project Settings.
