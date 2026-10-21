import { getDb } from '../lib/db.js';

// GET /vr-data/<file>  (rewritten to /api/vr?f=<file>)
const ok = /^(summary|geo|st-\d\d)\.json$/;
export async function GET(request) {
  const f = new URL(request.url).searchParams.get('f') || '';
  if (!ok.test(f)) return new Response('Not found', { status: 404 });
  let rows;
  try { rows = await getDb()`SELECT body FROM data_documents WHERE path=${'vr/' + f}`; }
  catch { return new Response('Temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
  if (!rows.length) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  return new Response(JSON.stringify(rows[0].body), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } });
}
