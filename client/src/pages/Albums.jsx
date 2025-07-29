import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Heart, Calendar, Users, Plus } from 'lucide-react';
import { albumsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Albums = () => {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await albumsAPI.getAll();
      setAlbums(response.data);
    } catch (err) {
      setError('Failed to load albums');
      console.error('Error fetching albums:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
        <button onClick={fetchAlbums} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Wedding Albums</h1>
        <p className="text-gray-600 text-lg">
          Browse through beautiful wedding memories and celebrations
        </p>
        
        {user && (
          <div className="mt-6">
            <Link
              to="/albums/create"
              className="inline-flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Album</span>
            </Link>
          </div>
        )}
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-20">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Albums Yet</h3>
          <p className="text-gray-500 mb-6">Be the first to create a beautiful wedding album!</p>
          {user ? (
            <Link to="/albums/create" className="btn-primary">
              Create Your Album
            </Link>
          ) : (
            <Link to="/login" className="btn-primary">
              Login to Create Album
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <Link
              key={album._id}
              to={`/albums/${album._id}`}
              className="card hover:scale-105 transition-transform duration-200"
            >
              <div className="relative mb-4">
                {album.cover_photo ? (
                  <img
                    src={album.cover_photo}
                    alt={album.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">{album.title}</h3>
                <p className="text-gray-600">{album.theme || 'Beautiful Wedding'}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(album.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Albums; 