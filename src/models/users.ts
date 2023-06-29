import query from '../config/db';

interface Queries {
  addUser: (
    id: string,
    username: string,
    hashedPassword: string
  ) => Promise<boolean>;
  getUser: (username: string) => Promise<boolean>;
  deleteUserById: (userId: string) => Promise<boolean>;
}

const queries: Queries = {
  // number of rows inserted. 1 = success, 0 = failure
  addUser: async (id, username, hashedPassword) => {
    const result = await query(
      `INSERT INTO USERS VALUES (${id}, ${username}, ${hashedPassword}) RETURNING *`
    );
    return result.rows[0];
  },
  getUser: async (id) => {
    const result = await query(`SELECT * FROM users WHERE id=${id}`);
    return result.rows[0];
  },
  deleteUserById: async (userId) => {
    const result = await query('DELETE users WHERE id=$1;');
    return result.rows[0];
  }
};

export default {
  ...queries
};
