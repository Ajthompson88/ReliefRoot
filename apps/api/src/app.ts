import express from "express";

import { errorHandler } from "./middleware/error.middleware.js";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());

app.use("/api/v1", routes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
