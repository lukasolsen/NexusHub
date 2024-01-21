import { APIResponse, Codes } from "../types/response";

export const createApiResponse = <T>(
  code: keyof typeof Codes,
  data: T
): APIResponse<T> => {
  const response: APIResponse<T> = {
    code,
    data,
  };

  return response;
};
