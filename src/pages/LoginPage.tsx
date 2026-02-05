import LoginForm from '../features/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
        <div className="mb-6">
          <h2 className="text-center text-2xl font-bold text-text">Welcome Back</h2>
          <p className="mt-2 text-center text-sm text-textSecondary">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
