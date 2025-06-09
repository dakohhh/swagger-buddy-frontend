import ms from "ms";
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Project,
  ProjectSummary,
  CreateProjectRequest,
  ApiResponse,
  BackendResponse,
} from './types';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    // Default to localhost if no environment variable is set
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    this.instance = axios.create({
      baseURL,
      timeout: ms("3m"),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false, // Explicitly set to false for CORS
    });

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Log API calls in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`API Call: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 404) {
          throw new Error('Resource not found');
        }
        if (error.response?.status === 500) {
          throw new Error('Internal server error');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout');
        }
        if (!error.response) {
          throw new Error('Network error - please check your connection and ensure the API server is running');
        }
        
        // Extract error message from response if available
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
    );
  }

  // Create a new project from Swagger file/URL
  async createProject(data: CreateProjectRequest): Promise<Project> {
    const formData = new FormData();
    formData.append('project_name', data.project_name);
    formData.append('base_url', data.base_url);
    
    if (data.swagger_file) {
      formData.append('swagger_file', data.swagger_file);
    }
    
    if (data.swagger_url) {
      formData.append('swagger_url', data.swagger_url);
    }

    const response = await this.instance.post<BackendResponse<Project>>('/v1/project/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data; // Extract data from wrapped response
  }

  // Get all projects
  async getProjects(): Promise<ProjectSummary[]> {
    const response = await this.instance.get<BackendResponse<ProjectSummary[]>>('/v1/project/');
    return response.data.data; // Extract data from wrapped response
  }

  // Get detailed project with all sections and endpoints
  async getProject(projectId: string): Promise<Project> {
    const response = await this.instance.get<BackendResponse<Project>>(`/v1/project/${projectId}`);
    return response.data.data; // Extract data from wrapped response
  }

  // Delete a project
  async deleteProject(projectId: string): Promise<void> {
    const response = await this.instance.delete<{
      message: string;
      status_code: number;
      data: null;
    }>(`/v1/project/${projectId}`);
    
    // Validate the response
    if (response.data.status_code !== 200) {
      throw new Error(response.data.message || 'Failed to delete project');
    }
  }

  // Upload with progress tracking
  async createProjectWithProgress(
    data: CreateProjectRequest,
    onProgress?: (progress: number) => void
  ): Promise<Project> {
    const formData = new FormData();
    formData.append('project_name', data.project_name);
    formData.append('base_url', data.base_url);
    
    if (data.swagger_file) {
      formData.append('swagger_file', data.swagger_file);
    }
    
    if (data.swagger_url) {
      formData.append('swagger_url', data.swagger_url);
    }

    const response = await this.instance.post<BackendResponse<Project>>('/v1/project/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return response.data.data; // Extract data from wrapped response
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Helper functions for easier usage
export const api = {
  projects: {
    create: (data: CreateProjectRequest) => apiClient.createProject(data),
    createWithProgress: (
      data: CreateProjectRequest,
      onProgress?: (progress: number) => void
    ) => apiClient.createProjectWithProgress(data, onProgress),
    getAll: () => apiClient.getProjects(),
    getById: (id: string) => apiClient.getProject(id),
    delete: (id: string) => apiClient.deleteProject(id),
  },
};

export default apiClient; 