-- Jobs table for tracking all rendering jobs
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- 'scheduled', 'manual', 'webhook'
    status TEXT NOT NULL, -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
    composition_id TEXT NOT NULL,
    props TEXT NOT NULL, -- JSON string of props
    output_path TEXT,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    retry_count INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 5, -- 1-10, higher is more important
    metadata TEXT -- JSON string for additional data
);

-- Schedules table for recurring jobs
CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    schedule_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    enabled BOOLEAN DEFAULT 1,
    cron_expression TEXT NOT NULL,
    composition_id TEXT NOT NULL,
    props_template TEXT NOT NULL, -- JSON template with placeholders
    last_run DATETIME,
    next_run DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Job history for analytics
CREATE TABLE IF NOT EXISTS job_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT NOT NULL,
    schedule_id TEXT,
    render_time_ms INTEGER,
    file_size_bytes INTEGER,
    composition_id TEXT NOT NULL,
    success BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id)
);

-- Webhook logs
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    webhook_type TEXT NOT NULL,
    url TEXT NOT NULL,
    payload TEXT NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    success BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_schedules_enabled ON schedules(enabled);
CREATE INDEX IF NOT EXISTS idx_schedules_next_run ON schedules(next_run);
CREATE INDEX IF NOT EXISTS idx_job_history_created_at ON job_history(created_at);