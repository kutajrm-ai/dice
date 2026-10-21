import { getDb } from '../lib/db.js';

// POST /api/vr-ingest?f=summary.json   header x-key: VR_UPLOAD_KEY   body: the JSON file
const ok = /^(summary|geo|st-\d\d)\.json$/;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
export async function POST(request) {
  const secret = process.env.VR_UPLOAD_KEY || '';
  const key = request.headers.get('x-key') || '';
  if (!secret || key !== secret) return json({ error: 'Wrong upload key.' }, 401);
  const f = new URL(request.url).searchParams.get('f') || '';
  if (!ok.test(f)) return json({ error: 'Unexpected file name: ' + f }, 400);
  const body = await request.text();
  try { JSON.parse(body); } catch { return json({ error: f + ' is not valid JSON.' }, 400); }
  await getDb()`INSERT INTO data_documents(path, kind, body) VALUES (${'vr/' + f}, 'voter_register', ${body}::jsonb)
    ON CONFLICT(path) DO UPDATE SET body=excluded.body, updated_at=now()`;
  return json({ ok: true, f, bytes: body.length });
}
