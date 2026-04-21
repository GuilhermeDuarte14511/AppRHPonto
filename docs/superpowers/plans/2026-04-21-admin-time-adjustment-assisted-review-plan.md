# Admin Web: Ajuste de Ponto Assistido por Decisao Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** evoluir o `admin-web` de uma fila genérica de "marcações em revisão" para um fluxo de `revisão assistida por decisão`, com classificação de exceção, confiança, roteamento, ações individuais e lote seguro, sem sair do padrão visual já existente no projeto.

**Architecture:** a implementação deve reaproveitar o que já existe em `operations`, `time-records`, `notification-center-server` e `review-decision-dialog`. O primeiro rollout evita mudança estrutural profunda no schema e privilegia view models derivados a partir dos dados operacionais já disponíveis. O fluxo novo entra como evolução do `Inbox RH` e dos detalhes de marcação, não como uma área paralela do produto.

**Tech Stack:** Next.js 15, React 19, TanStack Query, TypeScript, Vitest, Playwright, Firebase/Data Connect via serviços já existentes, `@rh-ponto/ui`.

---

## File Structure Map

### Core derivation and query layer

- Modify: `apps/admin-web/src/features/operations/lib/operations-inbox-service.ts`
- Create: `apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.ts`
- Create: `apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.test.ts`
- Modify: `apps/admin-web/src/features/operations/lib/operations-inbox-query.ts`
- Modify: `apps/admin-web/src/features/operations/hooks/use-operations-inbox.ts`
- Modify: `apps/admin-web/src/shared/lib/notification-center-server.ts`

### Admin UI

- Modify: `apps/admin-web/src/features/operations/components/operations-inbox-view.tsx`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-case-list.tsx`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-case-detail-dialog.tsx`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-batch-review-bar.tsx`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-confidence-badge.tsx`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-routing-badge.tsx`
- Reuse / integrate: `apps/admin-web/src/shared/components/review-decision-dialog.tsx`
- Reuse / integrate: `apps/admin-web/src/features/time-records/components/time-record-details-dialog.tsx`

### Mutation / decision handling

- Modify: `apps/admin-web/src/features/time-records/hooks/use-time-record-mutations.ts`
- Create: `apps/admin-web/src/features/operations/hooks/use-assisted-review-decisions.ts`
- Create: `apps/admin-web/src/features/operations/lib/assisted-review-audit.ts`

### Verification

- Create: `apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.test.ts`
- Modify: `apps/admin-web/src/features/operations/lib/operations-inbox-service.test.ts`
- Create: `apps/admin-web/e2e/time-adjustment-assisted-review.spec.ts`

---

## Task 1: Add the Assisted Review Domain Builder

**Files:**
- Create: `apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.ts`
- Create: `apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.test.ts`
- Modify: `apps/admin-web/src/features/operations/lib/operations-inbox-query.ts`

### Intent

Introduzir um builder puro que transforme marcações `pending_review` em `casos assistidos`, contendo:

- tipo de exceção;
- prioridade;
- confiança;
- sugestão;
- motivo da sugestão;
- roteamento recomendado;
- elegibilidade para lote;
- impacto em fechamento/compliance.

- [ ] **Step 1: Write the failing tests for classification and routing**

Cobrir pelo menos estes cenários:

- `missing_punch` com alta confiança e elegível para lote;
- `incomplete_sequence` com confiança média;
- `outside_rule_window` com prioridade alta;
- `location_divergence` com confiança baixa e fora do lote.

Exemplo de shape esperado:

```ts
expect(result[0]).toMatchObject({
  exceptionType: 'missing_punch',
  confidence: 'high',
  recommendedAction: 'complete_with_expected_time',
  routingTarget: 'manager',
  batchEligible: true,
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack pnpm --dir apps/admin-web test -- time-adjustment-assisted-review.test.ts`  
Expected: FAIL for missing module or missing exports.

- [ ] **Step 3: Implement the minimal case builder**

Criar tipos explícitos, por exemplo:

```ts
export type AssistedReviewConfidence = 'high' | 'medium' | 'low';
export type AssistedReviewRoutingTarget = 'manager' | 'hr' | 'operations';
export type AssistedReviewExceptionType =
  | 'missing_punch'
  | 'incomplete_sequence'
  | 'outside_rule_window'
  | 'location_divergence';
```

E expor um builder como:

```ts
export const buildTimeAdjustmentAssistedReviewCases = (
  input: BuildTimeAdjustmentCasesInput,
) => AssistedReviewCase[];
```

- [ ] **Step 4: Enrich the builder with explicit reasons and UI-ready fields**

Cada caso deve sair com:

- `title`
- `description`
- `confidenceReason`
- `suggestionReason`
- `closureImpact`
- `batchGroupKey`
- `decisionSummary`

Isso reduz lógica de apresentação espalhada em componentes.

- [ ] **Step 5: Wire the builder into the operations query**

Integrar o builder em `operations-inbox-query.ts`, enriquecendo os itens de `time-record` com metadados assistidos.

- [ ] **Step 6: Run domain tests**

Run: `corepack pnpm --dir apps/admin-web test -- time-adjustment-assisted-review.test.ts operations-inbox-service.test.ts`  
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.ts apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.test.ts apps/admin-web/src/features/operations/lib/operations-inbox-query.ts apps/admin-web/src/features/operations/lib/operations-inbox-service.test.ts
git commit -m "feat: add assisted time adjustment case builder"
```

---

## Task 2: Evolve the Operations Inbox Data Model

**Files:**
- Modify: `apps/admin-web/src/features/operations/lib/operations-inbox-service.ts`
- Modify: `apps/admin-web/src/features/operations/hooks/use-operations-inbox.ts`
- Modify: `apps/admin-web/src/shared/lib/notification-center-server.ts`

### Intent

Fazer o `Inbox RH` deixar de representar marcações apenas como `time-record` genérico e passar a carregar campos de decisão assistida no payload consumido pela UI e pelas notificações.

- [ ] **Step 1: Extend inbox item types to support assisted review**

Adicionar ao `OperationsInboxItem` algo como:

```ts
assistedReview?: {
  exceptionType: AssistedReviewExceptionType;
  confidence: AssistedReviewConfidence;
  recommendedAction: string;
  routingTarget: AssistedReviewRoutingTarget;
  batchEligible: boolean;
  suggestionReason: string;
  closureImpact: 'none' | 'payroll' | 'compliance' | 'payroll_and_compliance';
};
```

- [ ] **Step 2: Update summary counters for the new workflow**

Incluir agregados como:

- total de casos elegíveis para lote;
- total roteado para RH;
- total de baixa confiança;
- total com impacto em fechamento.

Sem remover os cartões já existentes de `total`, `highPriority` e `dueSoon`.

- [ ] **Step 3: Keep notifications aligned with the new semantics**

Em `notification-center-server.ts`, derivar títulos/descritivos mais específicos para marcações, por exemplo:

```ts
title: 'Saída esquecida com sugestão automática',
description: `${employeeName} possui marcação com alta confiança para revisão em lote.`,
```

- [ ] **Step 4: Preserve backward compatibility for other inbox categories**

Justificativas, férias, documentos, onboarding e devices não devem quebrar. O enriquecimento deve ser opcional e concentrado nos itens de `time-record`.

- [ ] **Step 5: Verify typecheck**

Run: `corepack pnpm --dir apps/admin-web typecheck`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/admin-web/src/features/operations/lib/operations-inbox-service.ts apps/admin-web/src/features/operations/hooks/use-operations-inbox.ts apps/admin-web/src/shared/lib/notification-center-server.ts
git commit -m "feat: enrich operations inbox with assisted review metadata"
```

---

## Task 3: Build the Assisted Review Inbox UI on Top of Existing Design Patterns

**Files:**
- Modify: `apps/admin-web/src/features/operations/components/operations-inbox-view.tsx`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-case-list.tsx`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-confidence-badge.tsx`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-routing-badge.tsx`

### Intent

Atualizar a experiência do `Inbox RH` sem fugir do design do projeto, reutilizando `PageHeader`, `StatCard`, `Card`, `Badge`, filtros em card e linguagem visual atual.

- [ ] **Step 1: Add assisted-review summary cards using the current visual system**

Exemplos:

- `Elegíveis para lote`
- `Baixa confiança`
- `Com impacto no fechamento`

Todos usando `StatCard` e o mesmo tom visual já adotado na página atual.

- [ ] **Step 2: Replace generic time-record cards with assisted case cards**

Cada card/list item deve mostrar:

- tipo de exceção;
- colaborador;
- prioridade;
- confiança;
- sugestão;
- roteamento;
- impacto;
- CTA para abrir contexto.

Sem introduzir um layout estranho ao resto do admin.

- [ ] **Step 3: Add filter controls inside the existing filter-card pattern**

Adicionar filtros como:

- tipo de exceção;
- confiança;
- roteamento;
- elegível para lote;
- impacto em fechamento.

Usar o mesmo padrão de inputs/selects presente em `time-records-list-view.tsx`.

- [ ] **Step 4: Group assisted cases separately from non-assisted inbox categories**

O agrupamento recomendado:

- primeiro a seção `Ajustes de ponto assistidos`;
- depois os demais grupos já existentes do inbox.

Isso evita diluir o novo fluxo no meio das outras pendências.

- [ ] **Step 5: Add empty and error handling without custom one-off states**

Continuar usando `EmptyState`, `ErrorState` e `TablePageSkeleton` compartilhados.

- [ ] **Step 6: Run web verification**

Run: `corepack pnpm --dir apps/admin-web typecheck`  
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/admin-web/src/features/operations/components/operations-inbox-view.tsx apps/admin-web/src/features/operations/components/time-adjustment-case-list.tsx apps/admin-web/src/features/operations/components/time-adjustment-confidence-badge.tsx apps/admin-web/src/features/operations/components/time-adjustment-routing-badge.tsx
git commit -m "feat: add assisted review experience to operations inbox"
```

---

## Task 4: Add the Assisted Review Detail Flow

**Files:**
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-case-detail-dialog.tsx`
- Reuse / integrate: `apps/admin-web/src/features/time-records/components/time-record-details-dialog.tsx`
- Reuse / integrate: `apps/admin-web/src/shared/components/review-decision-dialog.tsx`

### Intent

Dar ao admin um detalhe de caso orientado por decisão, aproveitando o que já existe no detalhe de marcação e adicionando explicabilidade.

- [ ] **Step 1: Create a dedicated assisted-review detail dialog**

O dialog deve exibir:

- resumo da exceção;
- sinais usados na sugestão;
- impacto estimado;
- roteamento recomendado;
- sequência relevante da jornada;
- atalho para evidências e geolocalização.

Pode compor internamente o `TimeRecordDetailsDialog` ou reaproveitar blocos dele, mas o foco precisa estar na decisão.

- [ ] **Step 2: Add decision CTA states using the existing review dialog pattern**

Reaproveitar `review-decision-dialog.tsx` para ações como:

- aprovar ajuste sugerido;
- rejeitar;
- solicitar justificativa;
- escalar.

- [ ] **Step 3: Keep the original time record context accessible**

O admin não pode perder:

- foto;
- localização;
- tipo/origem/status;
- observações;
- política de presença.

Se necessário, abrir o detalhe tradicional a partir do novo dialog, mas não duplicar tudo sem necessidade.

- [ ] **Step 4: Add route-safe state handling**

Ao abrir/fechar dialogs:

- preservar seleção atual;
- evitar perda de filtro;
- manter foco na lista depois da ação.

- [ ] **Step 5: Verify typecheck**

Run: `corepack pnpm --dir apps/admin-web typecheck`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/admin-web/src/features/operations/components/time-adjustment-case-detail-dialog.tsx apps/admin-web/src/shared/components/review-decision-dialog.tsx apps/admin-web/src/features/time-records/components/time-record-details-dialog.tsx
git commit -m "feat: add assisted review case detail dialog"
```

---

## Task 5: Implement Individual and Batch Decision Actions

**Files:**
- Create: `apps/admin-web/src/features/operations/hooks/use-assisted-review-decisions.ts`
- Create: `apps/admin-web/src/features/operations/components/time-adjustment-batch-review-bar.tsx`
- Modify: `apps/admin-web/src/features/time-records/hooks/use-time-record-mutations.ts`
- Create: `apps/admin-web/src/features/operations/lib/assisted-review-audit.ts`

### Intent

Ligar a camada de decisão assistida às mutations já existentes de ajuste, sem quebrar cache nem trilha de auditoria.

- [ ] **Step 1: Create a focused hook for assisted-review decisions**

O hook deve encapsular:

- decisão individual;
- decisão em lote;
- invalidação de queries do inbox, time-records, dashboard, audit e payroll.

Pode reaproveitar `useAdjustTimeRecord`, mas a UI do inbox não deve conhecer detalhes internos demais da mutation de marcação.

- [ ] **Step 2: Add a batch review bar for selected high-confidence items**

Criar uma barra/toolbar compatível com o estilo do admin para:

- selecionar vários itens;
- mostrar contagem;
- aprovar em lote;
- limpar seleção.

Restrições:

- só habilitar lote para itens `batchEligible`;
- impedir mistura de casos incompatíveis no mesmo bloco.

- [ ] **Step 3: Record audit-friendly decision metadata**

Mesmo sem mexer profundamente no schema neste ciclo, centralizar a montagem do payload de auditoria em `assisted-review-audit.ts`, por exemplo:

```ts
{
  source: 'operations_assisted_review',
  recommendedAction,
  confidence,
  routingTarget,
  reviewerNotes,
}
```

- [ ] **Step 4: Keep cache updates deterministic**

Depois da decisão:

- remover/atualizar o caso no inbox;
- refletir novo estado em `timeRecords`;
- atualizar contadores do dashboard;
- invalidar auditoria e payroll quando houver impacto.

- [ ] **Step 5: Verify mutations**

Run: `corepack pnpm --dir apps/admin-web typecheck`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/admin-web/src/features/operations/hooks/use-assisted-review-decisions.ts apps/admin-web/src/features/operations/components/time-adjustment-batch-review-bar.tsx apps/admin-web/src/features/time-records/hooks/use-time-record-mutations.ts apps/admin-web/src/features/operations/lib/assisted-review-audit.ts
git commit -m "feat: add assisted review decisions and batch actions"
```

---

## Task 6: Verify End-to-End Behavior and Regression Safety

**Files:**
- Create: `apps/admin-web/e2e/time-adjustment-assisted-review.spec.ts`
- Modify: `apps/admin-web/src/features/operations/lib/operations-inbox-service.test.ts`
- Modify: `apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.test.ts`

### Intent

Garantir que o novo fluxo não seja só visualmente correto, mas também seguro em classificação, roteamento e decisão.

- [ ] **Step 1: Add Playwright coverage for the assisted-review path**

Cobrir pelo menos:

- acesso ao `Inbox RH`;
- presença dos filtros assistidos;
- abertura do detalhe do caso;
- seleção de itens elegíveis;
- CTA de lote visível apenas para casos compatíveis.

- [ ] **Step 2: Add unit coverage for decision edge cases**

Casos importantes:

- `location_divergence` nunca habilita lote no rollout inicial;
- itens de baixa confiança nunca entram na barra de aprovação em lote;
- impacto em fechamento aumenta prioridade;
- roteamento para RH vence roteamento para gestor quando houver risco de compliance.

- [ ] **Step 3: Run full verification**

Run: `corepack pnpm --dir apps/admin-web test -- operations-inbox-service.test.ts time-adjustment-assisted-review.test.ts`  
Expected: PASS.

Run: `corepack pnpm --dir apps/admin-web typecheck`  
Expected: PASS.

Run: `corepack pnpm --dir apps/admin-web exec playwright test e2e/time-adjustment-assisted-review.spec.ts --project=chromium`  
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/admin-web/e2e/time-adjustment-assisted-review.spec.ts apps/admin-web/src/features/operations/lib/operations-inbox-service.test.ts apps/admin-web/src/features/operations/lib/time-adjustment-assisted-review.test.ts
git commit -m "test: cover assisted time adjustment review flow"
```

---

## Self-Review

### Spec coverage

- Classificação de exceção: coberta em Tasks 1 e 2.
- Confiança, explicabilidade e roteamento: cobertos em Tasks 1, 2 e 6.
- Inbox RH assistido: coberto em Tasks 2 e 3.
- Detalhe de caso e decisão: coberto em Task 4.
- Lote seguro: coberto em Task 5.
- Reuso do design existente: embutido nas Tasks 3 e 4.

### Placeholder scan

- Nenhum `TODO` ou `TBD`.
- Todas as tarefas possuem arquivos e objetivos explícitos.

### Scope check

- O plano fica restrito ao `admin-web`.
- Não exige redesenho completo do produto.
- Não depende de schema novo para o primeiro rollout.

### Risk control

- Reaproveita dialogs e padrões atuais.
- Mantém compatibilidade com as outras categorias do inbox.
- Restringe lote aos casos de alta confiança.
