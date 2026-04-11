'use client';

import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock3,
  IdCard,
  KeyRound,
  Mail,
  MapPinned,
  Phone,
  ShieldCheck,
  UserCircle2,
} from 'lucide-react';
import { useId, useMemo, useState, type ReactNode } from 'react';

import { formatDate } from '@rh-ponto/core';
import { Badge, Card, CardContent, CardHeader, CardTitle, cn } from '@rh-ponto/ui';

import { AppAvatar } from '@/shared/components/app-avatar';
import { formatCpf, formatPhone, formatPin, formatRegistrationNumber } from '@/shared/lib/admin-formatters';

import { EmployeeAttendancePolicyCard } from './employee-attendance-policy-card';

interface EmployeeDetailData {
  id: string;
  registrationNumber: string;
  fullName: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  birthDate: string | Date | null;
  hireDate: string | Date | null;
  department: string | null;
  position: string | null;
  pinCode: string | null;
  isActive: boolean;
}

type EmployeeDetailTabId = 'summary' | 'profile' | 'attendance';

interface EmployeeDetailTabDefinition {
  id: EmployeeDetailTabId;
  label: string;
  description: string;
  icon: ReactNode;
}

const employeeDetailTabs: EmployeeDetailTabDefinition[] = [
  {
    id: 'summary',
    label: 'Resumo',
    description: 'Visão geral e status operacional do colaborador.',
    icon: <BadgeCheck className="h-4 w-4" />,
  },
  {
    id: 'profile',
    label: 'Cadastro',
    description: 'Dados pessoais, contato e vínculo organizacional.',
    icon: <IdCard className="h-4 w-4" />,
  },
  {
    id: 'attendance',
    label: 'Marcação',
    description: 'Política de marcação, geofence e locais autorizados.',
    icon: <Clock3 className="h-4 w-4" />,
  },
];

const SectionIntro = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <div>
    <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
      {eyebrow}
    </p>
    <h3 className="mt-2 font-headline text-xl font-extrabold text-[var(--on-surface)]">{title}</h3>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--on-surface-variant)]">{description}</p>
  </div>
);

const EmployeeIdentityBanner = ({ employee }: { employee: EmployeeDetailData }) => (
  <Card className="overflow-hidden border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,248,251,0.94)_100%)] p-0">
    <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <AppAvatar className="items-start" name={employee.fullName} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Ficha do colaborador
            </p>
            <h2 className="mt-2 text-balance font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
              {employee.fullName}
            </h2>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              {employee.position ?? 'Cargo não informado'}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant={employee.isActive ? 'success' : 'danger'}>
                {employee.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
              <Badge variant="neutral">{employee.department ?? 'Sem departamento'}</Badge>
              <Badge variant="info">Matrícula {formatRegistrationNumber(employee.registrationNumber)}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid border-t border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[rgba(245,247,250,0.88)] lg:border-l lg:border-t-0">
        <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] px-6 py-5">
          <div className="flex items-center gap-2 text-[var(--on-surface-variant)]">
            <IdCard className="h-4 w-4" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em]">Identificação</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">
            Matrícula {formatRegistrationNumber(employee.registrationNumber)}
          </p>
          <p className="mt-1 text-sm text-[var(--on-surface-variant)]">PIN {formatPin(employee.pinCode)}</p>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-2 text-[var(--on-surface-variant)]">
            <Building2 className="h-4 w-4" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em]">Situação atual</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-[var(--on-surface)]">
            {employee.department ?? 'Departamento pendente'}
          </p>
          <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
            Admissão {employee.hireDate ? formatDate(employee.hireDate) : '-'}
          </p>
        </div>
      </div>
    </div>
  </Card>
);

const SummaryCard = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) => (
  <div className="rounded-[1.4rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[var(--surface-container-low)] p-5">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-container-high)] text-[var(--primary)]">
        {icon}
      </span>
      <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{title}</p>
    </div>
    <div className="mt-4 text-sm leading-6 text-[var(--on-surface-variant)]">{children}</div>
  </div>
);

const EmployeeSummaryTab = ({ employee }: { employee: EmployeeDetailData }) => (
  <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
    <Card className="p-6 sm:p-8">
      <CardHeader className="px-0 pt-0">
        <SectionIntro
          eyebrow="Resumo do cadastro"
          title="Panorama operacional"
          description="Leitura rápida da ficha para o RH validar vínculo, identidade e próximos passos da operação."
        />
      </CardHeader>
      <CardContent className="grid gap-5 px-0 pb-0 md:grid-cols-2">
        <SummaryCard icon={<Building2 className="h-4 w-4" />} title="Vínculo organizacional">
          {employee.fullName} está vinculado ao departamento {employee.department ?? 'não definido'} e atua como{' '}
          {employee.position ?? 'cargo pendente de cadastro'}.
        </SummaryCard>

        <SummaryCard icon={<ShieldCheck className="h-4 w-4" />} title="Status de jornada">
          A ficha está pronta para vincular jornada, política de marcação e regras de localidade conforme o perfil de
          trabalho.
        </SummaryCard>

        <SummaryCard icon={<IdCard className="h-4 w-4" />} title="Dados de identificação">
          <p>CPF: {formatCpf(employee.cpf)}</p>
          <p className="mt-2">Nascimento: {employee.birthDate ? formatDate(employee.birthDate) : '-'}</p>
        </SummaryCard>

        <SummaryCard icon={<MapPinned className="h-4 w-4" />} title="Próximo passo operacional">
          Use a guia de marcação para definir se o colaborador pode registrar na empresa, em casa, em ambos os locais
          ou em campo.
        </SummaryCard>
      </CardContent>
    </Card>

    <Card className="p-6 sm:p-7">
      <CardHeader className="px-0 pt-0">
        <SectionIntro
          eyebrow="Leitura do RH"
          title="Status da ficha"
          description="Blocos auxiliares para orientar a manutenção do cadastro e reduzir exceções futuras."
        />
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        <div className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] bg-[var(--surface-container-low)] p-4">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
            Cadastro
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
            Os dados desta ficha são carregados diretamente da base operacional atual do sistema.
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] bg-[var(--surface-container-low)] p-4">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
            Marcação
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
            A política de localidade do colaborador pode ser ajustada sem alterar o restante do cadastro.
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] bg-[var(--surface-container-low)] p-4">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
            Governança
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
            Mantenha os dados pessoais, o vínculo e a política de marcação coerentes para evitar exceções no ponto.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const EmployeeDataRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="grid gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] py-5 first:pt-5 last:border-b-0 last:pb-2 sm:grid-cols-[16rem_minmax(0,1fr)] sm:items-center">
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-container-high)] text-[var(--primary)]">
        {icon}
      </span>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{label}</p>
    </div>
    <p className="text-sm font-semibold leading-6 text-[var(--on-surface)] sm:text-left">{value}</p>
  </div>
);

const DataPanel = ({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) => (
  <Card className="h-full p-6 sm:p-8">
    <CardHeader className="px-0 pt-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
          {icon}
        </span>
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">{description}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_10%,transparent)] bg-[linear-gradient(180deg,rgba(248,250,252,0.96)_0%,rgba(241,245,249,0.96)_100%)] px-5 py-1 sm:px-6">
      {children}
    </CardContent>
  </Card>
);

const EmployeeProfileTab = ({ employee }: { employee: EmployeeDetailData }) => (
  <div className="grid gap-6 xl:grid-cols-2">
    <DataPanel
      title="Contato"
      description="Informações usadas para comunicação, validação de identidade e conferência cadastral."
      icon={<Mail className="h-5 w-5" />}
    >
      <EmployeeDataRow icon={<Mail className="h-4 w-4" />} label="E-mail" value={employee.email ?? '-'} />
      <EmployeeDataRow icon={<Phone className="h-4 w-4" />} label="Telefone" value={formatPhone(employee.phone)} />
      <EmployeeDataRow icon={<UserCircle2 className="h-4 w-4" />} label="CPF" value={formatCpf(employee.cpf)} />
    </DataPanel>

    <DataPanel
      title="Vínculo"
      description="Dados estruturais do colaborador para jornada, alocação interna e fluxo de ponto."
      icon={<BriefcaseBusiness className="h-5 w-5" />}
    >
      <EmployeeDataRow icon={<IdCard className="h-4 w-4" />} label="Matrícula" value={formatRegistrationNumber(employee.registrationNumber)} />
      <EmployeeDataRow icon={<CalendarDays className="h-4 w-4" />} label="Admissão" value={employee.hireDate ? formatDate(employee.hireDate) : '-'} />
      <EmployeeDataRow icon={<CalendarDays className="h-4 w-4" />} label="Nascimento" value={employee.birthDate ? formatDate(employee.birthDate) : '-'} />
      <EmployeeDataRow icon={<Building2 className="h-4 w-4" />} label="Departamento" value={employee.department ?? '-'} />
      <EmployeeDataRow icon={<BriefcaseBusiness className="h-4 w-4" />} label="Cargo" value={employee.position ?? '-'} />
      <EmployeeDataRow icon={<KeyRound className="h-4 w-4" />} label="PIN de identificação" value={formatPin(employee.pinCode)} />
    </DataPanel>
  </div>
);

const EmployeeAttendanceTab = ({ employeeId }: { employeeId: string }) => (
  <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
    <EmployeeAttendancePolicyCard employeeId={employeeId} />

    <Card className="h-fit p-6 sm:p-7">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <SectionIntro
            eyebrow="Apoio à configuração"
            title="Como usar esta guia"
            description="As regras abaixo orientam o RH na definição de localização, bloqueio e revisão das marcações."
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0 text-sm leading-6 text-[var(--on-surface-variant)]">
        <p>Defina aqui onde o colaborador pode registrar ponto e qual ação o sistema toma fora da regra.</p>
        <p>Use “qualquer local” apenas quando a política realmente permitir marcação sem geofence específica.</p>
        <p>Para perfis híbridos, vincule a matriz e a residência cadastrada para reduzir pendências de revisão.</p>
        <p>As alterações salvas nesta guia impactam o fluxo operacional de marcação do colaborador.</p>
      </CardContent>
    </Card>
  </div>
);

const ContextTabs = ({
  activeTab,
  onChange,
  tabsetId,
}: {
  activeTab: EmployeeDetailTabId;
  onChange: (value: EmployeeDetailTabId) => void;
  tabsetId: string;
}) => (
  <div aria-label="Contextos do detalhe do colaborador" className="grid gap-3 md:grid-cols-3" role="tablist">
    {employeeDetailTabs.map((tab) => {
      const isActive = tab.id === activeTab;

      return (
        <button
          key={tab.id}
          aria-controls={`${tabsetId}-${tab.id}-panel`}
          aria-selected={isActive}
          className={cn(
            'group rounded-[1.35rem] border px-5 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
            isActive
              ? 'border-[color:color-mix(in_srgb,var(--primary)_24%,transparent)] bg-[linear-gradient(180deg,rgba(225,232,255,0.96)_0%,rgba(214,224,255,0.92)_100%)] text-[var(--primary)] shadow-[0_14px_36px_rgba(53,92,255,0.12)]'
              : 'border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)] hover:border-[color:color-mix(in_srgb,var(--primary)_16%,transparent)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]',
          )}
          id={`${tabsetId}-${tab.id}-tab`}
          role="tab"
          type="button"
          onClick={() => onChange(tab.id)}
        >
          <span className="flex items-center gap-2 font-headline text-sm font-extrabold">
            <span className={cn('transition-transform duration-200', isActive ? 'scale-100' : 'group-hover:scale-105')}>{tab.icon}</span>
            {tab.label}
          </span>
          <span className="mt-2 block text-xs leading-5">{tab.description}</span>
        </button>
      );
    })}
  </div>
);

export const EmployeeDetailTabs = ({ employee, employeeId }: { employee: EmployeeDetailData; employeeId: string }) => {
  const [activeTab, setActiveTab] = useState<EmployeeDetailTabId>('summary');
  const tabsetId = useId();

  const activeDescription = useMemo(
    () => employeeDetailTabs.find((tab) => tab.id === activeTab)?.description ?? '',
    [activeTab],
  );

  return (
    <div className="space-y-6">
      <EmployeeIdentityBanner employee={employee} />

      <Card className="overflow-hidden p-0">
        <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[linear-gradient(180deg,rgba(250,251,253,0.96)_0%,rgba(246,248,252,0.96)_100%)] px-6 py-6 sm:px-8">
          <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start">
            <SectionIntro eyebrow="Navegação da ficha" title="Contexto atual" description={activeDescription} />
            <ContextTabs activeTab={activeTab} onChange={setActiveTab} tabsetId={tabsetId} />
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div aria-labelledby={`${tabsetId}-${activeTab}-tab`} id={`${tabsetId}-${activeTab}-panel`} role="tabpanel">
            {activeTab === 'summary' ? <EmployeeSummaryTab employee={employee} /> : null}
            {activeTab === 'profile' ? <EmployeeProfileTab employee={employee} /> : null}
            {activeTab === 'attendance' ? <EmployeeAttendanceTab employeeId={employeeId} /> : null}
          </div>
        </div>
      </Card>
    </div>
  );
};
