const libraries = require('../libraries');
const config = require('../config/index');

// host: string | undefined;
// user: string | undefined;
// password: string | undefined;
// database;

const dbConnection = (connectionUrlOrConfig) => {
  let pool = null;

  const closePool = async () => {
    try {
      await pool.end();
      pool = null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getConnection = async () => {
    try {
      if (pool) {
        return pool;
      }
      pool = libraries.mysql.createPool(connectionUrlOrConfig);

      pool.on('error', async (error) => {
        console.error(error.message);
        await closePool();
        return;
      });
      const connection = await pool.getConnection();
      connection.release();
      return connection;
    } catch (error) {
      pool = null;
      console.error(error.message);
      throw error;
    }
  };

  const query = async (sql, values) => {
    const connection = await getConnection();
    try {
      const [results] = await connection.query(sql, values);
      return [results];
    } catch (error) {
      connection.release;
      throw error;
    }
  };

  return {
    query,
  };
};

const mysqlClient = {
  connectToDb: dbConnection,
};

module.exports = mysqlClient;
