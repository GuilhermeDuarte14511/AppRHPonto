# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, listJustifications, getJustificationById, listJustificationAttachments, createJustification, approveJustification } from '@rh-ponto/api-client/generated';


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

// Operation ListJustifications: 
const { data } = await ListJustifications(dataConnect);

// Operation GetJustificationById:  For variables, look at type GetJustificationByIdVars in ../index.d.ts
const { data } = await GetJustificationById(dataConnect, getJustificationByIdVars);

// Operation ListJustificationAttachments: 
const { data } = await ListJustificationAttachments(dataConnect);

// Operation CreateJustification:  For variables, look at type CreateJustificationVars in ../index.d.ts
const { data } = await CreateJustification(dataConnect, createJustificationVars);

// Operation ApproveJustification:  For variables, look at type ApproveJustificationVars in ../index.d.ts
const { data } = await ApproveJustification(dataConnect, approveJustificationVars);


```