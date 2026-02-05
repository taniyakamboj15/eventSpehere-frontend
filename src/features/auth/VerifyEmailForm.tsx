import Button from '../../components/Button';
import { useVerifyEmail } from '../../hooks/auth/useVerifyEmail';
import { UI_TEXT } from '../../constants/text.constants';

const VerifyEmailForm = () => {
  const { otp, setOtp, isLoading, error, handleSubmit, handleResend } = useVerifyEmail();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-error p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text">{UI_TEXT.AUTH_VERIFY_CODE_LABEL}</label>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder={UI_TEXT.AUTH_VERIFY_PLACEHOLDER}
          className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-[1em] font-mono"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full py-4 text-lg font-semibold"
        isLoading={isLoading}
      >
        {UI_TEXT.AUTH_VERIFY_BUTTON}
      </Button>

      <div className="text-center text-sm text-textSecondary">
        {UI_TEXT.AUTH_CODE_NOT_RECEIVED}{' '}
        <button 
          type="button"
          onClick={handleResend}
          className="text-primary hover:underline"
        >
          {UI_TEXT.AUTH_RESEND_CODE}
        </button>
      </div>
    </form>
  );
};

export default VerifyEmailForm;
