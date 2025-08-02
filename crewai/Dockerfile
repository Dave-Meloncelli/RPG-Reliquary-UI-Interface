FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r crewai && useradd -r -g crewai crewai

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
RUN mkdir -p /app/data /app/workspace /app/models /app/logs && \
    chown -R crewai:crewai /app

# Switch to non-root user
USER crewai

# Expose ports
EXPOSE 8500 8501

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8500/health || exit 1

# Run CrewAI with Streamlit
CMD ["streamlit", "run", "app.py", "--server.port=8500", "--server.address=0.0.0.0"] 