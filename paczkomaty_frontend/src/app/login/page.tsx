'use client'
import AuthLayout from '@/components/layout/auth-layout';
import LoginForm from '@/components/features/auth/login-form';
import { AuthHeader } from '@/components/features/auth/auth-header';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <AuthLayout>
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AuthHeader 
            title="Zaloguj się do konta"
            subtitle="Lub"
            linkText="zarejestruj się, jeśli nie masz konta"
            linkHref="/register"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <LoginForm />
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
