#!/bin/bash

# AZ Interface Backup Script
# This script creates comprehensive backups of all application data

set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${RETENTION_DAYS:-30}
S3_BUCKET=${S3_BUCKET:-""}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:-""}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:-""}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

print_status "Starting backup process at $(date)"

# Function to backup PostgreSQL database
backup_postgres() {
    print_status "Backing up PostgreSQL database..."
    
    if [ -n "$POSTGRES_PASSWORD" ]; then
        export PGPASSWORD="$POSTGRES_PASSWORD"
    fi
    
    pg_dump -h postgres -U az_user -d az_interface --verbose --clean --no-owner --no-privileges | gzip > "$BACKUP_DIR/postgres_$DATE.sql.gz"
    
    if [ $? -eq 0 ]; then
        print_success "PostgreSQL backup completed: postgres_$DATE.sql.gz"
    else
        print_error "PostgreSQL backup failed"
        return 1
    fi
}

# Function to backup Redis data
backup_redis() {
    print_status "Backing up Redis data..."
    
    # Create Redis dump
    redis-cli -h redis -a "$REDIS_PASSWORD" BGSAVE
    
    # Wait for save to complete
    sleep 5
    
    # Copy dump file
    docker cp az-interface-redis-1:/data/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"
    
    if [ $? -eq 0 ]; then
        print_success "Redis backup completed: redis_$DATE.rdb"
    else
        print_warning "Redis backup failed (this is normal if Redis is empty)"
    fi
}

# Function to backup application data
backup_app_data() {
    print_status "Backing up application data..."
    
    # Backup shared data volume
    docker run --rm -v az-interface_shared_data:/data -v "$BACKUP_DIR:/backup" alpine tar -czf "/backup/app_data_$DATE.tar.gz" -C /data .
    
    if [ $? -eq 0 ]; then
        print_success "Application data backup completed: app_data_$DATE.tar.gz"
    else
        print_error "Application data backup failed"
        return 1
    fi
}

# Function to backup configuration files
backup_config() {
    print_status "Backing up configuration files..."
    
    # Create config backup
    tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" \
        docker-compose.yml \
        .env* \
        backend/alembic.ini \
        backend/app/migrations/ \
        monitoring/ \
        scripts/ \
        2>/dev/null || true
    
    print_success "Configuration backup completed: config_$DATE.tar.gz"
}

# Function to backup logs
backup_logs() {
    print_status "Backing up application logs..."
    
    if [ -d "logs" ]; then
        tar -czf "$BACKUP_DIR/logs_$DATE.tar.gz" logs/
        print_success "Logs backup completed: logs_$DATE.tar.gz"
    else
        print_warning "No logs directory found"
    fi
}

# Function to create backup manifest
create_manifest() {
    print_status "Creating backup manifest..."
    
    cat > "$BACKUP_DIR/manifest_$DATE.json" << EOF
{
    "backup_date": "$(date -Iseconds)",
    "backup_id": "$DATE",
    "files": [
        $(find "$BACKUP_DIR" -name "*_$DATE.*" -type f | sed 's/.*\//        "/' | sed 's/$/",/' | sed '$ s/,$//')
    ],
    "system_info": {
        "hostname": "$(hostname)",
        "docker_version": "$(docker --version)",
        "disk_usage": "$(df -h "$BACKUP_DIR" | tail -1 | awk '{print $5}')"
    }
}
EOF
    
    print_success "Backup manifest created: manifest_$DATE.json"
}

# Function to upload to S3
upload_to_s3() {
    if [ -n "$S3_BUCKET" ] && [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
        print_status "Uploading backups to S3..."
        
        # Install AWS CLI if not present
        if ! command -v aws &> /dev/null; then
            print_status "Installing AWS CLI..."
            apk add --no-cache aws-cli
        fi
        
        # Upload all backup files
        aws s3 sync "$BACKUP_DIR" "s3://$S3_BUCKET/backups/$DATE/" --exclude "*.tmp"
        
        if [ $? -eq 0 ]; then
            print_success "Backup uploaded to S3: s3://$S3_BUCKET/backups/$DATE/"
        else
            print_error "S3 upload failed"
            return 1
        fi
    else
        print_warning "S3 credentials not configured, skipping upload"
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    print_status "Cleaning up old backups (older than $RETENTION_DAYS days)..."
    
    find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.rdb" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.json" -mtime +$RETENTION_DAYS -delete
    
    print_success "Cleanup completed"
}

# Function to verify backup integrity
verify_backup() {
    print_status "Verifying backup integrity..."
    
    # Check if all expected files exist
    expected_files=(
        "postgres_$DATE.sql.gz"
        "app_data_$DATE.tar.gz"
        "config_$DATE.tar.gz"
        "manifest_$DATE.json"
    )
    
    for file in "${expected_files[@]}"; do
        if [ -f "$BACKUP_DIR/$file" ]; then
            print_success "✓ $file exists"
        else
            print_warning "⚠ $file missing"
        fi
    done
    
    # Test archive integrity
    for file in "$BACKUP_DIR"/*.gz; do
        if [ -f "$file" ]; then
            if gzip -t "$file" 2>/dev/null; then
                print_success "✓ $file integrity verified"
            else
                print_error "✗ $file integrity check failed"
            fi
        fi
    done
}

# Main backup process
main() {
    print_status "Starting AZ Interface backup process"
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Run backup tasks
    backup_postgres
    backup_redis
    backup_app_data
    backup_config
    backup_logs
    
    # Create manifest
    create_manifest
    
    # Verify backup
    verify_backup
    
    # Upload to S3 if configured
    upload_to_s3
    
    # Cleanup old backups
    cleanup_old_backups
    
    print_success "Backup process completed successfully at $(date)"
    
    # Display backup summary
    echo ""
    echo "Backup Summary:"
    echo "==============="
    echo "Backup ID: $DATE"
    echo "Location: $BACKUP_DIR"
    echo "Files created:"
    ls -lh "$BACKUP_DIR"/*_$DATE.* 2>/dev/null || true
    echo ""
    echo "Total size: $(du -sh "$BACKUP_DIR" | cut -f1)"
}

# Handle errors
trap 'print_error "Backup failed at line $LINENO"; exit 1' ERR

# Run main function
main "$@" 