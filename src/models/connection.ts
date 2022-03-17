export interface Connection {
  id: string;
  name: string;
  host: string;
  user: string;
  port: string;
  password: string;
  database: string;
  type: "Postgres"; // | 'MySQL', etc.
}
