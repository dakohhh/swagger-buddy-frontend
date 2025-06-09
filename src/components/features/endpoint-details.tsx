'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MethodBadge } from '@/components/common/method-badge';
import { CodeBlock } from '@/components/common/code-block';
import { ParameterTable } from '@/components/common/parameter-table';
import { Project, Endpoint } from '@/lib/types';
import { formatEndpointUrl, copyToClipboard } from '@/lib/utils';
import { 
  Copy, 
  ExternalLink, 
  Play, 
  Code, 
  FileText,
  CheckCircle
} from 'lucide-react';

interface EndpointDetailsProps {
  endpoint: Endpoint;
  project: Project;
}

export function EndpointDetails({ endpoint, project }: EndpointDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'examples' | 'testing'>('overview');
  const [copied, setCopied] = useState<string | null>(null);

  const fullUrl = formatEndpointUrl(project.base_url, endpoint.url_of_endpoint);

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <MethodBadge method={endpoint.method} className="text-sm" />
            <h1 className="text-2xl font-bold">
              {endpoint.name || endpoint.url_of_endpoint}
            </h1>
          </div>
          
          {/* URL */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                    {endpoint.method.toUpperCase()}
                  </code>
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono flex-1 truncate">
                    {fullUrl}
                  </code>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(fullUrl, 'url')}
                  >
                    {copied === 'url' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {endpoint.description && (
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground">{endpoint.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'parameters', label: 'Parameters', icon: FileText },
            { id: 'examples', label: 'Code Examples', icon: Code },
            { id: 'testing', label: 'Try It Out', icon: Play },
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'ghost'}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={activeTab === id}
              onClick={() => setActiveTab(id as any)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Endpoint Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Method</h4>
                      <MethodBadge method={endpoint.method} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Endpoint</h4>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {endpoint.url_of_endpoint}
                      </code>
                    </div>
                  </div>
                  
                  {endpoint.description && (
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-muted-foreground">{endpoint.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {endpoint.path_parameters.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Path Parameters</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {endpoint.query_parameters.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Query Parameters</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {endpoint.headers.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Headers</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {endpoint.code_examples.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Code Examples</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-6">
              {/* Path Parameters */}
              {endpoint.path_parameters.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Path Parameters</CardTitle>
                    <CardDescription>
                      Parameters that are part of the URL path
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ParameterTable parameters={endpoint.path_parameters} type="path" />
                  </CardContent>
                </Card>
              )}

              {/* Query Parameters */}
              {endpoint.query_parameters.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Query Parameters</CardTitle>
                    <CardDescription>
                      Parameters sent as query string
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ParameterTable parameters={endpoint.query_parameters} type="query" />
                  </CardContent>
                </Card>
              )}

              {/* Headers */}
              {endpoint.headers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Headers</CardTitle>
                    <CardDescription>
                      Required and optional headers for this endpoint
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ParameterTable parameters={endpoint.headers} type="header" />
                  </CardContent>
                </Card>
              )}

              {/* Request Body */}
              {endpoint.body.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request Body</CardTitle>
                    <CardDescription>
                      The structure of the request body
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ParameterTable parameters={endpoint.body} type="body" />
                  </CardContent>
                </Card>
              )}

              {/* No Parameters Message */}
              {endpoint.path_parameters.length === 0 && 
               endpoint.query_parameters.length === 0 && 
               endpoint.headers.length === 0 && 
               endpoint.body.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No Parameters</CardTitle>
                    <CardDescription>
                      This endpoint doesn't require any parameters
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              {endpoint.code_examples.length > 0 ? (
                endpoint.code_examples.map((example) => (
                  <Card key={example.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{example.language}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(example.code, `example-${example.id}`)}
                        >
                          {copied === `example-${example.id}` ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock 
                        code={example.code} 
                        language={example.language_code} 
                      />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No Code Examples</CardTitle>
                    <CardDescription>
                      Code examples for this endpoint are not available yet
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'testing' && (
            <Card>
              <CardContent className="p-6 text-center">
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">Interactive Testing</CardTitle>
                <CardDescription className="mb-4">
                  Interactive API testing functionality coming soon
                </CardDescription>
                <Button disabled>
                  <Play className="mr-2 h-4 w-4" />
                  Try Request
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 