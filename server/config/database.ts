import { Pool } from "pg";

class DBConfig {
  public postgres: Pool;

  constructor() {
    this.postgres = new Pool({
      user: process.env.PG_USER!,
      host: process.env.PG_HOST!,
      database: process.env.PG_DATABASE!,
      password: process.env.PG_PASSWORD!,
      port: Number(process.env.PG_PORT!),
    });
  }
}

export default new DBConfig().postgres;
