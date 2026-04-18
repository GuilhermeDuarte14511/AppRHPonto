'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { formatDateTime } from '@rh-ponto/core';
import type { Device } from '@rh-ponto/devices';
import { Badge, Button, Card, DataTable, ErrorState, PageHeader } from '@rh-ponto/ui';
import { PencilLine, Plus, PowerOff, RefreshCw, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

import { ActionConfirmationDialog } from '@/shared/components/action-confirmation-dialog';
import { PermissionGate } from '@/shared/components/permission-gate';
import { TablePageSkeleton } from '@/shared/components/page-skeletons';
import { StatCard } from '@/shared/components/stat-card';
import { getActionErrorMessage } from '@/shared/lib/mutation-feedback';

import { useDevices } from '../hooks/use-devices';
import { useDeactivateDevice } from '../hooks/use-device-mutations';
import { DeviceFormDialog } from './device-form-dialog';

const deviceTypeLabel: Record<Device['type'], string> = {
  kiosk: 'Kiosk',
  mobile: 'Mobile',
  web: 'Web',
};

const deviceStatusVariant = {
  active: 'success',
  inactive: 'danger',
} as const;

export const DeviceListView = () => {
  const { data, error, isError, isLoading, refetch } = useDevices();
  const deactivateDevice = useDeactivateDevice();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deactivatingDevice, setDeactivatingDevice] = useState<Device | null>(null);
  const deferredSearch = useDeferredValue(search);

  const devices = useMemo(() => data ?? [], [data]);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredDevices = useMemo(
    () =>
      devices.filter((device) =>
        [
          device.name,
          device.identifier,
          device.locationName,
          device.description,
          device.type,
          device.isActive ? 'ativo' : 'inativo',
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      ),
    [devices, normalizedSearch],
  );

  const activeDevices = devices.filter((device) => device.isActive).length;
  const inactiveDevices = devices.length - activeDevices;
  const syncedDevices = devices.filter((device) => device.lastSyncAt != null).length;

  if (isLoading) {
    return <TablePageSkeleton />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar os dispositivos"
        description={getActionErrorMessage(error, 'Tente novamente para abrir o cadastro de dispositivos.')}
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Operação / Dispositivos"
        title="Gestão de dispositivos"
        description="Cadastre terminais, acompanhe a sincronização e mantenha a operação de ponto sob controle."
        actions={
          <>
            <Button className="shrink-0 whitespace-nowrap" size="lg" variant="outline" onClick={() => void refetch()}>
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            <PermissionGate requires="devices.create">
              <Button className="shrink-0 whitespace-nowrap" size="lg" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Novo dispositivo
              </Button>
            </PermissionGate>
          </>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          badge="Base ativa"
          hint="Dispositivos disponíveis para bater ponto e sincronizar eventos."
          icon={Smartphone}
          label="Dispositivos ativos"
          value={String(activeDevices)}
        />
        <StatCard
          badge="Atenção"
          hint="Terminais desativados ou fora da operação."
          icon={PowerOff}
          label="Dispositivos inativos"
          tone="danger"
          value={String(inactiveDevices)}
        />
        <StatCard
          badge="Sincronização"
          hint="Dispositivos com última sincronização registrada."
          icon={RefreshCw}
          label="Com sync"
          tone="secondary"
          value={String(syncedDevices)}
        />
        <Card className="primary-gradient p-6 text-white">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/78">Dispositivos</p>
          <p className="mt-3 font-headline text-4xl font-extrabold">{devices.length}</p>
          <p className="mt-4 text-sm text-white/82">
            {filteredDevices.length} exibidos no filtro atual com base em nome, tipo, local ou identificador.
          </p>
        </Card>
      </section>

      <Card className="p-5 sm:p-6">
        <label className="space-y-2">
          <span className="px-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
            Buscar dispositivo
          </span>
          <input
            className="h-12 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
            placeholder="Buscar por nome, identificador, tipo ou local"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </Card>

      <DataTable
        columns={[
          {
            key: 'name',
            label: 'Dispositivo',
            render: (item) => (
              <div className="space-y-1">
                <p className="font-semibold text-[var(--on-surface)]">{item.name}</p>
                <p className="text-xs text-[var(--on-surface-variant)]">ID {item.identifier}</p>
              </div>
            ),
          },
          {
            key: 'type',
            label: 'Tipo',
            render: (item) => <Badge variant="neutral">{deviceTypeLabel[item.type]}</Badge>,
          },
          {
            key: 'locationName',
            label: 'Localização',
            render: (item) => item.locationName ?? 'Sem local',
          },
          {
            key: 'lastSyncAt',
            label: 'Último sync',
            render: (item) => item.lastSyncAt ? formatDateTime(item.lastSyncAt) : 'Sem sincronização',
          },
          {
            key: 'isActive',
            label: 'Status',
            render: (item) => (
              <Badge variant={item.isActive ? deviceStatusVariant.active : deviceStatusVariant.inactive}>
                {item.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            ),
          },
          {
            key: 'actions',
            label: 'Ações',
            headerClassName: 'text-right',
            cellClassName: 'text-right',
            render: (item) => (
              <div className="flex justify-end gap-2">
                <PermissionGate requires="devices.update">
                  <Button className="h-9 w-9 rounded-full p-0" size="sm" variant="ghost" onClick={() => setEditingDevice(item)}>
                    <PencilLine className="h-4 w-4" />
                  </Button>
                </PermissionGate>
                <PermissionGate requires="devices.delete">
                  <Button
                    className="h-9 w-9 rounded-full p-0"
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeactivatingDevice(item)}
                  >
                    <PowerOff className="h-4 w-4" />
                  </Button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
        emptyState={<span>Nenhum dispositivo encontrado para o filtro aplicado.</span>}
        getRowKey={(item) => item.id}
        items={filteredDevices}
      />

      <DeviceFormDialog onOpenChange={setIsCreateOpen} open={isCreateOpen} />
      <DeviceFormDialog
        device={editingDevice}
        onOpenChange={(open) => !open && setEditingDevice(null)}
        open={editingDevice != null}
      />

      <ActionConfirmationDialog
        confirmLabel="Desativar dispositivo"
        confirmVariant="destructive"
        description="O dispositivo deixará de aceitar novos vínculos até ser reativado no cadastro."
        isPending={deactivateDevice.isPending}
        onConfirm={async () => {
          try {
            if (!deactivatingDevice) {
              return;
            }

            await deactivateDevice.mutateAsync(deactivatingDevice.id);
            toast.success('Dispositivo desativado com sucesso.');
            setDeactivatingDevice(null);
          } catch {
            return;
          }
        }}
        onOpenChange={(open) => {
          if (!open) {
            setDeactivatingDevice(null);
          }
        }}
        open={deactivatingDevice != null}
        summary={[
          { label: 'Nome', value: deactivatingDevice?.name ?? '-' },
          { label: 'Identificador', value: deactivatingDevice?.identifier ?? '-' },
          { label: 'Tipo', value: deactivatingDevice ? deviceTypeLabel[deactivatingDevice.type] : '-' },
          { label: 'Local', value: deactivatingDevice?.locationName ?? 'Sem local' },
        ]}
        title="Desativar dispositivo"
      />
    </div>
  );
};
