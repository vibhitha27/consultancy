import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  TruckIcon,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';

// Sample order data
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'COD' | 'Online';
  paymentStatus: 'Paid' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

// Sample data for the admin orders page
const dummyOrders: Order[] = [
  {
    id: 'ORD123456',
    customer: {
      name: 'Raj Kumar',
      email: 'raj.kumar@example.com',
      phone: '9876543210',
      address: '123 Main Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
    },
    items: [
      {
        id: 'ITEM001',
        name: 'MRF ZMV',
        price: 3500,
        quantity: 2,
        image: 'https://rukminim2.flixcart.com/image/850/1000/l52sivk0/vehicle-tire/d/u/i/1-185-70-r14-88t-tl-zmv-mrf-original-imagfuhxqyhghmuy.jpeg?q=90',
      },
      {
        id: 'ITEM002',
        name: 'MRF ZVTV',
        price: 4200,
        quantity: 1,
        image: 'https://mrf.en.ecplaza.net/v6/s-ec/270-270/16-6162.jpg',
      },
    ],
    totalAmount: 11200,
    status: 'Delivered',
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    createdAt: '2023-04-15',
    updatedAt: '2023-04-18',
  },
  {
    id: 'ORD123455',
    customer: {
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '9876543211',
      address: '456 Park Avenue',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
    items: [
      {
        id: 'ITEM003',
        name: 'MRF ZVTS',
        price: 3800,
        quantity: 1,
        image: 'https://m.media-amazon.com/images/I/61KYw95RBTL._SX466_.jpg',
      },
    ],
    totalAmount: 3800,
    status: 'Processing',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    createdAt: '2023-04-14',
    updatedAt: '2023-04-14',
  },
  {
    id: 'ORD123454',
    customer: {
      name: 'Vikram Patel',
      email: 'vikram.patel@example.com',
      phone: '9876543212',
      address: '789 Lake View',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
    items: [
      {
        id: 'ITEM004',
        name: 'MRF Perfinza',
        price: 5500,
        quantity: 1,
        image: 'https://storage.sg.content-cdn.io/in-resources/fc93e108-cca4-4dea-87ce-db318920bab2/Images/userimages/20210511-133010-MRF%20Perfinza%20product%20image.png',
      },
    ],
    totalAmount: 5500,
    status: 'Shipped',
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    createdAt: '2023-04-13',
    updatedAt: '2023-04-15',
  },
  {
    id: 'ORD123453',
    customer: {
      name: 'Anita Desai',
      email: 'anita.desai@example.com',
      phone: '9876543213',
      address: '101 Hill Road',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
    },
    items: [
      {
        id: 'ITEM005',
        name: 'MRF Nylogrip',
        price: 1800,
        quantity: 1,
        image: 'https://m.media-amazon.com/images/I/61KYw95RBTL._SX466_.jpg',
      },
      {
        id: 'ITEM006',
        name: 'MRF Super Grip',
        price: 2200,
        quantity: 1,
        image: 'https://5.imimg.com/data5/SELLER/Default/2021/12/UM/JZ/DT/22194002/mrf-2-wheeler-tyre-500x500.jpg',
      },
    ],
    totalAmount: 4000,
    status: 'Pending',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    createdAt: '2023-04-12',
    updatedAt: '2023-04-12',
  },
  {
    id: 'ORD123452',
    customer: {
      name: 'Suresh Menon',
      email: 'suresh.menon@example.com',
      phone: '9876543214',
      address: '202 Beach Road',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682001',
    },
    items: [
      {
        id: 'ITEM007',
        name: 'MRF ZMV',
        price: 3500,
        quantity: 2,
        image: 'https://rukminim2.flixcart.com/image/850/1000/l52sivk0/vehicle-tire/d/u/i/1-185-70-r14-88t-tl-zmv-mrf-original-imagfuhxqyhghmuy.jpeg?q=90',
      },
    ],
    totalAmount: 7000,
    status: 'Cancelled',
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    createdAt: '2023-04-11',
    updatedAt: '2023-04-12',
  },
];

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  const itemsPerPage = 4;
  
  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
                          order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                          order.customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };
  
  const closeOrderDetails = () => {
    setIsOrderDetailsOpen(false);
    setSelectedOrder(null);
  };
  
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, this would be an API call to update the order status
    // await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
    
    // Update orders state
    const updatedOrders = orders.map(order => 
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : order
    );
    
    setOrders(updatedOrders);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] });
    }
    
    toast.success(`Order status updated to ${newStatus}`);
  };
  
  // Get status badge color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Get payment status badge color
  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    return status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Manage Orders</h1>
            <p className="text-neutral-600">
              View and process customer orders from this dashboard.
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <a
              href="#"
              className="btn btn-outline flex items-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Export Orders
            </a>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-neutral-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select pl-10"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="text-neutral-600">
              Showing {paginatedOrders.length} of {filteredOrders.length} orders
            </div>
          </div>
        </div>
        
        {/* Orders List */}
        <div className="space-y-6">
          {paginatedOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="h-12 w-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
              <p className="text-neutral-600">
                There are no orders matching your search criteria. Try adjusting your filters.
              </p>
            </div>
          ) : (
            paginatedOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6 md:flex md:items-center md:justify-between">
                  <div className="flex flex-col mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-lg mr-3">{order.id}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600">
                      <p className="mb-1">
                        <span className="font-medium">Customer:</span> {order.customer.name}
                      </p>
                      <p className="mb-1">
                        <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span> ₹{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="select rounded-r-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        className="px-3 py-2.5 bg-primary-500 text-white rounded-r-lg hover:bg-primary-600 transition-colors"
                        onClick={() => updateOrderStatus(order.id, order.status)}
                      >
                        Update
                      </button>
                    </div>
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="btn btn-outline flex items-center justify-center"
                    >
                      View Details
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
                
                {/* Order Items Preview */}
                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="font-medium">Order Items:</div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded border border-neutral-200">
                          <div className="h-8 w-8 bg-white rounded flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-8 w-8 object-contain"
                            />
                          </div>
                          <span className="text-sm">{item.name} × {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="px-4 text-neutral-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Order Details Modal */}
      {isOrderDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                  onClick={closeOrderDetails}
                  className="p-1 rounded-full hover:bg-neutral-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Order Info */}
                <div className="lg:w-2/3 space-y-8">
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-neutral-600 mb-1">Order ID</p>
                          <p className="font-medium">{selectedOrder.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600 mb-1">Order Date</p>
                          <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600 mb-1">Status</p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600 mb-1">Last Updated</p>
                          <p className="font-medium">{new Date(selectedOrder.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600 mb-1">Payment Method</p>
                          <p className="font-medium">{selectedOrder.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600 mb-1">Payment Status</p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                            {selectedOrder.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="bg-neutral-50 rounded-lg overflow-hidden">
                      <div className="divide-y divide-neutral-200">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="p-4 flex items-center">
                            <div className="h-16 w-16 bg-white rounded mr-4 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-neutral-600">
                                ₹{item.price} × {item.quantity}
                              </p>
                            </div>
                            <div className="font-medium">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 border-t border-neutral-200 bg-white">
                        <div className="flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-medium">₹{selectedOrder.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Customer & Delivery Info */}
                <div className="lg:w-1/3 space-y-8">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                    <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-neutral-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{selectedOrder.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-neutral-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p>{selectedOrder.customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-neutral-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p>{selectedOrder.customer.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-neutral-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{selectedOrder.customer.name}</p>
                          <p className="text-neutral-700">{selectedOrder.customer.address}</p>
                          <p className="text-neutral-700">
                            {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                          </p>
                          <p className="text-neutral-700">{selectedOrder.customer.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 z-0"></div>
                        
                        <div className="relative z-10 flex mb-6">
                          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center mr-4">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">Order Placed</h4>
                            <p className="text-sm text-neutral-600">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="relative z-10 flex mb-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                            ['Processing', 'Shipped', 'Delivered'].includes(selectedOrder.status) 
                              ? 'bg-primary-500 text-white' 
                              : 'bg-neutral-200 text-neutral-500'
                          }`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">Processing</h4>
                            <p className="text-sm text-neutral-600">
                              {['Processing', 'Shipped', 'Delivered'].includes(selectedOrder.status) 
                                ? 'Order is being processed'
                                : selectedOrder.status === 'Cancelled' 
                                ? 'Order was cancelled'
                                : 'Pending processing'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative z-10 flex mb-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                            ['Shipped', 'Delivered'].includes(selectedOrder.status) 
                              ? 'bg-primary-500 text-white' 
                              : 'bg-neutral-200 text-neutral-500'
                          }`}>
                            <TruckIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">Shipped</h4>
                            <p className="text-sm text-neutral-600">
                              {['Shipped', 'Delivered'].includes(selectedOrder.status) 
                                ? 'Order has been shipped'
                                : 'Waiting to be shipped'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative z-10 flex">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                            selectedOrder.status === 'Delivered' 
                              ? 'bg-primary-500 text-white' 
                              : 'bg-neutral-200 text-neutral-500'
                          }`}>
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">Delivered</h4>
                            <p className="text-sm text-neutral-600">
                              {selectedOrder.status === 'Delivered' 
                                ? 'Order has been delivered'
                                : 'Waiting to be delivered'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-between">
              <div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                  className="select mr-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  className="btn btn-primary"
                  onClick={() => updateOrderStatus(selectedOrder.id, selectedOrder.status)}
                >
                  Update Status
                </button>
              </div>
              <button
                onClick={closeOrderDetails}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;