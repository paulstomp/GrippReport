import { getServerSession } from '#auth';
import mysql from 'mysql2/promise';

var connection: any;

async function getConnection() {
  const config = useRuntimeConfig();
  if(!connection) {
    console.log('Creating new mysql connection');
    connection = await mysql.createConnection({
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbDatabase,
      ssl: {rejectUnauthorized: false}});

    // Todo: improve keep connecton alive
    setInterval(async function () {
      connection.query('SELECT 1');
    }, 10000);
  }
  return connection;
}

export default defineEventHandler(async (event) => {

  const session = await getServerSession(event)
  if (!session) {
    return { status: 'unauthenticated' }
  }

  try {
    const connection = await getConnection();
    const body = await readBody(event);
    const query = body.query;
    console.log(query);
    const response = await connection.execute(query);
    return response;
  }
  catch (error) {
    console.log('error: ' + error);
    return({ error: 'error' });
  }
});
