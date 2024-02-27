const mysqlClient = require('./connection');

const db = (databaseUrlOrConfig) => {
  const db = mysqlClient.connectToDb(databaseUrlOrConfig);

  // Select function to selet data from the database
  const find = async ({ table, conditions = {}, columns = '*', limit = 100 }) => {
    try {
      let sqlStatement = `SELECT ${columns} FROM ${table}`;

      const thereAreConditions = Object.keys(conditions).length > 0;
      if (thereAreConditions) {
        const whereClause = Object.keys(conditions)
          .map((key) => `${key} = ?`)
          .join(' AND ');
        sqlStatement += ` WHERE ${whereClause}`;
      }

      // Add a LIMIT clause
      sqlStatement += ` LIMIT ${limit}`;
      const sqlValues = Object.values(conditions);
      const [queryResults] = await db.query(sqlStatement, sqlValues);
      return queryResults.length > 0 ? queryResults : null;
    } catch (error) {
      throw error;
    }
  };

  // An insert operation function
  const insert = async ({ table, data }) => {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = Array(keys.length).fill('?').join(', ');

      const sqlStatement = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
      const [insertResult] = await db.query(sqlStatement, values);

      const insertWasSuccessful = insertResult.affectedRows > 0;
      if (!insertWasSuccessful) {
        throw new Error('Insert failure due to unexpected error');
      }
      return {
        status: 'success',
      };
    } catch (error) {
      throw error;
    }
  };

  // An update operation function
  const update = async ({ table, data, condition }) => {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((key) => `${key} = ?`).join(', ');

      const conditionKeys = Object.keys(condition);
      const conditionValues = Object.values(condition);
      const conditionPlaceholders = conditionKeys.map((key) => `${key} = ?`).join(' AND ');

      const sqlStatement = `UPDATE ${table} SET ${placeholders} WHERE ${conditionPlaceholders}`;
      const sqlValues = [...values, ...conditionValues];

      const [updateResult] = await db.query(sqlStatement, sqlValues);
      const updateWasSuccessful = updateResult.affectedRows > 0;
      if (!updateWasSuccessful) {
        throw new Error('Update failure due to unexpected error');
      }

      return {
        status: 'success',
      };
    } catch (error) {
      throw error;
    }
  };

  // A delete operation function
  const remove = async ({ table, condition }) => {
    try {
      const conditionKeys = Object.keys(condition);
      const conditionValues = Object.values(condition);
      const conditionPlaceholders = conditionKeys.map((key) => `${key} = ?`).join(' AND ');

      const sqlStatement = `DELETE FROM ${table} WHERE ${conditionPlaceholders}`;
      const [deleteResult] = await db.query(sqlStatement, conditionValues);

      const deleteWasSuccessful = deleteResult.affectedRows > 0;
      if (!deleteWasSuccessful) {
        throw new Error('Delete failure due to unexpected error or no matching records found');
      }

      return {
        status: 'success',
      };
    } catch (error) {
      throw error;
    }
  };

  return {
    find,
    insert,
    update,
    remove,
  };
};

module.exports = db;
