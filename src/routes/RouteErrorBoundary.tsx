import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Our team has been notified.";
  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    const errorConfigs: Record<number, { title: string; message: string }> = {
      404: {
        title: "Page not found",
        message: "The page you looking for doesn't exist or has been moved."
      },
      401: {
        title: "Unauthorized",
        message: "You need to be logged in to access this page."
      },
      403: {
        title: "Forbidden",
        message: "You don't have permission to view this resource."
      }
    };

    const config = errorConfigs[status];
    if (config) {
      title = config.title;
      message = config.message;
    } else {
      title = error.statusText || title;
      message = error.data?.message || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-[2rem] border border-border shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-error" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-text">{status}: {title}</h1>
          <p className="text-textSecondary leading-relaxed italic">
            "{message}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button 
            className="flex-1 gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
        
        <p className="text-xs text-textSecondary uppercase tracking-widest font-bold opacity-50 pt-4">
          EventSphere System Error
        </p>
      </div>
    </div>
  );
};
