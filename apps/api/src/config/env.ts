import dotenv from "dotenv";

dotenv.config({
    path: new URL("../../../../.env", import.meta.url),
});

const databaseUrl = process.env.DATABASE_URL;
const sessionSecret = process.env.SESSION_SECRET;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined.");
}

if (!sessionSecret) {
    throw new Error("SESSION_SECRET is not defined.");
}

export const env = {
    databaseUrl,
    sessionSecret,
};
