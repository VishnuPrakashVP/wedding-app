import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Camera, Users, Share2, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="h-16 w-16 text-pink-500 animate-pulse" />
              <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Capture Your Wedding Memories
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create beautiful albums, share precious moments, and preserve your special day forever. 
            Let friends and family contribute to your wedding memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/albums" className="btn-primary text-lg px-8 py-4">
              Browse Albums
            </Link>
            <Link to="/register" className="btn-secondary text-lg px-8 py-4">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Wedding Memories?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Camera className="h-12 w-12 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Easy Photo Sharing</h3>
              <p className="text-gray-600">
                Upload and organize your wedding photos with ease. Create beautiful albums that tell your story.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Guest Contributions</h3>
              <p className="text-gray-600">
                Let your guests upload their photos and videos. Everyone can contribute to your special memories.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Share2 className="h-12 w-12 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Private & Secure</h3>
              <p className="text-gray-600">
                Keep your memories safe and private. Share only with the people you choose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-xl mb-8 opacity-90">
          Create your first album and start collecting memories from your special day.
        </p>
        <Link to="/albums" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Create Your Album
        </Link>
      </section>
    </div>
  );
};

export default Home; 