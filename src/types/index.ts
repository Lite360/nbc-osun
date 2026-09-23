export type RegistrationStatus = 'pending' | 'confirmed' | 'rejected';

export interface Registration {
  id: string;
  registration_reference: string;
  full_name: string;
  id_card_blob_url: string;
  id_card_filename: string;
  id_card_type: string;
  phone: string;
  email: string;
  lga: string;
  state_code: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  location_verified: boolean;
  location_accuracy?: number;
  user_lat?: number;
  user_lng?: number;
  status: RegistrationStatus;
  admin_note?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VenueSettings {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  is_active: boolean; // Registration open/closed
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  created_at: string;
}

export interface AuditLog {
  id: string;
  registration_id?: string;
  admin_id: string;
  admin_name: string;
  action: string;
  description: string;
  created_at: string;
}

export interface RegistrationFilterOptions {
  searchQuery: string;
  status: string; // 'all' | 'pending' | 'confirmed' | 'rejected'
  lga: string; // 'all' | LGA_NAME
  startDate: string;
  endDate: string;
}
