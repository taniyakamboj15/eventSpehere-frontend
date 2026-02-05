import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <h1 className="text-center text-3xl font-extrabold text-primary">EventSphere</h1>
        <p className="mt-2 text-center text-sm text-textSecondary">
          Connect with your community
        </p>
      </div>
      
      {/* Outlet renders the page content (which is now its own card) */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
