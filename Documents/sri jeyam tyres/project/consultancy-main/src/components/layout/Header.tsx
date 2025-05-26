import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    toggleDropdown();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu on route change
    setIsMenuOpen(false);
  }, [location]);

  const headerClass = isScrolled 
    ? 'bg-white shadow-md' 
    : 'bg-transparent';

  const textColor = isScrolled || isMenuOpen
    ? 'text-neutral-900'
    : location.pathname === '/'
      ? 'text-netutal-900'
      : 'text-neutral-900';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <img 
                src="/tyre-icon.svg" 
                alt="Sri Jeyam Tyres Logo" 
                className="h-10 w-10 mr-2"
              />
              <span className={`font-heading font-bold text-xl md:text-2xl ${textColor}`}>
                Sri Jeyam <span className="text-primary-500">Tyres</span>
              </span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>Home</Link>
            <Link to="/vehicles/car" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>Cars</Link>
            <Link to="/vehicles/bike" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>Bikes</Link>
            <Link to="/vehicles/truck" className={`${textColor} hover:text-primary-500 transition-colors font-medium`}>Truck</Link>
          </nav>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart icon */}
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className={`relative p-2 rounded-full hover:bg-neutral-100 transition-colors`}
              >
                <ShoppingCart className={`h-6 w-6 ${textColor}`} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            
            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-1 p-2 rounded-full hover:bg-neutral-100 transition-colors ${textColor}`}
                >
                  <User className="h-6 w-6" />
                  <span className="font-medium hidden lg:inline-block">{user?.username}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                    >
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 hover:text-primary-500"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-neutral-700 hover:bg-neutral-100 hover:text-primary-500"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={`font-medium ${textColor} hover:text-primary-500`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="relative p-2 mr-2"
              >
                <ShoppingCart className={`h-6 w-6 ${textColor}`} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md focus:outline-none"
            >
              {isMenuOpen ? (
                <X className={`h-6 w-6 ${textColor}`} />
              ) : (
                <Menu className={`h-6 w-6 ${textColor}`} />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="py-2 text-neutral-800 font-medium">Home</Link>
                <Link to="/vehicles/car" className="py-2 text-neutral-800 font-medium">Cars</Link>
                <Link to="/vehicles/bike" className="py-2 text-neutral-800 font-medium">Bikes</Link>
                <Link to="/vehicles/truck" className="py-2 text-neutral-800 font-medium">Commercial</Link>
                
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" className="py-2 text-neutral-800 font-medium">
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center py-2 text-neutral-800 font-medium"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-2">
                    <Link to="/login" className="py-2 text-neutral-800 font-medium">
                      Login
                    </Link>
                    <Link to="/signup" className="btn btn-primary">
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;