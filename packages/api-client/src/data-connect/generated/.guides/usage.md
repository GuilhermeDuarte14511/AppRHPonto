# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listJustifications, getJustificationById, listJustificationAttachments, createJustification, approveJustification, rejectJustification, addJustificationAttachment, listVacationRequests, getVacationRequestById, createVacationRequest } from '@rh-ponto/api-client/generated';


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

// Operation RejectJustification:  For variables, look at type RejectJustificationVars in ../index.d.ts
const { data } = await RejectJustification(dataConnect, rejectJustificationVars);

// Operation AddJustificationAttachment:  For variables, look at type AddJustificationAttachmentVars in ../index.d.ts
const { data } = await AddJustificationAttachment(dataConnect, addJustificationAttachmentVars);

// Operation ListVacationRequests: 
const { data } = await ListVacationRequests(dataConnect);

// Operation GetVacationRequestById:  For variables, look at type GetVacationRequestByIdVars in ../index.d.ts
const { data } = await GetVacationRequestById(dataConnect, getVacationRequestByIdVars);

// Operation CreateVacationRequest:  For variables, look at type CreateVacationRequestVars in ../index.d.ts
const { data } = await CreateVacationRequest(dataConnect, createVacationRequestVars);


```