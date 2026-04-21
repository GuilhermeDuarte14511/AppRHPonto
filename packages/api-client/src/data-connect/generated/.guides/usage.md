# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getUserByFirebaseUid, getUserByEmail, touchUserLastLogin, linkUserFirebaseUid, listEmployeeNotifications, markEmployeeNotificationAsRead, getEmployeeNotificationPreferences, updateEmployeeNotificationPreferences, getCurrentEmployeeByUserId, getCurrentEmployeeByEmail } from '@rh-ponto/api-client/generated';


// Operation GetUserByFirebaseUid:  For variables, look at type GetUserByFirebaseUidVars in ../index.d.ts
const { data } = await GetUserByFirebaseUid(dataConnect, getUserByFirebaseUidVars);

// Operation GetUserByEmail:  For variables, look at type GetUserByEmailVars in ../index.d.ts
const { data } = await GetUserByEmail(dataConnect, getUserByEmailVars);

// Operation TouchUserLastLogin:  For variables, look at type TouchUserLastLoginVars in ../index.d.ts
const { data } = await TouchUserLastLogin(dataConnect, touchUserLastLoginVars);

// Operation LinkUserFirebaseUid:  For variables, look at type LinkUserFirebaseUidVars in ../index.d.ts
const { data } = await LinkUserFirebaseUid(dataConnect, linkUserFirebaseUidVars);

// Operation ListEmployeeNotifications:  For variables, look at type ListEmployeeNotificationsVars in ../index.d.ts
const { data } = await ListEmployeeNotifications(dataConnect, listEmployeeNotificationsVars);

// Operation MarkEmployeeNotificationAsRead:  For variables, look at type MarkEmployeeNotificationAsReadVars in ../index.d.ts
const { data } = await MarkEmployeeNotificationAsRead(dataConnect, markEmployeeNotificationAsReadVars);

// Operation GetEmployeeNotificationPreferences:  For variables, look at type GetEmployeeNotificationPreferencesVars in ../index.d.ts
const { data } = await GetEmployeeNotificationPreferences(dataConnect, getEmployeeNotificationPreferencesVars);

// Operation UpdateEmployeeNotificationPreferences:  For variables, look at type UpdateEmployeeNotificationPreferencesVars in ../index.d.ts
const { data } = await UpdateEmployeeNotificationPreferences(dataConnect, updateEmployeeNotificationPreferencesVars);

// Operation GetCurrentEmployeeByUserId:  For variables, look at type GetCurrentEmployeeByUserIdVars in ../index.d.ts
const { data } = await GetCurrentEmployeeByUserId(dataConnect, getCurrentEmployeeByUserIdVars);

// Operation GetCurrentEmployeeByEmail:  For variables, look at type GetCurrentEmployeeByEmailVars in ../index.d.ts
const { data } = await GetCurrentEmployeeByEmail(dataConnect, getCurrentEmployeeByEmailVars);


```