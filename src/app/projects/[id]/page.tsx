'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProjectSidebar } from '@/components/features/project-sidebar';
import { EndpointDetails } from '@/components/features/endpoint-details';
import { DeleteProjectDialog } from '@/components/features/delete-project-dialog';
import { api } from '@/lib/api';
import { Project, Endpoint } from '@/lib/types';
import { FileText, ArrowLeft, Loader2, AlertCircle, Search, Trash2 } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        const projectData = await api.projects.getById(projectId);
        setProject(projectData);
        
        // Auto-select first endpoint if available
        if (projectData.sections.length > 0 && projectData.sections[0].endpoints.length > 0) {
          setSelectedEndpoint(projectData.sections[0].endpoints[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleDeleteProject = async () => {
    try {
      await api.projects.delete(projectId);
      router.push('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      // You might want to show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Swagger Buddy</span>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading project...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Swagger Buddy</span>
              </Link>
              <Link href="/projects">
                <Button variant="ghost">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="mb-2">Project Not Found</CardTitle>
              <CardDescription className="mb-4">
                {error || 'The requested project could not be found.'}
              </CardDescription>
              <Link href="/projects">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Swagger Buddy</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/projects">
                <Button variant="ghost">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Project Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
              <p className="text-muted-foreground">{project.base_url}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? 'Show' : 'Hide'} Navigation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-80 border-r bg-muted/20 h-[calc(100vh-140px)] overflow-y-auto">
            <ProjectSidebar
              project={project}
              selectedEndpoint={selectedEndpoint}
              onEndpointSelect={setSelectedEndpoint}
              searchQuery={searchQuery}
            />
          </div>
        )}
        
        {/* Main Content */}
        <div className={`flex-1 ${sidebarCollapsed ? '' : 'max-w-[calc(100vw-320px)]'}`}>
          {selectedEndpoint ? (
            <EndpointDetails
              endpoint={selectedEndpoint}
              project={project}
            />
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-140px)]">
              <Card className="max-w-md">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">Select an Endpoint</CardTitle>
                  <CardDescription>
                    Choose an endpoint from the sidebar to view its documentation
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {project && (
        <DeleteProjectDialog
          project={project}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDeleteProject}
        />
      )}
    </div>
  );
} 