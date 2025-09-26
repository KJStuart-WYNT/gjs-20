import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'rsvp.db');

// Ensure data directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync(path.dirname(dbPath), { recursive: true });
} catch (error) {
  // Directory might already exist
}

const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('yes', 'no')),
    dietary_requirements TEXT,
    rsvp_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    confirmation_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS invites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    invite_sent_date DATETIME,
    invite_url TEXT,
    rsvp_id INTEGER,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'responded', 'declined')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rsvp_id) REFERENCES rsvps (id)
  );

  CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
  CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email);
  CREATE INDEX IF NOT EXISTS idx_rsvps_date ON rsvps(rsvp_date);
`);

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

export const dbOperations = {
  // RSVP operations
  insertRSVP: (data: {
    name: string;
    email: string;
    attendance: 'yes' | 'no';
    dietary_requirements?: string;
    confirmation_id?: string;
  }) => {
    const stmt = db.prepare(`
      INSERT INTO rsvps (name, email, attendance, dietary_requirements, confirmation_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(data.name, data.email, data.attendance, data.dietary_requirements || null, data.confirmation_id || null);
  },

  getAllRSVPs: (): RSVPRecord[] => {
    const stmt = db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC');
    return stmt.all() as RSVPRecord[];
  },

  getRSVPByEmail: (email: string): RSVPRecord | null => {
    const stmt = db.prepare('SELECT * FROM rsvps WHERE email = ? ORDER BY created_at DESC LIMIT 1');
    return stmt.get(email) as RSVPRecord | null;
  },

  // Invite operations
  insertInvite: (data: {
    name: string;
    email: string;
    invite_url?: string;
  }) => {
    const stmt = db.prepare(`
      INSERT INTO invites (name, email, invite_url)
      VALUES (?, ?, ?)
    `);
    return stmt.run(data.name, data.email, data.invite_url || null);
  },

  updateInviteStatus: (email: string, status: 'sent' | 'responded' | 'declined', rsvp_id?: number) => {
    const stmt = db.prepare(`
      UPDATE invites 
      SET status = ?, rsvp_id = ?, invite_sent_date = CURRENT_TIMESTAMP
      WHERE email = ? AND status != 'responded'
    `);
    return stmt.run(status, rsvp_id || null, email);
  },

  getAllInvites: (): InviteRecord[] => {
    const stmt = db.prepare('SELECT * FROM invites ORDER BY created_at DESC');
    return stmt.all() as InviteRecord[];
  },

  getInviteStats: () => {
    const stmt = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM invites 
      GROUP BY status
    `);
    return stmt.all() as Array<{ status: string; count: number }>;
  },

  getRSVPStats: () => {
    const stmt = db.prepare(`
      SELECT 
        attendance,
        COUNT(*) as count
      FROM rsvps 
      GROUP BY attendance
    `);
    return stmt.all() as Array<{ attendance: string; count: number }>;
  }
};

export default db;

