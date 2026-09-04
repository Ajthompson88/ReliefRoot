import express from "express";

import { sessionMiddleware } from "./config/session.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(sessionMiddleware);

app.use("/api/v1", routes);

// Must come after all valid routes
app.use(notFoundHandler);

// Must remain last
app.use(errorHandler);

export default app;
