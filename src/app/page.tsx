import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/common/file-upload';
import { RecentProjects } from '@/components/features/recent-projects';
import { NoSSR } from '@/components/common/no-ssr';
import { FileText } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      {/* Navigation */}
      <nav className="border-b" suppressHydrationWarning>
        <div className="container mx-auto px-4 py-4" suppressHydrationWarning>
          <div className="flex items-center justify-between" suppressHydrationWarning>
            <div className="flex items-center space-x-2" suppressHydrationWarning>
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Swagger Buddy</span>
            </div>
            <div className="flex items-center space-x-4" suppressHydrationWarning>
              <Link href="/projects">
                <Button variant="ghost">Projects</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Upload Section */}
      <main className="container mx-auto px-4 py-12" suppressHydrationWarning>
        <div className="max-w-4xl mx-auto" suppressHydrationWarning>
          <div className="text-center mb-8" suppressHydrationWarning>
            <h1 className="text-3xl font-bold mb-4">Upload Your Swagger Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Transform your Swagger/OpenAPI files into interactive documentation
            </p>
          </div>
          
          <Card suppressHydrationWarning>
            <CardContent className="p-8" suppressHydrationWarning>
              <NoSSR>
                <FileUpload />
              </NoSSR>
            </CardContent>
          </Card>

          {/* Recent Projects Section */}
          {/* <div className="mt-12" suppressHydrationWarning>
            <div className="text-center mb-8" suppressHydrationWarning>
              <h2 className="text-2xl font-bold mb-2">Recent Projects</h2>
              <p className="text-muted-foreground">
                Quick access to your recently created documentation
              </p>
            </div>
            
            <NoSSR>
              <RecentProjects />
            </NoSSR>
          </div> */}
        </div>
      </main>
    </div>
  );
} 