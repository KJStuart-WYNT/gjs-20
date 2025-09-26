import { Pool } from 'pg';

let pool: Pool | null = null;

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

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Database connection string not found');
    }
    
    pool = new Pool({ 
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

// Initialize tables
export async function initTables() {
  try {
    const client = getPool();
    await client.query(`
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
    `);

    await client.query(`
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
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_rsvps_date ON rsvps(rsvp_date)`);
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    // Don't throw - let the app continue without tables for now
  }
}

// Initialize tables when database operations are first called
async function ensureTables() {
  try {
    const client = getPool();
    const result = await client.query(`
      SELECT to_regclass('public.rsvps') as exists
    `);
    
    // Only run table creation if table doesn't exist
    if (!result.rows[0].exists) {
      console.log('Tables not found, initializing...');
      await initTables();
    }
  } catch (error) {
    console.log('Checking table status, initializing if needed:', error instanceof Error ? error.message : 'Unknown error');
    await initTables();
  }
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
      await ensureTables();
      const client = getPool();
      const result = await client.query(`
        INSERT INTO rsvps (name, email, attendance, dietary_requirements, confirmation_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [data.name, data.email, data.attendance, data.dietary_requirements || null, data.confirmation_id || null]);
      return { lastInsertRowid: result.rows[0].id };
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  },

  getAllRSVPs: async (): Promise<RSVPRecord[]> => {
    try {
      await ensureTables();
      const client = getPool();
      const result = await client.query(`
        SELECT * FROM rsvps ORDER BY created_at DESC
      `);
      return result.rows as RSVPRecord[];
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  },

  getRSVPByEmail: async (email: string): Promise<RSVPRecord | null> => {
    try {
      await ensureTables();
      const client = getPool();
      const result = await client.query(`
        SELECT * FROM rsvps WHERE email = $1 ORDER BY created_at DESC LIMIT 1
      `, [email]);
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
      await ensureTables();
      const client = getPool();
      const result = await client.query(`
        INSERT INTO invites (name, email, invite_url)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [data.name, data.email, data.invite_url || null]);
      return { lastInsertRowid: result.rows[0].id };
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  },

  updateInviteStatus: async (email: string, status: 'sent' | 'responded' | 'declined', rsvp_id?: number) => {
    try {
      await ensureTables();
      const client = getPool();
      await client.query(`
        UPDATE invites 
        SET status = $1, rsvp_id = $2, invite_sent_date = CURRENT_TIMESTAMP
        WHERE email = $3 AND status != 'responded'
      `, [status, rsvp_id || null, email]);
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  },

  getAllInvites: async (): Promise<InviteRecord[]> => {
    try {
      await ensureTables();
      const client = getPool();
      const result = await client.query(`
        SELECT * FROM invites ORDER BY created_at DESC
      `);
      return result.rows as InviteRecord[];
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  },

  getInviteStats: async () => {
    try {
      const client = getPool();
      const result = await client.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM invites 
        GROUP BY status
      `);
      return result.rows as Array<{ status: string; count: number }>;
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  },

  getRSVPStats: async () => {
    try {
      const client = getPool();
      const result = await client.query(`
        SELECT 
          attendance,
          COUNT(*) as count
        FROM rsvps 
        GROUP BY attendance
      `);
      return result.rows as Array<{ attendance: string; count: number }>;
    } catch (error) {
      console.error('Database query error:', error);
      return [];
    }
  }
};