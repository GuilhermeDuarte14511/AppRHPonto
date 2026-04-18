# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getPayrollClosureByReferenceKey, createPayrollClosure, updatePayrollClosure, listVacationRequests, getVacationRequestById, createVacationRequest, approveVacationRequest, rejectVacationRequest, listEmployeeNotifications, markEmployeeNotificationAsRead } from '@rh-ponto/api-client/generated';


// Operation GetPayrollClosureByReferenceKey:  For variables, look at type GetPayrollClosureByReferenceKeyVars in ../index.d.ts
const { data } = await GetPayrollClosureByReferenceKey(dataConnect, getPayrollClosureByReferenceKeyVars);

// Operation CreatePayrollClosure:  For variables, look at type CreatePayrollClosureVars in ../index.d.ts
const { data } = await CreatePayrollClosure(dataConnect, createPayrollClosureVars);

// Operation UpdatePayrollClosure:  For variables, look at type UpdatePayrollClosureVars in ../index.d.ts
const { data } = await UpdatePayrollClosure(dataConnect, updatePayrollClosureVars);

// Operation ListVacationRequests: 
const { data } = await ListVacationRequests(dataConnect);

// Operation GetVacationRequestById:  For variables, look at type GetVacationRequestByIdVars in ../index.d.ts
const { data } = await GetVacationRequestById(dataConnect, getVacationRequestByIdVars);

// Operation CreateVacationRequest:  For variables, look at type CreateVacationRequestVars in ../index.d.ts
const { data } = await CreateVacationRequest(dataConnect, createVacationRequestVars);

// Operation ApproveVacationRequest:  For variables, look at type ApproveVacationRequestVars in ../index.d.ts
const { data } = await ApproveVacationRequest(dataConnect, approveVacationRequestVars);

// Operation RejectVacationRequest:  For variables, look at type RejectVacationRequestVars in ../index.d.ts
const { data } = await RejectVacationRequest(dataConnect, rejectVacationRequestVars);

// Operation ListEmployeeNotifications:  For variables, look at type ListEmployeeNotificationsVars in ../index.d.ts
const { data } = await ListEmployeeNotifications(dataConnect, listEmployeeNotificationsVars);

// Operation MarkEmployeeNotificationAsRead:  For variables, look at type MarkEmployeeNotificationAsReadVars in ../index.d.ts
const { data } = await MarkEmployeeNotificationAsRead(dataConnect, markEmployeeNotificationAsReadVars);


```