import type { UserRole } from './enums';

export const permissionResources = [
  'access-control',
  'audit',
  'batch-import',
  'departments',
  'devices',
  'documents',
  'employees',
  'notifications',
  'payroll',
  'reports',
  'settings',
  'time-records',
  'vacations',
  'work-schedules',
] as const;

export type PermissionResource = (typeof permissionResources)[number];

export const permissionActions = [
  'approve',
  'assign',
  'close',
  'create',
  'delete',
  'export',
  'import',
  'manage',
  'read',
  'review',
  'update',
] as const;

export type PermissionAction = (typeof permissionActions)[number];

export type AppPermission = `${PermissionResource}.${PermissionAction}`;

export interface PermissionRule {
  resource: PermissionResource;
  label: string;
  description: string;
  permissions: AppPermission[];
}

const buildPermissions = (resource: PermissionResource, actions: readonly PermissionAction[]): AppPermission[] =>
  actions.map((action) => `${resource}.${action}` as AppPermission);

export const permissionRules: PermissionRule[] = [
  {
    resource: 'access-control',
    label: 'Acesso e permissões',
    description: 'Gerencia papéis, acesso administrativo e regras de visibilidade.',
    permissions: buildPermissions('access-control', ['read', 'manage']),
  },
  {
    resource: 'audit',
    label: 'Auditoria',
    description: 'Consulta e exporta a trilha de eventos da operação.',
    permissions: buildPermissions('audit', ['read', 'export']),
  },
  {
    resource: 'batch-import',
    label: 'Importação em lote',
    description: 'Cria cadastros e sincroniza dados por arquivo.',
    permissions: buildPermissions('batch-import', ['read', 'import']),
  },
  {
    resource: 'departments',
    label: 'Departamentos',
    description: 'Mantém a estrutura organizacional do RH.',
    permissions: buildPermissions('departments', ['read', 'create', 'update', 'delete']),
  },
  {
    resource: 'devices',
    label: 'Dispositivos',
    description: 'Cadastra e mantém terminais de ponto e sincronização.',
    permissions: buildPermissions('devices', ['read', 'create', 'update', 'delete']),
  },
  {
    resource: 'documents',
    label: 'Documentos',
    description: 'Acompanha arquivos, assinaturas e conferências.',
    permissions: buildPermissions('documents', ['read', 'review', 'export']),
  },
  {
    resource: 'employees',
    label: 'Funcionários',
    description: 'Gerencia o cadastro, vínculo e ciclo de vida dos colaboradores.',
    permissions: buildPermissions('employees', ['read', 'create', 'update', 'delete', 'import']),
  },
  {
    resource: 'notifications',
    label: 'Notificações',
    description: 'Distribui alertas operacionais e administrativos.',
    permissions: buildPermissions('notifications', ['read', 'manage']),
  },
  {
    resource: 'payroll',
    label: 'Folha',
    description: 'Consolida fechamento, espelhos e exportações de folha.',
    permissions: buildPermissions('payroll', ['read', 'review', 'close', 'export']),
  },
  {
    resource: 'reports',
    label: 'Relatórios',
    description: 'Gera relatórios operacionais e exportações recorrentes.',
    permissions: buildPermissions('reports', ['read', 'export']),
  },
  {
    resource: 'settings',
    label: 'Configurações',
    description: 'Ajusta jornada, geofence, alertas e políticas padrão.',
    permissions: buildPermissions('settings', ['read', 'update']),
  },
  {
    resource: 'time-records',
    label: 'Marcações',
    description: 'Registra, ajusta e exporta batidas de ponto.',
    permissions: buildPermissions('time-records', ['read', 'create', 'update', 'review', 'export']),
  },
  {
    resource: 'vacations',
    label: 'Férias',
    description: 'Acompanha solicitações, aprovações e saldo.',
    permissions: buildPermissions('vacations', ['read', 'create', 'approve', 'review']),
  },
  {
    resource: 'work-schedules',
    label: 'Escalas',
    description: 'Cria, atualiza e atribui jornadas de trabalho.',
    permissions: buildPermissions('work-schedules', ['read', 'create', 'update', 'delete', 'assign']),
  },
];

export const allPermissions = Array.from(new Set(permissionRules.flatMap((rule) => rule.permissions)));

const employeePermissions: AppPermission[] = [
  'documents.read',
  'notifications.read',
  'payroll.read',
  'reports.read',
  'time-records.create',
  'time-records.read',
  'vacations.create',
  'vacations.read',
];

const kioskPermissions: AppPermission[] = ['time-records.create', 'time-records.read'];

const uniquePermissions = (permissions: AppPermission[]): AppPermission[] => Array.from(new Set(permissions));

export const rolePermissionMap: Record<UserRole, AppPermission[]> = {
  admin: uniquePermissions(allPermissions),
  employee: uniquePermissions(employeePermissions),
  kiosk: uniquePermissions(kioskPermissions),
};

export const getPermissionsForRole = (role: UserRole): AppPermission[] => rolePermissionMap[role];

export const hasPermission = (role: UserRole, permission: AppPermission): boolean =>
  rolePermissionMap[role].includes(permission);
