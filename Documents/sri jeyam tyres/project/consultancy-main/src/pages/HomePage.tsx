import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TruckIcon, Car, Bike, Bus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const vehicleCategories = [
  {
    id: 'car',
    name: 'Car',
    icon: <Car className="h-12 w-12 mb-4 text-primary-500" />,
    description: 'Find the perfect tyres for your car, SUV or hatchback',
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'bike',
    name: 'Bike',
    icon: <Bike className="h-12 w-12 mb-4 text-primary-500" />,
    description: 'Performance tyres for motorcycles of all sizes',
    image: 'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'scooter',
    name: 'Scooter',
    icon: <Bike className="h-12 w-12 mb-4 text-primary-500" />, // using Bike icon for Scooter
    description: 'Reliable tyres for everyday scooters',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHrizMTJgMpz8RxSyEORiIumkt-9wqVbVE3A&s',
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: <Bus className="h-12 w-12 mb-4 text-primary-500" />,
    description: 'Heavy-duty tyres for passenger transport vehicles',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyqUBngCzWzmdZohCeGBhFLB1j-MnS74Qqzw&s',
  },
  {
    id: 'truck',
    name: 'Truck',
    icon: <TruckIcon className="h-12 w-12 mb-4 text-primary-500" />,
    description: 'Durable tyres for commercial trucks',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Y_huSqFvqS3ODlwUyH3g6q-SP9yL17uUAw&s'
  },
  {
    id: 'lorry',
    name: 'Lorry',
    icon: <TruckIcon className="h-12 w-12 mb-4 text-primary-500" />, // using Truck icon for Lorry
    description: 'Heavy-load tyres for lorries and transport vehicles',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAq3s2nHGxu-AwhEPdlSCetGVYZCzadIVamw&s',
  },
];


const HomePage: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] bg-gradient-to-r from-secondary-800 to-secondary-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3806252/pexels-photo-3806252.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        
        <div className="container relative h-full flex flex-col justify-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className=" text-white text-5xl md:text-6xl font-bold mb-6">
              Find the Perfect Tyres for Your Journey
            </h1>
            <p className="text-xl mb-8 text-neutral-200">
              Sri Jeyam Tyres brings you premium MRF tyres with personalized recommendations for all vehicle types
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/vehicles/car" className="btn btn-primary px-8 py-4">
                Shop Car Tyres
              </Link>
              <Link to="/vehicles/bike" className="btn btn-outline bg-transparent text-white border-white hover:bg-white hover:text-secondary-800 px-8 py-4">
                Shop Bike Tyres
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vehicle Categories Grid */}
      <section className="py-20 bg-neutral-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Vehicle Type</h2>
            <p className="text-white max-w-2xl mx-auto">
              Find the perfect tyres for your vehicle. Click on your vehicle type to browse our selection of premium tyres.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicleCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/vehicles/${category.id}`} className="block">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <h3 className="text-white text-xl font-bold p-6">{category.name}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-neutral-600 mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-primary-500 font-medium group-hover:translate-x-1 transition-transform">
                        Shop Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    
         

      
    </div>
  );
};

export default HomePage;