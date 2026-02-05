import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useLogin } from '../../hooks/auth/useLogin';
import { UI_TEXT } from '../../constants/text.constants';

const LoginForm = () => {
  const { form, serverError, onSubmit } = useLogin();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="bg-red-50 text-error p-3 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}
      
      <Input
        label={UI_TEXT.AUTH_EMAIL_LABEL}
        name="email"
        type="email"
        register={register}
        error={errors.email}
        placeholder={UI_TEXT.AUTH_EMAIL_PLACEHOLDER}
      />
      
      <Input
        label={UI_TEXT.AUTH_PASSWORD_LABEL}
        name="password"
        type="password"
        register={register}
        error={errors.password}
        placeholder={UI_TEXT.AUTH_PASSWORD_PLACEHOLDER}
      />
      
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        {UI_TEXT.AUTH_SIGN_IN_BUTTON}
      </Button>
      
      <div className="text-center text-sm text-textSecondary mt-4">
        {UI_TEXT.AUTH_NO_ACCOUNT}{' '}
        <Link to={ROUTES.REGISTER} className="text-primary hover:underline">
          {UI_TEXT.AUTH_CREATE_ONE}
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
