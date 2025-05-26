import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
} from 'lucide-react';

// Sample data for dashboard
const dashboardData = {
  totalSales: 45680,
  totalOrders: 124,
  totalProducts: 87,
  totalCustomers: 253,
  recentOrders: [
    { id: 'ORD123456', customer: 'Raj Kumar', date: '2023-04-15', amount: 7500, status: 'Delivered' },
    { id: 'ORD123455', customer: 'Priya Singh', date: '2023-04-14', amount: 4200, status: 'Processing' },
  ],
  popularProducts: [
    { id: 'PROD001', name: 'MRF ZMV', sales: 28, amount: 98000 },
    { id: 'PROD002', name: 'MRF ZVTV', sales: 22, amount: 92400 },
    { id: 'PROD003', name: 'MRF ZVTS', sales: 19, amount: 72200 },
    { id: 'PROD004', name: 'MRF Perfinza', sales: 15, amount: 82500 },
  ],
};

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">Admin Dashboard</h1>
          <p className="text-neutral-600">
            Welcome to the admin dashboard. Manage your store, products, and orders from here.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-neutral-600 text-sm">Total Sales</p>
                <h3 className="text-2xl font-bold">₹{dashboardData.totalSales.toLocaleString()}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">12.5% increase</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-neutral-600 text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalOrders}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center text-blue-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">8.2% increase</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-neutral-600 text-sm">Total Products</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalProducts}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center text-purple-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">5.3% increase</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-neutral-600 text-sm">Total Customers</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalCustomers}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center text-amber-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">15.8% increase</span>
            </div>
          </motion.div>
        </div>
        
        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/tyres" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Manage Tyres</h3>
                <p className="text-neutral-600 text-sm">Add, edit, or remove tyre products</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Manage Orders</h3>
                <p className="text-neutral-600 text-sm">View and process customer orders</p>
              </div>
            </div>
          </Link>
          
          <Link to="#" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Sales Reports</h3>
                <p className="text-neutral-600 text-sm">View detailed sales analytics</p>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        ₹{order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'Shipped' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Popular Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Popular Products</h2>
                <Link to="/admin/tyres" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {dashboardData.popularProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                        {product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {product.sales} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        ₹{product.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;