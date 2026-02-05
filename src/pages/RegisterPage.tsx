import RegisterForm from '../features/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
       <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
        <div className="mb-6">
          <h2 className="text-center text-2xl font-bold text-text">Create Account</h2>
          <p className="mt-2 text-center text-sm text-textSecondary">
            Join the community today
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
