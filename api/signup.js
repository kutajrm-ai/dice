import { put } from '@vercel/blob';

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  if (body && body.website) return json({ ok: true }); // honeypot: silently accept bots
  const name = String(body?.name || '').trim().replace(/\s+/g, ' ').slice(0, 120);
  const email = String(body?.email || '').trim().toLowerCase().slice(0, 200);
  const page = String(body?.page || '').replace(/[^a-z]/g, '').slice(0, 20);
  if (name.length < 2) return json({ error: 'Please enter your full name.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
  const createdAt = new Date().toISOString();
  const record = {
    name, email, page,
    consent: Boolean(body?.consent),
    createdAt,
    country: request.headers.get('x-vercel-ip-country') || null,
  };
  const id = `${createdAt.replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}`;
  try {
    await put(`signups/${createdAt.slice(0, 7)}/${id}.json`, JSON.stringify(record), {
      access: 'private', contentType: 'application/json', addRandomSuffix: false,
    });
  } catch (err) {
    console.error('signup store failed', err);
    return json({ error: 'We could not save your details just now. Please try again.' }, 500);
  }
  return json({ ok: true });
}
