'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Clock3, Database, KeyRound, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import {
  Badge,
  Button,
  Card,
  ErrorState,
  FormField,
  Input,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rh-ponto/ui';
import { adminSettingsFormSchema } from '@rh-ponto/validations';
import { getPermissionsForRole, userRoles } from '@rh-ponto/types';

import { OverviewPageSkeleton } from '@/shared/components/page-skeletons';
import { showValidationToast } from '@/shared/lib/form-feedback';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';
import { formatRoleLabel } from '@/shared/lib/admin-formatters';

import { useSettingsOverview, useUpdateSettings } from '../hooks/use-settings-overview';
import type { SettingsOverviewData } from '../lib/settings-contracts';

type SettingsFormInput = z.input<typeof adminSettingsFormSchema>;
type SettingsTabId = 'overview' | 'work-policy' | 'geofence' | 'notifications' | 'access-control';

type SettingsTabDefinition = {
  id: SettingsTabId;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const settingsTabs: SettingsTabDefinition[] = [
  {
    id: 'overview',
    label: 'Resumo',
    description: 'Indicadores, regras vigentes e visão geral da operação.',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 'work-policy',
    label: 'Jornada',
    description: 'Política padrão, escala principal e tolerâncias.',
    icon: <Clock3 className="h-4 w-4" />,
  },
  {
    id: 'geofence',
    label: 'Localidade',
    description: 'Dispositivo principal, geofence e bloqueio por área.',
    icon: <MapPinned className="h-4 w-4" />,
  },
  {
    id: 'notifications',
    label: 'Alertas',
    description: 'Preferências do sino e sinais operacionais do RH.',
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: 'access-control',
    label: 'Acesso',
    description: 'Papéis e permissões disponíveis na operação.',
    icon: <KeyRound className="h-4 w-4" />,
  },
];

const toDefaultValues = (data?: SettingsOverviewData): SettingsFormInput => ({
  defaultAttendancePolicyId: data?.attendancePolicy.defaultAttendancePolicyId ?? '',
  scheduleId: data?.workPolicy.scheduleId ?? '',
  startTime: data?.workPolicy.startTime ?? '08:00',
  breakStartTime: data?.workPolicy.breakStartTime ?? '12:00',
  breakEndTime: data?.workPolicy.breakEndTime ?? '13:00',
  endTime: data?.workPolicy.endTime ?? '17:00',
  toleranceMinutes: data?.workPolicy.toleranceMinutes ?? 10,
  expectedDailyMinutes: data?.workPolicy.expectedDailyMinutes ?? 480,
  primaryDeviceId: data?.geofence.primaryDeviceId ?? '',
  geofenceMainArea: data?.geofence.mainArea ?? '',
  geofenceRadiusMeters: data?.geofence.radiusMeters ?? 120,
  geofenceBlockingEnabled: data?.geofence.blockingEnabled ?? true,
  notifyOvertimeSummary: data?.notifications.find((item) => item.id === 'notification-overtime')?.enabled ?? true,
  notifyPendingVacations: data?.notifications.find((item) => item.id === 'notification-vacations')?.enabled ?? true,
  notifyDeviceSync: data?.notifications.find((item) => item.id === 'notification-devices')?.enabled ?? true,
  notifyAuditSummary: data?.notifications.find((item) => item.id === 'notification-audit')?.enabled ?? true,
});

const ToggleField = ({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (nextValue: boolean) => void;
}) => (
  <div className="flex flex-col gap-4 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">{description}</p>
    </div>
    <label className="inline-flex cursor-pointer items-center gap-2 self-start sm:mt-1 sm:self-auto">
      <span className="sr-only">{label}</span>
      <input
        checked={checked}
        className="h-5 w-5 rounded border-[color:color-mix(in_srgb,var(--outline-variant)_35%,transparent)] text-[var(--primary)] focus:ring-[var(--primary-fixed)]"
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  </div>
);

const SectionHeader = ({
  icon,
  title,
  description,
  toneClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  toneClass: string;
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div className={toneClass}>{icon}</div>
    <div>
      <h3 className="font-headline text-xl font-extrabold text-[var(--on-surface)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{description}</p>
    </div>
  </div>
);

const SettingsContextTabs = ({
  activeTab,
  onChange,
  tabsetId,
}: {
  activeTab: SettingsTabId;
  onChange: (tab: SettingsTabId) => void;
  tabsetId: string;
}) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="tablist" aria-label="Contextos das configurações">
    {settingsTabs.map((tab) => {
      const isActive = tab.id === activeTab;

      return (
        <button
          key={tab.id}
          id={`${tabsetId}-${tab.id}-tab`}
          aria-controls={`${tabsetId}-${tab.id}-panel`}
          aria-selected={isActive}
          className={
            isActive
              ? 'flex min-h-[5rem] items-start gap-3 rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--primary)_24%,transparent)] bg-[var(--primary-fixed)] px-4 py-4 text-left shadow-[var(--shadow-card)]'
              : 'flex min-h-[5rem] items-start gap-3 rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[var(--surface-container-lowest)] px-4 py-4 text-left transition hover:border-[color:color-mix(in_srgb,var(--primary)_18%,transparent)] hover:bg-[var(--surface-container-low)]'
          }
          role="tab"
          type="button"
          onClick={() => onChange(tab.id)}
        >
          <span
            className={
              isActive
                ? 'mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[var(--primary)]'
                : 'mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--surface-container-low)] text-[var(--primary)]'
            }
          >
            {tab.icon}
          </span>
          <span className="block min-w-0">
            <span className="block font-headline text-sm font-extrabold text-[var(--on-surface)]">{tab.label}</span>
            <span className="mt-1 block text-sm leading-6 text-[var(--on-surface-variant)]">{tab.description}</span>
          </span>
        </button>
      );
    })}
  </div>
);

export const SettingsOverview = () => {
  const { data, error, isError, isLoading, refetch } = useSettingsOverview();
  const updateSettings = useUpdateSettings();
  const [activeTab, setActiveTab] = useState<SettingsTabId>('overview');
  const tabsetId = useId();
  const form = useForm<SettingsFormInput, unknown, z.output<typeof adminSettingsFormSchema>>({
    resolver: zodResolver(adminSettingsFormSchema),
    defaultValues: toDefaultValues(),
  });
  const accessControlRoles = userRoles.map((role) => ({
    role,
    label: formatRoleLabel(role),
    permissions: getPermissionsForRole(role),
  }));

  useEffect(() => {
    if (!data) {
      return;
    }

    form.reset(toDefaultValues(data));
  }, [data, form]);

  if (isLoading) {
    return <OverviewPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar as configurações"
        description={getActionErrorMessage(error, 'Tente novamente para abrir as definições operacionais do RH.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  const handleScheduleChange = (scheduleId: string) => {
    const selectedSchedule = data.scheduleDefinitions.find((item) => item.id === scheduleId);

    form.setValue('scheduleId', scheduleId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (!selectedSchedule) {
      return;
    }

    form.setValue('startTime', selectedSchedule.startTime, { shouldDirty: true });
    form.setValue('breakStartTime', selectedSchedule.breakStartTime, { shouldDirty: true });
    form.setValue('breakEndTime', selectedSchedule.breakEndTime, { shouldDirty: true });
    form.setValue('endTime', selectedSchedule.endTime, { shouldDirty: true });
    form.setValue('toleranceMinutes', selectedSchedule.toleranceMinutes, { shouldDirty: true });
    form.setValue('expectedDailyMinutes', selectedSchedule.expectedDailyMinutes, { shouldDirty: true });
  };

  const onSubmit = form.handleSubmit(
    async (values) => {
      await updateSettings.mutateAsync(values);
      toast.success('Configurações salvas com sucesso.');
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os campos das configurações.',
      });
    },
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Configurações / Operação"
        title="Configurações operacionais"
        description="Organize a operação em blocos mais claros, sem precisar percorrer uma tela longa para cada ajuste."
        actions={
          <Button disabled={!form.formState.isDirty || updateSettings.isPending} size="lg" onClick={onSubmit}>
            {updateSettings.isPending ? 'Salvando...' : 'Salvar configurações'}
          </Button>
        }
      />

      <section className="space-y-4">
        <div>
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            Contexto das configurações
          </p>
          <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
            Escolha um bloco para editar a configuração certa sem navegar por uma página muito longa.
          </p>
        </div>
        <SettingsContextTabs activeTab={activeTab} onChange={setActiveTab} tabsetId={tabsetId} />
      </section>

      <form className="space-y-8" onSubmit={onSubmit}>
        <div aria-labelledby={`${tabsetId}-${activeTab}-tab`} id={`${tabsetId}-${activeTab}-panel`} role="tabpanel" className="space-y-8">
          {activeTab === 'overview' ? (
            <>
              <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="p-4 sm:p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Colaboradores ativos</p>
                  <p className="mt-3 font-headline text-3xl font-extrabold text-[var(--on-surface)] sm:text-4xl">{data.summary.activeEmployees}</p>
                </Card>
                <Card className="p-4 sm:p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Jornadas ativas</p>
                  <p className="mt-3 font-headline text-3xl font-extrabold text-[var(--on-surface)] sm:text-4xl">{data.summary.activeSchedules}</p>
                </Card>
                <Card className="p-4 sm:p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Dispositivos ativos</p>
                  <p className="mt-3 font-headline text-3xl font-extrabold text-[var(--on-surface)] sm:text-4xl">{data.summary.activeDevices}</p>
                </Card>
                <Card className="p-4 sm:p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Aprovações pendentes</p>
                  <p className="mt-3 font-headline text-3xl font-extrabold text-[var(--on-surface)] sm:text-4xl">{data.summary.pendingApprovals}</p>
                </Card>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {data.policies.map((policy) => (
                  <Card key={policy.id} className="p-5">
                    <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{policy.title}</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--on-surface-variant)]">{policy.description}</p>
                  </Card>
                ))}
              </section>

              <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {data.integrity.map((item) => (
                  <Card key={item.id} className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-fixed)] text-[var(--primary)]">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">{item.label}</p>
                        <p className="mt-1 font-headline text-2xl font-extrabold text-[var(--on-surface)]">{item.value}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[var(--on-surface-variant)]">{item.hint}</p>
                  </Card>
                ))}
              </section>

              <Card className="p-5 sm:p-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[var(--primary)]" />
                  <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Configurações salvas para toda a operação</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--on-surface-variant)]">
                  Use esta área para ajustar a política padrão de marcação, a jornada principal, a geofence e os alertas do painel.
                </p>
              </Card>
            </>
          ) : null}

          {activeTab === 'work-policy' ? (
            <section className="grid gap-6 xl:grid-cols-2">
              <Card className="p-5 sm:p-8">
                <SectionHeader
                  icon={<Clock3 className="h-5 w-5" />}
                  toneClass="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed-variant)]"
                  title="Política e jornada padrão"
                  description="Defina a regra-base de marcação e a escala principal adotada pela operação."
                />

                <div className="mt-8 grid gap-5">
                  <div className="space-y-2.5">
                    <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Política padrão de marcação
                    </p>
                    <Controller
                      control={form.control}
                      name="defaultAttendancePolicyId"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a política padrão" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.attendancePolicyOptions.map((policy) => (
                              <SelectItem key={policy.id} value={policy.id}>
                                {policy.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Jornada padrão
                    </p>
                    <Controller
                      control={form.control}
                      name="scheduleId"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={handleScheduleChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a jornada principal" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.scheduleOptions.map((schedule) => (
                              <SelectItem key={schedule.id} value={schedule.id}>
                                {schedule.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Início" error={form.formState.errors.startTime?.message}>
                      <Input type="time" {...form.register('startTime')} />
                    </FormField>
                    <FormField label="Fim" error={form.formState.errors.endTime?.message}>
                      <Input type="time" {...form.register('endTime')} />
                    </FormField>
                    <FormField label="Início do intervalo" error={form.formState.errors.breakStartTime?.message}>
                      <Input type="time" {...form.register('breakStartTime')} />
                    </FormField>
                    <FormField label="Fim do intervalo" error={form.formState.errors.breakEndTime?.message}>
                      <Input type="time" {...form.register('breakEndTime')} />
                    </FormField>
                    <FormField label="Tolerância (min)" error={form.formState.errors.toleranceMinutes?.message}>
                      <Input min={0} step={1} type="number" {...form.register('toleranceMinutes')} />
                    </FormField>
                    <FormField label="Carga diária (min)" error={form.formState.errors.expectedDailyMinutes?.message}>
                      <Input min={60} step={1} type="number" {...form.register('expectedDailyMinutes')} />
                    </FormField>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="inline-flex rounded-full bg-[var(--primary-fixed)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--primary)]">
                      {data.workPolicy.activeSchedulesCount} jornada(s) ativa(s) · {data.workPolicy.employeesWithoutSchedule} colaborador(es) sem escala atual
                    </div>
                    <div className="inline-flex rounded-full bg-[var(--secondary-fixed)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--secondary)]">
                      {data.attendancePolicy.activePoliciesCount} política(s) ativa(s) · {data.attendancePolicy.employeesWithExplicitPolicy} vínculo(s) personalizados
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          ) : null}

          {activeTab === 'geofence' ? (
            <section className="grid gap-6 xl:grid-cols-2">
              <Card className="p-5 sm:p-8">
                <SectionHeader
                  icon={<MapPinned className="h-5 w-5" />}
                  toneClass="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--secondary-fixed)] text-[var(--secondary)]"
                  title="Geofence e dispositivo principal"
                  description="Defina a área principal validada pelo RH e o terminal de referência da operação."
                />

                <div className="mt-8 grid gap-5">
                  <div className="space-y-2.5">
                    <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                      Dispositivo principal
                    </p>
                    <Controller
                      control={form.control}
                      name="primaryDeviceId"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o dispositivo principal" />
                          </SelectTrigger>
                          <SelectContent>
                            {data.deviceOptions.map((device) => (
                              <SelectItem key={device.id} value={device.id}>
                                {device.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Área principal" error={form.formState.errors.geofenceMainArea?.message}>
                      <Input {...form.register('geofenceMainArea')} />
                    </FormField>
                    <FormField label="Raio (m)" error={form.formState.errors.geofenceRadiusMeters?.message}>
                      <Input min={50} step={1} type="number" {...form.register('geofenceRadiusMeters')} />
                    </FormField>
                  </div>

                  <Controller
                    control={form.control}
                    name="geofenceBlockingEnabled"
                    render={({ field }) => (
                      <ToggleField
                        checked={field.value}
                        description="Quando ativo, o sistema reforça a leitura da localidade principal configurada para a marcação."
                        label="Bloqueio por localidade"
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <Badge variant={data.geofence.inactiveDevices > 0 ? 'warning' : 'success'}>
                    {data.geofence.inactiveDevices > 0
                      ? `${data.geofence.inactiveDevices} dispositivo(s) inativo(s) exigem acompanhamento`
                      : 'Todos os dispositivos da operação estão ativos'}
                  </Badge>
                </div>
              </Card>
            </section>
          ) : null}

          {activeTab === 'notifications' ? (
            <Card className="p-5 sm:p-8">
              <SectionHeader
                icon={<Bell className="h-5 w-5" />}
                toneClass="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--error-container)] text-[var(--on-error-container)]"
                title="Preferências de notificação"
                description="Controle o que chega no sininho do painel para o RH acompanhar o que realmente importa."
              />

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="notifyOvertimeSummary"
                  render={({ field }) => (
                    <ToggleField
                      checked={field.value}
                      description="Registros em revisão, jornadas fora do padrão e sinais de exceção operacional."
                      label="Exceções de ponto e horas extras"
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="notifyPendingVacations"
                  render={({ field }) => (
                    <ToggleField
                      checked={field.value}
                      description="Férias e justificativas pendentes que aguardam uma decisão do RH."
                      label="Solicitações pendentes do RH"
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="notifyDeviceSync"
                  render={({ field }) => (
                    <ToggleField
                      checked={field.value}
                      description="Falhas de dispositivos, ausência de sincronização e terminais inativos."
                      label="Dispositivos e sincronização"
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="notifyAuditSummary"
                  render={({ field }) => (
                    <ToggleField
                      checked={field.value}
                      description="Aprovações, reprovações e alterações sensíveis registradas na trilha de auditoria."
                      label="Auditoria sensível"
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </Card>
          ) : null}

          {activeTab === 'access-control' ? (
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {accessControlRoles.map((item) => (
                <Card key={item.role} className="p-5 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
                        {item.role === 'admin'
                          ? 'Acesso total aos módulos administrativos e operacionais.'
                          : item.role === 'employee'
                            ? 'Acesso à jornada própria, solicitações e documentos pessoais.'
                            : 'Acesso restrito ao fluxo de batida e validação do terminal.'}
                      </p>
                    </div>
                    <Badge className="self-start" variant="neutral">
                      {item.permissions.length} permissões
                    </Badge>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.permissions.slice(0, 8).map((permission) => (
                      <Badge key={permission} variant="info">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </section>
          ) : null}
        </div>
      </form>
    </div>
  );
};
