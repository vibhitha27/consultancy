import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 flex items-center justify-center px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-white rounded-lg shadow-md p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-neutral-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-700 mb-6">Page Not Found</h2>
        <p className="text-neutral-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
          Please check the URL or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="btn btn-primary flex items-center justify-center">
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;