import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route PRIMEIRO - para Railway
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
    port: process.env.PORT || '5000'
  });
});

// Middleware de logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

(async () => {
  try {
    log(`🔧 Starting server setup...`);
    log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'production'}`);
    log(`🚪 PORT: ${process.env.PORT || '5000'}`);
    
    // Registrar rotas
    const server = await registerRoutes(app);
    log(`✅ Routes registered successfully`);

    // Error handler - DEPOIS das rotas
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      log(`❌ Error ${status}: ${message} - Path: ${req.path}`);
      
      if (!res.headersSent) {
        res.status(status).json({ 
          error: message,
          path: req.path,
          timestamp: new Date().toISOString()
        });
      }
      
      // NÃO faça throw - isso crasharia o servidor
      // Log do erro completo apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
    });

    // Setup do ambiente
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (isDevelopment) {
      log(`🔧 Setting up Vite for development...`);
      await setupVite(app, server);
      log(`✅ Vite setup complete`);
    } else {
      log(`📦 Setting up static file serving for production...`);
      serveStatic(app);
      log(`✅ Static files setup complete`);
    }

    // Configuração do servidor
    const port = parseInt(process.env.PORT || "5000", 10);
    const host = "0.0.0.0";

    // Iniciar servidor
    server.listen(port, host, () => {
      log(`🚀 Server running on ${host}:${port}`);
      log(`📦 Environment: ${process.env.NODE_ENV || 'production'}`);
      log(`🔗 Health check: http://${host}:${port}/health`);
      log(`🌐 Ready to handle requests!`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      log(`📴 SIGTERM received, shutting down gracefully...`);
      server.close(() => {
        log(`✅ Server closed`);
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      log(`📴 SIGINT received, shutting down gracefully...`);
      server.close(() => {
        log(`✅ Server closed`);
        process.exit(0);
      });
    });

  } catch (error) {
    log(`💥 Failed to start server: ${error}`);
    console.error('Detailed error:', error);
    process.exit(1);
  }
})();
