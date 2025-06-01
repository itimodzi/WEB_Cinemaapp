const fs = require('fs');
const path = require('path');
const { Client, Pool } = require('pg');

async function createDatabase() {
    const client = new Client({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "postgres"
    });

    try {
        await client.connect();
        
        // Check if database exists
        const res = await client.query(
            "SELECT datname FROM pg_catalog.pg_database WHERE datname = 'cinemaapp'"
        );

        if (res.rows.length === 0) {
            // Database doesn't exist, create it
            await client.query('CREATE DATABASE cinemaapp');
            console.log('✅ Database created');
        } else {
            // Database exists, terminate connections and recreate
            await client.query(`
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = 'cinemaapp'
                AND pid <> pg_backend_pid();
            `);
            await client.query('DROP DATABASE cinemaapp');
            await client.query('CREATE DATABASE cinemaapp');
            console.log('✅ Database recreated');
        }
    } catch (err) {
        console.error('❌ Error creating database:', err);
        throw err;
    } finally {
        await client.end();
    }
}

async function initializeSchema() {
    const pool = new Pool({
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "cinemaapp"
    });

    try {
        // Read and execute the schema
        const schema = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        await pool.query(schema);
        console.log('✅ Schema initialized successfully');
    } catch (err) {
        console.error('❌ Error initializing schema:', err);
        throw err;
    } finally {
        await pool.end();
    }
}

// Run initialization
async function init() {
    try {
        await createDatabase();
        await initializeSchema();
        console.log('🚀 Database setup complete');
        process.exit(0);
    } catch (err) {
        console.error('💥 Fatal error:', err);
        process.exit(1);
    }
}

init(); 