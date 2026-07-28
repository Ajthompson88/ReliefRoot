import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "database/prisma/schema.prisma",

    migrations: {
        path: "database/prisma/migrations",

        seed: "tsx database/prisma/seed.ts",
    },

    datasource: {
        url: env("DATABASE_URL"),
    },
});
