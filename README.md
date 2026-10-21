# DICE

Source and static datasets recovered from the DICE Vercel production deployment.

## Development

Node.js 24 is used in production. Install dependencies with `npm install`.
Vercel configuration is in `vercel.json`; deploy the repository root.

## Data and secrets

Static datasets are in `data/`. Live signup records and voter-register uploads currently use private Vercel Blob storage. Private records and credentials must never be committed to this repository.

Required server environment variables: `BLOB_READ_WRITE_TOKEN`, `EXPORT_KEY`, `VR_UPLOAD_KEY`.

## Recovery

57 source files were recovered from production deployment `dpl_BUrmfu5cfBp1h1GWJqs3vGXzBQvG` and each was verified against its Vercel SHA-1 checksum. Files outside the uploaded deployment and historical Git commits are not available from that snapshot.
