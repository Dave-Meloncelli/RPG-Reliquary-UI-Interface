FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Install Playwright browsers
RUN playwright install chromium
RUN playwright install-deps chromium

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 playwright && \
    chown -R playwright:playwright /app
USER playwright

# Expose port
EXPOSE 30006

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:30006/health || exit 1

# Start the browser controller
CMD ["python3", "main.py"] 