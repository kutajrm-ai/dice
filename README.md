# DICE

Election information website deployed at https://diceng.com.

## Development

Use Node.js 24 and run `npm ci`. Build with `node build.mjs && node arise-build.mjs`; Vercel deploys `public/` plus the API functions.

## Database

The `dice` Neon PostgreSQL database is connected through Vercel Marketplace on the Free plan in `iad1`. `db/schema.sql` defines server-only JSON datasets and signup records. The voter-register read/upload APIs and signup/export APIs use PostgreSQL. Static datasets remain in `data/` for the existing frontend and are also backed up in PostgreSQL.

Required server environment variables: `DATABASE_URL`, `EXPORT_KEY`, `VR_UPLOAD_KEY`. Keep credentials out of Git and browser code.

To import and verify the original datasets and Blob records, run `node --env-file=.env.local scripts/migrate-data.mjs`. This also requires `BLOB_READ_WRITE_TOKEN` and, when applicable, `OLD_SIGNUPS_BLOB_TOKEN`. Imports are repeatable and compare each saved JSON document against its source. Original Blob data is retained for recovery. Do not rerun the legacy import after making new voter-register edits in PostgreSQL, as it replaces datasets with the Blob copy.

## Recovery

57 source files were recovered from Vercel production deployment `dpl_BUrmfu5cfBp1h1GWJqs3vGXzBQvG` and verified against their Vercel SHA-1 checksums before import. The initial source snapshot is commit `5e462d14e38862861e2bf105822e55b764b67bc3`. Files outside that deployment and historical Git commits were not available from the snapshot. Private records and credentials are excluded from the repository.
