import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  try {
    const serverOptions = {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    };

    const vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      customLogger: {
        ...viteLogger,
        error: (msg, options) => {
          viteLogger.error(msg, options);
          // NÃO force exit em produção
          if (process.env.NODE_ENV === 'development') {
            process.exit(1);
          }
        },
      },
      server: serverOptions,
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      // Skip API routes
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/health')) {
        return next();
      }

      const url = req.originalUrl;
      try {
        const clientTemplate = path.resolve(
          import.meta.dirname,
          "..",
          "client",
          "index.html",
        );

        // Verificar se o arquivo existe
        if (!fs.existsSync(clientTemplate)) {
          log(`❌ Template not found: ${clientTemplate}`);
          return res.status(500).send('Template file not found');
        }

        // Sempre recarregar o index.html do disco
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );

        const page = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        log(`❌ Vite transform error: ${(e as Error).message}`);
        next(e);
      }
    });

    log(`✅ Vite development server configured`);
  } catch (error) {
    log(`❌ Failed to setup Vite: ${error}`);
    throw error;
  }
}

export function serveStatic(app: Express) {
  try {
    const distPath = path.resolve(import.meta.dirname, "..", "public");
    
    log(`📁 Looking for static files in: ${distPath}`);
    
    if (!fs.existsSync(distPath)) {
      // Tentar outras localizações comuns
      const altPaths = [
        path.resolve(import.meta.dirname, "public"),
        path.resolve(process.cwd(), "public"),
        path.resolve(process.cwd(), "dist"),
        path.resolve(process.cwd(), "build")
      ];
      
      let foundPath = null;
      for (const altPath of altPaths) {
        if (fs.existsSync(altPath)) {
          foundPath = altPath;
          break;
        }
      }
      
      if (!foundPath) {
        log(`❌ Could not find build directory. Tried: ${distPath}`);
        log(`❌ Also tried: ${altPaths.join(', ')}`);
        
        // Servir uma página de erro básica
        app.use("*", (req, res) => {
          if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/health')) {
            return res.status(404).json({ error: 'Not found' });
          }
          res.status(500).send(`
            <html>
              <body>
                <h1>Build Error</h1>
                <p>Static files not found. Make sure to build the client first.</p>
                <p>Looking for: ${distPath}</p>
              </body>
            </html>
          `);
        });
        return;
      }
      
      log(`✅ Found static files in: ${foundPath}`);
      app.use(express.static(foundPath));
      
      // Fallback para index.html
      app.use("*", (req, res) => {
        if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/health')) {
          return res.status(404).json({ error: 'API endpoint not found' });
        }
        
        const indexPath = path.resolve(foundPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Index file not found');
        }
      });
      
    } else {
      log(`✅ Static files found in: ${distPath}`);
      app.use(express.static(distPath));
      
      // Fallback para index.html se o arquivo não existir
      app.use("*", (req, res) => {
        if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/health')) {
          return res.status(404).json({ error: 'API endpoint not found' });
        }
        
        const indexPath = path.resolve(distPath, "index.html");
        res.sendFile(indexPath);
      });
    }
    
    log(`✅ Static file serving configured`);
  } catch (error) {
    log(`❌ Failed to setup static serving: ${error}`);
    throw error;
  }
}
