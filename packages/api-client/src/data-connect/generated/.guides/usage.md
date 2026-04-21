# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listTimeRecords, getTimeRecordById, listTimeRecordPhotos, createTimeRecord, adjustTimeRecord, createTimeRecordPhoto, listAttendancePolicies, listWorkLocations, listEmployeeAttendancePolicies, listEmployeeAllowedLocations } from '@rh-ponto/api-client/generated';


// Operation ListTimeRecords: 
const { data } = await ListTimeRecords(dataConnect);

// Operation GetTimeRecordById:  For variables, look at type GetTimeRecordByIdVars in ../index.d.ts
const { data } = await GetTimeRecordById(dataConnect, getTimeRecordByIdVars);

// Operation ListTimeRecordPhotos: 
const { data } = await ListTimeRecordPhotos(dataConnect);

// Operation CreateTimeRecord:  For variables, look at type CreateTimeRecordVars in ../index.d.ts
const { data } = await CreateTimeRecord(dataConnect, createTimeRecordVars);

// Operation AdjustTimeRecord:  For variables, look at type AdjustTimeRecordVars in ../index.d.ts
const { data } = await AdjustTimeRecord(dataConnect, adjustTimeRecordVars);

// Operation CreateTimeRecordPhoto:  For variables, look at type CreateTimeRecordPhotoVars in ../index.d.ts
const { data } = await CreateTimeRecordPhoto(dataConnect, createTimeRecordPhotoVars);

// Operation ListAttendancePolicies: 
const { data } = await ListAttendancePolicies(dataConnect);

// Operation ListWorkLocations: 
const { data } = await ListWorkLocations(dataConnect);

// Operation ListEmployeeAttendancePolicies: 
const { data } = await ListEmployeeAttendancePolicies(dataConnect);

// Operation ListEmployeeAllowedLocations: 
const { data } = await ListEmployeeAllowedLocations(dataConnect);


```