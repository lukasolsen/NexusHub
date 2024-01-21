export interface Variable {
  name: string;
  type: string;
  description: string;
}

export interface NationalArchivesPath {
  name: string;
  path: string;
  variables?: Variable[];
}

export interface APIResponse<T> {
  code: keyof typeof Codes;
  data: T;
}

export enum Codes {
  "OK" = 200,
  "Bad Request" = 400,
  "Not Found" = 404,
  "Internal Server Error" = 500,
  "Gateway Timeout" = 504,
  "Unauthorized" = 401,
  "Conflict" = 409,
}