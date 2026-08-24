export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  marks: number;
  createdAt?: string;
  updatedAt?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiResponse<T = any> {
  success: boolean;
  count?: number;
  message?: string;
  data?: T;
  error?: string;
  details?: string[];
}

export interface TestResult {
  status: number;
  statusText: string;
  timeMs: number;
  data: any;
  method: HttpMethod;
  endpoint: string;
}
