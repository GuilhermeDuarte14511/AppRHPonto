'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MapPinned, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  ErrorState,
  CardHeader,
  CardTitle,
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@rh-ponto/ui';
import { employeeAttendancePolicyFormSchema } from '@rh-ponto/validations';

import { DetailPageSkeleton } from '@/shared/components/page-skeletons';
import { showValidationToast } from '@/shared/lib/form-feedback';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useEmployeeAttendancePolicy, useUpdateEmployeeAttendancePolicy } from '../hooks/use-employee-attendance-policy';
import type { EmployeeAttendancePolicyViewData } from '../lib/employee-attendance-policy-contracts';

type EmployeeAttendancePolicyFormInput = z.input<typeof employeeAttendancePolicyFormSchema>;

const attendanceModeLabels: Record<EmployeeAttendancePolicyViewData['assignment']['mode'], string> = {
  company_only: 'Somente empresa',
  home_only: 'Somente residência',
  hybrid: 'Híbrido',
  free: 'Livre',
  field: 'Externo / campo',
};

const validationStrategyLabels: Record<EmployeeAttendancePolicyViewData['assignment']['validationStrategy'], string> = {
  block: 'Bloquear fora da regra',
  pending_review: 'Permitir com revisão',
  allow: 'Permitir sem bloqueio',
};

const locationTypeLabels: Record<EmployeeAttendancePolicyViewData['locationCatalog'][number]['type'], string> = {
  company: 'Empresa',
  home: 'Residência',
  branch: 'Filial',
  client_site: 'Cliente',
  free_zone: 'Área livre',
};

const locationRoleLabels: Record<
  EmployeeAttendancePolicyViewData['assignment']['selectedLocations'][number]['locationRole'],
  string
> = {
  primary_company: 'Base principal',
  home: 'Residência',
  optional: 'Opcional',
  client_site: 'Cliente',
};

const toDefaultValues = (data?: EmployeeAttendancePolicyViewData): EmployeeAttendancePolicyFormInput => ({
  attendancePolicyId: data?.assignment.attendancePolicyId ?? '',
  mode: data?.assignment.mode ?? 'company_only',
  validationStrategy: data?.assignment.validationStrategy ?? 'block',
  geolocationRequired: data?.assignment.geolocationRequired ?? true,
  photoRequired: data?.assignment.photoRequired ?? false,
  allowAnyLocation: data?.assignment.allowAnyLocation ?? false,
  blockOutsideAllowedLocations: data?.assignment.blockOutsideAllowedLocations ?? true,
  notes: data?.assignment.notes ?? '',
  selectedLocationIds: data?.assignment.selectedLocations.map((item) => item.id) ?? [],
  selectedLocationRoleById:
    data?.assignment.selectedLocations.reduce<Record<string, keyof typeof locationRoleLabels>>((acc, item) => {
      acc[item.id] = item.locationRole;
      return acc;
    }, {}) ?? {},
});

const getSuggestedLocationRole = (type: EmployeeAttendancePolicyViewData['locationCatalog'][number]['type']) => {
  switch (type) {
    case 'company':
    case 'branch':
      return 'primary_company' as const;
    case 'home':
      return 'home' as const;
    case 'client_site':
      return 'client_site' as const;
    default:
      return 'optional' as const;
  }
};

export const EmployeeAttendancePolicyCard = ({ employeeId }: { employeeId: string }) => {
  const { data, error, isError, isLoading, refetch } = useEmployeeAttendancePolicy(employeeId);
  const updateEmployeeAttendancePolicy = useUpdateEmployeeAttendancePolicy(employeeId);
  const form = useForm<EmployeeAttendancePolicyFormInput, unknown, z.output<typeof employeeAttendancePolicyFormSchema>>({
    resolver: zodResolver(employeeAttendancePolicyFormSchema),
    defaultValues: toDefaultValues(),
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    form.reset(toDefaultValues(data));
  }, [data, form]);

  const selectedPolicyId = useWatch({
    control: form.control,
    name: 'attendancePolicyId',
  });
  const allowAnyLocation = useWatch({
    control: form.control,
    name: 'allowAnyLocation',
  });
  const selectedLocationIds = useWatch({
    control: form.control,
    name: 'selectedLocationIds',
  }) ?? [];

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar a política de marcação"
        description={getActionErrorMessage(error, 'Tente novamente para abrir as regras de geofence deste colaborador.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  const selectedPolicy = data.policyCatalog.find((item) => item.id === selectedPolicyId) ?? null;
  const requiresAllowedLocations = Boolean(selectedPolicy?.requiresAllowedLocations && !allowAnyLocation);

  const handlePolicyChange = (nextPolicyId: string) => {
    const nextPolicy = data.policyCatalog.find((item) => item.id === nextPolicyId);

    form.setValue('attendancePolicyId', nextPolicyId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (!nextPolicy) {
      return;
    }

    form.setValue('mode', nextPolicy.mode, { shouldDirty: true, shouldValidate: true });
    form.setValue('validationStrategy', nextPolicy.validationStrategy, { shouldDirty: true, shouldValidate: true });
    form.setValue('geolocationRequired', nextPolicy.geolocationRequired, { shouldDirty: true });
    form.setValue('photoRequired', nextPolicy.photoRequired, { shouldDirty: true });
    form.setValue('allowAnyLocation', !nextPolicy.requiresAllowedLocations, { shouldDirty: true, shouldValidate: true });
    form.setValue('blockOutsideAllowedLocations', nextPolicy.requiresAllowedLocations, { shouldDirty: true });

    if (!nextPolicy.requiresAllowedLocations) {
      form.setValue('selectedLocationIds', [], { shouldDirty: true, shouldValidate: true });
      form.setValue('selectedLocationRoleById', {}, { shouldDirty: true, shouldValidate: true });
    }
  };

  const toggleLocation = (
    locationId: string,
    locationType: EmployeeAttendancePolicyViewData['locationCatalog'][number]['type'],
    checked: boolean,
  ) => {
    const nextSelectedIds = checked
      ? Array.from(new Set([...selectedLocationIds, locationId]))
      : selectedLocationIds.filter((item) => item !== locationId);
    const currentRoles = form.getValues('selectedLocationRoleById') ?? {};
    const nextRoles = { ...currentRoles };

    if (checked) {
      nextRoles[locationId] = currentRoles[locationId] ?? getSuggestedLocationRole(locationType);
    } else {
      delete nextRoles[locationId];
    }

    form.setValue('selectedLocationIds', nextSelectedIds, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.setValue('selectedLocationRoleById', nextRoles, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = form.handleSubmit(
    async (values) => {
      await updateEmployeeAttendancePolicy.mutateAsync(values);
      toast.success('Política de marcação atualizada com sucesso.');
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise a configuração da política de marcação.',
      });
    },
  );

  return (
    <Card className="p-5 sm:p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Política de marcação</CardTitle>
            <CardDescription className="mt-2">
              Defina onde este colaborador pode registrar ponto e como o sistema deve reagir fora da regra.
            </CardDescription>
          </div>
          <Badge variant={data.inheritedFromDefault ? 'neutral' : 'info'}>
            {data.inheritedFromDefault ? 'Herdada da configuração padrão' : 'Personalizada para o colaborador'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-0 pb-0">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
              Regra ativa
            </p>
            <p className="mt-3 font-headline text-lg font-extrabold text-[var(--on-surface)]">
              {selectedPolicy?.name ?? 'Política não definida'}
            </p>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              {selectedPolicy ? attendanceModeLabels[selectedPolicy.mode] : 'Defina uma política para continuar.'}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Validação
              </p>
            </div>
            <p className="mt-3 font-headline text-lg font-extrabold text-[var(--on-surface)]">
              {validationStrategyLabels[form.getValues('validationStrategy')]}
            </p>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              {form.getValues('geolocationRequired') ? 'Com geolocalização obrigatória' : 'Sem geolocalização obrigatória'}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
            <div className="flex items-center gap-2">
              <UserRoundCheck className="h-4 w-4 text-[var(--primary)]" />
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Locais liberados
              </p>
            </div>
            <p className="mt-3 font-headline text-lg font-extrabold text-[var(--on-surface)]">
              {allowAnyLocation ? 'Qualquer local' : `${selectedLocationIds.length} local(is) autorizado(s)`}
            </p>
            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
              {allowAnyLocation ? 'A marcação é aceita sem geofence específica.' : 'O colaborador só deve registrar nos locais configurados.'}
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2.5">
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Política aplicada
              </p>
              <Select value={selectedPolicyId} onValueChange={handlePolicyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma política" />
                </SelectTrigger>
                <SelectContent>
                  {data.policyCatalog
                    .filter((item) => item.isActive)
                    .map((policy) => (
                      <SelectItem key={policy.id} value={policy.id}>
                        {policy.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                Estratégia de validação
              </p>
              <Controller
                control={form.control}
                name="validationStrategy"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a estratégia" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(validationStrategyLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Controller
              control={form.control}
              name="geolocationRequired"
              render={({ field }) => (
                <div className="flex items-start justify-between gap-4 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
                  <div>
                    <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Geolocalização</p>
                    <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Exige latitude e longitude na marcação.</p>
                  </div>
                  <input
                    aria-label="Exigir geolocalização"
                    checked={field.value}
                    className="mt-1 h-5 w-5 rounded border-[color:color-mix(in_srgb,var(--outline-variant)_35%,transparent)] text-[var(--primary)] focus:ring-[var(--primary-fixed)]"
                    type="checkbox"
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="photoRequired"
              render={({ field }) => (
                <div className="flex items-start justify-between gap-4 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
                  <div>
                    <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Foto obrigatória</p>
                    <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Força captura visual no momento do ponto.</p>
                  </div>
                  <input
                    aria-label="Exigir foto na marcação"
                    checked={field.value}
                    className="mt-1 h-5 w-5 rounded border-[color:color-mix(in_srgb,var(--outline-variant)_35%,transparent)] text-[var(--primary)] focus:ring-[var(--primary-fixed)]"
                    type="checkbox"
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="allowAnyLocation"
              render={({ field }) => (
                <div className="flex items-start justify-between gap-4 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
                  <div>
                    <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Permitir qualquer local</p>
                    <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Libera marcação fora de geofence específica.</p>
                  </div>
                  <input
                    aria-label="Permitir marcação em qualquer local"
                    checked={field.value}
                    className="mt-1 h-5 w-5 rounded border-[color:color-mix(in_srgb,var(--outline-variant)_35%,transparent)] text-[var(--primary)] focus:ring-[var(--primary-fixed)]"
                    disabled={selectedPolicy?.mode === 'company_only' || selectedPolicy?.mode === 'home_only' || selectedPolicy?.requiresAllowedLocations}
                    type="checkbox"
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="blockOutsideAllowedLocations"
              render={({ field }) => (
                <div className="flex items-start justify-between gap-4 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
                  <div>
                    <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Bloquear fora da área</p>
                    <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Quando desligado, envia a marcação para revisão.</p>
                  </div>
                  <input
                    aria-label="Bloquear marcação fora dos locais autorizados"
                    checked={field.value}
                    className="mt-1 h-5 w-5 rounded border-[color:color-mix(in_srgb,var(--outline-variant)_35%,transparent)] text-[var(--primary)] focus:ring-[var(--primary-fixed)]"
                    disabled={allowAnyLocation}
                    type="checkbox"
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                </div>
              )}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPinned className="h-4 w-4 text-[var(--primary)]" />
                <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">Locais autorizados</p>
              </div>

              <div className="grid gap-3">
                {data.locationCatalog.map((location) => {
                  const isSelected = selectedLocationIds.includes(location.id);

                  return (
                    <div
                      key={location.id}
                      className="rounded-[1.25rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-3">
                          <input
                            aria-label={`Autorizar o local ${location.name}`}
                            checked={isSelected}
                            className="mt-1 h-5 w-5 rounded border-[color:color-mix(in_srgb,var(--outline-variant)_35%,transparent)] text-[var(--primary)] focus:ring-[var(--primary-fixed)]"
                            disabled={!requiresAllowedLocations}
                            type="checkbox"
                            onChange={(event) => toggleLocation(location.id, location.type, event.target.checked)}
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-headline text-sm font-extrabold text-[var(--on-surface)]">{location.name}</p>
                              <Badge variant="neutral">{locationTypeLabels[location.type]}</Badge>
                              <Badge variant="info">{location.radiusMeters} m</Badge>
                            </div>
                            <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                              {[location.city, location.state].filter(Boolean).join(' · ') || 'Sem cidade definida'}
                            </p>
                          </div>
                        </div>

                        <div className="min-w-[12rem]">
                          <Controller
                            control={form.control}
                            name={`selectedLocationRoleById.${location.id}`}
                            render={({ field }) => (
                              <Select
                                disabled={!isSelected || !requiresAllowedLocations}
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Papel do local" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(locationRoleLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {form.formState.errors.selectedLocationIds?.message ? (
                <p className="text-xs text-[var(--on-error-container)]">{form.formState.errors.selectedLocationIds.message}</p>
              ) : null}
            </div>

            <div className="space-y-4">
              <FormField
                error={form.formState.errors.notes?.message}
                hint="Use este campo para registrar exceções combinadas com RH, gestor e colaborador."
                label="Observações operacionais"
              >
                <Textarea placeholder="Ex.: colaborador híbrido autorizado para matriz e residência cadastrada." {...form.register('notes')} />
              </FormField>

              <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                  Política padrão do sistema
                </p>
                <p className="mt-3 font-headline text-lg font-extrabold text-[var(--on-surface)]">
                  {data.defaultAttendancePolicyName ?? 'Não definida'}
                </p>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                  {data.inheritedFromDefault
                    ? 'Este colaborador está seguindo a mesma política padrão configurada pela operação.'
                    : 'Este colaborador possui uma política personalizada em relação ao padrão do sistema.'}
                </p>
              </div>

              <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                  Resumo rápido
                </p>
                <div className="mt-3 space-y-3 text-sm text-[var(--on-surface-variant)]">
                  <p>Modo ativo: {attendanceModeLabels[form.getValues('mode')]}</p>
                  <p>Validação: {validationStrategyLabels[form.getValues('validationStrategy')]}</p>
                  <p>{form.getValues('photoRequired') ? 'Foto obrigatória na marcação.' : 'Foto opcional na marcação.'}</p>
                  <p>
                    {allowAnyLocation
                      ? 'Colaborador pode registrar ponto sem geofence específica.'
                      : 'Marcação limitada aos locais autorizados acima.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_15%,transparent)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--on-surface-variant)]">
              Alterações aqui refletem diretamente na política operacional do colaborador.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                disabled={!form.formState.isDirty || updateEmployeeAttendancePolicy.isPending}
                size="lg"
                type="button"
                variant="outline"
                onClick={() => form.reset(toDefaultValues(data))}
              >
                Descartar alterações
              </Button>
              <Button disabled={!form.formState.isDirty || updateEmployeeAttendancePolicy.isPending} size="lg" type="submit">
                {updateEmployeeAttendancePolicy.isPending ? 'Salvando...' : 'Salvar política'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
