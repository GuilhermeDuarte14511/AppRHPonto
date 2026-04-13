# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listDevices, getDeviceById, createDevice, updateDevice, deactivateDevice, listEmployeeNotifications, markEmployeeNotificationAsRead, getEmployeeNotificationPreferences, updateEmployeeNotificationPreferences, listEmployeeDocuments } from '@rh-ponto/api-client/generated';


// Operation ListDevices: 
const { data } = await ListDevices(dataConnect);

// Operation GetDeviceById:  For variables, look at type GetDeviceByIdVars in ../index.d.ts
const { data } = await GetDeviceById(dataConnect, getDeviceByIdVars);

// Operation CreateDevice:  For variables, look at type CreateDeviceVars in ../index.d.ts
const { data } = await CreateDevice(dataConnect, createDeviceVars);

// Operation UpdateDevice:  For variables, look at type UpdateDeviceVars in ../index.d.ts
const { data } = await UpdateDevice(dataConnect, updateDeviceVars);

// Operation DeactivateDevice:  For variables, look at type DeactivateDeviceVars in ../index.d.ts
const { data } = await DeactivateDevice(dataConnect, deactivateDeviceVars);

// Operation ListEmployeeNotifications:  For variables, look at type ListEmployeeNotificationsVars in ../index.d.ts
const { data } = await ListEmployeeNotifications(dataConnect, listEmployeeNotificationsVars);

// Operation MarkEmployeeNotificationAsRead:  For variables, look at type MarkEmployeeNotificationAsReadVars in ../index.d.ts
const { data } = await MarkEmployeeNotificationAsRead(dataConnect, markEmployeeNotificationAsReadVars);

// Operation GetEmployeeNotificationPreferences:  For variables, look at type GetEmployeeNotificationPreferencesVars in ../index.d.ts
const { data } = await GetEmployeeNotificationPreferences(dataConnect, getEmployeeNotificationPreferencesVars);

// Operation UpdateEmployeeNotificationPreferences:  For variables, look at type UpdateEmployeeNotificationPreferencesVars in ../index.d.ts
const { data } = await UpdateEmployeeNotificationPreferences(dataConnect, updateEmployeeNotificationPreferencesVars);

// Operation ListEmployeeDocuments:  For variables, look at type ListEmployeeDocumentsVars in ../index.d.ts
const { data } = await ListEmployeeDocuments(dataConnect, listEmployeeDocumentsVars);


```