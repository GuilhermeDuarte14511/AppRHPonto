import { AppError } from '../errors/app-error';

export const ensure = (condition: boolean, code: string, message: string): void => {
  if (!condition) {
    throw new AppError(code, message);
  }
};

