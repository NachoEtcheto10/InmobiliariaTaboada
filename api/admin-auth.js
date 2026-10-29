// Vercel Serverless Function: /api/admin-auth
// Valida la clave de administración de forma 100% segura en el servidor.
// La clave NUNCA se expone en el cliente ni en el repositorio.

import crypto from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido. Solo se admite POST.' });
  }

  const serverPassword = process.env.ADMIN_PASSWORD;
  if (!serverPassword) {
    return res.status(500).json({
      ok: false,
      error: 'La variable ADMIN_PASSWORD no está configurada en las variables de entorno de Vercel.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const inputPin = typeof body.pin === 'string' ? body.pin.trim() : '';

    if (!inputPin) {
      return res.status(400).json({ ok: false, error: 'Por favor ingresá la clave de acceso.' });
    }

    // Comparación segura en tiempo constante para evitar timing-attacks
    const a = Buffer.from(inputPin);
    const b = Buffer.from(serverPassword);
    const isMatch = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (isMatch) {
      const sessionToken = crypto.randomBytes(24).toString('hex');
      return res.status(200).json({
        ok: true,
        message: 'Acceso concedido',
        token: sessionToken
      });
    }

    return res.status(401).json({
      ok: false,
      error: 'Clave incorrecta'
    });
  } catch (err) {
    console.error('Error en /api/admin-auth:', err);
    return res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
  }
}
