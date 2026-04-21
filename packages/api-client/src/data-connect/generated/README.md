# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListTimeRecords*](#listtimerecords)
  - [*GetTimeRecordById*](#gettimerecordbyid)
  - [*ListTimeRecordPhotos*](#listtimerecordphotos)
  - [*ListAttendancePolicies*](#listattendancepolicies)
  - [*ListWorkLocations*](#listworklocations)
  - [*ListEmployeeAttendancePolicies*](#listemployeeattendancepolicies)
  - [*ListEmployeeAllowedLocations*](#listemployeeallowedlocations)
  - [*ListAuditLogs*](#listauditlogs)
  - [*ListEmployees*](#listemployees)
  - [*GetEmployeeById*](#getemployeebyid)
  - [*GetPayrollClosureByReferenceKey*](#getpayrollclosurebyreferencekey)
  - [*ListEmployeeNotifications*](#listemployeenotifications)
  - [*GetEmployeeNotificationPreferences*](#getemployeenotificationpreferences)
  - [*GetCurrentEmployeeByUserId*](#getcurrentemployeebyuserid)
  - [*GetCurrentEmployeeByEmail*](#getcurrentemployeebyemail)
  - [*ListEmployeeDocuments*](#listemployeedocuments)
  - [*GetEmployeeDocumentById*](#getemployeedocumentbyid)
  - [*GetEmployeeDocumentByIdForEmployee*](#getemployeedocumentbyidforemployee)
  - [*ListPayrollStatements*](#listpayrollstatements)
  - [*GetPayrollStatementById*](#getpayrollstatementbyid)
  - [*GetPayrollStatementByIdForEmployee*](#getpayrollstatementbyidforemployee)
  - [*ListEmployeeVacationRequestsByEmployee*](#listemployeevacationrequestsbyemployee)
  - [*GetEmployeeVacationRequestByIdForEmployee*](#getemployeevacationrequestbyidforemployee)
  - [*ListVacationRequests*](#listvacationrequests)
  - [*GetVacationRequestById*](#getvacationrequestbyid)
  - [*ListAdminEmployeeDocuments*](#listadminemployeedocuments)
  - [*ListAdminPayrollStatements*](#listadminpayrollstatements)
  - [*GetUserByFirebaseUid*](#getuserbyfirebaseuid)
  - [*GetUserByEmail*](#getuserbyemail)
  - [*ListJustifications*](#listjustifications)
  - [*GetJustificationById*](#getjustificationbyid)
  - [*ListJustificationAttachments*](#listjustificationattachments)
  - [*ListDepartments*](#listdepartments)
  - [*GetDepartmentById*](#getdepartmentbyid)
  - [*ListDevices*](#listdevices)
  - [*GetDeviceById*](#getdevicebyid)
  - [*ListWorkSchedules*](#listworkschedules)
  - [*GetWorkScheduleById*](#getworkschedulebyid)
  - [*ListEmployeeScheduleHistory*](#listemployeeschedulehistory)
- [**Mutations**](#mutations)
  - [*CreateTimeRecord*](#createtimerecord)
  - [*AdjustTimeRecord*](#adjusttimerecord)
  - [*CreateTimeRecordPhoto*](#createtimerecordphoto)
  - [*CreateAttendancePolicy*](#createattendancepolicy)
  - [*UpdateAttendancePolicy*](#updateattendancepolicy)
  - [*CreateWorkLocation*](#createworklocation)
  - [*CreateEmployeeAttendancePolicy*](#createemployeeattendancepolicy)
  - [*UpdateEmployeeAttendancePolicy*](#updateemployeeattendancepolicy)
  - [*AddEmployeeAllowedLocation*](#addemployeeallowedlocation)
  - [*CreateAuditLog*](#createauditlog)
  - [*MarkEmployeeNotificationsAsRead*](#markemployeenotificationsasread)
  - [*CreateEmployee*](#createemployee)
  - [*UpdateEmployee*](#updateemployee)
  - [*DeactivateEmployee*](#deactivateemployee)
  - [*CreatePayrollClosure*](#createpayrollclosure)
  - [*UpdatePayrollClosure*](#updatepayrollclosure)
  - [*MarkEmployeeNotificationAsRead*](#markemployeenotificationasread)
  - [*UpdateEmployeeNotificationPreferences*](#updateemployeenotificationpreferences)
  - [*AcknowledgeEmployeeDocument*](#acknowledgeemployeedocument)
  - [*SeedRhPontoData*](#seedrhpontodata)
  - [*CreateVacationRequest*](#createvacationrequest)
  - [*ApproveVacationRequest*](#approvevacationrequest)
  - [*RejectVacationRequest*](#rejectvacationrequest)
  - [*TouchUserLastLogin*](#touchuserlastlogin)
  - [*LinkUserFirebaseUid*](#linkuserfirebaseuid)
  - [*CreateJustification*](#createjustification)
  - [*ApproveJustification*](#approvejustification)
  - [*RejectJustification*](#rejectjustification)
  - [*AddJustificationAttachment*](#addjustificationattachment)
  - [*CreateDepartment*](#createdepartment)
  - [*UpdateDepartment*](#updatedepartment)
  - [*DeleteDepartment*](#deletedepartment)
  - [*CreateDevice*](#createdevice)
  - [*UpdateDevice*](#updatedevice)
  - [*DeactivateDevice*](#deactivatedevice)
  - [*CreateWorkSchedule*](#createworkschedule)
  - [*UpdateWorkSchedule*](#updateworkschedule)
  - [*AssignWorkScheduleToEmployee*](#assignworkscheduletoemployee)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@rh-ponto/api-client/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@rh-ponto/api-client/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@rh-ponto/api-client/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListTimeRecords
You can execute the `ListTimeRecords` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listTimeRecords(options?: ExecuteQueryOptions): QueryPromise<ListTimeRecordsData, undefined>;

interface ListTimeRecordsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTimeRecordsData, undefined>;
}
export const listTimeRecordsRef: ListTimeRecordsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTimeRecords(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTimeRecordsData, undefined>;

interface ListTimeRecordsRef {
  ...
  (dc: DataConnect): QueryRef<ListTimeRecordsData, undefined>;
}
export const listTimeRecordsRef: ListTimeRecordsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTimeRecordsRef:
```typescript
const name = listTimeRecordsRef.operationName;
console.log(name);
```

### Variables
The `ListTimeRecords` query has no variables.
### Return Type
Recall that executing the `ListTimeRecords` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTimeRecordsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTimeRecordsData {
  timeRecords: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      device?: {
        id: UUIDString;
      } & Device_Key;
        recordedByUser?: {
          id: UUIDString;
        } & User_Key;
          recordType: string;
          source: string;
          status: string;
          recordedAt: TimestampString;
          originalRecordedAt?: TimestampString | null;
          notes?: string | null;
          isManual: boolean;
          referenceRecord?: {
            id: UUIDString;
          } & TimeRecord_Key;
            latitude?: number | null;
            longitude?: number | null;
            resolvedAddress?: string | null;
            ipAddress?: string | null;
            createdAt: TimestampString;
            updatedAt: TimestampString;
  } & TimeRecord_Key)[];
}
```
### Using `ListTimeRecords`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTimeRecords } from '@rh-ponto/api-client/generated';


// Call the `listTimeRecords()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTimeRecords();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTimeRecords(dataConnect);

console.log(data.timeRecords);

// Or, you can use the `Promise` API.
listTimeRecords().then((response) => {
  const data = response.data;
  console.log(data.timeRecords);
});
```

### Using `ListTimeRecords`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTimeRecordsRef } from '@rh-ponto/api-client/generated';


// Call the `listTimeRecordsRef()` function to get a reference to the query.
const ref = listTimeRecordsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTimeRecordsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.timeRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.timeRecords);
});
```

## GetTimeRecordById
You can execute the `GetTimeRecordById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getTimeRecordById(vars: GetTimeRecordByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetTimeRecordByIdData, GetTimeRecordByIdVariables>;

interface GetTimeRecordByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTimeRecordByIdVariables): QueryRef<GetTimeRecordByIdData, GetTimeRecordByIdVariables>;
}
export const getTimeRecordByIdRef: GetTimeRecordByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTimeRecordById(dc: DataConnect, vars: GetTimeRecordByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetTimeRecordByIdData, GetTimeRecordByIdVariables>;

interface GetTimeRecordByIdRef {
  ...
  (dc: DataConnect, vars: GetTimeRecordByIdVariables): QueryRef<GetTimeRecordByIdData, GetTimeRecordByIdVariables>;
}
export const getTimeRecordByIdRef: GetTimeRecordByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTimeRecordByIdRef:
```typescript
const name = getTimeRecordByIdRef.operationName;
console.log(name);
```

### Variables
The `GetTimeRecordById` query requires an argument of type `GetTimeRecordByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTimeRecordByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetTimeRecordById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTimeRecordByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTimeRecordByIdData {
  timeRecord?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      device?: {
        id: UUIDString;
      } & Device_Key;
        recordedByUser?: {
          id: UUIDString;
        } & User_Key;
          recordType: string;
          source: string;
          status: string;
          recordedAt: TimestampString;
          originalRecordedAt?: TimestampString | null;
          notes?: string | null;
          isManual: boolean;
          referenceRecord?: {
            id: UUIDString;
          } & TimeRecord_Key;
            latitude?: number | null;
            longitude?: number | null;
            resolvedAddress?: string | null;
            ipAddress?: string | null;
            createdAt: TimestampString;
            updatedAt: TimestampString;
  } & TimeRecord_Key;
}
```
### Using `GetTimeRecordById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTimeRecordById, GetTimeRecordByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetTimeRecordById` query requires an argument of type `GetTimeRecordByIdVariables`:
const getTimeRecordByIdVars: GetTimeRecordByIdVariables = {
  id: ..., 
};

// Call the `getTimeRecordById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTimeRecordById(getTimeRecordByIdVars);
// Variables can be defined inline as well.
const { data } = await getTimeRecordById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTimeRecordById(dataConnect, getTimeRecordByIdVars);

console.log(data.timeRecord);

// Or, you can use the `Promise` API.
getTimeRecordById(getTimeRecordByIdVars).then((response) => {
  const data = response.data;
  console.log(data.timeRecord);
});
```

### Using `GetTimeRecordById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTimeRecordByIdRef, GetTimeRecordByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetTimeRecordById` query requires an argument of type `GetTimeRecordByIdVariables`:
const getTimeRecordByIdVars: GetTimeRecordByIdVariables = {
  id: ..., 
};

// Call the `getTimeRecordByIdRef()` function to get a reference to the query.
const ref = getTimeRecordByIdRef(getTimeRecordByIdVars);
// Variables can be defined inline as well.
const ref = getTimeRecordByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTimeRecordByIdRef(dataConnect, getTimeRecordByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.timeRecord);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.timeRecord);
});
```

## ListTimeRecordPhotos
You can execute the `ListTimeRecordPhotos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listTimeRecordPhotos(options?: ExecuteQueryOptions): QueryPromise<ListTimeRecordPhotosData, undefined>;

interface ListTimeRecordPhotosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTimeRecordPhotosData, undefined>;
}
export const listTimeRecordPhotosRef: ListTimeRecordPhotosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTimeRecordPhotos(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTimeRecordPhotosData, undefined>;

interface ListTimeRecordPhotosRef {
  ...
  (dc: DataConnect): QueryRef<ListTimeRecordPhotosData, undefined>;
}
export const listTimeRecordPhotosRef: ListTimeRecordPhotosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTimeRecordPhotosRef:
```typescript
const name = listTimeRecordPhotosRef.operationName;
console.log(name);
```

### Variables
The `ListTimeRecordPhotos` query has no variables.
### Return Type
Recall that executing the `ListTimeRecordPhotos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTimeRecordPhotosData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTimeRecordPhotosData {
  timeRecordPhotos: ({
    id: UUIDString;
    timeRecord: {
      id: UUIDString;
    } & TimeRecord_Key;
      fileUrl: string;
      fileName?: string | null;
      contentType?: string | null;
      fileSizeBytes?: Int64String | null;
      isPrimary: boolean;
      createdAt: TimestampString;
  } & TimeRecordPhoto_Key)[];
}
```
### Using `ListTimeRecordPhotos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTimeRecordPhotos } from '@rh-ponto/api-client/generated';


// Call the `listTimeRecordPhotos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTimeRecordPhotos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTimeRecordPhotos(dataConnect);

console.log(data.timeRecordPhotos);

// Or, you can use the `Promise` API.
listTimeRecordPhotos().then((response) => {
  const data = response.data;
  console.log(data.timeRecordPhotos);
});
```

### Using `ListTimeRecordPhotos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTimeRecordPhotosRef } from '@rh-ponto/api-client/generated';


// Call the `listTimeRecordPhotosRef()` function to get a reference to the query.
const ref = listTimeRecordPhotosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTimeRecordPhotosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.timeRecordPhotos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.timeRecordPhotos);
});
```

## ListAttendancePolicies
You can execute the `ListAttendancePolicies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listAttendancePolicies(options?: ExecuteQueryOptions): QueryPromise<ListAttendancePoliciesData, undefined>;

interface ListAttendancePoliciesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAttendancePoliciesData, undefined>;
}
export const listAttendancePoliciesRef: ListAttendancePoliciesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAttendancePolicies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAttendancePoliciesData, undefined>;

interface ListAttendancePoliciesRef {
  ...
  (dc: DataConnect): QueryRef<ListAttendancePoliciesData, undefined>;
}
export const listAttendancePoliciesRef: ListAttendancePoliciesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAttendancePoliciesRef:
```typescript
const name = listAttendancePoliciesRef.operationName;
console.log(name);
```

### Variables
The `ListAttendancePolicies` query has no variables.
### Return Type
Recall that executing the `ListAttendancePolicies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAttendancePoliciesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAttendancePoliciesData {
  attendancePolicies: ({
    id: UUIDString;
    code: string;
    name: string;
    mode: string;
    validationStrategy: string;
    geolocationRequired: boolean;
    photoRequired: boolean;
    allowOffsiteClocking: boolean;
    requiresAllowedLocations: boolean;
    description?: string | null;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & AttendancePolicy_Key)[];
}
```
### Using `ListAttendancePolicies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAttendancePolicies } from '@rh-ponto/api-client/generated';


// Call the `listAttendancePolicies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAttendancePolicies();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAttendancePolicies(dataConnect);

console.log(data.attendancePolicies);

// Or, you can use the `Promise` API.
listAttendancePolicies().then((response) => {
  const data = response.data;
  console.log(data.attendancePolicies);
});
```

### Using `ListAttendancePolicies`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAttendancePoliciesRef } from '@rh-ponto/api-client/generated';


// Call the `listAttendancePoliciesRef()` function to get a reference to the query.
const ref = listAttendancePoliciesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAttendancePoliciesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.attendancePolicies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.attendancePolicies);
});
```

## ListWorkLocations
You can execute the `ListWorkLocations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listWorkLocations(options?: ExecuteQueryOptions): QueryPromise<ListWorkLocationsData, undefined>;

interface ListWorkLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListWorkLocationsData, undefined>;
}
export const listWorkLocationsRef: ListWorkLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listWorkLocations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListWorkLocationsData, undefined>;

interface ListWorkLocationsRef {
  ...
  (dc: DataConnect): QueryRef<ListWorkLocationsData, undefined>;
}
export const listWorkLocationsRef: ListWorkLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listWorkLocationsRef:
```typescript
const name = listWorkLocationsRef.operationName;
console.log(name);
```

### Variables
The `ListWorkLocations` query has no variables.
### Return Type
Recall that executing the `ListWorkLocations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListWorkLocationsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListWorkLocationsData {
  workLocations: ({
    id: UUIDString;
    code: string;
    name: string;
    type: string;
    addressLine?: string | null;
    addressComplement?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    radiusMeters: number;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & WorkLocation_Key)[];
}
```
### Using `ListWorkLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listWorkLocations } from '@rh-ponto/api-client/generated';


// Call the `listWorkLocations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listWorkLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listWorkLocations(dataConnect);

console.log(data.workLocations);

// Or, you can use the `Promise` API.
listWorkLocations().then((response) => {
  const data = response.data;
  console.log(data.workLocations);
});
```

### Using `ListWorkLocations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listWorkLocationsRef } from '@rh-ponto/api-client/generated';


// Call the `listWorkLocationsRef()` function to get a reference to the query.
const ref = listWorkLocationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listWorkLocationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workLocations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workLocations);
});
```

## ListEmployeeAttendancePolicies
You can execute the `ListEmployeeAttendancePolicies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listEmployeeAttendancePolicies(options?: ExecuteQueryOptions): QueryPromise<ListEmployeeAttendancePoliciesData, undefined>;

interface ListEmployeeAttendancePoliciesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeeAttendancePoliciesData, undefined>;
}
export const listEmployeeAttendancePoliciesRef: ListEmployeeAttendancePoliciesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployeeAttendancePolicies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeAttendancePoliciesData, undefined>;

interface ListEmployeeAttendancePoliciesRef {
  ...
  (dc: DataConnect): QueryRef<ListEmployeeAttendancePoliciesData, undefined>;
}
export const listEmployeeAttendancePoliciesRef: ListEmployeeAttendancePoliciesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeeAttendancePoliciesRef:
```typescript
const name = listEmployeeAttendancePoliciesRef.operationName;
console.log(name);
```

### Variables
The `ListEmployeeAttendancePolicies` query has no variables.
### Return Type
Recall that executing the `ListEmployeeAttendancePolicies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeeAttendancePoliciesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeeAttendancePoliciesData {
  employeeAttendancePolicies: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      attendancePolicy: {
        id: UUIDString;
      } & AttendancePolicy_Key;
        mode: string;
        validationStrategy: string;
        geolocationRequired: boolean;
        photoRequired: boolean;
        allowAnyLocation: boolean;
        blockOutsideAllowedLocations: boolean;
        notes?: string | null;
        startsAt?: DateString | null;
        endsAt?: DateString | null;
        isCurrent: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  })[];
}
```
### Using `ListEmployeeAttendancePolicies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployeeAttendancePolicies } from '@rh-ponto/api-client/generated';


// Call the `listEmployeeAttendancePolicies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployeeAttendancePolicies();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployeeAttendancePolicies(dataConnect);

console.log(data.employeeAttendancePolicies);

// Or, you can use the `Promise` API.
listEmployeeAttendancePolicies().then((response) => {
  const data = response.data;
  console.log(data.employeeAttendancePolicies);
});
```

### Using `ListEmployeeAttendancePolicies`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeeAttendancePoliciesRef } from '@rh-ponto/api-client/generated';


// Call the `listEmployeeAttendancePoliciesRef()` function to get a reference to the query.
const ref = listEmployeeAttendancePoliciesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeeAttendancePoliciesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employeeAttendancePolicies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeAttendancePolicies);
});
```

## ListEmployeeAllowedLocations
You can execute the `ListEmployeeAllowedLocations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listEmployeeAllowedLocations(options?: ExecuteQueryOptions): QueryPromise<ListEmployeeAllowedLocationsData, undefined>;

interface ListEmployeeAllowedLocationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeeAllowedLocationsData, undefined>;
}
export const listEmployeeAllowedLocationsRef: ListEmployeeAllowedLocationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployeeAllowedLocations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeAllowedLocationsData, undefined>;

interface ListEmployeeAllowedLocationsRef {
  ...
  (dc: DataConnect): QueryRef<ListEmployeeAllowedLocationsData, undefined>;
}
export const listEmployeeAllowedLocationsRef: ListEmployeeAllowedLocationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeeAllowedLocationsRef:
```typescript
const name = listEmployeeAllowedLocationsRef.operationName;
console.log(name);
```

### Variables
The `ListEmployeeAllowedLocations` query has no variables.
### Return Type
Recall that executing the `ListEmployeeAllowedLocations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeeAllowedLocationsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeeAllowedLocationsData {
  employeeAllowedLocations: ({
    id: UUIDString;
    employeeAttendancePolicy: {
      id: UUIDString;
    };
      workLocation: {
        id: UUIDString;
      } & WorkLocation_Key;
        locationRole: string;
        isRequired: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & EmployeeAllowedLocation_Key)[];
}
```
### Using `ListEmployeeAllowedLocations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployeeAllowedLocations } from '@rh-ponto/api-client/generated';


// Call the `listEmployeeAllowedLocations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployeeAllowedLocations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployeeAllowedLocations(dataConnect);

console.log(data.employeeAllowedLocations);

// Or, you can use the `Promise` API.
listEmployeeAllowedLocations().then((response) => {
  const data = response.data;
  console.log(data.employeeAllowedLocations);
});
```

### Using `ListEmployeeAllowedLocations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeeAllowedLocationsRef } from '@rh-ponto/api-client/generated';


// Call the `listEmployeeAllowedLocationsRef()` function to get a reference to the query.
const ref = listEmployeeAllowedLocationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeeAllowedLocationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employeeAllowedLocations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeAllowedLocations);
});
```

## ListAuditLogs
You can execute the `ListAuditLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listAuditLogs(options?: ExecuteQueryOptions): QueryPromise<ListAuditLogsData, undefined>;

interface ListAuditLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAuditLogsData, undefined>;
}
export const listAuditLogsRef: ListAuditLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAuditLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAuditLogsData, undefined>;

interface ListAuditLogsRef {
  ...
  (dc: DataConnect): QueryRef<ListAuditLogsData, undefined>;
}
export const listAuditLogsRef: ListAuditLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAuditLogsRef:
```typescript
const name = listAuditLogsRef.operationName;
console.log(name);
```

### Variables
The `ListAuditLogs` query has no variables.
### Return Type
Recall that executing the `ListAuditLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAuditLogsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAuditLogsData {
  auditLogs: ({
    id: UUIDString;
    user?: {
      id: UUIDString;
    } & User_Key;
      entityName: string;
      entityId?: string | null;
      action: string;
      description?: string | null;
      oldData?: unknown | null;
      newData?: unknown | null;
      ipAddress?: string | null;
      deviceInfo?: string | null;
      createdAt: TimestampString;
  } & AuditLog_Key)[];
}
```
### Using `ListAuditLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAuditLogs } from '@rh-ponto/api-client/generated';


// Call the `listAuditLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAuditLogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAuditLogs(dataConnect);

console.log(data.auditLogs);

// Or, you can use the `Promise` API.
listAuditLogs().then((response) => {
  const data = response.data;
  console.log(data.auditLogs);
});
```

### Using `ListAuditLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAuditLogsRef } from '@rh-ponto/api-client/generated';


// Call the `listAuditLogsRef()` function to get a reference to the query.
const ref = listAuditLogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAuditLogsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.auditLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.auditLogs);
});
```

## ListEmployees
You can execute the `ListEmployees` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listEmployees(options?: ExecuteQueryOptions): QueryPromise<ListEmployeesData, undefined>;

interface ListEmployeesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeesData, undefined>;
}
export const listEmployeesRef: ListEmployeesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployees(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeesData, undefined>;

interface ListEmployeesRef {
  ...
  (dc: DataConnect): QueryRef<ListEmployeesData, undefined>;
}
export const listEmployeesRef: ListEmployeesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeesRef:
```typescript
const name = listEmployeesRef.operationName;
console.log(name);
```

### Variables
The `ListEmployees` query has no variables.
### Return Type
Recall that executing the `ListEmployees` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeesData {
  employees: ({
    id: UUIDString;
    user?: {
      id: UUIDString;
    } & User_Key;
      registrationNumber: string;
      fullName: string;
      cpf?: string | null;
      email?: string | null;
      phone?: string | null;
      birthDate?: DateString | null;
      hireDate?: DateString | null;
      departmentId?: UUIDString | null;
      department?: {
        id: UUIDString;
        name: string;
      } & Department_Key;
        position?: string | null;
        profilePhotoUrl?: string | null;
        pinCode?: string | null;
        isActive: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & Employee_Key)[];
}
```
### Using `ListEmployees`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployees } from '@rh-ponto/api-client/generated';


// Call the `listEmployees()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployees();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployees(dataConnect);

console.log(data.employees);

// Or, you can use the `Promise` API.
listEmployees().then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

### Using `ListEmployees`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeesRef } from '@rh-ponto/api-client/generated';


// Call the `listEmployeesRef()` function to get a reference to the query.
const ref = listEmployeesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employees);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

## GetEmployeeById
You can execute the `GetEmployeeById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getEmployeeById(vars: GetEmployeeByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeByIdData, GetEmployeeByIdVariables>;

interface GetEmployeeByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmployeeByIdVariables): QueryRef<GetEmployeeByIdData, GetEmployeeByIdVariables>;
}
export const getEmployeeByIdRef: GetEmployeeByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEmployeeById(dc: DataConnect, vars: GetEmployeeByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeByIdData, GetEmployeeByIdVariables>;

interface GetEmployeeByIdRef {
  ...
  (dc: DataConnect, vars: GetEmployeeByIdVariables): QueryRef<GetEmployeeByIdData, GetEmployeeByIdVariables>;
}
export const getEmployeeByIdRef: GetEmployeeByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEmployeeByIdRef:
```typescript
const name = getEmployeeByIdRef.operationName;
console.log(name);
```

### Variables
The `GetEmployeeById` query requires an argument of type `GetEmployeeByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEmployeeByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetEmployeeById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEmployeeByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEmployeeByIdData {
  employee?: {
    id: UUIDString;
    user?: {
      id: UUIDString;
    } & User_Key;
      registrationNumber: string;
      fullName: string;
      cpf?: string | null;
      email?: string | null;
      phone?: string | null;
      birthDate?: DateString | null;
      hireDate?: DateString | null;
      departmentId?: UUIDString | null;
      department?: {
        id: UUIDString;
        name: string;
      } & Department_Key;
        position?: string | null;
        profilePhotoUrl?: string | null;
        pinCode?: string | null;
        isActive: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & Employee_Key;
}
```
### Using `GetEmployeeById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEmployeeById, GetEmployeeByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeById` query requires an argument of type `GetEmployeeByIdVariables`:
const getEmployeeByIdVars: GetEmployeeByIdVariables = {
  id: ..., 
};

// Call the `getEmployeeById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEmployeeById(getEmployeeByIdVars);
// Variables can be defined inline as well.
const { data } = await getEmployeeById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEmployeeById(dataConnect, getEmployeeByIdVars);

console.log(data.employee);

// Or, you can use the `Promise` API.
getEmployeeById(getEmployeeByIdVars).then((response) => {
  const data = response.data;
  console.log(data.employee);
});
```

### Using `GetEmployeeById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEmployeeByIdRef, GetEmployeeByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeById` query requires an argument of type `GetEmployeeByIdVariables`:
const getEmployeeByIdVars: GetEmployeeByIdVariables = {
  id: ..., 
};

// Call the `getEmployeeByIdRef()` function to get a reference to the query.
const ref = getEmployeeByIdRef(getEmployeeByIdVars);
// Variables can be defined inline as well.
const ref = getEmployeeByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEmployeeByIdRef(dataConnect, getEmployeeByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employee);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employee);
});
```

## GetPayrollClosureByReferenceKey
You can execute the `GetPayrollClosureByReferenceKey` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getPayrollClosureByReferenceKey(vars: GetPayrollClosureByReferenceKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayrollClosureByReferenceKeyData, GetPayrollClosureByReferenceKeyVariables>;

interface GetPayrollClosureByReferenceKeyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPayrollClosureByReferenceKeyVariables): QueryRef<GetPayrollClosureByReferenceKeyData, GetPayrollClosureByReferenceKeyVariables>;
}
export const getPayrollClosureByReferenceKeyRef: GetPayrollClosureByReferenceKeyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPayrollClosureByReferenceKey(dc: DataConnect, vars: GetPayrollClosureByReferenceKeyVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayrollClosureByReferenceKeyData, GetPayrollClosureByReferenceKeyVariables>;

interface GetPayrollClosureByReferenceKeyRef {
  ...
  (dc: DataConnect, vars: GetPayrollClosureByReferenceKeyVariables): QueryRef<GetPayrollClosureByReferenceKeyData, GetPayrollClosureByReferenceKeyVariables>;
}
export const getPayrollClosureByReferenceKeyRef: GetPayrollClosureByReferenceKeyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPayrollClosureByReferenceKeyRef:
```typescript
const name = getPayrollClosureByReferenceKeyRef.operationName;
console.log(name);
```

### Variables
The `GetPayrollClosureByReferenceKey` query requires an argument of type `GetPayrollClosureByReferenceKeyVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPayrollClosureByReferenceKeyVariables {
  referenceKey: string;
}
```
### Return Type
Recall that executing the `GetPayrollClosureByReferenceKey` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPayrollClosureByReferenceKeyData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPayrollClosureByReferenceKeyData {
  payrollClosures: ({
    id: UUIDString;
    referenceKey: string;
    referenceLabel: string;
    referenceYear: number;
    referenceMonth: number;
    periodStart: DateString;
    periodEnd: DateString;
    status: string;
    notes?: string | null;
    closedAt?: TimestampString | null;
    closedByUser?: {
      id: UUIDString;
    } & User_Key;
      stateData: unknown;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & PayrollClosure_Key)[];
}
```
### Using `GetPayrollClosureByReferenceKey`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPayrollClosureByReferenceKey, GetPayrollClosureByReferenceKeyVariables } from '@rh-ponto/api-client/generated';

// The `GetPayrollClosureByReferenceKey` query requires an argument of type `GetPayrollClosureByReferenceKeyVariables`:
const getPayrollClosureByReferenceKeyVars: GetPayrollClosureByReferenceKeyVariables = {
  referenceKey: ..., 
};

// Call the `getPayrollClosureByReferenceKey()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPayrollClosureByReferenceKey(getPayrollClosureByReferenceKeyVars);
// Variables can be defined inline as well.
const { data } = await getPayrollClosureByReferenceKey({ referenceKey: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPayrollClosureByReferenceKey(dataConnect, getPayrollClosureByReferenceKeyVars);

console.log(data.payrollClosures);

// Or, you can use the `Promise` API.
getPayrollClosureByReferenceKey(getPayrollClosureByReferenceKeyVars).then((response) => {
  const data = response.data;
  console.log(data.payrollClosures);
});
```

### Using `GetPayrollClosureByReferenceKey`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPayrollClosureByReferenceKeyRef, GetPayrollClosureByReferenceKeyVariables } from '@rh-ponto/api-client/generated';

// The `GetPayrollClosureByReferenceKey` query requires an argument of type `GetPayrollClosureByReferenceKeyVariables`:
const getPayrollClosureByReferenceKeyVars: GetPayrollClosureByReferenceKeyVariables = {
  referenceKey: ..., 
};

// Call the `getPayrollClosureByReferenceKeyRef()` function to get a reference to the query.
const ref = getPayrollClosureByReferenceKeyRef(getPayrollClosureByReferenceKeyVars);
// Variables can be defined inline as well.
const ref = getPayrollClosureByReferenceKeyRef({ referenceKey: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPayrollClosureByReferenceKeyRef(dataConnect, getPayrollClosureByReferenceKeyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payrollClosures);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollClosures);
});
```

## ListEmployeeNotifications
You can execute the `ListEmployeeNotifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listEmployeeNotifications(vars: ListEmployeeNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeNotificationsData, ListEmployeeNotificationsVariables>;

interface ListEmployeeNotificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeeNotificationsVariables): QueryRef<ListEmployeeNotificationsData, ListEmployeeNotificationsVariables>;
}
export const listEmployeeNotificationsRef: ListEmployeeNotificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployeeNotifications(dc: DataConnect, vars: ListEmployeeNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeNotificationsData, ListEmployeeNotificationsVariables>;

interface ListEmployeeNotificationsRef {
  ...
  (dc: DataConnect, vars: ListEmployeeNotificationsVariables): QueryRef<ListEmployeeNotificationsData, ListEmployeeNotificationsVariables>;
}
export const listEmployeeNotificationsRef: ListEmployeeNotificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeeNotificationsRef:
```typescript
const name = listEmployeeNotificationsRef.operationName;
console.log(name);
```

### Variables
The `ListEmployeeNotifications` query requires an argument of type `ListEmployeeNotificationsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListEmployeeNotificationsVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ListEmployeeNotifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeeNotificationsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeeNotificationsData {
  adminNotifications: ({
    id: UUIDString;
    category: string;
    title: string;
    description: string;
    href?: string | null;
    entityName?: string | null;
    entityId?: string | null;
    severity: string;
    status: string;
    triggeredAt: TimestampString;
    readAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & AdminNotification_Key)[];
}
```
### Using `ListEmployeeNotifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployeeNotifications, ListEmployeeNotificationsVariables } from '@rh-ponto/api-client/generated';

// The `ListEmployeeNotifications` query requires an argument of type `ListEmployeeNotificationsVariables`:
const listEmployeeNotificationsVars: ListEmployeeNotificationsVariables = {
  userId: ..., 
};

// Call the `listEmployeeNotifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployeeNotifications(listEmployeeNotificationsVars);
// Variables can be defined inline as well.
const { data } = await listEmployeeNotifications({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployeeNotifications(dataConnect, listEmployeeNotificationsVars);

console.log(data.adminNotifications);

// Or, you can use the `Promise` API.
listEmployeeNotifications(listEmployeeNotificationsVars).then((response) => {
  const data = response.data;
  console.log(data.adminNotifications);
});
```

### Using `ListEmployeeNotifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeeNotificationsRef, ListEmployeeNotificationsVariables } from '@rh-ponto/api-client/generated';

// The `ListEmployeeNotifications` query requires an argument of type `ListEmployeeNotificationsVariables`:
const listEmployeeNotificationsVars: ListEmployeeNotificationsVariables = {
  userId: ..., 
};

// Call the `listEmployeeNotificationsRef()` function to get a reference to the query.
const ref = listEmployeeNotificationsRef(listEmployeeNotificationsVars);
// Variables can be defined inline as well.
const ref = listEmployeeNotificationsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeeNotificationsRef(dataConnect, listEmployeeNotificationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.adminNotifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.adminNotifications);
});
```

## GetEmployeeNotificationPreferences
You can execute the `GetEmployeeNotificationPreferences` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getEmployeeNotificationPreferences(vars: GetEmployeeNotificationPreferencesVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeNotificationPreferencesData, GetEmployeeNotificationPreferencesVariables>;

interface GetEmployeeNotificationPreferencesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmployeeNotificationPreferencesVariables): QueryRef<GetEmployeeNotificationPreferencesData, GetEmployeeNotificationPreferencesVariables>;
}
export const getEmployeeNotificationPreferencesRef: GetEmployeeNotificationPreferencesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEmployeeNotificationPreferences(dc: DataConnect, vars: GetEmployeeNotificationPreferencesVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeNotificationPreferencesData, GetEmployeeNotificationPreferencesVariables>;

interface GetEmployeeNotificationPreferencesRef {
  ...
  (dc: DataConnect, vars: GetEmployeeNotificationPreferencesVariables): QueryRef<GetEmployeeNotificationPreferencesData, GetEmployeeNotificationPreferencesVariables>;
}
export const getEmployeeNotificationPreferencesRef: GetEmployeeNotificationPreferencesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEmployeeNotificationPreferencesRef:
```typescript
const name = getEmployeeNotificationPreferencesRef.operationName;
console.log(name);
```

### Variables
The `GetEmployeeNotificationPreferences` query requires an argument of type `GetEmployeeNotificationPreferencesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEmployeeNotificationPreferencesVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetEmployeeNotificationPreferences` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEmployeeNotificationPreferencesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEmployeeNotificationPreferencesData {
  employeeNotificationPreferences: ({
    id: UUIDString;
    user: {
      id: UUIDString;
    } & User_Key;
      notifyEntryReminder: boolean;
      notifyBreakReminder: boolean;
      notifyExitReminder: boolean;
      notifyJustificationStatus: boolean;
      notifyRhAdjustment: boolean;
      notifyCompanyCommunications: boolean;
      notifySystemAlerts: boolean;
      notifyVacationStatus: boolean;
      notifyDocuments: boolean;
      notifyPayroll: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & EmployeeNotificationPreference_Key)[];
}
```
### Using `GetEmployeeNotificationPreferences`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEmployeeNotificationPreferences, GetEmployeeNotificationPreferencesVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeNotificationPreferences` query requires an argument of type `GetEmployeeNotificationPreferencesVariables`:
const getEmployeeNotificationPreferencesVars: GetEmployeeNotificationPreferencesVariables = {
  userId: ..., 
};

// Call the `getEmployeeNotificationPreferences()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEmployeeNotificationPreferences(getEmployeeNotificationPreferencesVars);
// Variables can be defined inline as well.
const { data } = await getEmployeeNotificationPreferences({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEmployeeNotificationPreferences(dataConnect, getEmployeeNotificationPreferencesVars);

console.log(data.employeeNotificationPreferences);

// Or, you can use the `Promise` API.
getEmployeeNotificationPreferences(getEmployeeNotificationPreferencesVars).then((response) => {
  const data = response.data;
  console.log(data.employeeNotificationPreferences);
});
```

### Using `GetEmployeeNotificationPreferences`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEmployeeNotificationPreferencesRef, GetEmployeeNotificationPreferencesVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeNotificationPreferences` query requires an argument of type `GetEmployeeNotificationPreferencesVariables`:
const getEmployeeNotificationPreferencesVars: GetEmployeeNotificationPreferencesVariables = {
  userId: ..., 
};

// Call the `getEmployeeNotificationPreferencesRef()` function to get a reference to the query.
const ref = getEmployeeNotificationPreferencesRef(getEmployeeNotificationPreferencesVars);
// Variables can be defined inline as well.
const ref = getEmployeeNotificationPreferencesRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEmployeeNotificationPreferencesRef(dataConnect, getEmployeeNotificationPreferencesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employeeNotificationPreferences);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeNotificationPreferences);
});
```

## GetCurrentEmployeeByUserId
You can execute the `GetCurrentEmployeeByUserId` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCurrentEmployeeByUserId(vars: GetCurrentEmployeeByUserIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetCurrentEmployeeByUserIdData, GetCurrentEmployeeByUserIdVariables>;

interface GetCurrentEmployeeByUserIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCurrentEmployeeByUserIdVariables): QueryRef<GetCurrentEmployeeByUserIdData, GetCurrentEmployeeByUserIdVariables>;
}
export const getCurrentEmployeeByUserIdRef: GetCurrentEmployeeByUserIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentEmployeeByUserId(dc: DataConnect, vars: GetCurrentEmployeeByUserIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetCurrentEmployeeByUserIdData, GetCurrentEmployeeByUserIdVariables>;

interface GetCurrentEmployeeByUserIdRef {
  ...
  (dc: DataConnect, vars: GetCurrentEmployeeByUserIdVariables): QueryRef<GetCurrentEmployeeByUserIdData, GetCurrentEmployeeByUserIdVariables>;
}
export const getCurrentEmployeeByUserIdRef: GetCurrentEmployeeByUserIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentEmployeeByUserIdRef:
```typescript
const name = getCurrentEmployeeByUserIdRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentEmployeeByUserId` query requires an argument of type `GetCurrentEmployeeByUserIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCurrentEmployeeByUserIdVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetCurrentEmployeeByUserId` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentEmployeeByUserIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentEmployeeByUserIdData {
  employees: ({
    id: UUIDString;
    user?: {
      id: UUIDString;
    } & User_Key;
      registrationNumber: string;
      fullName: string;
      cpf?: string | null;
      email?: string | null;
      phone?: string | null;
      birthDate?: DateString | null;
      hireDate?: DateString | null;
      departmentId?: UUIDString | null;
      department?: {
        id: UUIDString;
        name: string;
      } & Department_Key;
        position?: string | null;
        profilePhotoUrl?: string | null;
        pinCode?: string | null;
        isActive: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & Employee_Key)[];
}
```
### Using `GetCurrentEmployeeByUserId`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentEmployeeByUserId, GetCurrentEmployeeByUserIdVariables } from '@rh-ponto/api-client/generated';

// The `GetCurrentEmployeeByUserId` query requires an argument of type `GetCurrentEmployeeByUserIdVariables`:
const getCurrentEmployeeByUserIdVars: GetCurrentEmployeeByUserIdVariables = {
  userId: ..., 
};

// Call the `getCurrentEmployeeByUserId()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentEmployeeByUserId(getCurrentEmployeeByUserIdVars);
// Variables can be defined inline as well.
const { data } = await getCurrentEmployeeByUserId({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentEmployeeByUserId(dataConnect, getCurrentEmployeeByUserIdVars);

console.log(data.employees);

// Or, you can use the `Promise` API.
getCurrentEmployeeByUserId(getCurrentEmployeeByUserIdVars).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

### Using `GetCurrentEmployeeByUserId`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentEmployeeByUserIdRef, GetCurrentEmployeeByUserIdVariables } from '@rh-ponto/api-client/generated';

// The `GetCurrentEmployeeByUserId` query requires an argument of type `GetCurrentEmployeeByUserIdVariables`:
const getCurrentEmployeeByUserIdVars: GetCurrentEmployeeByUserIdVariables = {
  userId: ..., 
};

// Call the `getCurrentEmployeeByUserIdRef()` function to get a reference to the query.
const ref = getCurrentEmployeeByUserIdRef(getCurrentEmployeeByUserIdVars);
// Variables can be defined inline as well.
const ref = getCurrentEmployeeByUserIdRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentEmployeeByUserIdRef(dataConnect, getCurrentEmployeeByUserIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employees);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

## GetCurrentEmployeeByEmail
You can execute the `GetCurrentEmployeeByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getCurrentEmployeeByEmail(vars: GetCurrentEmployeeByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetCurrentEmployeeByEmailData, GetCurrentEmployeeByEmailVariables>;

interface GetCurrentEmployeeByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCurrentEmployeeByEmailVariables): QueryRef<GetCurrentEmployeeByEmailData, GetCurrentEmployeeByEmailVariables>;
}
export const getCurrentEmployeeByEmailRef: GetCurrentEmployeeByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentEmployeeByEmail(dc: DataConnect, vars: GetCurrentEmployeeByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetCurrentEmployeeByEmailData, GetCurrentEmployeeByEmailVariables>;

interface GetCurrentEmployeeByEmailRef {
  ...
  (dc: DataConnect, vars: GetCurrentEmployeeByEmailVariables): QueryRef<GetCurrentEmployeeByEmailData, GetCurrentEmployeeByEmailVariables>;
}
export const getCurrentEmployeeByEmailRef: GetCurrentEmployeeByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentEmployeeByEmailRef:
```typescript
const name = getCurrentEmployeeByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentEmployeeByEmail` query requires an argument of type `GetCurrentEmployeeByEmailVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCurrentEmployeeByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetCurrentEmployeeByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentEmployeeByEmailData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentEmployeeByEmailData {
  employees: ({
    id: UUIDString;
    user?: {
      id: UUIDString;
    } & User_Key;
      registrationNumber: string;
      fullName: string;
      cpf?: string | null;
      email?: string | null;
      phone?: string | null;
      birthDate?: DateString | null;
      hireDate?: DateString | null;
      departmentId?: UUIDString | null;
      department?: {
        id: UUIDString;
        name: string;
      } & Department_Key;
        position?: string | null;
        profilePhotoUrl?: string | null;
        pinCode?: string | null;
        isActive: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & Employee_Key)[];
}
```
### Using `GetCurrentEmployeeByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentEmployeeByEmail, GetCurrentEmployeeByEmailVariables } from '@rh-ponto/api-client/generated';

// The `GetCurrentEmployeeByEmail` query requires an argument of type `GetCurrentEmployeeByEmailVariables`:
const getCurrentEmployeeByEmailVars: GetCurrentEmployeeByEmailVariables = {
  email: ..., 
};

// Call the `getCurrentEmployeeByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentEmployeeByEmail(getCurrentEmployeeByEmailVars);
// Variables can be defined inline as well.
const { data } = await getCurrentEmployeeByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentEmployeeByEmail(dataConnect, getCurrentEmployeeByEmailVars);

console.log(data.employees);

// Or, you can use the `Promise` API.
getCurrentEmployeeByEmail(getCurrentEmployeeByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

### Using `GetCurrentEmployeeByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentEmployeeByEmailRef, GetCurrentEmployeeByEmailVariables } from '@rh-ponto/api-client/generated';

// The `GetCurrentEmployeeByEmail` query requires an argument of type `GetCurrentEmployeeByEmailVariables`:
const getCurrentEmployeeByEmailVars: GetCurrentEmployeeByEmailVariables = {
  email: ..., 
};

// Call the `getCurrentEmployeeByEmailRef()` function to get a reference to the query.
const ref = getCurrentEmployeeByEmailRef(getCurrentEmployeeByEmailVars);
// Variables can be defined inline as well.
const ref = getCurrentEmployeeByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentEmployeeByEmailRef(dataConnect, getCurrentEmployeeByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employees);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employees);
});
```

## ListEmployeeDocuments
You can execute the `ListEmployeeDocuments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listEmployeeDocuments(vars: ListEmployeeDocumentsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeDocumentsData, ListEmployeeDocumentsVariables>;

interface ListEmployeeDocumentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeeDocumentsVariables): QueryRef<ListEmployeeDocumentsData, ListEmployeeDocumentsVariables>;
}
export const listEmployeeDocumentsRef: ListEmployeeDocumentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployeeDocuments(dc: DataConnect, vars: ListEmployeeDocumentsVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeDocumentsData, ListEmployeeDocumentsVariables>;

interface ListEmployeeDocumentsRef {
  ...
  (dc: DataConnect, vars: ListEmployeeDocumentsVariables): QueryRef<ListEmployeeDocumentsData, ListEmployeeDocumentsVariables>;
}
export const listEmployeeDocumentsRef: ListEmployeeDocumentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeeDocumentsRef:
```typescript
const name = listEmployeeDocumentsRef.operationName;
console.log(name);
```

### Variables
The `ListEmployeeDocuments` query requires an argument of type `ListEmployeeDocumentsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListEmployeeDocumentsVariables {
  employeeId: UUIDString;
}
```
### Return Type
Recall that executing the `ListEmployeeDocuments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeeDocumentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeeDocumentsData {
  employeeDocuments: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      category: string;
      title: string;
      description?: string | null;
      status: string;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      acknowledgedAt?: TimestampString | null;
      expiresAt?: DateString | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & EmployeeDocument_Key)[];
}
```
### Using `ListEmployeeDocuments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployeeDocuments, ListEmployeeDocumentsVariables } from '@rh-ponto/api-client/generated';

// The `ListEmployeeDocuments` query requires an argument of type `ListEmployeeDocumentsVariables`:
const listEmployeeDocumentsVars: ListEmployeeDocumentsVariables = {
  employeeId: ..., 
};

// Call the `listEmployeeDocuments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployeeDocuments(listEmployeeDocumentsVars);
// Variables can be defined inline as well.
const { data } = await listEmployeeDocuments({ employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployeeDocuments(dataConnect, listEmployeeDocumentsVars);

console.log(data.employeeDocuments);

// Or, you can use the `Promise` API.
listEmployeeDocuments(listEmployeeDocumentsVars).then((response) => {
  const data = response.data;
  console.log(data.employeeDocuments);
});
```

### Using `ListEmployeeDocuments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeeDocumentsRef, ListEmployeeDocumentsVariables } from '@rh-ponto/api-client/generated';

// The `ListEmployeeDocuments` query requires an argument of type `ListEmployeeDocumentsVariables`:
const listEmployeeDocumentsVars: ListEmployeeDocumentsVariables = {
  employeeId: ..., 
};

// Call the `listEmployeeDocumentsRef()` function to get a reference to the query.
const ref = listEmployeeDocumentsRef(listEmployeeDocumentsVars);
// Variables can be defined inline as well.
const ref = listEmployeeDocumentsRef({ employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeeDocumentsRef(dataConnect, listEmployeeDocumentsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employeeDocuments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeDocuments);
});
```

## GetEmployeeDocumentById
You can execute the `GetEmployeeDocumentById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getEmployeeDocumentById(vars: GetEmployeeDocumentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeDocumentByIdData, GetEmployeeDocumentByIdVariables>;

interface GetEmployeeDocumentByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmployeeDocumentByIdVariables): QueryRef<GetEmployeeDocumentByIdData, GetEmployeeDocumentByIdVariables>;
}
export const getEmployeeDocumentByIdRef: GetEmployeeDocumentByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEmployeeDocumentById(dc: DataConnect, vars: GetEmployeeDocumentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeDocumentByIdData, GetEmployeeDocumentByIdVariables>;

interface GetEmployeeDocumentByIdRef {
  ...
  (dc: DataConnect, vars: GetEmployeeDocumentByIdVariables): QueryRef<GetEmployeeDocumentByIdData, GetEmployeeDocumentByIdVariables>;
}
export const getEmployeeDocumentByIdRef: GetEmployeeDocumentByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEmployeeDocumentByIdRef:
```typescript
const name = getEmployeeDocumentByIdRef.operationName;
console.log(name);
```

### Variables
The `GetEmployeeDocumentById` query requires an argument of type `GetEmployeeDocumentByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEmployeeDocumentByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetEmployeeDocumentById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEmployeeDocumentByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEmployeeDocumentByIdData {
  employeeDocument?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      category: string;
      title: string;
      description?: string | null;
      status: string;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      acknowledgedAt?: TimestampString | null;
      expiresAt?: DateString | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & EmployeeDocument_Key;
}
```
### Using `GetEmployeeDocumentById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEmployeeDocumentById, GetEmployeeDocumentByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeDocumentById` query requires an argument of type `GetEmployeeDocumentByIdVariables`:
const getEmployeeDocumentByIdVars: GetEmployeeDocumentByIdVariables = {
  id: ..., 
};

// Call the `getEmployeeDocumentById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEmployeeDocumentById(getEmployeeDocumentByIdVars);
// Variables can be defined inline as well.
const { data } = await getEmployeeDocumentById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEmployeeDocumentById(dataConnect, getEmployeeDocumentByIdVars);

console.log(data.employeeDocument);

// Or, you can use the `Promise` API.
getEmployeeDocumentById(getEmployeeDocumentByIdVars).then((response) => {
  const data = response.data;
  console.log(data.employeeDocument);
});
```

### Using `GetEmployeeDocumentById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEmployeeDocumentByIdRef, GetEmployeeDocumentByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeDocumentById` query requires an argument of type `GetEmployeeDocumentByIdVariables`:
const getEmployeeDocumentByIdVars: GetEmployeeDocumentByIdVariables = {
  id: ..., 
};

// Call the `getEmployeeDocumentByIdRef()` function to get a reference to the query.
const ref = getEmployeeDocumentByIdRef(getEmployeeDocumentByIdVars);
// Variables can be defined inline as well.
const ref = getEmployeeDocumentByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEmployeeDocumentByIdRef(dataConnect, getEmployeeDocumentByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employeeDocument);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeDocument);
});
```

## GetEmployeeDocumentByIdForEmployee
You can execute the `GetEmployeeDocumentByIdForEmployee` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getEmployeeDocumentByIdForEmployee(vars: GetEmployeeDocumentByIdForEmployeeVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeDocumentByIdForEmployeeData, GetEmployeeDocumentByIdForEmployeeVariables>;

interface GetEmployeeDocumentByIdForEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmployeeDocumentByIdForEmployeeVariables): QueryRef<GetEmployeeDocumentByIdForEmployeeData, GetEmployeeDocumentByIdForEmployeeVariables>;
}
export const getEmployeeDocumentByIdForEmployeeRef: GetEmployeeDocumentByIdForEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEmployeeDocumentByIdForEmployee(dc: DataConnect, vars: GetEmployeeDocumentByIdForEmployeeVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeDocumentByIdForEmployeeData, GetEmployeeDocumentByIdForEmployeeVariables>;

interface GetEmployeeDocumentByIdForEmployeeRef {
  ...
  (dc: DataConnect, vars: GetEmployeeDocumentByIdForEmployeeVariables): QueryRef<GetEmployeeDocumentByIdForEmployeeData, GetEmployeeDocumentByIdForEmployeeVariables>;
}
export const getEmployeeDocumentByIdForEmployeeRef: GetEmployeeDocumentByIdForEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEmployeeDocumentByIdForEmployeeRef:
```typescript
const name = getEmployeeDocumentByIdForEmployeeRef.operationName;
console.log(name);
```

### Variables
The `GetEmployeeDocumentByIdForEmployee` query requires an argument of type `GetEmployeeDocumentByIdForEmployeeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEmployeeDocumentByIdForEmployeeVariables {
  id: UUIDString;
  employeeId: UUIDString;
}
```
### Return Type
Recall that executing the `GetEmployeeDocumentByIdForEmployee` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEmployeeDocumentByIdForEmployeeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEmployeeDocumentByIdForEmployeeData {
  employeeDocuments: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      category: string;
      title: string;
      description?: string | null;
      status: string;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      acknowledgedAt?: TimestampString | null;
      expiresAt?: DateString | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & EmployeeDocument_Key)[];
}
```
### Using `GetEmployeeDocumentByIdForEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEmployeeDocumentByIdForEmployee, GetEmployeeDocumentByIdForEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeDocumentByIdForEmployee` query requires an argument of type `GetEmployeeDocumentByIdForEmployeeVariables`:
const getEmployeeDocumentByIdForEmployeeVars: GetEmployeeDocumentByIdForEmployeeVariables = {
  id: ..., 
  employeeId: ..., 
};

// Call the `getEmployeeDocumentByIdForEmployee()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEmployeeDocumentByIdForEmployee(getEmployeeDocumentByIdForEmployeeVars);
// Variables can be defined inline as well.
const { data } = await getEmployeeDocumentByIdForEmployee({ id: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEmployeeDocumentByIdForEmployee(dataConnect, getEmployeeDocumentByIdForEmployeeVars);

console.log(data.employeeDocuments);

// Or, you can use the `Promise` API.
getEmployeeDocumentByIdForEmployee(getEmployeeDocumentByIdForEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.employeeDocuments);
});
```

### Using `GetEmployeeDocumentByIdForEmployee`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEmployeeDocumentByIdForEmployeeRef, GetEmployeeDocumentByIdForEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeDocumentByIdForEmployee` query requires an argument of type `GetEmployeeDocumentByIdForEmployeeVariables`:
const getEmployeeDocumentByIdForEmployeeVars: GetEmployeeDocumentByIdForEmployeeVariables = {
  id: ..., 
  employeeId: ..., 
};

// Call the `getEmployeeDocumentByIdForEmployeeRef()` function to get a reference to the query.
const ref = getEmployeeDocumentByIdForEmployeeRef(getEmployeeDocumentByIdForEmployeeVars);
// Variables can be defined inline as well.
const ref = getEmployeeDocumentByIdForEmployeeRef({ id: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEmployeeDocumentByIdForEmployeeRef(dataConnect, getEmployeeDocumentByIdForEmployeeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employeeDocuments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeDocuments);
});
```

## ListPayrollStatements
You can execute the `ListPayrollStatements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listPayrollStatements(vars: ListPayrollStatementsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPayrollStatementsData, ListPayrollStatementsVariables>;

interface ListPayrollStatementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPayrollStatementsVariables): QueryRef<ListPayrollStatementsData, ListPayrollStatementsVariables>;
}
export const listPayrollStatementsRef: ListPayrollStatementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPayrollStatements(dc: DataConnect, vars: ListPayrollStatementsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPayrollStatementsData, ListPayrollStatementsVariables>;

interface ListPayrollStatementsRef {
  ...
  (dc: DataConnect, vars: ListPayrollStatementsVariables): QueryRef<ListPayrollStatementsData, ListPayrollStatementsVariables>;
}
export const listPayrollStatementsRef: ListPayrollStatementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPayrollStatementsRef:
```typescript
const name = listPayrollStatementsRef.operationName;
console.log(name);
```

### Variables
The `ListPayrollStatements` query requires an argument of type `ListPayrollStatementsVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPayrollStatementsVariables {
  employeeId: UUIDString;
}
```
### Return Type
Recall that executing the `ListPayrollStatements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPayrollStatementsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPayrollStatementsData {
  payrollStatements: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      referenceLabel: string;
      referenceYear: number;
      referenceMonth: number;
      status: string;
      grossAmount: number;
      netAmount: number;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & PayrollStatement_Key)[];
}
```
### Using `ListPayrollStatements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPayrollStatements, ListPayrollStatementsVariables } from '@rh-ponto/api-client/generated';

// The `ListPayrollStatements` query requires an argument of type `ListPayrollStatementsVariables`:
const listPayrollStatementsVars: ListPayrollStatementsVariables = {
  employeeId: ..., 
};

// Call the `listPayrollStatements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPayrollStatements(listPayrollStatementsVars);
// Variables can be defined inline as well.
const { data } = await listPayrollStatements({ employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPayrollStatements(dataConnect, listPayrollStatementsVars);

console.log(data.payrollStatements);

// Or, you can use the `Promise` API.
listPayrollStatements(listPayrollStatementsVars).then((response) => {
  const data = response.data;
  console.log(data.payrollStatements);
});
```

### Using `ListPayrollStatements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPayrollStatementsRef, ListPayrollStatementsVariables } from '@rh-ponto/api-client/generated';

// The `ListPayrollStatements` query requires an argument of type `ListPayrollStatementsVariables`:
const listPayrollStatementsVars: ListPayrollStatementsVariables = {
  employeeId: ..., 
};

// Call the `listPayrollStatementsRef()` function to get a reference to the query.
const ref = listPayrollStatementsRef(listPayrollStatementsVars);
// Variables can be defined inline as well.
const ref = listPayrollStatementsRef({ employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPayrollStatementsRef(dataConnect, listPayrollStatementsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payrollStatements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollStatements);
});
```

## GetPayrollStatementById
You can execute the `GetPayrollStatementById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getPayrollStatementById(vars: GetPayrollStatementByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayrollStatementByIdData, GetPayrollStatementByIdVariables>;

interface GetPayrollStatementByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPayrollStatementByIdVariables): QueryRef<GetPayrollStatementByIdData, GetPayrollStatementByIdVariables>;
}
export const getPayrollStatementByIdRef: GetPayrollStatementByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPayrollStatementById(dc: DataConnect, vars: GetPayrollStatementByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayrollStatementByIdData, GetPayrollStatementByIdVariables>;

interface GetPayrollStatementByIdRef {
  ...
  (dc: DataConnect, vars: GetPayrollStatementByIdVariables): QueryRef<GetPayrollStatementByIdData, GetPayrollStatementByIdVariables>;
}
export const getPayrollStatementByIdRef: GetPayrollStatementByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPayrollStatementByIdRef:
```typescript
const name = getPayrollStatementByIdRef.operationName;
console.log(name);
```

### Variables
The `GetPayrollStatementById` query requires an argument of type `GetPayrollStatementByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPayrollStatementByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPayrollStatementById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPayrollStatementByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPayrollStatementByIdData {
  payrollStatement?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      referenceLabel: string;
      referenceYear: number;
      referenceMonth: number;
      status: string;
      grossAmount: number;
      netAmount: number;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & PayrollStatement_Key;
}
```
### Using `GetPayrollStatementById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPayrollStatementById, GetPayrollStatementByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetPayrollStatementById` query requires an argument of type `GetPayrollStatementByIdVariables`:
const getPayrollStatementByIdVars: GetPayrollStatementByIdVariables = {
  id: ..., 
};

// Call the `getPayrollStatementById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPayrollStatementById(getPayrollStatementByIdVars);
// Variables can be defined inline as well.
const { data } = await getPayrollStatementById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPayrollStatementById(dataConnect, getPayrollStatementByIdVars);

console.log(data.payrollStatement);

// Or, you can use the `Promise` API.
getPayrollStatementById(getPayrollStatementByIdVars).then((response) => {
  const data = response.data;
  console.log(data.payrollStatement);
});
```

### Using `GetPayrollStatementById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPayrollStatementByIdRef, GetPayrollStatementByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetPayrollStatementById` query requires an argument of type `GetPayrollStatementByIdVariables`:
const getPayrollStatementByIdVars: GetPayrollStatementByIdVariables = {
  id: ..., 
};

// Call the `getPayrollStatementByIdRef()` function to get a reference to the query.
const ref = getPayrollStatementByIdRef(getPayrollStatementByIdVars);
// Variables can be defined inline as well.
const ref = getPayrollStatementByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPayrollStatementByIdRef(dataConnect, getPayrollStatementByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payrollStatement);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollStatement);
});
```

## GetPayrollStatementByIdForEmployee
You can execute the `GetPayrollStatementByIdForEmployee` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getPayrollStatementByIdForEmployee(vars: GetPayrollStatementByIdForEmployeeVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayrollStatementByIdForEmployeeData, GetPayrollStatementByIdForEmployeeVariables>;

interface GetPayrollStatementByIdForEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPayrollStatementByIdForEmployeeVariables): QueryRef<GetPayrollStatementByIdForEmployeeData, GetPayrollStatementByIdForEmployeeVariables>;
}
export const getPayrollStatementByIdForEmployeeRef: GetPayrollStatementByIdForEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPayrollStatementByIdForEmployee(dc: DataConnect, vars: GetPayrollStatementByIdForEmployeeVariables, options?: ExecuteQueryOptions): QueryPromise<GetPayrollStatementByIdForEmployeeData, GetPayrollStatementByIdForEmployeeVariables>;

interface GetPayrollStatementByIdForEmployeeRef {
  ...
  (dc: DataConnect, vars: GetPayrollStatementByIdForEmployeeVariables): QueryRef<GetPayrollStatementByIdForEmployeeData, GetPayrollStatementByIdForEmployeeVariables>;
}
export const getPayrollStatementByIdForEmployeeRef: GetPayrollStatementByIdForEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPayrollStatementByIdForEmployeeRef:
```typescript
const name = getPayrollStatementByIdForEmployeeRef.operationName;
console.log(name);
```

### Variables
The `GetPayrollStatementByIdForEmployee` query requires an argument of type `GetPayrollStatementByIdForEmployeeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPayrollStatementByIdForEmployeeVariables {
  id: UUIDString;
  employeeId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPayrollStatementByIdForEmployee` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPayrollStatementByIdForEmployeeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPayrollStatementByIdForEmployeeData {
  payrollStatements: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      referenceLabel: string;
      referenceYear: number;
      referenceMonth: number;
      status: string;
      grossAmount: number;
      netAmount: number;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & PayrollStatement_Key)[];
}
```
### Using `GetPayrollStatementByIdForEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPayrollStatementByIdForEmployee, GetPayrollStatementByIdForEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `GetPayrollStatementByIdForEmployee` query requires an argument of type `GetPayrollStatementByIdForEmployeeVariables`:
const getPayrollStatementByIdForEmployeeVars: GetPayrollStatementByIdForEmployeeVariables = {
  id: ..., 
  employeeId: ..., 
};

// Call the `getPayrollStatementByIdForEmployee()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPayrollStatementByIdForEmployee(getPayrollStatementByIdForEmployeeVars);
// Variables can be defined inline as well.
const { data } = await getPayrollStatementByIdForEmployee({ id: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPayrollStatementByIdForEmployee(dataConnect, getPayrollStatementByIdForEmployeeVars);

console.log(data.payrollStatements);

// Or, you can use the `Promise` API.
getPayrollStatementByIdForEmployee(getPayrollStatementByIdForEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.payrollStatements);
});
```

### Using `GetPayrollStatementByIdForEmployee`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPayrollStatementByIdForEmployeeRef, GetPayrollStatementByIdForEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `GetPayrollStatementByIdForEmployee` query requires an argument of type `GetPayrollStatementByIdForEmployeeVariables`:
const getPayrollStatementByIdForEmployeeVars: GetPayrollStatementByIdForEmployeeVariables = {
  id: ..., 
  employeeId: ..., 
};

// Call the `getPayrollStatementByIdForEmployeeRef()` function to get a reference to the query.
const ref = getPayrollStatementByIdForEmployeeRef(getPayrollStatementByIdForEmployeeVars);
// Variables can be defined inline as well.
const ref = getPayrollStatementByIdForEmployeeRef({ id: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPayrollStatementByIdForEmployeeRef(dataConnect, getPayrollStatementByIdForEmployeeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payrollStatements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollStatements);
});
```

## ListEmployeeVacationRequestsByEmployee
You can execute the `ListEmployeeVacationRequestsByEmployee` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listEmployeeVacationRequestsByEmployee(vars: ListEmployeeVacationRequestsByEmployeeVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeVacationRequestsByEmployeeData, ListEmployeeVacationRequestsByEmployeeVariables>;

interface ListEmployeeVacationRequestsByEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeeVacationRequestsByEmployeeVariables): QueryRef<ListEmployeeVacationRequestsByEmployeeData, ListEmployeeVacationRequestsByEmployeeVariables>;
}
export const listEmployeeVacationRequestsByEmployeeRef: ListEmployeeVacationRequestsByEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployeeVacationRequestsByEmployee(dc: DataConnect, vars: ListEmployeeVacationRequestsByEmployeeVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeVacationRequestsByEmployeeData, ListEmployeeVacationRequestsByEmployeeVariables>;

interface ListEmployeeVacationRequestsByEmployeeRef {
  ...
  (dc: DataConnect, vars: ListEmployeeVacationRequestsByEmployeeVariables): QueryRef<ListEmployeeVacationRequestsByEmployeeData, ListEmployeeVacationRequestsByEmployeeVariables>;
}
export const listEmployeeVacationRequestsByEmployeeRef: ListEmployeeVacationRequestsByEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeeVacationRequestsByEmployeeRef:
```typescript
const name = listEmployeeVacationRequestsByEmployeeRef.operationName;
console.log(name);
```

### Variables
The `ListEmployeeVacationRequestsByEmployee` query requires an argument of type `ListEmployeeVacationRequestsByEmployeeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListEmployeeVacationRequestsByEmployeeVariables {
  employeeId: UUIDString;
}
```
### Return Type
Recall that executing the `ListEmployeeVacationRequestsByEmployee` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeeVacationRequestsByEmployeeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeeVacationRequestsByEmployeeData {
  vacationRequests: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      requestedAt: TimestampString;
      startDate: DateString;
      endDate: DateString;
      totalDays: number;
      availableDays: number;
      accrualPeriod?: string | null;
      advanceThirteenthSalary: boolean;
      cashBonus: boolean;
      status: string;
      attachmentFileName?: string | null;
      attachmentFileUrl?: string | null;
      coverageNotes?: string | null;
      reviewNotes?: string | null;
      managerApprovalStatus: string;
      managerApprovalActor?: string | null;
      managerApprovalTimestamp?: TimestampString | null;
      managerApprovalNotes?: string | null;
      hrApprovalStatus: string;
      hrApprovalActor?: string | null;
      hrApprovalTimestamp?: TimestampString | null;
      hrApprovalNotes?: string | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & VacationRequest_Key)[];
}
```
### Using `ListEmployeeVacationRequestsByEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployeeVacationRequestsByEmployee, ListEmployeeVacationRequestsByEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `ListEmployeeVacationRequestsByEmployee` query requires an argument of type `ListEmployeeVacationRequestsByEmployeeVariables`:
const listEmployeeVacationRequestsByEmployeeVars: ListEmployeeVacationRequestsByEmployeeVariables = {
  employeeId: ..., 
};

// Call the `listEmployeeVacationRequestsByEmployee()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployeeVacationRequestsByEmployee(listEmployeeVacationRequestsByEmployeeVars);
// Variables can be defined inline as well.
const { data } = await listEmployeeVacationRequestsByEmployee({ employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployeeVacationRequestsByEmployee(dataConnect, listEmployeeVacationRequestsByEmployeeVars);

console.log(data.vacationRequests);

// Or, you can use the `Promise` API.
listEmployeeVacationRequestsByEmployee(listEmployeeVacationRequestsByEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.vacationRequests);
});
```

### Using `ListEmployeeVacationRequestsByEmployee`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeeVacationRequestsByEmployeeRef, ListEmployeeVacationRequestsByEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `ListEmployeeVacationRequestsByEmployee` query requires an argument of type `ListEmployeeVacationRequestsByEmployeeVariables`:
const listEmployeeVacationRequestsByEmployeeVars: ListEmployeeVacationRequestsByEmployeeVariables = {
  employeeId: ..., 
};

// Call the `listEmployeeVacationRequestsByEmployeeRef()` function to get a reference to the query.
const ref = listEmployeeVacationRequestsByEmployeeRef(listEmployeeVacationRequestsByEmployeeVars);
// Variables can be defined inline as well.
const ref = listEmployeeVacationRequestsByEmployeeRef({ employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeeVacationRequestsByEmployeeRef(dataConnect, listEmployeeVacationRequestsByEmployeeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vacationRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vacationRequests);
});
```

## GetEmployeeVacationRequestByIdForEmployee
You can execute the `GetEmployeeVacationRequestByIdForEmployee` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getEmployeeVacationRequestByIdForEmployee(vars: GetEmployeeVacationRequestByIdForEmployeeVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeVacationRequestByIdForEmployeeData, GetEmployeeVacationRequestByIdForEmployeeVariables>;

interface GetEmployeeVacationRequestByIdForEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEmployeeVacationRequestByIdForEmployeeVariables): QueryRef<GetEmployeeVacationRequestByIdForEmployeeData, GetEmployeeVacationRequestByIdForEmployeeVariables>;
}
export const getEmployeeVacationRequestByIdForEmployeeRef: GetEmployeeVacationRequestByIdForEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEmployeeVacationRequestByIdForEmployee(dc: DataConnect, vars: GetEmployeeVacationRequestByIdForEmployeeVariables, options?: ExecuteQueryOptions): QueryPromise<GetEmployeeVacationRequestByIdForEmployeeData, GetEmployeeVacationRequestByIdForEmployeeVariables>;

interface GetEmployeeVacationRequestByIdForEmployeeRef {
  ...
  (dc: DataConnect, vars: GetEmployeeVacationRequestByIdForEmployeeVariables): QueryRef<GetEmployeeVacationRequestByIdForEmployeeData, GetEmployeeVacationRequestByIdForEmployeeVariables>;
}
export const getEmployeeVacationRequestByIdForEmployeeRef: GetEmployeeVacationRequestByIdForEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEmployeeVacationRequestByIdForEmployeeRef:
```typescript
const name = getEmployeeVacationRequestByIdForEmployeeRef.operationName;
console.log(name);
```

### Variables
The `GetEmployeeVacationRequestByIdForEmployee` query requires an argument of type `GetEmployeeVacationRequestByIdForEmployeeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEmployeeVacationRequestByIdForEmployeeVariables {
  id: UUIDString;
  employeeId: UUIDString;
}
```
### Return Type
Recall that executing the `GetEmployeeVacationRequestByIdForEmployee` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEmployeeVacationRequestByIdForEmployeeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEmployeeVacationRequestByIdForEmployeeData {
  vacationRequests: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      requestedAt: TimestampString;
      startDate: DateString;
      endDate: DateString;
      totalDays: number;
      availableDays: number;
      accrualPeriod?: string | null;
      advanceThirteenthSalary: boolean;
      cashBonus: boolean;
      status: string;
      attachmentFileName?: string | null;
      attachmentFileUrl?: string | null;
      coverageNotes?: string | null;
      reviewNotes?: string | null;
      managerApprovalStatus: string;
      managerApprovalActor?: string | null;
      managerApprovalTimestamp?: TimestampString | null;
      managerApprovalNotes?: string | null;
      hrApprovalStatus: string;
      hrApprovalActor?: string | null;
      hrApprovalTimestamp?: TimestampString | null;
      hrApprovalNotes?: string | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & VacationRequest_Key)[];
}
```
### Using `GetEmployeeVacationRequestByIdForEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEmployeeVacationRequestByIdForEmployee, GetEmployeeVacationRequestByIdForEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeVacationRequestByIdForEmployee` query requires an argument of type `GetEmployeeVacationRequestByIdForEmployeeVariables`:
const getEmployeeVacationRequestByIdForEmployeeVars: GetEmployeeVacationRequestByIdForEmployeeVariables = {
  id: ..., 
  employeeId: ..., 
};

// Call the `getEmployeeVacationRequestByIdForEmployee()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEmployeeVacationRequestByIdForEmployee(getEmployeeVacationRequestByIdForEmployeeVars);
// Variables can be defined inline as well.
const { data } = await getEmployeeVacationRequestByIdForEmployee({ id: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEmployeeVacationRequestByIdForEmployee(dataConnect, getEmployeeVacationRequestByIdForEmployeeVars);

console.log(data.vacationRequests);

// Or, you can use the `Promise` API.
getEmployeeVacationRequestByIdForEmployee(getEmployeeVacationRequestByIdForEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.vacationRequests);
});
```

### Using `GetEmployeeVacationRequestByIdForEmployee`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEmployeeVacationRequestByIdForEmployeeRef, GetEmployeeVacationRequestByIdForEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `GetEmployeeVacationRequestByIdForEmployee` query requires an argument of type `GetEmployeeVacationRequestByIdForEmployeeVariables`:
const getEmployeeVacationRequestByIdForEmployeeVars: GetEmployeeVacationRequestByIdForEmployeeVariables = {
  id: ..., 
  employeeId: ..., 
};

// Call the `getEmployeeVacationRequestByIdForEmployeeRef()` function to get a reference to the query.
const ref = getEmployeeVacationRequestByIdForEmployeeRef(getEmployeeVacationRequestByIdForEmployeeVars);
// Variables can be defined inline as well.
const ref = getEmployeeVacationRequestByIdForEmployeeRef({ id: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEmployeeVacationRequestByIdForEmployeeRef(dataConnect, getEmployeeVacationRequestByIdForEmployeeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vacationRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vacationRequests);
});
```

## ListVacationRequests
You can execute the `ListVacationRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listVacationRequests(options?: ExecuteQueryOptions): QueryPromise<ListVacationRequestsData, undefined>;

interface ListVacationRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVacationRequestsData, undefined>;
}
export const listVacationRequestsRef: ListVacationRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVacationRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListVacationRequestsData, undefined>;

interface ListVacationRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListVacationRequestsData, undefined>;
}
export const listVacationRequestsRef: ListVacationRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVacationRequestsRef:
```typescript
const name = listVacationRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListVacationRequests` query has no variables.
### Return Type
Recall that executing the `ListVacationRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVacationRequestsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListVacationRequestsData {
  vacationRequests: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      requestedAt: TimestampString;
      startDate: DateString;
      endDate: DateString;
      totalDays: number;
      availableDays: number;
      accrualPeriod?: string | null;
      advanceThirteenthSalary: boolean;
      cashBonus: boolean;
      status: string;
      attachmentFileName?: string | null;
      attachmentFileUrl?: string | null;
      coverageNotes?: string | null;
      reviewNotes?: string | null;
      managerApprovalStatus: string;
      managerApprovalActor?: string | null;
      managerApprovalTimestamp?: TimestampString | null;
      managerApprovalNotes?: string | null;
      hrApprovalStatus: string;
      hrApprovalActor?: string | null;
      hrApprovalTimestamp?: TimestampString | null;
      hrApprovalNotes?: string | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & VacationRequest_Key)[];
}
```
### Using `ListVacationRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVacationRequests } from '@rh-ponto/api-client/generated';


// Call the `listVacationRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVacationRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVacationRequests(dataConnect);

console.log(data.vacationRequests);

// Or, you can use the `Promise` API.
listVacationRequests().then((response) => {
  const data = response.data;
  console.log(data.vacationRequests);
});
```

### Using `ListVacationRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVacationRequestsRef } from '@rh-ponto/api-client/generated';


// Call the `listVacationRequestsRef()` function to get a reference to the query.
const ref = listVacationRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVacationRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vacationRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vacationRequests);
});
```

## GetVacationRequestById
You can execute the `GetVacationRequestById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getVacationRequestById(vars: GetVacationRequestByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetVacationRequestByIdData, GetVacationRequestByIdVariables>;

interface GetVacationRequestByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVacationRequestByIdVariables): QueryRef<GetVacationRequestByIdData, GetVacationRequestByIdVariables>;
}
export const getVacationRequestByIdRef: GetVacationRequestByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVacationRequestById(dc: DataConnect, vars: GetVacationRequestByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetVacationRequestByIdData, GetVacationRequestByIdVariables>;

interface GetVacationRequestByIdRef {
  ...
  (dc: DataConnect, vars: GetVacationRequestByIdVariables): QueryRef<GetVacationRequestByIdData, GetVacationRequestByIdVariables>;
}
export const getVacationRequestByIdRef: GetVacationRequestByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVacationRequestByIdRef:
```typescript
const name = getVacationRequestByIdRef.operationName;
console.log(name);
```

### Variables
The `GetVacationRequestById` query requires an argument of type `GetVacationRequestByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVacationRequestByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetVacationRequestById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVacationRequestByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVacationRequestByIdData {
  vacationRequest?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      requestedAt: TimestampString;
      startDate: DateString;
      endDate: DateString;
      totalDays: number;
      availableDays: number;
      accrualPeriod?: string | null;
      advanceThirteenthSalary: boolean;
      cashBonus: boolean;
      status: string;
      attachmentFileName?: string | null;
      attachmentFileUrl?: string | null;
      coverageNotes?: string | null;
      reviewNotes?: string | null;
      managerApprovalStatus: string;
      managerApprovalActor?: string | null;
      managerApprovalTimestamp?: TimestampString | null;
      managerApprovalNotes?: string | null;
      hrApprovalStatus: string;
      hrApprovalActor?: string | null;
      hrApprovalTimestamp?: TimestampString | null;
      hrApprovalNotes?: string | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & VacationRequest_Key;
}
```
### Using `GetVacationRequestById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVacationRequestById, GetVacationRequestByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetVacationRequestById` query requires an argument of type `GetVacationRequestByIdVariables`:
const getVacationRequestByIdVars: GetVacationRequestByIdVariables = {
  id: ..., 
};

// Call the `getVacationRequestById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVacationRequestById(getVacationRequestByIdVars);
// Variables can be defined inline as well.
const { data } = await getVacationRequestById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVacationRequestById(dataConnect, getVacationRequestByIdVars);

console.log(data.vacationRequest);

// Or, you can use the `Promise` API.
getVacationRequestById(getVacationRequestByIdVars).then((response) => {
  const data = response.data;
  console.log(data.vacationRequest);
});
```

### Using `GetVacationRequestById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVacationRequestByIdRef, GetVacationRequestByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetVacationRequestById` query requires an argument of type `GetVacationRequestByIdVariables`:
const getVacationRequestByIdVars: GetVacationRequestByIdVariables = {
  id: ..., 
};

// Call the `getVacationRequestByIdRef()` function to get a reference to the query.
const ref = getVacationRequestByIdRef(getVacationRequestByIdVars);
// Variables can be defined inline as well.
const ref = getVacationRequestByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVacationRequestByIdRef(dataConnect, getVacationRequestByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vacationRequest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vacationRequest);
});
```

## ListAdminEmployeeDocuments
You can execute the `ListAdminEmployeeDocuments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listAdminEmployeeDocuments(options?: ExecuteQueryOptions): QueryPromise<ListAdminEmployeeDocumentsData, undefined>;

interface ListAdminEmployeeDocumentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAdminEmployeeDocumentsData, undefined>;
}
export const listAdminEmployeeDocumentsRef: ListAdminEmployeeDocumentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAdminEmployeeDocuments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAdminEmployeeDocumentsData, undefined>;

interface ListAdminEmployeeDocumentsRef {
  ...
  (dc: DataConnect): QueryRef<ListAdminEmployeeDocumentsData, undefined>;
}
export const listAdminEmployeeDocumentsRef: ListAdminEmployeeDocumentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAdminEmployeeDocumentsRef:
```typescript
const name = listAdminEmployeeDocumentsRef.operationName;
console.log(name);
```

### Variables
The `ListAdminEmployeeDocuments` query has no variables.
### Return Type
Recall that executing the `ListAdminEmployeeDocuments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAdminEmployeeDocumentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAdminEmployeeDocumentsData {
  employeeDocuments: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      category: string;
      title: string;
      description?: string | null;
      status: string;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      acknowledgedAt?: TimestampString | null;
      expiresAt?: DateString | null;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & EmployeeDocument_Key)[];
}
```
### Using `ListAdminEmployeeDocuments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAdminEmployeeDocuments } from '@rh-ponto/api-client/generated';


// Call the `listAdminEmployeeDocuments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAdminEmployeeDocuments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAdminEmployeeDocuments(dataConnect);

console.log(data.employeeDocuments);

// Or, you can use the `Promise` API.
listAdminEmployeeDocuments().then((response) => {
  const data = response.data;
  console.log(data.employeeDocuments);
});
```

### Using `ListAdminEmployeeDocuments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAdminEmployeeDocumentsRef } from '@rh-ponto/api-client/generated';


// Call the `listAdminEmployeeDocumentsRef()` function to get a reference to the query.
const ref = listAdminEmployeeDocumentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAdminEmployeeDocumentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employeeDocuments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeDocuments);
});
```

## ListAdminPayrollStatements
You can execute the `ListAdminPayrollStatements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listAdminPayrollStatements(options?: ExecuteQueryOptions): QueryPromise<ListAdminPayrollStatementsData, undefined>;

interface ListAdminPayrollStatementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAdminPayrollStatementsData, undefined>;
}
export const listAdminPayrollStatementsRef: ListAdminPayrollStatementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAdminPayrollStatements(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAdminPayrollStatementsData, undefined>;

interface ListAdminPayrollStatementsRef {
  ...
  (dc: DataConnect): QueryRef<ListAdminPayrollStatementsData, undefined>;
}
export const listAdminPayrollStatementsRef: ListAdminPayrollStatementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAdminPayrollStatementsRef:
```typescript
const name = listAdminPayrollStatementsRef.operationName;
console.log(name);
```

### Variables
The `ListAdminPayrollStatements` query has no variables.
### Return Type
Recall that executing the `ListAdminPayrollStatements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAdminPayrollStatementsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAdminPayrollStatementsData {
  payrollStatements: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      referenceLabel: string;
      referenceYear: number;
      referenceMonth: number;
      status: string;
      grossAmount: number;
      netAmount: number;
      fileName: string;
      fileUrl: string;
      issuedAt: TimestampString;
      createdAt: TimestampString;
      updatedAt: TimestampString;
  } & PayrollStatement_Key)[];
}
```
### Using `ListAdminPayrollStatements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAdminPayrollStatements } from '@rh-ponto/api-client/generated';


// Call the `listAdminPayrollStatements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAdminPayrollStatements();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAdminPayrollStatements(dataConnect);

console.log(data.payrollStatements);

// Or, you can use the `Promise` API.
listAdminPayrollStatements().then((response) => {
  const data = response.data;
  console.log(data.payrollStatements);
});
```

### Using `ListAdminPayrollStatements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAdminPayrollStatementsRef } from '@rh-ponto/api-client/generated';


// Call the `listAdminPayrollStatementsRef()` function to get a reference to the query.
const ref = listAdminPayrollStatementsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAdminPayrollStatementsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.payrollStatements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollStatements);
});
```

## GetUserByFirebaseUid
You can execute the `GetUserByFirebaseUid` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserByFirebaseUid(vars: GetUserByFirebaseUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByFirebaseUidData, GetUserByFirebaseUidVariables>;

interface GetUserByFirebaseUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByFirebaseUidVariables): QueryRef<GetUserByFirebaseUidData, GetUserByFirebaseUidVariables>;
}
export const getUserByFirebaseUidRef: GetUserByFirebaseUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByFirebaseUid(dc: DataConnect, vars: GetUserByFirebaseUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByFirebaseUidData, GetUserByFirebaseUidVariables>;

interface GetUserByFirebaseUidRef {
  ...
  (dc: DataConnect, vars: GetUserByFirebaseUidVariables): QueryRef<GetUserByFirebaseUidData, GetUserByFirebaseUidVariables>;
}
export const getUserByFirebaseUidRef: GetUserByFirebaseUidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByFirebaseUidRef:
```typescript
const name = getUserByFirebaseUidRef.operationName;
console.log(name);
```

### Variables
The `GetUserByFirebaseUid` query requires an argument of type `GetUserByFirebaseUidVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByFirebaseUidVariables {
  firebaseUid: string;
}
```
### Return Type
Recall that executing the `GetUserByFirebaseUid` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByFirebaseUidData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserByFirebaseUidData {
  users: ({
    id: UUIDString;
    firebaseUid: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key)[];
}
```
### Using `GetUserByFirebaseUid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByFirebaseUid, GetUserByFirebaseUidVariables } from '@rh-ponto/api-client/generated';

// The `GetUserByFirebaseUid` query requires an argument of type `GetUserByFirebaseUidVariables`:
const getUserByFirebaseUidVars: GetUserByFirebaseUidVariables = {
  firebaseUid: ..., 
};

// Call the `getUserByFirebaseUid()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByFirebaseUid(getUserByFirebaseUidVars);
// Variables can be defined inline as well.
const { data } = await getUserByFirebaseUid({ firebaseUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByFirebaseUid(dataConnect, getUserByFirebaseUidVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByFirebaseUid(getUserByFirebaseUidVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUserByFirebaseUid`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByFirebaseUidRef, GetUserByFirebaseUidVariables } from '@rh-ponto/api-client/generated';

// The `GetUserByFirebaseUid` query requires an argument of type `GetUserByFirebaseUidVariables`:
const getUserByFirebaseUidVars: GetUserByFirebaseUidVariables = {
  firebaseUid: ..., 
};

// Call the `getUserByFirebaseUidRef()` function to get a reference to the query.
const ref = getUserByFirebaseUidRef(getUserByFirebaseUidVars);
// Variables can be defined inline as well.
const ref = getUserByFirebaseUidRef({ firebaseUid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByFirebaseUidRef(dataConnect, getUserByFirebaseUidVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetUserByEmail
You can execute the `GetUserByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getUserByEmail(vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByEmailRef:
```typescript
const name = getUserByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetUserByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByEmailData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserByEmailData {
  users: ({
    id: UUIDString;
    firebaseUid: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & User_Key)[];
}
```
### Using `GetUserByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByEmail, GetUserByEmailVariables } from '@rh-ponto/api-client/generated';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByEmail(getUserByEmailVars);
// Variables can be defined inline as well.
const { data } = await getUserByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByEmail(dataConnect, getUserByEmailVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByEmail(getUserByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUserByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByEmailRef, GetUserByEmailVariables } from '@rh-ponto/api-client/generated';

// The `GetUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmailRef()` function to get a reference to the query.
const ref = getUserByEmailRef(getUserByEmailVars);
// Variables can be defined inline as well.
const ref = getUserByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByEmailRef(dataConnect, getUserByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## ListJustifications
You can execute the `ListJustifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listJustifications(options?: ExecuteQueryOptions): QueryPromise<ListJustificationsData, undefined>;

interface ListJustificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJustificationsData, undefined>;
}
export const listJustificationsRef: ListJustificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listJustifications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJustificationsData, undefined>;

interface ListJustificationsRef {
  ...
  (dc: DataConnect): QueryRef<ListJustificationsData, undefined>;
}
export const listJustificationsRef: ListJustificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listJustificationsRef:
```typescript
const name = listJustificationsRef.operationName;
console.log(name);
```

### Variables
The `ListJustifications` query has no variables.
### Return Type
Recall that executing the `ListJustifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListJustificationsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListJustificationsData {
  justifications: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      timeRecord?: {
        id: UUIDString;
      } & TimeRecord_Key;
        type: string;
        reason: string;
        status: string;
        requestedRecordType?: string | null;
        requestedRecordedAt?: TimestampString | null;
        reviewedByUser?: {
          id: UUIDString;
        } & User_Key;
          reviewedAt?: TimestampString | null;
          reviewNotes?: string | null;
          createdAt: TimestampString;
          updatedAt: TimestampString;
  } & Justification_Key)[];
}
```
### Using `ListJustifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listJustifications } from '@rh-ponto/api-client/generated';


// Call the `listJustifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listJustifications();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listJustifications(dataConnect);

console.log(data.justifications);

// Or, you can use the `Promise` API.
listJustifications().then((response) => {
  const data = response.data;
  console.log(data.justifications);
});
```

### Using `ListJustifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listJustificationsRef } from '@rh-ponto/api-client/generated';


// Call the `listJustificationsRef()` function to get a reference to the query.
const ref = listJustificationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listJustificationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.justifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.justifications);
});
```

## GetJustificationById
You can execute the `GetJustificationById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getJustificationById(vars: GetJustificationByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetJustificationByIdData, GetJustificationByIdVariables>;

interface GetJustificationByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJustificationByIdVariables): QueryRef<GetJustificationByIdData, GetJustificationByIdVariables>;
}
export const getJustificationByIdRef: GetJustificationByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getJustificationById(dc: DataConnect, vars: GetJustificationByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetJustificationByIdData, GetJustificationByIdVariables>;

interface GetJustificationByIdRef {
  ...
  (dc: DataConnect, vars: GetJustificationByIdVariables): QueryRef<GetJustificationByIdData, GetJustificationByIdVariables>;
}
export const getJustificationByIdRef: GetJustificationByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getJustificationByIdRef:
```typescript
const name = getJustificationByIdRef.operationName;
console.log(name);
```

### Variables
The `GetJustificationById` query requires an argument of type `GetJustificationByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetJustificationByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetJustificationById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetJustificationByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetJustificationByIdData {
  justification?: {
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      timeRecord?: {
        id: UUIDString;
      } & TimeRecord_Key;
        type: string;
        reason: string;
        status: string;
        requestedRecordType?: string | null;
        requestedRecordedAt?: TimestampString | null;
        reviewedByUser?: {
          id: UUIDString;
        } & User_Key;
          reviewedAt?: TimestampString | null;
          reviewNotes?: string | null;
          createdAt: TimestampString;
          updatedAt: TimestampString;
  } & Justification_Key;
}
```
### Using `GetJustificationById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getJustificationById, GetJustificationByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetJustificationById` query requires an argument of type `GetJustificationByIdVariables`:
const getJustificationByIdVars: GetJustificationByIdVariables = {
  id: ..., 
};

// Call the `getJustificationById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getJustificationById(getJustificationByIdVars);
// Variables can be defined inline as well.
const { data } = await getJustificationById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getJustificationById(dataConnect, getJustificationByIdVars);

console.log(data.justification);

// Or, you can use the `Promise` API.
getJustificationById(getJustificationByIdVars).then((response) => {
  const data = response.data;
  console.log(data.justification);
});
```

### Using `GetJustificationById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getJustificationByIdRef, GetJustificationByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetJustificationById` query requires an argument of type `GetJustificationByIdVariables`:
const getJustificationByIdVars: GetJustificationByIdVariables = {
  id: ..., 
};

// Call the `getJustificationByIdRef()` function to get a reference to the query.
const ref = getJustificationByIdRef(getJustificationByIdVars);
// Variables can be defined inline as well.
const ref = getJustificationByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getJustificationByIdRef(dataConnect, getJustificationByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.justification);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.justification);
});
```

## ListJustificationAttachments
You can execute the `ListJustificationAttachments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listJustificationAttachments(options?: ExecuteQueryOptions): QueryPromise<ListJustificationAttachmentsData, undefined>;

interface ListJustificationAttachmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJustificationAttachmentsData, undefined>;
}
export const listJustificationAttachmentsRef: ListJustificationAttachmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listJustificationAttachments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJustificationAttachmentsData, undefined>;

interface ListJustificationAttachmentsRef {
  ...
  (dc: DataConnect): QueryRef<ListJustificationAttachmentsData, undefined>;
}
export const listJustificationAttachmentsRef: ListJustificationAttachmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listJustificationAttachmentsRef:
```typescript
const name = listJustificationAttachmentsRef.operationName;
console.log(name);
```

### Variables
The `ListJustificationAttachments` query has no variables.
### Return Type
Recall that executing the `ListJustificationAttachments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListJustificationAttachmentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListJustificationAttachmentsData {
  justificationAttachments: ({
    id: UUIDString;
    justification: {
      id: UUIDString;
    } & Justification_Key;
      fileName: string;
      fileUrl: string;
      contentType?: string | null;
      fileSizeBytes?: Int64String | null;
      uploadedByUser?: {
        id: UUIDString;
      } & User_Key;
        createdAt: TimestampString;
  } & JustificationAttachment_Key)[];
}
```
### Using `ListJustificationAttachments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listJustificationAttachments } from '@rh-ponto/api-client/generated';


// Call the `listJustificationAttachments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listJustificationAttachments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listJustificationAttachments(dataConnect);

console.log(data.justificationAttachments);

// Or, you can use the `Promise` API.
listJustificationAttachments().then((response) => {
  const data = response.data;
  console.log(data.justificationAttachments);
});
```

### Using `ListJustificationAttachments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listJustificationAttachmentsRef } from '@rh-ponto/api-client/generated';


// Call the `listJustificationAttachmentsRef()` function to get a reference to the query.
const ref = listJustificationAttachmentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listJustificationAttachmentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.justificationAttachments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.justificationAttachments);
});
```

## ListDepartments
You can execute the `ListDepartments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listDepartments(options?: ExecuteQueryOptions): QueryPromise<ListDepartmentsData, undefined>;

interface ListDepartmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDepartmentsData, undefined>;
}
export const listDepartmentsRef: ListDepartmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDepartments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDepartmentsData, undefined>;

interface ListDepartmentsRef {
  ...
  (dc: DataConnect): QueryRef<ListDepartmentsData, undefined>;
}
export const listDepartmentsRef: ListDepartmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDepartmentsRef:
```typescript
const name = listDepartmentsRef.operationName;
console.log(name);
```

### Variables
The `ListDepartments` query has no variables.
### Return Type
Recall that executing the `ListDepartments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDepartmentsData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDepartmentsData {
  departments: ({
    id: UUIDString;
    code: string;
    name: string;
    managerId?: UUIDString | null;
    manager?: {
      id: UUIDString;
      fullName: string;
    } & Employee_Key;
      description?: string | null;
      costCenter?: string | null;
      isActive: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
      employees_on_department: ({
        id: UUIDString;
      } & Employee_Key)[];
  } & Department_Key)[];
}
```
### Using `ListDepartments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDepartments } from '@rh-ponto/api-client/generated';


// Call the `listDepartments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDepartments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDepartments(dataConnect);

console.log(data.departments);

// Or, you can use the `Promise` API.
listDepartments().then((response) => {
  const data = response.data;
  console.log(data.departments);
});
```

### Using `ListDepartments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDepartmentsRef } from '@rh-ponto/api-client/generated';


// Call the `listDepartmentsRef()` function to get a reference to the query.
const ref = listDepartmentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDepartmentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.departments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.departments);
});
```

## GetDepartmentById
You can execute the `GetDepartmentById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getDepartmentById(vars: GetDepartmentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDepartmentByIdData, GetDepartmentByIdVariables>;

interface GetDepartmentByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDepartmentByIdVariables): QueryRef<GetDepartmentByIdData, GetDepartmentByIdVariables>;
}
export const getDepartmentByIdRef: GetDepartmentByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDepartmentById(dc: DataConnect, vars: GetDepartmentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDepartmentByIdData, GetDepartmentByIdVariables>;

interface GetDepartmentByIdRef {
  ...
  (dc: DataConnect, vars: GetDepartmentByIdVariables): QueryRef<GetDepartmentByIdData, GetDepartmentByIdVariables>;
}
export const getDepartmentByIdRef: GetDepartmentByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDepartmentByIdRef:
```typescript
const name = getDepartmentByIdRef.operationName;
console.log(name);
```

### Variables
The `GetDepartmentById` query requires an argument of type `GetDepartmentByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDepartmentByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetDepartmentById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDepartmentByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDepartmentByIdData {
  department?: {
    id: UUIDString;
    code: string;
    name: string;
    managerId?: UUIDString | null;
    manager?: {
      id: UUIDString;
      fullName: string;
    } & Employee_Key;
      description?: string | null;
      costCenter?: string | null;
      isActive: boolean;
      createdAt: TimestampString;
      updatedAt: TimestampString;
      employees_on_department: ({
        id: UUIDString;
      } & Employee_Key)[];
  } & Department_Key;
}
```
### Using `GetDepartmentById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDepartmentById, GetDepartmentByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetDepartmentById` query requires an argument of type `GetDepartmentByIdVariables`:
const getDepartmentByIdVars: GetDepartmentByIdVariables = {
  id: ..., 
};

// Call the `getDepartmentById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDepartmentById(getDepartmentByIdVars);
// Variables can be defined inline as well.
const { data } = await getDepartmentById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDepartmentById(dataConnect, getDepartmentByIdVars);

console.log(data.department);

// Or, you can use the `Promise` API.
getDepartmentById(getDepartmentByIdVars).then((response) => {
  const data = response.data;
  console.log(data.department);
});
```

### Using `GetDepartmentById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDepartmentByIdRef, GetDepartmentByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetDepartmentById` query requires an argument of type `GetDepartmentByIdVariables`:
const getDepartmentByIdVars: GetDepartmentByIdVariables = {
  id: ..., 
};

// Call the `getDepartmentByIdRef()` function to get a reference to the query.
const ref = getDepartmentByIdRef(getDepartmentByIdVars);
// Variables can be defined inline as well.
const ref = getDepartmentByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDepartmentByIdRef(dataConnect, getDepartmentByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.department);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.department);
});
```

## ListDevices
You can execute the `ListDevices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listDevices(options?: ExecuteQueryOptions): QueryPromise<ListDevicesData, undefined>;

interface ListDevicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDevicesData, undefined>;
}
export const listDevicesRef: ListDevicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDevices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDevicesData, undefined>;

interface ListDevicesRef {
  ...
  (dc: DataConnect): QueryRef<ListDevicesData, undefined>;
}
export const listDevicesRef: ListDevicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDevicesRef:
```typescript
const name = listDevicesRef.operationName;
console.log(name);
```

### Variables
The `ListDevices` query has no variables.
### Return Type
Recall that executing the `ListDevices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDevicesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDevicesData {
  devices: ({
    id: UUIDString;
    name: string;
    identifier: string;
    type: string;
    locationName?: string | null;
    description?: string | null;
    isActive: boolean;
    lastSyncAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Device_Key)[];
}
```
### Using `ListDevices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDevices } from '@rh-ponto/api-client/generated';


// Call the `listDevices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDevices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDevices(dataConnect);

console.log(data.devices);

// Or, you can use the `Promise` API.
listDevices().then((response) => {
  const data = response.data;
  console.log(data.devices);
});
```

### Using `ListDevices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDevicesRef } from '@rh-ponto/api-client/generated';


// Call the `listDevicesRef()` function to get a reference to the query.
const ref = listDevicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDevicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.devices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.devices);
});
```

## GetDeviceById
You can execute the `GetDeviceById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getDeviceById(vars: GetDeviceByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDeviceByIdData, GetDeviceByIdVariables>;

interface GetDeviceByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDeviceByIdVariables): QueryRef<GetDeviceByIdData, GetDeviceByIdVariables>;
}
export const getDeviceByIdRef: GetDeviceByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDeviceById(dc: DataConnect, vars: GetDeviceByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDeviceByIdData, GetDeviceByIdVariables>;

interface GetDeviceByIdRef {
  ...
  (dc: DataConnect, vars: GetDeviceByIdVariables): QueryRef<GetDeviceByIdData, GetDeviceByIdVariables>;
}
export const getDeviceByIdRef: GetDeviceByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDeviceByIdRef:
```typescript
const name = getDeviceByIdRef.operationName;
console.log(name);
```

### Variables
The `GetDeviceById` query requires an argument of type `GetDeviceByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDeviceByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetDeviceById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDeviceByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDeviceByIdData {
  device?: {
    id: UUIDString;
    name: string;
    identifier: string;
    type: string;
    locationName?: string | null;
    description?: string | null;
    isActive: boolean;
    lastSyncAt?: TimestampString | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Device_Key;
}
```
### Using `GetDeviceById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDeviceById, GetDeviceByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetDeviceById` query requires an argument of type `GetDeviceByIdVariables`:
const getDeviceByIdVars: GetDeviceByIdVariables = {
  id: ..., 
};

// Call the `getDeviceById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDeviceById(getDeviceByIdVars);
// Variables can be defined inline as well.
const { data } = await getDeviceById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDeviceById(dataConnect, getDeviceByIdVars);

console.log(data.device);

// Or, you can use the `Promise` API.
getDeviceById(getDeviceByIdVars).then((response) => {
  const data = response.data;
  console.log(data.device);
});
```

### Using `GetDeviceById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDeviceByIdRef, GetDeviceByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetDeviceById` query requires an argument of type `GetDeviceByIdVariables`:
const getDeviceByIdVars: GetDeviceByIdVariables = {
  id: ..., 
};

// Call the `getDeviceByIdRef()` function to get a reference to the query.
const ref = getDeviceByIdRef(getDeviceByIdVars);
// Variables can be defined inline as well.
const ref = getDeviceByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDeviceByIdRef(dataConnect, getDeviceByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.device);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.device);
});
```

## ListWorkSchedules
You can execute the `ListWorkSchedules` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listWorkSchedules(options?: ExecuteQueryOptions): QueryPromise<ListWorkSchedulesData, undefined>;

interface ListWorkSchedulesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListWorkSchedulesData, undefined>;
}
export const listWorkSchedulesRef: ListWorkSchedulesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listWorkSchedules(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListWorkSchedulesData, undefined>;

interface ListWorkSchedulesRef {
  ...
  (dc: DataConnect): QueryRef<ListWorkSchedulesData, undefined>;
}
export const listWorkSchedulesRef: ListWorkSchedulesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listWorkSchedulesRef:
```typescript
const name = listWorkSchedulesRef.operationName;
console.log(name);
```

### Variables
The `ListWorkSchedules` query has no variables.
### Return Type
Recall that executing the `ListWorkSchedules` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListWorkSchedulesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListWorkSchedulesData {
  workSchedules: ({
    id: UUIDString;
    name: string;
    startTime: string;
    breakStartTime?: string | null;
    breakEndTime?: string | null;
    endTime: string;
    toleranceMinutes: number;
    expectedDailyMinutes?: number | null;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & WorkSchedule_Key)[];
}
```
### Using `ListWorkSchedules`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listWorkSchedules } from '@rh-ponto/api-client/generated';


// Call the `listWorkSchedules()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listWorkSchedules();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listWorkSchedules(dataConnect);

console.log(data.workSchedules);

// Or, you can use the `Promise` API.
listWorkSchedules().then((response) => {
  const data = response.data;
  console.log(data.workSchedules);
});
```

### Using `ListWorkSchedules`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listWorkSchedulesRef } from '@rh-ponto/api-client/generated';


// Call the `listWorkSchedulesRef()` function to get a reference to the query.
const ref = listWorkSchedulesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listWorkSchedulesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workSchedules);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workSchedules);
});
```

## GetWorkScheduleById
You can execute the `GetWorkScheduleById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getWorkScheduleById(vars: GetWorkScheduleByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorkScheduleByIdData, GetWorkScheduleByIdVariables>;

interface GetWorkScheduleByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkScheduleByIdVariables): QueryRef<GetWorkScheduleByIdData, GetWorkScheduleByIdVariables>;
}
export const getWorkScheduleByIdRef: GetWorkScheduleByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorkScheduleById(dc: DataConnect, vars: GetWorkScheduleByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetWorkScheduleByIdData, GetWorkScheduleByIdVariables>;

interface GetWorkScheduleByIdRef {
  ...
  (dc: DataConnect, vars: GetWorkScheduleByIdVariables): QueryRef<GetWorkScheduleByIdData, GetWorkScheduleByIdVariables>;
}
export const getWorkScheduleByIdRef: GetWorkScheduleByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWorkScheduleByIdRef:
```typescript
const name = getWorkScheduleByIdRef.operationName;
console.log(name);
```

### Variables
The `GetWorkScheduleById` query requires an argument of type `GetWorkScheduleByIdVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWorkScheduleByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetWorkScheduleById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWorkScheduleByIdData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetWorkScheduleByIdData {
  workSchedule?: {
    id: UUIDString;
    name: string;
    startTime: string;
    breakStartTime?: string | null;
    breakEndTime?: string | null;
    endTime: string;
    toleranceMinutes: number;
    expectedDailyMinutes?: number | null;
    isActive: boolean;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & WorkSchedule_Key;
}
```
### Using `GetWorkScheduleById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWorkScheduleById, GetWorkScheduleByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetWorkScheduleById` query requires an argument of type `GetWorkScheduleByIdVariables`:
const getWorkScheduleByIdVars: GetWorkScheduleByIdVariables = {
  id: ..., 
};

// Call the `getWorkScheduleById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWorkScheduleById(getWorkScheduleByIdVars);
// Variables can be defined inline as well.
const { data } = await getWorkScheduleById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWorkScheduleById(dataConnect, getWorkScheduleByIdVars);

console.log(data.workSchedule);

// Or, you can use the `Promise` API.
getWorkScheduleById(getWorkScheduleByIdVars).then((response) => {
  const data = response.data;
  console.log(data.workSchedule);
});
```

### Using `GetWorkScheduleById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWorkScheduleByIdRef, GetWorkScheduleByIdVariables } from '@rh-ponto/api-client/generated';

// The `GetWorkScheduleById` query requires an argument of type `GetWorkScheduleByIdVariables`:
const getWorkScheduleByIdVars: GetWorkScheduleByIdVariables = {
  id: ..., 
};

// Call the `getWorkScheduleByIdRef()` function to get a reference to the query.
const ref = getWorkScheduleByIdRef(getWorkScheduleByIdVars);
// Variables can be defined inline as well.
const ref = getWorkScheduleByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWorkScheduleByIdRef(dataConnect, getWorkScheduleByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workSchedule);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workSchedule);
});
```

## ListEmployeeScheduleHistory
You can execute the `ListEmployeeScheduleHistory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
listEmployeeScheduleHistory(options?: ExecuteQueryOptions): QueryPromise<ListEmployeeScheduleHistoryData, undefined>;

interface ListEmployeeScheduleHistoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEmployeeScheduleHistoryData, undefined>;
}
export const listEmployeeScheduleHistoryRef: ListEmployeeScheduleHistoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEmployeeScheduleHistory(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEmployeeScheduleHistoryData, undefined>;

interface ListEmployeeScheduleHistoryRef {
  ...
  (dc: DataConnect): QueryRef<ListEmployeeScheduleHistoryData, undefined>;
}
export const listEmployeeScheduleHistoryRef: ListEmployeeScheduleHistoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEmployeeScheduleHistoryRef:
```typescript
const name = listEmployeeScheduleHistoryRef.operationName;
console.log(name);
```

### Variables
The `ListEmployeeScheduleHistory` query has no variables.
### Return Type
Recall that executing the `ListEmployeeScheduleHistory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEmployeeScheduleHistoryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEmployeeScheduleHistoryData {
  employeeScheduleHistories: ({
    id: UUIDString;
    employee: {
      id: UUIDString;
    } & Employee_Key;
      workSchedule: {
        id: UUIDString;
      } & WorkSchedule_Key;
        startDate: DateString;
        endDate?: DateString | null;
        isCurrent: boolean;
        createdAt: TimestampString;
        updatedAt: TimestampString;
  } & EmployeeScheduleHistory_Key)[];
}
```
### Using `ListEmployeeScheduleHistory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEmployeeScheduleHistory } from '@rh-ponto/api-client/generated';


// Call the `listEmployeeScheduleHistory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEmployeeScheduleHistory();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEmployeeScheduleHistory(dataConnect);

console.log(data.employeeScheduleHistories);

// Or, you can use the `Promise` API.
listEmployeeScheduleHistory().then((response) => {
  const data = response.data;
  console.log(data.employeeScheduleHistories);
});
```

### Using `ListEmployeeScheduleHistory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEmployeeScheduleHistoryRef } from '@rh-ponto/api-client/generated';


// Call the `listEmployeeScheduleHistoryRef()` function to get a reference to the query.
const ref = listEmployeeScheduleHistoryRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEmployeeScheduleHistoryRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.employeeScheduleHistories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeScheduleHistories);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateTimeRecord
You can execute the `CreateTimeRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createTimeRecord(vars: CreateTimeRecordVariables): MutationPromise<CreateTimeRecordData, CreateTimeRecordVariables>;

interface CreateTimeRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTimeRecordVariables): MutationRef<CreateTimeRecordData, CreateTimeRecordVariables>;
}
export const createTimeRecordRef: CreateTimeRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTimeRecord(dc: DataConnect, vars: CreateTimeRecordVariables): MutationPromise<CreateTimeRecordData, CreateTimeRecordVariables>;

interface CreateTimeRecordRef {
  ...
  (dc: DataConnect, vars: CreateTimeRecordVariables): MutationRef<CreateTimeRecordData, CreateTimeRecordVariables>;
}
export const createTimeRecordRef: CreateTimeRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTimeRecordRef:
```typescript
const name = createTimeRecordRef.operationName;
console.log(name);
```

### Variables
The `CreateTimeRecord` mutation requires an argument of type `CreateTimeRecordVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTimeRecordVariables {
  employeeId: UUIDString;
  deviceId?: UUIDString | null;
  recordedByUserId?: UUIDString | null;
  recordType: string;
  source: string;
  status: string;
  recordedAt: TimestampString;
  originalRecordedAt?: TimestampString | null;
  notes?: string | null;
  isManual: boolean;
  referenceRecordId?: UUIDString | null;
  latitude?: number | null;
  longitude?: number | null;
  resolvedAddress?: string | null;
  ipAddress?: string | null;
}
```
### Return Type
Recall that executing the `CreateTimeRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTimeRecordData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTimeRecordData {
  timeRecord_insert: TimeRecord_Key;
}
```
### Using `CreateTimeRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTimeRecord, CreateTimeRecordVariables } from '@rh-ponto/api-client/generated';

// The `CreateTimeRecord` mutation requires an argument of type `CreateTimeRecordVariables`:
const createTimeRecordVars: CreateTimeRecordVariables = {
  employeeId: ..., 
  deviceId: ..., // optional
  recordedByUserId: ..., // optional
  recordType: ..., 
  source: ..., 
  status: ..., 
  recordedAt: ..., 
  originalRecordedAt: ..., // optional
  notes: ..., // optional
  isManual: ..., 
  referenceRecordId: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  resolvedAddress: ..., // optional
  ipAddress: ..., // optional
};

// Call the `createTimeRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTimeRecord(createTimeRecordVars);
// Variables can be defined inline as well.
const { data } = await createTimeRecord({ employeeId: ..., deviceId: ..., recordedByUserId: ..., recordType: ..., source: ..., status: ..., recordedAt: ..., originalRecordedAt: ..., notes: ..., isManual: ..., referenceRecordId: ..., latitude: ..., longitude: ..., resolvedAddress: ..., ipAddress: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTimeRecord(dataConnect, createTimeRecordVars);

console.log(data.timeRecord_insert);

// Or, you can use the `Promise` API.
createTimeRecord(createTimeRecordVars).then((response) => {
  const data = response.data;
  console.log(data.timeRecord_insert);
});
```

### Using `CreateTimeRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTimeRecordRef, CreateTimeRecordVariables } from '@rh-ponto/api-client/generated';

// The `CreateTimeRecord` mutation requires an argument of type `CreateTimeRecordVariables`:
const createTimeRecordVars: CreateTimeRecordVariables = {
  employeeId: ..., 
  deviceId: ..., // optional
  recordedByUserId: ..., // optional
  recordType: ..., 
  source: ..., 
  status: ..., 
  recordedAt: ..., 
  originalRecordedAt: ..., // optional
  notes: ..., // optional
  isManual: ..., 
  referenceRecordId: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  resolvedAddress: ..., // optional
  ipAddress: ..., // optional
};

// Call the `createTimeRecordRef()` function to get a reference to the mutation.
const ref = createTimeRecordRef(createTimeRecordVars);
// Variables can be defined inline as well.
const ref = createTimeRecordRef({ employeeId: ..., deviceId: ..., recordedByUserId: ..., recordType: ..., source: ..., status: ..., recordedAt: ..., originalRecordedAt: ..., notes: ..., isManual: ..., referenceRecordId: ..., latitude: ..., longitude: ..., resolvedAddress: ..., ipAddress: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTimeRecordRef(dataConnect, createTimeRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.timeRecord_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.timeRecord_insert);
});
```

## AdjustTimeRecord
You can execute the `AdjustTimeRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adjustTimeRecord(vars: AdjustTimeRecordVariables): MutationPromise<AdjustTimeRecordData, AdjustTimeRecordVariables>;

interface AdjustTimeRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AdjustTimeRecordVariables): MutationRef<AdjustTimeRecordData, AdjustTimeRecordVariables>;
}
export const adjustTimeRecordRef: AdjustTimeRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
adjustTimeRecord(dc: DataConnect, vars: AdjustTimeRecordVariables): MutationPromise<AdjustTimeRecordData, AdjustTimeRecordVariables>;

interface AdjustTimeRecordRef {
  ...
  (dc: DataConnect, vars: AdjustTimeRecordVariables): MutationRef<AdjustTimeRecordData, AdjustTimeRecordVariables>;
}
export const adjustTimeRecordRef: AdjustTimeRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adjustTimeRecordRef:
```typescript
const name = adjustTimeRecordRef.operationName;
console.log(name);
```

### Variables
The `AdjustTimeRecord` mutation requires an argument of type `AdjustTimeRecordVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AdjustTimeRecordVariables {
  id: UUIDString;
  recordedAt: TimestampString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `AdjustTimeRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdjustTimeRecordData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdjustTimeRecordData {
  timeRecord_update?: TimeRecord_Key | null;
}
```
### Using `AdjustTimeRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adjustTimeRecord, AdjustTimeRecordVariables } from '@rh-ponto/api-client/generated';

// The `AdjustTimeRecord` mutation requires an argument of type `AdjustTimeRecordVariables`:
const adjustTimeRecordVars: AdjustTimeRecordVariables = {
  id: ..., 
  recordedAt: ..., 
  notes: ..., // optional
};

// Call the `adjustTimeRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adjustTimeRecord(adjustTimeRecordVars);
// Variables can be defined inline as well.
const { data } = await adjustTimeRecord({ id: ..., recordedAt: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adjustTimeRecord(dataConnect, adjustTimeRecordVars);

console.log(data.timeRecord_update);

// Or, you can use the `Promise` API.
adjustTimeRecord(adjustTimeRecordVars).then((response) => {
  const data = response.data;
  console.log(data.timeRecord_update);
});
```

### Using `AdjustTimeRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, adjustTimeRecordRef, AdjustTimeRecordVariables } from '@rh-ponto/api-client/generated';

// The `AdjustTimeRecord` mutation requires an argument of type `AdjustTimeRecordVariables`:
const adjustTimeRecordVars: AdjustTimeRecordVariables = {
  id: ..., 
  recordedAt: ..., 
  notes: ..., // optional
};

// Call the `adjustTimeRecordRef()` function to get a reference to the mutation.
const ref = adjustTimeRecordRef(adjustTimeRecordVars);
// Variables can be defined inline as well.
const ref = adjustTimeRecordRef({ id: ..., recordedAt: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adjustTimeRecordRef(dataConnect, adjustTimeRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.timeRecord_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.timeRecord_update);
});
```

## CreateTimeRecordPhoto
You can execute the `CreateTimeRecordPhoto` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createTimeRecordPhoto(vars: CreateTimeRecordPhotoVariables): MutationPromise<CreateTimeRecordPhotoData, CreateTimeRecordPhotoVariables>;

interface CreateTimeRecordPhotoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTimeRecordPhotoVariables): MutationRef<CreateTimeRecordPhotoData, CreateTimeRecordPhotoVariables>;
}
export const createTimeRecordPhotoRef: CreateTimeRecordPhotoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTimeRecordPhoto(dc: DataConnect, vars: CreateTimeRecordPhotoVariables): MutationPromise<CreateTimeRecordPhotoData, CreateTimeRecordPhotoVariables>;

interface CreateTimeRecordPhotoRef {
  ...
  (dc: DataConnect, vars: CreateTimeRecordPhotoVariables): MutationRef<CreateTimeRecordPhotoData, CreateTimeRecordPhotoVariables>;
}
export const createTimeRecordPhotoRef: CreateTimeRecordPhotoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTimeRecordPhotoRef:
```typescript
const name = createTimeRecordPhotoRef.operationName;
console.log(name);
```

### Variables
The `CreateTimeRecordPhoto` mutation requires an argument of type `CreateTimeRecordPhotoVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTimeRecordPhotoVariables {
  timeRecordId: UUIDString;
  fileUrl: string;
  fileName?: string | null;
  contentType?: string | null;
  fileSizeBytes?: Int64String | null;
  isPrimary: boolean;
}
```
### Return Type
Recall that executing the `CreateTimeRecordPhoto` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTimeRecordPhotoData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTimeRecordPhotoData {
  timeRecordPhoto_insert: TimeRecordPhoto_Key;
}
```
### Using `CreateTimeRecordPhoto`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTimeRecordPhoto, CreateTimeRecordPhotoVariables } from '@rh-ponto/api-client/generated';

// The `CreateTimeRecordPhoto` mutation requires an argument of type `CreateTimeRecordPhotoVariables`:
const createTimeRecordPhotoVars: CreateTimeRecordPhotoVariables = {
  timeRecordId: ..., 
  fileUrl: ..., 
  fileName: ..., // optional
  contentType: ..., // optional
  fileSizeBytes: ..., // optional
  isPrimary: ..., 
};

// Call the `createTimeRecordPhoto()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTimeRecordPhoto(createTimeRecordPhotoVars);
// Variables can be defined inline as well.
const { data } = await createTimeRecordPhoto({ timeRecordId: ..., fileUrl: ..., fileName: ..., contentType: ..., fileSizeBytes: ..., isPrimary: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTimeRecordPhoto(dataConnect, createTimeRecordPhotoVars);

console.log(data.timeRecordPhoto_insert);

// Or, you can use the `Promise` API.
createTimeRecordPhoto(createTimeRecordPhotoVars).then((response) => {
  const data = response.data;
  console.log(data.timeRecordPhoto_insert);
});
```

### Using `CreateTimeRecordPhoto`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTimeRecordPhotoRef, CreateTimeRecordPhotoVariables } from '@rh-ponto/api-client/generated';

// The `CreateTimeRecordPhoto` mutation requires an argument of type `CreateTimeRecordPhotoVariables`:
const createTimeRecordPhotoVars: CreateTimeRecordPhotoVariables = {
  timeRecordId: ..., 
  fileUrl: ..., 
  fileName: ..., // optional
  contentType: ..., // optional
  fileSizeBytes: ..., // optional
  isPrimary: ..., 
};

// Call the `createTimeRecordPhotoRef()` function to get a reference to the mutation.
const ref = createTimeRecordPhotoRef(createTimeRecordPhotoVars);
// Variables can be defined inline as well.
const ref = createTimeRecordPhotoRef({ timeRecordId: ..., fileUrl: ..., fileName: ..., contentType: ..., fileSizeBytes: ..., isPrimary: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTimeRecordPhotoRef(dataConnect, createTimeRecordPhotoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.timeRecordPhoto_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.timeRecordPhoto_insert);
});
```

## CreateAttendancePolicy
You can execute the `CreateAttendancePolicy` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createAttendancePolicy(vars: CreateAttendancePolicyVariables): MutationPromise<CreateAttendancePolicyData, CreateAttendancePolicyVariables>;

interface CreateAttendancePolicyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAttendancePolicyVariables): MutationRef<CreateAttendancePolicyData, CreateAttendancePolicyVariables>;
}
export const createAttendancePolicyRef: CreateAttendancePolicyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAttendancePolicy(dc: DataConnect, vars: CreateAttendancePolicyVariables): MutationPromise<CreateAttendancePolicyData, CreateAttendancePolicyVariables>;

interface CreateAttendancePolicyRef {
  ...
  (dc: DataConnect, vars: CreateAttendancePolicyVariables): MutationRef<CreateAttendancePolicyData, CreateAttendancePolicyVariables>;
}
export const createAttendancePolicyRef: CreateAttendancePolicyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAttendancePolicyRef:
```typescript
const name = createAttendancePolicyRef.operationName;
console.log(name);
```

### Variables
The `CreateAttendancePolicy` mutation requires an argument of type `CreateAttendancePolicyVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAttendancePolicyVariables {
  code: string;
  name: string;
  mode: string;
  validationStrategy: string;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowOffsiteClocking: boolean;
  requiresAllowedLocations: boolean;
  description?: string | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreateAttendancePolicy` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAttendancePolicyData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAttendancePolicyData {
  attendancePolicy_insert: AttendancePolicy_Key;
}
```
### Using `CreateAttendancePolicy`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAttendancePolicy, CreateAttendancePolicyVariables } from '@rh-ponto/api-client/generated';

// The `CreateAttendancePolicy` mutation requires an argument of type `CreateAttendancePolicyVariables`:
const createAttendancePolicyVars: CreateAttendancePolicyVariables = {
  code: ..., 
  name: ..., 
  mode: ..., 
  validationStrategy: ..., 
  geolocationRequired: ..., 
  photoRequired: ..., 
  allowOffsiteClocking: ..., 
  requiresAllowedLocations: ..., 
  description: ..., // optional
  isActive: ..., 
};

// Call the `createAttendancePolicy()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAttendancePolicy(createAttendancePolicyVars);
// Variables can be defined inline as well.
const { data } = await createAttendancePolicy({ code: ..., name: ..., mode: ..., validationStrategy: ..., geolocationRequired: ..., photoRequired: ..., allowOffsiteClocking: ..., requiresAllowedLocations: ..., description: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAttendancePolicy(dataConnect, createAttendancePolicyVars);

console.log(data.attendancePolicy_insert);

// Or, you can use the `Promise` API.
createAttendancePolicy(createAttendancePolicyVars).then((response) => {
  const data = response.data;
  console.log(data.attendancePolicy_insert);
});
```

### Using `CreateAttendancePolicy`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAttendancePolicyRef, CreateAttendancePolicyVariables } from '@rh-ponto/api-client/generated';

// The `CreateAttendancePolicy` mutation requires an argument of type `CreateAttendancePolicyVariables`:
const createAttendancePolicyVars: CreateAttendancePolicyVariables = {
  code: ..., 
  name: ..., 
  mode: ..., 
  validationStrategy: ..., 
  geolocationRequired: ..., 
  photoRequired: ..., 
  allowOffsiteClocking: ..., 
  requiresAllowedLocations: ..., 
  description: ..., // optional
  isActive: ..., 
};

// Call the `createAttendancePolicyRef()` function to get a reference to the mutation.
const ref = createAttendancePolicyRef(createAttendancePolicyVars);
// Variables can be defined inline as well.
const ref = createAttendancePolicyRef({ code: ..., name: ..., mode: ..., validationStrategy: ..., geolocationRequired: ..., photoRequired: ..., allowOffsiteClocking: ..., requiresAllowedLocations: ..., description: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAttendancePolicyRef(dataConnect, createAttendancePolicyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendancePolicy_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendancePolicy_insert);
});
```

## UpdateAttendancePolicy
You can execute the `UpdateAttendancePolicy` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateAttendancePolicy(vars: UpdateAttendancePolicyVariables): MutationPromise<UpdateAttendancePolicyData, UpdateAttendancePolicyVariables>;

interface UpdateAttendancePolicyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAttendancePolicyVariables): MutationRef<UpdateAttendancePolicyData, UpdateAttendancePolicyVariables>;
}
export const updateAttendancePolicyRef: UpdateAttendancePolicyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAttendancePolicy(dc: DataConnect, vars: UpdateAttendancePolicyVariables): MutationPromise<UpdateAttendancePolicyData, UpdateAttendancePolicyVariables>;

interface UpdateAttendancePolicyRef {
  ...
  (dc: DataConnect, vars: UpdateAttendancePolicyVariables): MutationRef<UpdateAttendancePolicyData, UpdateAttendancePolicyVariables>;
}
export const updateAttendancePolicyRef: UpdateAttendancePolicyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAttendancePolicyRef:
```typescript
const name = updateAttendancePolicyRef.operationName;
console.log(name);
```

### Variables
The `UpdateAttendancePolicy` mutation requires an argument of type `UpdateAttendancePolicyVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAttendancePolicyVariables {
  id: UUIDString;
  name?: string | null;
  mode?: string | null;
  validationStrategy?: string | null;
  geolocationRequired?: boolean | null;
  photoRequired?: boolean | null;
  allowOffsiteClocking?: boolean | null;
  requiresAllowedLocations?: boolean | null;
  description?: string | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateAttendancePolicy` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAttendancePolicyData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAttendancePolicyData {
  attendancePolicy_update?: AttendancePolicy_Key | null;
}
```
### Using `UpdateAttendancePolicy`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAttendancePolicy, UpdateAttendancePolicyVariables } from '@rh-ponto/api-client/generated';

// The `UpdateAttendancePolicy` mutation requires an argument of type `UpdateAttendancePolicyVariables`:
const updateAttendancePolicyVars: UpdateAttendancePolicyVariables = {
  id: ..., 
  name: ..., // optional
  mode: ..., // optional
  validationStrategy: ..., // optional
  geolocationRequired: ..., // optional
  photoRequired: ..., // optional
  allowOffsiteClocking: ..., // optional
  requiresAllowedLocations: ..., // optional
  description: ..., // optional
  isActive: ..., // optional
};

// Call the `updateAttendancePolicy()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAttendancePolicy(updateAttendancePolicyVars);
// Variables can be defined inline as well.
const { data } = await updateAttendancePolicy({ id: ..., name: ..., mode: ..., validationStrategy: ..., geolocationRequired: ..., photoRequired: ..., allowOffsiteClocking: ..., requiresAllowedLocations: ..., description: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAttendancePolicy(dataConnect, updateAttendancePolicyVars);

console.log(data.attendancePolicy_update);

// Or, you can use the `Promise` API.
updateAttendancePolicy(updateAttendancePolicyVars).then((response) => {
  const data = response.data;
  console.log(data.attendancePolicy_update);
});
```

### Using `UpdateAttendancePolicy`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAttendancePolicyRef, UpdateAttendancePolicyVariables } from '@rh-ponto/api-client/generated';

// The `UpdateAttendancePolicy` mutation requires an argument of type `UpdateAttendancePolicyVariables`:
const updateAttendancePolicyVars: UpdateAttendancePolicyVariables = {
  id: ..., 
  name: ..., // optional
  mode: ..., // optional
  validationStrategy: ..., // optional
  geolocationRequired: ..., // optional
  photoRequired: ..., // optional
  allowOffsiteClocking: ..., // optional
  requiresAllowedLocations: ..., // optional
  description: ..., // optional
  isActive: ..., // optional
};

// Call the `updateAttendancePolicyRef()` function to get a reference to the mutation.
const ref = updateAttendancePolicyRef(updateAttendancePolicyVars);
// Variables can be defined inline as well.
const ref = updateAttendancePolicyRef({ id: ..., name: ..., mode: ..., validationStrategy: ..., geolocationRequired: ..., photoRequired: ..., allowOffsiteClocking: ..., requiresAllowedLocations: ..., description: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAttendancePolicyRef(dataConnect, updateAttendancePolicyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendancePolicy_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendancePolicy_update);
});
```

## CreateWorkLocation
You can execute the `CreateWorkLocation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createWorkLocation(vars: CreateWorkLocationVariables): MutationPromise<CreateWorkLocationData, CreateWorkLocationVariables>;

interface CreateWorkLocationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkLocationVariables): MutationRef<CreateWorkLocationData, CreateWorkLocationVariables>;
}
export const createWorkLocationRef: CreateWorkLocationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWorkLocation(dc: DataConnect, vars: CreateWorkLocationVariables): MutationPromise<CreateWorkLocationData, CreateWorkLocationVariables>;

interface CreateWorkLocationRef {
  ...
  (dc: DataConnect, vars: CreateWorkLocationVariables): MutationRef<CreateWorkLocationData, CreateWorkLocationVariables>;
}
export const createWorkLocationRef: CreateWorkLocationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWorkLocationRef:
```typescript
const name = createWorkLocationRef.operationName;
console.log(name);
```

### Variables
The `CreateWorkLocation` mutation requires an argument of type `CreateWorkLocationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateWorkLocationVariables {
  code: string;
  name: string;
  type: string;
  addressLine?: string | null;
  addressComplement?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  radiusMeters: number;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreateWorkLocation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWorkLocationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWorkLocationData {
  workLocation_insert: WorkLocation_Key;
}
```
### Using `CreateWorkLocation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWorkLocation, CreateWorkLocationVariables } from '@rh-ponto/api-client/generated';

// The `CreateWorkLocation` mutation requires an argument of type `CreateWorkLocationVariables`:
const createWorkLocationVars: CreateWorkLocationVariables = {
  code: ..., 
  name: ..., 
  type: ..., 
  addressLine: ..., // optional
  addressComplement: ..., // optional
  city: ..., // optional
  state: ..., // optional
  postalCode: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  radiusMeters: ..., 
  isActive: ..., 
};

// Call the `createWorkLocation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWorkLocation(createWorkLocationVars);
// Variables can be defined inline as well.
const { data } = await createWorkLocation({ code: ..., name: ..., type: ..., addressLine: ..., addressComplement: ..., city: ..., state: ..., postalCode: ..., latitude: ..., longitude: ..., radiusMeters: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWorkLocation(dataConnect, createWorkLocationVars);

console.log(data.workLocation_insert);

// Or, you can use the `Promise` API.
createWorkLocation(createWorkLocationVars).then((response) => {
  const data = response.data;
  console.log(data.workLocation_insert);
});
```

### Using `CreateWorkLocation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWorkLocationRef, CreateWorkLocationVariables } from '@rh-ponto/api-client/generated';

// The `CreateWorkLocation` mutation requires an argument of type `CreateWorkLocationVariables`:
const createWorkLocationVars: CreateWorkLocationVariables = {
  code: ..., 
  name: ..., 
  type: ..., 
  addressLine: ..., // optional
  addressComplement: ..., // optional
  city: ..., // optional
  state: ..., // optional
  postalCode: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  radiusMeters: ..., 
  isActive: ..., 
};

// Call the `createWorkLocationRef()` function to get a reference to the mutation.
const ref = createWorkLocationRef(createWorkLocationVars);
// Variables can be defined inline as well.
const ref = createWorkLocationRef({ code: ..., name: ..., type: ..., addressLine: ..., addressComplement: ..., city: ..., state: ..., postalCode: ..., latitude: ..., longitude: ..., radiusMeters: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWorkLocationRef(dataConnect, createWorkLocationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workLocation_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workLocation_insert);
});
```

## CreateEmployeeAttendancePolicy
You can execute the `CreateEmployeeAttendancePolicy` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createEmployeeAttendancePolicy(vars: CreateEmployeeAttendancePolicyVariables): MutationPromise<CreateEmployeeAttendancePolicyData, CreateEmployeeAttendancePolicyVariables>;

interface CreateEmployeeAttendancePolicyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeAttendancePolicyVariables): MutationRef<CreateEmployeeAttendancePolicyData, CreateEmployeeAttendancePolicyVariables>;
}
export const createEmployeeAttendancePolicyRef: CreateEmployeeAttendancePolicyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEmployeeAttendancePolicy(dc: DataConnect, vars: CreateEmployeeAttendancePolicyVariables): MutationPromise<CreateEmployeeAttendancePolicyData, CreateEmployeeAttendancePolicyVariables>;

interface CreateEmployeeAttendancePolicyRef {
  ...
  (dc: DataConnect, vars: CreateEmployeeAttendancePolicyVariables): MutationRef<CreateEmployeeAttendancePolicyData, CreateEmployeeAttendancePolicyVariables>;
}
export const createEmployeeAttendancePolicyRef: CreateEmployeeAttendancePolicyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEmployeeAttendancePolicyRef:
```typescript
const name = createEmployeeAttendancePolicyRef.operationName;
console.log(name);
```

### Variables
The `CreateEmployeeAttendancePolicy` mutation requires an argument of type `CreateEmployeeAttendancePolicyVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEmployeeAttendancePolicyVariables {
  employeeId: UUIDString;
  attendancePolicyId: UUIDString;
  mode: string;
  validationStrategy: string;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowAnyLocation: boolean;
  blockOutsideAllowedLocations: boolean;
  notes?: string | null;
  startsAt?: DateString | null;
  endsAt?: DateString | null;
}
```
### Return Type
Recall that executing the `CreateEmployeeAttendancePolicy` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEmployeeAttendancePolicyData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEmployeeAttendancePolicyData {
  employeeAttendancePolicy_insert: EmployeeAttendancePolicy_Key;
}
```
### Using `CreateEmployeeAttendancePolicy`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEmployeeAttendancePolicy, CreateEmployeeAttendancePolicyVariables } from '@rh-ponto/api-client/generated';

// The `CreateEmployeeAttendancePolicy` mutation requires an argument of type `CreateEmployeeAttendancePolicyVariables`:
const createEmployeeAttendancePolicyVars: CreateEmployeeAttendancePolicyVariables = {
  employeeId: ..., 
  attendancePolicyId: ..., 
  mode: ..., 
  validationStrategy: ..., 
  geolocationRequired: ..., 
  photoRequired: ..., 
  allowAnyLocation: ..., 
  blockOutsideAllowedLocations: ..., 
  notes: ..., // optional
  startsAt: ..., // optional
  endsAt: ..., // optional
};

// Call the `createEmployeeAttendancePolicy()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEmployeeAttendancePolicy(createEmployeeAttendancePolicyVars);
// Variables can be defined inline as well.
const { data } = await createEmployeeAttendancePolicy({ employeeId: ..., attendancePolicyId: ..., mode: ..., validationStrategy: ..., geolocationRequired: ..., photoRequired: ..., allowAnyLocation: ..., blockOutsideAllowedLocations: ..., notes: ..., startsAt: ..., endsAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEmployeeAttendancePolicy(dataConnect, createEmployeeAttendancePolicyVars);

console.log(data.employeeAttendancePolicy_insert);

// Or, you can use the `Promise` API.
createEmployeeAttendancePolicy(createEmployeeAttendancePolicyVars).then((response) => {
  const data = response.data;
  console.log(data.employeeAttendancePolicy_insert);
});
```

### Using `CreateEmployeeAttendancePolicy`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEmployeeAttendancePolicyRef, CreateEmployeeAttendancePolicyVariables } from '@rh-ponto/api-client/generated';

// The `CreateEmployeeAttendancePolicy` mutation requires an argument of type `CreateEmployeeAttendancePolicyVariables`:
const createEmployeeAttendancePolicyVars: CreateEmployeeAttendancePolicyVariables = {
  employeeId: ..., 
  attendancePolicyId: ..., 
  mode: ..., 
  validationStrategy: ..., 
  geolocationRequired: ..., 
  photoRequired: ..., 
  allowAnyLocation: ..., 
  blockOutsideAllowedLocations: ..., 
  notes: ..., // optional
  startsAt: ..., // optional
  endsAt: ..., // optional
};

// Call the `createEmployeeAttendancePolicyRef()` function to get a reference to the mutation.
const ref = createEmployeeAttendancePolicyRef(createEmployeeAttendancePolicyVars);
// Variables can be defined inline as well.
const ref = createEmployeeAttendancePolicyRef({ employeeId: ..., attendancePolicyId: ..., mode: ..., validationStrategy: ..., geolocationRequired: ..., photoRequired: ..., allowAnyLocation: ..., blockOutsideAllowedLocations: ..., notes: ..., startsAt: ..., endsAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEmployeeAttendancePolicyRef(dataConnect, createEmployeeAttendancePolicyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employeeAttendancePolicy_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeAttendancePolicy_insert);
});
```

## UpdateEmployeeAttendancePolicy
You can execute the `UpdateEmployeeAttendancePolicy` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateEmployeeAttendancePolicy(vars: UpdateEmployeeAttendancePolicyVariables): MutationPromise<UpdateEmployeeAttendancePolicyData, UpdateEmployeeAttendancePolicyVariables>;

interface UpdateEmployeeAttendancePolicyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeAttendancePolicyVariables): MutationRef<UpdateEmployeeAttendancePolicyData, UpdateEmployeeAttendancePolicyVariables>;
}
export const updateEmployeeAttendancePolicyRef: UpdateEmployeeAttendancePolicyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEmployeeAttendancePolicy(dc: DataConnect, vars: UpdateEmployeeAttendancePolicyVariables): MutationPromise<UpdateEmployeeAttendancePolicyData, UpdateEmployeeAttendancePolicyVariables>;

interface UpdateEmployeeAttendancePolicyRef {
  ...
  (dc: DataConnect, vars: UpdateEmployeeAttendancePolicyVariables): MutationRef<UpdateEmployeeAttendancePolicyData, UpdateEmployeeAttendancePolicyVariables>;
}
export const updateEmployeeAttendancePolicyRef: UpdateEmployeeAttendancePolicyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEmployeeAttendancePolicyRef:
```typescript
const name = updateEmployeeAttendancePolicyRef.operationName;
console.log(name);
```

### Variables
The `UpdateEmployeeAttendancePolicy` mutation requires an argument of type `UpdateEmployeeAttendancePolicyVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEmployeeAttendancePolicyVariables {
  id: UUIDString;
  attendancePolicyId: UUIDString;
  mode: string;
  validationStrategy: string;
  geolocationRequired: boolean;
  photoRequired: boolean;
  allowAnyLocation: boolean;
  blockOutsideAllowedLocations: boolean;
  notes?: string | null;
  startsAt?: DateString | null;
  endsAt?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdateEmployeeAttendancePolicy` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEmployeeAttendancePolicyData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEmployeeAttendancePolicyData {
  employeeAttendancePolicy_update?: EmployeeAttendancePolicy_Key | null;
}
```
### Using `UpdateEmployeeAttendancePolicy`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEmployeeAttendancePolicy, UpdateEmployeeAttendancePolicyVariables } from '@rh-ponto/api-client/generated';

// The `UpdateEmployeeAttendancePolicy` mutation requires an argument of type `UpdateEmployeeAttendancePolicyVariables`:
const updateEmployeeAttendancePolicyVars: UpdateEmployeeAttendancePolicyVariables = {
  id: ..., 
  attendancePolicyId: ..., 
  mode: ..., 
  validationStrategy: ..., 
  geolocationRequired: ..., 
  photoRequired: ..., 
  allowAnyLocation: ..., 
  blockOutsideAllowedLocations: ..., 
  notes: ..., // optional
  startsAt: ..., // optional
  endsAt: ..., // optional
};

// Call the `updateEmployeeAttendancePolicy()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEmployeeAttendancePolicy(updateEmployeeAttendancePolicyVars);
// Variables can be defined inline as well.
const { data } = await updateEmployeeAttendancePolicy({ id: ..., attendancePolicyId: ..., mode: ..., validationStrategy: ..., geolocationRequired: ..., photoRequired: ..., allowAnyLocation: ..., blockOutsideAllowedLocations: ..., notes: ..., startsAt: ..., endsAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEmployeeAttendancePolicy(dataConnect, updateEmployeeAttendancePolicyVars);

console.log(data.employeeAttendancePolicy_update);

// Or, you can use the `Promise` API.
updateEmployeeAttendancePolicy(updateEmployeeAttendancePolicyVars).then((response) => {
  const data = response.data;
  console.log(data.employeeAttendancePolicy_update);
});
```

### Using `UpdateEmployeeAttendancePolicy`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEmployeeAttendancePolicyRef, UpdateEmployeeAttendancePolicyVariables } from '@rh-ponto/api-client/generated';

// The `UpdateEmployeeAttendancePolicy` mutation requires an argument of type `UpdateEmployeeAttendancePolicyVariables`:
const updateEmployeeAttendancePolicyVars: UpdateEmployeeAttendancePolicyVariables = {
  id: ..., 
  attendancePolicyId: ..., 
  mode: ..., 
  validationStrategy: ..., 
  geolocationRequired: ..., 
  photoRequired: ..., 
  allowAnyLocation: ..., 
  blockOutsideAllowedLocations: ..., 
  notes: ..., // optional
  startsAt: ..., // optional
  endsAt: ..., // optional
};

// Call the `updateEmployeeAttendancePolicyRef()` function to get a reference to the mutation.
const ref = updateEmployeeAttendancePolicyRef(updateEmployeeAttendancePolicyVars);
// Variables can be defined inline as well.
const ref = updateEmployeeAttendancePolicyRef({ id: ..., attendancePolicyId: ..., mode: ..., validationStrategy: ..., geolocationRequired: ..., photoRequired: ..., allowAnyLocation: ..., blockOutsideAllowedLocations: ..., notes: ..., startsAt: ..., endsAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEmployeeAttendancePolicyRef(dataConnect, updateEmployeeAttendancePolicyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employeeAttendancePolicy_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeAttendancePolicy_update);
});
```

## AddEmployeeAllowedLocation
You can execute the `AddEmployeeAllowedLocation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
addEmployeeAllowedLocation(vars: AddEmployeeAllowedLocationVariables): MutationPromise<AddEmployeeAllowedLocationData, AddEmployeeAllowedLocationVariables>;

interface AddEmployeeAllowedLocationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddEmployeeAllowedLocationVariables): MutationRef<AddEmployeeAllowedLocationData, AddEmployeeAllowedLocationVariables>;
}
export const addEmployeeAllowedLocationRef: AddEmployeeAllowedLocationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addEmployeeAllowedLocation(dc: DataConnect, vars: AddEmployeeAllowedLocationVariables): MutationPromise<AddEmployeeAllowedLocationData, AddEmployeeAllowedLocationVariables>;

interface AddEmployeeAllowedLocationRef {
  ...
  (dc: DataConnect, vars: AddEmployeeAllowedLocationVariables): MutationRef<AddEmployeeAllowedLocationData, AddEmployeeAllowedLocationVariables>;
}
export const addEmployeeAllowedLocationRef: AddEmployeeAllowedLocationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addEmployeeAllowedLocationRef:
```typescript
const name = addEmployeeAllowedLocationRef.operationName;
console.log(name);
```

### Variables
The `AddEmployeeAllowedLocation` mutation requires an argument of type `AddEmployeeAllowedLocationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddEmployeeAllowedLocationVariables {
  employeeAttendancePolicyId: UUIDString;
  workLocationId: UUIDString;
  locationRole: string;
  isRequired: boolean;
}
```
### Return Type
Recall that executing the `AddEmployeeAllowedLocation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddEmployeeAllowedLocationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddEmployeeAllowedLocationData {
  employeeAllowedLocation_insert: EmployeeAllowedLocation_Key;
}
```
### Using `AddEmployeeAllowedLocation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addEmployeeAllowedLocation, AddEmployeeAllowedLocationVariables } from '@rh-ponto/api-client/generated';

// The `AddEmployeeAllowedLocation` mutation requires an argument of type `AddEmployeeAllowedLocationVariables`:
const addEmployeeAllowedLocationVars: AddEmployeeAllowedLocationVariables = {
  employeeAttendancePolicyId: ..., 
  workLocationId: ..., 
  locationRole: ..., 
  isRequired: ..., 
};

// Call the `addEmployeeAllowedLocation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addEmployeeAllowedLocation(addEmployeeAllowedLocationVars);
// Variables can be defined inline as well.
const { data } = await addEmployeeAllowedLocation({ employeeAttendancePolicyId: ..., workLocationId: ..., locationRole: ..., isRequired: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addEmployeeAllowedLocation(dataConnect, addEmployeeAllowedLocationVars);

console.log(data.employeeAllowedLocation_insert);

// Or, you can use the `Promise` API.
addEmployeeAllowedLocation(addEmployeeAllowedLocationVars).then((response) => {
  const data = response.data;
  console.log(data.employeeAllowedLocation_insert);
});
```

### Using `AddEmployeeAllowedLocation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addEmployeeAllowedLocationRef, AddEmployeeAllowedLocationVariables } from '@rh-ponto/api-client/generated';

// The `AddEmployeeAllowedLocation` mutation requires an argument of type `AddEmployeeAllowedLocationVariables`:
const addEmployeeAllowedLocationVars: AddEmployeeAllowedLocationVariables = {
  employeeAttendancePolicyId: ..., 
  workLocationId: ..., 
  locationRole: ..., 
  isRequired: ..., 
};

// Call the `addEmployeeAllowedLocationRef()` function to get a reference to the mutation.
const ref = addEmployeeAllowedLocationRef(addEmployeeAllowedLocationVars);
// Variables can be defined inline as well.
const ref = addEmployeeAllowedLocationRef({ employeeAttendancePolicyId: ..., workLocationId: ..., locationRole: ..., isRequired: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addEmployeeAllowedLocationRef(dataConnect, addEmployeeAllowedLocationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employeeAllowedLocation_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeAllowedLocation_insert);
});
```

## CreateAuditLog
You can execute the `CreateAuditLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createAuditLog(vars: CreateAuditLogVariables): MutationPromise<CreateAuditLogData, CreateAuditLogVariables>;

interface CreateAuditLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuditLogVariables): MutationRef<CreateAuditLogData, CreateAuditLogVariables>;
}
export const createAuditLogRef: CreateAuditLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAuditLog(dc: DataConnect, vars: CreateAuditLogVariables): MutationPromise<CreateAuditLogData, CreateAuditLogVariables>;

interface CreateAuditLogRef {
  ...
  (dc: DataConnect, vars: CreateAuditLogVariables): MutationRef<CreateAuditLogData, CreateAuditLogVariables>;
}
export const createAuditLogRef: CreateAuditLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAuditLogRef:
```typescript
const name = createAuditLogRef.operationName;
console.log(name);
```

### Variables
The `CreateAuditLog` mutation requires an argument of type `CreateAuditLogVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAuditLogVariables {
  userId?: UUIDString | null;
  entityName: string;
  entityId?: string | null;
  action: string;
  description?: string | null;
  oldData?: unknown | null;
  newData?: unknown | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
}
```
### Return Type
Recall that executing the `CreateAuditLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAuditLogData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAuditLogData {
  auditLog_insert: AuditLog_Key;
}
```
### Using `CreateAuditLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAuditLog, CreateAuditLogVariables } from '@rh-ponto/api-client/generated';

// The `CreateAuditLog` mutation requires an argument of type `CreateAuditLogVariables`:
const createAuditLogVars: CreateAuditLogVariables = {
  userId: ..., // optional
  entityName: ..., 
  entityId: ..., // optional
  action: ..., 
  description: ..., // optional
  oldData: ..., // optional
  newData: ..., // optional
  ipAddress: ..., // optional
  deviceInfo: ..., // optional
};

// Call the `createAuditLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAuditLog(createAuditLogVars);
// Variables can be defined inline as well.
const { data } = await createAuditLog({ userId: ..., entityName: ..., entityId: ..., action: ..., description: ..., oldData: ..., newData: ..., ipAddress: ..., deviceInfo: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAuditLog(dataConnect, createAuditLogVars);

console.log(data.auditLog_insert);

// Or, you can use the `Promise` API.
createAuditLog(createAuditLogVars).then((response) => {
  const data = response.data;
  console.log(data.auditLog_insert);
});
```

### Using `CreateAuditLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAuditLogRef, CreateAuditLogVariables } from '@rh-ponto/api-client/generated';

// The `CreateAuditLog` mutation requires an argument of type `CreateAuditLogVariables`:
const createAuditLogVars: CreateAuditLogVariables = {
  userId: ..., // optional
  entityName: ..., 
  entityId: ..., // optional
  action: ..., 
  description: ..., // optional
  oldData: ..., // optional
  newData: ..., // optional
  ipAddress: ..., // optional
  deviceInfo: ..., // optional
};

// Call the `createAuditLogRef()` function to get a reference to the mutation.
const ref = createAuditLogRef(createAuditLogVars);
// Variables can be defined inline as well.
const ref = createAuditLogRef({ userId: ..., entityName: ..., entityId: ..., action: ..., description: ..., oldData: ..., newData: ..., ipAddress: ..., deviceInfo: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAuditLogRef(dataConnect, createAuditLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditLog_insert);
});
```

## MarkEmployeeNotificationsAsRead
You can execute the `MarkEmployeeNotificationsAsRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
markEmployeeNotificationsAsRead(vars: MarkEmployeeNotificationsAsReadVariables): MutationPromise<MarkEmployeeNotificationsAsReadData, MarkEmployeeNotificationsAsReadVariables>;

interface MarkEmployeeNotificationsAsReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkEmployeeNotificationsAsReadVariables): MutationRef<MarkEmployeeNotificationsAsReadData, MarkEmployeeNotificationsAsReadVariables>;
}
export const markEmployeeNotificationsAsReadRef: MarkEmployeeNotificationsAsReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markEmployeeNotificationsAsRead(dc: DataConnect, vars: MarkEmployeeNotificationsAsReadVariables): MutationPromise<MarkEmployeeNotificationsAsReadData, MarkEmployeeNotificationsAsReadVariables>;

interface MarkEmployeeNotificationsAsReadRef {
  ...
  (dc: DataConnect, vars: MarkEmployeeNotificationsAsReadVariables): MutationRef<MarkEmployeeNotificationsAsReadData, MarkEmployeeNotificationsAsReadVariables>;
}
export const markEmployeeNotificationsAsReadRef: MarkEmployeeNotificationsAsReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markEmployeeNotificationsAsReadRef:
```typescript
const name = markEmployeeNotificationsAsReadRef.operationName;
console.log(name);
```

### Variables
The `MarkEmployeeNotificationsAsRead` mutation requires an argument of type `MarkEmployeeNotificationsAsReadVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkEmployeeNotificationsAsReadVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `MarkEmployeeNotificationsAsRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkEmployeeNotificationsAsReadData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkEmployeeNotificationsAsReadData {
  adminNotification_updateMany: number;
}
```
### Using `MarkEmployeeNotificationsAsRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markEmployeeNotificationsAsRead, MarkEmployeeNotificationsAsReadVariables } from '@rh-ponto/api-client/generated';

// The `MarkEmployeeNotificationsAsRead` mutation requires an argument of type `MarkEmployeeNotificationsAsReadVariables`:
const markEmployeeNotificationsAsReadVars: MarkEmployeeNotificationsAsReadVariables = {
  userId: ..., 
};

// Call the `markEmployeeNotificationsAsRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markEmployeeNotificationsAsRead(markEmployeeNotificationsAsReadVars);
// Variables can be defined inline as well.
const { data } = await markEmployeeNotificationsAsRead({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markEmployeeNotificationsAsRead(dataConnect, markEmployeeNotificationsAsReadVars);

console.log(data.adminNotification_updateMany);

// Or, you can use the `Promise` API.
markEmployeeNotificationsAsRead(markEmployeeNotificationsAsReadVars).then((response) => {
  const data = response.data;
  console.log(data.adminNotification_updateMany);
});
```

### Using `MarkEmployeeNotificationsAsRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markEmployeeNotificationsAsReadRef, MarkEmployeeNotificationsAsReadVariables } from '@rh-ponto/api-client/generated';

// The `MarkEmployeeNotificationsAsRead` mutation requires an argument of type `MarkEmployeeNotificationsAsReadVariables`:
const markEmployeeNotificationsAsReadVars: MarkEmployeeNotificationsAsReadVariables = {
  userId: ..., 
};

// Call the `markEmployeeNotificationsAsReadRef()` function to get a reference to the mutation.
const ref = markEmployeeNotificationsAsReadRef(markEmployeeNotificationsAsReadVars);
// Variables can be defined inline as well.
const ref = markEmployeeNotificationsAsReadRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markEmployeeNotificationsAsReadRef(dataConnect, markEmployeeNotificationsAsReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.adminNotification_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.adminNotification_updateMany);
});
```

## CreateEmployee
You can execute the `CreateEmployee` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createEmployee(vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;

interface CreateEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
}
export const createEmployeeRef: CreateEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEmployee(dc: DataConnect, vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;

interface CreateEmployeeRef {
  ...
  (dc: DataConnect, vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
}
export const createEmployeeRef: CreateEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEmployeeRef:
```typescript
const name = createEmployeeRef.operationName;
console.log(name);
```

### Variables
The `CreateEmployee` mutation requires an argument of type `CreateEmployeeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEmployeeVariables {
  registrationNumber: string;
  fullName: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: DateString | null;
  hireDate?: DateString | null;
  departmentId?: UUIDString | null;
  position?: string | null;
  profilePhotoUrl?: string | null;
  pinCode?: string | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreateEmployee` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEmployeeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEmployeeData {
  employee_insert: Employee_Key;
}
```
### Using `CreateEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEmployee, CreateEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `CreateEmployee` mutation requires an argument of type `CreateEmployeeVariables`:
const createEmployeeVars: CreateEmployeeVariables = {
  registrationNumber: ..., 
  fullName: ..., 
  cpf: ..., // optional
  email: ..., // optional
  phone: ..., // optional
  birthDate: ..., // optional
  hireDate: ..., // optional
  departmentId: ..., // optional
  position: ..., // optional
  profilePhotoUrl: ..., // optional
  pinCode: ..., // optional
  isActive: ..., 
};

// Call the `createEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEmployee(createEmployeeVars);
// Variables can be defined inline as well.
const { data } = await createEmployee({ registrationNumber: ..., fullName: ..., cpf: ..., email: ..., phone: ..., birthDate: ..., hireDate: ..., departmentId: ..., position: ..., profilePhotoUrl: ..., pinCode: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEmployee(dataConnect, createEmployeeVars);

console.log(data.employee_insert);

// Or, you can use the `Promise` API.
createEmployee(createEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.employee_insert);
});
```

### Using `CreateEmployee`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEmployeeRef, CreateEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `CreateEmployee` mutation requires an argument of type `CreateEmployeeVariables`:
const createEmployeeVars: CreateEmployeeVariables = {
  registrationNumber: ..., 
  fullName: ..., 
  cpf: ..., // optional
  email: ..., // optional
  phone: ..., // optional
  birthDate: ..., // optional
  hireDate: ..., // optional
  departmentId: ..., // optional
  position: ..., // optional
  profilePhotoUrl: ..., // optional
  pinCode: ..., // optional
  isActive: ..., 
};

// Call the `createEmployeeRef()` function to get a reference to the mutation.
const ref = createEmployeeRef(createEmployeeVars);
// Variables can be defined inline as well.
const ref = createEmployeeRef({ registrationNumber: ..., fullName: ..., cpf: ..., email: ..., phone: ..., birthDate: ..., hireDate: ..., departmentId: ..., position: ..., profilePhotoUrl: ..., pinCode: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEmployeeRef(dataConnect, createEmployeeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employee_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employee_insert);
});
```

## UpdateEmployee
You can execute the `UpdateEmployee` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateEmployee(vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;

interface UpdateEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
}
export const updateEmployeeRef: UpdateEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEmployee(dc: DataConnect, vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;

interface UpdateEmployeeRef {
  ...
  (dc: DataConnect, vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
}
export const updateEmployeeRef: UpdateEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEmployeeRef:
```typescript
const name = updateEmployeeRef.operationName;
console.log(name);
```

### Variables
The `UpdateEmployee` mutation requires an argument of type `UpdateEmployeeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEmployeeVariables {
  id: UUIDString;
  registrationNumber?: string | null;
  fullName?: string | null;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: DateString | null;
  hireDate?: DateString | null;
  departmentId?: UUIDString | null;
  position?: string | null;
  profilePhotoUrl?: string | null;
  pinCode?: string | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateEmployee` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEmployeeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEmployeeData {
  employee_update?: Employee_Key | null;
}
```
### Using `UpdateEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEmployee, UpdateEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `UpdateEmployee` mutation requires an argument of type `UpdateEmployeeVariables`:
const updateEmployeeVars: UpdateEmployeeVariables = {
  id: ..., 
  registrationNumber: ..., // optional
  fullName: ..., // optional
  cpf: ..., // optional
  email: ..., // optional
  phone: ..., // optional
  birthDate: ..., // optional
  hireDate: ..., // optional
  departmentId: ..., // optional
  position: ..., // optional
  profilePhotoUrl: ..., // optional
  pinCode: ..., // optional
  isActive: ..., // optional
};

// Call the `updateEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEmployee(updateEmployeeVars);
// Variables can be defined inline as well.
const { data } = await updateEmployee({ id: ..., registrationNumber: ..., fullName: ..., cpf: ..., email: ..., phone: ..., birthDate: ..., hireDate: ..., departmentId: ..., position: ..., profilePhotoUrl: ..., pinCode: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEmployee(dataConnect, updateEmployeeVars);

console.log(data.employee_update);

// Or, you can use the `Promise` API.
updateEmployee(updateEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.employee_update);
});
```

### Using `UpdateEmployee`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEmployeeRef, UpdateEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `UpdateEmployee` mutation requires an argument of type `UpdateEmployeeVariables`:
const updateEmployeeVars: UpdateEmployeeVariables = {
  id: ..., 
  registrationNumber: ..., // optional
  fullName: ..., // optional
  cpf: ..., // optional
  email: ..., // optional
  phone: ..., // optional
  birthDate: ..., // optional
  hireDate: ..., // optional
  departmentId: ..., // optional
  position: ..., // optional
  profilePhotoUrl: ..., // optional
  pinCode: ..., // optional
  isActive: ..., // optional
};

// Call the `updateEmployeeRef()` function to get a reference to the mutation.
const ref = updateEmployeeRef(updateEmployeeVars);
// Variables can be defined inline as well.
const ref = updateEmployeeRef({ id: ..., registrationNumber: ..., fullName: ..., cpf: ..., email: ..., phone: ..., birthDate: ..., hireDate: ..., departmentId: ..., position: ..., profilePhotoUrl: ..., pinCode: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEmployeeRef(dataConnect, updateEmployeeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employee_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employee_update);
});
```

## DeactivateEmployee
You can execute the `DeactivateEmployee` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deactivateEmployee(vars: DeactivateEmployeeVariables): MutationPromise<DeactivateEmployeeData, DeactivateEmployeeVariables>;

interface DeactivateEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeactivateEmployeeVariables): MutationRef<DeactivateEmployeeData, DeactivateEmployeeVariables>;
}
export const deactivateEmployeeRef: DeactivateEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deactivateEmployee(dc: DataConnect, vars: DeactivateEmployeeVariables): MutationPromise<DeactivateEmployeeData, DeactivateEmployeeVariables>;

interface DeactivateEmployeeRef {
  ...
  (dc: DataConnect, vars: DeactivateEmployeeVariables): MutationRef<DeactivateEmployeeData, DeactivateEmployeeVariables>;
}
export const deactivateEmployeeRef: DeactivateEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deactivateEmployeeRef:
```typescript
const name = deactivateEmployeeRef.operationName;
console.log(name);
```

### Variables
The `DeactivateEmployee` mutation requires an argument of type `DeactivateEmployeeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeactivateEmployeeVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeactivateEmployee` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeactivateEmployeeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeactivateEmployeeData {
  employee_update?: Employee_Key | null;
}
```
### Using `DeactivateEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deactivateEmployee, DeactivateEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `DeactivateEmployee` mutation requires an argument of type `DeactivateEmployeeVariables`:
const deactivateEmployeeVars: DeactivateEmployeeVariables = {
  id: ..., 
};

// Call the `deactivateEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deactivateEmployee(deactivateEmployeeVars);
// Variables can be defined inline as well.
const { data } = await deactivateEmployee({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deactivateEmployee(dataConnect, deactivateEmployeeVars);

console.log(data.employee_update);

// Or, you can use the `Promise` API.
deactivateEmployee(deactivateEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.employee_update);
});
```

### Using `DeactivateEmployee`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deactivateEmployeeRef, DeactivateEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `DeactivateEmployee` mutation requires an argument of type `DeactivateEmployeeVariables`:
const deactivateEmployeeVars: DeactivateEmployeeVariables = {
  id: ..., 
};

// Call the `deactivateEmployeeRef()` function to get a reference to the mutation.
const ref = deactivateEmployeeRef(deactivateEmployeeVars);
// Variables can be defined inline as well.
const ref = deactivateEmployeeRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deactivateEmployeeRef(dataConnect, deactivateEmployeeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employee_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employee_update);
});
```

## CreatePayrollClosure
You can execute the `CreatePayrollClosure` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createPayrollClosure(vars: CreatePayrollClosureVariables): MutationPromise<CreatePayrollClosureData, CreatePayrollClosureVariables>;

interface CreatePayrollClosureRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePayrollClosureVariables): MutationRef<CreatePayrollClosureData, CreatePayrollClosureVariables>;
}
export const createPayrollClosureRef: CreatePayrollClosureRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPayrollClosure(dc: DataConnect, vars: CreatePayrollClosureVariables): MutationPromise<CreatePayrollClosureData, CreatePayrollClosureVariables>;

interface CreatePayrollClosureRef {
  ...
  (dc: DataConnect, vars: CreatePayrollClosureVariables): MutationRef<CreatePayrollClosureData, CreatePayrollClosureVariables>;
}
export const createPayrollClosureRef: CreatePayrollClosureRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPayrollClosureRef:
```typescript
const name = createPayrollClosureRef.operationName;
console.log(name);
```

### Variables
The `CreatePayrollClosure` mutation requires an argument of type `CreatePayrollClosureVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePayrollClosureVariables {
  referenceKey: string;
  referenceLabel: string;
  referenceYear: number;
  referenceMonth: number;
  periodStart: DateString;
  periodEnd: DateString;
  status: string;
  notes?: string | null;
  closedByUserId?: UUIDString | null;
  stateData: unknown;
}
```
### Return Type
Recall that executing the `CreatePayrollClosure` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePayrollClosureData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePayrollClosureData {
  payrollClosure_insert: PayrollClosure_Key;
}
```
### Using `CreatePayrollClosure`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPayrollClosure, CreatePayrollClosureVariables } from '@rh-ponto/api-client/generated';

// The `CreatePayrollClosure` mutation requires an argument of type `CreatePayrollClosureVariables`:
const createPayrollClosureVars: CreatePayrollClosureVariables = {
  referenceKey: ..., 
  referenceLabel: ..., 
  referenceYear: ..., 
  referenceMonth: ..., 
  periodStart: ..., 
  periodEnd: ..., 
  status: ..., 
  notes: ..., // optional
  closedByUserId: ..., // optional
  stateData: ..., 
};

// Call the `createPayrollClosure()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPayrollClosure(createPayrollClosureVars);
// Variables can be defined inline as well.
const { data } = await createPayrollClosure({ referenceKey: ..., referenceLabel: ..., referenceYear: ..., referenceMonth: ..., periodStart: ..., periodEnd: ..., status: ..., notes: ..., closedByUserId: ..., stateData: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPayrollClosure(dataConnect, createPayrollClosureVars);

console.log(data.payrollClosure_insert);

// Or, you can use the `Promise` API.
createPayrollClosure(createPayrollClosureVars).then((response) => {
  const data = response.data;
  console.log(data.payrollClosure_insert);
});
```

### Using `CreatePayrollClosure`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPayrollClosureRef, CreatePayrollClosureVariables } from '@rh-ponto/api-client/generated';

// The `CreatePayrollClosure` mutation requires an argument of type `CreatePayrollClosureVariables`:
const createPayrollClosureVars: CreatePayrollClosureVariables = {
  referenceKey: ..., 
  referenceLabel: ..., 
  referenceYear: ..., 
  referenceMonth: ..., 
  periodStart: ..., 
  periodEnd: ..., 
  status: ..., 
  notes: ..., // optional
  closedByUserId: ..., // optional
  stateData: ..., 
};

// Call the `createPayrollClosureRef()` function to get a reference to the mutation.
const ref = createPayrollClosureRef(createPayrollClosureVars);
// Variables can be defined inline as well.
const ref = createPayrollClosureRef({ referenceKey: ..., referenceLabel: ..., referenceYear: ..., referenceMonth: ..., periodStart: ..., periodEnd: ..., status: ..., notes: ..., closedByUserId: ..., stateData: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPayrollClosureRef(dataConnect, createPayrollClosureVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payrollClosure_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollClosure_insert);
});
```

## UpdatePayrollClosure
You can execute the `UpdatePayrollClosure` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updatePayrollClosure(vars: UpdatePayrollClosureVariables): MutationPromise<UpdatePayrollClosureData, UpdatePayrollClosureVariables>;

interface UpdatePayrollClosureRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePayrollClosureVariables): MutationRef<UpdatePayrollClosureData, UpdatePayrollClosureVariables>;
}
export const updatePayrollClosureRef: UpdatePayrollClosureRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePayrollClosure(dc: DataConnect, vars: UpdatePayrollClosureVariables): MutationPromise<UpdatePayrollClosureData, UpdatePayrollClosureVariables>;

interface UpdatePayrollClosureRef {
  ...
  (dc: DataConnect, vars: UpdatePayrollClosureVariables): MutationRef<UpdatePayrollClosureData, UpdatePayrollClosureVariables>;
}
export const updatePayrollClosureRef: UpdatePayrollClosureRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePayrollClosureRef:
```typescript
const name = updatePayrollClosureRef.operationName;
console.log(name);
```

### Variables
The `UpdatePayrollClosure` mutation requires an argument of type `UpdatePayrollClosureVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePayrollClosureVariables {
  id: UUIDString;
  status: string;
  notes?: string | null;
  closedByUserId?: UUIDString | null;
  stateData: unknown;
}
```
### Return Type
Recall that executing the `UpdatePayrollClosure` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePayrollClosureData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePayrollClosureData {
  payrollClosure_update?: PayrollClosure_Key | null;
}
```
### Using `UpdatePayrollClosure`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePayrollClosure, UpdatePayrollClosureVariables } from '@rh-ponto/api-client/generated';

// The `UpdatePayrollClosure` mutation requires an argument of type `UpdatePayrollClosureVariables`:
const updatePayrollClosureVars: UpdatePayrollClosureVariables = {
  id: ..., 
  status: ..., 
  notes: ..., // optional
  closedByUserId: ..., // optional
  stateData: ..., 
};

// Call the `updatePayrollClosure()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePayrollClosure(updatePayrollClosureVars);
// Variables can be defined inline as well.
const { data } = await updatePayrollClosure({ id: ..., status: ..., notes: ..., closedByUserId: ..., stateData: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePayrollClosure(dataConnect, updatePayrollClosureVars);

console.log(data.payrollClosure_update);

// Or, you can use the `Promise` API.
updatePayrollClosure(updatePayrollClosureVars).then((response) => {
  const data = response.data;
  console.log(data.payrollClosure_update);
});
```

### Using `UpdatePayrollClosure`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePayrollClosureRef, UpdatePayrollClosureVariables } from '@rh-ponto/api-client/generated';

// The `UpdatePayrollClosure` mutation requires an argument of type `UpdatePayrollClosureVariables`:
const updatePayrollClosureVars: UpdatePayrollClosureVariables = {
  id: ..., 
  status: ..., 
  notes: ..., // optional
  closedByUserId: ..., // optional
  stateData: ..., 
};

// Call the `updatePayrollClosureRef()` function to get a reference to the mutation.
const ref = updatePayrollClosureRef(updatePayrollClosureVars);
// Variables can be defined inline as well.
const ref = updatePayrollClosureRef({ id: ..., status: ..., notes: ..., closedByUserId: ..., stateData: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePayrollClosureRef(dataConnect, updatePayrollClosureVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.payrollClosure_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.payrollClosure_update);
});
```

## MarkEmployeeNotificationAsRead
You can execute the `MarkEmployeeNotificationAsRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
markEmployeeNotificationAsRead(vars: MarkEmployeeNotificationAsReadVariables): MutationPromise<MarkEmployeeNotificationAsReadData, MarkEmployeeNotificationAsReadVariables>;

interface MarkEmployeeNotificationAsReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkEmployeeNotificationAsReadVariables): MutationRef<MarkEmployeeNotificationAsReadData, MarkEmployeeNotificationAsReadVariables>;
}
export const markEmployeeNotificationAsReadRef: MarkEmployeeNotificationAsReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markEmployeeNotificationAsRead(dc: DataConnect, vars: MarkEmployeeNotificationAsReadVariables): MutationPromise<MarkEmployeeNotificationAsReadData, MarkEmployeeNotificationAsReadVariables>;

interface MarkEmployeeNotificationAsReadRef {
  ...
  (dc: DataConnect, vars: MarkEmployeeNotificationAsReadVariables): MutationRef<MarkEmployeeNotificationAsReadData, MarkEmployeeNotificationAsReadVariables>;
}
export const markEmployeeNotificationAsReadRef: MarkEmployeeNotificationAsReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markEmployeeNotificationAsReadRef:
```typescript
const name = markEmployeeNotificationAsReadRef.operationName;
console.log(name);
```

### Variables
The `MarkEmployeeNotificationAsRead` mutation requires an argument of type `MarkEmployeeNotificationAsReadVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkEmployeeNotificationAsReadVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `MarkEmployeeNotificationAsRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkEmployeeNotificationAsReadData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkEmployeeNotificationAsReadData {
  adminNotification_update?: AdminNotification_Key | null;
}
```
### Using `MarkEmployeeNotificationAsRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markEmployeeNotificationAsRead, MarkEmployeeNotificationAsReadVariables } from '@rh-ponto/api-client/generated';

// The `MarkEmployeeNotificationAsRead` mutation requires an argument of type `MarkEmployeeNotificationAsReadVariables`:
const markEmployeeNotificationAsReadVars: MarkEmployeeNotificationAsReadVariables = {
  id: ..., 
};

// Call the `markEmployeeNotificationAsRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markEmployeeNotificationAsRead(markEmployeeNotificationAsReadVars);
// Variables can be defined inline as well.
const { data } = await markEmployeeNotificationAsRead({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markEmployeeNotificationAsRead(dataConnect, markEmployeeNotificationAsReadVars);

console.log(data.adminNotification_update);

// Or, you can use the `Promise` API.
markEmployeeNotificationAsRead(markEmployeeNotificationAsReadVars).then((response) => {
  const data = response.data;
  console.log(data.adminNotification_update);
});
```

### Using `MarkEmployeeNotificationAsRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markEmployeeNotificationAsReadRef, MarkEmployeeNotificationAsReadVariables } from '@rh-ponto/api-client/generated';

// The `MarkEmployeeNotificationAsRead` mutation requires an argument of type `MarkEmployeeNotificationAsReadVariables`:
const markEmployeeNotificationAsReadVars: MarkEmployeeNotificationAsReadVariables = {
  id: ..., 
};

// Call the `markEmployeeNotificationAsReadRef()` function to get a reference to the mutation.
const ref = markEmployeeNotificationAsReadRef(markEmployeeNotificationAsReadVars);
// Variables can be defined inline as well.
const ref = markEmployeeNotificationAsReadRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markEmployeeNotificationAsReadRef(dataConnect, markEmployeeNotificationAsReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.adminNotification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.adminNotification_update);
});
```

## UpdateEmployeeNotificationPreferences
You can execute the `UpdateEmployeeNotificationPreferences` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateEmployeeNotificationPreferences(vars: UpdateEmployeeNotificationPreferencesVariables): MutationPromise<UpdateEmployeeNotificationPreferencesData, UpdateEmployeeNotificationPreferencesVariables>;

interface UpdateEmployeeNotificationPreferencesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeNotificationPreferencesVariables): MutationRef<UpdateEmployeeNotificationPreferencesData, UpdateEmployeeNotificationPreferencesVariables>;
}
export const updateEmployeeNotificationPreferencesRef: UpdateEmployeeNotificationPreferencesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEmployeeNotificationPreferences(dc: DataConnect, vars: UpdateEmployeeNotificationPreferencesVariables): MutationPromise<UpdateEmployeeNotificationPreferencesData, UpdateEmployeeNotificationPreferencesVariables>;

interface UpdateEmployeeNotificationPreferencesRef {
  ...
  (dc: DataConnect, vars: UpdateEmployeeNotificationPreferencesVariables): MutationRef<UpdateEmployeeNotificationPreferencesData, UpdateEmployeeNotificationPreferencesVariables>;
}
export const updateEmployeeNotificationPreferencesRef: UpdateEmployeeNotificationPreferencesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEmployeeNotificationPreferencesRef:
```typescript
const name = updateEmployeeNotificationPreferencesRef.operationName;
console.log(name);
```

### Variables
The `UpdateEmployeeNotificationPreferences` mutation requires an argument of type `UpdateEmployeeNotificationPreferencesVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEmployeeNotificationPreferencesVariables {
  id: UUIDString;
  notifyEntryReminder: boolean;
  notifyBreakReminder: boolean;
  notifyExitReminder: boolean;
  notifyJustificationStatus: boolean;
  notifyRhAdjustment: boolean;
  notifyCompanyCommunications: boolean;
  notifySystemAlerts: boolean;
  notifyVacationStatus: boolean;
  notifyDocuments: boolean;
  notifyPayroll: boolean;
}
```
### Return Type
Recall that executing the `UpdateEmployeeNotificationPreferences` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEmployeeNotificationPreferencesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEmployeeNotificationPreferencesData {
  employeeNotificationPreference_update?: EmployeeNotificationPreference_Key | null;
}
```
### Using `UpdateEmployeeNotificationPreferences`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEmployeeNotificationPreferences, UpdateEmployeeNotificationPreferencesVariables } from '@rh-ponto/api-client/generated';

// The `UpdateEmployeeNotificationPreferences` mutation requires an argument of type `UpdateEmployeeNotificationPreferencesVariables`:
const updateEmployeeNotificationPreferencesVars: UpdateEmployeeNotificationPreferencesVariables = {
  id: ..., 
  notifyEntryReminder: ..., 
  notifyBreakReminder: ..., 
  notifyExitReminder: ..., 
  notifyJustificationStatus: ..., 
  notifyRhAdjustment: ..., 
  notifyCompanyCommunications: ..., 
  notifySystemAlerts: ..., 
  notifyVacationStatus: ..., 
  notifyDocuments: ..., 
  notifyPayroll: ..., 
};

// Call the `updateEmployeeNotificationPreferences()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEmployeeNotificationPreferences(updateEmployeeNotificationPreferencesVars);
// Variables can be defined inline as well.
const { data } = await updateEmployeeNotificationPreferences({ id: ..., notifyEntryReminder: ..., notifyBreakReminder: ..., notifyExitReminder: ..., notifyJustificationStatus: ..., notifyRhAdjustment: ..., notifyCompanyCommunications: ..., notifySystemAlerts: ..., notifyVacationStatus: ..., notifyDocuments: ..., notifyPayroll: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEmployeeNotificationPreferences(dataConnect, updateEmployeeNotificationPreferencesVars);

console.log(data.employeeNotificationPreference_update);

// Or, you can use the `Promise` API.
updateEmployeeNotificationPreferences(updateEmployeeNotificationPreferencesVars).then((response) => {
  const data = response.data;
  console.log(data.employeeNotificationPreference_update);
});
```

### Using `UpdateEmployeeNotificationPreferences`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEmployeeNotificationPreferencesRef, UpdateEmployeeNotificationPreferencesVariables } from '@rh-ponto/api-client/generated';

// The `UpdateEmployeeNotificationPreferences` mutation requires an argument of type `UpdateEmployeeNotificationPreferencesVariables`:
const updateEmployeeNotificationPreferencesVars: UpdateEmployeeNotificationPreferencesVariables = {
  id: ..., 
  notifyEntryReminder: ..., 
  notifyBreakReminder: ..., 
  notifyExitReminder: ..., 
  notifyJustificationStatus: ..., 
  notifyRhAdjustment: ..., 
  notifyCompanyCommunications: ..., 
  notifySystemAlerts: ..., 
  notifyVacationStatus: ..., 
  notifyDocuments: ..., 
  notifyPayroll: ..., 
};

// Call the `updateEmployeeNotificationPreferencesRef()` function to get a reference to the mutation.
const ref = updateEmployeeNotificationPreferencesRef(updateEmployeeNotificationPreferencesVars);
// Variables can be defined inline as well.
const ref = updateEmployeeNotificationPreferencesRef({ id: ..., notifyEntryReminder: ..., notifyBreakReminder: ..., notifyExitReminder: ..., notifyJustificationStatus: ..., notifyRhAdjustment: ..., notifyCompanyCommunications: ..., notifySystemAlerts: ..., notifyVacationStatus: ..., notifyDocuments: ..., notifyPayroll: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEmployeeNotificationPreferencesRef(dataConnect, updateEmployeeNotificationPreferencesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employeeNotificationPreference_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeNotificationPreference_update);
});
```

## AcknowledgeEmployeeDocument
You can execute the `AcknowledgeEmployeeDocument` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
acknowledgeEmployeeDocument(vars: AcknowledgeEmployeeDocumentVariables): MutationPromise<AcknowledgeEmployeeDocumentData, AcknowledgeEmployeeDocumentVariables>;

interface AcknowledgeEmployeeDocumentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AcknowledgeEmployeeDocumentVariables): MutationRef<AcknowledgeEmployeeDocumentData, AcknowledgeEmployeeDocumentVariables>;
}
export const acknowledgeEmployeeDocumentRef: AcknowledgeEmployeeDocumentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
acknowledgeEmployeeDocument(dc: DataConnect, vars: AcknowledgeEmployeeDocumentVariables): MutationPromise<AcknowledgeEmployeeDocumentData, AcknowledgeEmployeeDocumentVariables>;

interface AcknowledgeEmployeeDocumentRef {
  ...
  (dc: DataConnect, vars: AcknowledgeEmployeeDocumentVariables): MutationRef<AcknowledgeEmployeeDocumentData, AcknowledgeEmployeeDocumentVariables>;
}
export const acknowledgeEmployeeDocumentRef: AcknowledgeEmployeeDocumentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the acknowledgeEmployeeDocumentRef:
```typescript
const name = acknowledgeEmployeeDocumentRef.operationName;
console.log(name);
```

### Variables
The `AcknowledgeEmployeeDocument` mutation requires an argument of type `AcknowledgeEmployeeDocumentVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AcknowledgeEmployeeDocumentVariables {
  id: UUIDString;
  employeeId: UUIDString;
}
```
### Return Type
Recall that executing the `AcknowledgeEmployeeDocument` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AcknowledgeEmployeeDocumentData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AcknowledgeEmployeeDocumentData {
  employeeDocument_updateMany: number;
}
```
### Using `AcknowledgeEmployeeDocument`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, acknowledgeEmployeeDocument, AcknowledgeEmployeeDocumentVariables } from '@rh-ponto/api-client/generated';

// The `AcknowledgeEmployeeDocument` mutation requires an argument of type `AcknowledgeEmployeeDocumentVariables`:
const acknowledgeEmployeeDocumentVars: AcknowledgeEmployeeDocumentVariables = {
  id: ..., 
  employeeId: ..., 
};

// Call the `acknowledgeEmployeeDocument()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await acknowledgeEmployeeDocument(acknowledgeEmployeeDocumentVars);
// Variables can be defined inline as well.
const { data } = await acknowledgeEmployeeDocument({ id: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await acknowledgeEmployeeDocument(dataConnect, acknowledgeEmployeeDocumentVars);

console.log(data.employeeDocument_updateMany);

// Or, you can use the `Promise` API.
acknowledgeEmployeeDocument(acknowledgeEmployeeDocumentVars).then((response) => {
  const data = response.data;
  console.log(data.employeeDocument_updateMany);
});
```

### Using `AcknowledgeEmployeeDocument`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, acknowledgeEmployeeDocumentRef, AcknowledgeEmployeeDocumentVariables } from '@rh-ponto/api-client/generated';

// The `AcknowledgeEmployeeDocument` mutation requires an argument of type `AcknowledgeEmployeeDocumentVariables`:
const acknowledgeEmployeeDocumentVars: AcknowledgeEmployeeDocumentVariables = {
  id: ..., 
  employeeId: ..., 
};

// Call the `acknowledgeEmployeeDocumentRef()` function to get a reference to the mutation.
const ref = acknowledgeEmployeeDocumentRef(acknowledgeEmployeeDocumentVars);
// Variables can be defined inline as well.
const ref = acknowledgeEmployeeDocumentRef({ id: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = acknowledgeEmployeeDocumentRef(dataConnect, acknowledgeEmployeeDocumentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employeeDocument_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeDocument_updateMany);
});
```

## SeedRhPontoData
You can execute the `SeedRhPontoData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
seedRhPontoData(): MutationPromise<SeedRhPontoDataData, undefined>;

interface SeedRhPontoDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<SeedRhPontoDataData, undefined>;
}
export const seedRhPontoDataRef: SeedRhPontoDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
seedRhPontoData(dc: DataConnect): MutationPromise<SeedRhPontoDataData, undefined>;

interface SeedRhPontoDataRef {
  ...
  (dc: DataConnect): MutationRef<SeedRhPontoDataData, undefined>;
}
export const seedRhPontoDataRef: SeedRhPontoDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the seedRhPontoDataRef:
```typescript
const name = seedRhPontoDataRef.operationName;
console.log(name);
```

### Variables
The `SeedRhPontoData` mutation has no variables.
### Return Type
Recall that executing the `SeedRhPontoData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SeedRhPontoDataData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SeedRhPontoDataData {
  user_upsertMany: User_Key[];
  departmentManagers_upsertMany: Department_Key[];
  employee_upsertMany: Employee_Key[];
  departmentLeads_upsertMany: Department_Key[];
  device_upsertMany: Device_Key[];
  workSchedule_upsertMany: WorkSchedule_Key[];
  employeeScheduleHistory_upsertMany: EmployeeScheduleHistory_Key[];
  timeRecord_upsertMany: TimeRecord_Key[];
  timeRecordPhoto_upsertMany: TimeRecordPhoto_Key[];
  justification_upsertMany: Justification_Key[];
  justificationAttachment_upsertMany: JustificationAttachment_Key[];
  auditLog_upsertMany: AuditLog_Key[];
  vacationRequest_upsertMany: VacationRequest_Key[];
  employeeDocument_upsertMany: EmployeeDocument_Key[];
  payrollStatement_upsertMany: PayrollStatement_Key[];
  payrollClosure_upsertMany: PayrollClosure_Key[];
  workLocation_upsertMany: WorkLocation_Key[];
  attendancePolicy_upsertMany: AttendancePolicy_Key[];
  employeeAttendancePolicy_upsertMany: EmployeeAttendancePolicy_Key[];
  employeeAllowedLocation_upsertMany: EmployeeAllowedLocation_Key[];
  onboardingJourney_upsertMany: OnboardingJourney_Key[];
  onboardingTask_upsertMany: OnboardingTask_Key[];
  adminSettings_upsertMany: AdminSettings_Key[];
  employeeNotificationPreference_upsertMany: EmployeeNotificationPreference_Key[];
  adminNotification_upsertMany: AdminNotification_Key[];
}
```
### Using `SeedRhPontoData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, seedRhPontoData } from '@rh-ponto/api-client/generated';


// Call the `seedRhPontoData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await seedRhPontoData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await seedRhPontoData(dataConnect);

console.log(data.user_upsertMany);
console.log(data.departmentManagers_upsertMany);
console.log(data.employee_upsertMany);
console.log(data.departmentLeads_upsertMany);
console.log(data.device_upsertMany);
console.log(data.workSchedule_upsertMany);
console.log(data.employeeScheduleHistory_upsertMany);
console.log(data.timeRecord_upsertMany);
console.log(data.timeRecordPhoto_upsertMany);
console.log(data.justification_upsertMany);
console.log(data.justificationAttachment_upsertMany);
console.log(data.auditLog_upsertMany);
console.log(data.vacationRequest_upsertMany);
console.log(data.employeeDocument_upsertMany);
console.log(data.payrollStatement_upsertMany);
console.log(data.payrollClosure_upsertMany);
console.log(data.workLocation_upsertMany);
console.log(data.attendancePolicy_upsertMany);
console.log(data.employeeAttendancePolicy_upsertMany);
console.log(data.employeeAllowedLocation_upsertMany);
console.log(data.onboardingJourney_upsertMany);
console.log(data.onboardingTask_upsertMany);
console.log(data.adminSettings_upsertMany);
console.log(data.employeeNotificationPreference_upsertMany);
console.log(data.adminNotification_upsertMany);

// Or, you can use the `Promise` API.
seedRhPontoData().then((response) => {
  const data = response.data;
  console.log(data.user_upsertMany);
  console.log(data.departmentManagers_upsertMany);
  console.log(data.employee_upsertMany);
  console.log(data.departmentLeads_upsertMany);
  console.log(data.device_upsertMany);
  console.log(data.workSchedule_upsertMany);
  console.log(data.employeeScheduleHistory_upsertMany);
  console.log(data.timeRecord_upsertMany);
  console.log(data.timeRecordPhoto_upsertMany);
  console.log(data.justification_upsertMany);
  console.log(data.justificationAttachment_upsertMany);
  console.log(data.auditLog_upsertMany);
  console.log(data.vacationRequest_upsertMany);
  console.log(data.employeeDocument_upsertMany);
  console.log(data.payrollStatement_upsertMany);
  console.log(data.payrollClosure_upsertMany);
  console.log(data.workLocation_upsertMany);
  console.log(data.attendancePolicy_upsertMany);
  console.log(data.employeeAttendancePolicy_upsertMany);
  console.log(data.employeeAllowedLocation_upsertMany);
  console.log(data.onboardingJourney_upsertMany);
  console.log(data.onboardingTask_upsertMany);
  console.log(data.adminSettings_upsertMany);
  console.log(data.employeeNotificationPreference_upsertMany);
  console.log(data.adminNotification_upsertMany);
});
```

### Using `SeedRhPontoData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, seedRhPontoDataRef } from '@rh-ponto/api-client/generated';


// Call the `seedRhPontoDataRef()` function to get a reference to the mutation.
const ref = seedRhPontoDataRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = seedRhPontoDataRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsertMany);
console.log(data.departmentManagers_upsertMany);
console.log(data.employee_upsertMany);
console.log(data.departmentLeads_upsertMany);
console.log(data.device_upsertMany);
console.log(data.workSchedule_upsertMany);
console.log(data.employeeScheduleHistory_upsertMany);
console.log(data.timeRecord_upsertMany);
console.log(data.timeRecordPhoto_upsertMany);
console.log(data.justification_upsertMany);
console.log(data.justificationAttachment_upsertMany);
console.log(data.auditLog_upsertMany);
console.log(data.vacationRequest_upsertMany);
console.log(data.employeeDocument_upsertMany);
console.log(data.payrollStatement_upsertMany);
console.log(data.payrollClosure_upsertMany);
console.log(data.workLocation_upsertMany);
console.log(data.attendancePolicy_upsertMany);
console.log(data.employeeAttendancePolicy_upsertMany);
console.log(data.employeeAllowedLocation_upsertMany);
console.log(data.onboardingJourney_upsertMany);
console.log(data.onboardingTask_upsertMany);
console.log(data.adminSettings_upsertMany);
console.log(data.employeeNotificationPreference_upsertMany);
console.log(data.adminNotification_upsertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsertMany);
  console.log(data.departmentManagers_upsertMany);
  console.log(data.employee_upsertMany);
  console.log(data.departmentLeads_upsertMany);
  console.log(data.device_upsertMany);
  console.log(data.workSchedule_upsertMany);
  console.log(data.employeeScheduleHistory_upsertMany);
  console.log(data.timeRecord_upsertMany);
  console.log(data.timeRecordPhoto_upsertMany);
  console.log(data.justification_upsertMany);
  console.log(data.justificationAttachment_upsertMany);
  console.log(data.auditLog_upsertMany);
  console.log(data.vacationRequest_upsertMany);
  console.log(data.employeeDocument_upsertMany);
  console.log(data.payrollStatement_upsertMany);
  console.log(data.payrollClosure_upsertMany);
  console.log(data.workLocation_upsertMany);
  console.log(data.attendancePolicy_upsertMany);
  console.log(data.employeeAttendancePolicy_upsertMany);
  console.log(data.employeeAllowedLocation_upsertMany);
  console.log(data.onboardingJourney_upsertMany);
  console.log(data.onboardingTask_upsertMany);
  console.log(data.adminSettings_upsertMany);
  console.log(data.employeeNotificationPreference_upsertMany);
  console.log(data.adminNotification_upsertMany);
});
```

## CreateVacationRequest
You can execute the `CreateVacationRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createVacationRequest(vars: CreateVacationRequestVariables): MutationPromise<CreateVacationRequestData, CreateVacationRequestVariables>;

interface CreateVacationRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVacationRequestVariables): MutationRef<CreateVacationRequestData, CreateVacationRequestVariables>;
}
export const createVacationRequestRef: CreateVacationRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createVacationRequest(dc: DataConnect, vars: CreateVacationRequestVariables): MutationPromise<CreateVacationRequestData, CreateVacationRequestVariables>;

interface CreateVacationRequestRef {
  ...
  (dc: DataConnect, vars: CreateVacationRequestVariables): MutationRef<CreateVacationRequestData, CreateVacationRequestVariables>;
}
export const createVacationRequestRef: CreateVacationRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createVacationRequestRef:
```typescript
const name = createVacationRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateVacationRequest` mutation requires an argument of type `CreateVacationRequestVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateVacationRequestVariables {
  employeeId: UUIDString;
  startDate: DateString;
  endDate: DateString;
  totalDays: number;
  availableDays: number;
  accrualPeriod?: string | null;
  advanceThirteenthSalary?: boolean | null;
  cashBonus?: boolean | null;
  attachmentFileName?: string | null;
  attachmentFileUrl?: string | null;
  coverageNotes?: string | null;
}
```
### Return Type
Recall that executing the `CreateVacationRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateVacationRequestData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateVacationRequestData {
  vacationRequest_insert: VacationRequest_Key;
}
```
### Using `CreateVacationRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createVacationRequest, CreateVacationRequestVariables } from '@rh-ponto/api-client/generated';

// The `CreateVacationRequest` mutation requires an argument of type `CreateVacationRequestVariables`:
const createVacationRequestVars: CreateVacationRequestVariables = {
  employeeId: ..., 
  startDate: ..., 
  endDate: ..., 
  totalDays: ..., 
  availableDays: ..., 
  accrualPeriod: ..., // optional
  advanceThirteenthSalary: ..., // optional
  cashBonus: ..., // optional
  attachmentFileName: ..., // optional
  attachmentFileUrl: ..., // optional
  coverageNotes: ..., // optional
};

// Call the `createVacationRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createVacationRequest(createVacationRequestVars);
// Variables can be defined inline as well.
const { data } = await createVacationRequest({ employeeId: ..., startDate: ..., endDate: ..., totalDays: ..., availableDays: ..., accrualPeriod: ..., advanceThirteenthSalary: ..., cashBonus: ..., attachmentFileName: ..., attachmentFileUrl: ..., coverageNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createVacationRequest(dataConnect, createVacationRequestVars);

console.log(data.vacationRequest_insert);

// Or, you can use the `Promise` API.
createVacationRequest(createVacationRequestVars).then((response) => {
  const data = response.data;
  console.log(data.vacationRequest_insert);
});
```

### Using `CreateVacationRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createVacationRequestRef, CreateVacationRequestVariables } from '@rh-ponto/api-client/generated';

// The `CreateVacationRequest` mutation requires an argument of type `CreateVacationRequestVariables`:
const createVacationRequestVars: CreateVacationRequestVariables = {
  employeeId: ..., 
  startDate: ..., 
  endDate: ..., 
  totalDays: ..., 
  availableDays: ..., 
  accrualPeriod: ..., // optional
  advanceThirteenthSalary: ..., // optional
  cashBonus: ..., // optional
  attachmentFileName: ..., // optional
  attachmentFileUrl: ..., // optional
  coverageNotes: ..., // optional
};

// Call the `createVacationRequestRef()` function to get a reference to the mutation.
const ref = createVacationRequestRef(createVacationRequestVars);
// Variables can be defined inline as well.
const ref = createVacationRequestRef({ employeeId: ..., startDate: ..., endDate: ..., totalDays: ..., availableDays: ..., accrualPeriod: ..., advanceThirteenthSalary: ..., cashBonus: ..., attachmentFileName: ..., attachmentFileUrl: ..., coverageNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createVacationRequestRef(dataConnect, createVacationRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vacationRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vacationRequest_insert);
});
```

## ApproveVacationRequest
You can execute the `ApproveVacationRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
approveVacationRequest(vars: ApproveVacationRequestVariables): MutationPromise<ApproveVacationRequestData, ApproveVacationRequestVariables>;

interface ApproveVacationRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApproveVacationRequestVariables): MutationRef<ApproveVacationRequestData, ApproveVacationRequestVariables>;
}
export const approveVacationRequestRef: ApproveVacationRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
approveVacationRequest(dc: DataConnect, vars: ApproveVacationRequestVariables): MutationPromise<ApproveVacationRequestData, ApproveVacationRequestVariables>;

interface ApproveVacationRequestRef {
  ...
  (dc: DataConnect, vars: ApproveVacationRequestVariables): MutationRef<ApproveVacationRequestData, ApproveVacationRequestVariables>;
}
export const approveVacationRequestRef: ApproveVacationRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the approveVacationRequestRef:
```typescript
const name = approveVacationRequestRef.operationName;
console.log(name);
```

### Variables
The `ApproveVacationRequest` mutation requires an argument of type `ApproveVacationRequestVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ApproveVacationRequestVariables {
  id: UUIDString;
  reviewNotes?: string | null;
  managerApprovalActor?: string | null;
  managerApprovalNotes?: string | null;
  hrApprovalActor?: string | null;
  hrApprovalNotes?: string | null;
}
```
### Return Type
Recall that executing the `ApproveVacationRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ApproveVacationRequestData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ApproveVacationRequestData {
  vacationRequest_update?: VacationRequest_Key | null;
}
```
### Using `ApproveVacationRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, approveVacationRequest, ApproveVacationRequestVariables } from '@rh-ponto/api-client/generated';

// The `ApproveVacationRequest` mutation requires an argument of type `ApproveVacationRequestVariables`:
const approveVacationRequestVars: ApproveVacationRequestVariables = {
  id: ..., 
  reviewNotes: ..., // optional
  managerApprovalActor: ..., // optional
  managerApprovalNotes: ..., // optional
  hrApprovalActor: ..., // optional
  hrApprovalNotes: ..., // optional
};

// Call the `approveVacationRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await approveVacationRequest(approveVacationRequestVars);
// Variables can be defined inline as well.
const { data } = await approveVacationRequest({ id: ..., reviewNotes: ..., managerApprovalActor: ..., managerApprovalNotes: ..., hrApprovalActor: ..., hrApprovalNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await approveVacationRequest(dataConnect, approveVacationRequestVars);

console.log(data.vacationRequest_update);

// Or, you can use the `Promise` API.
approveVacationRequest(approveVacationRequestVars).then((response) => {
  const data = response.data;
  console.log(data.vacationRequest_update);
});
```

### Using `ApproveVacationRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, approveVacationRequestRef, ApproveVacationRequestVariables } from '@rh-ponto/api-client/generated';

// The `ApproveVacationRequest` mutation requires an argument of type `ApproveVacationRequestVariables`:
const approveVacationRequestVars: ApproveVacationRequestVariables = {
  id: ..., 
  reviewNotes: ..., // optional
  managerApprovalActor: ..., // optional
  managerApprovalNotes: ..., // optional
  hrApprovalActor: ..., // optional
  hrApprovalNotes: ..., // optional
};

// Call the `approveVacationRequestRef()` function to get a reference to the mutation.
const ref = approveVacationRequestRef(approveVacationRequestVars);
// Variables can be defined inline as well.
const ref = approveVacationRequestRef({ id: ..., reviewNotes: ..., managerApprovalActor: ..., managerApprovalNotes: ..., hrApprovalActor: ..., hrApprovalNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = approveVacationRequestRef(dataConnect, approveVacationRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vacationRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vacationRequest_update);
});
```

## RejectVacationRequest
You can execute the `RejectVacationRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
rejectVacationRequest(vars: RejectVacationRequestVariables): MutationPromise<RejectVacationRequestData, RejectVacationRequestVariables>;

interface RejectVacationRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RejectVacationRequestVariables): MutationRef<RejectVacationRequestData, RejectVacationRequestVariables>;
}
export const rejectVacationRequestRef: RejectVacationRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
rejectVacationRequest(dc: DataConnect, vars: RejectVacationRequestVariables): MutationPromise<RejectVacationRequestData, RejectVacationRequestVariables>;

interface RejectVacationRequestRef {
  ...
  (dc: DataConnect, vars: RejectVacationRequestVariables): MutationRef<RejectVacationRequestData, RejectVacationRequestVariables>;
}
export const rejectVacationRequestRef: RejectVacationRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the rejectVacationRequestRef:
```typescript
const name = rejectVacationRequestRef.operationName;
console.log(name);
```

### Variables
The `RejectVacationRequest` mutation requires an argument of type `RejectVacationRequestVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RejectVacationRequestVariables {
  id: UUIDString;
  reviewNotes?: string | null;
  managerApprovalActor?: string | null;
  managerApprovalNotes?: string | null;
  hrApprovalActor?: string | null;
  hrApprovalNotes?: string | null;
}
```
### Return Type
Recall that executing the `RejectVacationRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RejectVacationRequestData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RejectVacationRequestData {
  vacationRequest_update?: VacationRequest_Key | null;
}
```
### Using `RejectVacationRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, rejectVacationRequest, RejectVacationRequestVariables } from '@rh-ponto/api-client/generated';

// The `RejectVacationRequest` mutation requires an argument of type `RejectVacationRequestVariables`:
const rejectVacationRequestVars: RejectVacationRequestVariables = {
  id: ..., 
  reviewNotes: ..., // optional
  managerApprovalActor: ..., // optional
  managerApprovalNotes: ..., // optional
  hrApprovalActor: ..., // optional
  hrApprovalNotes: ..., // optional
};

// Call the `rejectVacationRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await rejectVacationRequest(rejectVacationRequestVars);
// Variables can be defined inline as well.
const { data } = await rejectVacationRequest({ id: ..., reviewNotes: ..., managerApprovalActor: ..., managerApprovalNotes: ..., hrApprovalActor: ..., hrApprovalNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await rejectVacationRequest(dataConnect, rejectVacationRequestVars);

console.log(data.vacationRequest_update);

// Or, you can use the `Promise` API.
rejectVacationRequest(rejectVacationRequestVars).then((response) => {
  const data = response.data;
  console.log(data.vacationRequest_update);
});
```

### Using `RejectVacationRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, rejectVacationRequestRef, RejectVacationRequestVariables } from '@rh-ponto/api-client/generated';

// The `RejectVacationRequest` mutation requires an argument of type `RejectVacationRequestVariables`:
const rejectVacationRequestVars: RejectVacationRequestVariables = {
  id: ..., 
  reviewNotes: ..., // optional
  managerApprovalActor: ..., // optional
  managerApprovalNotes: ..., // optional
  hrApprovalActor: ..., // optional
  hrApprovalNotes: ..., // optional
};

// Call the `rejectVacationRequestRef()` function to get a reference to the mutation.
const ref = rejectVacationRequestRef(rejectVacationRequestVars);
// Variables can be defined inline as well.
const ref = rejectVacationRequestRef({ id: ..., reviewNotes: ..., managerApprovalActor: ..., managerApprovalNotes: ..., hrApprovalActor: ..., hrApprovalNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = rejectVacationRequestRef(dataConnect, rejectVacationRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vacationRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vacationRequest_update);
});
```

## TouchUserLastLogin
You can execute the `TouchUserLastLogin` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
touchUserLastLogin(vars: TouchUserLastLoginVariables): MutationPromise<TouchUserLastLoginData, TouchUserLastLoginVariables>;

interface TouchUserLastLoginRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: TouchUserLastLoginVariables): MutationRef<TouchUserLastLoginData, TouchUserLastLoginVariables>;
}
export const touchUserLastLoginRef: TouchUserLastLoginRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
touchUserLastLogin(dc: DataConnect, vars: TouchUserLastLoginVariables): MutationPromise<TouchUserLastLoginData, TouchUserLastLoginVariables>;

interface TouchUserLastLoginRef {
  ...
  (dc: DataConnect, vars: TouchUserLastLoginVariables): MutationRef<TouchUserLastLoginData, TouchUserLastLoginVariables>;
}
export const touchUserLastLoginRef: TouchUserLastLoginRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the touchUserLastLoginRef:
```typescript
const name = touchUserLastLoginRef.operationName;
console.log(name);
```

### Variables
The `TouchUserLastLogin` mutation requires an argument of type `TouchUserLastLoginVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface TouchUserLastLoginVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `TouchUserLastLogin` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `TouchUserLastLoginData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface TouchUserLastLoginData {
  user_update?: User_Key | null;
}
```
### Using `TouchUserLastLogin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, touchUserLastLogin, TouchUserLastLoginVariables } from '@rh-ponto/api-client/generated';

// The `TouchUserLastLogin` mutation requires an argument of type `TouchUserLastLoginVariables`:
const touchUserLastLoginVars: TouchUserLastLoginVariables = {
  id: ..., 
};

// Call the `touchUserLastLogin()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await touchUserLastLogin(touchUserLastLoginVars);
// Variables can be defined inline as well.
const { data } = await touchUserLastLogin({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await touchUserLastLogin(dataConnect, touchUserLastLoginVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
touchUserLastLogin(touchUserLastLoginVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `TouchUserLastLogin`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, touchUserLastLoginRef, TouchUserLastLoginVariables } from '@rh-ponto/api-client/generated';

// The `TouchUserLastLogin` mutation requires an argument of type `TouchUserLastLoginVariables`:
const touchUserLastLoginVars: TouchUserLastLoginVariables = {
  id: ..., 
};

// Call the `touchUserLastLoginRef()` function to get a reference to the mutation.
const ref = touchUserLastLoginRef(touchUserLastLoginVars);
// Variables can be defined inline as well.
const ref = touchUserLastLoginRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = touchUserLastLoginRef(dataConnect, touchUserLastLoginVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## LinkUserFirebaseUid
You can execute the `LinkUserFirebaseUid` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
linkUserFirebaseUid(vars: LinkUserFirebaseUidVariables): MutationPromise<LinkUserFirebaseUidData, LinkUserFirebaseUidVariables>;

interface LinkUserFirebaseUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LinkUserFirebaseUidVariables): MutationRef<LinkUserFirebaseUidData, LinkUserFirebaseUidVariables>;
}
export const linkUserFirebaseUidRef: LinkUserFirebaseUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
linkUserFirebaseUid(dc: DataConnect, vars: LinkUserFirebaseUidVariables): MutationPromise<LinkUserFirebaseUidData, LinkUserFirebaseUidVariables>;

interface LinkUserFirebaseUidRef {
  ...
  (dc: DataConnect, vars: LinkUserFirebaseUidVariables): MutationRef<LinkUserFirebaseUidData, LinkUserFirebaseUidVariables>;
}
export const linkUserFirebaseUidRef: LinkUserFirebaseUidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the linkUserFirebaseUidRef:
```typescript
const name = linkUserFirebaseUidRef.operationName;
console.log(name);
```

### Variables
The `LinkUserFirebaseUid` mutation requires an argument of type `LinkUserFirebaseUidVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LinkUserFirebaseUidVariables {
  id: UUIDString;
  firebaseUid: string;
}
```
### Return Type
Recall that executing the `LinkUserFirebaseUid` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LinkUserFirebaseUidData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LinkUserFirebaseUidData {
  user_update?: User_Key | null;
}
```
### Using `LinkUserFirebaseUid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, linkUserFirebaseUid, LinkUserFirebaseUidVariables } from '@rh-ponto/api-client/generated';

// The `LinkUserFirebaseUid` mutation requires an argument of type `LinkUserFirebaseUidVariables`:
const linkUserFirebaseUidVars: LinkUserFirebaseUidVariables = {
  id: ..., 
  firebaseUid: ..., 
};

// Call the `linkUserFirebaseUid()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await linkUserFirebaseUid(linkUserFirebaseUidVars);
// Variables can be defined inline as well.
const { data } = await linkUserFirebaseUid({ id: ..., firebaseUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await linkUserFirebaseUid(dataConnect, linkUserFirebaseUidVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
linkUserFirebaseUid(linkUserFirebaseUidVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `LinkUserFirebaseUid`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, linkUserFirebaseUidRef, LinkUserFirebaseUidVariables } from '@rh-ponto/api-client/generated';

// The `LinkUserFirebaseUid` mutation requires an argument of type `LinkUserFirebaseUidVariables`:
const linkUserFirebaseUidVars: LinkUserFirebaseUidVariables = {
  id: ..., 
  firebaseUid: ..., 
};

// Call the `linkUserFirebaseUidRef()` function to get a reference to the mutation.
const ref = linkUserFirebaseUidRef(linkUserFirebaseUidVars);
// Variables can be defined inline as well.
const ref = linkUserFirebaseUidRef({ id: ..., firebaseUid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = linkUserFirebaseUidRef(dataConnect, linkUserFirebaseUidVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateJustification
You can execute the `CreateJustification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createJustification(vars: CreateJustificationVariables): MutationPromise<CreateJustificationData, CreateJustificationVariables>;

interface CreateJustificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJustificationVariables): MutationRef<CreateJustificationData, CreateJustificationVariables>;
}
export const createJustificationRef: CreateJustificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createJustification(dc: DataConnect, vars: CreateJustificationVariables): MutationPromise<CreateJustificationData, CreateJustificationVariables>;

interface CreateJustificationRef {
  ...
  (dc: DataConnect, vars: CreateJustificationVariables): MutationRef<CreateJustificationData, CreateJustificationVariables>;
}
export const createJustificationRef: CreateJustificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createJustificationRef:
```typescript
const name = createJustificationRef.operationName;
console.log(name);
```

### Variables
The `CreateJustification` mutation requires an argument of type `CreateJustificationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateJustificationVariables {
  employeeId: UUIDString;
  timeRecordId?: UUIDString | null;
  type: string;
  reason: string;
  requestedRecordType?: string | null;
  requestedRecordedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `CreateJustification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateJustificationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateJustificationData {
  justification_insert: Justification_Key;
}
```
### Using `CreateJustification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createJustification, CreateJustificationVariables } from '@rh-ponto/api-client/generated';

// The `CreateJustification` mutation requires an argument of type `CreateJustificationVariables`:
const createJustificationVars: CreateJustificationVariables = {
  employeeId: ..., 
  timeRecordId: ..., // optional
  type: ..., 
  reason: ..., 
  requestedRecordType: ..., // optional
  requestedRecordedAt: ..., // optional
};

// Call the `createJustification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createJustification(createJustificationVars);
// Variables can be defined inline as well.
const { data } = await createJustification({ employeeId: ..., timeRecordId: ..., type: ..., reason: ..., requestedRecordType: ..., requestedRecordedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createJustification(dataConnect, createJustificationVars);

console.log(data.justification_insert);

// Or, you can use the `Promise` API.
createJustification(createJustificationVars).then((response) => {
  const data = response.data;
  console.log(data.justification_insert);
});
```

### Using `CreateJustification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createJustificationRef, CreateJustificationVariables } from '@rh-ponto/api-client/generated';

// The `CreateJustification` mutation requires an argument of type `CreateJustificationVariables`:
const createJustificationVars: CreateJustificationVariables = {
  employeeId: ..., 
  timeRecordId: ..., // optional
  type: ..., 
  reason: ..., 
  requestedRecordType: ..., // optional
  requestedRecordedAt: ..., // optional
};

// Call the `createJustificationRef()` function to get a reference to the mutation.
const ref = createJustificationRef(createJustificationVars);
// Variables can be defined inline as well.
const ref = createJustificationRef({ employeeId: ..., timeRecordId: ..., type: ..., reason: ..., requestedRecordType: ..., requestedRecordedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createJustificationRef(dataConnect, createJustificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.justification_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.justification_insert);
});
```

## ApproveJustification
You can execute the `ApproveJustification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
approveJustification(vars: ApproveJustificationVariables): MutationPromise<ApproveJustificationData, ApproveJustificationVariables>;

interface ApproveJustificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ApproveJustificationVariables): MutationRef<ApproveJustificationData, ApproveJustificationVariables>;
}
export const approveJustificationRef: ApproveJustificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
approveJustification(dc: DataConnect, vars: ApproveJustificationVariables): MutationPromise<ApproveJustificationData, ApproveJustificationVariables>;

interface ApproveJustificationRef {
  ...
  (dc: DataConnect, vars: ApproveJustificationVariables): MutationRef<ApproveJustificationData, ApproveJustificationVariables>;
}
export const approveJustificationRef: ApproveJustificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the approveJustificationRef:
```typescript
const name = approveJustificationRef.operationName;
console.log(name);
```

### Variables
The `ApproveJustification` mutation requires an argument of type `ApproveJustificationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ApproveJustificationVariables {
  id: UUIDString;
  reviewedByUserId: UUIDString;
  reviewNotes?: string | null;
}
```
### Return Type
Recall that executing the `ApproveJustification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ApproveJustificationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ApproveJustificationData {
  justification_update?: Justification_Key | null;
}
```
### Using `ApproveJustification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, approveJustification, ApproveJustificationVariables } from '@rh-ponto/api-client/generated';

// The `ApproveJustification` mutation requires an argument of type `ApproveJustificationVariables`:
const approveJustificationVars: ApproveJustificationVariables = {
  id: ..., 
  reviewedByUserId: ..., 
  reviewNotes: ..., // optional
};

// Call the `approveJustification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await approveJustification(approveJustificationVars);
// Variables can be defined inline as well.
const { data } = await approveJustification({ id: ..., reviewedByUserId: ..., reviewNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await approveJustification(dataConnect, approveJustificationVars);

console.log(data.justification_update);

// Or, you can use the `Promise` API.
approveJustification(approveJustificationVars).then((response) => {
  const data = response.data;
  console.log(data.justification_update);
});
```

### Using `ApproveJustification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, approveJustificationRef, ApproveJustificationVariables } from '@rh-ponto/api-client/generated';

// The `ApproveJustification` mutation requires an argument of type `ApproveJustificationVariables`:
const approveJustificationVars: ApproveJustificationVariables = {
  id: ..., 
  reviewedByUserId: ..., 
  reviewNotes: ..., // optional
};

// Call the `approveJustificationRef()` function to get a reference to the mutation.
const ref = approveJustificationRef(approveJustificationVars);
// Variables can be defined inline as well.
const ref = approveJustificationRef({ id: ..., reviewedByUserId: ..., reviewNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = approveJustificationRef(dataConnect, approveJustificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.justification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.justification_update);
});
```

## RejectJustification
You can execute the `RejectJustification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
rejectJustification(vars: RejectJustificationVariables): MutationPromise<RejectJustificationData, RejectJustificationVariables>;

interface RejectJustificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RejectJustificationVariables): MutationRef<RejectJustificationData, RejectJustificationVariables>;
}
export const rejectJustificationRef: RejectJustificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
rejectJustification(dc: DataConnect, vars: RejectJustificationVariables): MutationPromise<RejectJustificationData, RejectJustificationVariables>;

interface RejectJustificationRef {
  ...
  (dc: DataConnect, vars: RejectJustificationVariables): MutationRef<RejectJustificationData, RejectJustificationVariables>;
}
export const rejectJustificationRef: RejectJustificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the rejectJustificationRef:
```typescript
const name = rejectJustificationRef.operationName;
console.log(name);
```

### Variables
The `RejectJustification` mutation requires an argument of type `RejectJustificationVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RejectJustificationVariables {
  id: UUIDString;
  reviewedByUserId: UUIDString;
  reviewNotes?: string | null;
}
```
### Return Type
Recall that executing the `RejectJustification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RejectJustificationData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RejectJustificationData {
  justification_update?: Justification_Key | null;
}
```
### Using `RejectJustification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, rejectJustification, RejectJustificationVariables } from '@rh-ponto/api-client/generated';

// The `RejectJustification` mutation requires an argument of type `RejectJustificationVariables`:
const rejectJustificationVars: RejectJustificationVariables = {
  id: ..., 
  reviewedByUserId: ..., 
  reviewNotes: ..., // optional
};

// Call the `rejectJustification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await rejectJustification(rejectJustificationVars);
// Variables can be defined inline as well.
const { data } = await rejectJustification({ id: ..., reviewedByUserId: ..., reviewNotes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await rejectJustification(dataConnect, rejectJustificationVars);

console.log(data.justification_update);

// Or, you can use the `Promise` API.
rejectJustification(rejectJustificationVars).then((response) => {
  const data = response.data;
  console.log(data.justification_update);
});
```

### Using `RejectJustification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, rejectJustificationRef, RejectJustificationVariables } from '@rh-ponto/api-client/generated';

// The `RejectJustification` mutation requires an argument of type `RejectJustificationVariables`:
const rejectJustificationVars: RejectJustificationVariables = {
  id: ..., 
  reviewedByUserId: ..., 
  reviewNotes: ..., // optional
};

// Call the `rejectJustificationRef()` function to get a reference to the mutation.
const ref = rejectJustificationRef(rejectJustificationVars);
// Variables can be defined inline as well.
const ref = rejectJustificationRef({ id: ..., reviewedByUserId: ..., reviewNotes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = rejectJustificationRef(dataConnect, rejectJustificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.justification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.justification_update);
});
```

## AddJustificationAttachment
You can execute the `AddJustificationAttachment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
addJustificationAttachment(vars: AddJustificationAttachmentVariables): MutationPromise<AddJustificationAttachmentData, AddJustificationAttachmentVariables>;

interface AddJustificationAttachmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddJustificationAttachmentVariables): MutationRef<AddJustificationAttachmentData, AddJustificationAttachmentVariables>;
}
export const addJustificationAttachmentRef: AddJustificationAttachmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addJustificationAttachment(dc: DataConnect, vars: AddJustificationAttachmentVariables): MutationPromise<AddJustificationAttachmentData, AddJustificationAttachmentVariables>;

interface AddJustificationAttachmentRef {
  ...
  (dc: DataConnect, vars: AddJustificationAttachmentVariables): MutationRef<AddJustificationAttachmentData, AddJustificationAttachmentVariables>;
}
export const addJustificationAttachmentRef: AddJustificationAttachmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addJustificationAttachmentRef:
```typescript
const name = addJustificationAttachmentRef.operationName;
console.log(name);
```

### Variables
The `AddJustificationAttachment` mutation requires an argument of type `AddJustificationAttachmentVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddJustificationAttachmentVariables {
  justificationId: UUIDString;
  fileName: string;
  fileUrl: string;
  contentType?: string | null;
  fileSizeBytes?: Int64String | null;
  uploadedByUserId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `AddJustificationAttachment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddJustificationAttachmentData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddJustificationAttachmentData {
  justificationAttachment_insert: JustificationAttachment_Key;
}
```
### Using `AddJustificationAttachment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addJustificationAttachment, AddJustificationAttachmentVariables } from '@rh-ponto/api-client/generated';

// The `AddJustificationAttachment` mutation requires an argument of type `AddJustificationAttachmentVariables`:
const addJustificationAttachmentVars: AddJustificationAttachmentVariables = {
  justificationId: ..., 
  fileName: ..., 
  fileUrl: ..., 
  contentType: ..., // optional
  fileSizeBytes: ..., // optional
  uploadedByUserId: ..., // optional
};

// Call the `addJustificationAttachment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addJustificationAttachment(addJustificationAttachmentVars);
// Variables can be defined inline as well.
const { data } = await addJustificationAttachment({ justificationId: ..., fileName: ..., fileUrl: ..., contentType: ..., fileSizeBytes: ..., uploadedByUserId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addJustificationAttachment(dataConnect, addJustificationAttachmentVars);

console.log(data.justificationAttachment_insert);

// Or, you can use the `Promise` API.
addJustificationAttachment(addJustificationAttachmentVars).then((response) => {
  const data = response.data;
  console.log(data.justificationAttachment_insert);
});
```

### Using `AddJustificationAttachment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addJustificationAttachmentRef, AddJustificationAttachmentVariables } from '@rh-ponto/api-client/generated';

// The `AddJustificationAttachment` mutation requires an argument of type `AddJustificationAttachmentVariables`:
const addJustificationAttachmentVars: AddJustificationAttachmentVariables = {
  justificationId: ..., 
  fileName: ..., 
  fileUrl: ..., 
  contentType: ..., // optional
  fileSizeBytes: ..., // optional
  uploadedByUserId: ..., // optional
};

// Call the `addJustificationAttachmentRef()` function to get a reference to the mutation.
const ref = addJustificationAttachmentRef(addJustificationAttachmentVars);
// Variables can be defined inline as well.
const ref = addJustificationAttachmentRef({ justificationId: ..., fileName: ..., fileUrl: ..., contentType: ..., fileSizeBytes: ..., uploadedByUserId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addJustificationAttachmentRef(dataConnect, addJustificationAttachmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.justificationAttachment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.justificationAttachment_insert);
});
```

## CreateDepartment
You can execute the `CreateDepartment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createDepartment(vars: CreateDepartmentVariables): MutationPromise<CreateDepartmentData, CreateDepartmentVariables>;

interface CreateDepartmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDepartmentVariables): MutationRef<CreateDepartmentData, CreateDepartmentVariables>;
}
export const createDepartmentRef: CreateDepartmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDepartment(dc: DataConnect, vars: CreateDepartmentVariables): MutationPromise<CreateDepartmentData, CreateDepartmentVariables>;

interface CreateDepartmentRef {
  ...
  (dc: DataConnect, vars: CreateDepartmentVariables): MutationRef<CreateDepartmentData, CreateDepartmentVariables>;
}
export const createDepartmentRef: CreateDepartmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDepartmentRef:
```typescript
const name = createDepartmentRef.operationName;
console.log(name);
```

### Variables
The `CreateDepartment` mutation requires an argument of type `CreateDepartmentVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDepartmentVariables {
  code: string;
  name: string;
  managerEmployeeId?: UUIDString | null;
  description?: string | null;
  costCenter?: string | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreateDepartment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDepartmentData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDepartmentData {
  department_insert: Department_Key;
}
```
### Using `CreateDepartment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDepartment, CreateDepartmentVariables } from '@rh-ponto/api-client/generated';

// The `CreateDepartment` mutation requires an argument of type `CreateDepartmentVariables`:
const createDepartmentVars: CreateDepartmentVariables = {
  code: ..., 
  name: ..., 
  managerEmployeeId: ..., // optional
  description: ..., // optional
  costCenter: ..., // optional
  isActive: ..., 
};

// Call the `createDepartment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDepartment(createDepartmentVars);
// Variables can be defined inline as well.
const { data } = await createDepartment({ code: ..., name: ..., managerEmployeeId: ..., description: ..., costCenter: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDepartment(dataConnect, createDepartmentVars);

console.log(data.department_insert);

// Or, you can use the `Promise` API.
createDepartment(createDepartmentVars).then((response) => {
  const data = response.data;
  console.log(data.department_insert);
});
```

### Using `CreateDepartment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDepartmentRef, CreateDepartmentVariables } from '@rh-ponto/api-client/generated';

// The `CreateDepartment` mutation requires an argument of type `CreateDepartmentVariables`:
const createDepartmentVars: CreateDepartmentVariables = {
  code: ..., 
  name: ..., 
  managerEmployeeId: ..., // optional
  description: ..., // optional
  costCenter: ..., // optional
  isActive: ..., 
};

// Call the `createDepartmentRef()` function to get a reference to the mutation.
const ref = createDepartmentRef(createDepartmentVars);
// Variables can be defined inline as well.
const ref = createDepartmentRef({ code: ..., name: ..., managerEmployeeId: ..., description: ..., costCenter: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDepartmentRef(dataConnect, createDepartmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.department_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.department_insert);
});
```

## UpdateDepartment
You can execute the `UpdateDepartment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateDepartment(vars: UpdateDepartmentVariables): MutationPromise<UpdateDepartmentData, UpdateDepartmentVariables>;

interface UpdateDepartmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDepartmentVariables): MutationRef<UpdateDepartmentData, UpdateDepartmentVariables>;
}
export const updateDepartmentRef: UpdateDepartmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDepartment(dc: DataConnect, vars: UpdateDepartmentVariables): MutationPromise<UpdateDepartmentData, UpdateDepartmentVariables>;

interface UpdateDepartmentRef {
  ...
  (dc: DataConnect, vars: UpdateDepartmentVariables): MutationRef<UpdateDepartmentData, UpdateDepartmentVariables>;
}
export const updateDepartmentRef: UpdateDepartmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDepartmentRef:
```typescript
const name = updateDepartmentRef.operationName;
console.log(name);
```

### Variables
The `UpdateDepartment` mutation requires an argument of type `UpdateDepartmentVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDepartmentVariables {
  id: UUIDString;
  code?: string | null;
  name?: string | null;
  managerEmployeeId?: UUIDString | null;
  description?: string | null;
  costCenter?: string | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateDepartment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDepartmentData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDepartmentData {
  department_update?: Department_Key | null;
}
```
### Using `UpdateDepartment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDepartment, UpdateDepartmentVariables } from '@rh-ponto/api-client/generated';

// The `UpdateDepartment` mutation requires an argument of type `UpdateDepartmentVariables`:
const updateDepartmentVars: UpdateDepartmentVariables = {
  id: ..., 
  code: ..., // optional
  name: ..., // optional
  managerEmployeeId: ..., // optional
  description: ..., // optional
  costCenter: ..., // optional
  isActive: ..., // optional
};

// Call the `updateDepartment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDepartment(updateDepartmentVars);
// Variables can be defined inline as well.
const { data } = await updateDepartment({ id: ..., code: ..., name: ..., managerEmployeeId: ..., description: ..., costCenter: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDepartment(dataConnect, updateDepartmentVars);

console.log(data.department_update);

// Or, you can use the `Promise` API.
updateDepartment(updateDepartmentVars).then((response) => {
  const data = response.data;
  console.log(data.department_update);
});
```

### Using `UpdateDepartment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDepartmentRef, UpdateDepartmentVariables } from '@rh-ponto/api-client/generated';

// The `UpdateDepartment` mutation requires an argument of type `UpdateDepartmentVariables`:
const updateDepartmentVars: UpdateDepartmentVariables = {
  id: ..., 
  code: ..., // optional
  name: ..., // optional
  managerEmployeeId: ..., // optional
  description: ..., // optional
  costCenter: ..., // optional
  isActive: ..., // optional
};

// Call the `updateDepartmentRef()` function to get a reference to the mutation.
const ref = updateDepartmentRef(updateDepartmentVars);
// Variables can be defined inline as well.
const ref = updateDepartmentRef({ id: ..., code: ..., name: ..., managerEmployeeId: ..., description: ..., costCenter: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDepartmentRef(dataConnect, updateDepartmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.department_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.department_update);
});
```

## DeleteDepartment
You can execute the `DeleteDepartment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deleteDepartment(vars: DeleteDepartmentVariables): MutationPromise<DeleteDepartmentData, DeleteDepartmentVariables>;

interface DeleteDepartmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDepartmentVariables): MutationRef<DeleteDepartmentData, DeleteDepartmentVariables>;
}
export const deleteDepartmentRef: DeleteDepartmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteDepartment(dc: DataConnect, vars: DeleteDepartmentVariables): MutationPromise<DeleteDepartmentData, DeleteDepartmentVariables>;

interface DeleteDepartmentRef {
  ...
  (dc: DataConnect, vars: DeleteDepartmentVariables): MutationRef<DeleteDepartmentData, DeleteDepartmentVariables>;
}
export const deleteDepartmentRef: DeleteDepartmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteDepartmentRef:
```typescript
const name = deleteDepartmentRef.operationName;
console.log(name);
```

### Variables
The `DeleteDepartment` mutation requires an argument of type `DeleteDepartmentVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteDepartmentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteDepartment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteDepartmentData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteDepartmentData {
  department_delete?: Department_Key | null;
}
```
### Using `DeleteDepartment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteDepartment, DeleteDepartmentVariables } from '@rh-ponto/api-client/generated';

// The `DeleteDepartment` mutation requires an argument of type `DeleteDepartmentVariables`:
const deleteDepartmentVars: DeleteDepartmentVariables = {
  id: ..., 
};

// Call the `deleteDepartment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteDepartment(deleteDepartmentVars);
// Variables can be defined inline as well.
const { data } = await deleteDepartment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteDepartment(dataConnect, deleteDepartmentVars);

console.log(data.department_delete);

// Or, you can use the `Promise` API.
deleteDepartment(deleteDepartmentVars).then((response) => {
  const data = response.data;
  console.log(data.department_delete);
});
```

### Using `DeleteDepartment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteDepartmentRef, DeleteDepartmentVariables } from '@rh-ponto/api-client/generated';

// The `DeleteDepartment` mutation requires an argument of type `DeleteDepartmentVariables`:
const deleteDepartmentVars: DeleteDepartmentVariables = {
  id: ..., 
};

// Call the `deleteDepartmentRef()` function to get a reference to the mutation.
const ref = deleteDepartmentRef(deleteDepartmentVars);
// Variables can be defined inline as well.
const ref = deleteDepartmentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteDepartmentRef(dataConnect, deleteDepartmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.department_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.department_delete);
});
```

## CreateDevice
You can execute the `CreateDevice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createDevice(vars: CreateDeviceVariables): MutationPromise<CreateDeviceData, CreateDeviceVariables>;

interface CreateDeviceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDeviceVariables): MutationRef<CreateDeviceData, CreateDeviceVariables>;
}
export const createDeviceRef: CreateDeviceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDevice(dc: DataConnect, vars: CreateDeviceVariables): MutationPromise<CreateDeviceData, CreateDeviceVariables>;

interface CreateDeviceRef {
  ...
  (dc: DataConnect, vars: CreateDeviceVariables): MutationRef<CreateDeviceData, CreateDeviceVariables>;
}
export const createDeviceRef: CreateDeviceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDeviceRef:
```typescript
const name = createDeviceRef.operationName;
console.log(name);
```

### Variables
The `CreateDevice` mutation requires an argument of type `CreateDeviceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDeviceVariables {
  name: string;
  identifier: string;
  type: string;
  locationName?: string | null;
  description?: string | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreateDevice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDeviceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDeviceData {
  device_insert: Device_Key;
}
```
### Using `CreateDevice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDevice, CreateDeviceVariables } from '@rh-ponto/api-client/generated';

// The `CreateDevice` mutation requires an argument of type `CreateDeviceVariables`:
const createDeviceVars: CreateDeviceVariables = {
  name: ..., 
  identifier: ..., 
  type: ..., 
  locationName: ..., // optional
  description: ..., // optional
  isActive: ..., 
};

// Call the `createDevice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDevice(createDeviceVars);
// Variables can be defined inline as well.
const { data } = await createDevice({ name: ..., identifier: ..., type: ..., locationName: ..., description: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDevice(dataConnect, createDeviceVars);

console.log(data.device_insert);

// Or, you can use the `Promise` API.
createDevice(createDeviceVars).then((response) => {
  const data = response.data;
  console.log(data.device_insert);
});
```

### Using `CreateDevice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDeviceRef, CreateDeviceVariables } from '@rh-ponto/api-client/generated';

// The `CreateDevice` mutation requires an argument of type `CreateDeviceVariables`:
const createDeviceVars: CreateDeviceVariables = {
  name: ..., 
  identifier: ..., 
  type: ..., 
  locationName: ..., // optional
  description: ..., // optional
  isActive: ..., 
};

// Call the `createDeviceRef()` function to get a reference to the mutation.
const ref = createDeviceRef(createDeviceVars);
// Variables can be defined inline as well.
const ref = createDeviceRef({ name: ..., identifier: ..., type: ..., locationName: ..., description: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDeviceRef(dataConnect, createDeviceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.device_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.device_insert);
});
```

## UpdateDevice
You can execute the `UpdateDevice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateDevice(vars: UpdateDeviceVariables): MutationPromise<UpdateDeviceData, UpdateDeviceVariables>;

interface UpdateDeviceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDeviceVariables): MutationRef<UpdateDeviceData, UpdateDeviceVariables>;
}
export const updateDeviceRef: UpdateDeviceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDevice(dc: DataConnect, vars: UpdateDeviceVariables): MutationPromise<UpdateDeviceData, UpdateDeviceVariables>;

interface UpdateDeviceRef {
  ...
  (dc: DataConnect, vars: UpdateDeviceVariables): MutationRef<UpdateDeviceData, UpdateDeviceVariables>;
}
export const updateDeviceRef: UpdateDeviceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDeviceRef:
```typescript
const name = updateDeviceRef.operationName;
console.log(name);
```

### Variables
The `UpdateDevice` mutation requires an argument of type `UpdateDeviceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDeviceVariables {
  id: UUIDString;
  name?: string | null;
  identifier?: string | null;
  type?: string | null;
  locationName?: string | null;
  description?: string | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateDevice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDeviceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDeviceData {
  device_update?: Device_Key | null;
}
```
### Using `UpdateDevice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDevice, UpdateDeviceVariables } from '@rh-ponto/api-client/generated';

// The `UpdateDevice` mutation requires an argument of type `UpdateDeviceVariables`:
const updateDeviceVars: UpdateDeviceVariables = {
  id: ..., 
  name: ..., // optional
  identifier: ..., // optional
  type: ..., // optional
  locationName: ..., // optional
  description: ..., // optional
  isActive: ..., // optional
};

// Call the `updateDevice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDevice(updateDeviceVars);
// Variables can be defined inline as well.
const { data } = await updateDevice({ id: ..., name: ..., identifier: ..., type: ..., locationName: ..., description: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDevice(dataConnect, updateDeviceVars);

console.log(data.device_update);

// Or, you can use the `Promise` API.
updateDevice(updateDeviceVars).then((response) => {
  const data = response.data;
  console.log(data.device_update);
});
```

### Using `UpdateDevice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDeviceRef, UpdateDeviceVariables } from '@rh-ponto/api-client/generated';

// The `UpdateDevice` mutation requires an argument of type `UpdateDeviceVariables`:
const updateDeviceVars: UpdateDeviceVariables = {
  id: ..., 
  name: ..., // optional
  identifier: ..., // optional
  type: ..., // optional
  locationName: ..., // optional
  description: ..., // optional
  isActive: ..., // optional
};

// Call the `updateDeviceRef()` function to get a reference to the mutation.
const ref = updateDeviceRef(updateDeviceVars);
// Variables can be defined inline as well.
const ref = updateDeviceRef({ id: ..., name: ..., identifier: ..., type: ..., locationName: ..., description: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDeviceRef(dataConnect, updateDeviceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.device_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.device_update);
});
```

## DeactivateDevice
You can execute the `DeactivateDevice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
deactivateDevice(vars: DeactivateDeviceVariables): MutationPromise<DeactivateDeviceData, DeactivateDeviceVariables>;

interface DeactivateDeviceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeactivateDeviceVariables): MutationRef<DeactivateDeviceData, DeactivateDeviceVariables>;
}
export const deactivateDeviceRef: DeactivateDeviceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deactivateDevice(dc: DataConnect, vars: DeactivateDeviceVariables): MutationPromise<DeactivateDeviceData, DeactivateDeviceVariables>;

interface DeactivateDeviceRef {
  ...
  (dc: DataConnect, vars: DeactivateDeviceVariables): MutationRef<DeactivateDeviceData, DeactivateDeviceVariables>;
}
export const deactivateDeviceRef: DeactivateDeviceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deactivateDeviceRef:
```typescript
const name = deactivateDeviceRef.operationName;
console.log(name);
```

### Variables
The `DeactivateDevice` mutation requires an argument of type `DeactivateDeviceVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeactivateDeviceVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeactivateDevice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeactivateDeviceData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeactivateDeviceData {
  device_update?: Device_Key | null;
}
```
### Using `DeactivateDevice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deactivateDevice, DeactivateDeviceVariables } from '@rh-ponto/api-client/generated';

// The `DeactivateDevice` mutation requires an argument of type `DeactivateDeviceVariables`:
const deactivateDeviceVars: DeactivateDeviceVariables = {
  id: ..., 
};

// Call the `deactivateDevice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deactivateDevice(deactivateDeviceVars);
// Variables can be defined inline as well.
const { data } = await deactivateDevice({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deactivateDevice(dataConnect, deactivateDeviceVars);

console.log(data.device_update);

// Or, you can use the `Promise` API.
deactivateDevice(deactivateDeviceVars).then((response) => {
  const data = response.data;
  console.log(data.device_update);
});
```

### Using `DeactivateDevice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deactivateDeviceRef, DeactivateDeviceVariables } from '@rh-ponto/api-client/generated';

// The `DeactivateDevice` mutation requires an argument of type `DeactivateDeviceVariables`:
const deactivateDeviceVars: DeactivateDeviceVariables = {
  id: ..., 
};

// Call the `deactivateDeviceRef()` function to get a reference to the mutation.
const ref = deactivateDeviceRef(deactivateDeviceVars);
// Variables can be defined inline as well.
const ref = deactivateDeviceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deactivateDeviceRef(dataConnect, deactivateDeviceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.device_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.device_update);
});
```

## CreateWorkSchedule
You can execute the `CreateWorkSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createWorkSchedule(vars: CreateWorkScheduleVariables): MutationPromise<CreateWorkScheduleData, CreateWorkScheduleVariables>;

interface CreateWorkScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkScheduleVariables): MutationRef<CreateWorkScheduleData, CreateWorkScheduleVariables>;
}
export const createWorkScheduleRef: CreateWorkScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWorkSchedule(dc: DataConnect, vars: CreateWorkScheduleVariables): MutationPromise<CreateWorkScheduleData, CreateWorkScheduleVariables>;

interface CreateWorkScheduleRef {
  ...
  (dc: DataConnect, vars: CreateWorkScheduleVariables): MutationRef<CreateWorkScheduleData, CreateWorkScheduleVariables>;
}
export const createWorkScheduleRef: CreateWorkScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWorkScheduleRef:
```typescript
const name = createWorkScheduleRef.operationName;
console.log(name);
```

### Variables
The `CreateWorkSchedule` mutation requires an argument of type `CreateWorkScheduleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateWorkScheduleVariables {
  name: string;
  startTime: string;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
  endTime: string;
  toleranceMinutes: number;
  expectedDailyMinutes?: number | null;
  isActive: boolean;
}
```
### Return Type
Recall that executing the `CreateWorkSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWorkScheduleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWorkScheduleData {
  workSchedule_insert: WorkSchedule_Key;
}
```
### Using `CreateWorkSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWorkSchedule, CreateWorkScheduleVariables } from '@rh-ponto/api-client/generated';

// The `CreateWorkSchedule` mutation requires an argument of type `CreateWorkScheduleVariables`:
const createWorkScheduleVars: CreateWorkScheduleVariables = {
  name: ..., 
  startTime: ..., 
  breakStartTime: ..., // optional
  breakEndTime: ..., // optional
  endTime: ..., 
  toleranceMinutes: ..., 
  expectedDailyMinutes: ..., // optional
  isActive: ..., 
};

// Call the `createWorkSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWorkSchedule(createWorkScheduleVars);
// Variables can be defined inline as well.
const { data } = await createWorkSchedule({ name: ..., startTime: ..., breakStartTime: ..., breakEndTime: ..., endTime: ..., toleranceMinutes: ..., expectedDailyMinutes: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWorkSchedule(dataConnect, createWorkScheduleVars);

console.log(data.workSchedule_insert);

// Or, you can use the `Promise` API.
createWorkSchedule(createWorkScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.workSchedule_insert);
});
```

### Using `CreateWorkSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWorkScheduleRef, CreateWorkScheduleVariables } from '@rh-ponto/api-client/generated';

// The `CreateWorkSchedule` mutation requires an argument of type `CreateWorkScheduleVariables`:
const createWorkScheduleVars: CreateWorkScheduleVariables = {
  name: ..., 
  startTime: ..., 
  breakStartTime: ..., // optional
  breakEndTime: ..., // optional
  endTime: ..., 
  toleranceMinutes: ..., 
  expectedDailyMinutes: ..., // optional
  isActive: ..., 
};

// Call the `createWorkScheduleRef()` function to get a reference to the mutation.
const ref = createWorkScheduleRef(createWorkScheduleVars);
// Variables can be defined inline as well.
const ref = createWorkScheduleRef({ name: ..., startTime: ..., breakStartTime: ..., breakEndTime: ..., endTime: ..., toleranceMinutes: ..., expectedDailyMinutes: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWorkScheduleRef(dataConnect, createWorkScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workSchedule_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workSchedule_insert);
});
```

## UpdateWorkSchedule
You can execute the `UpdateWorkSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateWorkSchedule(vars: UpdateWorkScheduleVariables): MutationPromise<UpdateWorkScheduleData, UpdateWorkScheduleVariables>;

interface UpdateWorkScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateWorkScheduleVariables): MutationRef<UpdateWorkScheduleData, UpdateWorkScheduleVariables>;
}
export const updateWorkScheduleRef: UpdateWorkScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateWorkSchedule(dc: DataConnect, vars: UpdateWorkScheduleVariables): MutationPromise<UpdateWorkScheduleData, UpdateWorkScheduleVariables>;

interface UpdateWorkScheduleRef {
  ...
  (dc: DataConnect, vars: UpdateWorkScheduleVariables): MutationRef<UpdateWorkScheduleData, UpdateWorkScheduleVariables>;
}
export const updateWorkScheduleRef: UpdateWorkScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateWorkScheduleRef:
```typescript
const name = updateWorkScheduleRef.operationName;
console.log(name);
```

### Variables
The `UpdateWorkSchedule` mutation requires an argument of type `UpdateWorkScheduleVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateWorkScheduleVariables {
  id: UUIDString;
  name?: string | null;
  startTime?: string | null;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
  endTime?: string | null;
  toleranceMinutes?: number | null;
  expectedDailyMinutes?: number | null;
  isActive?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateWorkSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateWorkScheduleData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateWorkScheduleData {
  workSchedule_update?: WorkSchedule_Key | null;
}
```
### Using `UpdateWorkSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateWorkSchedule, UpdateWorkScheduleVariables } from '@rh-ponto/api-client/generated';

// The `UpdateWorkSchedule` mutation requires an argument of type `UpdateWorkScheduleVariables`:
const updateWorkScheduleVars: UpdateWorkScheduleVariables = {
  id: ..., 
  name: ..., // optional
  startTime: ..., // optional
  breakStartTime: ..., // optional
  breakEndTime: ..., // optional
  endTime: ..., // optional
  toleranceMinutes: ..., // optional
  expectedDailyMinutes: ..., // optional
  isActive: ..., // optional
};

// Call the `updateWorkSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateWorkSchedule(updateWorkScheduleVars);
// Variables can be defined inline as well.
const { data } = await updateWorkSchedule({ id: ..., name: ..., startTime: ..., breakStartTime: ..., breakEndTime: ..., endTime: ..., toleranceMinutes: ..., expectedDailyMinutes: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateWorkSchedule(dataConnect, updateWorkScheduleVars);

console.log(data.workSchedule_update);

// Or, you can use the `Promise` API.
updateWorkSchedule(updateWorkScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.workSchedule_update);
});
```

### Using `UpdateWorkSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateWorkScheduleRef, UpdateWorkScheduleVariables } from '@rh-ponto/api-client/generated';

// The `UpdateWorkSchedule` mutation requires an argument of type `UpdateWorkScheduleVariables`:
const updateWorkScheduleVars: UpdateWorkScheduleVariables = {
  id: ..., 
  name: ..., // optional
  startTime: ..., // optional
  breakStartTime: ..., // optional
  breakEndTime: ..., // optional
  endTime: ..., // optional
  toleranceMinutes: ..., // optional
  expectedDailyMinutes: ..., // optional
  isActive: ..., // optional
};

// Call the `updateWorkScheduleRef()` function to get a reference to the mutation.
const ref = updateWorkScheduleRef(updateWorkScheduleVars);
// Variables can be defined inline as well.
const ref = updateWorkScheduleRef({ id: ..., name: ..., startTime: ..., breakStartTime: ..., breakEndTime: ..., endTime: ..., toleranceMinutes: ..., expectedDailyMinutes: ..., isActive: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateWorkScheduleRef(dataConnect, updateWorkScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workSchedule_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workSchedule_update);
});
```

## AssignWorkScheduleToEmployee
You can execute the `AssignWorkScheduleToEmployee` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
assignWorkScheduleToEmployee(vars: AssignWorkScheduleToEmployeeVariables): MutationPromise<AssignWorkScheduleToEmployeeData, AssignWorkScheduleToEmployeeVariables>;

interface AssignWorkScheduleToEmployeeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignWorkScheduleToEmployeeVariables): MutationRef<AssignWorkScheduleToEmployeeData, AssignWorkScheduleToEmployeeVariables>;
}
export const assignWorkScheduleToEmployeeRef: AssignWorkScheduleToEmployeeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignWorkScheduleToEmployee(dc: DataConnect, vars: AssignWorkScheduleToEmployeeVariables): MutationPromise<AssignWorkScheduleToEmployeeData, AssignWorkScheduleToEmployeeVariables>;

interface AssignWorkScheduleToEmployeeRef {
  ...
  (dc: DataConnect, vars: AssignWorkScheduleToEmployeeVariables): MutationRef<AssignWorkScheduleToEmployeeData, AssignWorkScheduleToEmployeeVariables>;
}
export const assignWorkScheduleToEmployeeRef: AssignWorkScheduleToEmployeeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignWorkScheduleToEmployeeRef:
```typescript
const name = assignWorkScheduleToEmployeeRef.operationName;
console.log(name);
```

### Variables
The `AssignWorkScheduleToEmployee` mutation requires an argument of type `AssignWorkScheduleToEmployeeVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AssignWorkScheduleToEmployeeVariables {
  employeeId: UUIDString;
  workScheduleId: UUIDString;
  startDate: DateString;
  endDate?: DateString | null;
}
```
### Return Type
Recall that executing the `AssignWorkScheduleToEmployee` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignWorkScheduleToEmployeeData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignWorkScheduleToEmployeeData {
  employeeScheduleHistory_insert: EmployeeScheduleHistory_Key;
}
```
### Using `AssignWorkScheduleToEmployee`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignWorkScheduleToEmployee, AssignWorkScheduleToEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `AssignWorkScheduleToEmployee` mutation requires an argument of type `AssignWorkScheduleToEmployeeVariables`:
const assignWorkScheduleToEmployeeVars: AssignWorkScheduleToEmployeeVariables = {
  employeeId: ..., 
  workScheduleId: ..., 
  startDate: ..., 
  endDate: ..., // optional
};

// Call the `assignWorkScheduleToEmployee()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignWorkScheduleToEmployee(assignWorkScheduleToEmployeeVars);
// Variables can be defined inline as well.
const { data } = await assignWorkScheduleToEmployee({ employeeId: ..., workScheduleId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignWorkScheduleToEmployee(dataConnect, assignWorkScheduleToEmployeeVars);

console.log(data.employeeScheduleHistory_insert);

// Or, you can use the `Promise` API.
assignWorkScheduleToEmployee(assignWorkScheduleToEmployeeVars).then((response) => {
  const data = response.data;
  console.log(data.employeeScheduleHistory_insert);
});
```

### Using `AssignWorkScheduleToEmployee`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignWorkScheduleToEmployeeRef, AssignWorkScheduleToEmployeeVariables } from '@rh-ponto/api-client/generated';

// The `AssignWorkScheduleToEmployee` mutation requires an argument of type `AssignWorkScheduleToEmployeeVariables`:
const assignWorkScheduleToEmployeeVars: AssignWorkScheduleToEmployeeVariables = {
  employeeId: ..., 
  workScheduleId: ..., 
  startDate: ..., 
  endDate: ..., // optional
};

// Call the `assignWorkScheduleToEmployeeRef()` function to get a reference to the mutation.
const ref = assignWorkScheduleToEmployeeRef(assignWorkScheduleToEmployeeVars);
// Variables can be defined inline as well.
const ref = assignWorkScheduleToEmployeeRef({ employeeId: ..., workScheduleId: ..., startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignWorkScheduleToEmployeeRef(dataConnect, assignWorkScheduleToEmployeeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.employeeScheduleHistory_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.employeeScheduleHistory_insert);
});
```

