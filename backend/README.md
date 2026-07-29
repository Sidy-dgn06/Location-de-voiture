# Backend NestJS

## Commandes

- `npm install`
- `npm run start:dev`
- `npm run build`
- `npm run start:prod`

## Configuration

Le backend utilise les variables suivantes :

- `OPENWEATHER_API_KEY`
- `DATABASE_PATH` (ex: `backend/db/locationdevoitures.sqlite`)
- `TYPEORM_SYNC=true|false`
- `TYPEORM_LOGGING=true|false`
- `REDIS_URL` (optionnel)
- `PORT` (par défaut 4000)

## Démarrage

```bash
cd backend
npm install
npm run start:dev
```

Le backend écoute ensuite sur `http://localhost:4000` par défaut.
