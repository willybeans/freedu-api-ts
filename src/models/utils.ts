import query from '../config/db';

interface Queries {
  getUUID: () => Promise<id>;
}

interface id {
  gen_random_uuid: string;
}

const queries: Queries = {
  // number of rows inserted. 1 = success, 0 = failure
  getUUID: async () => {
    const result = await query('SELECT gen_random_uuid ();', []);

    return result.rows[0];
  }
};

export default {
  ...queries
};
