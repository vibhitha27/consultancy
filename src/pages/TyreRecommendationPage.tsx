import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// Vehicle type display names
const vehicleTypeLabels: Record<string, string> = {
  car: 'Car',
  bike: 'Bike',
  scooter: 'Scooter',
  bus: 'Bus',
  truck: 'Truck',
  lorry: 'Lorry',
};

// Sample model names
const modelNames: Record<string, Record<string, string>> = {
  car: {
    hyundai: 'Hyundai',
    toyota: 'Toyota',
    honda: 'Honda',
    ford: 'Ford',
    maruti: 'Maruti Suzuki',
    kia: 'KIA',
    mahindra: 'Mahindra',
    tata: 'Tata',
  },
  bike: {
    hero: 'Hero',
    honda: 'Honda',
    yamaha: 'Yamaha',
    bajaj: 'Bajaj',
    tvs: 'TVS',
    royalenfield: 'Royal Enfield',
  },
  // Add more as needed
};

interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

// Define the questions based on vehicle type
const getQuestions = (type: string): Question[] => {
  const commonQuestions: Question[] = [
    {
      id: 'usage',
      text: 'How do you primarily use your vehicle?',
      options: [
        { value: 'city', label: 'City/Urban Driving' },
        { value: 'highway', label: 'Highway/Long Distance' },
        { value: 'mixed', label: 'Mixed Usage' },
        { value: 'offroad', label: 'Off-Road/Rough Terrain' },
      ],
    },
    {
      id: 'frequency',
      text: 'How frequently do you use your vehicle?',
      options: [
        { value: 'daily', label: 'Daily Commute' },
        { value: 'occasional', label: 'Occasional Use' },
        { value: 'weekend', label: 'Weekend Drives' },
        { value: 'rare', label: 'Rarely Used' },
      ],
    },
    {
      id: 'priority',
      text: 'What\'s your top priority for new tyres?',
      options: [
        { value: 'durability', label: 'Long-lasting Durability' },
        { value: 'performance', label: 'High Performance' },
        { value: 'comfort', label: 'Comfort and Low Noise' },
        { value: 'fuel', label: 'Fuel Efficiency' },
        { value: 'price', label: 'Budget-Friendly' },
      ],
    },
  ];

  // Add vehicle-specific questions
  if (type === 'car') {
    return [
      {
        id: 'size',
        text: 'What size tyres do you need?',
        options: [
          { value: '13', label: '13 inch' },
          { value: '14', label: '14 inch' },
          { value: '15', label: '15 inch' },
          { value: '16', label: '16 inch' },
          { value: '17', label: '17 inch' },
          { value: '18', label: '18 inch or larger' },
        ],
      },
      ...commonQuestions,
      {
        id: 'season',
        text: 'What type of weather conditions do you drive in?',
        options: [
          { value: 'all', label: 'All-Season' },
          { value: 'summer', label: 'Mostly Dry/Summer' },
          { value: 'rainy', label: 'Frequent Rain' },
        ],
      },
    ];
  } else if (type === 'bike' || type === 'scooter') {
    return [
      {
        id: 'size',
        text: 'What size tyres do you need?',
        options: [
          { value: '17', label: '17 inch' },
          { value: '18', label: '18 inch' },
          { value: '19', label: '19 inch' },
          { value: 'other', label: 'Other/Not Sure' },
        ],
      },
      ...commonQuestions,
      {
        id: 'grip',
        text: 'How important is wet grip performance to you?',
        options: [
          { value: 'very', label: 'Very Important' },
          { value: 'somewhat', label: 'Somewhat Important' },
          { value: 'not', label: 'Not a Priority' },
        ],
      },
    ];
  } else {
    // Commercial vehicles (truck, bus, lorry)
    return [
      {
        id: 'load',
        text: 'What is your typical load capacity?',
        options: [
          { value: 'light', label: 'Light Loads' },
          { value: 'medium', label: 'Medium Loads' },
          { value: 'heavy', label: 'Heavy Loads' },
          { value: 'varying', label: 'Varying Loads' },
        ],
      },
      ...commonQuestions,
      {
        id: 'terrain',
        text: 'What type of terrain do you typically drive on?',
        options: [
          { value: 'paved', label: 'Mostly Paved Roads' },
          { value: 'mixed', label: 'Mixed Surfaces' },
          { value: 'rough', label: 'Rough/Unpaved Roads' },
          { value: 'construction', label: 'Construction Sites' },
        ],
      },
    ];
  }
};

const TyreRecommendationPage: React.FC = () => {
  const { type, model } = useParams<{ type: string; model: string }>();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  if (!type || !model) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">Information Not Found</h1>
        <p className="text-neutral-600 mb-8">Sorry, we couldn't find the information you're looking for.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Return to Home
        </button>
      </div>
    );
  }
  
  const questions = getQuestions(type);
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  const vehicleTypeLabel = vehicleTypeLabels[type] || 'Vehicle';
  const modelName = modelNames[type]?.[model] || model;
  
  const handleOptionSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, navigate to results
      navigate(`/tyres/${type}/${model}`, { state: { answers } });
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <div className="min-h-screen pt-32 pb-20 bg-neutral-50">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-neutral-800 mb-3">
              Get Tyre Recommendations for Your {vehicleTypeLabel}
            </h1>
            <p className="text-neutral-600">
              Answer a few questions about your {modelName} to get personalized tyre recommendations.
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2 mb-8">
            <motion.div 
              className="bg-primary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
          
          <div className="mb-2 flex justify-between text-sm text-neutral-500">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          
          {/* Question */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-6">{currentQuestion.text}</h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-primary-500 hover:bg-primary-50 ${
                    answers[currentQuestion.id] === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            {currentQuestionIndex > 0 ? (
              <button 
                onClick={handlePrevQuestion}
                className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Question
              </button>
            ) : (
              <div></div> // Empty div to maintain spacing with flex justify-between
            )}
            
            {currentQuestionIndex === totalQuestions - 1 && (
              <button
                onClick={() => navigate(`/tyres/${type}/${model}`, { state: { answers } })}
                className="flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                View Recommendations
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TyreRecommendationPage;