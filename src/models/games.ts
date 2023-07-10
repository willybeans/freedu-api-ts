import query from '../config/db';

interface Queries {
  addGame: (id: string, name: string) => Promise<gameRoom>;
  getGame: (userId: string) => Promise<gameRoom | undefined>;
  deleteGameById: (userId: string) => Promise<boolean>;
}

interface gameRoom {
  id: string;
  name: string;
  created_at: string;
}

const queries: Queries = {
  // number of rows inserted. 1 = success, 0 = failure
  addGame: async (id, name) => {
    const result = await query(
      'INSERT INTO game_rooms VALUES ($1, $2) RETURNING *',
      [id, name]
    );
    return result.rows[0];
  },
  getGame: async (id) => {
    const result = await query('SELECT * FROM game_rooms WHERE id=$1', [id]);
    return result.rows[0];
  },
  deleteGameById: async (id) => {
    // also delete all chats!
    const result = await query('DELETE game_rooms WHERE id=$1;', [id]);
    return result.rows[0];
  }
};

export default {
  ...queries
};
