import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface VehicleModel {
  id: string;
  name: string;
  image: string;
}

// Sample data - in a real app, this would come from the API
const vehicleModelsData: Record<string, VehicleModel[]> = {
  car: [
    { id: 'hyundai', name: 'Hyundai', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy6aFqPTV7uAhd5N6ri5LLhPBe8W2jgygitQ&s' },
    { id: 'toyota', name: 'Toyota', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd5fZ-hyH8TFA1lOB9Ui6A4tfEqnp1PNfdHA&s' },
    { id: 'ford', name: 'Ford', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc-O2Gk4kE_7hkCAT_iPNAJy_jo79ywJED5Q&s' },
    { id: 'maruti', name: 'Maruti Suzuki', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSva4iMzffQOIkR74t4Lg2hwQd6nAV5B-KEpg&s' },
    { id: 'kia', name: 'KIA', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhX_kL3AZBqAG84QPnN8LowEPZYy6KZTkQtA&s' },
    { id: 'mahindra', name: 'Mahindra', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSic2fnLVy8ARLH3IIS29MCrVJxhhJ7HF8rcw&s' },
    { id: 'tata', name: 'Tata', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy7uVny4JTsIUdtWbqTwvXaczQjzzN2xxQRw&s' },
  ],
  bike: [
    { id: 'hero', name: 'Hero', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7jfbQFzMJwrWDG2tujKesAfEWtni6K39kdw&s' },
    { id: 'honda', name: 'Honda', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs-0qBd8bUsAEO0-lXBaA7A6vdvI9JP0F3pQ&s' },
    { id: 'bajaj', name: 'Bajaj', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvh4nFgRmblq5Uv_Nwj6nPxLo7wkcaldL53A&s' },
    { id: 'tvs', name: 'TVS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-WimR428f-D-0tcVgSAFoH9Km1RDU7Gmt8w&s' },
    { id: 'royalenfield', name: 'Royal Enfield', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXueInFor-oBlOnTR3Qb1rMHJsC2u3FOn2VA&s' },
  ],
  scooter: [
    { id: 'honda', name: 'Honda', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScJHb-4cfD8eNlEljpiKZVUmpZqmKqxpTeyw&s' },
    { id: 'tvs', name: 'TVS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR368x-3HzY8SX68xy3XaJR0pFg5eNIOU9BrQ&s'},
    { id: 'suzuki', name: 'Suzuki', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAM_rLQ3XRaDiBWFS3LKKwH2UeY1BE73ExSg&s' },
    { id: 'hero', name: 'Hero', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiNMGymiinPbev_onW47k2gBT7gMWqjd06nQ&s' },
  ],
  bus: [
    { id: 'tata', name: 'Tata', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR45OjxXyUho0p6LHf9mOV2yvGliIRVWY4j3Q&s' },
    { id: 'ashokleyland', name: 'Ashok Leyland', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVHv5MRDdZt9aRxPrRd-Z3cMXlWGF9CklXNQ&s' },
    { id: 'eicher', name: 'Eicher', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSksEbaIPSp-m9tudQoo_RjymrSnBE5_cSpBg&s' },
  ],
  truck: [
    { id: 'tata', name: 'Tata', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAq3s2nHGxu-AwhEPdlSCetGVYZCzadIVamw&s' },
    { id: 'ashokleyland', name: 'Ashok Leyland', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRITMXS5jg9h8oomq4rvcDXYUNKYs5tThJjWA&s' },
    { id: 'eicher', name: 'Eicher', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaNGqDKQYFL-a4BZGmAi0mt2qFejl6cupo_w&s' },
    { id: 'mahindra', name: 'Mahindra', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaw4vZOAJ-mGsbDJX7Ad_qUXKI1zkbxGD0UA&s' },
  ],
  lorry: [
    { id: 'tata', name: 'Tata', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU0eOlvkX2_QP87Gj5kORJF-EXZvNpT1KvKw&s' },
    { id: 'ashokleyland', name: 'Ashok Leyland', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQzKFL-hIw58AZUKESOSMF72_IjQEH6c2ljA&s' },
    { id: 'bharat', name: 'Bharat Benz', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-cEQa5OhKnHEzrlANXjaVZZrAWbbDmR2wcg&s' },
  ],
};

// Vehicle type display names
const vehicleTypeLabels: Record<string, string> = {
  car: 'Car',
  bike: 'Bike',
  scooter: 'Scooter',
  bus: 'Bus',
  truck: 'Truck',
  lorry: 'Lorry',
};

const VehicleModelsPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  
  if (!type || !vehicleModelsData[type]) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">Vehicle Type Not Found</h1>
        <p className="text-neutral-600 mb-8">Sorry, we couldn't find the vehicle type you're looking for.</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }
  
  const vehicleModels = vehicleModelsData[type];
  const vehicleTypeLabel = vehicleTypeLabels[type] || 'Vehicle';

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Select Your {vehicleTypeLabel} Model
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            Choose your {vehicleTypeLabel.toLowerCase()} model to get personalized tyre recommendations tailored to your specific vehicle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {vehicleModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/recommend/${type}/${model.id}`} className="block">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={model.image} 
                      alt={model.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
                    <div className="flex items-center text-primary-500 font-medium group-hover:translate-x-1 transition-transform">
                      Find Tyres
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleModelsPage;