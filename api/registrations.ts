import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL environment variable is missing.' });
  }

  const sql = neon(DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM registrations ORDER BY created_at DESC;`;
      return res.status(200).json({ success: true, data: rows });
    }

    if (req.method === 'POST') {
      const {
        full_name,
        id_card_blob_url,
        id_card_filename,
        id_card_type,
        phone,
        email,
        lga,
        state_code,
        bank_name,
        account_name,
        account_number,
        user_lat,
        user_lng,
      } = req.body;

      if (!full_name || !state_code || !phone || !email || !lga || !bank_name || !account_number) {
        return res.status(400).json({ error: 'Missing required registration fields.' });
      }

      // Check duplicate
      const duplicates = await sql`
        SELECT id FROM registrations
        WHERE UPPER(state_code) = UPPER(${state_code.trim()})
           OR phone = ${phone.trim()}
        LIMIT 1;
      `;

      if (duplicates.length > 0) {
        return res.status(409).json({ error: 'A corps member with this State Code or Phone is already registered.' });
      }

      const countResult = await sql`SELECT COUNT(*) as count FROM registrations;`;
      const count = parseInt(countResult[0].count, 10) + 1;
      const refNumber = `NBC-OSUN-${new Date().getFullYear()}-${String(count).padStart(6, '0')}`;
      const id = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      await sql`
        INSERT INTO registrations (
          id, registration_reference, full_name, id_card_blob_url, id_card_filename,
          id_card_type, phone, email, lga, state_code, bank_name, account_name,
          account_number, location_verified, user_lat, user_lng, status
        ) VALUES (
          ${id}, ${refNumber}, ${full_name}, ${id_card_blob_url || ''}, ${id_card_filename || 'nysc_id.jpg'},
          ${id_card_type || 'image/jpeg'}, ${phone}, ${email}, ${lga}, ${state_code}, ${bank_name}, ${account_name},
          ${account_number}, TRUE, ${user_lat || null}, ${user_lng || null}, 'pending'
        );
      `;

      return res.status(201).json({
        success: true,
        data: {
          id,
          registration_reference: refNumber,
          full_name,
          state_code,
          status: 'pending',
        },
      });
    }

    if (req.method === 'PATCH') {
      const { id, status, admin_note, verified_by } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing id or status field.' });
      }

      await sql`
        UPDATE registrations
        SET status = ${status},
            admin_note = ${admin_note || null},
            verified_by = ${verified_by || 'Admin'},
            verified_at = NOW(),
            updated_at = NOW()
        WHERE id = ${id};
      `;

      return res.status(200).json({ success: true, message: 'Status updated successfully.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
