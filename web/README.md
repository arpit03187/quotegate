# QuoteGate web

Customer landing page plus the owner console.

```bash
cd web
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

- `/` product landing
- `/console` owner queue
- `/console/new` ingest tech notes
- `/console/jobs/[id]` approve / edit / reject + audit
