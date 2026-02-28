
import { Medicine, User, UserRole } from '../types.ts';

const DB_KEY = 'medroute_local_db';

interface Database {
  users: any[];
  medicines: Medicine[];
  donations: any[];
  requests: any[];
}

const getDB = (): Database => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : { users: [], medicines: [], donations: [], requests: [] };
};

const saveDB = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const backendService = {
  // User Management
  register: (userData: any) => {
    const db = getDB();
    if (db.users.find(u => u.email === userData.email)) {
      throw new Error("User already exists");
    }
    db.users.push(userData);
    saveDB(db);
    return userData;
  },

  getUserByEmail: (email: string) => {
    const db = getDB();
    return db.users.find(u => u.email === email);
  },

  // Donation Management
  addDonation: (donation: any) => {
    const db = getDB();
    const newDonation = {
      ...donation,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'VERIFIED',
      quantity: Number(donation.quantity || 1)
    };
    db.donations.push(newDonation);
    // Add to shared pool
    db.medicines.push({
      id: newDonation.id,
      name: newDonation.name,
      expiryDate: newDonation.expiryDate,
      quantity: newDonation.quantity,
      status: 'VERIFIED',
      donorId: 'current-user'
    });
    saveDB(db);
    return newDonation;
  },

  getDonations: () => getDB().donations,
  getMedicines: () => getDB().medicines,

  // Stats
  getTotalUnitsShared: () => {
    const db = getDB();
    return db.donations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
  }
};
