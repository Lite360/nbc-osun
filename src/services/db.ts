import { neon } from '@neondatabase/serverless';
import type { Registration, VenueSettings, RegistrationStatus } from '../types';

// Obtain connection string from environment variables
const DATABASE_URL = 
  (typeof window !== 'undefined' ? (import.meta as any).env?.VITE_DATABASE_URL : '') ||
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.DATABASE_URL) ||
  '';

let sql: ReturnType<typeof neon> | null = null;

if (DATABASE_URL) {
  try {
    sql = neon(DATABASE_URL);
  } catch (err) {
    console.warn('Neon DB connection initialization warning:', err);
  }
}

export const db = {
  isConfigured(): boolean {
    return !!sql;
  },

  /**
   * Initializes Neon Database tables if they do not exist
   */
  async initSchema(): Promise<void> {
    if (!sql) return;

    await sql`
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
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS venues (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        radius INT NOT NULL DEFAULT 100,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
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
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        admin_note TEXT,
        verified_by VARCHAR(255),
        verified_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
  },

  // Venue Operations
  async getVenue(): Promise<VenueSettings | null> {
    if (!sql) return null;
    const rows = (await sql`SELECT * FROM venues WHERE id = 'venue-1' LIMIT 1;`) as any[];
    if (!rows.length) return null;
    const v = rows[0];
    return {
      id: v.id,
      name: v.name,
      address: v.address,
      latitude: Number(v.latitude),
      longitude: Number(v.longitude),
      radius: Number(v.radius),
      is_active: Boolean(v.is_active),
      created_at: v.created_at,
      updated_at: v.updated_at,
    };
  },

  async updateVenue(venue: Partial<VenueSettings>): Promise<void> {
    if (!sql) return;
    await sql`
      INSERT INTO venues (id, name, address, latitude, longitude, radius, is_active, updated_at)
      VALUES (
        'venue-1',
        ${venue.name || 'NBC Osun Registration Venue'},
        ${venue.address || 'Osogbo, Osun State'},
        ${venue.latitude || 7.7827},
        ${venue.longitude || 4.5418},
        ${venue.radius || 100},
        ${venue.is_active ?? true},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        address = EXCLUDED.address,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        radius = EXCLUDED.radius,
        is_active = EXCLUDED.is_active,
        updated_at = NOW();
    `;
  },

  // Registrations Operations
  async getRegistrations(): Promise<Registration[] | null> {
    if (!sql) return null;
    const rows = (await sql`SELECT * FROM registrations ORDER BY created_at DESC;`) as any[];
    return rows.map((r: any) => ({
      id: r.id,
      registration_reference: r.registration_reference,
      full_name: r.full_name,
      id_card_blob_url: r.id_card_blob_url,
      id_card_filename: r.id_card_filename,
      id_card_type: r.id_card_type,
      phone: r.phone,
      email: r.email,
      lga: r.lga,
      state_code: r.state_code,
      bank_name: r.bank_name,
      account_name: r.account_name,
      account_number: r.account_number,
      location_verified: Boolean(r.location_verified),
      location_accuracy: r.location_accuracy ? Number(r.location_accuracy) : undefined,
      user_lat: r.user_lat ? Number(r.user_lat) : undefined,
      user_lng: r.user_lng ? Number(r.user_lng) : undefined,
      status: r.status as RegistrationStatus,
      admin_note: r.admin_note,
      verified_by: r.verified_by,
      verified_at: r.verified_at,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  },

  async createRegistration(reg: Registration): Promise<void> {
    if (!sql) return;
    await sql`
      INSERT INTO registrations (
        id, registration_reference, full_name, id_card_blob_url, id_card_filename,
        id_card_type, phone, email, lga, state_code, bank_name, account_name,
        account_number, location_verified, location_accuracy, user_lat, user_lng, status
      ) VALUES (
        ${reg.id}, ${reg.registration_reference}, ${reg.full_name}, ${reg.id_card_blob_url}, ${reg.id_card_filename},
        ${reg.id_card_type}, ${reg.phone}, ${reg.email}, ${reg.lga}, ${reg.state_code}, ${reg.bank_name}, ${reg.account_name},
        ${reg.account_number}, ${reg.location_verified}, ${reg.location_accuracy || null}, ${reg.user_lat || null}, ${reg.user_lng || null}, ${reg.status}
      );
    `;
  },

  async updateRegistrationStatus(id: string, status: RegistrationStatus, adminNote?: string, adminName = 'Admin User'): Promise<void> {
    if (!sql) return;
    await sql`
      UPDATE registrations
      SET status = ${status},
          admin_note = ${adminNote || null},
          verified_by = ${adminName},
          verified_at = NOW(),
          updated_at = NOW()
      WHERE id = ${id};
    `;
  },

  async deleteRegistration(id: string): Promise<void> {
    if (!sql) return;
    await sql`DELETE FROM registrations WHERE id = ${id};`;
  },
};
