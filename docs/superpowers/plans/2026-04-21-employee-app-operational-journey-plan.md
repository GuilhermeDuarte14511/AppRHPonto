# Employee App: Jornada Operacional e Autosserviço de Ponto Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** evoluir o `employee-app` para uma experiência operacional mais clara e confiável, cobrindo registro de ponto, explicação de revisão do RH, fluxo de justificativa/ajuste e comunicação operacional consolidada, sempre preservando o design móvel já existente.

**Architecture:** o rollout deve reaproveitar a navegação, os hooks e os serviços atuais do `employee-app`, adicionando uma camada de interpretação mobile baseada em dados já disponíveis (`timeRecords`, `justifications`, políticas, localizações e anexos). O foco é enriquecer a UX com view models derivados e seeds mais realistas antes de abrir mudança estrutural de schema.

**Tech Stack:** Expo Router, React Native, TypeScript, TanStack Query, Firebase/Data Connect, Vitest.

---

## File Structure Map

### Shared operational interpretation

- Create: `apps/employee-app/src/features/time-records/lib/time-record-operational-insights.ts`
- Create: `apps/employee-app/src/features/time-records/lib/time-record-operational-insights.test.ts`
- Modify: `apps/employee-app/src/features/time-records/lib/time-record-mobile.ts`
- Modify: `apps/employee-app/src/features/justifications/lib/justification-mobile.ts`

### Punch flow

- Modify: `apps/employee-app/src/features/home/components/home-screen.tsx`
- Modify: `apps/employee-app/src/features/time-records/hooks/use-register-time-record.ts`
- Modify: `apps/employee-app/src/features/time-records/components/punch-confirmation-screen.tsx`

### Time records visibility

- Modify: `apps/employee-app/src/features/time-records/components/time-records-screen.tsx`
- Modify: `apps/employee-app/src/features/time-records/components/time-record-detail-screen.tsx`

### Justifications and employee actions

- Modify: `apps/employee-app/src/features/justifications/components/new-justification-screen.tsx`
- Modify: `apps/employee-app/src/features/justifications/components/justification-detail-screen.tsx`
- Modify: `apps/employee-app/src/features/justifications/components/justifications-screen.tsx`

### Operational communication surfaces

- Modify: `apps/employee-app/src/features/action-center/components/action-center-screen.tsx`
- Modify: `apps/employee-app/src/features/action-center/lib/action-center-feed.ts`
- Modify: `apps/employee-app/src/features/profile/components/profile-screen.tsx`

### Seeds / mock realism

- Modify: `packages/time-records/src/infrastructure/repositories/mock-time-records-repository.ts`
- Modify: `packages/justifications/src/infrastructure/repositories/mock-justifications-repository.ts`

### Verification

- Create/Modify tests under:
  - `apps/employee-app/src/features/time-records/lib/*.test.ts`
  - `apps/employee-app/src/features/action-center/lib/*.test.ts`
  - `apps/employee-app/src/features/justifications/lib/*.test.ts` when applicable

---

## Task 1: Add Mobile Operational Insight Builders

**Files:**
- Create: `apps/employee-app/src/features/time-records/lib/time-record-operational-insights.ts`
- Create: `apps/employee-app/src/features/time-records/lib/time-record-operational-insights.test.ts`
- Modify: `apps/employee-app/src/features/time-records/lib/time-record-mobile.ts`

### Intent

Criar uma camada pura de interpretação para a UX do colaborador, derivando:

- motivo operacional da revisão;
- próximo passo da marcação;
- explicação de política;
- resumo de prontidão para registrar;
- recomendação de ação do colaborador.

- [ ] **Step 1: Write failing tests for the main operational states**

Cobrir pelo menos:

- batida válida dentro da regra;
- batida `pending_review` com divergência de local;
- batida `adjusted` com histórico preservado;
- batida `rejected` com recomendação de abrir justificativa;
- estado de punch `blocked` por política.

- [ ] **Step 2: Run the test to verify failure**

Run: `corepack pnpm --dir apps/employee-app test -- time-record-operational-insights.test.ts`

- [ ] **Step 3: Implement the insight builders**

Expor helpers com shape simples e reutilizável pela UI.

- [ ] **Step 4: Wire the new helpers into `time-record-mobile.ts`**

Evitar duplicação de labels e mensagens em várias telas.

- [ ] **Step 5: Run unit tests**

Run: `corepack pnpm --dir apps/employee-app test -- time-record-operational-insights.test.ts time-record-mobile.test.ts`

---

## Task 2: Upgrade the Punch Flow on Home and Confirmation

**Files:**
- Modify: `apps/employee-app/src/features/home/components/home-screen.tsx`
- Modify: `apps/employee-app/src/features/time-records/hooks/use-register-time-record.ts`
- Modify: `apps/employee-app/src/features/time-records/components/punch-confirmation-screen.tsx`

### Intent

Deixar o fluxo de bater ponto mais claro, com linguagem operacional e mais confiança para o colaborador.

- [ ] **Step 1: Add readiness and policy explanation blocks on the home screen**

Mostrar:

- status da política;
- próxima batida recomendada;
- checklist de prontidão;
- local detectado;
- o que acontece após enviar.

- [ ] **Step 2: Improve blocked/pending/allowed messaging**

Não depender só do texto bruto de `evaluation.description`.

- [ ] **Step 3: Enrich punch notes created on submit**

Registrar notas mais úteis para histórico e leitura posterior do colaborador.

- [ ] **Step 4: Upgrade the punch confirmation screen**

Explicar:

- status final da batida;
- local validado ou área mais próxima;
- motivo da revisão, quando houver;
- atalho para histórico/ajuste.

- [ ] **Step 5: Verify typecheck**

Run: `corepack pnpm --dir apps/employee-app typecheck`

---

## Task 3: Improve Time Record History and Detail for RH Transparency

**Files:**
- Modify: `apps/employee-app/src/features/time-records/components/time-records-screen.tsx`
- Modify: `apps/employee-app/src/features/time-records/components/time-record-detail-screen.tsx`

### Intent

Explicar melhor o que o RH está revisando e por quê.

- [ ] **Step 1: Upgrade history cards with operational summaries**

Cada item deve destacar:

- motivo resumido;
- ação recomendada;
- estado operacional;
- CTA mais claro para detalhe.

- [ ] **Step 2: Upgrade detail screen with operational interpretation**

Adicionar:

- leitura do status;
- motivo provável da revisão;
- o que o RH está olhando;
- qual ação faz sentido para o colaborador;
- contexto de política e local.

- [ ] **Step 3: Keep existing evidence areas**

Preservar foto, coordenadas, endereço e auditoria.

- [ ] **Step 4: Verify typecheck**

Run: `corepack pnpm --dir apps/employee-app typecheck`

---

## Task 4: Reduce Friction in Justification and Adjustment Flows

**Files:**
- Modify: `apps/employee-app/src/features/justifications/components/new-justification-screen.tsx`
- Modify: `apps/employee-app/src/features/justifications/components/justification-detail-screen.tsx`
- Modify: `apps/employee-app/src/features/justifications/components/justifications-screen.tsx`
- Modify: `apps/employee-app/src/features/justifications/lib/justification-mobile.ts`

### Intent

Fazer com que o colaborador abra justificativa com mais contexto e menos chance de erro.

- [ ] **Step 1: Make the new-justification flow more contextual**

Mostrar contexto da marcação e orientar o tipo de pedido.

- [ ] **Step 2: Add structured helper copy by request type**

Exemplos:

- falta de marcação;
- atraso;
- ausência;
- solicitação de ajuste.

- [ ] **Step 3: Improve detail screen for RH feedback comprehension**

Destacar:

- status operacional;
- devolutiva do RH;
- próxima ação esperada;
- relação com a jornada.

- [ ] **Step 4: Improve the justifications list if needed**

Dar mais leitura de status e prioridade sem mudar a navegação.

- [ ] **Step 5: Run relevant tests / typecheck**

Run: `corepack pnpm --dir apps/employee-app typecheck`

---

## Task 5: Strengthen Operational Communication Surfaces

**Files:**
- Modify: `apps/employee-app/src/features/action-center/components/action-center-screen.tsx`
- Modify: `apps/employee-app/src/features/action-center/lib/action-center-feed.ts`
- Modify: `apps/employee-app/src/features/profile/components/profile-screen.tsx`

### Intent

Melhorar a comunicação operacional do app sem criar um novo módulo.

- [ ] **Step 1: Evolve action center language and grouping**

Dar mais contexto para itens ligados a RH, revisão e jornada.

- [ ] **Step 2: Improve profile as an operational reference**

Mostrar:

- política aplicada;
- como a validação funciona;
- exigência de localização/foto;
- locais autorizados;
- efeitos práticos para o colaborador.

- [ ] **Step 3: Keep the current design system**

Nenhuma dessas mudanças deve parecer fora do app.

- [ ] **Step 4: Run unit tests for action-center grouping when applicable**

Run: `corepack pnpm --dir apps/employee-app test -- action-center-feed.test.ts action-center-groups.test.ts`

---

## Task 6: Refresh Seeds and Mock Data for Realistic Review States

**Files:**
- Modify: `packages/time-records/src/infrastructure/repositories/mock-time-records-repository.ts`
- Modify: `packages/justifications/src/infrastructure/repositories/mock-justifications-repository.ts`

### Intent

Garantir cenários mais realistas para desenvolvimento, revisão visual e testes.

- [ ] **Step 1: Add or refine time record seeds**

Cobrir:

- dentro da área;
- fora da área com revisão;
- bloqueado/pendente;
- ajustado;
- rejeitado;
- histórico mais completo por jornada.

- [ ] **Step 2: Add or refine justification seeds**

Cobrir:

- pendente;
- aprovada;
- rejeitada;
- ajuste contextual;
- anexos relevantes.

- [ ] **Step 3: Only open schema changes if implementation proves them necessary**

Se não houver gap real, manter rollout sem migration.

---

## Task 7: Full Verification

**Files:**
- All touched files above

### Intent

Fechar a frente com segurança e regressão mínima.

- [ ] **Step 1: Run focused employee-app tests**

Run: `corepack pnpm --dir apps/employee-app test -- time-record-mobile.test.ts action-center-feed.test.ts action-center-groups.test.ts`

- [ ] **Step 2: Run any new tests added for operational insights**

Run: `corepack pnpm --dir apps/employee-app test -- time-record-operational-insights.test.ts`

- [ ] **Step 3: Run typecheck**

Run: `corepack pnpm --dir apps/employee-app typecheck`

- [ ] **Step 4: Spot-check any affected admin/shared package tests if required by changes**

Only if shared package changes demand it.

---

## Self-Review

### Spec coverage

- Registro com mais clareza e confiança: Tasks 1 and 2.
- Entender o que o RH está revisando e por quê: Tasks 1 and 3.
- Pedir ajuste/justificativa com menos atrito: Task 4.
- Comunicação operacional consolidada: Task 5.
- Seeds mais realistas: Task 6.

### Scope check

- Restrito ao `employee-app` e dados de suporte.
- Preserva o design atual.
- Só abre mudança estrutural de dados se virar necessidade comprovada.

### Risk control

- Reaproveita hooks e navegação existentes.
- Mantém tipagem e testes como trava.
- Evita redesign total da aplicação.
