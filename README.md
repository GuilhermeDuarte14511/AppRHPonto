# App RH Ponto

Monorepo inicial do MVP de controle de ponto com foco no administrativo web e base pronta para apps Expo.

## Estrutura

- `apps/admin-web`: painel administrativo em Next.js
- `apps/employee-app`: app do colaborador em Expo Router
- `apps/kiosk-app`: app kiosk/tablet em Expo Router
- `packages/*`: domínio, integrações, UI e configurações compartilhadas

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm format`

## Apps

- `apps/admin-web`
- `apps/employee-app`
- `apps/kiosk-app`

## Packages compartilhados

- `core`, `config`, `types`, `validations`, `ui`
- `auth`, `employees`, `work-schedules`, `time-records`
- `justifications`, `devices`, `audit`
- `api-client`, `firebase`

## Credenciais mockadas

- Admin: `admin@empresa.com` / `admin123`
- Employee: `employee@empresa.com` / `employee123`
- Kiosk: `kiosk@empresa.com` / `kiosk123`

## Firebase

Copie `.env.example` e preencha as variáveis `NEXT_PUBLIC_*` e `EXPO_PUBLIC_*` quando for conectar Firebase Auth, Data Connect e Storage.

## Seed do Data Connect

- Emulator: `corepack pnpm dataconnect:seed`
- Remoto: `corepack pnpm dataconnect:seed:remote`

No PowerShell, se você tiver usado o emulator antes, remova a variável da sessão atual antes do seed remoto:

- `Remove-Item Env:DATA_CONNECT_EMULATOR_HOST -ErrorAction SilentlyContinue`

Para seed remoto, defina `GOOGLE_APPLICATION_CREDENTIALS` com o JSON da service account:

- `$env:GOOGLE_APPLICATION_CREDENTIALS="D:\\caminho\\service-account.json"`
