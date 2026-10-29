import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      open: true,
    },
    plugins: [
      {
        name: 'local-vercel-api-middleware',
        configureServer(server) {
          // Inyectar variables desde .env en process.env
          process.env.RESEND_API_KEY = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
          process.env.RESEND_FROM_EMAIL = env.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL;
          process.env.RESEND_TO_EMAIL = env.RESEND_TO_EMAIL || process.env.RESEND_TO_EMAIL;
          process.env.ADMIN_PASSWORD = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

          server.middlewares.use(async (req, res, next) => {
            const url = req.url ? req.url.split('?')[0] : '';

            if (url !== '/api/send-email' && url !== '/api/admin-auth') {
              return next();
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
              return;
            }

            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                req.body = JSON.parse(bodyStr || '{}');
              } catch (e) {
                req.body = {};
              }

              const vercelRes = {
                status(code) {
                  res.statusCode = code;
                  return this;
                },
                json(data) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return this;
                }
              };

              try {
                if (url === '/api/send-email') {
                  const { default: handler } = await import('./api/send-email.js');
                  await handler(req, vercelRes);
                } else if (url === '/api/admin-auth') {
                  const { default: handler } = await import('./api/admin-auth.js');
                  await handler(req, vercelRes);
                }
              } catch (err) {
                console.error(`Error en API local (${url}):`, err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: false, error: err.message }));
              }
            });
          });
        }
      }
    ]
  };
});
