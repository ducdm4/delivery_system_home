export interface LoginData {
  email: string;
  password: string;
  role: number;
}

export interface APIInfo {
  url: string;
  data?: any;
  method: string;
  header?: KeyValue;
}

export interface KeyValue {
  [key: string]: any;
}

export interface SuccessResponse {
  data: KeyValue;
  statusCode: number;
}

export interface FailedResponse {
  statusCode: number;
  error: string;
  message: string;
}

export interface contactInputRef {
  submitContact: () => boolean;
  saveData: () => void;
}

export interface addressInputRef {
  submitAddress: () => boolean;
  saveData: () => void;
}
