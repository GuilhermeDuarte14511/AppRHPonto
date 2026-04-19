# Phase 1: Inbox RH e Central de Pendências do Colaborador Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** entregar a primeira fase do novo fluxo operacional, com inbox do RH no `admin-web`, central de pendências no `employee-app`, ajuste contextual de ponto e leitura em lote de notificações.

**Architecture:** a fase 1 evita mexer profundamente no schema, privilegiando agregações derivadas sobre dados já existentes. O `admin-web` recebe uma nova capacidade de orquestração operacional apoiada em serviços server-side já usados pelo dashboard, enquanto o `employee-app` ganha uma superfície única de ação reaproveitando notificações, férias, documentos, justificativas e marcações.

**Tech Stack:** Next.js 15, React 19, TanStack Query, Expo Router, React Native, Firebase Data Connect, Vitest, Playwright, TypeScript.

---

## File Structure Map

### Admin-web

- Create: `apps/admin-web/src/app/(protected)/operations/page.tsx`
- Create: `apps/admin-web/src/app/(protected)/operations/loading.tsx`
- Create: `apps/admin-web/src/features/operations/components/operations-inbox-view.tsx`
- Create: `apps/admin-web/src/features/operations/hooks/use-operations-inbox.ts`
- Create: `apps/admin-web/src/features/operations/lib/operations-inbox-service.ts`
- Create: `apps/admin-web/src/features/operations/lib/operations-inbox-service.test.ts`
- Modify: `apps/admin-web/src/shared/layout/sidebar-nav.tsx`
- Modify: `apps/admin-web/src/features/dashboard/components/dashboard-overview.tsx`
- Modify: `apps/admin-web/src/shared/lib/notification-center-server.ts`

### Employee-app

- Create: `apps/employee-app/app/action-center.tsx`
- Create: `apps/employee-app/src/features/action-center/components/action-center-screen.tsx`
- Create: `apps/employee-app/src/features/action-center/lib/action-center-groups.ts`
- Modify: `apps/employee-app/src/features/home/components/home-screen.tsx`
- Modify: `apps/employee-app/src/features/time-records/components/time-record-detail-screen.tsx`
- Modify: `apps/employee-app/src/features/justifications/components/new-justification-screen.tsx`
- Modify: `apps/employee-app/src/features/notifications/hooks/use-employee-notifications.ts`
- Modify: `apps/employee-app/src/features/notifications/components/notifications-screen.tsx`
- Modify: `apps/employee-app/src/shared/lib/employee-self-service-api.ts`
- Modify: `apps/employee-app/src/features/time-records/lib/time-record-mobile.ts`

### Data Connect

- Create: `dataconnect/example/employee-notifications-batch.gql`
- Modify: `packages/api-client/src/data-connect/generated/*` via `dataconnect:generate`

### Verification

- Create: `apps/admin-web/e2e/operations-inbox.spec.ts`

## Task 1: Add Employee Notification Batch Read Support

**Files:**
- Create: `dataconnect/example/employee-notifications-batch.gql`
- Modify: `apps/employee-app/src/shared/lib/employee-self-service-api.ts`
- Modify: `apps/employee-app/src/features/notifications/hooks/use-employee-notifications.ts`
- Test: `corepack pnpm dataconnect:generate`

- [ ] **Step 1: Add a dedicated Data Connect mutation for batch notification read**

```graphql
mutation MarkEmployeeNotificationsAsRead($userId: UUID!) @auth(level: USER, insecureReason: "Operação do app do colaborador para limpar notificações pendentes.") {
  adminNotification_updateMany(
    where: {
      recipientUserId: { eq: $userId }
      status: { eq: "unread" }
    }
    data: {
      status: "read"
      readAt_expr: "request.time"
      updatedAt_expr: "request.time"
    }
  ) {
    count
  }
}
```

- [ ] **Step 2: Generate the SDK and verify the new mutation is available**

Run: `corepack pnpm dataconnect:generate`  
Expected: command completes and regenerates `packages/api-client/src/data-connect/generated` without compiler errors.

- [ ] **Step 3: Add a batch-read helper in the employee self-service API**

```ts
import { markEmployeeNotificationsAsRead } from '@rh-ponto/api-client/generated';

export const markAllEmployeeNotificationsRead = async (userId: string): Promise<void> => {
  await markEmployeeNotificationsAsRead(getAppDataConnect(), { userId });
};
```

- [ ] **Step 4: Expose a dedicated React Query mutation hook**

```ts
export const useMarkAllEmployeeNotificationsRead = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllEmployeeNotificationsRead(userId as string),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationsKey(userId) });
    },
  });
};
```

- [ ] **Step 5: Run typecheck for the employee app**

Run: `corepack pnpm --dir apps/employee-app typecheck`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add dataconnect/example/employee-notifications-batch.gql apps/employee-app/src/shared/lib/employee-self-service-api.ts apps/employee-app/src/features/notifications/hooks/use-employee-notifications.ts packages/api-client/src/data-connect/generated
git commit -m "feat: add employee notification batch read"
```

## Task 2: Build the Admin Operational Inbox Service

**Files:**
- Create: `apps/admin-web/src/features/operations/lib/operations-inbox-service.ts`
- Create: `apps/admin-web/src/features/operations/lib/operations-inbox-service.test.ts`
- Modify: `apps/admin-web/src/shared/lib/notification-center-server.ts`
- Test: `apps/admin-web/src/features/operations/lib/operations-inbox-service.test.ts`

- [ ] **Step 1: Write the failing test for inbox aggregation**

```ts
import { describe, expect, it } from 'vitest';
import { buildOperationsInbox } from './operations-inbox-service';

describe('buildOperationsInbox', () => {
  it('groups pending items by category and sorts by priority then date', () => {
    const result = buildOperationsInbox({
      pendingTimeRecords: [
        { id: 'tr-1', employeeName: 'Ana', recordedAt: '2026-04-18T08:00:00.000Z', status: 'pending_review' },
      ],
      pendingJustifications: [
        { id: 'jus-1', employeeName: 'Bruno', createdAt: '2026-04-18T09:00:00.000Z', type: 'late' },
      ],
      pendingVacations: [
        { id: 'vac-1', employeeName: 'Carla', requestedAt: '2026-04-18T07:00:00.000Z' },
      ],
      blockedOnboardingTasks: [],
      inactiveDevices: [],
    });

    expect(result.summary.total).toBe(3);
    expect(result.items[0]?.category).toBe('time-record');
    expect(result.groups.find((group) => group.category === 'vacation')?.count).toBe(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack pnpm --dir apps/admin-web test -- operations-inbox-service.test.ts`  
Expected: FAIL with `Cannot find module './operations-inbox-service'` or missing export.

- [ ] **Step 3: Implement the minimal inbox builder**

```ts
export interface OperationsInboxItem {
  id: string;
  category: 'time-record' | 'justification' | 'vacation' | 'onboarding' | 'device';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  href: string;
  occurredAt: string;
}

export const buildOperationsInbox = (input: BuildOperationsInboxInput) => {
  const items: OperationsInboxItem[] = [
    ...input.pendingTimeRecords.map((record) => ({
      id: record.id,
      category: 'time-record',
      priority: 'high',
      title: `Marcação em revisão: ${record.employeeName}`,
      description: 'Exige validação antes do fechamento.',
      href: '/time-records',
      occurredAt: record.recordedAt,
    })),
  ];

  const orderedItems = items.sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));

  return {
    summary: { total: orderedItems.length },
    items: orderedItems,
    groups: [
      { category: 'time-record', count: orderedItems.filter((item) => item.category === 'time-record').length },
    ],
  };
};
```

- [ ] **Step 4: Expand the implementation to cover all phase-1 categories**

```ts
const priorityWeight = { high: 3, medium: 2, low: 1 } as const;

const compareInboxItems = (left: OperationsInboxItem, right: OperationsInboxItem) =>
  priorityWeight[right.priority] - priorityWeight[left.priority] || right.occurredAt.localeCompare(left.occurredAt);

const createDeviceItem = (device: InactiveDeviceSnapshot): OperationsInboxItem => ({
  id: device.id,
  category: 'device',
  priority: 'low',
  title: `Dispositivo inativo: ${device.name}`,
  description: device.locationName ? `Último contexto: ${device.locationName}.` : 'Dispositivo sem local associado.',
  href: '/devices',
  occurredAt: device.lastSyncAt ?? new Date(0).toISOString(),
});
```

- [ ] **Step 5: Run the test again**

Run: `corepack pnpm --dir apps/admin-web test -- operations-inbox-service.test.ts`  
Expected: PASS.

- [ ] **Step 6: Reuse the inbox builder inside the notification derivation layer**

```ts
import { buildOperationsInbox } from '@/features/operations/lib/operations-inbox-service';

const inbox = buildOperationsInbox({
  pendingTimeRecords: data.timeRecords,
  pendingJustifications: data.justifications,
  pendingVacations: data.vacationRequests,
  blockedOnboardingTasks: data.onboardingTasks,
  inactiveDevices: data.devices,
});
```

- [ ] **Step 7: Commit**

```bash
git add apps/admin-web/src/features/operations/lib/operations-inbox-service.ts apps/admin-web/src/features/operations/lib/operations-inbox-service.test.ts apps/admin-web/src/shared/lib/notification-center-server.ts
git commit -m "feat: add admin operations inbox service"
```

## Task 3: Add the Admin Operational Inbox Page and Navigation

**Files:**
- Create: `apps/admin-web/src/app/(protected)/operations/page.tsx`
- Create: `apps/admin-web/src/app/(protected)/operations/loading.tsx`
- Create: `apps/admin-web/src/features/operations/hooks/use-operations-inbox.ts`
- Create: `apps/admin-web/src/features/operations/components/operations-inbox-view.tsx`
- Modify: `apps/admin-web/src/shared/layout/sidebar-nav.tsx`
- Modify: `apps/admin-web/src/features/dashboard/components/dashboard-overview.tsx`
- Test: `apps/admin-web/e2e/operations-inbox.spec.ts`

- [ ] **Step 1: Create the query hook for the inbox data**

```ts
export const useOperationsInbox = () => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: ['operations-inbox'],
    queryFn: getOperationsInbox,
    enabled,
  });
};
```

- [ ] **Step 2: Create the inbox page and loading shell**

```ts
import { OperationsInboxView } from '@/features/operations/components/operations-inbox-view';

const OperationsPage = () => <OperationsInboxView />;

export default OperationsPage;
```

```ts
import { ListPageSkeleton } from '@/shared/components/page-skeletons';

const OperationsLoading = () => <ListPageSkeleton />;

export default OperationsLoading;
```

- [ ] **Step 3: Build the inbox view with grouped cards and summary**

```tsx
<PageHeader
  eyebrow="Operação / Inbox"
  title="Inbox operacional do RH"
  description="Fila única das exceções que exigem decisão humana antes do fechamento, do atendimento ou da continuidade da jornada."
/>

<section className="grid gap-6 md:grid-cols-3">
  <StatCard label="Total pendente" value={String(data.summary.total)} />
  <StatCard label="Alta prioridade" value={String(data.summary.highPriority)} tone="danger" />
  <StatCard label="Com prazo vencendo" value={String(data.summary.dueSoon)} tone="tertiary" />
</section>
```

- [ ] **Step 4: Add the new navigation entry and dashboard shortcut**

```ts
{ href: '/operations', label: 'Inbox RH', icon: ClipboardList },
```

```tsx
<QuickActionRow href="/operations" label="Abrir inbox do RH" value={String(data.totalApprovalsPending + data.pendingTimeRecords)} />
```

- [ ] **Step 5: Add a focused Playwright smoke test**

```ts
import { test, expect } from '@playwright/test';

test('operations inbox is reachable from the sidebar', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: 'Inbox RH' }).click();
  await expect(page.getByRole('heading', { name: 'Inbox operacional do RH' })).toBeVisible();
});
```

- [ ] **Step 6: Run web verification**

Run: `corepack pnpm --dir apps/admin-web test -- operations-inbox-service.test.ts`  
Expected: PASS.

Run: `corepack pnpm --dir apps/admin-web typecheck`  
Expected: PASS.

Run: `corepack pnpm --dir apps/admin-web exec playwright test e2e/operations-inbox.spec.ts --project=chromium`  
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/admin-web/src/app/(protected)/operations apps/admin-web/src/features/operations apps/admin-web/src/shared/layout/sidebar-nav.tsx apps/admin-web/src/features/dashboard/components/dashboard-overview.tsx apps/admin-web/e2e/operations-inbox.spec.ts
git commit -m "feat: add admin operations inbox"
```

## Task 4: Build the Employee Action Center

**Files:**
- Create: `apps/employee-app/app/action-center.tsx`
- Create: `apps/employee-app/src/features/action-center/components/action-center-screen.tsx`
- Create: `apps/employee-app/src/features/action-center/lib/action-center-groups.ts`
- Modify: `apps/employee-app/src/features/home/components/home-screen.tsx`
- Modify: `apps/employee-app/src/features/notifications/components/notifications-screen.tsx`
- Test: `corepack pnpm --dir apps/employee-app typecheck`

- [ ] **Step 1: Create the pure grouping helper for pending items**

```ts
export interface ActionCenterItem {
  id: string;
  statusBucket: 'requires-action' | 'in-review' | 'recent';
  title: string;
  description: string;
  href: string;
  occurredAt: string;
}

export const groupActionCenterItems = (items: ActionCenterItem[]) => ({
  requiresAction: items.filter((item) => item.statusBucket === 'requires-action'),
  inReview: items.filter((item) => item.statusBucket === 'in-review'),
  recent: items.filter((item) => item.statusBucket === 'recent'),
});
```

- [ ] **Step 2: Build the action-center screen**

```tsx
<MobilePageHeader
  title="Central de pendências"
  subtitle="Tudo o que precisa da sua ação ou ainda está em análise pelo RH."
  onBack={() => router.back()}
/>

<Section title="Precisa da sua ação" items={groups.requiresAction} />
<Section title="Em análise" items={groups.inReview} />
<Section title="Resolvido recentemente" items={groups.recent} />
```

- [ ] **Step 3: Feed the screen from existing sources before introducing new backend aggregation**

```ts
const items: ActionCenterItem[] = [
  ...notifications.filter((item) => item.status === 'unread').map((item) => ({
    id: item.id,
    statusBucket: 'requires-action',
    title: item.title,
    description: item.description,
    href: item.href ?? '/notifications',
    occurredAt: item.triggeredAt,
  })),
];
```

- [ ] **Step 4: Add an entry point from the home screen**

```tsx
<Pressable style={styles.pendingHubCard} onPress={() => router.push('/action-center')}>
  <Text style={styles.pendingHubTitle}>Central de pendências</Text>
  <Text style={styles.pendingHubText}>Acompanhe o que precisa da sua ação e o que já está com o RH.</Text>
</Pressable>
```

- [ ] **Step 5: Switch notifications “read all” to the new batch mutation**

```ts
const markAllAsRead = useMarkAllEmployeeNotificationsRead(userId);

const handleReadAll = async () => {
  if (unreadNotifications.length === 0 || markAllAsRead.isPending) {
    return;
  }

  await markAllAsRead.mutateAsync();
};
```

- [ ] **Step 6: Run employee-app verification**

Run: `corepack pnpm --dir apps/employee-app lint`  
Expected: PASS.

Run: `corepack pnpm --dir apps/employee-app typecheck`  
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/employee-app/app/action-center.tsx apps/employee-app/src/features/action-center apps/employee-app/src/features/home/components/home-screen.tsx apps/employee-app/src/features/notifications/components/notifications-screen.tsx
git commit -m "feat: add employee action center"
```

## Task 5: Implement Contextual Time Record Adjustment from the Employee App

**Files:**
- Modify: `apps/employee-app/src/features/time-records/components/time-record-detail-screen.tsx`
- Modify: `apps/employee-app/src/features/justifications/components/new-justification-screen.tsx`
- Modify: `apps/employee-app/src/features/time-records/lib/time-record-mobile.ts`
- Test: `corepack pnpm --dir apps/employee-app typecheck`

- [ ] **Step 1: Pass context from the time-record detail CTA**

```ts
router.push({
  pathname: '/justifications/new',
  params: {
    timeRecordId: record.id,
    requestedRecordType: record.recordType,
    requestedRecordedAt: new Date(record.recordedAt).toISOString(),
  },
});
```

- [ ] **Step 2: Seed the justification form from route params**

```ts
const params = useLocalSearchParams<{
  timeRecordId?: string;
  requestedRecordType?: string;
  requestedRecordedAt?: string;
}>();

const form = useForm({
  resolver: zodResolver(employeeJustificationFormSchema),
  defaultValues: {
    type: 'adjustment_request',
    timeRecordId: params.timeRecordId ?? '',
    requestedRecordType: params.requestedRecordType ?? '',
    requestedRecordedAt: params.requestedRecordedAt ? formatDateTimeLocalInput(params.requestedRecordedAt) : '',
    reason: '',
  },
});
```

- [ ] **Step 3: Show the linked record context above the form**

```tsx
{linkedRecord ? (
  <View style={styles.contextCard}>
    <Text style={styles.contextTitle}>Ajuste vinculado à marcação</Text>
    <Text style={styles.contextText}>
      {timeRecordTypeLabels[linkedRecord.recordType]} em {formatTimeRecordDateTime(linkedRecord.recordedAt)}
    </Text>
  </View>
) : null}
```

- [ ] **Step 4: Fix the broken copy in the time-record labels while touching the flow**

```ts
export const timeRecordTypeLabels = {
  entry: 'Entrada',
  break_start: 'Saída para almoço',
  break_end: 'Volta do almoço',
  exit: 'Saída',
} as const;
```

```tsx
<Text style={styles.infoLabel}>Próxima etapa</Text>
<Text style={styles.infoValue}>
  {nextExpectedType ? timeRecordTypeLabels[nextExpectedType] : 'Jornada concluída'}
</Text>
```

- [ ] **Step 5: Run employee-app verification**

Run: `corepack pnpm --dir apps/employee-app lint`  
Expected: PASS.

Run: `corepack pnpm --dir apps/employee-app typecheck`  
Expected: PASS.

- [ ] **Step 6: Manual QA in Expo**

Run: `corepack pnpm --dir apps/employee-app dev`  
Expected: app starts. From a time-record detail, tapping `Solicitar ajuste` opens the justification form already contextualized.

- [ ] **Step 7: Commit**

```bash
git add apps/employee-app/src/features/time-records/components/time-record-detail-screen.tsx apps/employee-app/src/features/justifications/components/new-justification-screen.tsx apps/employee-app/src/features/time-records/lib/time-record-mobile.ts
git commit -m "feat: add contextual time adjustment flow"
```

## Task 6: Clean Up Phase-1 UX Regressions in Admin and Employee Surfaces

**Files:**
- Modify: `apps/admin-web/src/features/vacations/components/vacation-request-list-view.tsx`
- Modify: `apps/admin-web/src/features/schedules/components/schedules-overview.tsx`
- Modify: `apps/admin-web/src/features/documents/components/documents-overview.tsx`
- Modify: `apps/employee-app/src/features/notifications/components/notifications-screen.tsx`
- Test: `corepack pnpm --dir apps/admin-web lint`, `corepack pnpm --dir apps/employee-app lint`

- [ ] **Step 1: Remove misleading or broken CTA states in the admin surfaces**

```tsx
<Button disabled={!selectedDocument} size="sm" variant="outline">
  Exportar documento
</Button>
```

```tsx
<Button size="sm" variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
  Filtrar escalas
</Button>
```

- [ ] **Step 2: Replace hardcoded date-sensitive copy in vacations with dynamic values**

```ts
const today = new Date();
const todayLabel = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(today);
```

- [ ] **Step 3: Keep notifications consistent with the action-center language**

```tsx
<Text style={styles.heroTitle}>
  {employee?.fullName?.split(' ')[0] ?? 'Colaborador'}, você tem {unreadNotifications.length} item(ns) que podem exigir ação
</Text>
```

- [ ] **Step 4: Run lint and typecheck**

Run: `corepack pnpm --dir apps/admin-web lint`  
Expected: PASS.

Run: `corepack pnpm --dir apps/admin-web typecheck`  
Expected: PASS.

Run: `corepack pnpm --dir apps/employee-app lint`  
Expected: PASS.

Run: `corepack pnpm --dir apps/employee-app typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/admin-web/src/features/vacations/components/vacation-request-list-view.tsx apps/admin-web/src/features/schedules/components/schedules-overview.tsx apps/admin-web/src/features/documents/components/documents-overview.tsx apps/employee-app/src/features/notifications/components/notifications-screen.tsx
git commit -m "fix: align phase one operational UX"
```

## Self-Review

### Spec coverage

- Inbox do RH: coberto em Tasks 2 e 3.
- Caixa de pendências do colaborador: coberta em Task 4.
- Ajuste contextual de ponto: coberto em Task 5.
- Leitura em lote de notificações: coberta em Task 1 e consumida em Task 4.
- Correções estruturais de UX/copy da fase 1: cobertas em Tasks 5 e 6.

### Placeholder scan

- Nenhum `TODO`, `TBD` ou “implementar depois”.
- Todas as tarefas possuem arquivos, passos, comandos e snippets concretos.

### Type consistency

- `OperationsInboxItem` e `ActionCenterItem` usam nomes explícitos e não conflitantes.
- A mutação em lote do app é chamada de `markAllEmployeeNotificationsRead` em todas as tarefas.
- O fluxo contextual usa `timeRecordId`, `requestedRecordType` e `requestedRecordedAt` de forma consistente entre CTA e formulário.
