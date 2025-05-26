import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Filter, X, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

// Sample tyre data
interface Tyre {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  vehicleCompatibility: string[];
  size: string;
  type: string;
  features: string[];
}

// Sample tyre data - in a real app, this would come from the API
const dummyTyres: Tyre[] = [
  {
    id: 'mrf-zmv-1',
    name: 'MRF ZMV',
    brand: 'MRF',
    price: 3500,
    image: 'https://rukminim2.flixcart.com/image/850/1000/l52sivk0/vehicle-tire/d/u/i/1-185-70-r14-88t-tl-zmv-mrf-original-imagfuhxqyhghmuy.jpeg?q=90',
    rating: 4.5,
    vehicleCompatibility: ['hyundai', 'toyota', 'honda'],
    size: '185/65 R15',
    type: 'Tubeless',
    features: ['Excellent wet grip', 'Low noise', 'Fuel efficient'],
  },
  {
    id: 'mrf-zvtv-2',
    name: 'MRF ZVTV',
    brand: 'MRF',
    price: 4200,
    image: 'https://mrf.en.ecplaza.net/v6/s-ec/270-270/16-6162.jpg',
    rating: 4.8,
    vehicleCompatibility: ['hyundai', 'ford', 'toyota'],
    size: '195/55 R16',
    type: 'Tubeless',
    features: ['High durability', 'Superior handling', 'Better stability at high speeds'],
  },
  {
    id: 'mrf-zvts-3',
    name: 'MRF ZVTS',
    brand: 'MRF',
    price: 3800,
    image: 'https://m.media-amazon.com/images/I/61KYw95RBTL._SX466_.jpg',
    rating: 4.3,
    vehicleCompatibility: ['hyundai', 'honda'],
    size: '185/65 R15',
    type: 'Tubeless',
    features: ['All-weather performance', 'Enhanced stability', 'Reduced rolling resistance'],
  },
  {
    id: 'mrf-perfinza-4',
    name: 'MRF Perfinza',
    brand: 'MRF',
    price: 5500,
    image: 'https://storage.sg.content-cdn.io/in-resources/fc93e108-cca4-4dea-87ce-db318920bab2/Images/userimages/20210511-133010-MRF%20Perfinza%20product%20image.png',
    rating: 4.9,
    vehicleCompatibility: ['hyundai', 'ford', 'honda'],
    size: '205/55 R16',
    type: 'Tubeless',
    features: ['Premium performance', 'Exceptional cornering', 'Quiet ride'],
  },
  {
    id: 'mrf-wanderer-5',
    name: 'MRF Wanderer',
    brand: 'MRF',
    price: 4800,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUjWLnAJMqf5tVhC-jw81X2yXdVfE3IaVg80Rbo2iBKmHX_RG6YGXnWbchHUmLFOMJhCA&usqp=CAU',
    rating: 4.7,
    vehicleCompatibility: ['hyundai', 'toyota'],
    size: '215/60 R16',
    type: 'Tubeless',
    features: ['All-terrain capability', 'Enhanced durability', 'Superior traction on wet roads'],
  },
  {
    id: 'mrf-steel-muscle-6',
    name: 'MRF Steel Muscle',
    brand: 'MRF',
    price: 6200,
    image: 'https://m.media-amazon.com/images/I/61vA9ZKvYkL._SL1100_.jpg',
    rating: 4.6,
    vehicleCompatibility: ['hyundai', 'toyota', 'ford'],
    size: '235/45 R17',
    type: 'Tubeless',
    features: ['High performance', 'Excellent high-speed stability', 'Advanced silica compound'],
  },
];

const TyreResultsPage: React.FC = () => {
  const { type, model } = useParams<{ type: string; model: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  const answers = location.state?.answers || {};
  
  // Filter options
  const availableSizes = Array.from(new Set(dummyTyres.map(tyre => tyre.size)));
  const availableTypes = Array.from(new Set(dummyTyres.map(tyre => tyre.type)));
  
  useEffect(() => {
    // Simulate API call to get tyres based on type, model, and answers
    const fetchTyres = async () => {
      setLoading(true);
      try {
        // Start with all tyres
        let filteredTyres = [...dummyTyres];
        
        // If we have answers from recommendations, use those for filtering
        if (Object.keys(answers).length > 0) {
          // Filter by vehicle type if provided
          if (answers.vehicleType) {
            filteredTyres = filteredTyres.filter(tyre => 
              tyre.vehicleCompatibility.some(compat => 
                compat.toLowerCase().includes(answers.vehicleType.toLowerCase())
              )
            );
          }
          
          // Filter by size if provided
          if (answers.size) {
            filteredTyres = filteredTyres.filter(tyre => 
              tyre.size.toLowerCase().includes(answers.size.toLowerCase())
            );
          }
          
          // Filter by type if provided
          if (answers.type) {
            filteredTyres = filteredTyres.filter(tyre => 
              tyre.type.toLowerCase() === answers.type.toLowerCase()
            );
          }
          
          // Filter by price range if provided
          if (answers.priceRange) {
            const [min, max] = answers.priceRange.split('-').map(Number);
            filteredTyres = filteredTyres.filter(tyre => 
              tyre.price >= min && tyre.price <= max
            );
          }
        } 
        // If no answers but we have model from URL, filter by model
        else if (model) {
          filteredTyres = filteredTyres.filter(tyre => 
            tyre.vehicleCompatibility.some(compat => 
              compat.toLowerCase().includes(model.toLowerCase())
            )
          );
        }
        
        // If still no results, show all tyres
        if (filteredTyres.length === 0) {
          filteredTyres = [...dummyTyres];
        }
        
        // Initialize quantities state
        const initialQuantities: Record<string, number> = {};
        filteredTyres.forEach(tyre => {
          initialQuantities[tyre.id] = 1;
        });
        setQuantities(initialQuantities);
        
        setTyres(filteredTyres);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tyres:', error);
        setLoading(false);
      }
    };
    
    fetchTyres();
  }, [type, model, answers]);
  
  const handleQuantityChange = (id: string, amount: number) => {
    setQuantities(prev => {
      const newQuantity = Math.max(1, (prev[id] || 1) + amount);
      return { ...prev, [id]: newQuantity };
    });
  };
  
  const handleAddToCart = async (tyre: Tyre) => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your cart');
      navigate('/login', { state: { from: location } });
      return;
    }
    
    try {
      await addToCart({
        productId: tyre.id,
        name: tyre.name,
        price: tyre.price,
        image: tyre.image,
        quantity: quantities[tyre.id],
        vehicleType: type || '',
        vehicleModel: model || '',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };
  
  const toggleSizeFilter = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };
  
  const toggleTypeFilter = (tyreType: string) => {
    setSelectedTypes(prev => 
      prev.includes(tyreType)
        ? prev.filter(t => t !== tyreType)
        : [...prev, tyreType]
    );
  };
  
  const applyFilters = () => {
    let filtered = dummyTyres.filter(tyre => 
      tyre.vehicleCompatibility.includes(model || '')
    );
    
    // Apply price range filter
    filtered = filtered.filter(tyre => 
      tyre.price >= priceRange[0] && tyre.price <= priceRange[1]
    );
    
    // Apply size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(tyre => selectedSizes.includes(tyre.size));
    }
    
    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(tyre => selectedTypes.includes(tyre.type));
    }
    
    // Update the tyres state with filtered results
    setTyres(filtered);
    
    // Close filter sidebar on mobile
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };
  
  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setSelectedTypes([]);
    
    // Reset to original filtered list based on model and answers
    let filteredTyres = dummyTyres.filter(tyre => 
      tyre.vehicleCompatibility.includes(model || '')
    );
    
    // Reapply initial filters from answers if available
    if (answers.size) {
      filteredTyres = filteredTyres.filter(tyre => tyre.size === answers.size);
    }
    if (answers.type) {
      filteredTyres = filteredTyres.filter(tyre => tyre.type === answers.type);
    }
    if (answers.priceRange) {
      const [min, max] = answers.priceRange.split('-').map(Number);
      filteredTyres = filteredTyres.filter(tyre => tyre.price >= min && tyre.price <= max);
    }
    
    setTyres(filteredTyres);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Recommended Tyres for You
          </h1>
          <p className="text-neutral-600 max-w-3xl">
            Based on your preferences, we've selected the best tyres for your vehicle. 
            Browse our recommendations and choose the perfect fit for your driving needs.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Mobile Toggle */}
          <div className="md:hidden mb-4">
            <button 
              onClick={toggleFilter}
              className="btn btn-outline flex items-center gap-2 w-full"
            >
              <Filter className="h-5 w-5" />
              Filter Options
            </button>
          </div>
          
          {/* Filters Sidebar */}
          <div className={`
            ${isFilterOpen ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'} 
            md:relative md:block md:w-72 md:flex-shrink-0 md:z-auto md:bg-transparent
          `}>
            <div className={`
              h-full w-full max-w-xs bg-white p-6 overflow-y-auto transition-transform duration-300
              ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} 
              md:translate-x-0 md:shadow-md md:rounded-lg
            `}>
              <div className="flex items-center justify-between mb-6 md:mb-4">
                <h3 className="text-xl font-semibold">Filters</h3>
                <button 
                  onClick={toggleFilter}
                  className="md:hidden p-1 rounded-full hover:bg-neutral-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span>₹{priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange[1])}
                    className="w-full accent-primary-500"
                  />
                  <span>₹{priceRange[1]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>₹{priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(priceRange[0], Number(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              
              {/* Tyre Size */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Tyre Size</h4>
                <div className="space-y-2">
                  {availableSizes.map(size => (
                    <label key={size} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleSizeFilter(size)}
                        className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Tyre Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Tyre Type</h4>
                <div className="space-y-2">
                  {availableTypes.map(tyreType => (
                    <label key={tyreType} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(tyreType)}
                        onChange={() => toggleTypeFilter(tyreType)}
                        className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span>{tyreType}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={applyFilters}
                  className="btn btn-primary w-full"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="btn btn-outline w-full"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Tyre Results */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : tyres.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No tyres found</h3>
                <p className="text-neutral-600 mb-6">
                  We couldn't find any tyres matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tyres.map((tyre, index) => (
                  <motion.div
                    key={tyre.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-4 bg-neutral-50">
                      <img
                        src={tyre.image}
                        alt={tyre.name}
                        className="h-44 w-full object-contain mx-auto"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center mb-1">
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                          {tyre.brand}
                        </span>
                        <div className="flex items-center ml-auto">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium ml-1">{tyre.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{tyre.name}</h3>
                      <div className="mb-3">
                        <span className="text-sm text-neutral-600">Size: {tyre.size}</span>
                        <span className="text-sm text-neutral-600 ml-4">Type: {tyre.type}</span>
                      </div>
                      <div className="mb-4">
                        <ul className="text-sm text-neutral-600 space-y-1">
                          {tyre.features.slice(0, 2).map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="h-1 w-1 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-xl font-bold">₹{tyre.price}</span>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(tyre.id, -1)}
                            className="p-1 rounded-full hover:bg-neutral-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 w-8 text-center">{quantities[tyre.id] || 1}</span>
                          <button
                            onClick={() => handleQuantityChange(tyre.id, 1)}
                            className="p-1 rounded-full hover:bg-neutral-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(tyre)}
                        className="btn btn-primary w-full flex items-center justify-center"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TyreResultsPage;