import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, totalItems, totalPrice, removeFromCart, updateQuantity, loading } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">Your Cart</h1>
          <p className="text-neutral-600">
            Review the items in your cart and proceed to checkout when you're ready.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <div className="flex justify-center mb-6">
              <ShoppingBag className="h-16 w-16 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any tyres to your cart yet. 
              Start browsing our collection to find the perfect tyres for your vehicle.
            </p>
            <Link to="/" className="btn btn-primary px-8">
              Browse Tyres
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Cart Items ({totalItems})</h2>
                  </div>
                </div>
                <div className="divide-y divide-neutral-200">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="p-6 flex flex-col sm:flex-row items-start gap-4"
                    >
                      <div className="bg-neutral-50 rounded-lg p-3 sm:w-24 sm:h-24 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-neutral-600">
                            {item.vehicleType.charAt(0).toUpperCase() + item.vehicleType.slice(1)} - {item.vehicleModel.charAt(0).toUpperCase() + item.vehicleModel.slice(1)}
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-neutral-100 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-neutral-100 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">₹{item.price} × {item.quantity}</span>
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <Link to="/" className="flex items-center text-primary-600 hover:text-primary-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax (18% GST)</span>
                    <span>₹{Math.round(totalPrice * 0.18)}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{Math.round(totalPrice * 1.18)}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Free delivery for orders above ₹5,000. Standard delivery charges apply otherwise.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn btn-primary w-full"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;