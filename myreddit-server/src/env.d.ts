declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: "DATABASE_URL=postgresql://postgres:password@localhost:5432/myreddit2";
    REDIS_URL: "REDIS_URL=127.0.0.1:6379";
    PORT: "PORT=4000";
    SESSION_SECRET: "SESSION_SECRET=abdsgtaegadfgahfaradfasdfabhtrkyruk";
    CORS_ORIGIN: "CORS_ORIGIN=http://localhost:3000";
  }
}
