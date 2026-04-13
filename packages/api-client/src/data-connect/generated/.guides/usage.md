# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listAttendancePolicies, listWorkLocations, listEmployeeAttendancePolicies, listEmployeeAllowedLocations, createAttendancePolicy, updateAttendancePolicy, createWorkLocation, createEmployeeAttendancePolicy, updateEmployeeAttendancePolicy, addEmployeeAllowedLocation } from '@rh-ponto/api-client/generated';


// Operation ListAttendancePolicies: 
const { data } = await ListAttendancePolicies(dataConnect);

// Operation ListWorkLocations: 
const { data } = await ListWorkLocations(dataConnect);

// Operation ListEmployeeAttendancePolicies: 
const { data } = await ListEmployeeAttendancePolicies(dataConnect);

// Operation ListEmployeeAllowedLocations: 
const { data } = await ListEmployeeAllowedLocations(dataConnect);

// Operation CreateAttendancePolicy:  For variables, look at type CreateAttendancePolicyVars in ../index.d.ts
const { data } = await CreateAttendancePolicy(dataConnect, createAttendancePolicyVars);

// Operation UpdateAttendancePolicy:  For variables, look at type UpdateAttendancePolicyVars in ../index.d.ts
const { data } = await UpdateAttendancePolicy(dataConnect, updateAttendancePolicyVars);

// Operation CreateWorkLocation:  For variables, look at type CreateWorkLocationVars in ../index.d.ts
const { data } = await CreateWorkLocation(dataConnect, createWorkLocationVars);

// Operation CreateEmployeeAttendancePolicy:  For variables, look at type CreateEmployeeAttendancePolicyVars in ../index.d.ts
const { data } = await CreateEmployeeAttendancePolicy(dataConnect, createEmployeeAttendancePolicyVars);

// Operation UpdateEmployeeAttendancePolicy:  For variables, look at type UpdateEmployeeAttendancePolicyVars in ../index.d.ts
const { data } = await UpdateEmployeeAttendancePolicy(dataConnect, updateEmployeeAttendancePolicyVars);

// Operation AddEmployeeAllowedLocation:  For variables, look at type AddEmployeeAllowedLocationVars in ../index.d.ts
const { data } = await AddEmployeeAllowedLocation(dataConnect, addEmployeeAllowedLocationVars);


```