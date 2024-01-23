import { APIResponse, Codes } from "../types/response";
import { hashSync, compare } from "bcrypt";

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

export const saltPassword = (password: string): string => {
  return hashSync(password, 10);
};

export const verifyPasswsord = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const result = await compare(password, hash);
  return result;
};
