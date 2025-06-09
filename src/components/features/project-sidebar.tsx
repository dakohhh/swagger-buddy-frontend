'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { MethodBadge } from '@/components/common/method-badge';
import { Project, Endpoint, Section } from '@/lib/types';
import { cn, truncateText } from '@/lib/utils';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';

interface ProjectSidebarProps {
  project: Project;
  selectedEndpoint: Endpoint | null;
  onEndpointSelect: (endpoint: Endpoint) => void;
  searchQuery?: string;
}

interface SectionState {
  [sectionId: string]: boolean;
}

export function ProjectSidebar({ 
  project, 
  selectedEndpoint, 
  onEndpointSelect, 
  searchQuery = '' 
}: ProjectSidebarProps) {
  // Generate a stable component ID for unique keys
  const componentId = useMemo(() => Math.random().toString(36).substr(2, 9), []);
  
  // Simple state management - all sections start expanded
  const [expandedSections, setExpandedSections] = useState<SectionState>(() => {
    const initial: SectionState = {};
    project.sections.forEach(section => {
      initial[section.id] = true;
    });
    return initial;
  });

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return project.sections;
    }

    const query = searchQuery.toLowerCase();
    
    return project.sections
      .map(section => {
        const filteredEndpoints = section.endpoints.filter(endpoint =>
          endpoint.name.toLowerCase().includes(query) ||
          endpoint.url_of_endpoint.toLowerCase().includes(query) ||
          endpoint.description.toLowerCase().includes(query) ||
          endpoint.method.toLowerCase().includes(query)
        );
        
        return {
          ...section,
          endpoints: filteredEndpoints
        };
      })
      .filter(section => 
        section.endpoints.length > 0 || 
        section.name.toLowerCase().includes(query) ||
        section.description.toLowerCase().includes(query)
      );
  }, [project.sections, searchQuery]);

  const toggleSection = (sectionId: string) => {
    console.log('Toggling section:', sectionId, 'Current state:', expandedSections[sectionId]);
    setExpandedSections(prev => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId]
      };
      console.log('New state:', newState);
      return newState;
    });
  };

  const handleEndpointClick = (endpoint: Endpoint) => {
    onEndpointSelect(endpoint);
    
    // Ensure the section containing this endpoint is expanded
    const section = project.sections.find(s => s.id === endpoint.section_id);
    if (section && expandedSections[section.id] !== true) {
      setExpandedSections(prev => ({
        ...prev,
        [section.id]: true
      }));
    }
  };

  const totalEndpoints = project.sections.reduce((total, section) => total + section.endpoints.length, 0);
  const filteredEndpoints = filteredSections.reduce((total, section) => total + section.endpoints.length, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-1">API Documentation</h2>
        <div className="text-sm text-muted-foreground">
          {searchQuery ? (
            <span key="search-results-count">
              {filteredEndpoints} of {totalEndpoints} endpoints
            </span>
          ) : (
            <span key="total-count">
              {project.sections.length} sections • {totalEndpoints} endpoints
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {filteredSections.length === 0 ? (
          <div key="no-results" className="p-4 text-center text-muted-foreground">
            <p>No endpoints found matching your search.</p>
          </div>
        ) : (
          <nav key="sidebar-nav" className="sidebar-nav p-2">
            {filteredSections.map((section, index) => (
              <div key={`${componentId}-section-${section.id}-${index}`} className="mb-1">
                {/* Section Header */}
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto font-medium"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    {expandedSections[section.id] === true ? (
                      <div key={`${componentId}-${section.id}-expanded`} className="flex items-center space-x-2">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        <FolderOpen className="h-4 w-4 text-primary" />
                      </div>
                    ) : (
                      <div key={`${componentId}-${section.id}-collapsed`} className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-left truncate">
                        {section.name}
                      </div>
                      {section.description && (
                        <div key={`${componentId}-${section.id}-section-description`} className="text-xs text-muted-foreground text-left truncate">
                          {truncateText(section.description, 50)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {section.endpoints.length}
                    </span>
                  </div>
                </Button>

                {/* Endpoints */}
                {expandedSections[section.id] === true && (
                  <div key={`${componentId}-${section.id}-endpoints`} className="ml-4 space-y-1">
                    {section.endpoints.map((endpoint, endpointIndex) => (
                      <Button
                        key={`${componentId}-endpoint-${endpoint.id}-${endpointIndex}`}
                        variant="ghost"
                        className={cn(
                          'w-full justify-start p-2 h-auto text-left',
                          selectedEndpoint?.id === endpoint.id && 'bg-primary/10 border-l-2 border-primary'
                        )}
                        onClick={() => handleEndpointClick(endpoint)}
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <MethodBadge method={endpoint.method} />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {endpoint.name || endpoint.url_of_endpoint}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {endpoint.url_of_endpoint}
                            </div>
                            {endpoint.description && (
                              <div key={`${componentId}-${endpoint.id}-description`} className="text-xs text-muted-foreground truncate mt-1">
                                {truncateText(endpoint.description, 60)}
                              </div>
                            )}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Footer */}
      {searchQuery && (
        <div key="search-footer" className="p-4 border-t text-xs text-muted-foreground">
          <p>Use the search above to filter endpoints by name, URL, method, or description.</p>
        </div>
      )}
    </div>
  );
} 