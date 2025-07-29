import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentsAPI } from '../services/api';
import { CreditCard, CheckCircle, Star, Crown, Zap } from 'lucide-react';

const Payment = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 100,
      features: [
        'Up to 100 photos',
        'Basic album creation',
        'Guest uploads',
        'Email support'
      ],
      icon: Star,
      color: 'text-blue-500'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 500,
      features: [
        'Unlimited photos & videos',
        'Advanced album features',
        'Priority guest uploads',
        'Custom themes',
        'Priority support'
      ],
      icon: Crown,
      color: 'text-purple-500'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 1000,
      features: [
        'Everything in Premium',
        'Custom domain',
        'Advanced analytics',
        'Dedicated support',
        'White-label options'
      ],
      icon: Zap,
      color: 'text-orange-500'
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setError('');
  };

  const handlePayment = async () => {
    if (!selectedPlan || !user) return;

    setLoading(true);
    setError('');

    try {
      const response = await paymentsAPI.upgradePlan(selectedPlan.id, user.id);
      
      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'Wedding Memories',
        description: `${selectedPlan.name} Plan Upgrade`,
        order_id: response.data.order_id,
        handler: async (response) => {
          try {
            await paymentsAPI.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            alert('Payment successful! Your plan has been upgraded.');
            // Redirect to albums or dashboard
            window.location.href = '/albums';
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone_number
        },
        theme: {
          color: '#ec4899'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create payment order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
        <p className="text-gray-600">You need to be logged in to upgrade your plan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 text-lg">
          Upgrade your wedding memories experience with our premium plans
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <div
              key={plan.id}
              className={`card cursor-pointer transition-all duration-200 ${
                selectedPlan?.id === plan.id
                  ? 'ring-2 ring-pink-500 shadow-lg'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              <div className="text-center mb-6">
                <IconComponent className={`h-12 w-12 mx-auto mb-4 ${plan.color}`} />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-pink-500 mb-2">
                  ₹{plan.price}
                </div>
                <p className="text-gray-600">One-time payment</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelect(plan);
                }}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  selectedPlan?.id === plan.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Button */}
      {selectedPlan && (
        <div className="text-center">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Pay ₹{selectedPlan.price} for {selectedPlan.name} Plan</span>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment; 