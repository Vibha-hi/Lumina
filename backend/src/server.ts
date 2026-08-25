import dns from "dns";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import app from "./app.js";

// Force IPv4 resolution to prevent ENETUNREACH errors on Render for SMTP (Node 17+)
dns.setDefaultResultOrder('ipv4first');

const PORT = parseInt(env.PORT, 10);

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🌟 LUMINA.AI Backend Server                        ║
║                                                      ║
║   Environment: ${env.NODE_ENV.padEnd(37)}║
║   Port:        ${String(PORT).padEnd(37)}║
║   API:         http://localhost:${PORT}/api${" ".repeat(13)}║
║   Health:      http://localhost:${PORT}/api/health${" ".repeat(6)}║
║                                                      ║
╚══════════════════════════════════════════════════════╝
      `);
    });

    // ─── Graceful Shutdown ───────────────────────────────────────
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await disconnectDatabase();
        console.log("✅ Server shut down gracefully");
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error("❌ Could not close connections in time. Forcing shutdown.");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error("❌ Unhandled Promise Rejection:", err.message);
      shutdown("UNHANDLED_REJECTION");
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err: Error) => {
      console.error("❌ Uncaught Exception:", err.message);
      shutdown("UNCAUGHT_EXCEPTION");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
