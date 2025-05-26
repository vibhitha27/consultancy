import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const [isAdminSignup, setIsAdminSignup] = useState(false);
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormData>();
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  // For password confirmation validation
  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    try {
      if (isAdminSignup) {
        // Use admin signup endpoint
        const response = await fetch('http://localhost:5000/api/auth/admin-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Admin signup failed');
        }
        
        const result = await response.json();
        localStorage.setItem('token', result.token);
        navigate('/admin');
      } else {
        await signup(data.username, data.email, data.password);
        navigate('/');
      }
    } catch (error) {
      // Error handling is in AuthContext
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="flex w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Image Side */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{backgroundImage: "url('https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"}}>
          <div className="h-full w-full bg-primary-900/40 p-12 flex flex-col justify-end">
            <h2 className="text-white text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-white/80">
              Create an account to get personalized tyre recommendations, track your orders, and enjoy a seamless shopping experience.
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
              {isAdminSignup ? 'Admin Sign Up' : 'Sign Up'}
            </h1>
            <p className="text-neutral-600">
              {isAdminSignup 
                ? 'Create an admin account to manage the platform'
                : 'Create an account to get started'
              }
            </p>
          </div>

          {/* Admin/User Toggle */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setIsAdminSignup(!isAdminSignup)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              {isAdminSignup ? 'Switch to User Sign Up' : 'Switch to Admin Sign Up'}
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={`input ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="johndoe"
                {...register('username', { 
                  required: 'Username is required',
                  minLength: { 
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            
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
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`input ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Creating Account...' : isAdminSignup ? 'Create Admin Account' : 'Create Account'}
              </button>
            </div>
            
            {!isAdminSignup && (
              <div className="text-center mt-6">
                <p className="text-neutral-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                    Sign in
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

export default SignupPage;