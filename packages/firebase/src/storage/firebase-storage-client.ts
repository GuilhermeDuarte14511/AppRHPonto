import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type FirebaseStorage,
} from 'firebase/storage';

import { getFirebaseApp } from '../firebase-app';

export interface UploadFilePayload {
  path: string;
  file: Blob | File | Uint8Array;
  contentType?: string;
}

export interface FirebaseStorageClient {
  uploadFile(payload: UploadFilePayload): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
}

const createBlobFromBytes = (file: Uint8Array, contentType?: string) =>
  {
    const arrayBuffer = new ArrayBuffer(file.byteLength);

    new Uint8Array(arrayBuffer).set(file);

    return new Blob([arrayBuffer], {
      type: contentType ?? 'application/octet-stream',
    });
  };

export class BrowserFirebaseStorageClient implements FirebaseStorageClient {
  private readonly storage: FirebaseStorage;

  constructor(envInput: unknown) {
    this.storage = getStorage(getFirebaseApp(envInput));
  }

  async uploadFile(payload: UploadFilePayload): Promise<string> {
    const storageRef = ref(this.storage, payload.path);
    const file =
      payload.file instanceof Uint8Array
        ? createBlobFromBytes(payload.file, payload.contentType)
        : payload.file;

    await uploadBytes(storageRef, file, payload.contentType ? { contentType: payload.contentType } : undefined);

    return getDownloadURL(storageRef);
  }

  async deleteFile(path: string): Promise<void> {
    await deleteObject(ref(this.storage, path));
  }

  async getFileUrl(path: string): Promise<string> {
    return getDownloadURL(ref(this.storage, path));
  }
}

let browserStorageClient: FirebaseStorageClient | null = null;

export const getBrowserFirebaseStorageClient = (envInput: unknown = process.env): FirebaseStorageClient => {
  if (!browserStorageClient) {
    browserStorageClient = new BrowserFirebaseStorageClient(envInput);
  }

  return browserStorageClient;
};
