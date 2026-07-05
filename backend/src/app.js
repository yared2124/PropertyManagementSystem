/**
 * Express application setup.
 * Configures middleware, static files, routes, and error handling.
 * Exports the app instance for server.js.
 */
import webhookRoutes from "./routes/webhook.routes.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";
import logger from "./config/logger.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";




const app = express();

// =============================================
// Security & Performance Middleware
// =============================================

// Webhooks must come before express.json()
app.use('/webhook', webhookRoutes);
app.use(helmet()); // Sets secure HTTP headers
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// =============================================
// Logging
// =============================================
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// =============================================
// Static Files (Uploads)
// =============================================
app.use("/uploads", express.static("uploads"));

// =============================================
// API Routes
// =============================================
app.use("/api/v1", routes);

// =============================================
// Health Check Endpoint
// =============================================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// =============================================
// Global Error Handler (must be last)
// =============================================
app.use(errorHandler);
app.use((req, res, next) => {
  // Optionally log all requests; but we want to log only mutations.
  // Better to apply per-route or per-method.
  next();
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

export default app;
