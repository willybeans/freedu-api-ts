import query from '../config/db';

interface Queries {
  addUser: (userName: string) => Promise<boolean>;
  getUser: (username: string) => Promise<{
    id: string;
    username: string;
    password: string;
  }>;
  deleteUserById: (userId: string) => Promise<boolean>;
}

const queries: Queries = {
  // number of rows inserted. 1 = success, 0 = failure
  addUser: async (userName: string) => {
    const result = await query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [userName]
    );
    return result.rows[0];
  },
  getUser: async (id) => {
    const result = await query('SELECT * FROM users WHERE id=$1', [id]);
    return result.rows[0];
  },
  deleteUserById: async (userId) => {
    const result = await query('DELETE users WHERE id=$1;', [userId]);
    return result.rows[0];
  }
};

export default {
  ...queries
};
