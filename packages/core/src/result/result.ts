import { AppError } from '../errors/app-error';

export type Success<TValue> = {
  readonly ok: true;
  readonly value: TValue;
};

export type Failure = {
  readonly ok: false;
  readonly error: AppError;
};

export type Result<TValue> = Success<TValue> | Failure;

export const success = <TValue>(value: TValue): Success<TValue> => ({
  ok: true,
  value,
});

export const failure = (error: AppError): Failure => ({
  ok: false,
  error,
});

