import VerifyEmailForm from '../features/auth/VerifyEmailForm';

const VerifyEmailPage = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
         <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-text">Verify Email</h2>
          <p className="mt-2 text-sm text-textSecondary">
            Enter the 6-digit code sent to your email.
          </p>
        </div>
        <VerifyEmailForm />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
