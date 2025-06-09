'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectCard } from '@/components/common/project-card';
import { api } from '@/lib/api';
import { ProjectSummary } from '@/lib/types';
import { debounce } from '@/lib/utils';
import { 
  Search, 
  Plus, 
  FolderOpen, 
  Loader2, 
  FileText,
  SortAsc,
  SortDesc
} from 'lucide-react';

type SortField = 'name' | 'created_at' | 'base_url';
type SortOrder = 'asc' | 'desc';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Debounced search to avoid excessive filtering
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      // Search logic is handled in filteredAndSortedProjects
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const allProjects = await api.projects.getAll();
        setProjects(allProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = projects.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.base_url.toLowerCase().includes(query) ||
        project.id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'base_url':
          aValue = a.base_url.toLowerCase();
          bValue = b.base_url.toLowerCase();
          break;
        case 'created_at':
          aValue = a.created_at || '';
          bValue = b.created_at || '';
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [projects, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleProjectDelete = (deletedProjectId: string) => {
    setProjects(projects.filter(p => p.id !== deletedProjectId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" suppressHydrationWarning>
        {/* Navigation */}
        <nav className="border-b" suppressHydrationWarning>
          <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
            <div className="flex items-center justify-between" suppressHydrationWarning>
              <Link href="/" className="flex items-center space-x-2" suppressHydrationWarning>
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Swagger Buddy</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20" suppressHydrationWarning>
          <div className="flex items-center justify-center" suppressHydrationWarning>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading projects...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Navigation */}
      <nav className="border-b" suppressHydrationWarning>
        <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
          <div className="flex items-center justify-between" suppressHydrationWarning>
            <Link href="/" className="flex items-center space-x-2" suppressHydrationWarning>
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Swagger Buddy</span>
            </Link>
            <div className="flex items-center space-x-4" suppressHydrationWarning>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/upload">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
        {/* Header */}
        <div className="mb-8" suppressHydrationWarning>
          <h1 className="text-3xl font-bold mb-2">Your Projects</h1>
          <p className="text-muted-foreground">
            Manage and view your Swagger documentation projects
          </p>
        </div>

        {error ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Projects Yet</CardTitle>
              <CardDescription className="mb-4">
                Upload your first Swagger file to get started with beautiful API documentation.
              </CardDescription>
              <Link href="/upload">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1"
                >
                  <span>Name</span>
                  {sortField === 'name' && (
                    sortOrder === 'asc' ? 
                      <SortAsc className="h-3 w-3" /> : 
                      <SortDesc className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('created_at')}
                  className="flex items-center space-x-1"
                >
                  <span>Date</span>
                  {sortField === 'created_at' && (
                    sortOrder === 'asc' ? 
                      <SortAsc className="h-3 w-3" /> : 
                      <SortDesc className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            {/* Projects Grid */}
            {filteredAndSortedProjects.length === 0 ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No projects found matching your search.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDelete={() => handleProjectDelete(project.id)}
                    />
                  ))}
                </div>
                
                {/* Results Summary */}
                <div className="text-center text-sm text-muted-foreground">
                  Showing {filteredAndSortedProjects.length} of {projects.length} projects
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 