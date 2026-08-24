#!/bin/bash
set -e

VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-root}"
VPS_PORT="${VPS_PORT:-22}"
REMOTE_DIR="/opt/restoran"
SSH_OPTS="-o StrictHostKeyChecking=no"

if [ -z "$VPS_HOST" ]; then
  echo "Error: VPS_HOST environment variable is required"
  exit 1
fi

echo "🚀 Starting deployment to $VPS_USER@$VPS_HOST..."

echo "📦 Building Docker images..."
docker compose -f docker-compose.prod.yml build

echo "🔄 Deploying on VPS..."
ssh $SSH_OPTS -p $VPS_PORT "$VPS_USER@$VPS_HOST" "
  mkdir -p $REMOTE_DIR &&
  cd $REMOTE_DIR &&
  git pull origin main
"

ssh $SSH_OPTS -p $VPS_PORT "$VPS_USER@$VPS_HOST" "
  cd $REMOTE_DIR &&
  docker compose -f docker-compose.prod.yml down &&
  docker compose -f docker-compose.prod.yml up -d --build &&
  docker image prune -f
"

echo "✅ Deployment complete!"
echo "🌐 Application should be available at http://$VPS_HOST"
