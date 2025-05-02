import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Tyre interface
interface Tyre {
  _id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  stock: number;
  vehicleType: string;
  vehicleModel: string;
  size: string;
  type: string;
  features: string[];
  diameter: string;
  loadIndex: string;
  speedRating: string;
  treadPattern: string;
  season: string;
  createdAt: string;
}

// Form interface for adding/editing tyres
interface TyreFormData {
  name: string;
  brand: string;
  price: number;
  image: string;
  stock: number;
  vehicleType: string;
  vehicleModel: string;
  size: string;
  type: string;
  features: string[];
  diameter: string;
  loadIndex: string;
  speedRating: string;
  treadPattern: string;
  season: string;
}

// Add these constants before the AdminTyresPage component
const BRAND_OPTIONS = [
  'MRF', 'CEAT', 'Apollo', 'Bridgestone', 'Michelin', 'Goodyear', 
  'JK Tyre', 'Tata', 'TVS', 'Ralco', 'Maxxis', 'Pirelli'
];

// Add type safety to VEHICLE_MODELS
type VehicleType = 'car' | 'bike' | 'scooter' | 'bus' | 'truck' | 'lorry';

const VEHICLE_MODELS: Record<VehicleType, string[]> = {
  car: ['Hyundai', 'Toyota', 'Honda', 'Maruti', 'Tata', 'Mahindra', 'Kia', 'Volkswagen', 'Skoda', 'Renault'],
  bike: ['Bajaj', 'Hero', 'Honda', 'TVS', 'Royal Enfield', 'Yamaha', 'KTM', 'Suzuki'],
  scooter: ['Honda', 'TVS', 'Bajaj', 'Suzuki', 'Hero', 'Yamaha'],
  bus: ['Tata', 'Ashok Leyland', 'Bharat Benz', 'Eicher'],
  truck: ['Tata', 'Ashok Leyland', 'Bharat Benz', 'Eicher', 'Mahindra'],
  lorry: ['Tata', 'Ashok Leyland', 'Bharat Benz', 'Eicher']
};

const TYRE_FEATURES = [
  'Excellent Wet Grip',
  'Low Noise',
  'Fuel Efficient',
  'Long Lasting',
  'High Speed Stability',
  'Comfort Ride',
  'All Season',
  'Run Flat',
  'Puncture Resistant',
  'Enhanced Braking',
  'Better Cornering',
  'Reduced Rolling Resistance',
  'Improved Handling',
  'Better Traction',
  'Heat Resistant'
];

const DIAMETER_OPTIONS = [
  '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'
];

const LOAD_INDEX = [
  '65', '70', '75', '80', '85', '90', '95', '100', '105', '110', '115', '120'
];

const SPEED_RATINGS = [
  'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'H', 'V', 'W', 'Y'
];

const TREAD_PATTERNS = [
  'Symmetrical',
  'Asymmetrical',
  'Directional',
  'All Terrain',
  'Mud Terrain',
  'Highway',
  'Performance'
];

const SEASON_TYPES = [
  'All Season',
  'Summer',
  'Winter',
  'Rain'
];

const AdminTyresPage: React.FC = () => {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTyre, setCurrentTyre] = useState<Tyre | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  
  const itemsPerPage = 5;
  
  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch
  } = useForm<TyreFormData>();

  // Fetch tyres from the API
  const fetchTyres = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tyres', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTyres(response.data);
    } catch (error) {
      console.error('Error fetching tyres:', error);
      toast.error('Failed to fetch tyres. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTyres();
  }, [token]);
  
  // Filter and search tyres
  const filteredTyres = tyres.filter(tyre => {
    const matchesSearch = tyre.name.toLowerCase().includes(search.toLowerCase()) ||
                           tyre.brand.toLowerCase().includes(search.toLowerCase()) ||
                           tyre._id.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || tyre.vehicleType === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredTyres.length / itemsPerPage);
  const paginatedTyres = filteredTyres.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const openAddModal = () => {
    reset({
      name: '',
      brand: 'MRF',
      price: 0,
      image: '',
      stock: 0,
      vehicleType: 'car',
      vehicleModel: '',
      size: '',
      type: 'Tubeless',
      features: [],
      diameter: '',
      loadIndex: '',
      speedRating: '',
      treadPattern: '',
      season: '',
    });
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (tyre: Tyre) => {
    setCurrentTyre(tyre);
    setValue('name', tyre.name);
    setValue('brand', tyre.brand);
    setValue('price', tyre.price);
    setValue('image', tyre.image);
    setValue('stock', tyre.stock);
    setValue('vehicleType', tyre.vehicleType);
    setValue('vehicleModel', tyre.vehicleModel);
    setValue('size', tyre.size);
    setValue('type', tyre.type);
    setValue('features', tyre.features);
    setValue('diameter', tyre.diameter);
    setValue('loadIndex', tyre.loadIndex);
    setValue('speedRating', tyre.speedRating);
    setValue('treadPattern', tyre.treadPattern);
    setValue('season', tyre.season);
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (tyre: Tyre) => {
    setCurrentTyre(tyre);
    setIsDeleteModalOpen(true);
  };
  
  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentTyre(null);
  };
  
  const handleAddTyre = async (data: TyreFormData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tyres', {
        ...data,
        features: data.features
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setTyres([...tyres, response.data]);
      toast.success('Tyre added successfully!');
      closeAllModals();
    } catch (error) {
      console.error('Error adding tyre:', error);
      toast.error('Failed to add tyre. Please try again.');
    }
  };
  
  const handleEditTyre = async (data: TyreFormData) => {
    if (!currentTyre) return;
    
    try {
      const response = await axios.put(`http://localhost:5000/api/tyres/${currentTyre._id}`, {
        ...data,
        features: data.features
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const updatedTyres = tyres.map(tyre => 
        tyre._id === currentTyre._id ? response.data : tyre
      );
      
      setTyres(updatedTyres);
      toast.success('Tyre updated successfully!');
      closeAllModals();
    } catch (error) {
      console.error('Error updating tyre:', error);
      toast.error('Failed to update tyre. Please try again.');
    }
  };
  
  const handleDeleteTyre = async () => {
    if (!currentTyre) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/tyres/${currentTyre._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const updatedTyres = tyres.filter(tyre => tyre._id !== currentTyre._id);
      setTyres(updatedTyres);
      toast.success('Tyre deleted successfully!');
      closeAllModals();
    } catch (error) {
      console.error('Error deleting tyre:', error);
      toast.error('Failed to delete tyre. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Manage Tyres</h1>
            <p className="text-neutral-600">
              Add, edit, or remove tyre products from your inventory.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="mt-4 md:mt-0 btn btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Tyre
          </button>
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
                  placeholder="Search tyres..."
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
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="select pl-10"
                >
                  <option value="all">All Types</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="bus">Bus</option>
                  <option value="truck">Truck</option>
                  <option value="lorry">Lorry</option>
                </select>
              </div>
            </div>
            
            <div className="text-neutral-600">
              Showing {paginatedTyres.length} of {filteredTyres.length} tyres
            </div>
          </div>
        </div>
        
        {/* Tyres Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {paginatedTyres.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No tyres found. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  paginatedTyres.map((tyre) => (
                    <tr key={tyre._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-neutral-100 rounded flex-shrink-0 mr-4">
                            <img
                              src={tyre.image}
                              alt={tyre.name}
                              className="h-12 w-12 object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-neutral-800">{tyre.name}</div>
                            <div className="text-sm text-neutral-500">{tyre.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600">
                          <div>Size: {tyre.size}</div>
                          <div>Type: {tyre.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-800">₹{tyre.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tyre.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : tyre.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tyre.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-600 capitalize">
                          {tyre.vehicleType} - {tyre.vehicleModel}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => openEditModal(tyre)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(tyre)}
                          className="text-red-600 hover:text-red-800 p-1 ml-3"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-sm text-neutral-600">
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
      </div>
      
      {/* Add Tyre Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Add New Tyre</h2>
                <button
                  onClick={closeAllModals}
                  className="p-1 rounded-full hover:bg-neutral-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(handleAddTyre)}>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Tyre Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="MRF ZMV"
                      {...register('name', { required: 'Tyre name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-neutral-700 mb-1">
                      Brand *
                    </label>
                    <select
                      id="brand"
                      className={`select ${errors.brand ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('brand', { required: 'Brand is required' })}
                    >
                      <option value="">Select Brand</option>
                      {BRAND_OPTIONS.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                    {errors.brand && (
                      <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      id="price"
                      type="number"
                      className={`input ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="3500"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price must be a positive number' },
                      })}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      id="stock"
                      type="number"
                      className={`input ${errors.stock ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="25"
                      {...register('stock', { 
                        required: 'Stock quantity is required',
                        min: { value: 0, message: 'Stock must be a positive number' },
                      })}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-neutral-700 mb-1">
                    Image URL *
                  </label>
                  <div className="flex">
                    <input
                      id="image"
                      type="text"
                      className={`input rounded-r-none ${errors.image ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="https://example.com/image.jpg"
                      {...register('image', { required: 'Image URL is required' })}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-lg"
                    >
                      <Upload className="h-5 w-5 text-neutral-600" />
                    </button>
                  </div>
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-neutral-700 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      id="vehicleType"
                      className={`select ${errors.vehicleType ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('vehicleType', { required: 'Vehicle type is required' })}
                    >
                      <option value="">Select Vehicle Type</option>
                      {Object.keys(VEHICLE_MODELS).map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                    {errors.vehicleType && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="vehicleModel" className="block text-sm font-medium text-neutral-700 mb-1">
                      Vehicle Model *
                    </label>
                    <select
                      id="vehicleModel"
                      className={`select ${errors.vehicleModel ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('vehicleModel', { required: 'Vehicle model is required' })}
                    >
                      <option value="">Select Vehicle Model</option>
                      {watch('vehicleType') && VEHICLE_MODELS[watch('vehicleType') as VehicleType]?.map((model: string) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                    {errors.vehicleModel && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleModel.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-neutral-700 mb-1">
                      Tyre Size *
                    </label>
                    <input
                      id="size"
                      type="text"
                      className={`input ${errors.size ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="185/65 R15"
                      {...register('size', { required: 'Tyre size is required' })}
                    />
                    {errors.size && (
                      <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="diameter" className="block text-sm font-medium text-neutral-700 mb-1">
                      Diameter *
                    </label>
                    <select
                      id="diameter"
                      className={`select ${errors.diameter ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('diameter', { required: 'Diameter is required' })}
                    >
                      <option value="">Select Diameter</option>
                      {DIAMETER_OPTIONS.map(diameter => (
                        <option key={diameter} value={diameter}>{diameter}</option>
                      ))}
                    </select>
                    {errors.diameter && (
                      <p className="mt-1 text-sm text-red-600">{errors.diameter.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="loadIndex" className="block text-sm font-medium text-neutral-700 mb-1">
                      Load Index *
                    </label>
                    <select
                      id="loadIndex"
                      className={`select ${errors.loadIndex ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('loadIndex', { required: 'Load index is required' })}
                    >
                      <option value="">Select Load Index</option>
                      {LOAD_INDEX.map(index => (
                        <option key={index} value={index}>{index}</option>
                      ))}
                    </select>
                    {errors.loadIndex && (
                      <p className="mt-1 text-sm text-red-600">{errors.loadIndex.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="speedRating" className="block text-sm font-medium text-neutral-700 mb-1">
                      Speed Rating *
                    </label>
                    <select
                      id="speedRating"
                      className={`select ${errors.speedRating ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('speedRating', { required: 'Speed rating is required' })}
                    >
                      <option value="">Select Speed Rating</option>
                      {SPEED_RATINGS.map(rating => (
                        <option key={rating} value={rating}>{rating}</option>
                      ))}
                    </select>
                    {errors.speedRating && (
                      <p className="mt-1 text-sm text-red-600">{errors.speedRating.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="treadPattern" className="block text-sm font-medium text-neutral-700 mb-1">
                      Tread Pattern *
                    </label>
                    <select
                      id="treadPattern"
                      className={`select ${errors.treadPattern ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('treadPattern', { required: 'Tread pattern is required' })}
                    >
                      <option value="">Select Tread Pattern</option>
                      {TREAD_PATTERNS.map(pattern => (
                        <option key={pattern} value={pattern}>{pattern}</option>
                      ))}
                    </select>
                    {errors.treadPattern && (
                      <p className="mt-1 text-sm text-red-600">{errors.treadPattern.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="season" className="block text-sm font-medium text-neutral-700 mb-1">
                      Season Type *
                    </label>
                    <select
                      id="season"
                      className={`select ${errors.season ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('season', { required: 'Season type is required' })}
                    >
                      <option value="">Select Season Type</option>
                      {SEASON_TYPES.map(season => (
                        <option key={season} value={season}>{season}</option>
                      ))}
                    </select>
                    {errors.season && (
                      <p className="mt-1 text-sm text-red-600">{errors.season.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Features *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {TYRE_FEATURES.map(feature => (
                      <label key={feature} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={feature}
                          {...register('features', { required: 'At least one feature is required' })}
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                  {errors.features && (
                    <p className="mt-1 text-sm text-red-600">{errors.features.message}</p>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex items-center"
                >
                  {isSubmitting ? 'Adding...' : 'Add Tyre'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Edit Tyre Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Tyre</h2>
                <button
                  onClick={closeAllModals}
                  className="p-1 rounded-full hover:bg-neutral-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(handleEditTyre)}>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Tyre Name *
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('name', { required: 'Tyre name is required' })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-brand" className="block text-sm font-medium text-neutral-700 mb-1">
                      Brand *
                    </label>
                    <select
                      id="edit-brand"
                      className={`select ${errors.brand ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('brand', { required: 'Brand is required' })}
                    >
                      <option value="">Select Brand</option>
                      {BRAND_OPTIONS.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                    {errors.brand && (
                      <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-price" className="block text-sm font-medium text-neutral-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      id="edit-price"
                      type="number"
                      className={`input ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price must be a positive number' },
                      })}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-stock" className="block text-sm font-medium text-neutral-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      id="edit-stock"
                      type="number"
                      className={`input ${errors.stock ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('stock', { 
                        required: 'Stock quantity is required',
                        min: { value: 0, message: 'Stock must be a positive number' },
                      })}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-image" className="block text-sm font-medium text-neutral-700 mb-1">
                    Image URL *
                  </label>
                  <div className="flex">
                    <input
                      id="edit-image"
                      type="text"
                      className={`input rounded-r-none ${errors.image ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('image', { required: 'Image URL is required' })}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-lg"
                    >
                      <Upload className="h-5 w-5 text-neutral-600" />
                    </button>
                  </div>
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-vehicleType" className="block text-sm font-medium text-neutral-700 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      id="edit-vehicleType"
                      className={`select ${errors.vehicleType ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('vehicleType', { required: 'Vehicle type is required' })}
                    >
                      <option value="">Select Vehicle Type</option>
                      {Object.keys(VEHICLE_MODELS).map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                    {errors.vehicleType && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-vehicleModel" className="block text-sm font-medium text-neutral-700 mb-1">
                      Vehicle Model *
                    </label>
                    <select
                      id="edit-vehicleModel"
                      className={`select ${errors.vehicleModel ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('vehicleModel', { required: 'Vehicle model is required' })}
                    >
                      <option value="">Select Vehicle Model</option>
                      {watch('vehicleType') && VEHICLE_MODELS[watch('vehicleType') as VehicleType]?.map((model: string) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                    {errors.vehicleModel && (
                      <p className="mt-1 text-sm text-red-600">{errors.vehicleModel.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-size" className="block text-sm font-medium text-neutral-700 mb-1">
                      Tyre Size *
                    </label>
                    <input
                      id="edit-size"
                      type="text"
                      className={`input ${errors.size ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('size', { required: 'Tyre size is required' })}
                    />
                    {errors.size && (
                      <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-diameter" className="block text-sm font-medium text-neutral-700 mb-1">
                      Diameter *
                    </label>
                    <select
                      id="edit-diameter"
                      className={`select ${errors.diameter ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('diameter', { required: 'Diameter is required' })}
                    >
                      <option value="">Select Diameter</option>
                      {DIAMETER_OPTIONS.map(diameter => (
                        <option key={diameter} value={diameter}>{diameter}</option>
                      ))}
                    </select>
                    {errors.diameter && (
                      <p className="mt-1 text-sm text-red-600">{errors.diameter.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-loadIndex" className="block text-sm font-medium text-neutral-700 mb-1">
                      Load Index *
                    </label>
                    <select
                      id="edit-loadIndex"
                      className={`select ${errors.loadIndex ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('loadIndex', { required: 'Load index is required' })}
                    >
                      <option value="">Select Load Index</option>
                      {LOAD_INDEX.map(index => (
                        <option key={index} value={index}>{index}</option>
                      ))}
                    </select>
                    {errors.loadIndex && (
                      <p className="mt-1 text-sm text-red-600">{errors.loadIndex.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-speedRating" className="block text-sm font-medium text-neutral-700 mb-1">
                      Speed Rating *
                    </label>
                    <select
                      id="edit-speedRating"
                      className={`select ${errors.speedRating ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('speedRating', { required: 'Speed rating is required' })}
                    >
                      <option value="">Select Speed Rating</option>
                      {SPEED_RATINGS.map(rating => (
                        <option key={rating} value={rating}>{rating}</option>
                      ))}
                    </select>
                    {errors.speedRating && (
                      <p className="mt-1 text-sm text-red-600">{errors.speedRating.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="edit-treadPattern" className="block text-sm font-medium text-neutral-700 mb-1">
                      Tread Pattern *
                    </label>
                    <select
                      id="edit-treadPattern"
                      className={`select ${errors.treadPattern ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('treadPattern', { required: 'Tread pattern is required' })}
                    >
                      <option value="">Select Tread Pattern</option>
                      {TREAD_PATTERNS.map(pattern => (
                        <option key={pattern} value={pattern}>{pattern}</option>
                      ))}
                    </select>
                    {errors.treadPattern && (
                      <p className="mt-1 text-sm text-red-600">{errors.treadPattern.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-season" className="block text-sm font-medium text-neutral-700 mb-1">
                      Season Type *
                    </label>
                    <select
                      id="edit-season"
                      className={`select ${errors.season ? 'border-red-500 focus:ring-red-500' : ''}`}
                      {...register('season', { required: 'Season type is required' })}
                    >
                      <option value="">Select Season Type</option>
                      {SEASON_TYPES.map(season => (
                        <option key={season} value={season}>{season}</option>
                      ))}
                    </select>
                    {errors.season && (
                      <p className="mt-1 text-sm text-red-600">{errors.season.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Features *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {TYRE_FEATURES.map(feature => (
                      <label key={feature} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={feature}
                          {...register('features', { required: 'At least one feature is required' })}
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                  {errors.features && (
                    <p className="mt-1 text-sm text-red-600">{errors.features.message}</p>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex items-center"
                >
                  {isSubmitting ? 'Saving...' : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentTyre && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-4 text-center">
                Delete {currentTyre.name}?
              </h3>
              <p className="text-neutral-600 mb-6 text-center">
                Are you sure you want to delete this tyre? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteTyre}
                  className="btn bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminTyresPage;