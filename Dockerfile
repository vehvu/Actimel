# Multi-stage build for Advanced LEO Search Tool
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    libpq-dev \
    libffi-dev \
    libssl-dev \
    libxml2-dev \
    libxslt1-dev \
    libjpeg-dev \
    libpng-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libwebp-dev \
    libtiff5-dev \
    libopenjp2-7-dev \
    libharfbuzz0b \
    libfribidi0 \
    libxcb1 \
    libxrandr2 \
    libxss1 \
    libasound2 \
    libgtk-3-0 \
    libgconf-2-4 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgconf-2-4 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libgdk-pixbuf2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install additional system tools
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install spaCy English model
RUN python -m spacy download en_core_web_sm

# Install Playwright browsers
RUN playwright install --with-deps

# Development stage
FROM base as development

# Install development dependencies
RUN pip install --no-cache-dir \
    pytest \
    pytest-asyncio \
    pytest-cov \
    black \
    isort \
    flake8 \
    mypy \
    pre-commit

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/temp /app/backups

# Set permissions
RUN chmod +x /app/scripts/*.sh

# Development command
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production stage
FROM base as production

# Create non-root user
RUN groupadd -r leo && useradd -r -g leo leo

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/temp /app/backups

# Set permissions
RUN chown -R leo:leo /app && \
    chmod +x /app/scripts/*.sh

# Switch to non-root user
USER leo

# Production command
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

# Testing stage
FROM base as testing

# Install testing dependencies
RUN pip install --no-cache-dir \
    pytest \
    pytest-asyncio \
    pytest-cov \
    pytest-mock \
    httpx \
    factory-boy \
    faker

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/temp

# Set permissions
RUN chmod +x /app/scripts/*.sh

# Testing command
CMD ["pytest", "tests/", "-v", "--cov=src", "--cov-report=html", "--cov-report=term-missing"]

# Celery worker stage
FROM base as celery

# Create non-root user
RUN groupadd -r leo && useradd -r -g leo leo

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/temp

# Set permissions
RUN chown -R leo:leo /app && \
    chmod +x /app/scripts/*.sh

# Switch to non-root user
USER leo

# Celery worker command
CMD ["celery", "-A", "src.core.celery_app", "worker", "--loglevel=info", "--concurrency=4"]

# Celery beat stage
FROM base as celery-beat

# Create non-root user
RUN groupadd -r leo && useradd -r -g leo leo

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/logs /app/temp

# Set permissions
RUN chown -R leo:leo /app && \
    chmod +x /app/scripts/*.sh

# Switch to non-root user
USER leo

# Celery beat command
CMD ["celery", "-A", "src.core.celery_app", "beat", "--loglevel=info"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Labels
LABEL maintainer="LEO Search Tool Team" \
      version="1.0.0" \
      description="Advanced LEO Search Tool for Realtor Companies" \
      org.opencontainers.image.title="Advanced LEO Search Tool" \
      org.opencontainers.image.description="Comprehensive people search tool for realtor companies" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="LEO Search Tool" \
      org.opencontainers.image.licenses="MIT"
