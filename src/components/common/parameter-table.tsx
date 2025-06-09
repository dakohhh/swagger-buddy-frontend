import { Body, Header, PathParameter, QueryParameter } from '@/lib/types';

interface ParameterTableProps {
  parameters: (Body | Header | PathParameter | QueryParameter)[];
  type: 'path' | 'query' | 'header' | 'body';
}

export function ParameterTable({ parameters, type }: ParameterTableProps) {
  if (parameters.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No {type} parameters defined
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="parameter-table">
        <thead>
          <tr>
            <th>Name</th>
            {('type' in parameters[0]) && <th>Type</th>}
            <th>Description</th>
            {('required' in parameters[0]) && <th>Required</th>}
          </tr>
        </thead>
        <tbody>
          {parameters.map((param) => (
            <tr key={param.id}>
              <td>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {param.name}
                </code>
              </td>
              
              {/* Type column (only for Body and Header) */}
              {'type' in param && (
                <td>
                  <span className="text-sm text-muted-foreground">
                    {param.type}
                  </span>
                </td>
              )}
              
              {/* Description column */}
              <td>
                <div className="text-sm">
                  {'descriptive_value' in param ? 
                    param.descriptive_value : 
                    'No description available'
                  }
                </div>
              </td>
              
              {/* Required column (only for Body and Header) */}
              {'required' in param && (
                <td>
                  <span 
                    className={`text-xs px-2 py-1 rounded ${
                      param.required 
                        ? 'bg-red-100 text-red-800 border border-red-300' 
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                  >
                    {param.required ? 'Required' : 'Optional'}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 