import AuthLayout from '@/components/layout/auth-layout';
import { AuthHeader } from '@/components/features/auth/auth-header';
// import RegisterForm from '@/components/features/auth/register-form'; // do implementacji

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="space-y-8">
        <AuthHeader 
          title="Utwórz nowe konto"
          subtitle="Lub"
          linkText="zaloguj się do istniejącego konta"
          linkHref="/login"
        />
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Formularza rejestracji jeszcze nie zaimplementowano
        </div>
        {/* <RegisterForm /> */}
      </div>
    </AuthLayout>
  );
}