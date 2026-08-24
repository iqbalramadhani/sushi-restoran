# ---- Base image: PHP 8.3 + extensions ----
FROM php:8.3-fpm AS base

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    libfreetype6-dev libjpeg62-turbo-dev \
    unzip zip ca-certificates \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# ---- Frontend build ----
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY vite.config.js postcss.config.js tailwind.config.js tsconfig.json ./
COPY resources/ resources/
RUN npm run build

# ---- Production image ----
FROM base AS production

COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY --from=frontend /app/public/build public/build
COPY . .

RUN chmod 777 -R storage bootstrap/cache \
    && composer install --optimize-autoloader --no-dev \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

CMD ["php-fpm"]
