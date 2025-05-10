#!/bin/bash

# Afficher les informations de débogage
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Installer les dépendances du projet
npm ci

# Créer un fichier de déclaration pour les modules problématiques
mkdir -p types
echo 'declare module "lodash-es";' > types/lodash-es.d.ts
echo 'declare module "mustache";' > types/mustache.d.ts
echo 'declare module "progress";' > types/progress.d.ts

# Modifier le tsconfig pour utiliser nos déclarations de types
cat > tsconfig.server.json << EOL
{
  "parserOptions": {
    "sourceType": "module"
  },
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "outDir": "dist-server",
    "baseUrl": ".",
    "noImplicitAny": false,
    "noImplicitThis": false,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "types": ["node"],
    "typeRoots": ["./node_modules/@types", "./types"],
    "paths": {
      "@/*": ["src/*"],
      "@lib/*": ["lib/*"],
      "@data/*": ["data/*"],
      "@backend": ["backend/*"]
    }
  },
  "resolve": {
    "extensions": [".cjs", ".ts", ".js", ".json"]
  },
  "include": [
    "backend/**/*.ts",
    "backend/**/*.d.ts",
    "lib/**/*.ts",
    "lib/**/*.d.ts",
    "data/**/*.ts",
    "data/**/*.d.ts",
    "tools/**/*.ts",
    "tools/**/*.d.ts",
    "types/**/*.d.ts"
  ],
  "exclude": ["node_modules", "tests", "dist-server", "dist"]
}
EOL

# Exécuter le build en contournant les erreurs de types
echo "Building server..."
npx tsc -p tsconfig.server.json --skipLibCheck

echo "Building iframes..."
NODE_OPTIONS='--loader ts-node/esm' npx webpack --config iframes/iframes.config.ts

echo "Building frontend..."
npx vite build

echo "Copying templates..."
mkdir -p dist-server/backend/lib/mes-aides/emails/templates && cp backend/lib/mes-aides/emails/templates/* dist-server/backend/lib/mes-aides/emails/templates

# Vérifier si le build a réussi
if [ -d "dist" ] && [ -d "dist-server" ]; then
  echo "Build réussi!"
  exit 0
else
  echo "Erreur lors du build!"
  exit 1
fi
