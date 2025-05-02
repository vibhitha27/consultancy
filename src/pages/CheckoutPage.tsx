import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Tag, CreditCard, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod';
}

const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverPort, setServerPort] = useState(5000);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<CheckoutFormData>({
    defaultValues: {
      fullName: user?.username || '',
      email: user?.email || '',
      paymentMethod: 'cod',
    }
  });

  // Fetch the current server port on component mount
  useEffect(() => {
    const fetchServerPort = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/server-port');
        setServerPort(response.data.port);
      } catch (error) {
        console.error('Error fetching server port:', error);
        // If port 5000 fails, try port 5001
        try {
          const response = await axios.get('http://localhost:5001/api/server-port');
          setServerPort(response.data.port);
        } catch (error) {
          console.error('Error fetching server port from backup:', error);
        }
      }
    };
    fetchServerPort();
  }, []);

  const submitOrder = async (port: number, data: CheckoutFormData) => {
    try {
      // Log the form data for debugging
      console.log('Form data:', data);
      console.log('Cart items:', cartItems);

      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: Math.round(totalPrice * 1.18),
        shippingAddress: {
          fullName: data.fullName,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          phone: data.phone
        },
        paymentMethod: data.paymentMethod,
        userId: user?._id
      };

      // Log the final order data for debugging
      console.log('Order data being sent:', orderData);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`http://localhost:${port}/api/orders`, orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('CONNECTION_ERROR');
      }
      throw error;
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Add items before checkout.');
      return;
    }

    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Your session has expired. Please login again.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      try {
        // Try the current server port first
        response = await submitOrder(serverPort, data);
      } catch (error: any) {
        if (error.message === 'CONNECTION_ERROR') {
          // If current port fails, try the next port
          response = await submitOrder(serverPort + 1, data);
        } else {
          throw error;
        }
      }
      
      if (!response) {
        throw new Error('Failed to get response from server');
      }

      // Send order confirmation email
      try {
        const emailResponse = await axios.post(
          `http://localhost:${serverPort}/api/orders/send-confirmation`,
          {
            customerEmail: data.email,
            orderDetails: {
              orderId: response.data._id,
              products: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              total: Math.round(totalPrice * 1.18),
              estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Order confirmation email sent successfully');
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the order if email sending fails
      }
      
      // Clear the cart
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${response.data._id}`);
    } catch (error: any) {
      console.error('Error placing order:', error);
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error.message === 'CONNECTION_ERROR') {
        errorMessage = 'Unable to connect to the server. Please make sure the server is running.';
      } else if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          // Validation error from server
          if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
            // Show each validation error in a separate toast
            error.response.data.errors.forEach((err: string) => {
              toast.error(err);
            });
            return; // Return early since we've shown all validation errors
          }
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please login again.';
          navigate('/login');
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subTotal = totalPrice;
  const tax = Math.round(subTotal * 0.18);
  const total = subTotal + tax;
  
  // Determine if shipping is free
  const isShippingFree = subTotal >= 5000;
  const shippingCost = isShippingFree ? 0 : 200;
  const finalTotal = total + (isShippingFree ? 0 : shippingCost);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-neutral-50">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">Checkout</h1>
          <p className="text-neutral-600">
            Complete your order by providing your shipping and payment details.
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Shipping & Payment Form */}
            <div className="lg:w-2/3 space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-6">
                  <MapPin className="h-5 w-5 text-primary-500 mr-3" />
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      className={`input ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="John Doe"
                      {...register('fullName', { required: 'Full name is required' })}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
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
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-neutral-500 bg-neutral-50 rounded-l-lg border border-r-0 border-neutral-300">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      className={`input rounded-l-none ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="9876543210"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: { 
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number'
                        }
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    className={`input ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="123 Main Street"
                    {...register('address', { required: 'Address is required' })}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      className={`input ${errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Chennai"
                      {...register('city', { required: 'City is required' })}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      className={`select ${errors.state ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('state', { required: 'State is required' })}
                    >
                      <option value="">Select State</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      {/* Add more states as needed */}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-neutral-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      className={`input ${errors.pincode ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="600001"
                      {...register('pincode', { 
                        required: 'PIN code is required',
                        pattern: { 
                          value: /^[0-9]{6}$/,
                          message: 'Please enter a valid 6-digit PIN code'
                        }
                      })}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-6">
                  <CreditCard className="h-5 w-5 text-primary-500 mr-3" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      value="cod"
                      className="h-4 w-4 text-primary-500"
                      {...register('paymentMethod')}
                      defaultChecked
                    />
                    <label htmlFor="cod" className="ml-3">
                      <span className="block font-medium">Cash on Delivery</span>
                      <span className="block text-sm text-neutral-600">Pay when you receive your order</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6 sticky top-24"
              >
                <div className="flex items-center mb-6">
                  <Tag className="h-5 w-5 text-primary-500 mr-3" />
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                
                <div className="border-b border-neutral-200 pb-4 mb-4">
                  <p className="font-medium mb-2">Order Items ({totalItems})</p>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-neutral-50 rounded p-1 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-neutral-600">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>₹{subTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    {isShippingFree ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span>₹{shippingCost}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax (18% GST)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;