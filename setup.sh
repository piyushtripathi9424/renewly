#!/bin/bash
set -e

# Setup root files
cat <<EOF > pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
EOF

cat <<EOF > turbo.json
{
  "\$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!-dist/**/*.map"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
EOF

cat <<EOF > package.json
{
  "name": "renewly",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write \\"**/*.{ts,tsx,md,json}\\"",
    "clean": "turbo run clean && rm -rf node_modules apps/*/node_modules packages/*/node_modules",
    "check": "pnpm lint && pnpm typecheck && pnpm test",
    "db:migrate": "pnpm --filter api db:migrate",
    "db:push": "pnpm --filter api db:push",
    "db:generate": "pnpm --filter api db:generate",
    "db:seed": "pnpm --filter api db:seed",
    "db:studio": "pnpm --filter api db:studio",
    "prepare": "husky"
  },
  "devDependencies": {
    "turbo": "latest",
    "prettier": "^3.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "typescript": "^5.0.0"
  },
  "packageManager": "pnpm@9.15.4"
}
EOF

cat <<EOF > .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
EOF

cat <<EOF > commitlint.config.js
module.exports = { extends: ['@commitlint/config-conventional'] };
EOF

mkdir -p .vscode
cat <<EOF > .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.configFile": "apps/web/vite.config.ts"
}
EOF

cat <<EOF > .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "Prisma.prisma",
    "github.vscode-github-actions",
    "firsttris.vscode-jest-runner"
  ]
}
EOF

mkdir -p .github/workflows
cat <<EOF > .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Typecheck
        run: pnpm typecheck
      - name: Build
        run: pnpm build
      - name: Test
        run: pnpm test
EOF

# Shared Packages
mkdir -p packages/{ui,types,validation,config,constants}/src

# config
cat <<EOF > packages/config/package.json
{
  "name": "@renewly/config",
  "version": "1.0.0",
  "main": "index.js"
}
EOF
cat <<EOF > packages/config/tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true
  }
}
EOF

# types
cat <<EOF > packages/types/package.json
{
  "name": "@renewly/types",
  "version": "1.0.0",
  "main": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF
cat <<EOF > packages/types/tsconfig.json
{
  "extends": "@renewly/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
EOF
echo "export type Dummy = {};" > packages/types/src/index.ts

# validation
cat <<EOF > packages/validation/package.json
{
  "name": "@renewly/validation",
  "version": "1.0.0",
  "main": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc"
  },
  "dependencies": {
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF
cat <<EOF > packages/validation/tsconfig.json
{
  "extends": "@renewly/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
EOF
echo 'import { z } from "zod"; export const Schema = z.object({});' > packages/validation/src/index.ts

# constants
cat <<EOF > packages/constants/package.json
{
  "name": "@renewly/constants",
  "version": "1.0.0",
  "main": "src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF
cat <<EOF > packages/constants/tsconfig.json
{
  "extends": "@renewly/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
EOF
echo "export const CONSTANT = 1;" > packages/constants/src/index.ts

# ui
cat <<EOF > packages/ui/package.json
{
  "name": "@renewly/ui",
  "version": "1.0.0",
  "main": "src/index.tsx",
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
EOF
cat <<EOF > packages/ui/tsconfig.json
{
  "extends": "@renewly/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
EOF
echo 'export const Button = () => <button>Hello</button>;' > packages/ui/src/index.tsx

# Create Web App
mkdir -p apps
cd apps
if [ ! -d "web" ]; then
  pnpm create vite web --template react-ts
fi
cd web
npm i tailwindcss@4.0.0-beta.8 @tailwindcss/vite@4.0.0-beta.8
npm i -D vitest @testing-library/react @testing-library/dom jsdom
npm i @renewly/ui@workspace:* @renewly/types@workspace:* @renewly/validation@workspace:* @renewly/constants@workspace:*

cat <<EOF > vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
});
EOF

cat <<EOF > src/index.css
@import "tailwindcss";
@theme {
  --color-primary: #007bff;
}
EOF

cat <<EOF > package.json
{
  "name": "web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@renewly/ui": "workspace:*",
    "@renewly/types": "workspace:*",
    "@renewly/validation": "workspace:*",
    "@renewly/constants": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "tailwindcss": "4.0.0-beta.8",
    "@tailwindcss/vite": "4.0.0-beta.8",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/dom": "^9.0.0",
    "jsdom": "^23.0.0"
  }
}
EOF

cd ../api

# Install NestJS in a temp directory and copy files safely without overriding our prisma setup
if [ ! -f "src/main.ts" ]; then
  cd ..
  npx @nestjs/cli new api-temp --strict --package-manager npm --skip-git
  cd api-temp
  cp -r src test tsconfig.json tsconfig.build.json nest-cli.json ../api/
  cd ..
  rm -rf api-temp
  cd api
  
  npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs zod @nestjs/swagger
  npm install -D @nestjs/testing @types/express @types/jest @types/supertest jest source-map-support supertest ts-jest
  npm install @renewly/types@workspace:* @renewly/validation@workspace:* @renewly/constants@workspace:*

  # Merge package.json scripts with jq or just manually overwrite with a combined one
  cat <<EOF > package.json
{
  "name": "api",
  "version": "1.0.0",
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset --force",
    "db:studio": "prisma studio",
    "db:format": "prisma format",
    "db:validate": "prisma validate",
    "build": "nest build",
    "format": "prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"",
    "start": "nest start",
    "dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typecheck": "tsc --noEmit"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@prisma/client": "^5.10.0",
    "@renewly/constants": "workspace:*",
    "@renewly/types": "workspace:*",
    "@renewly/validation": "workspace:*",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.0.0",
    "@types/supertest": "^6.0.0",
    "jest": "^29.5.0",
    "prisma": "^5.10.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.0.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\\\.spec\\\\.ts$",
    "transform": {
      "^.+\\\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
EOF
fi

cd ../../
pnpm config set ignore-scripts false
pnpm install

echo "Setup script completed."
