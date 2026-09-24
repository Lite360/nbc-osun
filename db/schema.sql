-- NBC Osun PostgreSQL Database DDL Schema (Neon Compatible)

CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS venues (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius INT NOT NULL DEFAULT 100, -- Geofence radius in meters
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
    id VARCHAR(64) PRIMARY KEY,
    registration_reference VARCHAR(64) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    id_card_blob_url TEXT NOT NULL,
    id_card_filename VARCHAR(255) NOT NULL,
    id_card_type VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    lga VARCHAR(100) NOT NULL,
    state_code VARCHAR(50) UNIQUE NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    location_verified BOOLEAN NOT NULL DEFAULT TRUE,
    location_accuracy INT,
    user_lat DECIMAL(10, 8),
    user_lng DECIMAL(11, 8),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, confirmed, rejected
    admin_note TEXT,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registration_logs (
    id VARCHAR(64) PRIMARY KEY,
    registration_id VARCHAR(64) REFERENCES registrations(id) ON DELETE SET NULL,
    admin_id VARCHAR(64),
    admin_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sequence for atomic registration reference numbers
CREATE SEQUENCE IF NOT EXISTS registration_ref_seq START WITH 1 INCREMENT BY 1;

-- Indices for performance on frequent query patterns
CREATE INDEX IF NOT EXISTS idx_registrations_state_code ON registrations(state_code);
CREATE INDEX IF NOT EXISTS idx_registrations_upper_state_code ON registrations(UPPER(state_code));
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON registrations(phone);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_lga ON registrations(lga);
CREATE INDEX IF NOT EXISTS idx_registrations_reference ON registrations(registration_reference);
