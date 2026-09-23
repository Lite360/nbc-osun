import type { Registration, VenueSettings, AuditLog, AdminUser, RegistrationStatus } from '../types';

const INITIAL_VENUE: VenueSettings = {
  id: 'venue-1',
  name: 'NBC Osun Corps Member Registration Venue',
  address: 'NBC Bottling Plant Premises, Osogbo, Osun State, Nigeria',
  latitude: 7.7827,
  longitude: 4.5418,
  radius: 100, // 100 meters
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-101',
    registration_reference: 'NBC-OSUN-2026-000001',
    full_name: 'Adewale Adebayo',
    id_card_blob_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    id_card_filename: 'nysc_id_adewale.jpg',
    id_card_type: 'image/jpeg',
    phone: '08031234567',
    email: 'adewale.a@example.com',
    lga: 'Osogbo',
    state_code: 'OS/25A/1024',
    bank_name: 'Guaranty Trust Bank (GTBank)',
    account_name: 'ADEBAYO ADEWALE',
    account_number: '0123456789',
    location_verified: true,
    location_accuracy: 12,
    user_lat: 7.7826,
    user_lng: 4.5417,
    status: 'confirmed',
    admin_note: 'ID card verified and matches state code.',
    verified_by: 'Admin User',
    verified_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'reg-102',
    registration_reference: 'NBC-OSUN-2026-000002',
    full_name: 'Chioma Okonkwo',
    id_card_blob_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    id_card_filename: 'chioma_nysc_card.png',
    id_card_type: 'image/png',
    phone: '08129876543',
    email: 'chioma.o@example.com',
    lga: 'Ife Central',
    state_code: 'OS/25B/2048',
    bank_name: 'First Bank of Nigeria',
    account_name: 'CHIOMA OKONKWO',
    account_number: '3098765432',
    location_verified: true,
    location_accuracy: 8,
    user_lat: 7.7828,
    user_lng: 4.5419,
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'reg-103',
    registration_reference: 'NBC-OSUN-2026-000003',
    full_name: 'Oluwaseun Babatunde',
    id_card_blob_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    id_card_filename: 'seun_nysc.jpg',
    id_card_type: 'image/jpeg',
    phone: '09087654321',
    email: 'seun.b@example.com',
    lga: 'Ilesa East',
    state_code: 'OS/25C/3096',
    bank_name: 'United Bank for Africa (UBA)',
    account_name: 'BABATUNDE OLUWASEUN',
    account_number: '2087654321',
    location_verified: true,
    location_accuracy: 15,
    user_lat: 7.7827,
    user_lng: 4.5418,
    status: 'rejected',
    admin_note: 'Uploaded image was blurry and unreadable.',
    verified_by: 'Admin User',
    verified_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

// Helper to interact with LocalStorage
const KEYS = {
  VENUE: 'nbc_osun_venue',
  REGISTRATIONS: 'nbc_osun_registrations',
  LOGS: 'nbc_osun_logs',
  ADMIN_AUTH: 'nbc_osun_admin_session',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Storage error:', e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export const apiService = {
  // Venue Settings
  getVenueSettings(): VenueSettings {
    return getStored<VenueSettings>(KEYS.VENUE, INITIAL_VENUE);
  },

  updateVenueSettings(settings: Partial<VenueSettings>): VenueSettings {
    const current = this.getVenueSettings();
    const updated: VenueSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };
    setStored(KEYS.VENUE, updated);
    this.addLog('Venue Updated', `Admin updated registration venue configuration (${updated.name})`);
    return updated;
  },

  // Registrations
  getRegistrations(): Registration[] {
    return getStored<Registration[]>(KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
  },

  getRegistrationById(id: string): Registration | undefined {
    const list = this.getRegistrations();
    return list.find(r => r.id === id);
  },

  createRegistration(data: Omit<Registration, 'id' | 'registration_reference' | 'created_at' | 'updated_at' | 'status'>): Registration {
    const list = this.getRegistrations();

    // Check duplicate State Code or Phone
    const duplicate = list.find(
      r => r.state_code.toUpperCase().trim() === data.state_code.toUpperCase().trim() ||
           r.phone.trim() === data.phone.trim()
    );

    if (duplicate) {
      throw new Error(`A corps member with State Code (${data.state_code}) or Phone (${data.phone}) is already registered.`);
    }

    const year = new Date().getFullYear();
    const count = list.length + 1;
    const refNumber = `NBC-OSUN-${year}-${String(count).padStart(6, '0')}`;

    const newRecord: Registration = {
      ...data,
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      registration_reference: refNumber,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedList = [newRecord, ...list];
    setStored(KEYS.REGISTRATIONS, updatedList);
    this.addLog('New Registration', `Corps member ${data.full_name} (${data.state_code}) registered.`);
    return newRecord;
  },

  updateRegistrationStatus(id: string, status: RegistrationStatus, adminNote?: string, adminName = 'Admin User'): Registration {
    const list = this.getRegistrations();
    const index = list.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error('Registration record not found.');
    }

    const current = list[index];
    const updated: Registration = {
      ...current,
      status,
      admin_note: adminNote !== undefined ? adminNote : current.admin_note,
      verified_by: adminName,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    list[index] = updated;
    setStored(KEYS.REGISTRATIONS, list);
    this.addLog(`Registration ${status.toUpperCase()}`, `Registration ${current.registration_reference} status changed to ${status} by ${adminName}`);
    return updated;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>(KEYS.LOGS, [
      {
        id: 'log-1',
        admin_id: 'admin-1',
        admin_name: 'System',
        action: 'System Initialized',
        description: 'NBC Osun portal ready for registrations.',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ]);
  },

  addLog(action: string, description: string, adminName = 'Admin User'): AuditLog {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      admin_id: 'admin-1',
      admin_name: adminName,
      action,
      description,
      created_at: new Date().toISOString(),
    };
    setStored(KEYS.LOGS, [newLog, ...logs]);
    return newLog;
  },

  // Admin Auth
  isAdminLoggedIn(): boolean {
    const session = getStored<{ email: string; token: string } | null>(KEYS.ADMIN_AUTH, null);
    return !!session;
  },

  loginAdmin(email: string, pass: string): { success: boolean; user?: AdminUser; error?: string } {
    // Demo credential validation
    if (email.trim().toLowerCase() === 'admin@nbcosun.org' && pass === 'nbcosun2026') {
      const user: AdminUser = {
        id: 'admin-1',
        name: 'NBC Osun Admin',
        email: 'admin@nbcosun.org',
        role: 'super_admin',
        created_at: new Date().toISOString(),
      };
      setStored(KEYS.ADMIN_AUTH, { email: user.email, token: 'demo-token-' + Date.now() });
      this.addLog('Admin Login', `Admin ${user.email} logged into system portal.`, user.name);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email address or password. Try admin@nbcosun.org / nbcosun2026' };
  },

  logoutAdmin(): void {
    localStorage.removeItem(KEYS.ADMIN_AUTH);
    this.addLog('Admin Logout', 'Admin user logged out.');
  }
};
