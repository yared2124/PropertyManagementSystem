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

// =============================================
// CORS Whitelist — allow frontend origin(s)
// =============================================
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean); // remove any undefined entries

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (curl, mobile apps, Postman)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();

// =============================================
// Security & Performance Middleware
// =============================================

// Webhooks MUST come before express.json() (Stripe needs raw body)
app.use("/webhook", webhookRoutes);

app.use(helmet());                // Secure HTTP headers
app.use(cors(corsOptions));       // CORS with whitelist
app.use(compression());           // Gzip response bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
// Health Check Endpoint
// =============================================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// =============================================
// API Routes
// =============================================
app.use("/api/v1", routes);

// =============================================
// API Docs (Swagger) — after routes
// =============================================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// =============================================
// 404 Handler — catch undefined routes
// =============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// =============================================
// Global Error Handler — MUST be last
// =============================================
app.use(errorHandler);

export default app;

