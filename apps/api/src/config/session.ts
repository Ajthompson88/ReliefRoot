import pgSession from "connect-pg-simple";
import session from "express-session";

import { env } from "./env.js";

const PostgreSqlStore = pgSession(session);

export const sessionMiddleware = session({
    store: new PostgreSqlStore({
        conString: env.databaseUrl,
        createTableIfMissing: true,
    }),

    secret: env.sessionSecret,

    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
});
