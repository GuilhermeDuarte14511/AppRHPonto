const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'myrh-32b0a-service',
  location: 'southamerica-east1'
};
exports.connectorConfig = connectorConfig;

const listDevicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDevices');
}
listDevicesRef.operationName = 'ListDevices';
exports.listDevicesRef = listDevicesRef;

exports.listDevices = function listDevices(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listDevicesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getDeviceByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDeviceById', inputVars);
}
getDeviceByIdRef.operationName = 'GetDeviceById';
exports.getDeviceByIdRef = getDeviceByIdRef;

exports.getDeviceById = function getDeviceById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDeviceByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createDeviceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDevice', inputVars);
}
createDeviceRef.operationName = 'CreateDevice';
exports.createDeviceRef = createDeviceRef;

exports.createDevice = function createDevice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDeviceRef(dcInstance, inputVars));
}
;

const updateDeviceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDevice', inputVars);
}
updateDeviceRef.operationName = 'UpdateDevice';
exports.updateDeviceRef = updateDeviceRef;

exports.updateDevice = function updateDevice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateDeviceRef(dcInstance, inputVars));
}
;

const deactivateDeviceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeactivateDevice', inputVars);
}
deactivateDeviceRef.operationName = 'DeactivateDevice';
exports.deactivateDeviceRef = deactivateDeviceRef;

exports.deactivateDevice = function deactivateDevice(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deactivateDeviceRef(dcInstance, inputVars));
}
;

const listEmployeeNotificationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeNotifications', inputVars);
}
listEmployeeNotificationsRef.operationName = 'ListEmployeeNotifications';
exports.listEmployeeNotificationsRef = listEmployeeNotificationsRef;

exports.listEmployeeNotifications = function listEmployeeNotifications(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEmployeeNotificationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const markEmployeeNotificationAsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkEmployeeNotificationAsRead', inputVars);
}
markEmployeeNotificationAsReadRef.operationName = 'MarkEmployeeNotificationAsRead';
exports.markEmployeeNotificationAsReadRef = markEmployeeNotificationAsReadRef;

exports.markEmployeeNotificationAsRead = function markEmployeeNotificationAsRead(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(markEmployeeNotificationAsReadRef(dcInstance, inputVars));
}
;

const getEmployeeNotificationPreferencesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeNotificationPreferences', inputVars);
}
getEmployeeNotificationPreferencesRef.operationName = 'GetEmployeeNotificationPreferences';
exports.getEmployeeNotificationPreferencesRef = getEmployeeNotificationPreferencesRef;

exports.getEmployeeNotificationPreferences = function getEmployeeNotificationPreferences(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeNotificationPreferencesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const updateEmployeeNotificationPreferencesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEmployeeNotificationPreferences', inputVars);
}
updateEmployeeNotificationPreferencesRef.operationName = 'UpdateEmployeeNotificationPreferences';
exports.updateEmployeeNotificationPreferencesRef = updateEmployeeNotificationPreferencesRef;

exports.updateEmployeeNotificationPreferences = function updateEmployeeNotificationPreferences(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEmployeeNotificationPreferencesRef(dcInstance, inputVars));
}
;

const getCurrentEmployeeByUserIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentEmployeeByUserId', inputVars);
}
getCurrentEmployeeByUserIdRef.operationName = 'GetCurrentEmployeeByUserId';
exports.getCurrentEmployeeByUserIdRef = getCurrentEmployeeByUserIdRef;

exports.getCurrentEmployeeByUserId = function getCurrentEmployeeByUserId(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCurrentEmployeeByUserIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getCurrentEmployeeByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentEmployeeByEmail', inputVars);
}
getCurrentEmployeeByEmailRef.operationName = 'GetCurrentEmployeeByEmail';
exports.getCurrentEmployeeByEmailRef = getCurrentEmployeeByEmailRef;

exports.getCurrentEmployeeByEmail = function getCurrentEmployeeByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCurrentEmployeeByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listEmployeeDocumentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeDocuments', inputVars);
}
listEmployeeDocumentsRef.operationName = 'ListEmployeeDocuments';
exports.listEmployeeDocumentsRef = listEmployeeDocumentsRef;

exports.listEmployeeDocuments = function listEmployeeDocuments(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEmployeeDocumentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getEmployeeDocumentByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeDocumentById', inputVars);
}
getEmployeeDocumentByIdRef.operationName = 'GetEmployeeDocumentById';
exports.getEmployeeDocumentByIdRef = getEmployeeDocumentByIdRef;

exports.getEmployeeDocumentById = function getEmployeeDocumentById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeDocumentByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getEmployeeDocumentByIdForEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeDocumentByIdForEmployee', inputVars);
}
getEmployeeDocumentByIdForEmployeeRef.operationName = 'GetEmployeeDocumentByIdForEmployee';
exports.getEmployeeDocumentByIdForEmployeeRef = getEmployeeDocumentByIdForEmployeeRef;

exports.getEmployeeDocumentByIdForEmployee = function getEmployeeDocumentByIdForEmployee(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeDocumentByIdForEmployeeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listPayrollStatementsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPayrollStatements', inputVars);
}
listPayrollStatementsRef.operationName = 'ListPayrollStatements';
exports.listPayrollStatementsRef = listPayrollStatementsRef;

exports.listPayrollStatements = function listPayrollStatements(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listPayrollStatementsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getPayrollStatementByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPayrollStatementById', inputVars);
}
getPayrollStatementByIdRef.operationName = 'GetPayrollStatementById';
exports.getPayrollStatementByIdRef = getPayrollStatementByIdRef;

exports.getPayrollStatementById = function getPayrollStatementById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPayrollStatementByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getPayrollStatementByIdForEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPayrollStatementByIdForEmployee', inputVars);
}
getPayrollStatementByIdForEmployeeRef.operationName = 'GetPayrollStatementByIdForEmployee';
exports.getPayrollStatementByIdForEmployeeRef = getPayrollStatementByIdForEmployeeRef;

exports.getPayrollStatementByIdForEmployee = function getPayrollStatementByIdForEmployee(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPayrollStatementByIdForEmployeeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listEmployeeVacationRequestsByEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeVacationRequestsByEmployee', inputVars);
}
listEmployeeVacationRequestsByEmployeeRef.operationName = 'ListEmployeeVacationRequestsByEmployee';
exports.listEmployeeVacationRequestsByEmployeeRef = listEmployeeVacationRequestsByEmployeeRef;

exports.listEmployeeVacationRequestsByEmployee = function listEmployeeVacationRequestsByEmployee(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEmployeeVacationRequestsByEmployeeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getEmployeeVacationRequestByIdForEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeVacationRequestByIdForEmployee', inputVars);
}
getEmployeeVacationRequestByIdForEmployeeRef.operationName = 'GetEmployeeVacationRequestByIdForEmployee';
exports.getEmployeeVacationRequestByIdForEmployeeRef = getEmployeeVacationRequestByIdForEmployeeRef;

exports.getEmployeeVacationRequestByIdForEmployee = function getEmployeeVacationRequestByIdForEmployee(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeVacationRequestByIdForEmployeeRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listEmployeesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployees');
}
listEmployeesRef.operationName = 'ListEmployees';
exports.listEmployeesRef = listEmployeesRef;

exports.listEmployees = function listEmployees(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEmployeesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getEmployeeByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetEmployeeById', inputVars);
}
getEmployeeByIdRef.operationName = 'GetEmployeeById';
exports.getEmployeeByIdRef = getEmployeeByIdRef;

exports.getEmployeeById = function getEmployeeById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getEmployeeByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEmployee', inputVars);
}
createEmployeeRef.operationName = 'CreateEmployee';
exports.createEmployeeRef = createEmployeeRef;

exports.createEmployee = function createEmployee(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEmployeeRef(dcInstance, inputVars));
}
;

const updateEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEmployee', inputVars);
}
updateEmployeeRef.operationName = 'UpdateEmployee';
exports.updateEmployeeRef = updateEmployeeRef;

exports.updateEmployee = function updateEmployee(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEmployeeRef(dcInstance, inputVars));
}
;

const deactivateEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeactivateEmployee', inputVars);
}
deactivateEmployeeRef.operationName = 'DeactivateEmployee';
exports.deactivateEmployeeRef = deactivateEmployeeRef;

exports.deactivateEmployee = function deactivateEmployee(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deactivateEmployeeRef(dcInstance, inputVars));
}
;

const listJustificationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListJustifications');
}
listJustificationsRef.operationName = 'ListJustifications';
exports.listJustificationsRef = listJustificationsRef;

exports.listJustifications = function listJustifications(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listJustificationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getJustificationByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetJustificationById', inputVars);
}
getJustificationByIdRef.operationName = 'GetJustificationById';
exports.getJustificationByIdRef = getJustificationByIdRef;

exports.getJustificationById = function getJustificationById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getJustificationByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listJustificationAttachmentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListJustificationAttachments');
}
listJustificationAttachmentsRef.operationName = 'ListJustificationAttachments';
exports.listJustificationAttachmentsRef = listJustificationAttachmentsRef;

exports.listJustificationAttachments = function listJustificationAttachments(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listJustificationAttachmentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createJustificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateJustification', inputVars);
}
createJustificationRef.operationName = 'CreateJustification';
exports.createJustificationRef = createJustificationRef;

exports.createJustification = function createJustification(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createJustificationRef(dcInstance, inputVars));
}
;

const approveJustificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ApproveJustification', inputVars);
}
approveJustificationRef.operationName = 'ApproveJustification';
exports.approveJustificationRef = approveJustificationRef;

exports.approveJustification = function approveJustification(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(approveJustificationRef(dcInstance, inputVars));
}
;

const rejectJustificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RejectJustification', inputVars);
}
rejectJustificationRef.operationName = 'RejectJustification';
exports.rejectJustificationRef = rejectJustificationRef;

exports.rejectJustification = function rejectJustification(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(rejectJustificationRef(dcInstance, inputVars));
}
;

const addJustificationAttachmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddJustificationAttachment', inputVars);
}
addJustificationAttachmentRef.operationName = 'AddJustificationAttachment';
exports.addJustificationAttachmentRef = addJustificationAttachmentRef;

exports.addJustificationAttachment = function addJustificationAttachment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addJustificationAttachmentRef(dcInstance, inputVars));
}
;

const getPayrollClosureByReferenceKeyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPayrollClosureByReferenceKey', inputVars);
}
getPayrollClosureByReferenceKeyRef.operationName = 'GetPayrollClosureByReferenceKey';
exports.getPayrollClosureByReferenceKeyRef = getPayrollClosureByReferenceKeyRef;

exports.getPayrollClosureByReferenceKey = function getPayrollClosureByReferenceKey(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPayrollClosureByReferenceKeyRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createPayrollClosureRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePayrollClosure', inputVars);
}
createPayrollClosureRef.operationName = 'CreatePayrollClosure';
exports.createPayrollClosureRef = createPayrollClosureRef;

exports.createPayrollClosure = function createPayrollClosure(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createPayrollClosureRef(dcInstance, inputVars));
}
;

const updatePayrollClosureRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePayrollClosure', inputVars);
}
updatePayrollClosureRef.operationName = 'UpdatePayrollClosure';
exports.updatePayrollClosureRef = updatePayrollClosureRef;

exports.updatePayrollClosure = function updatePayrollClosure(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePayrollClosureRef(dcInstance, inputVars));
}
;

const listVacationRequestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVacationRequests');
}
listVacationRequestsRef.operationName = 'ListVacationRequests';
exports.listVacationRequestsRef = listVacationRequestsRef;

exports.listVacationRequests = function listVacationRequests(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listVacationRequestsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getVacationRequestByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVacationRequestById', inputVars);
}
getVacationRequestByIdRef.operationName = 'GetVacationRequestById';
exports.getVacationRequestByIdRef = getVacationRequestByIdRef;

exports.getVacationRequestById = function getVacationRequestById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getVacationRequestByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createVacationRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVacationRequest', inputVars);
}
createVacationRequestRef.operationName = 'CreateVacationRequest';
exports.createVacationRequestRef = createVacationRequestRef;

exports.createVacationRequest = function createVacationRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createVacationRequestRef(dcInstance, inputVars));
}
;

const approveVacationRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ApproveVacationRequest', inputVars);
}
approveVacationRequestRef.operationName = 'ApproveVacationRequest';
exports.approveVacationRequestRef = approveVacationRequestRef;

exports.approveVacationRequest = function approveVacationRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(approveVacationRequestRef(dcInstance, inputVars));
}
;

const rejectVacationRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RejectVacationRequest', inputVars);
}
rejectVacationRequestRef.operationName = 'RejectVacationRequest';
exports.rejectVacationRequestRef = rejectVacationRequestRef;

exports.rejectVacationRequest = function rejectVacationRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(rejectVacationRequestRef(dcInstance, inputVars));
}
;

const listWorkSchedulesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWorkSchedules');
}
listWorkSchedulesRef.operationName = 'ListWorkSchedules';
exports.listWorkSchedulesRef = listWorkSchedulesRef;

exports.listWorkSchedules = function listWorkSchedules(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listWorkSchedulesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getWorkScheduleByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkScheduleById', inputVars);
}
getWorkScheduleByIdRef.operationName = 'GetWorkScheduleById';
exports.getWorkScheduleByIdRef = getWorkScheduleByIdRef;

exports.getWorkScheduleById = function getWorkScheduleById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getWorkScheduleByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listEmployeeScheduleHistoryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeScheduleHistory');
}
listEmployeeScheduleHistoryRef.operationName = 'ListEmployeeScheduleHistory';
exports.listEmployeeScheduleHistoryRef = listEmployeeScheduleHistoryRef;

exports.listEmployeeScheduleHistory = function listEmployeeScheduleHistory(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEmployeeScheduleHistoryRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createWorkScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkSchedule', inputVars);
}
createWorkScheduleRef.operationName = 'CreateWorkSchedule';
exports.createWorkScheduleRef = createWorkScheduleRef;

exports.createWorkSchedule = function createWorkSchedule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createWorkScheduleRef(dcInstance, inputVars));
}
;

const updateWorkScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateWorkSchedule', inputVars);
}
updateWorkScheduleRef.operationName = 'UpdateWorkSchedule';
exports.updateWorkScheduleRef = updateWorkScheduleRef;

exports.updateWorkSchedule = function updateWorkSchedule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateWorkScheduleRef(dcInstance, inputVars));
}
;

const assignWorkScheduleToEmployeeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignWorkScheduleToEmployee', inputVars);
}
assignWorkScheduleToEmployeeRef.operationName = 'AssignWorkScheduleToEmployee';
exports.assignWorkScheduleToEmployeeRef = assignWorkScheduleToEmployeeRef;

exports.assignWorkScheduleToEmployee = function assignWorkScheduleToEmployee(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(assignWorkScheduleToEmployeeRef(dcInstance, inputVars));
}
;

const listAttendancePoliciesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAttendancePolicies');
}
listAttendancePoliciesRef.operationName = 'ListAttendancePolicies';
exports.listAttendancePoliciesRef = listAttendancePoliciesRef;

exports.listAttendancePolicies = function listAttendancePolicies(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAttendancePoliciesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listWorkLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListWorkLocations');
}
listWorkLocationsRef.operationName = 'ListWorkLocations';
exports.listWorkLocationsRef = listWorkLocationsRef;

exports.listWorkLocations = function listWorkLocations(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listWorkLocationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listEmployeeAttendancePoliciesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeAttendancePolicies');
}
listEmployeeAttendancePoliciesRef.operationName = 'ListEmployeeAttendancePolicies';
exports.listEmployeeAttendancePoliciesRef = listEmployeeAttendancePoliciesRef;

exports.listEmployeeAttendancePolicies = function listEmployeeAttendancePolicies(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEmployeeAttendancePoliciesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listEmployeeAllowedLocationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEmployeeAllowedLocations');
}
listEmployeeAllowedLocationsRef.operationName = 'ListEmployeeAllowedLocations';
exports.listEmployeeAllowedLocationsRef = listEmployeeAllowedLocationsRef;

exports.listEmployeeAllowedLocations = function listEmployeeAllowedLocations(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listEmployeeAllowedLocationsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createAttendancePolicyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAttendancePolicy', inputVars);
}
createAttendancePolicyRef.operationName = 'CreateAttendancePolicy';
exports.createAttendancePolicyRef = createAttendancePolicyRef;

exports.createAttendancePolicy = function createAttendancePolicy(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAttendancePolicyRef(dcInstance, inputVars));
}
;

const updateAttendancePolicyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAttendancePolicy', inputVars);
}
updateAttendancePolicyRef.operationName = 'UpdateAttendancePolicy';
exports.updateAttendancePolicyRef = updateAttendancePolicyRef;

exports.updateAttendancePolicy = function updateAttendancePolicy(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateAttendancePolicyRef(dcInstance, inputVars));
}
;

const createWorkLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkLocation', inputVars);
}
createWorkLocationRef.operationName = 'CreateWorkLocation';
exports.createWorkLocationRef = createWorkLocationRef;

exports.createWorkLocation = function createWorkLocation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createWorkLocationRef(dcInstance, inputVars));
}
;

const createEmployeeAttendancePolicyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEmployeeAttendancePolicy', inputVars);
}
createEmployeeAttendancePolicyRef.operationName = 'CreateEmployeeAttendancePolicy';
exports.createEmployeeAttendancePolicyRef = createEmployeeAttendancePolicyRef;

exports.createEmployeeAttendancePolicy = function createEmployeeAttendancePolicy(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEmployeeAttendancePolicyRef(dcInstance, inputVars));
}
;

const updateEmployeeAttendancePolicyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEmployeeAttendancePolicy', inputVars);
}
updateEmployeeAttendancePolicyRef.operationName = 'UpdateEmployeeAttendancePolicy';
exports.updateEmployeeAttendancePolicyRef = updateEmployeeAttendancePolicyRef;

exports.updateEmployeeAttendancePolicy = function updateEmployeeAttendancePolicy(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEmployeeAttendancePolicyRef(dcInstance, inputVars));
}
;

const addEmployeeAllowedLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddEmployeeAllowedLocation', inputVars);
}
addEmployeeAllowedLocationRef.operationName = 'AddEmployeeAllowedLocation';
exports.addEmployeeAllowedLocationRef = addEmployeeAllowedLocationRef;

exports.addEmployeeAllowedLocation = function addEmployeeAllowedLocation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addEmployeeAllowedLocationRef(dcInstance, inputVars));
}
;

const listAuditLogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAuditLogs');
}
listAuditLogsRef.operationName = 'ListAuditLogs';
exports.listAuditLogsRef = listAuditLogsRef;

exports.listAuditLogs = function listAuditLogs(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAuditLogsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createAuditLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuditLog', inputVars);
}
createAuditLogRef.operationName = 'CreateAuditLog';
exports.createAuditLogRef = createAuditLogRef;

exports.createAuditLog = function createAuditLog(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAuditLogRef(dcInstance, inputVars));
}
;

const getUserByFirebaseUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByFirebaseUid', inputVars);
}
getUserByFirebaseUidRef.operationName = 'GetUserByFirebaseUid';
exports.getUserByFirebaseUidRef = getUserByFirebaseUidRef;

exports.getUserByFirebaseUid = function getUserByFirebaseUid(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserByFirebaseUidRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByEmail', inputVars);
}
getUserByEmailRef.operationName = 'GetUserByEmail';
exports.getUserByEmailRef = getUserByEmailRef;

exports.getUserByEmail = function getUserByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const touchUserLastLoginRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TouchUserLastLogin', inputVars);
}
touchUserLastLoginRef.operationName = 'TouchUserLastLogin';
exports.touchUserLastLoginRef = touchUserLastLoginRef;

exports.touchUserLastLogin = function touchUserLastLogin(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(touchUserLastLoginRef(dcInstance, inputVars));
}
;

const linkUserFirebaseUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LinkUserFirebaseUid', inputVars);
}
linkUserFirebaseUidRef.operationName = 'LinkUserFirebaseUid';
exports.linkUserFirebaseUidRef = linkUserFirebaseUidRef;

exports.linkUserFirebaseUid = function linkUserFirebaseUid(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(linkUserFirebaseUidRef(dcInstance, inputVars));
}
;

const listDepartmentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDepartments');
}
listDepartmentsRef.operationName = 'ListDepartments';
exports.listDepartmentsRef = listDepartmentsRef;

exports.listDepartments = function listDepartments(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listDepartmentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getDepartmentByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDepartmentById', inputVars);
}
getDepartmentByIdRef.operationName = 'GetDepartmentById';
exports.getDepartmentByIdRef = getDepartmentByIdRef;

exports.getDepartmentById = function getDepartmentById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getDepartmentByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createDepartmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDepartment', inputVars);
}
createDepartmentRef.operationName = 'CreateDepartment';
exports.createDepartmentRef = createDepartmentRef;

exports.createDepartment = function createDepartment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDepartmentRef(dcInstance, inputVars));
}
;

const updateDepartmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDepartment', inputVars);
}
updateDepartmentRef.operationName = 'UpdateDepartment';
exports.updateDepartmentRef = updateDepartmentRef;

exports.updateDepartment = function updateDepartment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateDepartmentRef(dcInstance, inputVars));
}
;

const deleteDepartmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDepartment', inputVars);
}
deleteDepartmentRef.operationName = 'DeleteDepartment';
exports.deleteDepartmentRef = deleteDepartmentRef;

exports.deleteDepartment = function deleteDepartment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteDepartmentRef(dcInstance, inputVars));
}
;

const seedRhPontoDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedRhPontoData');
}
seedRhPontoDataRef.operationName = 'SeedRhPontoData';
exports.seedRhPontoDataRef = seedRhPontoDataRef;

exports.seedRhPontoData = function seedRhPontoData(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(seedRhPontoDataRef(dcInstance, inputVars));
}
;

const listTimeRecordsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTimeRecords');
}
listTimeRecordsRef.operationName = 'ListTimeRecords';
exports.listTimeRecordsRef = listTimeRecordsRef;

exports.listTimeRecords = function listTimeRecords(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listTimeRecordsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getTimeRecordByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeRecordById', inputVars);
}
getTimeRecordByIdRef.operationName = 'GetTimeRecordById';
exports.getTimeRecordByIdRef = getTimeRecordByIdRef;

exports.getTimeRecordById = function getTimeRecordById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getTimeRecordByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listTimeRecordPhotosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTimeRecordPhotos');
}
listTimeRecordPhotosRef.operationName = 'ListTimeRecordPhotos';
exports.listTimeRecordPhotosRef = listTimeRecordPhotosRef;

exports.listTimeRecordPhotos = function listTimeRecordPhotos(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listTimeRecordPhotosRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createTimeRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTimeRecord', inputVars);
}
createTimeRecordRef.operationName = 'CreateTimeRecord';
exports.createTimeRecordRef = createTimeRecordRef;

exports.createTimeRecord = function createTimeRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createTimeRecordRef(dcInstance, inputVars));
}
;

const adjustTimeRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdjustTimeRecord', inputVars);
}
adjustTimeRecordRef.operationName = 'AdjustTimeRecord';
exports.adjustTimeRecordRef = adjustTimeRecordRef;

exports.adjustTimeRecord = function adjustTimeRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(adjustTimeRecordRef(dcInstance, inputVars));
}
;

const createTimeRecordPhotoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTimeRecordPhoto', inputVars);
}
createTimeRecordPhotoRef.operationName = 'CreateTimeRecordPhoto';
exports.createTimeRecordPhotoRef = createTimeRecordPhotoRef;

exports.createTimeRecordPhoto = function createTimeRecordPhoto(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createTimeRecordPhotoRef(dcInstance, inputVars));
}
;
