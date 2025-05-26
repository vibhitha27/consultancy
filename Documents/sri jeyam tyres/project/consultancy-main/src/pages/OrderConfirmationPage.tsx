import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, Calendar, Home, MapPin, Download, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  // In a real app, you would fetch the order details based on the orderId
  
  // Get current date and add 5 days for estimated delivery
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen pt-32 pb-20 bg-neutral-50">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-primary-500 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
            <p className="text-xl">Thank you for your purchase</p>
          </div>
          
          <div className="p-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-800 text-center">
                An email confirmation has been sent to your registered email address.
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <ShoppingBag className="h-5 w-5 text-primary-500 mr-2" />
                    <h3 className="font-medium">Order Details</h3>
                  </div>
                  <p className="text-neutral-600 mb-2">
                    <span className="font-medium">Order ID:</span> {orderId}
                  </p>
                  <p className="text-neutral-600 mb-2">
                    <span className="font-medium">Order Date:</span> {orderDate}
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-medium">Payment Method:</span> Cash on Delivery
                  </p>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Truck className="h-5 w-5 text-primary-500 mr-2" />
                    <h3 className="font-medium">Delivery Information</h3>
                  </div>
                  <p className="text-neutral-600 mb-2">
                    <span className="font-medium">Status:</span> Processing
                  </p>
                  <p className="text-neutral-600 mb-2">
                    <span className="font-medium">Estimated Delivery:</span> {formattedDeliveryDate}
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-medium">Shipping Method:</span> Standard Delivery
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 pt-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Track Your Order</h2>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 z-0"></div>
                
                <div className="relative z-10 flex mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center mr-4">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Confirmed</h3>
                    <p className="text-sm text-neutral-600">{orderDate}</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex mb-6">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mr-4">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Processing</h3>
                    <p className="text-sm text-neutral-600">Your order is being processed</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex mb-6">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mr-4">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Shipping</h3>
                    <p className="text-sm text-neutral-600">Your order will be shipped soon</p>
                  </div>
                </div>
                
                <div className="relative z-10 flex">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center mr-4">
                    <Home className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Delivered</h3>
                    <p className="text-sm text-neutral-600">Estimated by {formattedDeliveryDate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/" className="btn btn-primary">
                Continue Shopping
              </Link>
              <button className="btn btn-outline flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Invoice
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-neutral-50 p-3 rounded-lg">
              <div className="aspect-w-1 aspect-h-1 mb-3">
                <img 
                  src="https://rukminim2.flixcart.com/image/850/1000/l52sivk0/vehicle-tire/d/u/i/1-185-70-r14-88t-tl-zmv-mrf-original-imagfuhxqyhghmuy.jpeg?q=90" 
                  alt="MRF ZMV" 
                  className="w-full h-24 object-contain"
                />
              </div>
              <h3 className="font-medium mb-1">MRF ZMV</h3>
              <p className="text-sm text-neutral-600 mb-2">₹3,500</p>
              <Link to="/vehicles/car" className="text-sm text-primary-600 flex items-center hover:text-primary-700">
                View Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            
            <div className="bg-neutral-50 p-3 rounded-lg">
              <div className="aspect-w-1 aspect-h-1 mb-3">
                <img 
                  src="https://mrf.en.ecplaza.net/v6/s-ec/270-270/16-6162.jpg" 
                  alt="MRF ZVTV" 
                  className="w-full h-24 object-contain"
                />
              </div>
              <h3 className="font-medium mb-1">MRF ZVTV</h3>
              <p className="text-sm text-neutral-600 mb-2">₹4,200</p>
              <Link to="/vehicles/car" className="text-sm text-primary-600 flex items-center hover:text-primary-700">
                View Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            
            <div className="bg-neutral-50 p-3 rounded-lg">
              <div className="aspect-w-1 aspect-h-1 mb-3">
                <img 
                  src="https://m.media-amazon.com/images/I/61KYw95RBTL._SX466_.jpg" 
                  alt="MRF ZVTS" 
                  className="w-full h-24 object-contain"
                />
              </div>
              <h3 className="font-medium mb-1">MRF ZVTS</h3>
              <p className="text-sm text-neutral-600 mb-2">₹3,800</p>
              <Link to="/vehicles/car" className="text-sm text-primary-600 flex items-center hover:text-primary-700">
                View Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;