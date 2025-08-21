import * as SQLite from 'expo-sqlite';

let db;
export  const setupDb = async () => {
  db = await SQLite.openDatabaseAsync('restaurant.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      category TEXT
    );
  `);
  return db;
}

export  const saveMenu = async (items) => {
  if (!db) await setupDb();

  await db.withTransactionAsync(async () => {
    // UPSERT por `name` (requiere UNIQUE en name)
    const stmt = await db.prepareAsync(`
      INSERT INTO menu (name, description, price, image, category)
      VALUES ($name, $description, $price, $image, $category)
      ON CONFLICT(name) DO UPDATE SET
        description=excluded.description,
        price=excluded.price,
        image=excluded.image,
        category=excluded.category
    `);

    try {
      for (const it of items) {
        await stmt.executeAsync({
          $name: it.name,
          $description: it.description,
          $price: Number(it.price),
          $image: it.image ?? null,
          $category: it.category ?? null,
        });
      }
    } finally {
      await stmt.finalizeAsync();
    }
  });
}

export const getAllMenu = async () => {
    const d = await setupDb();
    return d.getAllAsync('SELECT * FROM menu ORDER BY name')
}

export const getCategories = async () => {
  const d = await setupDb();
  const rows = await d.getAllAsync(`SELECT DISTINCT category FROM menu`);
  // normaliza → Title Case
  const norm = s => (s ?? '').trim().toLowerCase();
  const cap  = s => s.charAt(0).toUpperCase() + s.slice(1);
  return [...new Set(rows.map(r => norm(r.category)))].map(cap);
}