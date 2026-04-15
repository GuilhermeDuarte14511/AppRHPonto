# 💀 Page Skeletons

Componentes de skeleton para estados de loading das páginas do sistema.

## 📋 Componentes Disponíveis

### Skeletons de Página Específicos

- **DashboardSkeleton** - Para a página principal do dashboard
- **EmployeesListSkeleton** - Para lista de colaboradores
- **EmployeeDetailSkeleton** - Para detalhes de um colaborador
- **TimeRecordsSkeleton** - Para registros de ponto
- **AnalyticsSkeleton** - Para analytics e relatórios

### Skeletons Genéricos

- **ListPageSkeleton** - Para qualquer página de listagem
- **FormPageSkeleton** - Para páginas de formulário

## 🚀 Como Usar

### 1. Usando o arquivo `loading.tsx` (Recomendado)

O Next.js 14+ suporta arquivos `loading.tsx` que são exibidos automaticamente durante o carregamento:

```tsx
// app/(protected)/dashboard/loading.tsx
import { DashboardSkeleton } from '@/shared/components/page-skeletons';

export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
```

### 2. Usando com React Query

```tsx
'use client';

import { DashboardSkeleton } from '@/shared/components/page-skeletons';
import { useDashboardData } from '@/features/dashboard/hooks/use-dashboard-data';

export function DashboardPage() {
  const { data, isLoading } = useDashboardData();
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  return <DashboardContent data={data} />;
}
```

### 3. Usando com Suspense

```tsx
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/shared/components/page-skeletons';
import { DashboardContent } from './dashboard-content';

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
```

## 🎨 Componentes Base do UI Package

Os skeletons de página usam componentes base do `@rh-ponto/ui`:

```tsx
import {
  Skeleton,           // Primitivo base
  CardSkeleton,       // Card genérico
  TableSkeleton,      // Tabela
  StatCardSkeleton,   // Card de estatística
  ChartSkeleton,      // Gráficos
  FormSkeleton,       // Formulários
  ListItemSkeleton,   // Item de lista
} from '@rh-ponto/ui';
```

## 📦 Estrutura

```
page-skeletons/
├── README.md                      # Este arquivo
├── index.ts                       # Exports
├── dashboard-skeleton.tsx         # Dashboard
├── employees-list-skeleton.tsx    # Lista de colaboradores
├── employee-detail-skeleton.tsx   # Detalhe do colaborador
├── time-records-skeleton.tsx      # Registros de ponto
├── analytics-skeleton.tsx         # Analytics
├── form-page-skeleton.tsx         # Formulário genérico
└── list-page-skeleton.tsx         # Lista genérica
```

## ✨ Boas Práticas

### 1. Mantenha a Estrutura Similar

O skeleton deve ter a mesma estrutura visual da página real:

```tsx
// ❌ Ruim - estrutura diferente
<div className="grid grid-cols-2">
  <Skeleton />
</div>

// ✅ Bom - estrutura idêntica
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {Array.from({ length: 4 }).map((_, i) => (
    <StatCardSkeleton key={i} />
  ))}
</div>
```

### 2. Use Dimensões Realistas

```tsx
// ❌ Ruim - tamanhos genéricos
<Skeleton className="h-10 w-full" />

// ✅ Bom - tamanhos realistas
<Skeleton className="h-8 w-48" /> {/* Título */}
<Skeleton className="h-4 w-64" /> {/* Subtítulo */}
```

### 3. Respeite o Responsive Design

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Skeletons aqui */}
</div>
```

### 4. Adicione Aria Labels

Os componentes já incluem `role="status"` e `aria-label`, mas você pode customizar:

```tsx
<div role="status" aria-label="Carregando dashboard...">
  <DashboardSkeleton />
</div>
```

## 🎯 Quando Criar um Novo Skeleton

### Use skeleton específico quando:
- A página tem layout único
- Há elementos visuais distintos
- Melhora significativamente a UX

### Use skeleton genérico quando:
- A página segue padrão comum (lista, formulário)
- Não há elementos visuais únicos
- Quer manter consistência

## 🔧 Customização

### Criando um Novo Skeleton de Página

```tsx
import * as React from 'react';
import { Skeleton, CardSkeleton, TableSkeleton } from '@rh-ponto/ui';

export const MyCustomSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton lines={4} showAvatar />
        <TableSkeleton rows={5} columns={3} />
      </div>
    </div>
  );
};
```

### Exportando

Adicione no `index.ts`:

```tsx
export { MyCustomSkeleton } from './my-custom-skeleton';
```

## 📊 Páginas com Skeletons Implementados

- ✅ Dashboard (`/dashboard`)
- ✅ Colaboradores (`/employees`)
- ✅ Registros de Ponto (`/time-records`)
- ✅ Analytics (`/analytics`)
- ✅ Férias (`/vacations`)
- ✅ Justificativas (`/justifications`)
- ✅ Departamentos (`/departments`)
- ✅ Configurações (`/settings`)
- ✅ Auditoria (`/audit`)

## 🎨 Animações Disponíveis

Os skeletons suportam diferentes animações (definidas no Tailwind):

- `pulse` (padrão) - Pulsação suave
- `wave` - Onda gradiente
- `shimmer` - Brilho deslizante
- `none` - Sem animação

```tsx
<Skeleton animation="shimmer" className="h-4 w-full" />
```

## 🌐 Acessibilidade

Todos os skeletons incluem:

- `role="status"` - Indica estado de loading
- `aria-label="Carregando..."` - Descrição para leitores de tela
- `aria-live="polite"` - Anuncia mudanças

## 📚 Referências

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Skeleton Screen Best Practices](https://www.lukew.com/ff/entry.asp?1797)
- [Material Design - Progress & Activity](https://m3.material.io/components/progress-indicators)