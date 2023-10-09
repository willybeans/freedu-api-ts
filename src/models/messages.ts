import query from '../config/db';

interface Queries {
  addMessage: (
    chat_room_id: string,
    user_id: string,
    content: string
  ) => Promise<{
    chat_room_id: string;
    user_id: string;
    content: string;
    id: string;
    sent_at: string;
  }>;
  getMessageById: (user_id: string) => Promise<boolean>;
  deleteMessageById: (userId: string) => Promise<boolean>;
}

const queries: Queries = {
  // number of rows inserted. 1 = success, 0 = failure
  addMessage: async (userId, chatRoomId, content) => {
    const result = await query(
      'INSERT INTO messages VALUES ($1, $2, $3) RETURNING *',
      [chatRoomId, userId, content]
    );

    return result.rows[0];
  },
  getMessageById: async (id) => {
    const result = await query('SELECT * FROM messages WHERE id=$1', [id]);
    return result.rows[0];
  },
  deleteMessageById: async (userId) => {
    const result = await query('DELETE message WHERE id=$1;', [userId]);
    return result.rows[0];
  }
};

export default {
  ...queries
};
