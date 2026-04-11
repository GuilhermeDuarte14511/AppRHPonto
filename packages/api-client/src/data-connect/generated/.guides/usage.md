# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, listDevices, getDeviceById, createDevice, updateDevice, deactivateDevice } from '@rh-ponto/api-client/generated';


// Operation ListDepartments: 
const { data } = await ListDepartments(dataConnect);

// Operation GetDepartmentById:  For variables, look at type GetDepartmentByIdVars in ../index.d.ts
const { data } = await GetDepartmentById(dataConnect, getDepartmentByIdVars);

// Operation CreateDepartment:  For variables, look at type CreateDepartmentVars in ../index.d.ts
const { data } = await CreateDepartment(dataConnect, createDepartmentVars);

// Operation UpdateDepartment:  For variables, look at type UpdateDepartmentVars in ../index.d.ts
const { data } = await UpdateDepartment(dataConnect, updateDepartmentVars);

// Operation DeleteDepartment:  For variables, look at type DeleteDepartmentVars in ../index.d.ts
const { data } = await DeleteDepartment(dataConnect, deleteDepartmentVars);

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


```