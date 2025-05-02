import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>();
  
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Effect to handle navigation after successful login
  useEffect(() => {
    if (!loading && user) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, loading, navigate, from]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Navigation will be handled by the useEffect
    } catch (error) {
      // Error handling is in AuthContext
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="flex w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Image Side */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: "url('https://images.pexels.com/photos/1131406/pexels-photo-1131406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"}}>
          <div className="h-full w-full bg-secondary-900/60 p-12 flex flex-col justify-end">
            <h2 className="text-white text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-white/80">
              Log in to your account to manage your orders, track deliveries, and access personalized tyre recommendations.
            </p>
          </div>
        </div>
        
        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-8 md:p-12"
        >
          <div className="text-center mb-8 md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
              {isAdminLogin ? 'Admin Sign In' : 'Sign In'}
            </h1>
            <p className="text-neutral-600">
              {isAdminLogin 
                ? 'Enter your admin credentials to access the dashboard'
                : 'Enter your credentials to access your account'
              }
            </p>
          </div>

          {/* Admin/User Toggle */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setIsAdminLogin(!isAdminLogin)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              {isAdminLogin ? 'Switch to User Login' : 'Switch to Admin Login'}
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="your@email.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { 
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                  Password
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                className={`input ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { 
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn btn-primary w-full"
              >
                {isSubmitting || loading ? 'Signing in...' : isAdminLogin ? 'Admin Sign In' : 'Sign In'}
              </button>
            </div>
            
            {!isAdminLogin && (
              <div className="text-center mt-6">
                <p className="text-neutral-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary-600 hover:text-primary-500 font-medium">
                    Sign up now
                  </Link>
                </p>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;