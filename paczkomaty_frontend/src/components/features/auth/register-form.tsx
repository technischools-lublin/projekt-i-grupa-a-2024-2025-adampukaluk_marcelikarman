'use client';

import { useState, FormEvent, ChangeEvent} from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  form: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    form: '',
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    // Special handling for password confirmation
    if (name === 'confirmPassword' && formData.password !== value) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Hasła nie są identyczne' }));
    } else if (name === 'confirmPassword') {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
    
    // Update password strength when password changes
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  // Validate form before submission
  const validate = () => {
    const newErrors: FormErrors = {
      form: '',
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
    };
    
    if (!formData.username.trim()) {
      newErrors.username = 'Login jest wymagany';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Login musi mieć co najmniej 4 znaki';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Niepoprawny format adresu email';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Imię jest wymagane';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Nazwisko jest wymagane';
    }
    
    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Hasło jest za słabe';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Potwierdzenie hasła jest wymagane';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors((prev) => ({ ...prev, form: '' }));
    
    try {
      // Prepare data for API - remove confirmPassword
      const apiData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      };
      
      const response = await fetch('http://127.0.0.1:8000/api/user/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific field errors from the API
        if (errorData.username) {
          setErrors(prev => ({ ...prev, username: errorData.username[0] }));
        }
        if (errorData.email) {
          setErrors(prev => ({ ...prev, email: errorData.email[0] }));
        }
        if (errorData.password) {
          setErrors(prev => ({ ...prev, password: errorData.password[0] }));
        }
        if (errorData.non_field_errors) {
          throw new Error(errorData.non_field_errors[0]);
        }
        
        throw new Error(errorData.detail || 'Błąd rejestracji');
      }

      // const data = await response.json();
      
      // Registration successful, redirect to login page with success message
      router.push('/login?registered=true');
    } catch (error) {
      const err = error as Error;
      setErrors((prev) => ({ 
        ...prev, 
        form: err.message || 'Nie udało się utworzyć konta'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {errors.form && (
          <motion.div 
            className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              {errors.form}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Input
            id="username"
            name="username"
            type="text"
            label="Login"
            placeholder="Wprowadź swój login"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
            autoComplete="username"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Wprowadź swój adres email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
          />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Input
            id="first_name"
            name="first_name"
            type="text"
            label="Imię"
            placeholder="Wprowadź swoje imię"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            required
            autoComplete="given-name"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Input
            id="last_name"
            name="last_name"
            type="text"
            label="Nazwisko"
            placeholder="Wprowadź swoje nazwisko"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            required
            autoComplete="family-name"
          />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <PasswordInput
          id="password"
          name="password"
          label="Hasło"
          placeholder="Wprowadź hasło (min. 8 znaków)"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          autoComplete="new-password"
        />
        
        {/* Password strength indicator */}
        {formData.password && (
          <motion.div 
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                <div 
                  className={`h-full ${
                    passwordStrength <= 1 ? 'bg-red-500' : 
                    passwordStrength <= 2 ? 'bg-yellow-500' : 
                    passwordStrength <= 3 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${passwordStrength * 20}%` }}
                />
              </div>
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 min-w-[70px]">
                {passwordStrength <= 1 ? 'Bardzo słabe' : 
                passwordStrength <= 2 ? 'Słabe' : 
                passwordStrength <= 3 ? 'Średnie' : 
                passwordStrength <= 4 ? 'Dobre' : 'Silne'}
              </span>
            </div>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              Dobre hasło zawiera wielkie i małe litery, cyfry oraz znaki specjalne
            </p>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Powtórz hasło"
          placeholder="Potwierdź swoje hasło"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex items-center"
      >
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          Akceptuję <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">regulamin</a> i <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">politykę prywatności</a>
        </label>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button 
          type="submit" 
          className="w-full flex justify-center" 
          disabled={isLoading}
          onClick={() => {}}
        >
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center"
            >
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Tworzenie konta...
            </motion.div>
          ) : (
            'Zarejestruj się'
          )}
        </Button>
      </motion.div>
      
      <motion.div 
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Masz już konto?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Zaloguj się
          </a>
        </p>
      </motion.div>
    </motion.form>
  );
}