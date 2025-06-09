export interface Project {
  id: string;
  name: string;
  base_url: string;
  sections: Section[];
}

export interface Section {
  id: string;
  project_id: string;
  name: string;
  description: string;
  endpoints: Endpoint[];
}

export interface Endpoint {
  id: string;
  section_id: string;
  name: string;
  url_of_endpoint: string;
  description: string;
  method: string;
  body: Body[];
  headers: Header[];
  path_parameters: PathParameter[];
  query_parameters: QueryParameter[];
  code_examples: CodeExample[];
}

export interface CodeExample {
  id: string;
  language: string;
  language_code: string;
  code: string;
}

export interface Body {
  id: string;
  endpoint_id: string;
  name: string;
  type: string;
  descriptive_value: string;
  required: boolean;
}

export interface Header {
  id: string;
  endpoint_id: string;
  name: string;
  type: string;
  descriptive_value: string;
  required: boolean;
}

export interface PathParameter {
  id: string;
  endpoint_id: string;
  name: string;
  descriptive_value: string;
}

export interface QueryParameter {
  id: string;
  endpoint_id: string;
  name: string;
  descriptive_value: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Backend wrapped response type
export interface BackendResponse<T> {
  message: string;
  status_code: number;
  data: T;
}

export interface CreateProjectRequest {
  project_name: string;
  base_url: string;
  swagger_url?: string;
  swagger_file?: File;
}

// UI specific types
export interface ProjectSummary {
  id: string;
  name: string;
  base_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface MethodColors {
  GET: string;
  POST: string;
  PUT: string;
  PATCH: string;
  DELETE: string;
  HEAD: string;
  OPTIONS: string;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export interface SearchState {
  query: string;
  method: string | null;
  section: string | null;
  results: Endpoint[];
}

// Form types
export interface FileUploadForm {
  projectName: string;
  file?: File;
  url?: string;
  baseUrl: string;
}

export interface EndpointTestRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
  body?: any;
} 