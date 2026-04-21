import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'myrh-32b0a-service',
  location: 'southamerica-east1'
};
export const listDepartmentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDepartments');
}
listDepartmentsRef.operationName = 'ListDepartments';

export function listDepartments(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listDepartmentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getDepartmentByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDepartmentById', inputVars);
}
getDepartmentByIdRef.operationName = 'GetDepartmentById';

export function getDepartmentById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDepartmentByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createDepartmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDepartment', inputVars);
}
createDepartmentRef.operationName = 'CreateDepartment';

export function createDepartment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDepartmentRef(dcInstance, inputVars));
}

export const updateDepartmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDepartment', inputVars);
}
updateDepartmentRef.operationName = 'UpdateDepartment';

export function updateDepartment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateDepartmentRef(dcInstance, inputVars));
}

export const deleteDepartmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDepartment', inputVars);
}
deleteDepartmentRef.operationName = 'DeleteDepartment';

export function deleteDepartment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteDepartmentRef(dcInstance, inputVars));
}

export const listJustificationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListJustifications');
}
listJustificationsRef.operationName = 'ListJustifications';

export function listJustifications(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listJustificationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getJustificationByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetJustificationById', inputVars);
}
getJustificationByIdRef.operationName = 'GetJustificationById';

export function getJustificationById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getJustificationByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listJustificationAttachmentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListJustificationAttachments');
}
listJustificationAttachmentsRef.operationName = 'ListJustificationAttachments';

export function listJustificationAttachments(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listJustificationAttachmentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createJustificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateJustification', inputVars);
}
createJustificationRef.operationName = 'CreateJustification';

export function createJustification(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createJustificationRef(dcInstance, inputVars));
}

export const approveJustificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ApproveJustification', inputVars);
}
approveJustificationRef.operationName = 'ApproveJustification';

export function approveJustification(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(approveJustificationRef(dcInstance, inputVars));
}

export const rejectJustificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RejectJustification', inputVars);
}
rejectJustificationRef.operationName = 'RejectJustification';

export function rejectJustification(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(rejectJustificationRef(dcInstance, inputVars));
}

export const addJustificationAttachmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddJustificationAttachment', inputVars);
}
addJustificationAttachmentRef.operationName = 'AddJustificationAttachment';

export function addJustificationAttachment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addJustificationAttachmentRef(dcInstance, inputVars));
}

export const listVacationRequestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVacationRequests');
}
listVacationRequestsRef.operationName = 'ListVacationRequests';

export function listVacationRequests(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listVacationRequestsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getVacationRequestByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVacationRequestById', inputVars);
}
getVacationRequestByIdRef.operationName = 'GetVacationRequestById';

export function getVacationRequestById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getVacationRequestByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createVacationRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVacationRequest', inputVars);
}
createVacationRequestRef.operationName = 'CreateVacationRequest';

export function createVacationRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createVacationRequestRef(dcInstance, inputVars));
}

export const approveVacationRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ApproveVacationRequest', inputVars);
}
approveVacationRequestRef.operationName = 'ApproveVacationRequest';

export function approveVacationRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(approveVacationRequestRef(dcInstance, inputVars));
}

export const rejectVacationRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RejectVacationRequest', inputVars);
}
rejectVacationRequestRef.operationName = 'RejectVacationRequest';

export function rejectVacationRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(rejectVacationRequestRef(dcInstance, inputVars));
}

export const listAttendancePoliciesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAttendancePolicies');
}
listAttendancePoliciesRef.operationName = 'ListAttendancePolicies';

export function listAttendancePolicies(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAttendancePoliciesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listWorkLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWorkLocations');
}
listWorkLocationsRef.operationName = 'ListWorkLocations';

export function listWorkLocations(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listWorkLocationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listEmployeeAttendancePoliciesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeAttendancePolicies');
}
listEmployeeAttendancePoliciesRef.operationName = 'ListEmployeeAttendancePolicies';

export function listEmployeeAttendancePolicies(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEmployeeAttendancePoliciesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listEmployeeAllowedLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeAllowedLocations');
}
listEmployeeAllowedLocationsRef.operationName = 'ListEmployeeAllowedLocations';

export function listEmployeeAllowedLocations(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEmployeeAllowedLocationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createAttendancePolicyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAttendancePolicy', inputVars);
}
createAttendancePolicyRef.operationName = 'CreateAttendancePolicy';

export function createAttendancePolicy(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAttendancePolicyRef(dcInstance, inputVars));
}

export const updateAttendancePolicyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAttendancePolicy', inputVars);
}
updateAttendancePolicyRef.operationName = 'UpdateAttendancePolicy';

export function updateAttendancePolicy(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateAttendancePolicyRef(dcInstance, inputVars));
}

export const createWorkLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkLocation', inputVars);
}
createWorkLocationRef.operationName = 'CreateWorkLocation';

export function createWorkLocation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createWorkLocationRef(dcInstance, inputVars));
}

export const createEmployeeAttendancePolicyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEmployeeAttendancePolicy', inputVars);
}
createEmployeeAttendancePolicyRef.operationName = 'CreateEmployeeAttendancePolicy';

export function createEmployeeAttendancePolicy(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEmployeeAttendancePolicyRef(dcInstance, inputVars));
}

export const updateEmployeeAttendancePolicyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEmployeeAttendancePolicy', inputVars);
}
updateEmployeeAttendancePolicyRef.operationName = 'UpdateEmployeeAttendancePolicy';

export function updateEmployeeAttendancePolicy(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEmployeeAttendancePolicyRef(dcInstance, inputVars));
}

export const addEmployeeAllowedLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddEmployeeAllowedLocation', inputVars);
}
addEmployeeAllowedLocationRef.operationName = 'AddEmployeeAllowedLocation';

export function addEmployeeAllowedLocation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addEmployeeAllowedLocationRef(dcInstance, inputVars));
}

export const getUserByFirebaseUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByFirebaseUid', inputVars);
}
getUserByFirebaseUidRef.operationName = 'GetUserByFirebaseUid';

export function getUserByFirebaseUid(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserByFirebaseUidRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByEmail', inputVars);
}
getUserByEmailRef.operationName = 'GetUserByEmail';

export function getUserByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const touchUserLastLoginRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TouchUserLastLogin', inputVars);
}
touchUserLastLoginRef.operationName = 'TouchUserLastLogin';

export function touchUserLastLogin(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(touchUserLastLoginRef(dcInstance, inputVars));
}

export const linkUserFirebaseUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LinkUserFirebaseUid', inputVars);
}
linkUserFirebaseUidRef.operationName = 'LinkUserFirebaseUid';

export function linkUserFirebaseUid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(linkUserFirebaseUidRef(dcInstance, inputVars));
}

export const markEmployeeNotificationsAsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkEmployeeNotificationsAsRead', inputVars);
}
markEmployeeNotificationsAsReadRef.operationName = 'MarkEmployeeNotificationsAsRead';

export function markEmployeeNotificationsAsRead(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markEmployeeNotificationsAsReadRef(dcInstance, inputVars));
}

export const seedRhPontoDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedRhPontoData');
}
seedRhPontoDataRef.operationName = 'SeedRhPontoData';

export function seedRhPontoData(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(seedRhPontoDataRef(dcInstance, inputVars));
}

export const listEmployeesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployees');
}
listEmployeesRef.operationName = 'ListEmployees';

export function listEmployees(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEmployeesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getEmployeeByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeById', inputVars);
}
getEmployeeByIdRef.operationName = 'GetEmployeeById';

export function getEmployeeById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEmployee', inputVars);
}
createEmployeeRef.operationName = 'CreateEmployee';

export function createEmployee(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEmployeeRef(dcInstance, inputVars));
}

export const updateEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEmployee', inputVars);
}
updateEmployeeRef.operationName = 'UpdateEmployee';

export function updateEmployee(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEmployeeRef(dcInstance, inputVars));
}

export const deactivateEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeactivateEmployee', inputVars);
}
deactivateEmployeeRef.operationName = 'DeactivateEmployee';

export function deactivateEmployee(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deactivateEmployeeRef(dcInstance, inputVars));
}

export const listTimeRecordsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTimeRecords');
}
listTimeRecordsRef.operationName = 'ListTimeRecords';

export function listTimeRecords(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listTimeRecordsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getTimeRecordByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeRecordById', inputVars);
}
getTimeRecordByIdRef.operationName = 'GetTimeRecordById';

export function getTimeRecordById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getTimeRecordByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listTimeRecordPhotosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTimeRecordPhotos');
}
listTimeRecordPhotosRef.operationName = 'ListTimeRecordPhotos';

export function listTimeRecordPhotos(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listTimeRecordPhotosRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createTimeRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTimeRecord', inputVars);
}
createTimeRecordRef.operationName = 'CreateTimeRecord';

export function createTimeRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createTimeRecordRef(dcInstance, inputVars));
}

export const adjustTimeRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdjustTimeRecord', inputVars);
}
adjustTimeRecordRef.operationName = 'AdjustTimeRecord';

export function adjustTimeRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adjustTimeRecordRef(dcInstance, inputVars));
}

export const createTimeRecordPhotoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTimeRecordPhoto', inputVars);
}
createTimeRecordPhotoRef.operationName = 'CreateTimeRecordPhoto';

export function createTimeRecordPhoto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createTimeRecordPhotoRef(dcInstance, inputVars));
}

export const listAuditLogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAuditLogs');
}
listAuditLogsRef.operationName = 'ListAuditLogs';

export function listAuditLogs(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAuditLogsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuditLog', inputVars);
}
createAuditLogRef.operationName = 'CreateAuditLog';

export function createAuditLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAuditLogRef(dcInstance, inputVars));
}

export const listDevicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDevices');
}
listDevicesRef.operationName = 'ListDevices';

export function listDevices(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listDevicesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getDeviceByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDeviceById', inputVars);
}
getDeviceByIdRef.operationName = 'GetDeviceById';

export function getDeviceById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDeviceByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createDeviceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDevice', inputVars);
}
createDeviceRef.operationName = 'CreateDevice';

export function createDevice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDeviceRef(dcInstance, inputVars));
}

export const updateDeviceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDevice', inputVars);
}
updateDeviceRef.operationName = 'UpdateDevice';

export function updateDevice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateDeviceRef(dcInstance, inputVars));
}

export const deactivateDeviceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeactivateDevice', inputVars);
}
deactivateDeviceRef.operationName = 'DeactivateDevice';

export function deactivateDevice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deactivateDeviceRef(dcInstance, inputVars));
}

export const listEmployeeNotificationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeNotifications', inputVars);
}
listEmployeeNotificationsRef.operationName = 'ListEmployeeNotifications';

export function listEmployeeNotifications(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEmployeeNotificationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const markEmployeeNotificationAsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkEmployeeNotificationAsRead', inputVars);
}
markEmployeeNotificationAsReadRef.operationName = 'MarkEmployeeNotificationAsRead';

export function markEmployeeNotificationAsRead(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markEmployeeNotificationAsReadRef(dcInstance, inputVars));
}

export const getEmployeeNotificationPreferencesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeNotificationPreferences', inputVars);
}
getEmployeeNotificationPreferencesRef.operationName = 'GetEmployeeNotificationPreferences';

export function getEmployeeNotificationPreferences(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeNotificationPreferencesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const updateEmployeeNotificationPreferencesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEmployeeNotificationPreferences', inputVars);
}
updateEmployeeNotificationPreferencesRef.operationName = 'UpdateEmployeeNotificationPreferences';

export function updateEmployeeNotificationPreferences(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEmployeeNotificationPreferencesRef(dcInstance, inputVars));
}

export const getCurrentEmployeeByUserIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentEmployeeByUserId', inputVars);
}
getCurrentEmployeeByUserIdRef.operationName = 'GetCurrentEmployeeByUserId';

export function getCurrentEmployeeByUserId(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCurrentEmployeeByUserIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getCurrentEmployeeByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentEmployeeByEmail', inputVars);
}
getCurrentEmployeeByEmailRef.operationName = 'GetCurrentEmployeeByEmail';

export function getCurrentEmployeeByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCurrentEmployeeByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listEmployeeDocumentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeDocuments', inputVars);
}
listEmployeeDocumentsRef.operationName = 'ListEmployeeDocuments';

export function listEmployeeDocuments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEmployeeDocumentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getEmployeeDocumentByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeDocumentById', inputVars);
}
getEmployeeDocumentByIdRef.operationName = 'GetEmployeeDocumentById';

export function getEmployeeDocumentById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeDocumentByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getEmployeeDocumentByIdForEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeDocumentByIdForEmployee', inputVars);
}
getEmployeeDocumentByIdForEmployeeRef.operationName = 'GetEmployeeDocumentByIdForEmployee';

export function getEmployeeDocumentByIdForEmployee(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeDocumentByIdForEmployeeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const acknowledgeEmployeeDocumentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AcknowledgeEmployeeDocument', inputVars);
}
acknowledgeEmployeeDocumentRef.operationName = 'AcknowledgeEmployeeDocument';

export function acknowledgeEmployeeDocument(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(acknowledgeEmployeeDocumentRef(dcInstance, inputVars));
}

export const listPayrollStatementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPayrollStatements', inputVars);
}
listPayrollStatementsRef.operationName = 'ListPayrollStatements';

export function listPayrollStatements(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPayrollStatementsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getPayrollStatementByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPayrollStatementById', inputVars);
}
getPayrollStatementByIdRef.operationName = 'GetPayrollStatementById';

export function getPayrollStatementById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPayrollStatementByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getPayrollStatementByIdForEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPayrollStatementByIdForEmployee', inputVars);
}
getPayrollStatementByIdForEmployeeRef.operationName = 'GetPayrollStatementByIdForEmployee';

export function getPayrollStatementByIdForEmployee(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPayrollStatementByIdForEmployeeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listEmployeeVacationRequestsByEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeVacationRequestsByEmployee', inputVars);
}
listEmployeeVacationRequestsByEmployeeRef.operationName = 'ListEmployeeVacationRequestsByEmployee';

export function listEmployeeVacationRequestsByEmployee(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEmployeeVacationRequestsByEmployeeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getEmployeeVacationRequestByIdForEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeVacationRequestByIdForEmployee', inputVars);
}
getEmployeeVacationRequestByIdForEmployeeRef.operationName = 'GetEmployeeVacationRequestByIdForEmployee';

export function getEmployeeVacationRequestByIdForEmployee(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeVacationRequestByIdForEmployeeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getPayrollClosureByReferenceKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPayrollClosureByReferenceKey', inputVars);
}
getPayrollClosureByReferenceKeyRef.operationName = 'GetPayrollClosureByReferenceKey';

export function getPayrollClosureByReferenceKey(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPayrollClosureByReferenceKeyRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createPayrollClosureRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePayrollClosure', inputVars);
}
createPayrollClosureRef.operationName = 'CreatePayrollClosure';

export function createPayrollClosure(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPayrollClosureRef(dcInstance, inputVars));
}

export const updatePayrollClosureRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePayrollClosure', inputVars);
}
updatePayrollClosureRef.operationName = 'UpdatePayrollClosure';

export function updatePayrollClosure(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePayrollClosureRef(dcInstance, inputVars));
}

export const listWorkSchedulesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWorkSchedules');
}
listWorkSchedulesRef.operationName = 'ListWorkSchedules';

export function listWorkSchedules(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listWorkSchedulesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getWorkScheduleByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkScheduleById', inputVars);
}
getWorkScheduleByIdRef.operationName = 'GetWorkScheduleById';

export function getWorkScheduleById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getWorkScheduleByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listEmployeeScheduleHistoryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeScheduleHistory');
}
listEmployeeScheduleHistoryRef.operationName = 'ListEmployeeScheduleHistory';

export function listEmployeeScheduleHistory(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEmployeeScheduleHistoryRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const createWorkScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkSchedule', inputVars);
}
createWorkScheduleRef.operationName = 'CreateWorkSchedule';

export function createWorkSchedule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createWorkScheduleRef(dcInstance, inputVars));
}

export const updateWorkScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkSchedule', inputVars);
}
updateWorkScheduleRef.operationName = 'UpdateWorkSchedule';

export function updateWorkSchedule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateWorkScheduleRef(dcInstance, inputVars));
}

export const assignWorkScheduleToEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignWorkScheduleToEmployee', inputVars);
}
assignWorkScheduleToEmployeeRef.operationName = 'AssignWorkScheduleToEmployee';

export function assignWorkScheduleToEmployee(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(assignWorkScheduleToEmployeeRef(dcInstance, inputVars));
}

export const listAdminEmployeeDocumentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAdminEmployeeDocuments');
}
listAdminEmployeeDocumentsRef.operationName = 'ListAdminEmployeeDocuments';

export function listAdminEmployeeDocuments(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAdminEmployeeDocumentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listAdminPayrollStatementsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAdminPayrollStatements');
}
listAdminPayrollStatementsRef.operationName = 'ListAdminPayrollStatements';

export function listAdminPayrollStatements(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAdminPayrollStatementsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

