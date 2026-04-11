'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import type { Device } from '@rh-ponto/devices';
import type { Employee } from '@rh-ponto/employees';
import type { TimeRecord } from '@rh-ponto/time-records';
import {
  timeRecordSources,
  timeRecordStatuses,
  timeRecordTypes,
  type TimeRecordSource,
  type TimeRecordStatus,
  type TimeRecordType,
} from '@rh-ponto/types';
import {
  Button,
  Dialog,
  DialogContent,
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rh-ponto/ui';
import { timeRecordFormSchema, type TimeRecordFormSchema } from '@rh-ponto/validations';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { showValidationToast } from '@/shared/lib/form-feedback';

import { useAdjustTimeRecord, useCreateTimeRecord } from '../hooks/use-time-record-mutations';

type TimeRecordFormInput = z.input<typeof timeRecordFormSchema>;

interface TimeRecordDialogProps {
  devices: Device[];
  employees: Employee[];
  mode: 'create' | 'adjust';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: TimeRecord | null;
  recordedByUserId?: string | null;
}

const labelByRecordType: Record<TimeRecordType, string> = {
  entry: 'Entrada',
  break_start: 'Início do intervalo',
  break_end: 'Fim do intervalo',
  exit: 'Saída',
};

const labelBySource: Record<TimeRecordSource, string> = {
  kiosk: 'Kiosk',
  employee_app: 'Aplicativo do colaborador',
  admin_adjustment: 'Ajuste administrativo',
};

const labelByStatus: Record<TimeRecordStatus, string> = {
  valid: 'Válido',
  pending_review: 'Em revisão',
  adjusted: 'Ajustado',
  rejected: 'Rejeitado',
};

const toDateTimeLocal = (value?: string | Date | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const createDefaultValues = (record?: TimeRecord | null): TimeRecordFormInput => ({
  employeeId: record?.employeeId ?? '',
  deviceId: record?.deviceId ?? '',
  recordType: record?.recordType ?? 'entry',
  source: record?.source ?? 'admin_adjustment',
  status: record?.status ?? 'valid',
  recordedAt: toDateTimeLocal(record?.recordedAt),
  notes: record?.notes ?? '',
});

const noDeviceValue = '__none__';

export const CreateTimeRecordDialog = ({
  devices,
  employees,
  mode,
  open,
  onOpenChange,
  record = null,
  recordedByUserId = null,
}: TimeRecordDialogProps) => {
  const createTimeRecord = useCreateTimeRecord();
  const adjustTimeRecord = useAdjustTimeRecord();
  const isAdjustMode = mode === 'adjust' && record != null;
  const [pendingValues, setPendingValues] = useState<TimeRecordFormSchema | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const form = useForm<TimeRecordFormInput, unknown, TimeRecordFormSchema>({
    resolver: zodResolver(timeRecordFormSchema),
    defaultValues: createDefaultValues(record),
  });

  useEffect(() => {
    if (open) {
      form.reset(createDefaultValues(record));
    }
  }, [form, open, record]);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === pendingValues?.employeeId) ?? null,
    [employees, pendingValues?.employeeId],
  );
  const selectedDevice = useMemo(
    () => devices.find((device) => device.id === pendingValues?.deviceId) ?? null,
    [devices, pendingValues?.deviceId],
  );

  const handleSubmit = form.handleSubmit(
    async (values) => {
      setPendingValues(values);
      setIsConfirmationOpen(true);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: isAdjustMode ? 'Revise os dados do ajuste.' : 'Revise os dados da marcação.',
      });
    },
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[min(96vw,52rem)] rounded-[2rem] p-0">
          <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-7">
            <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
              Marcações operacionais
            </p>
            <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
              {isAdjustMode ? 'Ajustar marcação' : 'Nova marcação manual'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
              {isAdjustMode
                ? 'Atualize o horário da marcação e registre a observação do ajuste.'
                : 'Registre uma nova marcação administrativa diretamente na base operacional.'}
            </p>
          </div>

          <form className="space-y-6 px-5 py-5 sm:px-8 sm:py-7" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Colaborador" error={form.formState.errors.employeeId?.message}>
                <Controller
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <Select disabled={isAdjustMode} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.filter((employee) => employee.isActive).map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Dispositivo">
                <Controller
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value === noDeviceValue ? '' : value)}
                      value={typeof field.value === 'string' && field.value.length > 0 ? field.value : noDeviceValue}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um dispositivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={noDeviceValue}>Sem dispositivo</SelectItem>
                        {devices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Tipo de marcação" error={form.formState.errors.recordType?.message}>
                <Controller
                  control={form.control}
                  name="recordType"
                  render={({ field }) => (
                    <Select disabled={isAdjustMode} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeRecordTypes.map((item) => (
                          <SelectItem key={item} value={item}>
                            {labelByRecordType[item]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Origem" error={form.formState.errors.source?.message}>
                <Controller
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <Select disabled={isAdjustMode} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a origem" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeRecordSources.map((item) => (
                          <SelectItem key={item} value={item}>
                            {labelBySource[item]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Status" error={form.formState.errors.status?.message}>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select disabled={isAdjustMode} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeRecordStatuses.map((item) => (
                          <SelectItem key={item} value={item}>
                            {labelByStatus[item]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Data e hora" error={form.formState.errors.recordedAt?.message}>
                <Input type="datetime-local" {...form.register('recordedAt')} />
              </FormField>
            </div>

            <FormField label="Observações" hint="Opcional, mas recomendado para rastreabilidade do ajuste.">
              <Input {...form.register('notes')} />
            </FormField>

            <div className="flex flex-col-reverse gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] pt-6 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button className="w-full sm:w-auto" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={createTimeRecord.isPending || adjustTimeRecord.isPending}
                type="submit"
              >
                {createTimeRecord.isPending || adjustTimeRecord.isPending
                  ? 'Salvando...'
                  : isAdjustMode
                    ? 'Salvar ajuste'
                    : 'Criar marcação'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ActionConfirmationDialog
        confirmLabel={isAdjustMode ? 'Confirmar ajuste' : 'Confirmar marcação'}
        description={
          isAdjustMode
            ? 'Confira as informações abaixo antes de aplicar o ajuste na marcação.'
            : 'Confira as informações abaixo antes de registrar a nova marcação.'
        }
        isPending={createTimeRecord.isPending || adjustTimeRecord.isPending}
        onConfirm={async () => {
          if (!pendingValues) {
            return;
          }

          if (isAdjustMode) {
            await adjustTimeRecord.mutateAsync({
              timeRecordId: record.id,
              recordedAt: new Date(pendingValues.recordedAt).toISOString(),
              notes: pendingValues.notes ?? null,
            });

            toast.success('Marcação ajustada com sucesso.');
          } else {
            await createTimeRecord.mutateAsync({
              employeeId: pendingValues.employeeId,
              deviceId: pendingValues.deviceId ?? null,
              recordedByUserId,
              recordType: pendingValues.recordType,
              source: pendingValues.source,
              status: pendingValues.status,
              recordedAt: new Date(pendingValues.recordedAt).toISOString(),
              originalRecordedAt: null,
              notes: pendingValues.notes ?? null,
              isManual: pendingValues.source === 'admin_adjustment',
              referenceRecordId: null,
              latitude: null,
              longitude: null,
              ipAddress: null,
            });

            toast.success('Marcação criada com sucesso.');
          }

          form.reset(createDefaultValues(null));
          setPendingValues(null);
          onOpenChange(false);
        }}
        onOpenChange={(open) => {
          setIsConfirmationOpen(open);
          if (!open) {
            setPendingValues(null);
          }
        }}
        open={isConfirmationOpen}
        summary={[
          { label: 'Colaborador', value: selectedEmployee?.fullName ?? '-' },
          { label: 'Dispositivo', value: selectedDevice?.name ?? 'Sem dispositivo' },
          { label: 'Tipo', value: pendingValues ? labelByRecordType[pendingValues.recordType] : '-' },
          { label: 'Origem', value: pendingValues ? labelBySource[pendingValues.source] : '-' },
          { label: 'Status', value: pendingValues ? labelByStatus[pendingValues.status] : '-' },
          { label: 'Data e hora', value: pendingValues?.recordedAt ?? '-' },
        ]}
        title={isAdjustMode ? 'Confirmar ajuste da marcação' : 'Confirmar nova marcação'}
      />
    </>
  );
};
