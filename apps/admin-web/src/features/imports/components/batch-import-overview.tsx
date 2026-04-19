'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, FileUp, LoaderCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

import type { CreateDevicePayload } from '@rh-ponto/devices';
import type { CreateEmployeePayload } from '@rh-ponto/employees';
import { deviceTypes } from '@rh-ponto/types';
import { Badge, Button, Card, DataTable, PageHeader } from '@rh-ponto/ui';

import { PermissionGate } from '@/shared/components/permission-gate';
import { StatCard } from '@/shared/components/stat-card';

import { useCreateDevice } from '@/features/devices/hooks/use-device-mutations';
import { useCreateEmployee } from '@/features/employees/hooks/use-create-employee';

type ImportKind = 'employees' | 'devices';

type ImportRow = Record<string, string>;
type PreviewRow = { __rowKey: string } & ImportRow;

const splitCsvLine = (line: string): string[] => {
  const separator = line.includes(';') && !line.includes(',') ? ';' : ',';
  const values: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];

      if (insideQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
        continue;
      }

      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === separator && !insideQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += character;
  }

  values.push(current.trim());

  return values;
};

const parseCsvText = (text: string): ImportRow[] => {
  const normalized = text.trim();

  if (!normalized) {
    return [];
  }

  const [headerLine, ...dataLines] = normalized.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(headerLine).map((header) => header.trim());

  return dataLines.map((line) => {
    const values = splitCsvLine(line);

    return headers.reduce<ImportRow>((row, header, index) => {
      row[header] = values[index] ?? '';
      return row;
    }, {});
  });
};

const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(reader.error ?? new Error('Não foi possível ler o arquivo.'));
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.readAsText(file, 'utf-8');
  });

interface BatchImportPanelProps {
  title: string;
  description: string;
  kind: ImportKind;
  csvExample: string;
}

const BatchImportPanel = ({ title, description, kind, csvExample }: BatchImportPanelProps) => {
  const employeeImport = useCreateEmployee();
  const deviceImport = useCreateDevice();
  const [csvText, setCsvText] = useState(csvExample);
  const [lastImported, setLastImported] = useState<number>(0);
  const rows = useMemo(() => parseCsvText(csvText), [csvText]);
  const previewRows: PreviewRow[] = rows.slice(0, 5).map((row, index) => ({ __rowKey: `${kind}-${index}`, ...row }));

  const isEmployeeKind = kind === 'employees';
  const isPending = isEmployeeKind ? employeeImport.isPending : deviceImport.isPending;

  const handleImport = async () => {
    if (rows.length === 0) {
      toast.error('Adicione pelo menos uma linha válida para importar.');
      return;
    }

    try {
      if (kind === 'employees') {
        for (const row of rows) {
          const isActive = row.isActive?.trim().toLowerCase() !== 'false';

          const payload: CreateEmployeePayload = {
            registrationNumber: row.registrationNumber ?? '',
            fullName: row.fullName ?? '',
            cpf: row.cpf?.trim() ? row.cpf : null,
            email: row.email?.trim() ? row.email : null,
            phone: row.phone?.trim() ? row.phone : null,
            birthDate: row.birthDate?.trim() ? row.birthDate : null,
            hireDate: row.hireDate?.trim() ? row.hireDate : null,
            departmentId: row.departmentId?.trim() ? row.departmentId : null,
            position: row.position?.trim() ? row.position : null,
            profilePhotoUrl: row.profilePhotoUrl?.trim() ? row.profilePhotoUrl : null,
            pinCode: row.pinCode?.trim() ? row.pinCode : null,
            isActive,
            userId: row.userId?.trim() ? row.userId : null,
          };

          await employeeImport.mutateAsync(payload);
        }
      } else {
        for (const row of rows) {
          const normalizedType = row.type?.trim().toLowerCase() as CreateDevicePayload['type'];
          const isActive = row.isActive?.trim().toLowerCase() !== 'false';

          const payload: CreateDevicePayload = {
            name: row.name ?? '',
            identifier: row.identifier ?? '',
            type: deviceTypes.includes(normalizedType) ? normalizedType : 'kiosk',
            locationName: row.locationName?.trim() ? row.locationName : null,
            description: row.description?.trim() ? row.description : null,
            isActive,
          };

          await deviceImport.mutateAsync(payload);
        }
      }

      setLastImported(rows.length);
      toast.success(`${rows.length} registro(s) importado(s) com sucesso.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível concluir a importação em lote.';
      toast.error(message);
    }
  };

  return (
    <Card className="p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">{title}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">{description}</p>
        </div>
        <Badge variant="neutral">{rows.length} linha(s)</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <textarea
          className="min-h-56 w-full rounded-[1rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-low)] px-4 py-3 text-sm text-[var(--on-surface)] outline-none transition focus:border-[var(--primary)]"
          value={csvText}
          onChange={(event) => setCsvText(event.target.value)}
        />
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1rem] border border-dashed border-[color:color-mix(in_srgb,var(--outline-variant)_24%,transparent)] bg-[var(--surface-container-low)] px-5 py-8 text-center">
          <input
            className="hidden"
            type="file"
            accept=".csv,text/csv"
            onChange={async (event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              setCsvText(await readFileAsText(file));
            }}
          />
          <Upload className="h-5 w-5 text-[var(--primary)]" />
          <span className="text-sm font-semibold text-[var(--on-surface)]">Carregar CSV</span>
          <span className="text-xs text-[var(--on-surface-variant)]">Ou cole os dados no campo ao lado</span>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="info">{previewRows.length} preview</Badge>
        {lastImported > 0 ? <Badge variant="success">{lastImported} importados</Badge> : null}
      </div>

      <div className="mt-6">
        <DataTable<PreviewRow>
          columns={
            kind === 'employees'
              ? [
                  { key: 'registrationNumber', label: 'Matrícula' },
                  { key: 'fullName', label: 'Nome' },
                  { key: 'departmentId', label: 'Departamento' },
                  { key: 'position', label: 'Cargo' },
                  {
                    key: 'isActive',
                    label: 'Status',
                    render: (item) => <Badge variant={item.isActive?.toLowerCase() === 'false' ? 'danger' : 'success'}>{item.isActive?.toLowerCase() === 'false' ? 'Inativo' : 'Ativo'}</Badge>,
                  },
                ]
              : [
                  { key: 'name', label: 'Nome' },
                  { key: 'identifier', label: 'Identificador' },
                  { key: 'type', label: 'Tipo' },
                  { key: 'locationName', label: 'Local' },
                  {
                    key: 'isActive',
                    label: 'Status',
                    render: (item) => <Badge variant={item.isActive?.toLowerCase() === 'false' ? 'danger' : 'success'}>{item.isActive?.toLowerCase() === 'false' ? 'Inativo' : 'Ativo'}</Badge>,
                  },
                ]
          }
          emptyState="Nenhuma linha válida encontrada."
          getRowKey={(item) => item.__rowKey}
          items={previewRows}
        />
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] pt-6 sm:flex-row sm:justify-end">
        <PermissionGate requires={kind === 'employees' ? 'employees.import' : 'batch-import.import'}>
          <Button disabled={isPending || rows.length === 0} onClick={() => void handleImport()}>
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            Importar registros
          </Button>
        </PermissionGate>
      </div>
    </Card>
  );
};

export const BatchImportOverview = () => {
  const [activeKind, setActiveKind] = useState<ImportKind>('employees');

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        eyebrow="Importação / Lote"
        title="Importação em lote"
        description="Cole ou carregue um CSV para criar colaboradores e dispositivos em massa sem sair do painel administrativo."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard badge="Funcionários" hint="Base para admissão em lote." icon={ArrowRight} label="Entrada suportada" value="CSV" />
        <StatCard badge="Dispositivos" hint="Cadastro rápido de terminais e locais." icon={ArrowRight} label="Tipos suportados" tone="secondary" value="CSV" />
        <Card className="primary-gradient p-6 text-white">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/78">Fluxo</p>
          <p className="mt-3 font-headline text-4xl font-extrabold">2</p>
          <p className="mt-4 text-sm text-white/82">Dois modelos prontos para acelerar a entrada inicial da operação.</p>
        </Card>
        <Card className="p-6">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">Modo</p>
          <div className="mt-4 flex gap-2">
            <Button variant={activeKind === 'employees' ? 'default' : 'outline'} onClick={() => setActiveKind('employees')}>
              Funcionários
            </Button>
            <Button variant={activeKind === 'devices' ? 'default' : 'outline'} onClick={() => setActiveKind('devices')}>
              Dispositivos
            </Button>
          </div>
        </Card>
      </section>

      {activeKind === 'employees' ? (
        <BatchImportPanel
          csvExample={`registrationNumber,fullName,email,departmentId,position,isActive\n1001,Marina Souza,marina@empresa.com,dept-rh,Analista de RH,true\n1002,João Lima,joao@empresa.com,dept-ti,Suporte,false`}
          description="Crie colaboradores em massa usando matrícula, nome completo e campos opcionais do cadastro."
          kind="employees"
          title="Importação de colaboradores"
        />
      ) : (
        <BatchImportPanel
          csvExample={`name,identifier,type,locationName,description,isActive\nTablet Portaria,TAB-PORT-01,kiosk,Recepção,Terminal principal,true\nPainel Web,WEB-ADM-01,web,Escritório,Painel administrativo,true`}
          description="Cadastre terminais, painéis web ou devices mobile com localização e descrição em lote."
          kind="devices"
          title="Importação de dispositivos"
        />
      )}
    </div>
  );
};
