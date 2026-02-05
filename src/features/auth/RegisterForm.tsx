import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useRegister } from '../../hooks/auth/useRegister';
import { UI_TEXT } from '../../constants/text.constants';

const RegisterForm = () => {
  const { form, serverError, onSubmit } = useRegister();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="bg-red-50 text-error p-3 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}
      
      <Input
        label={UI_TEXT.AUTH_NAME_LABEL}
        name="name"
        type="text"
        register={register}
        error={errors.name}
        placeholder={UI_TEXT.AUTH_NAME_PLACEHOLDER}
      />

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

      <Input
        label={UI_TEXT.AUTH_CONFIRM_PASSWORD_LABEL}
        name="confirmPassword"
        type="password"
        register={register}
        error={errors.confirmPassword}
        placeholder={UI_TEXT.AUTH_PASSWORD_PLACEHOLDER}
      />
      
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        {UI_TEXT.AUTH_SIGN_UP_BUTTON}
      </Button>
      
      <div className="text-center text-sm text-textSecondary mt-4">
        {UI_TEXT.AUTH_HAS_ACCOUNT}{' '}
        <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
          {UI_TEXT.AUTH_SIGN_IN_LINK}
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
