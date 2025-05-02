import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-600 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img src="/tyre-icon.svg" alt="Sri Jeyam Tyres Logo" className="h-8 w-8 mr-2" />
              <h3 className="text-xl font-bold text-white">Sri Jeyam Tyres</h3>
            </div>
            <p className="text-neutral-200 mb-6">
              Your trusted MRF-authorized distributor for all your tyre needs. Quality products and expert service since 1998.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" className="text-white hover:text-primary-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-neutral-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vehicles/car" className="text-neutral-200 hover:text-white transition-colors">
                  Car Tyres
                </Link>
              </li>
              <li>
                <Link to="/vehicles/bike" className="text-neutral-200 hover:text-white transition-colors">
                  Bike Tyres
                </Link>
              </li>
              <li>
                <Link to="/vehicles/truck" className="text-neutral-200 hover:text-white transition-colors">
                  Commercial Tyres
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-neutral-200 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Vehicle Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Vehicle Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/vehicles/car" className="text-neutral-200 hover:text-white transition-colors">
                  Cars
                </Link>
              </li>
              <li>
                <Link to="/vehicles/bike" className="text-neutral-200 hover:text-white transition-colors">
                  Bikes
                </Link>
              </li>
              <li>
                <Link to="/vehicles/scooter" className="text-neutral-200 hover:text-white transition-colors">
                  Scooters
                </Link>
              </li>
              <li>
                <Link to="/vehicles/bus" className="text-neutral-200 hover:text-white transition-colors">
                  Buses
                </Link>
              </li>
              <li>
                <Link to="/vehicles/truck" className="text-neutral-200 hover:text-white transition-colors">
                  Trucks
                </Link>
              </li>
              <li>
                <Link to="/vehicles/lorry" className="text-neutral-200 hover:text-white transition-colors">
                  Lorries
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-neutral-200">
                  300/151 A1,Salem Main Road,Near LMR Theatre,Namakkal<br />Tamil Nadu 637001, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <a href="tel:+9194422 44699" className="text-neutral-200 hover:text-white transition-colors">
                  +91 94874 28369
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <a href="mailto:srijeyamtyres06@gmail.com.com" className="text-neutral-200 hover:text-white transition-colors">
                  srijeyamtyres06@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-secondary-500 mt-12 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-300 text-sm">
            &copy; {new Date().getFullYear()} Sri Jeyam Tyres. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-neutral-300 text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-neutral-300 text-sm hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/shipping-policy" className="text-neutral-300 text-sm hover:text-white transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;