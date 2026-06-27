/**
 * Entry point of the application.
 * Starts the Express server on the port defined in environment variables.
 * Uses the app instance from app.js.
 */

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`);
});
