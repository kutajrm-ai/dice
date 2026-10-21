import { list, get } from '@vercel/blob';

// GET /api/export?key=EXPORT_KEY  -> CSV of every signup
export async function GET(request) {
  const key = new URL(request.url).searchParams.get('key') || '';
  const secret = process.env.EXPORT_KEY || '';
  if (!secret || key.length !== secret.length || key !== secret) {
    return new Response('Unauthorized', { status: 401 });
  }
  const rows = [];
  let cursor;
  do {
    const page = await list({ prefix: 'signups/', cursor, limit: 1000 });
    for (const b of page.blobs) {
      const r = await get(b.pathname, { access: 'private' });
      if (r && r.statusCode === 200) {
        try { rows.push(JSON.parse(await new Response(r.stream).text())); } catch {}
      }
    }
    cursor = page.cursor;
  } while (cursor);
  rows.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const esc = (v) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const head = ['createdAt', 'name', 'email', 'consent', 'page', 'country'];
  const csv = [head.join(','), ...rows.map((r) => head.map((h) => esc(r[h])).join(','))].join('\n');
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="dice-signups.csv"', 'Cache-Control': 'no-store' },
  });
}
