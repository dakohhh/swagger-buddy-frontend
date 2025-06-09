'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectSummary } from '@/lib/types';
import { api } from '@/lib/api';
import { formatDate, truncateText } from '@/lib/utils';
import { 
  FileText, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  Calendar,
  Globe,
  Loader2
} from 'lucide-react';

interface ProjectCardProps {
  project: ProjectSummary;
  onDelete?: () => void;
  showActions?: boolean;
}

export function ProjectCard({ project, onDelete, showActions = true }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await api.projects.delete(project.id);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete project:', error);
      // You might want to show a toast notification here
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              {truncateText(project.name, 30)}
            </CardTitle>
          </div>
          {showActions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Actions could go here - dropdown menu, etc. */}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span className="truncate">{project.base_url}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Project metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>
                {project.created_at ? formatDate(project.created_at) : 'Created recently'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Project ID:</span>
              <code className="text-xs bg-muted px-1 rounded">
                {project.id.slice(0, 8)}...
              </code>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link href={`/projects/${project.id}`}>
              <Button variant="outline" size="sm" className="flex-1 mr-2">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Docs
              </Button>
            </Link>
            
            {showActions && (
              <div className="flex space-x-2">
                {!showDeleteConfirm ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelDelete}
                      disabled={isDeleting}
                      className="text-xs px-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 