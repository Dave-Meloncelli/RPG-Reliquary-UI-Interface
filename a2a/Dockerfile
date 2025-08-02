FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    g++ \
    git \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r a2a && useradd -r -g a2a a2a

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/data /app/certificates /app/models /app/logs && \
    chown -R a2a:a2a /app

# Generate self-signed certificates for development
RUN openssl req -x509 -newkey rsa:4096 -keyout /app/certificates/key.pem -out /app/certificates/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=a2a-gateway"

# Switch to non-root user
USER a2a

# Expose ports
EXPOSE 5001 5002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

# Run A2A Gateway
CMD ["python", "main.py"] 