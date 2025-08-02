import type { BackupLogEntry } from '../types';

let logIdCounter = 0;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

function* createLogEntry(message: string): Generator<BackupLogEntry> {
    yield {
        id: ++logIdCounter,
        timestamp: new Date().toLocaleTimeString(),
        message,
    };
}

const BACKUP_STEPS = [
    { message: 'Initializing backup process...', delay: 200 },
    { message: 'Archiving ./vault data...', delay: 1500 },
    { message: 'Creating vault_data.tar.gz... Success.', delay: 100 },
    { message: 'Dumping PostgreSQL database (agent_zero)...', delay: 2000 },
    { message: 'Creating db_dump.sql.gz... Success.', delay: 100 },
    { message: 'Packaging vector stores...', delay: 800 },
    { message: 'Creating vector_stores.tar.gz... Success.', delay: 100 },
    { message: 'Packaging agent configurations...', delay: 500 },
    { message: 'Creating agent_configs.tar.gz... Success.', delay: 100 },
    { message: 'Packaging templates...', delay: 400 },
    { message: 'Creating templates.tar.gz... Success.', delay: 100 },
    { message: 'Connecting to remote storage (s3://your-backup-bucket)...', delay: 1000 },
    { message: 'Syncing archives to remote storage...', delay: 2500 },
    { message: 'Sync complete. Verifying integrity...', delay: 1200 },
    { message: 'Remote integrity check passed.', delay: 100 },
    { message: 'Cleaning up old local backups (older than 30 days)...', delay: 600 },
    { message: 'Cleanup complete.', delay: 100 },
    { message: 'Backup process finished successfully.', delay: 200 },
];

export async function* runBackupProcess(): AsyncGenerator<BackupLogEntry> {
    for (const step of BACKUP_STEPS) {
        yield* createLogEntry(step.message);
        await delay(step.delay);
    }
}