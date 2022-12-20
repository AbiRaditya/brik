import { IResponseError } from './response.error.interface';

export const GlobalResponseError: (
  statusCode: number,
  message: [string],
  code: string,
) => IResponseError = (
  statusCode: number,
  message: [string],
  code: string,
): IResponseError => {
  return {
    statusCode: statusCode,
    message,
    code,
  };
};
