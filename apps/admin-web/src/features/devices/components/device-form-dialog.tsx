'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import type { Device } from '@rh-ponto/devices';
import { deviceTypes } from '@rh-ponto/types';
import { Button, Dialog, DialogContent, FormField, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@rh-ponto/ui';
import { deviceFormSchema } from '@rh-ponto/validations';

import { showValidationToast } from '@/shared/lib/form-feedback';

import { useCreateDevice, useUpdateDevice } from '../hooks/use-device-mutations';

type DeviceFormInput = z.input<typeof deviceFormSchema>;
type DeviceFormOutput = z.output<typeof deviceFormSchema>;

interface DeviceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: Device | null;
  onSaved?: (device: Device) => void;
}

const createDefaultValues = (device?: Device | null): DeviceFormInput => ({
  name: device?.name ?? '',
  identifier: device?.identifier ?? '',
  type: device?.type ?? 'kiosk',
  locationName: device?.locationName ?? '',
  description: device?.description ?? '',
  isActive: device?.isActive ?? true,
});

const deviceTypeLabels: Record<(typeof deviceTypes)[number], string> = {
  kiosk: 'Kiosk',
  mobile: 'Mobile',
  web: 'Web',
};

export const DeviceFormDialog = ({ open, onOpenChange, device = null, onSaved }: DeviceFormDialogProps) => {
  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice();
  const isEditMode = device != null;

  const form = useForm<DeviceFormInput, unknown, DeviceFormOutput>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: createDefaultValues(device),
  });

  useEffect(() => {
    if (open) {
      form.reset(createDefaultValues(device));
    }
  }, [device, form, open]);

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        const savedDevice = isEditMode
          ? await updateDevice.mutateAsync({
              id: device.id,
              ...values,
            })
          : await createDevice.mutateAsync(values);

        toast.success(isEditMode ? 'Dispositivo atualizado com sucesso.' : 'Dispositivo criado com sucesso.');
        onSaved?.(savedDevice);
        onOpenChange(false);
      } catch {
        return;
      }
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os dados do dispositivo.',
      });
    },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(96vw,64rem)] rounded-[2rem] p-0">
        <div className="border-b border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] px-5 py-5 sm:px-8 sm:py-7">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
            Gestão de dispositivos
          </p>
          <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-[var(--on-surface)]">
            {isEditMode ? 'Editar dispositivo' : 'Novo dispositivo'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">
            Cadastre o terminal, defina o tipo de integração e mantenha o ponto sincronizado com a operação.
          </p>
        </div>

        <form className="space-y-6 px-5 py-5 sm:px-8 sm:py-7" onSubmit={onSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Nome do dispositivo" error={form.formState.errors.name?.message}>
              <Input placeholder="Tablet Portaria" {...form.register('name')} />
            </FormField>

            <FormField label="Identificador" error={form.formState.errors.identifier?.message}>
              <Input placeholder="TAB-PORT-01" {...form.register('identifier')} />
            </FormField>

            <FormField label="Tipo" error={form.formState.errors.type?.message}>
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {deviceTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Localização" error={form.formState.errors.locationName?.message}>
              <Input placeholder="Recepção" {...form.register('locationName')} />
            </FormField>
          </div>

          <FormField label="Descrição" error={form.formState.errors.description?.message}>
            <Textarea
              className="min-h-32"
              placeholder="Descreva o uso, a área e o contexto operacional do dispositivo."
              {...form.register('description')}
            />
          </FormField>

          <FormField label="Status">
            <label className="flex h-12 items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)]">
              <input className="h-4 w-4" type="checkbox" {...form.register('isActive')} />
              Dispositivo ativo para marcação
            </label>
          </FormField>

          <div className="flex flex-col-reverse gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] pt-6 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button className="w-full sm:w-auto" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto" disabled={createDevice.isPending || updateDevice.isPending} type="submit">
              {createDevice.isPending || updateDevice.isPending ? 'Salvando...' : isEditMode ? 'Salvar alterações' : 'Criar dispositivo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
