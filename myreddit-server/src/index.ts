import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import path from "path";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "myreddit",
    username: "postgres",
    password: "password",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, Post],
  });

  await conn.runMigrations();
  // await Post.delete({});

  const app = express();

  // Redis
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  // Apply cors to all routes
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // We are going to be using RedisStore for UserResolver
  // Redis middleware must come first
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years in milliseconds
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "abdsgtaegadfgahfaradfasdfabhtrkyruk",
      resave: false, // stop pinging redis
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false, //since we are using cors middleware
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main();
