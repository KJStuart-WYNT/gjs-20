import { sql } from '@vercel/postgres';

export interface RSVPRecord {
  id: number;
  name: string;
  email: string;
  attendance: 'yes' | 'no';
  dietary_requirements: string | null;
  rsvp_date: string;
  confirmation_id: string | null;
  created_at: string;
}

export interface InviteRecord {
  id: number;
  name: string;
  email: string;
  invite_sent_date: string | null;
  invite_url: string | null;
  rsvp_id: number | null;
  status: 'pending' | 'sent' | 'responded' | 'declined';
  created_at: string;
}

// Initialize tables
export async function initTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        attendance TEXT NOT NULL CHECK (attendance IN ('yes', 'no')),
        dietary_requirements TEXT,
        rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmation_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS invites (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        invite_sent_date TIMESTAMP,
        invite_url TEXT,
        rsvp_id INTEGER,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'responded', 'declined')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rsvp_id) REFERENCES rsvps (id)
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_date ON rsvps(rsvp_date)`;
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
}

// Initialize tables on module load
if (typeof window === 'undefined') {
  initTables();
}

export const dbOperations = {
  // RSVP operations
  insertRSVP: async (data: {
    name: string;
    email: string;
    attendance: 'yes' | 'no';
    dietary_requirements?: string;
    confirmation_id?: string;
  }) => {
    try {
      const result = await sql`
        INSERT INTO rsvps (name, email, attendance, dietary_requirements, confirmation_id)
        VALUES (${data.name}, ${data.email}, ${data.attendance}, ${data.dietary_requirements || null}, ${data.confirmation_id || null})
        RETURNING id, name, email, attendance, dietary_requirements, rsvp_date, confirmation_id, created_at
      `;
      return { lastInsertRowid: result.rows[0].id };
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  },

  getAllRSVPs: async (): Promise<RSVPRecord[]> => {
    try {
      const result = await sql<RSVPRecord>`
        SELECT * FROM rsvps ORDER BY created_at DESC
      `;
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  },

  getRSVPByEmail: async (email: string): Promise<RSVPRecord | null> => {
    try {
      const result = await sql<RSVPRecord>`
        SELECT * FROM rsvps WHERE email = ${email} ORDER BY created_at DESC LIMIT 1
      `;
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database query error:', error);
      return null;
    }
  },

  // Invite operations
  insertInvite: async (data: {
    name: string;
    email: string;
    invite_url?: string;
  }) => {
    try {
      const result = await sql`
        INSERT INTO invites (name, email, invite_url)
        VALUES (${data.name}, ${data.email}, ${data.invite_url || null})
        RETURNING id
      `;
      return { lastInsertRowid: result.rows[0].id };
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  },

  updateInviteStatus: async (email: string, status: 'sent' | 'responded' | 'declined', rsvp_id?: number) => {
    try {
      await sql`
        UPDATE invites 
        SET status = ${status}, rsvp_id = ${rsvp_id || null}, invite_sent_date = CURRENT_TIMESTAMP
        WHERE email = ${email} AND status != 'responded'
      `;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  },

  getAllInvites: async (): Promise<InviteRecord[]> => {
    try {
      const result = await sql<InviteRecord>`
        SELECT * FROM invites ORDER BY created_at DESC
      `;
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  },

  getInviteStats: async () => {
    try {
      const result = await sql`
        SELECT 
          status,
          COUNT(*) as count
        FROM invites 
        GROUP BY status
      `;
      return result.rows as Array<{ status: string; count: number }>;
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  },

  getRSVPStats: async () => {
    try {
      const result = await sql`
        SELECT 
          attendance,
          COUNT(*) as count
        FROM rsvps 
        GROUP BY attendance
      `;
      return result.rows as Array<{ attendance: string; count: number }>;
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  }
};