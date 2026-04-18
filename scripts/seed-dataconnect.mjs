import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

import { initializeApp } from 'firebase-admin/app';
import { getDataConnect } from 'firebase-admin/data-connect';

const serviceId = 'myrh-32b0a-service';
const location = 'southamerica-east1';
const seedFilePath = resolve(process.cwd(), 'dataconnect/example/seed-data.gql');
const fallbackCredentialsPath = resolve(
  process.env.APPDATA ?? '',
  'firebase',
  'gui14511_gmail_com_application_default_credentials.json'
);

const seedBatches = [
  ['users', /^  user_upsertMany\(/, /^  departmentManagers_upsertMany:/],
  ['departments-base', /^  departmentManagers_upsertMany:/, /^  employee_upsertMany\(/],
  ['employees', /^  employee_upsertMany\(/, /^  departmentLeads_upsertMany:/],
  ['departments-managers', /^  departmentLeads_upsertMany:/, /^  device_upsertMany\(/],
  ['devices', /^  device_upsertMany\(/, /^  workSchedule_upsertMany\(/],
  ['work-schedules', /^  workSchedule_upsertMany\(/, /^  employeeScheduleHistory_upsertMany\(/],
  ['schedule-history', /^  employeeScheduleHistory_upsertMany\(/, /^  timeRecord_upsertMany\(/],
  ['time-records', /^  timeRecord_upsertMany\(/, /^  timeRecordPhoto_upsertMany\(/],
  ['time-record-photos', /^  timeRecordPhoto_upsertMany\(/, /^  justification_upsertMany\(/],
  ['justifications', /^  justification_upsertMany\(/, /^  justificationAttachment_upsertMany\(/],
  ['justification-attachments', /^  justificationAttachment_upsertMany\(/, /^  auditLog_upsertMany\(/],
  ['audit-logs', /^  auditLog_upsertMany\(/, /^  vacationRequest_upsertMany\(/],
  ['vacation-requests', /^  vacationRequest_upsertMany\(/, /^  employeeDocument_upsertMany\(/],
  ['employee-documents', /^  employeeDocument_upsertMany\(/, /^  payrollStatement_upsertMany\(/],
  ['payroll-statements', /^  payrollStatement_upsertMany\(/, /^  payrollClosure_upsertMany\(/],
  ['payroll-closures', /^  payrollClosure_upsertMany\(/, /^  workLocation_upsertMany\(/],
  ['work-locations', /^  workLocation_upsertMany\(/, /^  attendancePolicy_upsertMany\(/],
  ['attendance-policies', /^  attendancePolicy_upsertMany\(/, /^  employeeAttendancePolicy_upsertMany\(/],
  ['employee-attendance-policies', /^  employeeAttendancePolicy_upsertMany\(/, /^  employeeAllowedLocation_upsertMany\(/],
  ['employee-allowed-locations', /^  employeeAllowedLocation_upsertMany\(/, /^  onboardingJourney_upsertMany\(/],
  ['onboarding-journeys', /^  onboardingJourney_upsertMany\(/, /^  onboardingTask_upsertMany\(/],
  ['onboarding-tasks', /^  onboardingTask_upsertMany\(/, /^  adminSettings_upsertMany\(/],
  ['admin-settings', /^  adminSettings_upsertMany\(/, /^  employeeNotificationPreference_upsertMany\(/],
  ['employee-notification-preferences', /^  employeeNotificationPreference_upsertMany\(/, /^  adminNotification_upsertMany\(/],
  ['admin-notifications', /^  adminNotification_upsertMany\(/, /^}\s*$/],
];

const argumentsSet = new Set(process.argv.slice(2));
const isRemoteSeed = argumentsSet.has('--remote');
const isEmulatorSeed = argumentsSet.has('--emulator');

const buildBatchMutation = (lines, startPattern, endPattern, batchName) => {
  const startIndex = lines.findIndex((line) => startPattern.test(line));
  const endIndex = lines.findIndex((line, index) => index > startIndex && endPattern.test(line));

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Não foi possível localizar o bloco de seed "${batchName}".`);
  }

  const body = lines.slice(startIndex, endIndex).join('\n');

  return `mutation Seed${batchName.replace(/[^a-zA-Z0-9]/g, '')}
@auth(level: USER, insecureReason: "Operação administrativa de seed para ambientes internos.")
@transaction {
${body}
}`;
};

const main = async () => {
  if (isRemoteSeed) {
    delete process.env.DATA_CONNECT_EMULATOR_HOST;
  }

  if (isEmulatorSeed && !process.env.DATA_CONNECT_EMULATOR_HOST) {
    process.env.DATA_CONNECT_EMULATOR_HOST = '127.0.0.1:9399';
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && existsSync(fallbackCredentialsPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = fallbackCredentialsPath;
  }

  if (!process.env.DATA_CONNECT_EMULATOR_HOST && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      'Seed remoto exige credenciais administrativas. Defina GOOGLE_APPLICATION_CREDENTIALS com o caminho do JSON da service account ou configure Application Default Credentials antes de executar.'
    );
  }

  initializeApp();

  const seedMutation = await readFile(seedFilePath, 'utf8');
  const seedLines = seedMutation.split(/\r?\n/);
  const dataConnect = getDataConnect({ serviceId, location });
  const results = [];

  for (const [batchName, startPattern, endPattern] of seedBatches) {
    const mutation = buildBatchMutation(seedLines, startPattern, endPattern, batchName);
    const response = await dataConnect.executeGraphql(mutation);

    results.push({
      batch: batchName,
      hasData: Boolean(response?.data),
    });
  }

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        target: process.env.DATA_CONNECT_EMULATOR_HOST ? 'emulator' : 'remote',
        batches: results,
      },
      null,
      2
    )
  );
};

main().catch((error) => {
  console.error('Falha ao executar seed do Data Connect.');
  if (process.env.DATA_CONNECT_EMULATOR_HOST) {
    console.error(
      `O script tentou usar o emulator em ${process.env.DATA_CONNECT_EMULATOR_HOST}. Se quiser enviar para o banco remoto, remova DATA_CONNECT_EMULATOR_HOST ou use o script dataconnect:seed:remote.`
    );
  }
  console.error(error);
  process.exitCode = 1;
});
