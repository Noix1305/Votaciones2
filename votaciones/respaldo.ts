import { Pool } from 'pg';
import * as cron from 'node-cron';

// Configura tus conexiones a las bases de datos
const sourcePool = new Pool({
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.mpxjwyjrwkritzhafmhk',
  password: 'Seiya.13052610',
  database: 'postgres',
});

const targetPool = new Pool({
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.zipvngvpszqyodscwkxg',
  password: 'Seiya.13052610',
  database: 'postgres',
});

// Función para obtener la clave primaria de la tabla
async function getPrimaryKey(client: any, tableName: string) {
  const res = await client.query(`
    SELECT a.attname
    FROM   pg_index i
    JOIN   pg_attribute a ON a.attrelid = i.indrelid
        AND a.attnum = ANY(i.indkey)
    WHERE  i.indrelid = $1::regclass
    AND    i.indisprimary
  `, [tableName]);
  
  return res.rows.length > 0 ? res.rows[0].attname : null; // Devolver el nombre de la columna primaria
}

// Función para sincronizar las tablas
async function syncTable(tableName: string) {
  const sourceClient = await sourcePool.connect();
  const targetClient = await targetPool.connect();

  try {
    // Obtén los datos de la tabla en la base de datos fuente
    const res = await sourceClient.query(`SELECT * FROM ${tableName}`);
    const primaryKey = await getPrimaryKey(sourceClient, tableName); // Obtener la clave primaria

    for (const row of res.rows) {
      // Comprobar si el registro ya existe en la base de datos de destino
      const existsRes = await targetClient.query(`SELECT * FROM ${tableName} WHERE ${primaryKey} = $1`, [row[primaryKey]]);
      if (existsRes.rows.length === 0) {
        // Inserta el registro en la base de datos de destino
        const columns = Object.keys(row).join(', ');
        const values = Object.values(row);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        await targetClient.query(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`, values);
      }
    }
  } catch (err) {
    console.error(`Error synchronizing table ${tableName}:`, err);
  } finally {
    // Asegúrate de liberar las conexiones incluso si ocurre un error
    sourceClient.release();
    targetClient.release();
  }
}

// Función para obtener las tablas y sincronizarlas
async function syncAllTables() {
  const client = await sourcePool.connect();

  try {
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

    for (const row of res.rows) {
      await syncTable(row.table_name);
    }

    console.log('Synchronization completed successfully.');
  } catch (err) {
    console.error('Error syncing all tables:', err);
  } finally {
    // Asegúrate de liberar la conexión
    client.release();
  }
}

// Programar la tarea para que se ejecute cada 10 minutos
cron.schedule('*/10 * * * *', () => {
  console.log('Starting synchronization...');
  syncAllTables().catch(err => console.error('Error during synchronization:', err));
});
