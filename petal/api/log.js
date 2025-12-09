export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    // Basic validation
    const payload = {
      sessionId: body.sessionId || 'unknown',
      ts: body.ts || Date.now(),
      path: body.path || '',
      referrer: body.referrer || '',
      userAgent: body.userAgent || req.headers['user-agent'] || '',
      eventType: body.eventType || '',
      section: body.section || '',
      buttonLabel: body.buttonLabel || '',
      phone: body.phone || '',
      email: body.email || '',
      message: body.message || '',
      messageLength: typeof body.messageLength === 'number' ? body.messageLength : undefined,
      hasPhone: typeof body.hasPhone === 'boolean' ? body.hasPhone : undefined,
      hasEmail: typeof body.hasEmail === 'boolean' ? body.hasEmail : undefined,
      sectionIndex: typeof body.sectionIndex === 'number' ? body.sectionIndex : undefined,
      maxSectionIndex: typeof body.maxSectionIndex === 'number' ? body.maxSectionIndex : undefined,
    };

    // Log to Vercel function logs
    console.log(JSON.stringify(payload));

    // Forward to Logtail if configured (Better Stack regional ingest)
    const LOGTAIL_SOURCE_TOKEN = process.env.LOGTAIL_SOURCE_TOKEN;
    const LOGTAIL_ENDPOINT = process.env.LOGTAIL_ENDPOINT || 'https://s1623547.eu-nbg-2.betterstackdata.com';
    if (LOGTAIL_SOURCE_TOKEN) {
      await fetch(LOGTAIL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LOGTAIL_SOURCE_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('log handler error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

