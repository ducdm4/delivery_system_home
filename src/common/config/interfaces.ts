export interface LoginData {
  email: string;
  password: string;
  role: number;
}

export interface APIInfo {
  url: string;
  data?: any;
  method: string;
  header?: object;
}

export interface KeyStringValue {
  [key: string]: any;
}

export interface SuccessResponse {
  data: KeyStringValue;
  statusCode: number;
}

export interface FailedResponse {
  statusCode: number;
  error: string;
  message: string;
}
