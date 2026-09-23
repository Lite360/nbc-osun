import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL environment variable is missing.' });
  }

  const sql = neon(DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM venues WHERE id = 'venue-1' LIMIT 1;`;
      if (!rows.length) {
        return res.status(200).json({
          success: true,
          data: {
            id: 'venue-1',
            name: 'NBC Osun Corps Member Registration Venue',
            address: 'NBC Bottling Plant Premises, Osogbo, Osun State, Nigeria',
            latitude: 7.7827,
            longitude: 4.5418,
            radius: 100,
            is_active: true,
          },
        });
      }
      return res.status(200).json({ success: true, data: rows[0] });
    }

    if (req.method === 'POST' || req.method === 'PATCH') {
      const { name, address, latitude, longitude, radius, is_active } = req.body;

      await sql`
        INSERT INTO venues (id, name, address, latitude, longitude, radius, is_active, updated_at)
        VALUES (
          'venue-1',
          ${name || 'NBC Osun Registration Venue'},
          ${address || 'Osogbo, Osun State'},
          ${latitude || 7.7827},
          ${longitude || 4.5418},
          ${radius || 100},
          ${is_active ?? true},
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

      return res.status(200).json({ success: true, message: 'Venue configuration updated successfully.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Venue API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
