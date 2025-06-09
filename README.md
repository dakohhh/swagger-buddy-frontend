# Swagger Buddy

A modern, interactive web application that transforms Swagger/OpenAPI documentation into human-readable, interactive UI.

## 🚀 Features

- **📁 Multiple Upload Options**: Upload Swagger files directly or provide URLs
- **🎨 Beautiful UI**: Clean, responsive design optimized for developers
- **🔍 Smart Search**: Find endpoints quickly with intelligent search and filtering
- **💻 Code Examples**: Syntax-highlighted code snippets in multiple languages
- **📱 Interactive Testing**: Test API endpoints directly from the documentation
- **⚡ Fast Performance**: Optimized for large API documentations
- **🌙 Modern Design**: Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom components
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Code Highlighting**: Prism.js
- **State Management**: React hooks

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Backend API server running on `http://localhost:8000/v1` (configurable)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd swagger-buddy/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/v1
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── projects/          # Project management pages
│   ├── upload/            # Upload page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # Basic UI components (shadcn/ui)
│   ├── common/            # Reusable components
│   └── features/          # Feature-specific components
├── lib/                   # Utility libraries
│   ├── api.ts             # API client
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks
└── styles/                # Global styles
```

## 🔗 API Integration

The application integrates with a REST API with the following endpoints:

- `POST /project/` - Create new project from Swagger file/URL
- `GET /project/` - Get all projects
- `GET /project/{id}` - Get detailed project with endpoints

### Data Models

```typescript
interface Project {
  id: string;
  name: string;
  base_url: string;
  sections: Section[];
}

interface Endpoint {
  id: string;
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
```

## 🎨 Features Overview

### File Upload
- Drag-and-drop file upload
- Support for JSON and YAML files
- URL input for remote Swagger files
- Real-time validation and progress tracking

### Project Dashboard
- Grid view of all projects
- Search and filter functionality
- Sort by name, date, or URL
- Quick actions for viewing and deleting projects

### Interactive Documentation
- Sidebar navigation with collapsible sections
- Endpoint details with parameters and examples
- Syntax-highlighted code examples
- Copy-to-clipboard functionality
- HTTP method badges with color coding

### Responsive Design
- Mobile-first approach
- Optimized for desktop and tablet viewing
- Clean typography and spacing
- Accessible UI components

## 🚀 Build and Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Production Build
```bash
npm run build
npm run start
```

## 🎯 Supported Formats

- **File Types**: JSON (.json), YAML (.yaml, .yml)
- **Specifications**: OpenAPI 2.0 & 3.x
- **Upload Methods**: Direct file upload or URL import
- **File Size**: Up to 10MB per file

## 🔧 Configuration

### API Configuration
Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend API server.

### Styling
The application uses Tailwind CSS with custom color schemes:
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js and TypeScript 