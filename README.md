# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Configuration du backend

La météo réelle nécessite une clé OpenWeather API.

1. Copier `backend/.env.example` vers `backend/.env`.
2. Remplir la valeur `OPENWEATHER_API_KEY` avec votre clé OpenWeather.
3. Démarrer le backend depuis le dossier `backend` :
   ```bash
   npm run start:dev
   ```

Si la clé est manquante ou invalide, l’API retournera maintenant une erreur claire plutôt qu’une météo de secours.

## Déploiement sur Render

Pour Render, ne pas committer de fichier `.env` : les variables d’environnement doivent être définies dans l’interface Render ou via `render.yaml`.

### Variables Render backend

- `OPENWEATHER_API_KEY`
- `DB_TYPE=mysql`
- `DB_HOST=<host_mysql>`
- `DB_PORT=3306`
- `DB_USERNAME=<utilisateur_mysql>`
- `DB_PASSWORD=<mot_de_passe_mysql>`
- `DB_DATABASE=<nom_de_la_base>`
- `FRONTEND_ORIGIN=https://<ton-frontend>.onrender.com`
- `TYPEORM_SYNC=true|false`
- `TYPEORM_LOGGING=true|false`
- `REDIS_URL` si tu veux activer Redis sur le cache

> Si tu souhaites rester en SQLite pour le développement local, laisse `DB_TYPE` vide ou mets `sqlite` et garde `DATABASE_PATH=backend/db/locationdevoitures.sqlite`.

### Variables Render frontend

- `VITE_API_BASE_URL=https://<ton-backend>.onrender.com/api`

### Remarque

Le backend expose l’API sur `/api` et le frontend doit pointer vers `VITE_API_BASE_URL`.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
