import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Filter, X, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

interface Tyre {
  _id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating: number;
  vehicleCompatibility: string[];
  size: string;
  type: string;
  features: string[];
  stockQuantity?: number;
  isVisible?: boolean;
  supplier?: string;
}

interface AdminTyreFilterCriteria {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  size?: string;
  minStock?: number;
  isVisible?: boolean;
  featureKeyword?: string;
}

const filterTyresForAdmin = (
  allTyres: Tyre[],
  criteria: AdminTyreFilterCriteria
): Tyre[] => {
  let filteredTyres = [...allTyres];

  if (criteria.brand) {
    filteredTyres = filteredTyres.filter(tyre =>
      tyre.brand.toLowerCase().includes(criteria.brand!.toLowerCase())
    );
  }

  if (typeof criteria.minPrice === 'number') {
    filteredTyres = filteredTyres.filter(tyre => tyre.price >= criteria.minPrice!);
  }

  if (typeof criteria.maxPrice === 'number') {
    filteredTyres = filteredTyres.filter(tyre => tyre.price <= criteria.maxPrice!);
  }

  if (criteria.type) {
    filteredTyres = filteredTyres.filter(tyre =>
      tyre.type.toLowerCase() === criteria.type!.toLowerCase()
    );
  }

  if (criteria.size) {
    filteredTyres = filteredTyres.filter(tyre =>
      tyre.size.toLowerCase().includes(criteria.size!.toLowerCase())
    );
  }

  if (typeof criteria.minStock === 'number' && criteria.minStock > 0) {
    filteredTyres = filteredTyres.filter(tyre => 
      tyre.stockQuantity !== undefined && tyre.stockQuantity >= criteria.minStock!
    );
  }
  
  if (typeof criteria.isVisible === 'boolean') {
    filteredTyres = filteredTyres.filter(tyre => tyre.isVisible === criteria.isVisible);
  }

  if (criteria.featureKeyword) {
    const keyword = criteria.featureKeyword.toLowerCase();
    filteredTyres = filteredTyres.filter(tyre =>
      tyre.features.some(feature => feature.toLowerCase().includes(keyword))
    );
  }

  return filteredTyres;
};

const TyreResultsPage: React.FC = () => {
  const { type, model } = useParams<{ type: string; model: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [allTyres, setAllTyres] = useState<Tyre[]>([]);
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [maxPossiblePrice, setMaxPossiblePrice] = useState(10000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const answers = location.state?.answers || {};

  const getInitiallyFilteredTyres = (
    baseTyres: Tyre[],
    currentModel: string | undefined,
    currentAnswers: any
  ): Tyre[] => {
    let filtered = [...baseTyres];
    if (Object.keys(currentAnswers).length > 0) {
      if (currentAnswers.vehicleType) {
        filtered = filtered.filter(tyre =>
          tyre.vehicleCompatibility.some(compat =>
            compat.toLowerCase().includes(currentAnswers.vehicleType.toLowerCase())
          )
        );
      }
      if (currentAnswers.size) {
        filtered = filtered.filter(tyre =>
          tyre.size.toLowerCase().includes(currentAnswers.size.toLowerCase())
        );
      }
      if (currentAnswers.type) {
        filtered = filtered.filter(tyre =>
          tyre.type.toLowerCase() === currentAnswers.type.toLowerCase()
        );
      }
      if (currentAnswers.priceRange) {
        const [min, max] = currentAnswers.priceRange.split('-').map(Number);
        filtered = filtered.filter(tyre =>
          tyre.price >= min && tyre.price <= max
        );
      }
    } else if (currentModel) {
      filtered = filtered.filter(tyre =>
        tyre.vehicleCompatibility.some(compat =>
          compat.toLowerCase().includes(currentModel.toLowerCase())
        )
      );
    }
    return filtered;
  };

  useEffect(() => {
    const fetchAndFilterTyres = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await fetch('http://localhost:5000/api/tyres');
        if (!response.ok) {
          throw new Error(`Failed to fetch tyres. Status: ${response.status}`);
        }
        const data: Tyre[] = await response.json();
        setAllTyres(data);

        if (data.length > 0) {
          const calculatedMaxPrice = Math.max(...data.map(t => t.price), 1000);
          setMaxPossiblePrice(calculatedMaxPrice);
          setPriceRange([0, calculatedMaxPrice]);
        } else {
          setMaxPossiblePrice(10000);
          setPriceRange([0, 10000]);
        }

        const initiallyFiltered = getInitiallyFilteredTyres(data, model, answers);
        setTyres(initiallyFiltered);

        const initialQuantities: Record<string, number> = {};
        initiallyFiltered.forEach(tyre => {
          initialQuantities[tyre._id] = 1;
        });
        setQuantities(initialQuantities);

      } catch (error) {
        console.error('Error fetching tyres:', error);
        setFetchError(error instanceof Error ? error.message : 'An unknown error occurred');
        setAllTyres([]);
        setTyres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterTyres();
  }, [type, model, location.state]);

  const availableSizes = useMemo(() =>
    Array.from(new Set(allTyres.map(tyre => tyre.size))).sort(),
    [allTyres]
  );
  const availableTypes = useMemo(() =>
    Array.from(new Set(allTyres.map(tyre => tyre.type))).sort(),
    [allTyres]
  );

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
        productId: tyre._id,
        name: tyre.name,
        price: tyre.price,
        image: tyre.image,
        quantity: quantities[tyre._id],
        vehicleType: type || '',
        vehicleModel: model || '',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart.');
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePriceRangeChange = (minOrMaxChanged: 'min' | 'max', value: number) => {
    setPriceRange(prev => {
      if (minOrMaxChanged === 'min') {
        return [Math.min(value, prev[1]), prev[1]];
      } else {
        return [prev[0], Math.max(value, prev[0])];
      }
    });
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
    let filtered = getInitiallyFilteredTyres(allTyres, model, answers);

    filtered = filtered.filter(tyre =>
      tyre.price >= priceRange[0] && tyre.price <= priceRange[1]
    );

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(tyre => selectedSizes.includes(tyre.size));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(tyre => selectedTypes.includes(tyre.type));
    }

    setTyres(filtered);

    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const resetFilters = () => {
    setPriceRange([0, maxPossiblePrice]);
    setSelectedSizes([]);
    setSelectedTypes([]);

    const initialTyres = getInitiallyFilteredTyres(allTyres, model, answers);
    setTyres(initialTyres);

    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen pt-32 pb-20 container text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Tyres</h2>
        <p className="text-neutral-700 mb-4">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
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
          <div className="md:hidden mb-4">
            <button
              onClick={toggleFilter}
              className="btn btn-outline flex items-center gap-2 w-full justify-center"
            >
              <Filter className="h-5 w-5" />
              Filter Options
            </button>
          </div>

          <div className={`
            ${isFilterOpen ? 'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300' : 'hidden'} 
            md:relative md:block md:w-72 md:flex-shrink-0 md:z-auto md:bg-transparent md:opacity-100
          `}>
            <div className={`
              h-full w-full max-w-xs bg-white p-6 overflow-y-auto shadow-xl transition-transform duration-300
              ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} 
              md:translate-x-0 md:shadow-md md:rounded-lg md:relative
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

              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="flex justify-between text-sm text-neutral-600 mb-1">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPossiblePrice}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                  className="w-full accent-primary-500 mb-2 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max={maxPossiblePrice}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                  className="w-full accent-primary-500 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {availableSizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Tyre Size</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableSizes.map(size => (
                      <label key={size} className="flex items-center gap-2 cursor-pointer">
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
              )}

              {availableTypes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Tyre Type</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableTypes.map(tyreType => (
                      <label key={tyreType} className="flex items-center gap-2 cursor-pointer">
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
              )}

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

          <div className="flex-grow">
            {tyres.length === 0 && !loading && !fetchError ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">No tyres found</h3>
                <p className="text-neutral-600 mb-6">
                  We couldn't find any tyres matching your current filters or criteria. Try adjusting your filters or check back later.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn btn-primary"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tyres.map((tyre, index) => (
                  <motion.div
                    key={tyre._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                  >
                    <div className="p-4 bg-neutral-50 aspect-square flex items-center justify-center">
                      <img
                        src={tyre.image || 'https://via.placeholder.com/150?text=No+Image'}
                        alt={tyre.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')}
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center mb-1">
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                          {tyre.brand}
                        </span>
                        {tyre.rating > 0 && (
                          <div className="flex items-center ml-auto">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium ml-1">{tyre.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-neutral-800 hover:text-primary-600 transition-colors">
                        {tyre.name}
                      </h3>
                      <div className="mb-3 text-sm text-neutral-600">
                        <p>Size: {tyre.size}</p>
                        <p>Type: {tyre.type}</p>
                      </div>
                      {tyre.features && tyre.features.length > 0 && (
                        <div className="mb-4">
                          <ul className="text-xs text-neutral-500 space-y-1">
                            {tyre.features.slice(0, 2).map((feature, i) => (
                              <li key={i} className="flex items-start">
                                <span className="h-1 w-1 rounded-full bg-primary-500 mt-1.5 mr-2 flex-shrink-0"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xl font-bold text-neutral-800">₹{tyre.price.toLocaleString()}</span>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(tyre._id, -1)}
                              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 disabled:opacity-50"
                              disabled={(quantities[tyre._id] || 1) <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 w-8 text-center font-medium">{quantities[tyre._id] || 1}</span>
                            <button
                              onClick={() => handleQuantityChange(tyre._id, 1)}
                              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600"
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