'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { validateSwaggerFile, validateUrl } from '@/lib/utils';
import { api } from '@/lib/api';
import { CreateProjectRequest } from '@/lib/types';
import { Upload, Link as LinkIcon, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onSuccess?: (projectId: string) => void;
}

export function FileUpload({ onSuccess }: FileUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [url, setUrl] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const validation = validateSwaggerFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const validateForm = (): string | null => {
    if (!projectName.trim()) {
      return 'Project name is required';
    }

    if (!baseUrl.trim()) {
      return 'Base URL is required';
    }

    const baseUrlValidation = validateUrl(baseUrl);
    if (!baseUrlValidation.valid) {
      return baseUrlValidation.error || 'Invalid base URL';
    }

    if (uploadType === 'file' && !selectedFile) {
      return 'Please select a file';
    }

    if (uploadType === 'url') {
      if (!url.trim()) {
        return 'Swagger URL is required';
      }
      const urlValidation = validateUrl(url);
      if (!urlValidation.valid) {
        return urlValidation.error || 'Invalid Swagger URL';
      }
    }

    return null;
  };

  const handleUpload = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const requestData: CreateProjectRequest = {
        project_name: projectName.trim(),
        base_url: baseUrl.trim(),
      };

      if (uploadType === 'file' && selectedFile) {
        requestData.swagger_file = selectedFile;
      } else if (uploadType === 'url') {
        requestData.swagger_url = url.trim();
      }

      const project = await api.projects.createWithProgress(
        requestData,
        (progress) => setProgress(progress)
      );

      setSuccess(true);
      setProgress(100);
      
      // Call success callback or navigate
      if (onSuccess) {
        onSuccess(project.id);
      } else {
        setTimeout(() => {
          router.push(`/projects/${project.id}`);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setProjectName('');
    setUrl('');
    setBaseUrl('');
    setError(null);
    setSuccess(false);
    setProgress(0);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Successful!</h3>
        <p className="text-muted-foreground mb-4">
          Your Swagger documentation has been processed successfully.
        </p>
        <Button onClick={resetForm} variant="outline">
          Upload Another
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Type Selection */}
      <div className="flex space-x-4">
        <Button
          variant={uploadType === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadType('file')}
          className="flex-1"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        <Button
          variant={uploadType === 'url' ? 'default' : 'outline'}
          onClick={() => setUploadType('url')}
          className="flex-1"
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          From URL
        </Button>
      </div>

      {/* Project Name Input */}
      <div className="space-y-2">
        <label htmlFor="projectName" className="text-sm font-medium">
          Project Name *
        </label>
        <Input
          id="projectName"
          type="text"
          placeholder="My API Project"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">
          A descriptive name for your API project
        </p>
      </div>

      {/* Base URL Input */}
      <div className="space-y-2">
        <label htmlFor="baseUrl" className="text-sm font-medium">
          Base URL *
        </label>
        <Input
          id="baseUrl"
          type="url"
          placeholder="https://api.example.com"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">
          The base URL of your API (e.g., https://api.example.com)
        </p>
      </div>

      {/* File Upload */}
      {uploadType === 'file' && (
        <div className="space-y-4">
          {!selectedFile ? (
            <div
              className={`upload-area ${isDragging ? 'dragover' : ''} cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                Drop your Swagger file here
              </p>
              <p className="text-muted-foreground mb-4">
                or click to browse (JSON, YAML)
              </p>
              <input
                type="file"
                accept=".json,.yaml,.yml"
                onChange={handleFileInputChange}
                className="hidden"
                ref={fileInputRef}
                disabled={isUploading}
              />
              <Button 
                variant="outline" 
                disabled={isUploading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose File
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* URL Input */}
      {uploadType === 'url' && (
        <div className="space-y-2">
          <label htmlFor="swaggerUrl" className="text-sm font-medium">
            Swagger URL *
          </label>
          <Input
            id="swaggerUrl"
            type="url"
            placeholder="https://api.example.com/swagger.json"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            Direct URL to your Swagger/OpenAPI JSON or YAML file
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={isUploading || !baseUrl.trim() || (uploadType === 'file' && !selectedFile) || (uploadType === 'url' && !url.trim())}
        className="w-full"
        size="lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Create Project
          </>
        )}
      </Button>
    </div>
  );
} 