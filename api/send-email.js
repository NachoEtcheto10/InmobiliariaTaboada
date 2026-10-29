// Vercel Serverless Function: /api/send-email
// Se ejecuta en el servidor seguro de Vercel (Node.js).
// La API Key de Resend NUNCA se expone en el navegador.

export default async function handler(req, res) {
  // 1. Validar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Método no permitido. Solo se admite POST.'
    });
  }

  // 2. Obtener clave desde las variables de entorno de Vercel
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !apiKey.startsWith('re_')) {
    return res.status(500).json({
      ok: false,
      error: 'El servidor no tiene configurada la variable RESEND_API_KEY en Vercel.'
    });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Grupo Taboada <contacto@grupotaboada.com.ar>';
  const toEmail = process.env.RESEND_TO_EMAIL || 'info@grupotaboada.com.ar';

  try {
    // 3. Sanitización y validación estricta de seguridad contra inyecciones
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Honeypot anti-bots (si viene relleno un campo trampa, ignorar silenciosamente)
    if (body._trap && body._trap.trim() !== '') {
      return res.status(200).json({ ok: true });
    }

    const clean = (val, maxLen = 200) => {
      if (typeof val !== 'string') return '';
      return val
        .slice(0, maxLen)
        .replace(/[\r\n\t]+/g, ' ')
        .trim();
    };

    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const nombre = clean(body.nombre, 80);
    const email = clean(body.email, 120);
    const motivo = clean(body.motivo, 60) || 'Consulta';
    const area = clean(body.area, 80) || 'General';
    const tema = clean(body.tema, 120) || 'Consulta general';
    
    // Mensaje puede ser multilínea pero con límite de longitud anti-payload
    const comentariosRaw = typeof body.comentarios === 'string' ? body.comentarios.slice(0, 3000) : '';
    const comentarios = escapeHtml(comentariosRaw.trim());

    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({ ok: false, error: 'El nombre es obligatorio.' });
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ ok: false, error: 'El e-mail ingresado no es válido.' });
    }

    // 4. Armar el HTML del correo
    const subject = `[Consulta Web] ${escapeHtml(motivo)} - ${escapeHtml(nombre)}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e5e0d8; border-radius: 10px; background-color: #ffffff; color: #2b2826;">
        <div style="border-bottom: 2px solid #bda882; padding-bottom: 14px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; color: #2b2826;">Nueva consulta desde grupotaboada.com.ar</h2>
          <span style="font-size: 13px; color: #767069;">Fecha: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #767069; width: 140px;"><strong>Motivo:</strong></td>
            <td style="padding: 8px 0; color: #2b2826;">${escapeHtml(motivo)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #767069;"><strong>Área / Servicio:</strong></td>
            <td style="padding: 8px 0; color: #2b2826;">${escapeHtml(area)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #767069;"><strong>Tema específico:</strong></td>
            <td style="padding: 8px 0; color: #2b2826;">${escapeHtml(tema)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #767069;"><strong>Consultante:</strong></td>
            <td style="padding: 8px 0; color: #2b2826; font-weight: bold;">${escapeHtml(nombre)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #767069;"><strong>E-mail de respuesta:</strong></td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #8c7853; text-decoration: underline;">${escapeHtml(email)}</a></td>
          </tr>
        </table>

        <div style="margin-top: 16px;">
          <strong style="color: #2b2826; font-size: 14px;">Mensaje o consulta:</strong>
          <div style="margin-top: 8px; background-color: #faf8f5; border-left: 4px solid #bda882; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #333;">${comentarios || '(Sin comentarios adicionales)'}</div>
        </div>

        <div style="margin-top: 28px; padding-top: 14px; border-top: 1px solid #f0ece6; font-size: 12px; color: #9c958c; text-align: center;">
          Podés responder este correo directamente para escribirle a <strong>${escapeHtml(email)}</strong>.
        </div>
      </div>
    `;

    // 5. Llamada a la API de Resend desde Node.js (Servidor)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email, // Permite que Javier o Hernán Taboada respondan directo al usuario
        subject: subject,
        html: html
      })
    });

    const resData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Error en Resend API:', resData);
      return res.status(response.status).json({
        ok: false,
        error: resData.message || 'Error al enviar el correo a través de Resend.'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Correo enviado con éxito',
      id: resData.id
    });

  } catch (err) {
    console.error('Excepción en /api/send-email:', err);
    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor al procesar el mensaje.'
    });
  }
}
