FROM php:8.4-cli-alpine

RUN apk add --no-cache libpq-dev unzip \
    && docker-php-ext-install pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
