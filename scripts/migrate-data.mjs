import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { list, get } from '@vercel/blob';
import { getDb } from '../lib/db.js';

const sql = getDb();
const schema = await fs.readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
for (const statement of schema.split(';').map(s => s.trim()).filter(Boolean)) await sql.query(statement);
let staticFiles = 0, blobFiles = 0, signups = 0;
async function document(path, kind, body) {
  await sql`INSERT INTO data_documents(path, kind, body) VALUES (${path}, ${kind}, ${JSON.stringify(body)}::jsonb)
    ON CONFLICT(path) DO UPDATE SET kind=excluded.kind, body=excluded.body, updated_at=now()`;
  const [saved] = await sql`SELECT body FROM data_documents WHERE path=${path}`;
  assert.deepEqual(saved.body, body, `Database verification failed: ${path}`);
}
for (const name of await fs.readdir(new URL('../data/', import.meta.url))) {
  if (!name.endsWith('.json')) continue;
  await document(`data/${name}`, 'static', JSON.parse(await fs.readFile(new URL(`../data/${name}`, import.meta.url), 'utf8')));
  staticFiles++;
}
const tokens = [...new Set([process.env.BLOB_READ_WRITE_TOKEN, process.env.OLD_SIGNUPS_BLOB_TOKEN].filter(Boolean))];
for (const [store, token] of tokens.entries()) {
  let cursor;
  do {
    const page = await list({ token, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      const result = await get(blob.pathname, { token, access: 'private' });
      if (!result || result.statusCode !== 200) throw new Error(`Could not read ${blob.pathname}`);
      const text = await new Response(result.stream).text();
      const body = JSON.parse(text);
      if (blob.pathname.startsWith('signups/')) {
        const source = `${store}/${blob.pathname}`;
        await sql`INSERT INTO signups(source_path, data, created_at) VALUES (${source}, ${JSON.stringify(body)}::jsonb, ${body.createdAt}::timestamptz)
          ON CONFLICT(source_path) DO NOTHING`;
        const [saved] = await sql`SELECT data FROM signups WHERE source_path=${source}`;
        assert.deepEqual(saved.data, body);
        signups++;
      } else if (blob.pathname.startsWith('vr/')) {
        await document(blob.pathname, 'voter_register', body);
        blobFiles++;
      } else throw new Error(`Unmapped Blob data: ${blob.pathname}`);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
}
console.log(JSON.stringify({verifiedStaticDatasets: staticFiles, verifiedVoterRegisterFiles: blobFiles, verifiedSignups: signups}));
