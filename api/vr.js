import { get } from '@vercel/blob';

// GET /vr-data/<file>  (rewritten to /api/vr?f=<file>)
const ok = /^(summary|geo|st-\d\d)\.json$/;
export async function GET(request) {
  const f = new URL(request.url).searchParams.get('f') || '';
  if (!ok.test(f)) return new Response('Not found', { status: 404 });
  let r;
  try { r = await get('vr/' + f, { access: 'private' }); } catch { r = null; }
  if (!r || r.statusCode !== 200) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  return new Response(r.stream, { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' } });
}
