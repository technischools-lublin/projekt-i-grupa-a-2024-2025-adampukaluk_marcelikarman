'use client'

import AuthLayout from '@/components/layout/auth-layout';
import RegisterForm from '@/components/features/auth/register-form';
import { AuthHeader } from '@/components/features/auth/auth-header';
import { motion } from 'framer-motion';

export default function RegisterPage() {
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
            title="Utwórz nowe konto"
            subtitle="Lub"
            linkText="zaloguj się, jeśli masz już konto"
            linkHref="/login"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <RegisterForm />
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}