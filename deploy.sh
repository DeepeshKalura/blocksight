#!/bin/bash

# Deployment script for BlockSight
# This script runs database migrations and seeds mock data

set -e

echo "🚀 Starting BlockSight deployment..."
echo ""

# Navigate to web app directory
cd /media/deepesh/on6/work/blocksight/apps/web

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🗄️ Running database migrations..."
npx drizzle-kit push --force

echo ""
echo "🌱 Seeding mock data..."
pnpm tsx scripts/seed-mock-data.ts || echo "⚠️ Seed script skipped (optional)"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Run 'pnpm dev' to start development server"
echo "2. Visit http://localhost:3000 to test"
